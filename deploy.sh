#!/bin/bash

# Deploy Hugo site to S3 and trigger AWS Amplify deployment
# Usage: ./deploy.sh [bucket-name] [amplify-app-id]
# Default bucket: eve-resume
# Default Amplify app ID: d197x6838h47m2

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed.${NC}"
    echo "Install it with: brew install awscli"
    exit 1
fi

# Check if Hugo is installed
if ! command -v hugo &> /dev/null; then
    echo -e "${RED}❌ Hugo is not installed.${NC}"
    echo "Install it with: brew install hugo"
    exit 1
fi

# Get bucket name from argument, environment variable, or use default
BUCKET_NAME="${1:-${S3_BUCKET_NAME:-eve-resume}}"

# Get Amplify app ID from argument, environment variable, or use default
AMPLIFY_APP_ID="${2:-${AMPLIFY_APP_ID:-d197x6838h47m2}}"

echo -e "${YELLOW}🚀 Starting deployment...${NC}"
echo ""

# Build the site
echo -e "${YELLOW}📦 Building Hugo site...${NC}"
hugo --minify
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Hugo build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Site built successfully${NC}"
echo ""

# Deploy to S3
echo -e "${YELLOW}☁️  Deploying to S3 bucket: ${BUCKET_NAME}...${NC}"
aws s3 sync ./public s3://${BUCKET_NAME} --delete --exact-timestamps
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ S3 deployment failed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Deployed to S3 successfully${NC}"
echo ""

# Trigger Amplify deployment from S3
echo -e "${YELLOW}🚀 Triggering AWS Amplify deployment from S3 (app: ${AMPLIFY_APP_ID}, branch: prod)...${NC}"

# Start a deployment from the S3 bucket
DEPLOY_OUTPUT=$(aws amplify start-deployment \
    --app-id ${AMPLIFY_APP_ID} \
    --branch-name prod \
    --source-url s3://${BUCKET_NAME} 2>&1)

if [ $? -eq 0 ]; then
    DEPLOYMENT_ID=$(echo "$DEPLOY_OUTPUT" | grep -oP '"jobId":\s*"\K[^"]+' || echo "$DEPLOY_OUTPUT" | grep -oP '"deploymentId":\s*"\K[^"]+' || echo "")
    if [ -n "$DEPLOYMENT_ID" ]; then
        echo -e "${GREEN}✅ Amplify deployment started: ${DEPLOYMENT_ID}${NC}"
        echo "   Monitor progress in AWS Console:"
        echo "   https://console.aws.amazon.com/amplify/home?region=us-east-1#/${AMPLIFY_APP_ID}/prod"
    else
        echo -e "${GREEN}✅ Amplify deployment triggered${NC}"
        echo "   Check AWS Console for deployment status"
    fi
else
    echo -e "${YELLOW}⚠️  Could not trigger Amplify deployment via CLI${NC}"
    echo "   Error: ${DEPLOY_OUTPUT}"
    echo ""
    echo "   The files have been uploaded to S3. Next steps:"
    echo "   1. Go to AWS Amplify Console:"
    echo "      https://console.aws.amazon.com/amplify/home?region=us-east-1#/${AMPLIFY_APP_ID}/prod"
    echo ""
    echo "   2. Click the 'Deploy' button to manually trigger deployment"
fi
echo ""

echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "Your site should be live at: https://evefreeman.com"
echo "Monitor deployment in AWS Amplify Console"

