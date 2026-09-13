S3_BUCKET_NAME ?= leimgruber.dev
AWS_REGION ?= eu-central-2
AWS_ACCOUNT_ID ?= 255572710732
BUDGET_ALERT_EMAIL ?=
CLOUDFRONT_DISTRIBUTION_ID ?=

.PHONY: install dev build preview deploy clean \
	infra-install infra-synth infra-diff infra-deploy infra-destroy

## --- App ---

## Install app dependencies
install:
	npm install

## Run the Vite dev server locally
dev:
	npm run dev

## Type-check and build the static site into dist/ (plain HTML/CSS/JS)
build:
	npm run build

## Build and serve the production bundle locally
preview: build
	npm run preview

## Build, sync dist/ to S3, and invalidate the CloudFront cache.
## Pass CLOUDFRONT_DISTRIBUTION_ID to invalidate; without it the sync still
## runs but visitors keep seeing the cached version until the TTL expires.
deploy: build
	aws s3 sync dist/ "s3://$(S3_BUCKET_NAME)" --delete --region $(AWS_REGION)
	@if [ -n "$(CLOUDFRONT_DISTRIBUTION_ID)" ]; then \
		echo "Invalidating CloudFront cache..."; \
		aws cloudfront create-invalidation \
			--distribution-id "$(CLOUDFRONT_DISTRIBUTION_ID)" \
			--paths "/*"; \
	else \
		echo "CLOUDFRONT_DISTRIBUTION_ID not set - skipping cache invalidation."; \
	fi

## Remove local app build artifacts and dependencies
clean:
	rm -rf dist node_modules

## --- Infra (CDK: ACM cert + budget in us-east-1, CloudFront + S3 in eu-central-2) ---
## All targets below require BUDGET_ALERT_EMAIL (e.g.
## `make infra-deploy BUDGET_ALERT_EMAIL=you@example.com`) and AWS
## credentials for the account active in your shell.

INFRA_ENV := CDK_DEPLOY_ACCOUNT=$(AWS_ACCOUNT_ID) BUDGET_ALERT_EMAIL=$(BUDGET_ALERT_EMAIL)

## Install infra dependencies
infra-install:
	cd infra && npm install

## Preview the CloudFormation template
infra-synth:
	cd infra && $(INFRA_ENV) npm run synth

## Show what would change against the deployed stack
infra-diff:
	cd infra && $(INFRA_ENV) npm run diff

## Deploy/update both stacks (cert, budget, CloudFront, S3 bucket)
infra-deploy:
	cd infra && $(INFRA_ENV) npm run deploy

## Tear down both stacks (careful: deletes the bucket and its contents)
infra-destroy:
	cd infra && $(INFRA_ENV) npm run destroy
