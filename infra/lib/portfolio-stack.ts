import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

const DOMAIN_NAME = "leimgruber.dev";

export interface PortfolioStackProps extends cdk.StackProps {
  /** Created in GlobalStack (us-east-1) — CloudFront requires that region
   * regardless of where this stack itself deploys. */
  readonly certificate: acm.ICertificate;
}

export class PortfolioStack extends cdk.Stack {
  /** Consumed by MonitoringStack (us-east-1), where CloudFront's metrics live. */
  public readonly distributionId: string;

  constructor(scope: Construct, id: string, props: PortfolioStackProps) {
    super(scope, id, props);

    // --- Site bucket ---
    // Private: CloudFront reads via Origin Access Control, nothing else
    // can reach it directly. Named explicitly (rather than CDK's default
    // auto-generated name) so the app-deploy IAM role can be scoped to a
    // known ARN before this has ever been deployed.
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: DOMAIN_NAME,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // --- CDN ---
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      domainNames: [DOMAIN_NAME],
      certificate: props.certificate,
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      // This is a single-page site (anchor navigation only, no client-side
      // router), so these aren't required for routing — they just mean a
      // stray/typo'd path renders the page instead of a bare S3 403/404.
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: "/index.html" },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: "/index.html" },
      ],
    });

    this.distributionId = distribution.distributionId;

    new cdk.CfnOutput(this, "DistributionDomainName", {
      description:
        "Point a CNAME for leimgruber.dev at this in Cloudflare (apex CNAME flattening handles the root domain)",
      value: distribution.distributionDomainName,
    });
    new cdk.CfnOutput(this, "SiteBucketName", {
      description: "S3_BUCKET_NAME value for the app's deploy workflow",
      value: siteBucket.bucketName,
    });
    new cdk.CfnOutput(this, "DistributionId", {
      description: "CloudFront distribution ID, needed to invalidate the cache after deploys",
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${DOMAIN_NAME}`,
    });
  }
}
