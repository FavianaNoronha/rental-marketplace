# Closetly/Zevara - Comprehensive Test Cases & QA Protocol
## Rental Platform Testing Framework (2026)

**Testing Philosophy:** Rental platforms require 5X more testing than sales sites due to the "Time" variable.

**Last Updated:** February 23, 2026  
**Test Coverage Target:** 85%+ for production deployment

---

## 1. BOOKING LOGIC TEST CASES

### 1.1 Date-First Booking Flow

**Test Scenario 1.1.1: Basic Date Range Selection**

```
Test ID: BOOK-001
Priority: P0 (Critical)
User Story: As a renter, I want to select my event dates first, so I only see items available for my complete rental period.

Preconditions:
- User is logged in
- User has completed KYC verification
- Database has products with various availability dates

Test Steps:
1. Navigate to homepage
2. Click "Select Your Event Dates" date picker
3. Select start date: Feb 24, 2026
4. Select end date: Feb 28, 2026
5. Click "Find Available Items"

Expected Result:
✓ System queries database for items available from Feb 24 00:00 to Feb 28 23:59
✓ Only shows items with NO bookings overlapping this range
✓ Displays "Available for Feb 24-28" badge on each card
✓ Filters out items blocked for cleaning within this range

Test Data:
- Product A: Available (no bookings)
- Product B: Booked Feb 20-23 (should SHOW - ends before)
- Product C: Booked Feb 25-27 (should HIDE - overlaps)
- Product D: Booked Mar 1-3 (should SHOW - starts after)
- Product E: Cleaning buffer until Feb 24 23:59 (should HIDE)
```

**Test Scenario 1.1.2: Edge Case - Same Day Booking**

```
Test ID: BOOK-002
Priority: P1 (High)

Test Steps:
1. Select start date: Feb 24, 2026
2. Select end date: Feb 24, 2026 (same day)
3. Click "Find Available Items"

Expected Result:
✓ System shows items available for single-day rental
✓ Pricing displays daily rate (not prorated)
✓ Delivery time shows "Same day delivery by 6 PM" if booked before 12 PM
```

**Test Scenario 1.1.3: Long-Term Rental (7+ Days)**

```
Test ID: BOOK-003
Priority: P1 (High)

Test Steps:
1. Select Feb 24 - Mar 5 (10 days)

Expected Result:
✓ System applies weekly discount (if configured)
✓ Shows message: "Long-term rental - Save 20% compared to daily rate"
✓ Security deposit increases for extended rentals
```

---

### 1.2 Cleaning Buffer Logic

**Test Scenario 1.2.1: Automatic Quarantine Period**

```
Test ID: CLEAN-001
Priority: P0 (Critical)

Preconditions:
- Product A is returned on Feb 10, 2026 at 2:30 PM
- System is configured with 48-hour cleaning buffer

Test Steps:
1. Query availability for Product A
2. Attempt to book Feb 11 (next day)
3. Attempt to book Feb 12 (2 days later)

Expected Result:
✓ Feb 11 booking: BLOCKED with message "Item in sanitization. Available from Feb 12"
✓ Feb 12 booking: ALLOWED (48 hours elapsed)
✓ Product status = "In Cleaning" until Feb 12 at 2:30 PM
✓ Calendar shows "Sanitizing..." badge for Feb 10-12
```

**Test Scenario 1.2.2: Expedited Cleaning Override**

```
Test ID: CLEAN-002
Priority: P2 (Medium)

Preconditions:
- User has Active "Style Pass Elite" subscription
- Item supports express cleaning

Test Steps:
1. Item returned Feb 10
2. Elite member attempts to book for Feb 11
3. System offers "Express 24hr Sanitization" for ₹500

Expected Result:
✓ Shows option: "Rush sanitization available - ₹500 extra"
✓ If accepted, item available Feb 11
✓ Automatically books Fabklean express cleaning
```

---

### 1.3 Pre-Authorization (Security Deposit) Hold

**Test Scenario 1.3.1: High-Value Jewelry Rental**

```
Test ID: PAYMENT-001
Priority: P0 (Critical)

Preconditions:
- Product: Nizami Diamond Necklace (retail value ₹50,000)
- Security deposit policy: 20% of retail value
- User has valid credit card

Test Steps:
1. Add necklace to cart (rental for 2 days)
2. Proceed to checkout
3. Enter payment details

Expected Result:
✓ System creates Razorpay authorization for ₹10,000 (20% of ₹50k)
✓ Shows clear message: "We'll temporarily hold ₹10,000 on your card as security. This is NOT charged - just blocked."
✓ Payment summary shows:
  - Rental fee: ₹1,999/day × 2 = ₹3,998
  - Service fee: ₹299
  - Security hold: ₹10,000 (will be released after return)
  - Total charged now: ₹4,297
  - Total blocked: ₹10,000
```

**Test Scenario 1.3.2: Safe Return - Release Hold**

```
Test ID: PAYMENT-002
Priority: P0 (Critical)

Preconditions:
- Security deposit of ₹10,000 is on hold
- Item is returned within due date
- QC inspection passed

Test Steps:
1. Renter marks item as "Shipped Back"
2. Owner receives item
3. Owner clicks "Accept Return - No Damage"
4. System QC agent verifies (if needed)

Expected Result:
✓ System captures ₹0 on the authorization (releases hold)
✓ User receives notification: "Great news! Your ₹10,000 security deposit has been released. Funds available in 5-7 days."
✓ Transaction log shows: preauth_released
```

**Test Scenario 1.3.3: Damage Deduction**

```
Test ID: PAYMENT-003
Priority: P0 (Critical)

Preconditions:
- Security deposit of ₹10,000 on hold
- Item returned with minor damage

Test Steps:
1. Owner marks return as "Damaged - Minor Stain"
2. Uploads damage photo
3. System sends to dispute resolution
4. Admin approves ₹2,000 deduction for cleaning

Expected Result:
✓ System captures ₹2,000 from authorization
✓ Remaining ₹8,000 released
✓ Renter notified: "₹2,000 deducted for professional stain removal. ₹8,000 refunded."
✓ Owner receives ₹2,000 in their wallet
```

---

### 1.4 Geofence Filtering (Hyderabad Express)

**Test Scenario 1.4.1: 15km Radius Check**

```
Test ID: GEO-001
Priority: P0 (Critical)

Preconditions:
- User location: Jubilee Hills, Hyderabad (17.4281°N, 78.4104°E)
- Product A: Banjara Hills, 5km away
- Product B: Gachibowli, 12km away
- Product C: Secunderabad, 20km away

Test Steps:
1. User enables location services
2. Clicks "Hyderabad Express - 90 Min Delivery"
3. System queries products within 15km

Expected Result:
✓ Product A: Shown with "8 min delivery" badge
✓ Product B: Shown with "25 min delivery" badge
✓ Product C: HIDDEN (exceeds 15km geofence)
✓ Map view shows user pin and available closet pins within circle
```

**Test Scenario 1.4.2: Location Permission Denied**

```
Test ID: GEO-002
Priority: P1 (High)

Test Steps:
1. User clicks "Hyderabad Express"
2. Browser prompts for location
3. User clicks "Block"

Expected Result:
✓ Shows fallback message: "Enable location to see items near you"
✓ Offers manual pincode entry: "Or enter your pincode:"
✓ If pincode entered, uses geocoded coordinates
✓ If declined, shows all Hyderabad items without distance sorting
```

---

### 1.5 Overstay & Late Return Penalties

**Test Scenario 1.5.1: Automated Late Fee Trigger**

```
Test ID: PENALTY-001
Priority: P0 (Critical)

Preconditions:
- Rental due date: Feb 28, 2026 by 8:00 PM
- Current date: Feb 28, 2026 at 8:01 PM
- Item not marked as "Returned"

Test Steps:
1. System cron job runs at 8:00 PM daily
2. Checks all rentals due today
3. Identifies overdue rental

Expected Result:
✓ System sends push notification: "Your rental is overdue. Late fee of ₹500/day applies."
✓ Sends SMS and email reminder
✓ Updates transaction with daily late fee
✓ If 3 days overdue, notifies owner with FIR assistance option
```

**Test Scenario 1.5.2: Grace Period**

```
Test ID: PENALTY-002
Priority: P2 (Medium)

Preconditions:
- Due date: Feb 28 by 8 PM
- User has "Style Pass Premium" subscription

Test Steps:
1. Same overstay scenario as PENALTY-001

Expected Result:
✓ Premium members get 24-hour grace period
✓ No late fee until Feb 29, 8:00 PM
✓ Notification: "As a Premium member, you have until tomorrow 8 PM to return without penalty."
```

---

## 2. PAYMENT INTEGRATION TEST CASES

### 2.1 Razorpay Route - Split Payment

**Test Scenario 2.1.1: Commission Split**

```
Test ID: PAY-001
Priority: P0 (Critical)

Preconditions:
- Product rental price: ₹2,000/day × 3 days = ₹6,000
- Platform commission: 20%
- Service fee: ₹299

Test Steps:
1. Complete booking checkout

Expected Result - Payment Breakdown:
✓ Total order value: ₹6,299
✓ Renter pays: ₹6,299

Split distribution:
✓ Platform receives: ₹1,200 (20% of ₹6k) + ₹299 service fee = ₹1,499
✓ Owner receives: ₹4,800 (80% of ₹6k)
✓ Razorpay Route creates transfer to owner's linked account
✓ Settlement happens 24 hours after successful return
```

**Test Scenario 2.1.2: Failed Transfer Retry**

```
Test ID: PAY-002
Priority: P1 (High)

Preconditions:
- Owner's bank account has incorrect IFSC code

Test Steps:
1. System attempts transfer after successful return
2. Razorpay returns error: invalid_account

Expected Result:
✓ System retries 3 times with exponential backoff
✓ After 3 failures, moves to "Manual Review" queue
✓ Sends email to owner: "Update your bank details to receive ₹4,800"
✓ Funds held in platform account until resolved
```

---

### 2.2 Cashfree Easy Split

**Test Scenario 2.2.1: Multi-Vendor Bundle**

```
Test ID: PAY-003
Priority: P1 (High)

Preconditions:
- Destination Bundle "Goa Beach Week" contains:
  - Swimsuit from Owner A (₹500)
  - Kimono from Owner B (₹800)
  - Sandals from Owner C (₹300)
- Total: ₹1,600 + ₹249 service fee = ₹1,849

Test Steps:
1. Complete bundle checkout

Expected Result:
✓ Cashfree creates 3 vendor transfers:
  - Owner A: ₹400 (80% of ₹500)
  - Owner B: ₹640 (80% of ₹800)
  - Owner C: ₹240 (80% of ₹300)
✓ Platform retains: ₹320 (commission) + ₹249 (service fee) = ₹569
✓ All transfers log in Transaction model with vendorSplit array
```

---

## 3. KYC & FRAUD PREVENTION

### 3.1 Aadhaar Video KYC

**Test Scenario 3.1.1: First-Time Verification**

```
Test ID: KYC-001
Priority: P0 (Critical)

Test Steps:
1. New user signs up
2. Attempts to list first item
3. System blocks with: "Complete KYC to list items"
4. Clicks "Start Video KYC"
5. Redirected to Signzy platform
6. Completes Aadhaar verification with liveness check

Expected Result:
✓ Webhook receives verification result
✓ System updates user.kycVerified = true
✓ User can now list items and rent high-value products
✓ KYC badge shows on profile
```

**Test Scenario 3.1.2: 3-Strikes Account Flag**

```
Test ID: KYC-002
Priority: P0 (Critical)

Test Steps:
1. User attempts KYC - fails (blurry photo)
2. Retry - fails (Aadhaar mismatch)
3. Retry - fails (liveness check failed)

Expected Result:
✓ After 3rd failure, account flagged
✓ Shows message: "Your account is under review. Contact support."
✓ Admin dashboard shows flagged account with failure reasons
✓ User cannot transact until manual approval
```

---

### 3.2 Anti-Fraud Triggers

**Test Scenario 3.2.1: Rapid Successive Bookings**

```
Test ID: FRAUD-001
Priority: P1 (High)

Scenario:
- New user (account created today)
- Attempts to book 5 high-value items within 10 minutes

Expected Result:
✓ After 3rd booking, system flags for review
✓ 4th and 5th bookings require OTP verification
✓ Notification sent to risk team
✓ If user passes OTP, bookings proceed
```

**Test Scenario 3.2.2: Mismatched Delivery Address**

```
Test ID: FRAUD-002
Priority: P1 (High)

Scenario:
- User's KYC address: Hyderabad, Telangana
- Delivery address entered: Mumbai, Maharashtra (1200km away)

Expected Result:
✓ System shows warning: "Delivery address differs from registered address"
✓ Requires additional phone OTP
✓ Increases security deposit by 10%
✓ Flags transaction for post-delivery monitoring
```

---

## 4. CONCURRENCY & RACE CONDITIONS

### 4.1 Double Booking Prevention

**Test Scenario 4.1.1: Simultaneous Checkout**

```
Test ID: RACE-001
Priority: P0 (Critical)

Setup:
- Product X has 1 unit available for Feb 24-26
- User A adds to cart at 10:00:00 AM
- User B adds to cart at 10:00:02 AM
- Both proceed to checkout simultaneously

Test Steps:
1. User A clicks "Pay Now" at 10:02:30
2. User B clicks "Pay Now" at 10:02:31 (1 second later)

Expected Result:
✓ Database uses pessimistic locking (SELECT FOR UPDATE)
✓ User A's transaction locks the product record
✓ User A's payment succeeds
✓ User B's payment fails with: "Sorry, this item was just booked. Refreshing available items..."
✓ User B automatically redirected to similar items
```

**Database Implementation:**
```javascript
// Use MongoDB transaction with lock
const session = await mongoose.startSession();
session.startTransaction();

try {
  const product = await Product.findById(productId)
    .session(session)
    .where('isAvailable').equals(true);
  
  if (!product) {
    throw new Error('Item no longer available');
  }
  
  // Create booking
  await Rental.create([{...bookingData}], { session });
  
  // Update availability
  product.isAvailable = false;
  await product.save({ session });
  
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
  throw error;
} finally {
  session.endSession();
}
```

---

## 5. IMAGE QUALITY & UPLOAD

### 5.1 AI Image Validation

**Test Scenario 5.1.1: Blur Detection**

```
Test ID: IMG-001
Priority: P1 (High)

Test Steps:
1. Owner uploads blurry product photo
2. System analyzes using Laplacian variance

Expected Result:
✓ If variance < 100: Shows error "Image is too blurry. Use a sharp, well-lit photo."
✓ "List Item" button remains disabled
✓ Suggests: "Try using portrait mode or natural lighting"
```

**Test Scenario 5.1.2: Low Resolution Rejection**

```
Test ID: IMG-002
Priority: P1 (High)

Test Steps:
1. Upload 640x480 image (below 800x600 threshold)

Expected Result:
✓ Error: "Image quality too low for a premium listing. Minimum 800x600px required."
✓ Provides compression-free upload tips
```

---

## 6. PERFORMANCE BENCHMARKS

### 6.1 Load Testing (Wedding Season Traffic)

**Test Scenario 6.1.1: 10,000 Concurrent Users**

```
Test ID: PERF-001
Priority: P0 (Critical)

Setup:
- Apache JMeter or k6 load test
- Simulate 10,000 concurrent users browsing

Acceptance Criteria:
✓ Homepage load time: < 2 seconds (p95)
✓ Search results: < 1.5 seconds (p95)
✓ Checkout flow: < 3 seconds (p95)
✓ API response time: < 500ms (p95)
✓ Error rate: < 0.1%
✓ CPU utilization: < 80%
```

**Test Scenario 6.1.2: Database Query Optimization**

```
Test ID: PERF-002
Priority: P1 (High)

Queries to Optimize:
1. Geospatial search (15km radius)
2. Availability check across date range
3. Style twin matching (complex similarity)

Expected Result:
✓ Add compound index: { location: '2dsphere', available: 1 }
✓ Cache popular searches in Redis (15min TTL)
✓ Implement pagination (limit 50 results)
✓ All queries execute in < 200ms
```

---

## 7. ACCESSIBILITY (WCAG 2.1 AAA)

### 7.1 Keyboard Navigation

**Test Scenario 7.1.1: Tab Order**

```
Test ID: A11Y-001
Priority: P1 (High)

Test Steps:
1. Open homepage
2. Press Tab key repeatedly
3. Navigate through all interactive elements

Expected Result:
✓ Logical tab order (top to bottom, left to right)
✓ Skip links appear: "Skip to main content"
✓ Focus indicators visible (2px outline)
✓ All buttons, links, inputs reachable via keyboard
✓ Modal dialogs trap focus until closed
```

### 7.2 Screen Reader Compatibility

**Test Scenario 7.2.1: NVDA Testing**

```
Test ID: A11Y-002
Priority: P1 (High)

Test Steps:
1. Enable NVDA screen reader
2. Navigate product listing page

Expected Result:
✓ Images have descriptive alt text: "Red silk Banarasi saree with gold zari work"
✓ Buttons announce: "Rent this saree, button"
✓ Form labels associated: "Email address, required, Edit text"
✓ ARIA live regions announce cart updates
✓ Headings structured hierarchically (H1 → H2 → H3)
```

---

## 8. EDGE CASES & ERROR HANDLING

### 8.1 Network Failures

**Test Scenario 8.1.1: Payment Gateway Timeout**

```
Test ID: ERR-001
Priority: P0 (Critical)

Setup:
- Simulate Razorpay API timeout (no response in 30 seconds)

Expected Result:
✓ Shows message: "Payment processing is taking longer than usual. Please don't refresh."
✓ Retries 3 times with exponential backoff
✓ After 90 seconds, shows: "Payment status unclear. Check 'My Orders' in 5 minutes."
✓ Webhook handles late payment confirmations
```

### 8.2 Inventory Mismatches

**Test Scenario 8.2.1: Manual Override Gone Wrong**

```
Test ID: ERR-002
Priority: P2 (Medium)

Scenario:
- Admin manually marks item "Available" while it's still with renter

Test Steps:
1. New user books the item
2. System attempts delivery but item not available

Expected Behavior:
✓ Owner receives alert: "Item booked but marked available by mistake!"
✓ System auto-cancels new booking
✓ Full refund issued to new renter
✓ Apology discount (₹500 voucher) sent
✓ Incident logged for admin review
```

---

## 9. LOCALIZATION & REGIONAL COMPLIANCE

### 9.1 GST Calculation

**Test Scenario 9.1.1: 18% GST on Service Fee**

```
Test ID: TAX-001
Priority: P0 (Critical)

Test Steps:
1. Booking total: ₹6,000 rental + ₹299 service fee

Expected Result:
✓ GST applied only to service fee: ₹299 × 18% = ₹53.82
✓ Invoice breakdown:
  - Rental (exempted): ₹6,000
  - Service fee: ₹299.00
  - GST (18%): ₹53.82
  - Total: ₹6,352.82
✓ GST number displayed on invoice
```

### 9.2 1% TCS Collection

**Test Scenario 9.2.1: Seller Earnings > ₹5L/year**

```
Test ID: TAX-002
Priority: P1 (High)

Preconditions:
- Owner has earned ₹4,95,000 this FY
- New rental payout: ₹10,000

Expected Result:
✓ System detects threshold crossing
✓ Collects 1% TCS on ₹10,000 = ₹100
✓ Owner receives ₹9,900
✓ Platform remits ₹100 to tax authorities
✓ TCS certificate generated for owner's ITR filing
```

---

## 10. RELEASE CHECKLIST (Pre-Production)

### Go-Live Approval Criteria

**Security:**
- [ ] SSL certificate installed (HTTPS)
- [ ] Environment variables secured (no hardcoded secrets)
- [ ] API rate limiting enabled (100 requests/min per IP)
- [ ] CSRF protection on all POST requests
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS sanitization on user inputs

**Legal:**
- [ ] Terms of Service published (IPC 406 notice included)
- [ ] Privacy Policy GDPR-compliant
- [ ] GST registration complete
- [ ] TCS mechanism tested
- [ ] Refund policy documented

**Performance:**
- [ ] CDN configured (Cloudflare/AWS CloudFront)
- [ ] Database indexed (geospatial, date range, userId)
- [ ] Redis caching layer active
- [ ] Image optimization (WebP format)
- [ ] Lazy loading implemented

**Monitoring:**
- [ ] Sentry error tracking configured
- [ ] Google Analytics 4 setup
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Payment webhook logging
- [ ] Daily backup automated

**Testing:**
- [ ] All P0 test cases passed
- [ ] Payment gateway sandbox tested
- [ ] KYC integration verified
- [ ] Load test passed (5000+ concurrent users)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

## Test Execution Timeline

**Week 1:** Booking logic (1.1-1.5) - 30 test cases  
**Week 2:** Payment integration (2.1-2.2) - 15 test cases  
**Week 3:** KYC, fraud, concurrency (3.1-4.1) - 20 test cases  
**Week 4:** Performance, accessibility (6.1-7.2) - 25 test cases  
**Week 5:** Edge cases, tax compliance (8.1-9.2) - 15 test cases  
**Week 6:** Release checklist validation  

**Total Test Cases:** 105+  
**Automated:** 60% (API, unit tests)  
**Manual:** 40% (UI, accessibility, edge cases)

---

**Production Deployment Target:** March 30, 2026  
**Post-Launch Monitoring:** 24/7 for first 72 hours
