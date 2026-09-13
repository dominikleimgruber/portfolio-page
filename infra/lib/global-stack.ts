import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as budgets from "aws-cdk-lib/aws-budgets";
import { Construct } from "constructs";

const MONTHLY_BUDGET_USD = 5;

export interface GlobalStackProps extends cdk.StackProps {
  readonly domainName: string;
  /** Address budget-threshold alerts are sent to. Not committed as a
   * literal — passed in via env var so a personal email never lands in
   * this (public) repo's source. */
  readonly budgetAlertEmail: string;
}

/**
 * Holds resources that CloudFormation only supports deploying via
 * us-east-1, regardless of where the rest of the infra lives (eu-central-2,
 * see PortfolioStack):
 *
 * - The ACM certificate: CloudFront only accepts certs issued in us-east-1.
 * - AWS Budgets: `AWS::Budgets::Budget` isn't a valid CloudFormation
 *   resource type outside us-east-1 at all.
 *
 * Neither of these is a regional *preference* — this stack's region isn't
 * configurable the way PortfolioStack's is.
 */
export class GlobalStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: GlobalStackProps) {
    super(scope, id, props);

    // DNS for this domain lives in Cloudflare, not Route 53, so there's no
    // hosted zone here to auto-write the validation record into. The first
    // deploy will block on this resource until you manually add the CNAME
    // ACM asks for in Cloudflare — see infra/README.md.
    this.certificate = new acm.Certificate(this, "Certificate", {
      domainName: props.domainName,
      validation: acm.CertificateValidation.fromDns(),
    });

    // --- Cost tripwire ---
    // Doesn't prevent a spend spike (e.g. a DDoS driving up CloudFront
    // request/transfer costs), just makes sure you hear about it within
    // hours instead of on next month's bill.
    new budgets.CfnBudget(this, "MonthlyCostBudget", {
      budget: {
        budgetType: "COST",
        timeUnit: "MONTHLY",
        budgetLimit: { amount: MONTHLY_BUDGET_USD, unit: "USD" },
      },
      notificationsWithSubscribers: [
        {
          notification: {
            notificationType: "ACTUAL",
            comparisonOperator: "GREATER_THAN",
            threshold: 80,
            thresholdType: "PERCENTAGE",
          },
          subscribers: [{ subscriptionType: "EMAIL", address: props.budgetAlertEmail }],
        },
        {
          notification: {
            notificationType: "ACTUAL",
            comparisonOperator: "GREATER_THAN",
            threshold: 100,
            thresholdType: "PERCENTAGE",
          },
          subscribers: [{ subscriptionType: "EMAIL", address: props.budgetAlertEmail }],
        },
      ],
    });
  }
}
