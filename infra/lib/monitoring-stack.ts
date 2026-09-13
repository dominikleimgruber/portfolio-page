import * as cdk from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as actions from "aws-cdk-lib/aws-cloudwatch-actions";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import { Construct } from "constructs";

/**
 * Baseline traffic is ~0.5 requests/minute (≈2 per 5-minute window), almost
 * all of it automated scanning. 5,000 per 5 minutes is ~16 req/s — roughly
 * 2,000x normal, so it can't fire by accident, yet still sits inside
 * CloudFront's free tier if sustained. It's a tripwire, not a cost line.
 */
const REQUESTS_PER_5MIN_THRESHOLD = 5_000;

export interface MonitoringStackProps extends cdk.StackProps {
  readonly distributionId: string;
  readonly alertEmail: string;
}

/**
 * Must live in us-east-1: CloudFront publishes its metrics only to that
 * region, and a CloudWatch alarm can only reference metrics in its own
 * region. Separate from GlobalStack because it consumes PortfolioStack's
 * distribution — wiring it into GlobalStack would be circular, since
 * PortfolioStack already depends on GlobalStack's certificate.
 */
export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: MonitoringStackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, "AlertTopic", {
      displayName: "leimgruber.dev alerts",
    });
    topic.addSubscription(new subscriptions.EmailSubscription(props.alertEmail));

    const requests = new cloudwatch.Metric({
      namespace: "AWS/CloudFront",
      metricName: "Requests",
      dimensionsMap: {
        DistributionId: props.distributionId,
        Region: "Global",
      },
      statistic: "Sum",
      period: cdk.Duration.minutes(5),
    });

    const alarm = new cloudwatch.Alarm(this, "RequestSpikeAlarm", {
      metric: requests,
      threshold: REQUESTS_PER_5MIN_THRESHOLD,
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      alarmDescription:
        "CloudFront request spike — catches a traffic/cost anomaly in minutes, " +
        "where the monthly budget alert only reacts once billing data catches up (~24h).",
      // CloudFront publishes no datapoints when there's no traffic; absence
      // of data means a quiet site, not a problem.
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    alarm.addAlarmAction(new actions.SnsAction(topic));

    new cdk.CfnOutput(this, "AlertTopicArn", {
      description: "SNS topic the request-spike alarm publishes to",
      value: topic.topicArn,
    });
  }
}
