# 🚀 Deploy Frontend to AWS S3 (Manual - 15 Minutes)

## Step 1: Build Your Frontend (5 minutes)

Open your terminal and run:
```bash
cd /Users/faviananoronha/Developer/rental-marketplace/client
npm run build
```

This creates a `dist` folder with all your production files.

---

## Step 2: Create S3 Bucket (5 minutes)

1. **Go to AWS Console**: https://console.aws.amazon.com/
2. **Log in** with your AWS account
3. **Go to S3**: Search for "S3" in the top search bar
4. **Click "Create bucket"**

### Bucket Configuration:
```
Bucket name: rental-marketplace-demo
  (Must be globally unique - add your name if taken: rental-marketplace-faviana)

Region: Choose closest to you
  - US East (N. Virginia) us-east-1
  - Or your preferred region

Block Public Access: UNCHECK "Block all public access"
  ⚠️ You'll see a warning - that's OK, acknowledge it

Leave everything else as default

Click "Create bucket"
```

---

## Step 3: Enable Static Website Hosting (2 minutes)

1. **Click on your bucket name** (e.g., rental-marketplace-demo)
2. **Go to "Properties" tab**
3. **Scroll down to "Static website hosting"**
4. **Click "Edit"**
5. **Enable it**:
   ```
   Static website hosting: Enable
   Index document: index.html
   Error document: index.html
   ```
6. **Click "Save changes"**
7. **Scroll back to "Static website hosting"** and **COPY the endpoint URL**
   - It looks like: http://rental-marketplace-demo.s3-website-us-east-1.amazonaws.com
   - **SAVE THIS URL!**

---

## Step 4: Set Bucket Policy (2 minutes)

1. **Go to "Permissions" tab**
2. **Scroll to "Bucket policy"**
3. **Click "Edit"**
4. **Paste this policy** (replace `YOUR-BUCKET-NAME` with your actual bucket name):

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

Example if your bucket is `rental-marketplace-demo`:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::rental-marketplace-demo/*"
        }
    ]
}
```

5. **Click "Save changes"**

---

## Step 5: Upload Your Website (1 minute)

1. **Go to "Objects" tab**
2. **Click "Upload"**
3. **Click "Add files"** and **"Add folder"**
4. **Navigate to**: `/Users/faviananoronha/Developer/rental-marketplace/client/dist`
5. **Select ALL files and folders inside `dist`**:
   - index.html
   - assets/ folder
   - vite.svg
   - Any other files

6. **Click "Upload"**
7. **Wait for upload to complete**
8. **Click "Close"**

---

## Step 6: Test Your Website! 🎉

Open the S3 website endpoint URL in your browser:
```
http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

Example:
```
http://rental-marketplace-demo.s3-website-us-east-1.amazonaws.com
```

You should see:
- ✅ Your rental marketplace homepage
- ✅ "100% FREE TO USE" banner
- ✅ Security badges
- ✅ Product listings
- ✅ Navigation working

---

## 📱 Share with Friends

**Your live website URL:**
```
http://YOUR-BUCKET-NAME.s3-website-REGION.amazonaws.com
```

Share this link with your friends for UAT testing! 🎉

---

## 🔄 Updating Your Website

When you make changes to the code:

1. **Rebuild:**
   ```bash
   cd /Users/faviananoronha/Developer/rental-marketplace/client
   npm run build
   ```

2. **Re-upload to S3:**
   - Go to S3 → Your bucket → Objects
   - Select all files
   - Click "Delete"
   - Confirm deletion
   - Click "Upload"
   - Upload all files from `dist` folder again

---

## ⚠️ Important Notes

### Backend Connection
Your frontend is currently configured to connect to **localhost:5001** for the backend. This means:
- ✅ Works fine for testing the frontend design and UI
- ❌ API calls won't work when friends access it (they don't have your backend)

**For full functionality**, you need to either:
1. Keep your local backend running and share through ngrok (temporary)
2. Deploy backend to EC2 (permanent - see AWS_DEPLOYMENT.md)

### Testing What Works Now
With just frontend on S3, your friends can see:
- ✅ Homepage with all design and animations
- ✅ Navigation and routing
- ✅ Static content and images
- ✅ UI/UX design
- ❌ Login/register (needs backend)
- ❌ Product listings (needs backend API)
- ❌ Actual functionality (needs backend)

---

## 💰 Cost

**S3 Static Website Hosting:**
- Storage: First 5GB FREE for 12 months
- Requests: 20,000 GET, 2,000 PUT per month FREE
- Your frontend build: ~15MB
- **Total Cost: $0.00** ✅

---

## 🐛 Troubleshooting

### Can't access the website?
- Check bucket policy is set correctly
- Verify Static website hosting is enabled
- Check you're using the website endpoint URL (not the bucket URL)

### Website shows "AccessDenied"?
- Verify bucket policy is set
- Check "Block public access" is OFF
- Make sure you saved the bucket policy

### Website loads but shows blank page?
- Check browser console (F12) for errors
- Verify all files uploaded correctly
- Check index.html is in the root (not in a subfolder)

---

## ✅ Success Checklist

- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Bucket policy set for public access
- [ ] All files from `dist` folder uploaded
- [ ] Website accessible via S3 endpoint URL
- [ ] Can share URL with friends

---

**Next Steps:**
1. Test the frontend deployment
2. If you want full functionality, deploy backend to EC2 (see AWS_DEPLOYMENT.md)
3. Or use ngrok to temporarily expose your local backend

**Need help?** Let me know! 🚀
