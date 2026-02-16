#!/bin/bash

# Complete Deployment Helper Script
# Run this from your local Mac to deploy both frontend and backend

set -e  # Exit on any error

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  🚀 Rental Marketplace - AWS Deployment Helper         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Configuration
EC2_KEY_PATH="$HOME/Downloads/rental-marketplace-key.pem"
EC2_HOST=""  # Will be set by user input
S3_BUCKET="rental-marketplace-frontend"

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    local missing_tools=()
    
    if ! command -v aws &> /dev/null; then
        missing_tools+=("aws-cli")
    fi
    
    if ! command -v git &> /dev/null; then
        missing_tools+=("git")
    fi
    
    if ! command -v node &> /dev/null; then
        missing_tools+=("node")
    fi
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing required tools: ${missing_tools[*]}${NC}"
        echo -e "${YELLOW}Please install them first!${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ All prerequisites met!${NC}"
    echo ""
}

# Function to get user input
get_configuration() {
    echo -e "${YELLOW}📝 Please provide the following information:${NC}"
    echo ""
    
    # Get EC2 host
    read -p "Enter your EC2 public IP address: " EC2_HOST
    
    # Check if SSH key exists
    if [ ! -f "$EC2_KEY_PATH" ]; then
        read -p "Enter path to your EC2 SSH key (.pem file): " EC2_KEY_PATH
    fi
    
    # Get S3 bucket name (optional)
    read -p "Enter your S3 bucket name (press Enter for default: $S3_BUCKET): " custom_bucket
    if [ -n "$custom_bucket" ]; then
        S3_BUCKET=$custom_bucket
    fi
    
    echo ""
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 BACKEND DEPLOYMENT${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    echo -e "${YELLOW}🔍 Testing SSH connection...${NC}"
    if ssh -i "$EC2_KEY_PATH" -o ConnectTimeout=5 ubuntu@$EC2_HOST "echo 'Connection successful'" &> /dev/null; then
        echo -e "${GREEN}✅ SSH connection successful!${NC}"
    else
        echo -e "${RED}❌ Cannot connect to EC2 instance!${NC}"
        echo -e "${YELLOW}Please check your IP address and SSH key.${NC}"
        exit 1
    fi
    
    echo -e "${YELLOW}📤 Pushing code to GitHub...${NC}"
    git add -A
    git commit -m "Deploy to AWS - $(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
    git push origin main
    
    echo -e "${YELLOW}🚀 Deploying to EC2...${NC}"
    ssh -i "$EC2_KEY_PATH" ubuntu@$EC2_HOST "bash -s" << 'EOF'
        cd ~/rental-marketplace
        git pull origin main
        cd server
        npm install --production
        
        # Restart with PM2
        if pm2 list | grep -q rental-backend; then
            pm2 restart rental-backend
        else
            pm2 start server.js --name rental-backend
            pm2 save
        fi
        
        pm2 status
EOF
    
    echo -e "${GREEN}✅ Backend deployed successfully!${NC}"
    echo -e "${YELLOW}🌐 Backend API: http://${EC2_HOST}/api${NC}"
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}🌐 FRONTEND DEPLOYMENT${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    
    cd client
    
    # Check if .env.production exists
    if [ ! -f ".env.production" ]; then
        echo -e "${YELLOW}📝 Creating .env.production file...${NC}"
        echo "VITE_API_URL=http://${EC2_HOST}/api" > .env.production
    fi
    
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    npm install
    
    echo -e "${YELLOW}🔨 Building production bundle...${NC}"
    npm run build
    
    echo -e "${YELLOW}📤 Uploading to S3...${NC}"
    aws s3 sync dist/ s3://${S3_BUCKET}/ --delete
    
    # Get S3 website URL
    REGION=$(aws s3api get-bucket-location --bucket $S3_BUCKET --output text 2>/dev/null || echo "us-east-1")
    if [ "$REGION" == "None" ]; then
        REGION="us-east-1"
    fi
    
    cd ..
    
    echo -e "${GREEN}✅ Frontend deployed successfully!${NC}"
    echo -e "${YELLOW}🌐 Website URL: http://${S3_BUCKET}.s3-website-${REGION}.amazonaws.com${NC}"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    get_configuration
    
    echo -e "${YELLOW}What would you like to deploy?${NC}"
    echo "1) Both (Backend + Frontend)"
    echo "2) Backend Only"
    echo "3) Frontend Only"
    read -p "Enter your choice (1-3): " choice
    
    echo ""
    
    case $choice in
        1)
            deploy_backend
            deploy_frontend
            ;;
        2)
            deploy_backend
            ;;
        3)
            deploy_frontend
            ;;
        *)
            echo -e "${RED}Invalid choice!${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!                  ║${NC}"
    echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}📍 Share these URLs with your friends:${NC}"
    echo -e "   Backend API: ${BLUE}http://${EC2_HOST}/api${NC}"
    echo -e "   Frontend: ${BLUE}http://${S3_BUCKET}.s3-website-${REGION:-us-east-1}.amazonaws.com${NC}"
    echo ""
    echo -e "${YELLOW}💡 Useful commands:${NC}"
    echo -e "   Check backend logs: ${BLUE}ssh -i $EC2_KEY_PATH ubuntu@$EC2_HOST 'pm2 logs rental-backend'${NC}"
    echo -e "   Monitor backend: ${BLUE}ssh -i $EC2_KEY_PATH ubuntu@$EC2_HOST 'pm2 monit'${NC}"
    echo ""
}

# Run main function
main
