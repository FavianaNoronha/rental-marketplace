# 🚀 Quick Start: Free AWS Deployment

## Overview
Deploy your rental marketplace on AWS **100% FREE** in under 45 minutes!

---

## Prerequisites Checklist
- [ ] AWS Account ([sign up free](https://aws.amazon.com/free/))
- [ ] MongoDB Atlas Account ([sign up free](https://www.mongodb.com/cloud/atlas/register))
- [ ] Git installed on your Mac
- [ ] AWS CLI installed (`brew install awscli`)

---

## ⚡ Quick Deployment (3 Steps)

### Step 1: Setup MongoDB Atlas (10 minutes)

```bash
1. Go to https://cloud.mongodb.com/ and sign up
2. Create a FREE M0 cluster (512MB)
3. Choose AWS + your preferred region
4. In "Network Access": Allow access from anywhere (0.0.0.0/0)
5. In "Database Access": Create user
   - Username: rentaluser
   - Password: [generate strong password - SAVE IT!]
6. Click "Connect" → "Connect your application"
7. Copy connection string (looks like):
   mongodb+srv://rentaluser:YOUR-PASSWORD@cluster.xxxxx.mongodb.net/
8. SAVE this string - you'll need it!
```

### Step 2: Deploy Backend on EC2 (20 minutes)

```bash
# 2.1 Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Name: "rental-marketplace-backend"
3. AMI: Ubuntu Server 22.04 LTS (FREE TIER)
4. Instance type: t2.micro (FREE TIER)
5. Create key pair:
   - Name: rental-marketplace-key
   - Download .pem file → Save to ~/Downloads/
6. Security Group - Allow:
   - SSH (22) from your IP
   - HTTP (80) from anywhere
   - HTTPS (443) from anywhere
   - Custom TCP (5001) from anywhere
7. Launch!
8. SAVE the public IP address (e.g., 54.123.45.67)

# 2.2 Connect and Setup
# On your Mac terminal:
chmod 400 ~/Downloads/rental-marketplace-key.pem
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@YOUR-EC2-IP

# On EC2 (run these commands):
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
sudo npm install -g pm2

# Clone and setup
git clone https://github.com/YOUR-USERNAME/rental-marketplace.git
cd rental-marketplace/server
npm install

# Create .env file
nano .env

# Paste this (UPDATE the values!):
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://rentaluser:YOUR-PASSWORD@cluster.xxxxx.mongodb.net/rental-marketplace
JWT_SECRET=use-output-from-command-below
JWT_REFRESH_SECRET=use-another-output-from-command-below
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password

# Generate JWT secrets (run these):
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output to JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output to JWT_REFRESH_SECRET

# Save with Ctrl+X, Y, Enter

# Install and configure Nginx
sudo apt install -y nginx
sudo nano /etc/nginx/sites-available/rental-marketplace

# Paste this config (replace YOUR-EC2-IP):
server {
    listen 80;
    server_name YOUR-EC2-IP;
    
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Save and enable
sudo ln -s /etc/nginx/sites-available/rental-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Start the app
pm2 start server.js --name rental-backend
pm2 startup  # Follow the command it outputs
pm2 save

# Verify it's running
pm2 status
curl http://localhost:5001/api/health
```

### Step 3: Deploy Frontend on S3 (15 minutes)

```bash
# On your Mac terminal:

# 3.1 Create S3 Bucket
1. Go to AWS Console → S3 → Create bucket
2. Name: rental-marketplace-frontend-YOUR-NAME (must be unique)
3. Region: Same as EC2
4. Uncheck "Block all public access"
5. Acknowledge warning
6. Create bucket

# 3.2 Enable Static Website Hosting
1. Click bucket → Properties
2. Scroll to "Static website hosting" → Edit
3. Enable it
4. Index document: index.html
5. Error document: index.html
6. Save (note the endpoint URL)

# 3.3 Set Public Access Policy
1. Click bucket → Permissions → Bucket Policy → Edit
2. Paste this (REPLACE YOUR-BUCKET-NAME):

{
    "Version": "2012-10-17",
    "Statement": [{
        "Sid": "PublicReadGetObject",
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }]
}

3. Save

# 3.4 Deploy Frontend
cd /Users/faviananoronha/Developer/rental-marketplace

# Configure AWS CLI (one-time setup)
aws configure
# Enter: Access Key ID, Secret Key, Region (e.g., us-east-1), format: json
# Get keys from: AWS Console → Your Name → Security Credentials → Access Keys

# Create production config
cd client
echo "VITE_API_URL=http://YOUR-EC2-IP/api" > .env.production

# Build and deploy
npm install
npm run build
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete

# Your site is live at:
# http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

---

## ✅ Verification

### Test Backend
```bash
curl http://YOUR-EC2-IP/api/health
# Should return: {"status":"ok","mongodb":"connected"}
```

### Test Frontend
Open in browser:
```
http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com
```

You should see:
- ✅ "100% FREE TO USE" banner
- ✅ Security badges
- ✅ Product listings
- ✅ Login/Register works

---

## 🎉 Share with Friends!

**Your UAT Testing URLs:**
- Frontend: `http://YOUR-BUCKET-NAME.s3-website-us-east-1.amazonaws.com`
- Backend API: `http://YOUR-EC2-IP/api`

---

## 🔄 Making Updates

### Code Changes - Automated Way
```bash
# On your Mac:
cd /Users/faviananoronha/Developer/rental-marketplace

# Make it executable (one time)
chmod +x deploy.sh

# Run deployment script
./deploy.sh

# Follow the prompts - it will:
# 1. Push code to GitHub
# 2. SSH to EC2 and update backend
# 3. Build and upload frontend to S3
```

### Code Changes - Manual Way

**Backend:**
```bash
# Make changes locally, then:
git add -A
git commit -m "your changes"
git push origin main

# SSH to EC2:
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@YOUR-EC2-IP
cd ~/rental-marketplace
git pull origin main
cd server
npm install
pm2 restart rental-backend
```

**Frontend:**
```bash
# Make changes locally, then:
cd client
npm run build
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete
```

---

## 💰 Cost Monitoring

### ✅ FREE Tier Limits:
- **MongoDB Atlas:** 512MB storage (enough for 10k+ users)
- **EC2:** 750 hours/month (24/7 for one t2.micro)
- **S3:** 5GB storage, 20k GET requests/month
- **Data Transfer:** 100GB/month out from AWS

### Set Billing Alert:
```bash
1. AWS Console → Billing Dashboard
2. Billing Preferences → Enable alerts
3. CloudWatch → Create Alarm
4. Set threshold: $1 USD
5. Add your email
```

**You'll get notified if you go over $1!**

---

## 🐛 Troubleshooting

### Backend not working?
```bash
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@YOUR-EC2-IP
pm2 logs rental-backend
# Check for errors
```

### Frontend shows "Network Error"?
```bash
# Check CORS - verify .env.production has correct EC2 IP
# Rebuild and redeploy:
cd client
npm run build
aws s3 sync dist/ s3://YOUR-BUCKET-NAME/ --delete
```

### Can't SSH to EC2?
```bash
# Check security group - must allow SSH from your IP
# Verify key permissions:
chmod 400 ~/Downloads/rental-marketplace-key.pem
```

---

## 📞 Need Help?

**Common Issues:**
1. **CORS Error:** Update VITE_API_URL in client/.env.production
2. **MongoDB Connection Failed:** Check Network Access whitelist (0.0.0.0/0)
3. **Port 5001 not accessible:** Check EC2 Security Group rules
4. **S3 403 Forbidden:** Verify bucket policy is set correctly

**Check logs:**
```bash
# Backend logs
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@YOUR-EC2-IP 'pm2 logs rental-backend --lines 50'

# MongoDB Atlas
Go to Atlas Dashboard → Metrics
```

---

## 🎯 Next Steps (Optional)

1. **Custom Domain:** Point your domain to S3/CloudFront
2. **SSL Certificate:** Use AWS Certificate Manager (FREE)
3. **Email OTP:** Configure Gmail SMTP with app password
4. **Monitoring:** Setup CloudWatch alerts
5. **Backup:** Enable automated MongoDB Atlas backups

---

## 💡 Pro Tips

- **Save costs:** Stop EC2 when not testing (restart anytime)
- **Performance:** Add CloudFront for faster global access
- **Security:** Regularly update packages: `npm audit fix`
- **Backup:** MongoDB Atlas auto-backups included in free tier

---

**Estimated Total Time:** 45 minutes
**Monthly Cost:** $0.00 (FREE!)
**Perfect for:** UAT testing with 10-50 users

Need detailed steps? See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md)
