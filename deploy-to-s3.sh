#!/bin/bash

# AWS S3 Deployment Script - Interactive
# This script will help you deploy to AWS S3 in 2 minutes!

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🚀 AWS S3 Deployment - Quick Setup        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}📦 Installing AWS CLI...${NC}"
    brew install awscli
    echo -e "${GREEN}✅ AWS CLI installed!${NC}"
    echo ""
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null 2>&1; then
    echo -e "${YELLOW}🔐 AWS credentials not configured. Let's set them up!${NC}"
    echo ""
    echo "You need your AWS Access Key ID and Secret Access Key."
    echo "Get them from: AWS Console → Your Name (top right) → Security Credentials → Access Keys"
    echo ""
    
    read -p "Enter your AWS Access Key ID: " aws_key
    read -p "Enter your AWS Secret Access Key: " aws_secret
    read -p "Enter your preferred region (e.g., us-east-1): " aws_region
    
    # Configure AWS CLI
    aws configure set aws_access_key_id "$aws_key"
    aws configure set aws_secret_access_key "$aws_secret"
    aws configure set default.region "$aws_region"
    aws configure set default.output "json"
    
    echo -e "${GREEN}✅ AWS credentials configured!${NC}"
    echo ""
else
    echo -e "${GREEN}✅ AWS credentials already configured!${NC}"
    echo ""
fi

# Get bucket name
echo -e "${YELLOW}📦 S3 Bucket Configuration${NC}"
echo ""
DEFAULT_BUCKET="rental-marketplace-$(date +%s)"
read -p "Enter S3 bucket name (press Enter for: $DEFAULT_BUCKET): " BUCKET_NAME
BUCKET_NAME=${BUCKET_NAME:-$DEFAULT_BUCKET}

# Get region
AWS_REGION=$(aws configure get region)

echo ""
echo -e "${YELLOW}🔨 Creating S3 bucket: ${BUCKET_NAME}${NC}"

# Create bucket
if [ "$AWS_REGION" == "us-east-1" ]; then
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" 2>/dev/null || echo "Bucket might already exist"
else
    aws s3api create-bucket --bucket "$BUCKET_NAME" --region "$AWS_REGION" --create-bucket-configuration LocationConstraint="$AWS_REGION" 2>/dev/null || echo "Bucket might already exist"
fi

echo -e "${GREEN}✅ Bucket created!${NC}"
echo ""

echo -e "${YELLOW}🔓 Configuring bucket for public access...${NC}"

# Disable block public access
aws s3api put-public-access-block \
    --bucket "$BUCKET_NAME" \
    --public-access-block-configuration \
    "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Enable static website hosting
aws s3 website "s3://$BUCKET_NAME/" --index-document index.html --error-document index.html

# Set bucket policy
cat > /tmp/bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::${BUCKET_NAME}/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json

echo -e "${GREEN}✅ Bucket configured!${NC}"
echo ""

echo -e "${YELLOW}📤 Uploading your website...${NC}"

# Upload files
cd client
aws s3 sync dist/ "s3://$BUCKET_NAME/" --delete

echo -e "${GREEN}✅ Upload complete!${NC}"
echo ""

# Get website URL
WEBSITE_URL="http://${BUCKET_NAME}.s3-website-${AWS_REGION}.amazonaws.com"

echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 DEPLOYMENT SUCCESSFUL!                  ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🌐 Your website is live at:${NC}"
echo -e "${YELLOW}${WEBSITE_URL}${NC}"
echo ""
echo -e "${BLUE}📱 Share this link with your friends!${NC}"
echo ""
echo -e "${YELLOW}💰 Cost: $0.00 (AWS Free Tier)${NC}"
echo ""

# Open in browser
echo "Opening in browser..."
open "$WEBSITE_URL" || echo "Please open the URL manually"
