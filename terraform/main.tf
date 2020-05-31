provider "aws" {
  profile = "jds"
  region = "us-west-1"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "iam_for_beanieboo_server_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_lambda_function" "beanieboo_server_lambda" {
  filename      = "lambda.zip"
  function_name = "beaniebooserverlambda"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "serverlambda.handler"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  runtime = "nodejs10.x"
  timeout = "60"

  environment {
    variables = {
      foo = "bar"
    }
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir = "../api/app"
  output_path = "lambda.zip"
}

resource "aws_lambda_permission" "beanieboo_server_lambda" {
  statement_id  = "AllowExecutionFromApplicationLoadBalancer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.beanieboo_server_lambda.arn
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn = aws_lb_target_group.beanieboo_server_lambda.arn
}

resource "aws_lambda_permission" "beanieboo_server_lambda_live" {
  statement_id  = "AllowExecutionFromApplicationLoadBalancer"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_alias.beanieboo_server_lambda_live.arn
  principal     = "elasticloadbalancing.amazonaws.com"
  source_arn = aws_lb_target_group.beanieboo_server_lambda.arn
}

resource "aws_lambda_alias" "beanieboo_server_lambda_live" {
  name             = "live"
  description      = "set a live alias"
  function_name    = aws_lambda_function.beanieboo_server_lambda.arn
  function_version = aws_lambda_function.beanieboo_server_lambda.version
}

# IAM
resource "aws_iam_role_policy_attachment" "cloudwatch-attach" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "dynamo-attach" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.dynamo_policy.arn
}


resource "aws_iam_role_policy_attachment" "ssm-attach" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}

resource "aws_iam_policy" "dynamo_policy" {
  name        = "beanieboo_dynamo_policy"
  description = "dynamo policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "dynamodb:*"
      ],
      "Effect": "Allow",
      "Resource": [
        "${aws_dynamodb_table.users.arn}",
        "${aws_dynamodb_table.users.arn}/*",
        "${aws_dynamodb_table.beanieboos.arn}",
        "${aws_dynamodb_table.beanieboos.arn}/*",
        "${aws_dynamodb_table.beanies.arn}",
        "${aws_dynamodb_table.beanies.arn}/*"
      ]
    }
  ]
}
EOF
}

resource "aws_iam_policy" "ssm_policy" {
  name        = "beanieboo_ssm_policy"
  description = "ssm policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ssm:GetParameter"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

# DB
resource "aws_dynamodb_table" "users" {
  name = "beaniebooUsers"
  billing_mode = "PROVISIONED"
  write_capacity = 10
  read_capacity = 10
  hash_key = "username"
  attribute {
    name = "username"
    type = "S"
  }
}

resource "aws_dynamodb_table" "beanieboos" {
  name = "beanieboos"
  billing_mode = "PROVISIONED"
  write_capacity = 10
  read_capacity = 10
  hash_key = "name"
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "family"
    type = "S"
  }
  global_secondary_index {
    name = "family"
    hash_key = "family"
    write_capacity = 5
    read_capacity = 5
    projection_type = "INCLUDE"
    non_key_attributes = ["thumbnail","animal"]
  }
}

resource "aws_dynamodb_table" "beanies" {
  name = "beanies"
  billing_mode = "PROVISIONED"
  write_capacity = 5
  read_capacity = 10
  hash_key = "family"
  range_key = "name"
  attribute {
    name = "name"
    type = "S"
  }
  attribute {
    name = "family"
    type = "S"
  }
}

# ALB
resource "aws_lb_target_group" "beanieboo_server_lambda" {
  name        = "beaniebooserverlambda"
  target_type = "lambda"
}

resource "aws_lb_target_group_attachment" "beanieboo_server_lambda" {
  target_group_arn  = aws_lb_target_group.beanieboo_server_lambda.arn
  target_id         = aws_lambda_alias.beanieboo_server_lambda_live.arn
  depends_on        = [aws_lambda_permission.beanieboo_server_lambda_live]
}

resource "aws_lb_listener_rule" "beanieboo_server_lambda" {
  listener_arn = data.terraform_remote_state.stinkyfingers.outputs.stinkyfingers_https_listener
  priority = 26
  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.beanieboo_server_lambda.arn
  }
  condition {
    path_pattern {
      values = ["/beanieboo/*"]
    }
  }
  depends_on = [aws_lb_target_group.beanieboo_server_lambda]
}

# s3
resource "aws_s3_bucket" "beaniedata" {
  bucket = "beaniedata.john-shenk.com"
  acl = "private"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "Lambda Read",
          "Effect": "Allow",
          "Principal": {
              "AWS": "${aws_iam_role.iam_for_lambda.arn}"
          },
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::beaniedata.john-shenk.com/*"
      }
  ]
}
EOF
}

# backend
terraform {
  backend "s3" {
    bucket = "remotebackend"
    key    = "beaniebooserver/terraform.tfstate"
    region = "us-west-1"
    profile = "jds"
  }
}

data "terraform_remote_state" "beaniebooserver" {
  backend = "s3"
  config = {
    bucket  = "remotebackend"
    key     = "beaniebooserver/terraform.tfstate"
    region  = "us-west-1"
    profile = "jds"
  }
}

data "terraform_remote_state" "stinkyfingers" {
  backend = "s3"
  config = {
    bucket  = "remotebackend"
    key     = "stinkyfingers/terraform.tfstate"
    region  = "us-west-1"
    profile = "jds"
  }
}
