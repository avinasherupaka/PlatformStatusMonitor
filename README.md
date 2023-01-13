---
title: "Set up the development environment"
group: "Internals"
type: "doc"
---

## This page describes how to set up the development environment. Also, the project structure is explained as it is helpful to understand the codebase.

## Changing environments for deploying releases
 When changing which environment to deploy LambStatus to, ensure you are changing the `~/.aws/*` files so that the `[default]` section points to the desired environment (see https://github.com/aws/aws-sdk-js/issues/1955 for more details) or use aws-sso. 


* [Set up the development environment](#set-up)
* [Project structure](#project-structure)

### Set up

#### Prerequisite

* Node.js (v8.10.0)
* AWS CLI
* [apex](http://apex.run/) for lambda deployment

#### Create a CloudFormation stack

1. Clone the repository and go to the cloned directory

`git clone https://github.com/ks888/LambStatus && cd LambStatus`

2. Install all dependencies

`npm run install`

3. Add a '.env' file at the root of this repo based on `.env-example`. At least, you need to write your email address to the 'USER_EMAIL' line because the initial login information will be sent to the address.

4. Launch CloudFormation stack

`npm run cloudformation:create`

It may take 20 to 40 minutes for the full deployment to complete.

Wait until you receive an email from your new LambStatus instance. 

If the command returns an error, make sure you properly configured [the AWS credentials](http://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html#cli-quick-configuration).

Now the process to create the stack is ongoing. When the stack is created, the email will be sent to the email address.

5. After the initial CloudFormation reports the deployment is complete, ensure that LambStatus was deployed and run to deploy custom changes: 

```
npm run build
npm run deploy

```

#### Change AWS resources created by CloudFormation

1. Make your change.

2. Update the CloudFormation stack

`npm run cloudformation:update`

#### Setting up custom domain name.

1. Create SSL certificates using AWS Certificate manager. Once you decide on the base domain, request certificate for status and admin page.

```
Ex:
Domains: 
status.<app-name>.agro.services -> for staus page
*.status.<app-name>.agro.services -> for admin page other wildcard usecases
```

- Note: If you pick DNS validation, be sure to add the CNAME to your Hosted zone so the validation of cert passes.

2. Then you need to add A records of the cloudfront distribution url's generated upon stack creation.
[AWS DOCS](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html#alternate-domain-names-requirements)

3. The this point you will have the SSL cert ARN, status and admin page custom domain names.

4. Not you need to update these values in the `.env` 
```
STATUSPAGE_SSL_CERTIFICATE=
STATUSPAGE_URL=
ADMINPAGE_SSL_CERTIFICATE=
ADMINPAGE_URL=
```
and run `npm run cloudformation:update`

This will update your cloudfront distribution by associating custom domain and cert.

- Note: This process will take 20-40 mins.

#### Change server-side code

1. Go to the 'lambda' directory

`cd packages/lambda`

2. Make sure the tests pass

`npm run test`

3. Make your change. Add tests for your change. Make the tests pass

4. (If necessary, deploy your functions)

`npm run build`
`npm run deploy`

Note: LambStatus depends on [apex](http://apex.run/) to deploy lambda functions. [Please install it](http://apex.run/#installation) if the `apex` command is not found.

#### Change client-side code

1. Go to the 'frontend' directory

`cd packages/frontend`

2. Make sure the tests pass

`npm run test`

3. Make your change. Add tests for your change. Make the tests pass

4. Run the local server

`npm run start         # Run the admin page server at localhost:3000`

`npm run start:status  # Run the status page server at localhost:3002`

### Project Structure

These 3 directories under the repository are especially important for this system:

* `./cloudformation`: the CloudFormation template. It describes all the AWS resources including Lambda, API Gateway, DynamoDB, etc.
* `./packages/lambda`: server-side code. All the server-side code runs as the Lambda Functions.
* `./packages/frontend`: client-side code. These are deployed to the S3 and served via CloudFront.

Here is the contents of each directory:

```
.
├── cloudformation
|   ├── bin                    --- the scripts to create the CloudFormation stack
|   └── lamb-status.yml        --- the CloudFormation template file
└── packages
    ├── lambda
    |   ├── bin                --- the scripts to build and deploy the lambda functions
    |   ├── config             --- the webpack config file to build the codes
    |   ├── src
    |   |   ├── api            --- the entrypoints of Lambda functions. Handles the event from the API Gateway
    |   |   ├── aws            --- the classes to access AWS resources
    |   |   ├── db             --- the classes to access the database
    |   |   ├── model          --- the models
    |   |   └── utils          --- the utilities
    |   ├── test               --- tests. Same structure as ./src
    |   └── package.json       --- package.json file for lambda functions
    └── frontend
        ├── bin                --- the scripts to build and deploy the frontend
        ├── build              --- the webpack config file to build the codes
        ├── config             --- the environment-dependent config files
        ├── src
        |   ├── actions        --- Redux actions
        |   ├── components     --- React components
        |   ├── reducers       --- Redux reducers
        |   ├── utils          --- the utilities
        |   ├── admin-page.js  --- the entrypoint of the admin page
        |   └── status-page.js --- the entrypoint of the status page
        ├── test               --- tests. Same structure as ./src
        └── package.json       --- package.json file for frontend
```

### Secure Status Page

Under WAF, create a new web ACL.

 - Name: LambStatusACL
 - Metric name: LambStatusACL
 - AWS resource to associate: Pick one of the LambStatus CloudWatch resources. (You will need to add the other resource after the wizard.)

Click next.

Click on "Create condition" for "IP match conditions". 

- Note: Please reach out avinash.reddy.erupaka@monsanto.com for IP CIDR's

Click create.

Click next.

In the Rules dropdown, select "AllowedIPs". Click "Add rule to web ACL". Select "Allow".

For the second block, select "Block all requests that don't match any rules".

Click review and create. Then create after reviewing.

In CloudFront and for each CloudFront LambStatus resource, confirm AllowedIPs is attached under "AWS WAF Web ACL" in the summary of each CloudFront resource. If not, then make the change on by clicking the "Edit" button on the summary page.


## Demo of AVI Status Page for reference

* [Status page](https://status.AVI.agro.services/): the page to tell our service's status to your users

## Goals of this project

* Offers an open source and serverless status page system.
* Offers a pay-as-you-go pricing approach like AWS. We estimate the system takes just *$1 to handle 30,000 visitors* ([see details](https://lambstatus.github.io/cost-estimate)).
* Enables you to build and maintain the status page system with minimum effort.

## Why Serverless?

Status page system is great with the Serverless architecture, because:

* It eases your pain caused by the scaling / availability issues. It is terrible if your service is down AND heavy traffic from stuck users stops your status page.
* It enables you to pay only for what you use. A status page only occasionally gets huge traffic. The system takes only *$1 per *30,000 visitors and almost *$0 if no visitors.
