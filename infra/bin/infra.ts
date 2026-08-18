#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { PortfolioStack } from "../lib/portfolio-stack";

const app = new cdk.App();

new PortfolioStack(app, "PortfolioStack", {
  env: {
    // Set explicitly by the deploying workflow (see .github/workflows) —
    // deliberately not left to implicit resolution from whatever AWS
    // profile/credentials happen to be active.
    account: process.env.CDK_DEPLOY_ACCOUNT,
    // CloudFront certificates only exist in us-east-1; the whole stack is
    // pinned here rather than made configurable, since it's not a choice.
    region: "us-east-1",
  },
});
