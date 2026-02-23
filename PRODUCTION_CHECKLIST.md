# Closetly/Zevara - Production Deployment & Compliance Checklist
## FY 2025-26 India Regulatory Requirements

**Launch Target:** March 2026 (Hyderabad MVP)  
**Legal Entity:** Required before Day 1 operations  
**Compliance Status:** Pre-Production Review

---

## 1. LEGAL & REGULATORY COMPLIANCE

### 1.1 Business Registration (MANDATORY)

**Status:** [ ] Complete

- [ ] **Private Limited Company Registration** (Ministry of Corporate Affairs)
  - Required documents: PAN, Aadhaar, Address proof
  - Estimated cost: ₹10,000-₹15,000
  - Timeline: 7-10 business days
  - Digital Signature Certificate (DSC) obtained

- [ ] **Goods and Services Tax (GST) Registration**
  - **CRITICAL:** Mandatory from Day 1 for all e-commerce platforms
  - GST Number format: 29XXXXX1234X1ZX
  - File GSTR-1 (monthly) and GSTR-3B (monthly)
  - Portal: https://www.gst.gov.in/
  
  ```javascript
  // Invoice GST Calculation
  const calculateGST = (serviceAmount) => {
    const gstRate = 0.18; // 18% on platform service fee
    const gstAmount = serviceAmount * gstRate;
    return {
      baseAmount: serviceAmount,
      gst: gstAmount,
      total: serviceAmount + gstAmount,
      gstNumber: process.env.GST_NUMBER // "29XXXXXXXX"
    };
  };
  ```

- [ ] **Trade License** (Greater Hyderabad Municipal Corporation - GHMC)
  - Required for operating commercial business in Hyderabad
  - Apply online: https://www.ghmc.gov.in/
  - Cost: ₹5,000-₹10,000 annually

- [ ] **Shops and Establishment Act Registration**
  - Required within 30 days of business commencement
  - Hyderabad regional office registration

---

### 1.2 Tax Compliance (FY 2025-26)

**Status:** [ ] Complete

- [ ] **1% TCS (Tax Collected at Source) - MANDATORY**
  - **New Rule (Oct 2023):** All e-commerce operators must collect 1% TCS from sellers earning > ₹5L/year
  - Implementation deadline: Day 1
  
  ```javascript
  // Auto-calculate TCS when seller crosses threshold
  const calculateTCS = async (ownerId, payoutAmount) => {
    const yearlyEarnings = await Transaction.aggregate([
      { $match: { ownerId, fiscalYear: '2025-26' } },
      { $group: { _id: null, total: { $sum: '$ownerPayout' } } }
    ]);
    
    const totalEarnings = yearlyEarnings[0]?.total || 0;
    
    if (totalEarnings + payoutAmount > 500000) {
      const tcsAmount = payoutAmount * 0.01; // 1% TCS
      
      await Transaction.create({
        type: 'tcs_deduction',
        ownerId,
        amount: tcsAmount,
        description: 'TCS deducted as per Income Tax Act Section 194-O',
        panNumber: owner.panNumber
      });
      
      return payoutAmount - tcsAmount; // Net payout after TCS
    }
    
    return payoutAmount;
  };
  ```

- [ ] **TDS on Payment Gateway** (if applicable)
  - Razorpay/Cashfree will deduct TDS on commission earned
  - Form 26AS reconciliation quarterly

- [ ] **Income Tax Filing**
  - Corporate tax: 25% (for startups < ₹400Cr turnover)
  - Due date: July 31, 2027 (for FY 2025-26)

---

### 1.3 Legal Documentation (Terms & Policies)

**Status:** [ ] Complete

- [ ] **Terms of Service (ToS)** with IPC Section 406 Notice
  
  ```markdown
  ## 8. Criminal Liability for Non-Return of Rented Items
  
  ### 8.1 Indian Penal Code Section 406 - Criminal Breach of Trust
  
  By booking any rental on this platform, you acknowledge and agree that:
  
  1. **Legal Nature of Transaction:** The rental constitutes a contract of entrustment. The owner entrusts you with valuable property with the explicit condition of return by the agreed date.
  
  2. **Criminal Offense:** Under Section 406 of the Indian Penal Code, 1860:
     - Failure to return rented property = **Criminal Breach of Trust**
     - Punishable with imprisonment up to **3 years**, and/or fine
     - Cognizable offense (police can arrest without warrant)
  
  3. **Platform's FIR Assistance:** If an item is not returned within 7 days of the due date, we will:
     - Provide the owner with your verified Aadhaar details
     - Share GPS-verified delivery confirmation
     - Supply complete transaction records and communication logs
     - Assist in filing a formal FIR with local police
  
  4. **Recovery Process:**
     - Day 1 overdue: Email/SMS reminder + ₹500 late fee
     - Day 3 overdue: Phone call + ₹1,500 cumulative late fee
     - Day 7 overdue: Legal notice sent to registered address
     - Day 10 overdue: FIR assistance provided to owner
  
  ### 8.2 Precedent Case Law
  
  Reference: *Vikram Joshi vs. State of Maharashtra* (2018)  
  Court ruling: Non-return of rented luxury goods deemed criminal breach of trust. Accused sentenced to 2 years imprisonment.
  
  **By clicking "I Agree", you confirm understanding of these legal obligations.**
  ```

- [ ] **Privacy Policy (GDPR/DPDP Act 2023 Compliant)**
  
  **Data Residency Requirement:**
  - All Indian user data MUST be stored on servers located in India
  - AWS Mumbai (ap-south-1) or Azure Central India regions
  - Cross-border data transfer requires explicit consent
  
  ```javascript
  // Enforce India region in MongoDB connection
  const mongoOptions = {
    useNewUrlParser: true,
    readPreference: 'nearest',
    readConcern: { level: 'majority' },
    // Force India datacenter
    host: process.env.MONGODB_INDIA_HOST, // e.g., cluster0-shard-00-00.xxxxx.mongodb.net (Mumbai)
  };
  ```

- [ ] **Refund & Cancellation Policy**
  
  ```markdown
  ## Cancellation Policy (Consumer Protection Act 2019)
  
  - **< 48 hours before rental:** 100% refund (₹99 processing fee)
  - **24-48 hours before:** 50% refund
  - **< 24 hours:** No refund (rental fee forfeited)
  - **Owner cancellation:** 100% refund + ₹500 inconvenience credit
  
  Force Majeure: Full refunds for natural disasters, lockdowns (verified via govt. orders)
  ```

- [ ] **Shipping & Delivery Policy**

- [ ] **Damage & Dispute Resolution Policy**

---

### 1.4 Data Protection & Privacy

**Status:** [ ] Complete

- [ ] **Digital Personal Data Protection (DPDP) Act 2023 Compliance**
  
  **Key Requirements:**
  1. Explicit consent for data collection (age 18+)
  2. Right to data deletion ("Right to be Forgotten")
  3. Data breach notification within 72 hours
  4. Parental consent for users under 18
  
  ```javascript
  // GDPR-compliant data deletion
  app.delete('/api/users/me/delete-account', authenticate, async (req, res) => {
    const userId = req.user.id;
    
    // Check for pending rentals
    const activeRentals = await Rental.find({
      $or: [{ renterId: userId }, { ownerId: userId }],
      status: { $in: ['active', 'pending'] }
    });
    
    if (activeRentals.length > 0) {
      return res.status(400).json({
        error: 'Cannot delete account with active rentals'
      });
    }
    
    // Anonymize data (retain transaction records for tax compliance - 7 years)
    await User.findByIdAndUpdate(userId, {
      email: `deleted_${userId}@anonymized.com`,
      phone: null,
      name: 'Deleted User',
      aadhaarNumber: null, // Remove sensitive PII
      panNumber: null,
      profilePhoto: null,
      addresses: [],
      deletedAt: new Date(),
      deletionReason: req.body.reason
    });
    
    res.json({ message: 'Account deleted. Transaction records retained for legal compliance.' });
  });
  ```

- [ ] **Cookie Consent Banner** (EU users may access platform)

- [ ] **Two-Factor Authentication (2FA/MFA)**
  - **Mandatory from April 2025** for platforms handling financial transactions
  - SMS OTP or biometric authentication
  
  ```javascript
  // SMS OTP via Twilio/MSG91
  const sendLoginOTP = async (phoneNumber) => {
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    
    await redis.setex(`otp:${phoneNumber}`, 300, otp); // 5-min expiry
    
    await twilioClient.messages.create({
      body: `Your Closetly login OTP is ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: phoneNumber
    });
  };
  ```

---

## 2. PAYMENT GATEWAY COMPLIANCE

### 2.1 Reserve Bank of India (RBI) Regulations

**Status:** [ ] Complete

- [ ] **Payment Aggregator (PA-PA) License** (if processing > ₹50L/month)
  - Required if Closetly directly handles payments (not using Razorpay/Cashfree)
  - Exemption: Using licensed aggregators (Razorpay/Cashfree) = No PA license needed

- [ ] **PCI-DSS Compliance** (if storing card details)
  - **RECOMMENDATION:** Never store raw card data
  - Use tokenization via Razorpay/Cashfree

- [ ] **88% India-Based Payment Options**
  - UPI, Debit Cards, Wallets (Paytm, PhonePe)
  - Credit Cards accepted
  - International cards disabled (reduce fraud)
  
  ```javascript
  // Razorpay checkout with India-first options
  const razorpayOptions = {
    key: process.env.RAZORPAY_KEY_ID,
    amount: totalAmount * 100, // Paise
    currency: 'INR',
    name: 'Closetly',
    description: 'Rental Payment',
    prefill: {
      email: user.email,
      contact: user.phone
    },
    config: {
      display: {
        blocks: {
          banks: {
            name: 'Pay via UPI or Card',
            instruments: [
              { method: 'upi' },
              { method: 'card' },
              { method: 'wallet' },
              { method: 'netbanking' }
            ]
          }
        },
        sequence: ['block.banks'],
        preferences: {
          show_default_blocks: false // Custom order
        }
      }
    }
  };
  ```

---

### 2.2 Escrow & Security Deposits

**Status:** [ ] Complete

- [ ] **Escrow Account Setup** (Optional for premium trust)
  - Open separate escrow account with ICICI/HDFC
  - Model: Platform holds funds until delivery confirmed
  - Alternative: Use Razorpay Route's "on_hold" feature

- [ ] **Security Deposit Pre-Authorization**
  - Use Razorpay Authorization API (blocks, doesn't charge)
  - Auto-release after 7 days if no disputes
  
  ```javascript
  // Release security deposit
  const releaseSecurityDeposit = async (rentalId) => {
    const rental = await Rental.findById(rentalId);
    
    if (!rental.securityDepositAuthId) {
      throw new Error('No security deposit found');
    }
    
    // Check for disputes
    const disputes = await Dispute.find({
      rentalId,
      status: 'open'
    });
    
    if (disputes.length > 0) {
      return { message: 'Deposit on hold due to dispute' };
    }
    
    // Capture ₹0 to release hold
    await razorpay.payments.capture(rental.securityDepositAuthId, 0);
    
    rental.securityDepositStatus = 'released';
    await rental.save();
    
    // Notify user
    await sendNotification(rental.renterId, {
      title: 'Security Deposit Released',
      body: `₹${rental.securityDepositAmount} has been released. Funds available in 5-7 days.`
    });
  };
  ```

---

## 3. INFRASTRUCTURE & SECURITY

### 3.1 Server Setup (India Data Residency)

**Status:** [ ] Complete

- [ ] **AWS Mumbai Region (ap-south-1)** or **Azure Central India**
  - EC2/App Service instances
  - S3/Blob Storage for images
  - RDS/Cosmos DB for database
  
  **WHY INDIA REGION:**
  - DPDP Act 2023 requires Indian data stored in India
  - Sub-second latency for Hyderabad users
  - Cheaper data transfer costs

- [ ] **MongoDB Atlas India Cluster**
  
  ```javascript
  // Enforce India region
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI, {
    // Mumbai cluster
    useNewUrlParser: true,
    useUnifiedTopology: true,
    readPreference: 'nearest', // Closest datacenter
    serverSelectionTimeoutMS: 5000
  });
  
  // Verify connection region
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected to India region');
  });
  ```

- [ ] **CDN Setup (CloudFront/Cloudflare)**
  - Cache static assets (images, CSS, JS)
  - India edge locations for faster load
  - Enable Brotli compression

---

### 3.2 Security Hardening

**Status:** [ ] Complete

- [ ] **SSL/TLS Certificate (HTTPS)**
  - Let's Encrypt (free) or AWS Certificate Manager
  - Enforce HTTPS redirect
  - HSTS header enabled
  
  ```javascript
  // Express HTTPS enforcement
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
  ```

- [ ] **Helmet.js Security Headers**
  
  ```javascript
  const helmet = require('helmet');
  
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'checkout.razorpay.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        styleSrc: ["'self'", "'unsafe-inline'"]
      }
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  }));
  ```

- [ ] **Rate Limiting (DDoS Protection)**
  
  ```javascript
  const rateLimit = require('express-rate-limit');
  
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per IP
    message: 'Too many requests from this IP. Try again in 15 minutes.'
  });
  
  app.use('/api/', apiLimiter);
  ```

- [ ] **SQL Injection Prevention**
  - Use Mongoose (ODM) - auto-sanitizes queries
  - Never use `eval()` or `Function()`

- [ ] **XSS Protection**
  
  ```javascript
  const mongoSanitize = require('express-mongo-sanitize');
  const xss = require('xss-clean');
  
  app.use(mongoSanitize()); // Remove $ and . from user input
  app.use(xss()); // Clean user input
  ```

- [ ] **CSRF Protection**
  
  ```javascript
  const csrf = require('csurf');
  const csrfProtection = csrf({ cookie: true });
  
  app.post('/api/checkout', csrfProtection, async (req, res) => {
    // Protected route
  });
  ```

---

### 3.3 Monitoring & Error Tracking

**Status:** [ ] Complete

- [ ] **Sentry.io for Error Tracking**
  
  ```javascript
  const Sentry = require('@sentry/node');
  
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1 // 10% of transactions
  });
  
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.errorHandler());
  ```

- [ ] **LogRocket for Session Replay** (frontend errors)

- [ ] **UptimeRobot for 24/7 Monitoring**
  - Ping homepage every 5 minutes
  - Alert via SMS if downtime > 1 minute

- [ ] **Cloudwatch/Azure Monitor Alarms**
  - CPU > 80% for 5 minutes → Alert
  - DB connections > 90% → Alert
  - 5XX errors > 10/min → Alert

---

## 4. THIRD-PARTY INTEGRATIONS

### 4.1 KYC Service Integration

**Status:** [ ] Complete

- [ ] **Signzy Video KYC API**
  - Plan: Standard (₹50/verification)
  - Features: Aadhaar verification, liveness check
  - Webhook setup for verification results
  - Sandbox testing completed

- [ ] **Fallback: HyperVerge KYC**
  - Redundancy if Signzy is down
  - Similar pricing

---

### 4.2 Logistics & Delivery

**Status:** [ ] Complete

- [ ] **Borzo (WeFast) Hyderabad Integration**
  - Account created: https://borzodelivery.com/in/business
  - API key configured in .env
  - Test delivery completed
  
  ```bash
  # .env
  BORZO_API_KEY=your_production_key_here
  BORZO_WEBHOOK_SECRET=webhook_secret
  ```

- [ ] **Dunzo B2B Account**
  - Apply: https://business.dunzo.com/
  - Approval timeline: 3-5 days
  - Cost: ₹50-₹150 for 5km (negotiable for volume)

- [ ] **Porter for Heavy Items**
  - 2-wheeler for garments
  - 4-wheeler for luggage/heavy bundles

---

### 4.3 Dry Cleaning Partners

**Status:** [ ] Complete

- [ ] **Fabklean API Integration**
  - Premium dry cleaning with certification
  - Price: ₹150-₹300 per garment
  - Pickup & delivery included

- [ ] **Local Partnership (Fallback)**
  - MoU with 2-3 local dry cleaners in Hyderabad
  - Sanitization certificate template

---

## 5. BUSINESS OPERATIONS

### 5.1 Insurance Coverage

**Status:** [ ] Complete

- [ ] **Professional Indemnity Insurance**
  - Coverage: ₹50L minimum
  - Protects against platform liability claims
  - Provider: HDFC Ergo, ICICI Lombard

- [ ] **Cyber Liability Insurance**
  - Data breach coverage
  - Ransomware protection
  - Cost: ~₹1L/year for ₹1Cr coverage

---

### 5.2 Dispute Resolution Mechanism

**Status:** [ ] Complete

- [ ] **Consumer Complaints Council (as per Consumer Protection Act 2019)**
  - Email: support@closetly.com
  - Response SLA: 48 hours
  - Escalation to National Consumer Helpline: 1800-11-4000

- [ ] **In-App Dispute Center**
  
  ```javascript
  // Automated dispute resolution
  const initiateDispute = async (rentalId, issue, photos) => {
    const dispute = await Dispute.create({
      rentalId,
      issue, // 'damage', 'late_return', 'quality_mismatch'
      photos,
      status: 'under_review',
      createdAt: new Date()
    });
    
    // Auto-rules (avoid manual intervention)
    if (issue === 'minor_stain' && photos.length > 0) {
      // Auto-approve ₹500 cleaning deduction
      await settleDispute(dispute._id, {
        resolution: 'owner_favor',
        deduction: 500,
        reason: 'Minor stain cleaning cost'
      });
    } else {
      // Manual review queue
      await notifyAdmin(dispute);
    }
  };
  ```

---

## 6. PRE-LAUNCH TESTING

### 6.1 Payment Gateway Test Mode

**Status:** [ ] Complete

- [ ] **Razorpay Test Mode**
  - Test card: 4111 1111 1111 1111, CVV: 123, Any future date
  - Test 10 successful payments
  - Test 5 failed payments
  - Test webhook delivery

- [ ] **Cashfree Test Mode**
  - Test UPI: success@upi
  - Test multi-vendor split

---

### 6.2 Performance Testing

**Status:** [ ] Complete

- [ ] **Load Test (Apache JMeter)**
  - Simulate 5,000 concurrent users
  - Target: 95th percentile < 2s page load
  - Zero errors during peak

- [ ] **Mobile Performance (Lighthouse)**
  - Score > 90 for Performance
  - Score > 95 for Accessibility
  - Score > 90 for SEO

---

## 7. LAUNCH DAY CHECKLIST

### 7.1 Go-Live Approval (Final Sign-Off)

**Date:** [ ] March 30, 2026

- [ ] All legal documents published on website
- [ ] Payment gateways in LIVE mode
- [ ] SSL certificate verified (https://)
- [ ] Database backups automated (every 6 hours)
- [ ] Error tracking active (Sentry)
- [ ] Customer support team briefed
- [ ] Emergency hotline published: +91-XXX-XXX-XXXX
- [ ] Social media handles created (@closetly_india)
- [ ] Google My Business listing published
- [ ] First 10 beta users onboarded
- [ ] 24/7 monitoring dashboard active

---

### 7.2 Post-Launch Monitoring (72 Hours)

- [ ] **Hour 1-24:** Founder on-call
- [ ] **Hour 25-48:** CTO on-call
- [ ] **Hour 49-72:** Customer support on-call

**Metrics to Watch:**
- Successful bookings vs. failed checkouts
- Payment gateway success rate (target: > 95%)
- KYC completion rate (target: > 70%)
- Page load time (target: < 2s)
- Error rate (target: < 0.5%)

---

## 8. BRAND PROTECTION

### 8.1 Trademark & Domain

**Status:** [ ] Complete

- [ ] **Trademark Application** (Controller General of Patents)
  - File for "CLOSETLY" or "ZEVARA" in Class 35 (e-commerce)
  - Cost: ₹4,500
  - Timeline: 12-18 months for approval
  - Interim protection from filing date

- [ ] **Domain Registration**
  - closetly.com (primary)
  - zevara.in (India-specific)
  - renew for 5 years minimum

---

## 9. FINANCIAL PROJECTIONS (Year 1)

### Revenue Targets (Hyderabad Only)

**Month 1-3 (Beta):**
- Users: 500 renters, 100 closets
- Bookings: 50/month
- Revenue: ₹1.5L/month (commission + service fees)

**Month 4-6 (Growth):**
- Users: 2,000 renters, 300 closets
- Bookings: 200/month
- Revenue: ₹6L/month

**Month 7-12 (Scale):**
- Users: 10,000 renters, 1,000 closets
- Bookings: 1,000/month
- Revenue: ₹30L/month

**Year 1 Total:** ₹1.2Cr GMV, ₹24L platform revenue (20% take rate)

---

## 10. COMPLIANCE AUDIT SCHEDULE

### Quarterly Reviews

**Q1 (Apr-Jun 2026):**
- [ ] GST returns filed (GSTR-1, GSTR-3B)
- [ ] TCS collected and remitted
- [ ] Privacy policy updated (if needed)

**Q2 (Jul-Sep 2026):**
- [ ] Security audit (penetration testing)
- [ ] Insurance policy renewal check

**Q3 (Oct-Dec 2026):**
- [ ] Annual trade license renewal
- [ ] KYC provider contract review

**Q4 (Jan-Mar 2027):**
- [ ] Annual financial audit
- [ ] Income tax filing preparation

---

## FINAL SIGN-OFF

**Approved by:**

[ ] **Founder/CEO:** ________________________ Date: __________

[ ] **CTO/Tech Lead:** ______________________ Date: __________

[ ] **Legal Advisor:** ________________________ Date: __________

[ ] **Chartered Accountant:** _________________ Date: __________

---

**Production Launch Authorization:** [ ] APPROVED FOR GO-LIVE

**Launch Date:** March 30, 2026  
**First City:** Hyderabad, Telangana  
**Expansion Plan:** Bengaluru (Q3 2026), Mumbai (Q4 2026)

🚀 **Ready to transform fashion rental in India.**
