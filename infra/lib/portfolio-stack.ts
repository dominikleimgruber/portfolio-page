import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as targets from "aws-cdk-lib/aws-route53-targets";
import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

const DOMAIN_NAME = "leimgruber.dev";

export class PortfolioStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- DNS ---
    // After this deploys, copy the NameServers output to your registrar's
    // NS records for leimgruber.dev.
    const hostedZone = new route53.HostedZone(this, "HostedZone", {
      zoneName: DOMAIN_NAME,
    });

    // --- TLS certificate for CloudFront ---
    // CloudFront only accepts certificates from us-east-1, regardless of
    // which region the rest of the stack deploys to — this stack is pinned
    // to us-east-1 in bin/infra.ts specifically for this reason.
    const certificate = new acm.Certificate(this, "Certificate", {
      domainName: DOMAIN_NAME,
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    // --- Site bucket ---
    // Private: CloudFront reads via Origin Access Control, nothing else
    // can reach it directly.
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // --- CDN ---
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      domainNames: [DOMAIN_NAME],
      certificate,
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

    // --- DNS: alias the apex record to the CloudFront distribution ---
    new route53.ARecord(this, "SiteAliasRecord", {
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    new cdk.CfnOutput(this, "NameServers", {
      description: "Set these as the NS records for leimgruber.dev at your registrar",
      value: cdk.Fn.join(", ", hostedZone.hostedZoneNameServers!),
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
