#!/bin/bash

# Backend Deployment Script for AWS EC2
# Run this script ON YOUR EC2 INSTANCE to update the backend

set -e  # Exit on any error

echo "🚀 Starting Backend Deployment on EC2..."

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR=~/rental-marketplace/server
PM2_APP_NAME="rental-backend"

echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
cd ~/rental-marketplace
git pull origin main

echo -e "${YELLOW}📦 Installing/updating dependencies...${NC}"
cd $APP_DIR
npm install --production

echo -e "${YELLOW}🔄 Restarting application with PM2...${NC}"

# Check if app is already running
if pm2 list | grep -q $PM2_APP_NAME; then
    pm2 restart $PM2_APP_NAME
    echo -e "${GREEN}✅ Application restarted!${NC}"
else
    pm2 start server.js --name $PM2_APP_NAME
    pm2 save
    echo -e "${GREEN}✅ Application started!${NC}"
fi

echo ""
echo -e "${YELLOW}📊 Application Status:${NC}"
pm2 status

echo ""
echo -e "${YELLOW}📝 Recent Logs:${NC}"
pm2 logs $PM2_APP_NAME --lines 20 --nostream

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo -e "${YELLOW}💡 Useful commands:${NC}"
echo -e "   pm2 logs $PM2_APP_NAME          - View logs"
echo -e "   pm2 restart $PM2_APP_NAME       - Restart app"
echo -e "   pm2 stop $PM2_APP_NAME          - Stop app"
echo -e "   pm2 monit                        - Monitor resources"
