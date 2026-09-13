#!/usr/bin/env bash
# One-time setup: creates the two IAM roles GitHub Actions assumes via
# OIDC (github-actions-infra-deploy, github-actions-app-deploy).
#
# Prerequisites:
#   - The GitHub OIDC provider already registered in IAM
#     (token.actions.githubusercontent.com).
#   - AWS credentials for account 255572710732 active in this shell
#     (e.g. `assume <profile>` if you're using granted.dev).
#
# Safe to re-run: creates roles if missing, and always re-applies the trust
# and permission policies so fixes to either take effect on re-run.

set -euo pipefail

ACCOUNT_ID="255572710732"
BUCKET_NAME="leimgruber.dev"

# This repo has GitHub's immutable subject claims enabled, so the token's
# `sub` embeds the numeric owner and repo IDs rather than their names:
#   repo:<owner>@<owner_id>/<repo>@<repo_id>:ref:refs/heads/main
# That's deliberate — it survives renames, and a released username can't be
# re-registered by someone else to impersonate this repo. Verify with:
#   gh api /repos/dominikleimgruber/portfolio-page/actions/oidc/customization/sub
GITHUB_REPO="dominikleimgruber/portfolio-page"
GITHUB_SUB_PREFIX="repo:dominikleimgruber@56133959/portfolio-page@1338808976"

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

echo "Verifying AWS credentials..."
CALLER_ACCOUNT="$(aws sts get-caller-identity --query Account --output text)"
if [[ "$CALLER_ACCOUNT" != "$ACCOUNT_ID" ]]; then
  echo "Error: active credentials are for account $CALLER_ACCOUNT, expected $ACCOUNT_ID." >&2
  exit 1
fi

cat > "$TMP_DIR/trust-policy.json" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::${ACCOUNT_ID}:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "${GITHUB_SUB_PREFIX}:ref:refs/heads/main"
        }
      }
    }
  ]
}
EOF

upsert_role() {
  local role_name="$1"
  if aws iam get-role --role-name "$role_name" >/dev/null 2>&1; then
    echo "Role $role_name exists - updating trust policy..."
    aws iam update-assume-role-policy \
      --role-name "$role_name" \
      --policy-document "file://$TMP_DIR/trust-policy.json"
  else
    echo "Creating role $role_name..."
    aws iam create-role \
      --role-name "$role_name" \
      --assume-role-policy-document "file://$TMP_DIR/trust-policy.json" \
      --description "GitHub Actions OIDC role for ${GITHUB_REPO} (${role_name})" \
      >/dev/null
  fi
}

# --- infra-deploy: only allowed to assume the CDK bootstrap roles ---
upsert_role "github-actions-infra-deploy"

cat > "$TMP_DIR/infra-deploy-policy.json" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AssumeCdkBootstrapRoles",
      "Effect": "Allow",
      "Action": "sts:AssumeRole",
      "Resource": "arn:aws:iam::${ACCOUNT_ID}:role/cdk-hnb659fds-*"
    }
  ]
}
EOF

echo "Attaching policy to github-actions-infra-deploy..."
aws iam put-role-policy \
  --role-name github-actions-infra-deploy \
  --policy-name cdk-deploy \
  --policy-document "file://$TMP_DIR/infra-deploy-policy.json"

# --- app-deploy: S3 sync + CloudFront invalidation ---
upsert_role "github-actions-app-deploy"

cat > "$TMP_DIR/app-deploy-policy.json" <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListBucket",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}"
    },
    {
      "Sid": "ObjectAccess",
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:GetObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
    },
    {
      "Sid": "InvalidateCache",
      "Effect": "Allow",
      "Action": "cloudfront:CreateInvalidation",
      "Resource": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/*"
    }
  ]
}
EOF

echo "Attaching policy to github-actions-app-deploy..."
aws iam put-role-policy \
  --role-name github-actions-app-deploy \
  --policy-name s3-cloudfront-deploy \
  --policy-document "file://$TMP_DIR/app-deploy-policy.json"

echo "Done."
echo "  arn:aws:iam::${ACCOUNT_ID}:role/github-actions-infra-deploy"
echo "  arn:aws:iam::${ACCOUNT_ID}:role/github-actions-app-deploy"
