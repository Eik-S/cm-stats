# Craawlers for cardmarket price lists

This crawler runs once a day to save the daily cardmarket price list

## Infrastructure

runs on AWS using the following infrastructure:

- [EventBridge Rule](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-rule-schedule.html) running on a schedule
- Lambda Function running the crawler
- S3 Bucket to persist the crawled price lists

## TODO as needed

- using a VPC located database if requesting data from S3 gets too slow or expensive
  - e.g. DynamoDB
- data transformation to fit regular frontend requests
