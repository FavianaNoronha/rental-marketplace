# AWS Free Tier Deployment Guide

## 🎯 Overview
Deploy your rental marketplace on AWS **100% FREE** using AWS Free Tier services for UAT testing with friends.

### Free Tier Services Used:
- **MongoDB Atlas** (Free Tier: 512MB storage, shared cluster)
- **AWS EC2** (t2.micro: 750 hours/month free for 12 months)
- **AWS S3** (5GB storage, 20k GET requests/month)
- **AWS CloudFront** (1TB data transfer, 10M requests/month)

---

## 📋 Prerequisites

1. **AWS Account** - [Sign up here](https://aws.amazon.com/free/) if you don't have one
2. **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas/register) (free forever)
3. **Domain (Optional)** - Or use AWS-provided URLs

---

## 🗄️ Step 1: Setup MongoDB Atlas (Database)

### 1.1 Create Free Cluster
```bash
1. Go to https://cloud.mongodb.com/
2. Sign up / Log in
3. Click "Build a Database"
4. Select "M0 FREE" tier (512MB storage)
5. Choose AWS as cloud provider
6. Select region closest to your target users (e.g., us-east-1)
7. Name your cluster: "rental-marketplace-cluster"
8. Click "Create"
```

### 1.2 Configure Security
```bash
# Add IP Whitelist
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

# Create Database User
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: rentaluser
5. Password: (generate strong password - save it!)
6. Database User Privileges: "Atlas Admin"
7. Click "Add User"
```

### 1.3 Get Connection String
```bash
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy connection string:
   mongodb+srv://rentaluser:<password>@rental-marketplace-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority

5. Replace <password> with your actual password
6. Save this for later!
```

---

## 🖥️ Step 2: Deploy Backend on EC2

### 2.1 Launch EC2 Instance
```bash
# In AWS Console
1. Go to EC2 Dashboard
2. Click "Launch Instance"
3. Name: "rental-marketplace-backend"
4. Select: "Ubuntu Server 22.04 LTS (HVM), SSD Volume Type"
5. Instance type: "t2.micro" (Free tier eligible)
6. Key pair: Create new key pair
   - Name: "rental-marketplace-key"
   - Type: RSA
   - Format: .pem (for Mac/Linux) or .ppk (for Windows)
   - Download and SAVE this file!
7. Network Settings:
   - Allow SSH (port 22) from your IP
   - Allow HTTP (port 80) from anywhere
   - Allow HTTPS (port 443) from anywhere
   - Add custom TCP rule for 5001 from anywhere
8. Storage: 8 GB (default free tier)
9. Click "Launch Instance"
```

### 2.2 Connect to EC2
```bash
# On your Mac terminal
chmod 400 ~/Downloads/rental-marketplace-key.pem
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>

# You'll see: ubuntu@ip-xxx-xxx-xxx-xxx:~$
```

### 2.3 Install Node.js on EC2
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node -v  # Should show v20.x.x
npm -v   # Should show 10.x.x

# Install PM2 (process manager to keep app running)
sudo npm install -g pm2
```

### 2.4 Deploy Backend Code
```bash
# Install git
sudo apt install -y git

# Clone your repository
cd ~
git clone https://github.com/<YOUR-USERNAME>/rental-marketplace.git
cd rental-marketplace/server

# Install dependencies
npm install

# Create production .env file
nano .env
```

Paste this content (update MongoDB URI):
```env
NODE_ENV=production
PORT=5001
MONGODB_URI=mongodb+srv://rentaluser:<YOUR-PASSWORD>@rental-marketplace-cluster.xxxxx.mongodb.net/rental-marketplace?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-minimum-32-characters
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-also-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Email Configuration (optional - use Gmail for testing)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@rentalmarketplace.com
```

Save with `Ctrl+X`, then `Y`, then `Enter`.

### 2.5 Start Backend with PM2
```bash
# Start the application
pm2 start server.js --name rental-backend

# Make it start on system reboot
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs rental-backend
```

### 2.6 Setup Nginx Reverse Proxy (Optional but Recommended)
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/rental-marketplace
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name <YOUR-EC2-PUBLIC-IP>;

    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $http_remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/rental-marketplace /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Backend API is now live at:** `http://<YOUR-EC2-PUBLIC-IP>/api`

---

## 🌐 Step 3: Deploy Frontend on S3 + CloudFront

### 3.1 Update Frontend API URL
On your local machine:
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/client

# Create production environment file
nano .env.production
```

Add:
```env
VITE_API_URL=http://<YOUR-EC2-PUBLIC-IP>/api
```

### 3.2 Build Frontend
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/client
npm run build

# This creates a 'dist' folder with optimized production files
```

### 3.3 Create S3 Bucket
```bash
# In AWS Console
1. Go to S3
2. Click "Create bucket"
3. Bucket name: "rental-marketplace-frontend" (must be globally unique)
4. Region: Same as your EC2 instance (e.g., us-east-1)
5. Uncheck "Block all public access"
6. Acknowledge the warning
7. Click "Create bucket"
```

### 3.4 Enable Static Website Hosting
```bash
1. Click on your bucket name
2. Go to "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable "Static website hosting"
6. Index document: index.html
7. Error document: index.html
8. Click "Save changes"
9. Note the "Bucket website endpoint" URL
```

### 3.5 Set Bucket Policy for Public Access
```bash
1. Go to "Permissions" tab
2. Scroll to "Bucket policy"
3. Click "Edit"
4. Paste this policy (replace YOUR-BUCKET-NAME):
```

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
        }
    ]
}
```

### 3.6 Upload Frontend Files
```bash
# Install AWS CLI on your Mac (if not already installed)
brew install awscli

# Configure AWS CLI
aws configure
# Enter your:
#   AWS Access Key ID
#   AWS Secret Access Key
#   Default region (e.g., us-east-1)
#   Default output format: json

# Upload files
cd /Users/faviananoronha/Developer/rental-marketplace/client
aws s3 sync dist/ s3://rental-marketplace-frontend/ --delete
```

### 3.7 Setup CloudFront (Optional - for faster access)
```bash
1. Go to CloudFront in AWS Console
2. Click "Create Distribution"
3. Origin Domain: Select your S3 bucket website endpoint
4. Origin Path: leave empty
5. Viewer Protocol Policy: "Redirect HTTP to HTTPS"
6. Allowed HTTP Methods: GET, HEAD, OPTIONS
7. Cache Policy: CachingOptimized
8. Click "Create Distribution"
9. Wait 5-15 minutes for deployment
10. Your CloudFront URL: https://dxxxxx.cloudfront.net
```

---

## ✅ Step 4: Test Your Deployment

### Backend Health Check
```bash
curl http://<YOUR-EC2-PUBLIC-IP>/api/health

# Should return: {"status":"ok","mongodb":"connected"}
```

### Frontend Access
Open in browser:
- **S3 Direct:** `http://rental-marketplace-frontend.s3-website-us-east-1.amazonaws.com`
- **CloudFront (if setup):** `https://dxxxxx.cloudfront.net`

### Test Full Flow
1. Open frontend URL
2. You should see "100% FREE TO USE" banner
3. Try to register a new user
4. Try to login
5. Browse products
6. Test creating a rental listing

---

## 🔄 Updating Your Application

### When you make code changes:

**Backend Updates:**
```bash
# SSH into EC2
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>

# Pull latest code
cd ~/rental-marketplace
git pull origin main

# Restart backend
cd server
npm install  # If new dependencies
pm2 restart rental-backend
```

**Frontend Updates:**
```bash
# On your local machine
cd /Users/faviananoronha/Developer/rental-marketplace

# Pull latest code
git pull origin main

# Rebuild
cd client
npm install  # If new dependencies
npm run build

# Upload to S3
aws s3 sync dist/ s3://rental-marketplace-frontend/ --delete

# Invalidate CloudFront cache (if using CloudFront)
aws cloudfront create-invalidation --distribution-id YOUR-DISTRIBUTION-ID --paths "/*"
```

---

## 📊 Monitoring & Logs

### Backend Logs
```bash
# SSH into EC2
ssh -i ~/Downloads/rental-marketplace-key.pem ubuntu@<YOUR-EC2-PUBLIC-IP>

# View logs
pm2 logs rental-backend

# Real-time logs
pm2 logs rental-backend --lines 100
```

### MongoDB Atlas Monitoring
```bash
1. Go to MongoDB Atlas Dashboard
2. Click "Metrics" tab
3. View:
   - Operations per second
   - Connections
   - Network traffic
   - Storage usage
```

### EC2 Monitoring
```bash
1. Go to EC2 Dashboard
2. Select your instance
3. Click "Monitoring" tab
4. View CPU, Network, Disk usage
```

---

## 💰 Cost Optimization Tips

### Stay Within Free Tier:
✅ **MongoDB Atlas:** Free tier (512MB) - enough for ~10k users
✅ **EC2 t2.micro:** 750 hours/month = 24/7 for one instance
✅ **S3:** 5GB storage, 20k GET requests/month
✅ **CloudFront:** 1TB data transfer out, 10M requests/month

### Set Up Billing Alerts:
```bash
1. Go to AWS Billing Dashboard
2. Click "Billing Preferences"
3. Enable "Receive Billing Alerts"
4. Go to CloudWatch
5. Create Alarm for "EstimatedCharges" > $1
6. Add your email for notifications
```

---

## 🔒 Security Checklist

- [ ] Changed all default passwords
- [ ] MongoDB Atlas IP whitelist configured
- [ ] EC2 security group allows only necessary ports
- [ ] JWT secrets are strong and unique
- [ ] SSL/TLS enabled (use AWS Certificate Manager - free)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`
- [ ] PM2 monitoring enabled
- [ ] AWS billing alerts configured

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
pm2 logs rental-backend
# Check for MongoDB connection errors
# Verify .env file has correct MongoDB URI
```

### Frontend shows CORS errors?
```bash
# Add CORS middleware in server/server.js (already included)
# Verify VITE_API_URL in .env.production is correct
```

### Database connection timeout?
```bash
# Check MongoDB Atlas Network Access
# Ensure 0.0.0.0/0 is whitelisted
# Verify connection string format
```

### EC2 instance not accessible?
```bash
# Check Security Group rules
# Ensure SSH (22), HTTP (80), Custom (5001) ports are open
# Verify you're using correct public IP address
```

---

## 🎉 Share with Friends!

Once deployed, share these URLs:
- **Website:** `http://rental-marketplace-frontend.s3-website-us-east-1.amazonaws.com`
- **CloudFront (faster):** `https://dxxxxx.cloudfront.net`

**Test Credentials for UAT:**
Create test users through the registration page or seed the database with test data.

---

## 📞 Support

If you encounter issues:
1. Check logs: `pm2 logs rental-backend`
2. Verify MongoDB Atlas connection
3. Check EC2 security groups
4. Review AWS Free Tier limits
5. Check CORS configuration

**Estimated Setup Time:** 30-45 minutes

**Monthly Cost:** $0 (within Free Tier limits)

---

## 🚀 Next Steps (Optional)

1. **Custom Domain:** Use Route 53 or your domain registrar
2. **SSL Certificate:** AWS Certificate Manager (free)
3. **CI/CD Pipeline:** GitHub Actions for automatic deployments
4. **Monitoring:** AWS CloudWatch, Sentry.io (free tier)
5. **Email Service:** AWS SES (62k emails/month free)
