#!/bin/bash

# 🚀 Quick Deploy Setup Script
# This script helps you prepare for deployment

echo "🎯 Closetly Deployment Preparation"
echo "=================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check for .gitignore
if [ ! -f .gitignore ]; then
    echo "📝 Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
client/node_modules/
server/node_modules/

# Environment variables
.env
.env.local
.env.production
server/.env
server/.env.production
client/.env.local

# Build outputs
client/dist/
client/build/
server/dist/

# Database
mongodb-data/

# Logs
*.log
npm-debug.log*
logs/

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Uploads
server/uploads/*
!server/uploads/.gitkeep
EOF
    echo "✅ .gitignore created"
else
    echo "✅ .gitignore exists"
fi

# Generate JWT secret
echo ""
echo "🔐 Generating JWT Secret for production..."
JWT_SECRET=$(openssl rand -base64 32)
echo ""
echo "📋 Copy this JWT_SECRET for Render deployment:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$JWT_SECRET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Build frontend to verify
echo "🏗️  Testing frontend build..."
cd client && npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend builds successfully"
    cd ..
else
    echo "❌ Frontend build failed - check for errors"
    cd ..
    exit 1
fi

echo ""
echo "✨ Setup Complete!"
echo ""
echo "📖 Next Steps:"
echo "1. Read DEPLOY_FREE.md for full instructions"
echo "2. Create GitHub account (if you don't have)"
echo "3. Push code to GitHub"
echo "4. Deploy to Render (backend)"
echo "5. Deploy to Vercel (frontend)"
echo ""
echo "🔗 Quick Links:"
echo "• GitHub: https://github.com/new"
echo "• Render: https://dashboard.render.com/register"
echo "• Vercel: https://vercel.com/signup"
echo ""
echo "💡 Tip: Use the JWT_SECRET above in Render environment variables!"
echo ""
