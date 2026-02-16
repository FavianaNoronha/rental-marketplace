#!/bin/bash

# Frontend Deployment Script for AWS S3
# This script builds and deploys the React frontend to S3

set -e  # Exit on any error

echo "🚀 Starting Frontend Deployment to AWS S3..."

# Configuration
BUCKET_NAME="rental-marketplace-frontend"  # Change this to your bucket name
DISTRIBUTION_ID=""  # Add your CloudFront distribution ID if you're using CloudFront

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo -e "${YELLOW}📝 Please copy .env.production.example to .env.production and update it with your values.${NC}"
    exit 1
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ Error: AWS CLI is not installed!${NC}"
    echo -e "${YELLOW}📝 Install it with: brew install awscli${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ Error: AWS credentials not configured!${NC}"
    echo -e "${YELLOW}📝 Run: aws configure${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm install

echo -e "${YELLOW}🔨 Building production bundle...${NC}"
npm run build

echo -e "${YELLOW}📤 Uploading to S3 bucket: ${BUCKET_NAME}...${NC}"
aws s3 sync dist/ s3://${BUCKET_NAME}/ --delete

echo -e "${GREEN}✅ Files uploaded successfully!${NC}"

# Invalidate CloudFront cache if distribution ID is provided
if [ -n "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
    echo -e "${GREEN}✅ CloudFront cache invalidated!${NC}"
fi

# Get S3 website endpoint
REGION=$(aws s3api get-bucket-location --bucket $BUCKET_NAME --output text)
if [ "$REGION" == "None" ]; then
    REGION="us-east-1"
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}📍 Your website is now live at:${NC}"
echo -e "   http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"

if [ -n "$DISTRIBUTION_ID" ]; then
    CLOUDFRONT_DOMAIN=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    echo -e "   https://${CLOUDFRONT_DOMAIN}"
fi

echo ""
echo -e "${YELLOW}💡 Share this URL with your friends for UAT testing!${NC}"
