# AWS Free Tier Cost Monitoring

## 🎯 Stay 100% FREE - No Surprises!

This guide helps you monitor AWS usage and ensure you stay within the Free Tier limits.

---

## 📊 Free Tier Limits Overview

### MongoDB Atlas (FREE FOREVER)
```
✅ Storage: 512MB (enough for ~10,000 users)
✅ RAM: Shared
✅ Backup: Manual snapshots
✅ Cost: $0.00/month FOREVER

Usage Estimate for UAT:
- 10 users with 50 products each = ~50MB
- 1000 messages = ~5MB
- 100 rentals = ~2MB
Total: ~60MB (88% under limit) ✅
```

### AWS EC2 t2.micro
```
✅ Hours: 750/month (24/7 for 12 months)
✅ Storage: 30GB EBS
✅ Data Transfer: 15GB/month
✅ Cost: $0.00/month for 12 months

After 12 months: ~$8.50/month
OR switch to t3.micro ($7.50/month)
OR switch to Lightsail ($3.50/month)
```

### AWS S3
```
✅ Storage: 5GB
✅ GET Requests: 20,000/month
✅ PUT Requests: 2,000/month
✅ Data Transfer Out: 100GB/month
✅ Cost: $0.00/month for 12 months

Usage Estimate for UAT:
- Frontend build: ~15MB
- User uploads: ~50MB (with 10 users)
- GET requests: ~5,000/month (50 users × 100 visits)
Total: Well under limits ✅
```

### AWS CloudFront (Optional)
```
✅ Data Transfer Out: 1TB/month
✅ HTTP/HTTPS Requests: 10M/month
✅ Cost: $0.00/month for 12 months

Usage Estimate for UAT:
- 100 visits/day × 30 days = 3,000 visits
- 3MB per visit = ~9GB/month
Total: 99% under limit ✅
```

---

## 🚨 Set Up Billing Alerts (CRITICAL!)

### Step 1: Enable Billing Alerts
```bash
1. Go to AWS Console
2. Click your name (top right) → "Billing and Cost Management"
3. Click "Billing preferences" (left menu)
4. Check ✅ "Receive Billing Alerts"
5. Enter your email
6. Click "Save preferences"
```

### Step 2: Create CloudWatch Alarm
```bash
1. Go to CloudWatch service
2. Click "Alarms" → "Create Alarm"
3. Click "Select metric"
4. Choose "Billing" → "Total Estimated Charge"
5. Select "USD" metric
6. Click "Select metric"

7. Configure conditions:
   - Threshold type: Static
   - Whenever EstimatedCharges is: Greater
   - than: $1

8. Click "Next"

9. Configure actions:
   - Alarm state trigger: In alarm
   - Send notification to: Create new topic
   - Topic name: billing-alerts
   - Email: your-email@example.com
   - Click "Create topic"

10. Click "Next" → Name: "BillingAlert-$1"
11. Click "Create alarm"
12. CHECK YOUR EMAIL and confirm the subscription!
```

### Step 3: Create Multiple Alerts
Repeat Step 2 for these thresholds:
- $5 alert (warning)
- $10 alert (urgent - stop services)

---

## 📈 Monitoring Dashboard

### Check Daily (takes 2 minutes)

**1. MongoDB Atlas Usage**
```bash
1. Go to https://cloud.mongodb.com/
2. Click your cluster → "Metrics" tab
3. Check:
   ✅ Connections: Should be < 10 for UAT
   ✅ Storage: Should be < 100MB
   ✅ Operations: Normal activity pattern

🚨 Alert Level: Storage > 400MB (80% usage)
```

**2. EC2 Instance Usage**
```bash
1. Go to EC2 Dashboard
2. Select your instance → "Monitoring" tab
3. Check:
   ✅ CPU Utilization: Should be < 30%
   ✅ Network In/Out: Steady pattern
   ✅ Status Checks: All passing

🚨 Alert Level: CPU > 80% (may need optimization)
```

**3. S3 Storage**
```bash
1. Go to S3 → Click your bucket
2. Click "Metrics" tab
3. Check:
   ✅ Total size: Should be < 1GB
   ✅ Number of objects: Should be < 1000
   ✅ GET requests: Should be < 10k/month

🚨 Alert Level: Storage > 4GB (80% of free tier)
```

### Check Weekly (takes 5 minutes)

**Cost Explorer**
```bash
1. Go to "Billing and Cost Management"
2. Click "Cost Explorer"
3. View:
   - Month-to-date costs (should be $0.00)
   - Service breakdown
   - Daily cost trend

🚨 Any cost > $0.50 → Investigate immediately!
```

---

## 🎯 Stay Free Forever Checklist

### Daily Actions
- [ ] Check MongoDB Atlas dashboard (1 min)
- [ ] Verify EC2 instance is running smoothly (1 min)
- [ ] Check email for any AWS alerts (instant)

### Weekly Actions
- [ ] Review AWS Cost Explorer (5 min)
- [ ] Check S3 storage usage (2 min)
- [ ] Review CloudWatch metrics (3 min)
- [ ] Clear old uploaded files if needed (optional)

### Monthly Actions
- [ ] Review total usage vs Free Tier limits
- [ ] Clean up unused resources
- [ ] Update this month's usage log (see below)
- [ ] Plan for approaching 12-month Free Tier end

---

## 📝 Usage Log Template

Keep a simple log to track usage:

```
MONTH: January 2026
MongoDB Atlas: 65MB / 512MB (12%)
EC2 Hours: 744 / 750 hours (99%)
S3 Storage: 0.2GB / 5GB (4%)
S3 Requests: 3,200 / 20,000 (16%)
Total Cost: $0.00
Notes: All systems normal, UAT testing with 5 users
```

---

## 💰 Cost Breakdown (If You Exceed Free Tier)

**Scenario 1: Normal Usage After 12 Months**
```
MongoDB Atlas:        $0.00 (free forever)
EC2 t2.micro:        $8.50/month
S3 Storage (1GB):    $0.02/month
S3 Requests:         $0.00 (minimal)
CloudFront:          $0.00 (under free tier)
Data Transfer:       $0.00 (under free tier)
───────────────────────────────
TOTAL:               $8.52/month
```

**Scenario 2: Heavy Usage (100+ active users)**
```
MongoDB Atlas M10:   $0.08/hour = $57/month
EC2 t3.small:       $16.50/month
S3 Storage (10GB):   $0.23/month
CloudFront:          $1.00/month (est.)
───────────────────────────────
TOTAL:               $74.73/month
```

---

## 🛡️ Cost Optimization Tips

### 1. MongoDB Atlas
```bash
✅ Use indexes efficiently
✅ Clean up old test data regularly
✅ Archive old rentals after completion
✅ Compress images before upload
✅ Delete duplicate records

💡 Command to check DB size:
mongo "your-connection-string" --eval "db.stats(1024*1024)"
```

### 2. EC2 Instance
```bash
✅ Stop instance when not testing (saves hours)
✅ Use PM2 for efficient process management
✅ Monitor memory leaks
✅ Optimize backend queries
✅ Enable gzip compression

💡 Command to check memory usage:
ssh -i your-key.pem ubuntu@your-ec2-ip "free -h"
```

### 3. S3 Storage
```bash
✅ Compress images before upload (use tinypng.com)
✅ Delete old test uploads
✅ Implement automatic cleanup (delete files > 30 days)
✅ Use CloudFront for caching (reduces S3 requests)

💡 Command to check S3 size:
aws s3 ls s3://your-bucket --recursive --human-readable --summarize
```

### 4. Data Transfer
```bash
✅ Enable CloudFront caching
✅ Optimize image sizes (max 200KB per image)
✅ Minify JavaScript/CSS files
✅ Enable gzip/brotli compression
✅ Use lazy loading for images
```

---

## 🚨 Emergency: Cost Spike Detected!

If you receive a billing alert:

### Step 1: Identify the Culprit (5 minutes)
```bash
1. Go to Cost Explorer
2. Group by: Service
3. Check which service has costs
4. Go to that service's dashboard
5. Check usage metrics
```

### Step 2: Stop the Bleeding
```bash
# If EC2 is the problem:
aws ec2 stop-instances --instance-ids YOUR-INSTANCE-ID

# If S3 is the problem:
aws s3 rm s3://YOUR-BUCKET/large-files/ --recursive

# If Data Transfer is the problem:
# Pause CloudFront distribution temporarily
```

### Step 3: Analyze and Fix
```bash
1. Review CloudWatch logs
2. Check for infinite loops
3. Look for misconfigured services
4. Check for DDoS/abuse
5. Fix the root cause
6. Restart services
```

---

## 📞 Support Resources

### AWS Support
- **Free Tier FAQs:** https://aws.amazon.com/free/free-tier-faqs/
- **Cost Monitoring:** https://docs.aws.amazon.com/cost-management/
- **Billing Support:** Available even on free tier!

### MongoDB Atlas Support
- **Free Tier Docs:** https://docs.atlas.mongodb.com/tutorial/deploy-free-tier-cluster/
- **Support:** support@mongodb.com

### Community Help
- **AWS Reddit:** r/aws
- **Stack Overflow:** Tag [amazon-web-services]
- **MongoDB Forums:** community.mongodb.com

---

## ✅ Success Metrics

Your UAT deployment is successful when:
- [ ] Monthly cost = $0.00
- [ ] All billing alerts configured
- [ ] Daily monitoring routine established
- [ ] Usage < 50% of all free tier limits
- [ ] 10+ friends testing without issues
- [ ] No performance problems
- [ ] MongoDB storage growing predictably
- [ ] EC2 CPU usage < 30% average

---

## 🎓 Pro Tips

1. **Screenshot Your Metrics:** Take weekly screenshots of usage for records
2. **Set Calendar Reminders:** Monthly review of free tier expiration
3. **Document Everything:** Keep notes on what you deploy
4. **Test Cleanup Scripts:** Regularly test your data cleanup processes
5. **Have a Backup Plan:** Know how to export data and migrate if needed

---

**Remember:** With proper monitoring, you can run this application 100% FREE for 12 months of UAT testing! 🎉

**Next Steps:**
1. Set up all billing alerts NOW (don't skip this!)
2. Add monitoring to your daily routine
3. Share the app with friends
4. Enjoy FREE hosting! 🚀
