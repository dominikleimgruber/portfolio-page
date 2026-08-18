S3_BUCKET_NAME ?=
AWS_REGION ?=
AWS_ACCOUNT_ID ?=

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

## Build and sync dist/ to the S3 bucket (requires S3_BUCKET_NAME, AWS credentials)
deploy: build
	aws s3 sync dist/ "s3://$(S3_BUCKET_NAME)" --delete --region $(AWS_REGION)

## Remove local app build artifacts and dependencies
clean:
	rm -rf dist node_modules

## --- Infra (CDK: hosted zone, CloudFront, S3 bucket) ---
## All targets below require AWS_ACCOUNT_ID (the account to deploy into,
## e.g. `make infra-deploy AWS_ACCOUNT_ID=123456789012`) and AWS credentials
## for that account active in your shell.

## Install infra dependencies
infra-install:
	cd infra && npm install

## Preview the CloudFormation template
infra-synth:
	cd infra && CDK_DEPLOY_ACCOUNT=$(AWS_ACCOUNT_ID) npm run synth

## Show what would change against the deployed stack
infra-diff:
	cd infra && CDK_DEPLOY_ACCOUNT=$(AWS_ACCOUNT_ID) npm run diff

## Deploy/update the stack (hosted zone, cert, CloudFront, S3 bucket)
infra-deploy:
	cd infra && CDK_DEPLOY_ACCOUNT=$(AWS_ACCOUNT_ID) npm run deploy

## Tear down the stack (careful: deletes the hosted zone and bucket)
infra-destroy:
	cd infra && CDK_DEPLOY_ACCOUNT=$(AWS_ACCOUNT_ID) npm run destroy
