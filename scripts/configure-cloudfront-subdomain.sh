#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/configure-cloudfront-subdomain.sh \
    --subdomain app.example.com \
    --bucket my-existing-bucket \
    --hosted-zone-id Z123456789 \
    --acm-cert-arn arn:aws:acm:us-east-1:123456789012:certificate/xxxx

Options:
  --subdomain         Full hostname to serve via CloudFront (required)
  --bucket            Existing S3 bucket name (required)
  --hosted-zone-id    Route53 hosted zone ID for your domain (required)
  --acm-cert-arn      ACM cert ARN in us-east-1 for the subdomain (required)
  --price-class       CloudFront price class (default: PriceClass_100)
  --region            S3 bucket region (auto-detected if omitted)
  --skip-bucket-policy   Do not update bucket policy
  -h, --help          Show help

Notes:
- AWS CLI credentials/profile must already be configured.
- This script creates an Origin Access Control (OAC), CloudFront distribution,
  Route53 A+AAAA alias records, and a restrictive bucket policy for CloudFront.
USAGE
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

SUBDOMAIN=""
BUCKET=""
HOSTED_ZONE_ID=""
ACM_CERT_ARN=""
PRICE_CLASS="PriceClass_100"
REGION=""
SKIP_BUCKET_POLICY="false"

while [ "$#" -gt 0 ]; do
  case "$1" in
    --subdomain)
      SUBDOMAIN="$2"
      shift 2
      ;;
    --bucket)
      BUCKET="$2"
      shift 2
      ;;
    --hosted-zone-id)
      HOSTED_ZONE_ID="$2"
      shift 2
      ;;
    --acm-cert-arn)
      ACM_CERT_ARN="$2"
      shift 2
      ;;
    --price-class)
      PRICE_CLASS="$2"
      shift 2
      ;;
    --region)
      REGION="$2"
      shift 2
      ;;
    --skip-bucket-policy)
      SKIP_BUCKET_POLICY="true"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [ -z "$SUBDOMAIN" ] || [ -z "$BUCKET" ] || [ -z "$HOSTED_ZONE_ID" ] || [ -z "$ACM_CERT_ARN" ]; then
  echo "Error: missing required argument(s)." >&2
  usage
  exit 1
fi

case "$PRICE_CLASS" in
  PriceClass_100|PriceClass_200|PriceClass_All)
    ;;
  *)
    echo "Error: invalid --price-class value: $PRICE_CLASS" >&2
    exit 1
    ;;
esac

require_cmd aws

# CloudFront hosted zone ID is fixed for alias records.
CLOUDFRONT_HOSTED_ZONE_ID="Z2FDTNDATAQYW2"

echo "Checking S3 bucket: $BUCKET"
aws s3api head-bucket --bucket "$BUCKET" >/dev/null

if [ -z "$REGION" ]; then
  REGION="$(aws s3api get-bucket-location --bucket "$BUCKET" --query 'LocationConstraint' --output text)"
  if [ "$REGION" = "None" ] || [ "$REGION" = "null" ]; then
    REGION="us-east-1"
  fi
fi

S3_ORIGIN_DOMAIN="${BUCKET}.s3.${REGION}.amazonaws.com"

echo "Using S3 origin: $S3_ORIGIN_DOMAIN"

OAC_NAME="oac-${BUCKET}"
OAC_ID="$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'].Id | [0]" \
  --output text)"

if [ "$OAC_ID" = "None" ] || [ "$OAC_ID" = "null" ] || [ -z "$OAC_ID" ]; then
  echo "Creating CloudFront Origin Access Control: $OAC_NAME"
  OAC_ID="$(aws cloudfront create-origin-access-control \
    --origin-access-control-config "Name=${OAC_NAME},SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
    --query 'OriginAccessControl.Id' \
    --output text)"
else
  echo "Reusing existing OAC: $OAC_ID"
fi

DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Aliases.Items && contains(Aliases.Items, '${SUBDOMAIN}')].Id | [0]" \
  --output text)"

if [ "$DIST_ID" = "None" ] || [ "$DIST_ID" = "null" ] || [ -z "$DIST_ID" ]; then
  echo "Creating CloudFront distribution for ${SUBDOMAIN}"

  DIST_CONFIG_FILE="$(mktemp)"
  cat > "$DIST_CONFIG_FILE" <<JSON
{
  "CallerReference": "${SUBDOMAIN}-$(date +%s)",
  "Comment": "${SUBDOMAIN} -> ${BUCKET}",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "s3-origin-${BUCKET}",
        "DomainName": "${S3_ORIGIN_DOMAIN}",
        "OriginAccessControlId": "${OAC_ID}",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "Aliases": {
    "Quantity": 1,
    "Items": [
      "${SUBDOMAIN}"
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-origin-${BUCKET}",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 10
      }
    ]
  },
  "PriceClass": "${PRICE_CLASS}",
  "Restrictions": {
    "GeoRestriction": {
      "RestrictionType": "none",
      "Quantity": 0
    }
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "${ACM_CERT_ARN}",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021",
    "Certificate": "${ACM_CERT_ARN}",
    "CertificateSource": "acm"
  },
  "HttpVersion": "http2",
  "IsIPV6Enabled": true
}
JSON

  DIST_ID="$(aws cloudfront create-distribution \
    --distribution-config "file://${DIST_CONFIG_FILE}" \
    --query 'Distribution.Id' \
    --output text)"

  rm -f "$DIST_CONFIG_FILE"
else
  echo "Reusing existing distribution: $DIST_ID"
fi

DIST_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" --query 'Distribution.DomainName' --output text)"

echo "Distribution domain: $DIST_DOMAIN"

if [ "$SKIP_BUCKET_POLICY" = "false" ]; then
  ACCOUNT_ID="$(aws sts get-caller-identity --query 'Account' --output text)"
  DIST_ARN="arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DIST_ID}"

  POLICY_FILE="$(mktemp)"
  cat > "$POLICY_FILE" <<JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "${DIST_ARN}"
        }
      }
    }
  ]
}
JSON

  echo "Applying bucket policy for CloudFront access"
  aws s3api put-bucket-policy --bucket "$BUCKET" --policy "file://${POLICY_FILE}"
  rm -f "$POLICY_FILE"
fi

echo "Upserting Route53 alias records for ${SUBDOMAIN}"
R53_FILE="$(mktemp)"
cat > "$R53_FILE" <<JSON
{
  "Comment": "Alias ${SUBDOMAIN} -> ${DIST_DOMAIN}",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${SUBDOMAIN}",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "${CLOUDFRONT_HOSTED_ZONE_ID}",
          "DNSName": "${DIST_DOMAIN}",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${SUBDOMAIN}",
        "Type": "AAAA",
        "AliasTarget": {
          "HostedZoneId": "${CLOUDFRONT_HOSTED_ZONE_ID}",
          "DNSName": "${DIST_DOMAIN}",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
JSON

aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch "file://${R53_FILE}" >/dev/null

rm -f "$R53_FILE"

echo "Done."
echo "Subdomain:        ${SUBDOMAIN}"
echo "CloudFront ID:    ${DIST_ID}"
echo "CloudFront domain:${DIST_DOMAIN}"
echo "S3 bucket:        ${BUCKET}"
echo "Next: run scripts/sync-s3.sh --bucket ${BUCKET} --distribution-id ${DIST_ID}"
