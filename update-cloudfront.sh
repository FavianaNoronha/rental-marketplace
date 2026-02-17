#!/bin/bash

# CloudFront Update Script - Rebuild + Deploy + Invalidate Cache

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   🔄 CloudFront Update & Cache Clear        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Get CloudFront Distribution ID
echo -e "${YELLOW}📋 Finding your CloudFront distribution...${NC}"
echo ""

# List all CloudFront distributions
DISTRIBUTIONS=$(aws cloudfront list-distributions --query 'DistributionList.Items[*].[Id,DomainName,Origins.Items[0].DomainName]' --output text)

if [ -z "$DISTRIBUTIONS" ]; then
    echo -e "${RED}❌ No CloudFront distributions found!${NC}"
    exit 1
fi

echo "Available CloudFront distributions:"
echo "$DISTRIBUTIONS" | nl -w2 -s'. '
echo ""

# Get S3 bucket name
read -p "Enter your S3 bucket name: " BUCKET_NAME

# Find distribution ID for this bucket
DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?Origins.Items[0].DomainName=='${BUCKET_NAME}.s3.amazonaws.com'].Id" --output text)

if [ -z "$DISTRIBUTION_ID" ]; then
    # Try alternate S3 domain format
    DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '${BUCKET_NAME}')].Id" --output text | head -n1)
fi

if [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}⚠️  Could not auto-detect distribution ID${NC}"
    read -p "Enter your CloudFront Distribution ID manually: " DISTRIBUTION_ID
else
    echo -e "${GREEN}✅ Found Distribution ID: ${DISTRIBUTION_ID}${NC}"
fi

echo ""

# Step 2: Rebuild frontend
echo -e "${YELLOW}🔨 Rebuilding frontend with latest changes...${NC}"
cd client
npm run build

echo -e "${GREEN}✅ Build complete!${NC}"
echo ""

# Step 3: Upload to S3
echo -e "${YELLOW}📤 Uploading to S3...${NC}"
aws s3 sync dist/ "s3://${BUCKET_NAME}/" --delete --cache-control "max-age=31536000,public" --exclude "index.html" --exclude "*.html"

# Upload HTML files with no-cache
aws s3 sync dist/ "s3://${BUCKET_NAME}/" --exclude "*" --include "*.html" --cache-control "max-age=0,no-cache,no-store,must-revalidate"

echo -e "${GREEN}✅ Upload complete!${NC}"
echo ""

# Step 4: Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Clearing CloudFront cache...${NC}"
echo "This will make your new website visible immediately!"
echo ""

INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}✅ Cache invalidation started!${NC}"
echo -e "Invalidation ID: ${INVALIDATION_ID}"
echo ""

# Step 5: Wait for invalidation (optional)
echo -e "${YELLOW}⏳ Waiting for invalidation to complete...${NC}"
echo "This usually takes 1-3 minutes..."
echo ""

aws cloudfront wait invalidation-completed \
    --distribution-id "$DISTRIBUTION_ID" \
    --id "$INVALIDATION_ID"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   🎉 UPDATE COMPLETE!                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Get CloudFront URL
CLOUDFRONT_URL=$(aws cloudfront get-distribution --id "$DISTRIBUTION_ID" --query 'Distribution.DomainName' --output text)

echo -e "${BLUE}🌐 Your updated website is live at:${NC}"
echo -e "${YELLOW}https://${CLOUDFRONT_URL}${NC}"
echo ""
echo -e "${BLUE}💡 Tip: Hard refresh your browser (Cmd+Shift+R) to see changes${NC}"
echo ""

# Open in browser
echo "Opening in browser..."
open "https://${CLOUDFRONT_URL}" || echo "Please open the URL manually"
