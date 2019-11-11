# s3
resource "aws_s3_bucket" "beanie" {
  bucket = "beanies.john-shenk.com"
  acl = "private"
  website {
   index_document = "index.html"
   error_document = "index.html"
  }
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
      {
          "Sid": "Cloudfront Read",
          "Effect": "Allow",
          "Principal": {
              "AWS": "${aws_cloudfront_origin_access_identity.beanie.iam_arn}"
          },
          "Action": "s3:GetObject",
          "Resource": "arn:aws:s3:::beanies.john-shenk.com/*"
      }
  ]
}
EOF
}

resource "aws_cloudfront_origin_access_identity" "beanie" {
  comment = "beanie.john-shenk.com identity"
}

locals {
  s3_origin_id = "beanie-origin"
}

resource "aws_cloudfront_distribution" "beanie" {
  origin {
    domain_name = "${aws_s3_bucket.beanie.bucket_domain_name}"
    origin_id   = "${local.s3_origin_id}"
    s3_origin_config {
      origin_access_identity = "${aws_cloudfront_origin_access_identity.beanie.cloudfront_access_identity_path}"
    }
  }

  enabled             = true
  is_ipv6_enabled     = true

  aliases = ["beanie.john-shenk.com"]

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${local.s3_origin_id}"
    trusted_signers = []

    forwarded_values {
      query_string = false
      query_string_cache_keys = []
      headers = []

      cookies {
        forward = "none"
        whitelisted_names = []
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 31536000
  }
  restrictions {
    geo_restriction {
        locations        = []
        restriction_type = "none"
    }
}

  viewer_certificate {
      acm_certificate_arn            = "arn:aws:acm:us-east-1:671958020402:certificate/12541448-a658-4e4f-b4d1-4e5e10c0d5fb"
      cloudfront_default_certificate = false
      minimum_protocol_version       = "TLSv1.1_2016"
      ssl_support_method             = "sni-only"
  }
}
#
#
# resource "aws_iam_role" "beanie" {
#   name = "beanie_build_role"
#
#   assume_role_policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect": "Allow",
#       "Principal": {
#         "Service": "codebuild.amazonaws.com"
#       },
#       "Action": "sts:AssumeRole"
#     }
#   ]
# }
# EOF
# }
#
# resource "aws_iam_role_policy" "beanie" {
#   name = "beanie_build_policy"
#   role = "${aws_iam_role.beanie.id}"
#
#   policy = <<EOF
# {
#   "Version": "2012-10-17",
#   "Statement": [
#     {
#       "Effect":"Allow",
#       "Action": [
#         "s3:Get*",
#         "s3:List*"
#       ],
#       "Resource": [
#         "${aws_s3_bucket.beanie.arn}",
#         "${aws_s3_bucket.beanie.arn}/index.html"
#       ]
#     },
#     {
#       "Effect": "Allow",
#       "Action": [
#         "codebuild:BatchGetBuilds",
#         "codebuild:StartBuild"
#       ],
#       "Resource": "*"
#     },
#     {
#       "Effect": "Allow",
#       "Action": [
#         "s3:*"
#       ],
#       "Resource": [
#         "${aws_s3_bucket.beanie.arn}",
#         "${aws_s3_bucket.beanie.arn}/*"
#       ]
#     },
#     {
#       "Effect": "Allow",
#       "Action": [
#         "codebuild:*"
#       ],
#       "Resource": "*"
#     },{
#       "Effect": "Allow",
#       "Resource": [
#         "*"
#       ],
#       "Action": [
#         "logs:CreateLogGroup",
#         "logs:CreateLogStream",
#         "logs:PutLogEvents"
#       ]
#     },{
#       "Effect": "Allow",
#       "Action": [
#         "cloudfront:CreateInvalidation",
#         "cloudfront:GetInvalidation",
#         "cloudfront:ListInvalidations"
#       ],
#       "Resource": "*"
#     }
#   ]
# }
# EOF
# }
