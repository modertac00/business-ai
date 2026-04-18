#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage:
  scripts/sync-s3.sh --bucket my-existing-bucket [--distribution-id E123ABC456]

Options:
  --bucket            Destination S3 bucket (required)
  --distribution-id   CloudFront distribution to invalidate after upload (optional)
  --build-dir         Frontend build output (default: frontend/dist)
  --skip-build        Skip npm frontend build step
  --profile           AWS CLI profile name (optional)
  -h, --help          Show help
USAGE
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

BUCKET=""
DISTRIBUTION_ID=""
BUILD_DIR="frontend/dist"
SKIP_BUILD="false"
PROFILE=""

while [ "$#" -gt 0 ]; do
  case "$1" in
    --bucket)
      BUCKET="$2"
      shift 2
      ;;
    --distribution-id)
      DISTRIBUTION_ID="$2"
      shift 2
      ;;
    --build-dir)
      BUILD_DIR="$2"
      shift 2
      ;;
    --skip-build)
      SKIP_BUILD="true"
      shift
      ;;
    --profile)
      PROFILE="$2"
      shift 2
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

if [ -z "$BUCKET" ]; then
  echo "Error: --bucket is required." >&2
  usage
  exit 1
fi

require_cmd aws
require_cmd npm

AWS_ARGS=()
if [ -n "$PROFILE" ]; then
  AWS_ARGS+=(--profile "$PROFILE")
fi

if [ "$SKIP_BUILD" = "false" ]; then
  echo "Building frontend"
  npm run build -w frontend
fi

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: build directory not found: $BUILD_DIR" >&2
  exit 1
fi

echo "Syncing assets to s3://${BUCKET}"
aws "${AWS_ARGS[@]}" s3 sync "$BUILD_DIR" "s3://${BUCKET}" \
  --delete \
  --exclude "index.html" \
  --cache-control "public,max-age=31536000,immutable"

echo "Uploading index.html with short cache"
aws "${AWS_ARGS[@]}" s3 cp "${BUILD_DIR}/index.html" "s3://${BUCKET}/index.html" \
  --cache-control "public,max-age=60,must-revalidate" \
  --content-type "text/html"

if [ -n "$DISTRIBUTION_ID" ]; then
  echo "Creating CloudFront invalidation"
  aws "${AWS_ARGS[@]}" cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" >/dev/null
fi

echo "Done."
