# Infra

CDK app that deploys the AWS resources the portfolio site runs on:
Route 53 hosted zone for `leimgruber.dev`, an ACM certificate, a CloudFront
distribution, and the private S3 bucket it serves from.

Pinned to **us-east-1** (see `bin/infra.ts`) — not a choice, CloudFront only
accepts certificates issued in that region.

## One-time setup (manual — see repo root README for the full checklist)

1. Register the GitHub OIDC provider in IAM, if this account doesn't have
   one yet.
2. `cdk bootstrap aws://<ACCOUNT_ID>/us-east-1` using your own AWS
   credentials.
3. Create the `infra-deploy` and `app-deploy` IAM roles GitHub Actions
   assumes via OIDC (policies documented in the root README).
4. Run the first `cdk deploy` yourself (locally, with your own
   credentials) — CI can't deploy the role it needs before that role
   exists.
5. Copy the `NameServers` output to your registrar's NS records for
   `leimgruber.dev`.

After that, pushes to `main` that touch `infra/**` deploy automatically via
`.github/workflows/infra-deploy.yml`.

## Commands

From the repo root: `make infra-synth`, `make infra-diff`,
`make infra-deploy`, `make infra-destroy` — all take
`AWS_ACCOUNT_ID=<id>` and expect AWS credentials for that account active
in your shell.

Or directly in this directory: `npm run synth`, `npm run diff`,
`npm run deploy`, `npm run destroy` (with `CDK_DEPLOY_ACCOUNT` exported).

## Outputs

- `NameServers` — set these at your registrar.
- `SiteBucketName` — the app repo's `S3_BUCKET_NAME` GitHub Actions variable.
- `DistributionId` — the app repo's `CLOUDFRONT_DISTRIBUTION_ID` variable.
- `SiteUrl` — `https://leimgruber.dev`.
