# Infra

CDK app that deploys the AWS resources the portfolio site runs on, as two
stacks in two different regions (see `bin/infra.ts`):

- **`GlobalStack`** (us-east-1, not a choice) — the ACM certificate and the
  $5/month cost budget. Both `AWS::CertificateManager::Certificate` for
  CloudFront and `AWS::Budgets::Budget` only work via us-east-1 in
  CloudFormation, regardless of where anything else lives.
- **`PortfolioStack`** (eu-central-2, a choice — data residency) — the
  private S3 bucket (fixed name: `leimgruber.dev`) and the CloudFront
  distribution serving it, using the certificate from `GlobalStack` via a
  cross-region reference.

DNS for `leimgruber.dev` lives in **Cloudflare**, not Route 53 — there's no
hosted zone in either stack. You manage the records there directly.

## One-time setup (manual — see repo root README for the full checklist)

1. Register the GitHub OIDC provider in IAM, if this account doesn't have
   one yet.
2. **Bootstrap CDK in both regions** — every stack's region needs its own
   bootstrap:
   ```bash
   npx cdk bootstrap aws://255572710732/us-east-1
   npx cdk bootstrap aws://255572710732/eu-central-2
   ```
3. Create the `github-actions-infra-deploy` and `github-actions-app-deploy`
   IAM roles GitHub Actions assumes via OIDC (policies documented in the
   root README).
4. Run `cdk deploy --all` yourself (locally, with your own credentials) —
   CI can't deploy the role it needs before that role exists.
   - This **will pause** on the `Certificate` resource: CloudFormation
     blocks until ACM's DNS validation succeeds, and since Cloudflare (not
     Route 53) is authoritative here, nothing creates that validation
     record automatically. While the deploy is stuck:
     - Open the ACM console (us-east-1) → find the pending certificate for
       `leimgruber.dev` → copy the CNAME name + value it's asking for.
     - Add that as a CNAME record in Cloudflare.
     - Wait — ACM polls periodically (usually a few minutes); the deploy
       resumes and finishes on its own once it validates.
   - **Leave that CNAME in Cloudflare permanently** — ACM re-checks it for
     auto-renewal indefinitely. Removing it later breaks renewal silently.
   - `GlobalStack` deploys first (`PortfolioStack` depends on its
     certificate output) — this ordering is automatic.
5. Once the deploy finishes, take the `DistributionDomainName` output and
   add it as a CNAME in Cloudflare for `leimgruber.dev` (apex CNAME
   flattening — Cloudflare handles a CNAME-like record at the zone root
   even though that's not normally allowed in DNS).

After that, pushes to `main` that touch `infra/**` deploy both stacks
automatically via `.github/workflows/infra-deploy.yml`.

## Commands

From the repo root: `make infra-synth`, `make infra-diff`,
`make infra-deploy`, `make infra-destroy` — all take
`BUDGET_ALERT_EMAIL=<address>` (account defaults to `255572710732`), and
expect AWS credentials for that account active in your shell.

Or directly in this directory: `npm run synth`, `npm run diff`,
`npm run deploy`, `npm run destroy` (with `CDK_DEPLOY_ACCOUNT` and
`BUDGET_ALERT_EMAIL` exported). `deploy`/`destroy` run with `--all` since
there are now two stacks — plain `cdk deploy`/`cdk destroy` with no stack
name errors out asking which one you meant.

`BUDGET_ALERT_EMAIL` is never hardcoded in source — this repo is public,
and an email address doesn't belong in it. Locally it's an env var you
export yourself; in CI it's `secrets.BUDGET_ALERT_EMAIL` (a GitHub
*secret*, not a repo variable — variables are world-readable on a public
repo, secrets aren't).

## Outputs (PortfolioStack)

- `DistributionDomainName` — the `*.cloudfront.net` hostname to point
  Cloudflare's CNAME at.
- `SiteBucketName` — always `leimgruber.dev` (fixed, not generated).
- `DistributionId` — the app repo's `CLOUDFRONT_DISTRIBUTION_ID` GitHub
  Actions variable, needed for cache invalidation after deploys.
- `SiteUrl` — `https://leimgruber.dev`.
