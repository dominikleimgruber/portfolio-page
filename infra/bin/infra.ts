#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { GlobalStack } from "../lib/global-stack";
import { PortfolioStack } from "../lib/portfolio-stack";

const budgetAlertEmail = process.env.BUDGET_ALERT_EMAIL;
if (!budgetAlertEmail) {
  throw new Error(
    "BUDGET_ALERT_EMAIL must be set to the address budget alerts should go to.",
  );
}

// Explicit, not inferred from whatever the runner's credentials resolve to
// — this is the one place the target AWS account is defined.
const account = process.env.CDK_DEPLOY_ACCOUNT;
const DOMAIN_NAME = "leimgruber.dev";

const app = new cdk.App();

// us-east-1 isn't a choice here — see GlobalStack's own comment for why.
const globalStack = new GlobalStack(app, "GlobalStack", {
  env: { account, region: "us-east-1" },
  domainName: DOMAIN_NAME,
  budgetAlertEmail,
  crossRegionReferences: true,
});

// eu-central-2 (Zurich) is a choice, for data residency, and needs
// `cdk bootstrap` run there too (in addition to us-east-1 for GlobalStack).
new PortfolioStack(app, "PortfolioStack", {
  env: { account, region: "eu-central-2" },
  crossRegionReferences: true,
  certificate: globalStack.certificate,
});
