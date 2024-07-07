locals {
  lambda_cm_crawler_package_path = "../../dist/cm-crawler.zip"
}

resource "aws_lambda_function" "cm_crawler" {
  description                    = "crawls cardmarket pricelists daily and saves them to s3"
  function_name                  = "cm-stats-crawler"
  role                           = aws_iam_role.cm_crawler.arn
  runtime                        = "nodejs20.x"
  timeout                        = 60
  memory_size                    = 128
  reserved_concurrent_executions = 1
  handler = "index.handler"
  filename                       = local.lambda_cm_crawler_package_path
  source_code_hash               = filebase64sha256(local.lambda_cm_crawler_package_path)
  environment {
    variables = {
      NODE_ENV = "production"
      PRICELISTS_BUCKET_NAME = aws_s3_bucket.cm_pricelists.bucket
    }
  }
}

resource "aws_iam_role" "cm_crawler" {
  name = "cm-crawler-assume-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cm_crawler_basic_exec" {
  role       = aws_iam_role.cm_crawler.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "cm_crawler" {
  name        = "cm-crawler-put-s3"
  description = "Allow the Lambda function to put items into S3 cm-pricelists bucket"

  policy = jsonencode({

    Version = "2012-10-17",
    Statement = [{
      Action = [
        "s3:*"
      ],
      Effect = "Allow",
      Resource = [
        "${aws_s3_bucket.cm_pricelists.arn}",
        "${aws_s3_bucket.cm_pricelists.arn}/*"
      ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cm_crawler" {
  role       = aws_iam_role.cm_crawler.name
  policy_arn = aws_iam_policy.cm_crawler.arn
}

resource "aws_lambda_permission" "cm_crawler" {
  statement_id  = "AllowCmCrawlerExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.cm_crawler.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.cm_crawler.arn
}

resource "aws_cloudwatch_event_rule" "cm_crawler" {
  name        = "cloudwatch-scheduled-cm-crawler-trigger"
  description = "trigger cm-crawler lambda every 5 hours"

  schedule_expression = "rate(5 hours)"
  state               = "ENABLED"
}

resource "aws_cloudwatch_event_target" "cm_crawler" {
  rule      = aws_cloudwatch_event_rule.cm_crawler.name
  target_id = "TriggerCmCrawlerLambda"
  arn       = aws_lambda_function.cm_crawler.arn
}