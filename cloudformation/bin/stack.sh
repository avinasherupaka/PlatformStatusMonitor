#!/bin/bash

set -e

. $(dirname $0)/../../.env

create_stack() {
  put_stack create-stack
}

update_stack() {
  put_stack update-stack
}

put_stack() {
  ACTION=$1

  if [ "${CF_TEMPLATE_BUCKET}" != "" -a "${CF_TEMPLATE_KEY}" != "" ]; then
    TEMPLATE_FILE="$(dirname $0)/../lamb-status.yml"
    CF_TEMPLATE_S3_URI="s3://${CF_TEMPLATE_BUCKET}/${CF_TEMPLATE_KEY}"
    aws s3api create-bucket --bucket ${CF_TEMPLATE_BUCKET} --region ${AWS_REGION}
    aws s3 cp "${TEMPLATE_FILE}" "${CF_TEMPLATE_S3_URI}"
    echo "Using disk version."
    CF_TEMPLATE_URL="https://${CF_TEMPLATE_BUCKET}.s3.amazonaws.com/${CF_TEMPLATE_KEY}"
  else
    PACKAGE_JSON="$(dirname $0)/../../package.json"
    VERSION=$(cat "${PACKAGE_JSON}" | sed -n 's/.*\"version\": \"\(.*\)\".*/\1/p')
    CF_TEMPLATE_URL="https://s3-ap-northeast-1.amazonaws.com/lambstatus/cf-template/${VERSION}/lamb-status.yml"
    echo "Using cloud version."
  fi

  aws cloudformation ${ACTION} \
      --region ${AWS_REGION} \
      --stack-name ${STACK_NAME} \
      --template-url ${CF_TEMPLATE_URL} \
      --capabilities CAPABILITY_NAMED_IAM \
      --parameters \
        ParameterKey=UserName,ParameterValue=${USER_NAME},UsePreviousValue=false \
        ParameterKey=UserEmail,ParameterValue=${USER_EMAIL},UsePreviousValue=false \
        ParameterKey=StatusPageSSLCertificate,ParameterValue=${STATUSPAGE_SSL_CERTIFICATE},UsePreviousValue=false \
        ParameterKey=StatusPageURL,ParameterValue=${STATUSPAGE_URL},UsePreviousValue=false \
        ParameterKey=AdminPageSSLCertificate,ParameterValue=${ADMINPAGE_SSL_CERTIFICATE},UsePreviousValue=false \
        ParameterKey=AdminPageURL,ParameterValue=${ADMINPAGE_URL},UsePreviousValue=false \
      --tags ${TAGS} \
      --notification-arns ${NOTIFY_ARN}
}

delete_stack() {
  aws cloudformation delete-stack \
      --region $AWS_REGION \
      --stack-name $STACK_NAME
}

if [ "$1" = "create" ]; then
  create_stack
elif [ "$1" = "update" ]; then
  update_stack
elif [ "$1" = "delete" ]; then
  delete_stack
else
  echo "Usage: $0 [create|update|delete]"
  exit 1
fi
