# Closetly/Zevara - Brand & UX Guidelines
## 2026 Intergenerational Design Philosophy

**Brand Positioning:** Luxury Rental Meets Quick Commerce  
**Design Principle:** "Minimalism with Muscle" - Intentional Restraint + High Impact  
**Target Demographic:** Every generation from Baby Boomers (60+) to Gen Alpha (10-15)

---

## 1. BRAND IDENTITY SYSTEM

### 1.1 Name Rationale

**Option A: CLOSETLY**
- **Etymology:** Closet (wardrobe) + -ly (friendly, personal)
- **Brand Voice:** Approachable, neighborly, trustworthy
- **Target Demo:** Millennials & Gen X (25-45 years)
- **Perception:** "Your neighbor's closet, now accessible"

**Option B: ZEVARA**
- **Etymology:** Ze (gender-neutral) + Vara (Sanskrit: "boon/gift")
- **Brand Voice:** Premium, mystique, heritage
- **Target Demo:** Gen Z & Boomers (luxury seekers)
- **Perception:** "The gift of endless style"

**RECOMMENDATION:** CLOSETLY for MVP (Hyderabad)  
**Why:** Hyderabad is the "City of Nawabs" but growing tech hub - needs blend of tradition (trust) + modernity (tech). Closetly sounds "safe" while still premium.

---

### 1.2 Logo Design Brief

**Primary Logo Concept:**
```
┌─────────────────────────────────────┐
│                                     │
│        C L O S E T L Y              │
│        ─────────────────            │
│     Infinite Fashion Access         │
│                                     │
└─────────────────────────────────────┘
```

**Design Elements:**
- **Font:** Playfair Display (serif) for "CLOSETLY" - conveys heritage & trust
- **Tagline Font:** Inter Light - modern contrast
- **Icon:** Minimalist hanger with infinity symbol (∞) integration
- **Color:** Mocha Mousse (#A47864) for wordmark, Charcoal (#3A3A3A) for icon

**Logo Variations:**
1. Full lockup (logo + tagline) - for website header
2. Icon only - for app icon, favicons
3. Monochrome - for invoices, legal docs
4. Reversed (white) - for dark backgrounds

---

### 1.3 Brand Voice & Tone

**For Baby Boomers (60+):**
- **Voice:** Respectful, educational, reassuring
- **Copy Example:** "Renting is simple. Browse our wardrobe, select your dates, and we'll deliver to your door. Questions? Call us anytime at 1800-XXX-XXXX."
- **CTA Style:** "View the Complete Guide" (not "Explore")

**For Gen X (45-60):**
- **Voice:** Practical, value-focused, professional
- **Copy Example:** "Why buy a ₹15,000 saree for one wedding? Rent it for ₹1,999 and spend the savings on your kids' education."
- **CTA Style:** "See How Much You Save"

**For Millennials (25-44):**
- **Voice:** Eco-conscious, community-driven, authentic
- **Copy Example:** "Your rental saved 2,700 liters of water. Join 10,000+ renters reducing fashion waste."
- **CTA Style:** "Start Your Sustainability Journey"

**For Gen Z (15-24):**
- **Voice:** Aspirational, visual, FOMO-driven
- **Copy Example:** "This Manish Malhotra lehenga is booked 47 times. Don't miss your turn."
- **CTA Style:** "Rent Before It's Gone"

**For Gen Alpha (10-14):**
- **Voice:** Playful, interactive, gamified
- **Copy Example:** "Unlock your next outfit! Rent 5 items to reach Silver Status and get free express delivery."
- **CTA Style:** "Level Up"

---

## 2. COLOR PSYCHOLOGY & APPLICATION

### 2.1 The Three Palette Strategy

**Why 3 Palettes?**  
Different age groups respond to different color emotions:
- Boomers/Gen X: Trust, heritage, timelessness
- Millennials: Sustainability, warmth, earthiness
- Gen Z/Alpha: Vibrancy, playfulness, digital-native hues

**Implementation Logic:**
- **Homepage Hero:** Dynamic color based on user's age demographic (detected via sign-up birthday)
- **Product Pages:** Mocha Sustainability (universal appeal)
- **Checkout Flow:** Royal Noir Gold (premium signal for high-value transaction)

---

### 2.2 Palette 1: Mocha Sustainability (DEFAULT)

**Target:** Millennials (25-44), Gen Z eco-conscious segment

**Colors:**
```css
--mocha-primary: #A47864;       /* Pantone 2025 Color of Year */
--mocha-taupe: #C8B8A8;         /* Warm neutrals */
--mocha-sandstone: #D4C4B0;     /* Backgrounds */
--mocha-neon-green: #7FE7A3;    /* Sustainability accent */
--mocha-purple: #9B8EA8;        /* Premium touch */
```

**Usage:**
- Primary CTA buttons: Mocha Primary
- Success states: Neon Green ("Item Added to Cart" ✓)
- Backgrounds: Off-white (#FAF7F4) with Sandstone accents
- Text: Charcoal (#3A3A3A) on light, Off-white on dark

**Emotional Impact:** Calm, grounded, eco-conscious, premium without being aggressive

**Real-World Application:**
```jsx
<button className="bg-mocha-primary hover:bg-mocha-taupe text-white px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-2xl">
  Rent This Lehenga - ₹2,999
</button>
```

---

### 2.3 Palette 2: Royal Noir Gold (HERITAGE)

**Target:** Baby Boomers (60+), Gen X (45-60)

**Colors:**
```css
--royal-black: #1C1C1C;         /* Matte black */
--royal-charcoal: #3D3D3D;      /* Softer blacks */
--royal-gold: #D9B648;          /* Hyderabad Nizami heritage */
--royal-champagne: #F4E4C1;     /* Highlight backgrounds */
--royal-bronze: #CD7F32;        /* Metallic accents */
```

**Usage:**
- Event wear categories (Bridal, Anarkalis, Sherwanis)
- High-value item pages (> ₹5,000 retail value)
- "Heritage Collection" landing pages

**Typography Pairing:**
- Headers: Playfair Display Bold (serif)
- Body: Lora (serif) - more traditional than Inter

**Emotional Impact:** Timeless, luxurious, trustworthy, prestigious

**Real-World Application:**
```jsx
<section className="bg-royal-black text-royal-champagne py-24">
  <h2 className="font-playfair text-5xl text-royal-gold mb-6">
    The Nizami Collection
  </h2>
  <p className="font-lora text-xl leading-relaxed">
    Exquisite heirlooms from Hyderabad's royal heritage, now available to rent.
  </p>
</section>
```

---

### 2.4 Palette 3: Mermaidcore Luxe (GEN ALPHA)

**Target:** Gen Z (15-24), Gen Alpha (10-14)

**Colors:**
```css
--mermaid-aqua: #7DD3C0;        /* Iridescent aqua */
--mermaid-teal: #4A9B8E;        /* Ocean depth */
--mermaid-purple: #B39CD0;      /* Pearlescent */
--mermaid-pink: #FFB3D9;        /* Playful accent */
--mermaid-white: #F0F8FF;       /* Airy backgrounds */
```

**Usage:**
- "Trending Now" sections
- AR try-on features
- Social sharing modals
- Gamification elements (badges, rewards)

**Typography Pairing:**
- Headers: Space Grotesk (geometric sans-serif)
- Body: Inter (modern, clean)

**Emotional Impact:** Fun, digital-native, fresh, social-first

**Real-World Application:**
```jsx
<div className="bg-gradient-to-br from-mermaid-aqua to-mermaid-purple p-8 rounded-3xl">
  <h3 className="font-space-grotesk text-3xl text-white mb-4">
    🌊 Trending on Insta
  </h3>
  <p className="text-white/90">
    This outfit has 2.4K likes! Rent it now and join the trend.
  </p>
</div>
```

---

## 3. TYPOGRAPHY SCALE & HIERARCHY

### 3.1 Font Families

**For Web:**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Lora:wght@400;600&family=Space+Grotesk:wght@500;700&display=swap');

--font-primary-heading: 'Playfair Display', serif;
--font-secondary-heading: 'Space Grotesk', sans-serif;
--font-body: 'Inter', sans-serif;
--font-heritage-body: 'Lora', serif;
```

**Why These Fonts?**
- **Playfair Display:** High contrast = readable for seniors, elegant for luxury
- **Inter:** Variable font = optimized file size, excellent readability at all sizes
- **Lora:** Serif body text = nostalgic for Boomers, premium feel
- **Space Grotesk:** Geometric = appealing to Gen Z's aesthetic

---

### 3.2 Responsive Type Scale

**Base Size:**
- Desktop (> 1024px): 18px
- Tablet (768-1023px): 16px
- Mobile (< 767px): 16px

**Scale (Perfect Fourth - 1.333 ratio):**
```css
/* Headings */
--text-xs: 0.75rem;      /* 12px - Metadata */
--text-sm: 0.875rem;     /* 14px - Captions */
--text-base: 1rem;       /* 16px - Body */
--text-lg: 1.125rem;     /* 18px - Large body */
--text-xl: 1.333rem;     /* 21px - Small headings */
--text-2xl: 1.777rem;    /* 28px - H3 */
--text-3xl: 2.369rem;    /* 38px - H2 */
--text-4xl: 3.157rem;    /* 51px - H1 */
--text-5xl: 4.209rem;    /* 67px - Hero text */

/* Line Heights */
--leading-tight: 1.2;    /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Long-form content */
```

---

### 3.3 Accessibility Requirements (WCAG 2.1 AAA)

**Minimum Font Sizes:**
- Body text: 16px minimum (18px recommended for 50+ users)
- Button text: 18px minimum
- Form labels: 16px minimum

**Contrast Ratios:**
- Normal text (< 18pt): 7:1 contrast (AAA)
- Large text (> 18pt): 4.5:1 contrast (AA)
- Interactive elements: 4.5:1 minimum

**Example Contrast Checks:**
```css
/* ✅ PASS - 7.8:1 contrast */
color: #3A3A3A; /* Charcoal text */
background: #FAF7F4; /* Off-white bg */

/* ❌ FAIL - 2.1:1 contrast */
color: #C8B8A8; /* Taupe text */
background: #FAF7F4; /* Off-white bg */
```

**Tool:** Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/

---

## 4. SPACING & LAYOUT (8px Grid System)

### 4.1 The 8px Grid Philosophy

**Why 8px?**
- Divisible by 2, 4 (easy scaling)
- Aligns with iOS/Android native grid systems
- Creates rhythm and consistency

**Spacing Scale:**
```css
--space-xs: 4px;    /* Tight elements (icon padding) */
--space-sm: 8px;    /* Small gaps */
--space-md: 16px;   /* Default spacing */
--space-lg: 24px;   /* Section spacing */
--space-xl: 32px;   /* Large sections */
--space-2xl: 48px;  /* Page sections */
--space-3xl: 64px;  /* Hero sections */
--space-4xl: 96px;  /* Major divisions */
--space-5xl: 128px; /* Full-bleed spacing */
```

---

### 4.2 Container Widths (Optimal Reading Length)

**Max Content Width:**
- Desktop: 1280px (optimal for 1440px+ screens)
- Laptop: 1024px
- Tablet: 768px
- Mobile: 100% (with 16px padding)

**Reading Line Length (Typography):**
- Optimal: 60-75 characters per line
- Max: 90 characters

```css
.prose {
  max-width: 65ch; /* 65 characters */
  margin: 0 auto;
  font-size: 18px;
  line-height: 1.75;
}
```

---

### 4.3 Whitespace as a Luxury Signal

**Research:** Luxury brands use 40-50% whitespace vs. 20-30% for mass-market. Closetly must signal "premium" through restraint.

**Implementation:**
```css
/* Product Card - Premium Spacing */
.product-card {
  padding: 32px;              /* Generous internal spacing */
  margin-bottom: 48px;        /* Breathing room between cards */
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
}

.product-card img {
  margin-bottom: 24px;        /* Space between image and text */
}

.product-card h3 {
  margin-bottom: 12px;
  font-size: 1.5rem;
}

.product-card p {
  margin-bottom: 24px;
  color: #6B6B6B;
  line-height: 1.6;
}
```

**Before/After Example:**

**BEFORE (Cluttered):**
```
[Image][Image][Image][Image]
Title Title Title Title
₹999  ₹999  ₹999  ₹999
```

**AFTER (Premium):**
```
[     Image     ]

        Title
        
      ₹999/day
      
  [Rent Now]


[     Image     ]
```

---

## 5. INTERGENERATIONAL UI PATTERNS

### 5.1 The "Universal UI" (Boomers & Gen X)

**Design Principle:** Clarity > Cleverness

**Navigation Structure:**
```
┌────────────────────────────────────────────────┐
│  CLOSETLY        Home  How It Works  Browse   │
│                         My Account   Help      │
└────────────────────────────────────────────────┘
```

**Requirements:**
- ✅ All navigation visible (no hamburger menus on desktop)
- ✅ Text labels on all icons
- ✅ Breadcrumb navigation on every page
- ✅ "Back to Top" button on long pages
- ✅ Phone number visible in header (not hidden in footer)

**Form Design (Senior-Friendly):**
```jsx
<form className="space-y-8">
  <div>
    <label className="block text-lg font-semibold mb-2 text-charcoal">
      Your Email Address <span className="text-red-600">*</span>
    </label>
    <input
      type="email"
      className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:border-mocha-primary focus:ring-4 focus:ring-mocha-primary/20"
      placeholder="example@email.com"
    />
    <p className="text-sm text-gray-600 mt-2">
      We'll send your booking confirmation here.
    </p>
  </div>
  
  <button className="w-full py-5 bg-mocha-primary text-white text-xl font-bold rounded-lg hover:bg-mocha-taupe transition-all duration-300">
    Continue to Payment
  </button>
</form>
```

**Key Features:**
- Large labels (18px+)
- Descriptive placeholders
- Helper text explaining purpose
- 56px tall buttons (easy to tap)
- Clear error messages ("Please enter a valid email address" not "Invalid input")

---

### 5.2 The "Vibe UI" (Gen Z & Alpha)

**Design Principle:** Speed > Steps

**Mobile-First Thumb Zone:**
```
┌─────────────────────────┐
│    Header (Fixed)       │  ← Safe Zone (display only)
├─────────────────────────┤
│                         │
│   Scrollable Content    │  ← Natural Grip Zone
│                         │
│                         │
├─────────────────────────┤
│   [Primary CTA]         │  ← Thumb Zone (actions)
│   [Secondary Actions]   │
└─────────────────────────┘
```

**Code Example:**
```jsx
<div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 p-4 safe-area-inset-bottom">
  {/* Primary Action - Bottom Center */}
  <button className="w-full py-4 bg-gradient-to-r from-mermaid-aqua to-mermaid-purple text-white text-lg font-bold rounded-full shadow-xl active:scale-95 transition-transform">
    Rent Now - ₹1,299
  </button>
  
  {/* Secondary Actions - Swipeable Row */}
  <div className="flex gap-3 mt-3 overflow-x-auto">
    <button className="flex-shrink-0 px-6 py-3 border-2 border-gray-300 rounded-full">
      ❤️ Save
    </button>
    <button className="flex-shrink-0 px-6 py-3 border-2 border-gray-300 rounded-full">
      📤 Share
    </button>
    <button className="flex-shrink-0 px-6 py-3 border-2 border-gray-300 rounded-full">
      🔔 Notify Me
    </button>
  </div>
</div>
```

**Micro-Interactions (Gen Z Expects):**
```css
/* Button Press Animation */
.btn-primary:active {
  transform: scale(0.95);
  transition: transform 0.1s ease-out;
}

/* Card Hover (desktop) */
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Like Button Heart Animation */
@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1.1); }
}

.heart-icon.liked {
  animation: heartBeat 0.6s ease-out;
  color: #FF6B9D;
}
```

---

## 6. COMPONENT LIBRARY (MUST-HAVE UI ELEMENTS)

### 6.1 Accessible Button Component

**Requirements:**
- Minimum 48px height (WCAG 2.1)
- Clear focus states
- Loading states
- Disabled states

```jsx
// components/ui/Button.jsx
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  onClick,
  ...props 
}) => {
  const baseClasses = "font-semibold rounded-lg transition-all duration-300 focus:ring-4 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-mocha-primary text-white hover:bg-mocha-taupe focus:ring-mocha-primary/40",
    secondary: "bg-white border-2 border-mocha-primary text-mocha-primary hover:bg-mocha-primary hover:text-white",
    ghost: "bg-transparent text-mocha-primary hover:bg-mocha-primary/10"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[44px]",
    md: "px-6 py-3 text-base min-h-[48px]",
    lg: "px-8 py-4 text-lg min-h-[56px]"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Processing...
        </span>
      ) : children}
    </button>
  );
};
```

---

### 6.2 Product Card (Bento Grid for Gen Z)

**Bento Grid:** Japanese lunchbox-inspired asymmetric layout (popularized by Apple)

```jsx
<div className="grid grid-cols-4 gap-4 p-4">
  {/* Large Featured Item (2x2) */}
  <div className="col-span-2 row-span-2 bg-white rounded-3xl overflow-hidden shadow-lg">
    <img src="/featured-lehenga.jpg" alt="..." className="w-full h-full object-cover" />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
      <h3 className="text-white text-2xl font-bold">Trending: Banarasi Silk</h3>
      <p className="text-white/90">₹2,499/day</p>
    </div>
  </div>
  
  {/* Smaller Items (1x1) */}
  <div className="col-span-1 row-span-1 bg-white rounded-2xl p-4">
    <img src="/item2.jpg" className="w-full h-32 object-cover rounded-lg mb-2" />
    <p className="font-semibold">Anarkali Set</p>
    <p className="text-sm text-gray-600">₹1,299</p>
  </div>
  
  {/* Repeat for more items */}
</div>
```

---

### 6.3 Progress Stepper (Checkout Flow)

**Why:** Reduces anxiety by showing "You're almost done"

```jsx
const steps = [
  { id: 1, name: 'Select Dates', icon: '📅' },
  { id: 2, name: 'Delivery Details', icon: '🚚' },
  { id: 3, name: 'Payment', icon: '💳' },
  { id: 4, name: 'Confirmation', icon: '✅' }
];

<div className="flex items-center justify-between mb-12">
  {steps.map((step, index) => (
    <div key={step.id} className="flex items-center">
      <div className={`
        w-12 h-12 rounded-full flex items-center justify-center text-2xl
        ${currentStep >= step.id ? 'bg-mocha-primary text-white' : 'bg-gray-200 text-gray-500'}
      `}>
        {step.icon}
      </div>
      <div className="ml-3">
        <p className="font-semibold text-sm">{step.name}</p>
      </div>
      {index < steps.length - 1 && (
        <div className={`w-24 h-1 mx-4 ${currentStep > step.id ? 'bg-mocha-primary' : 'bg-gray-200'}`} />
      )}
    </div>
  ))}
</div>
```

---

## 7. ANIMATION PHILOSOPHY

### 7.1 When to Animate

**DO Animate:**
- ✅ State changes (item added to cart)
- ✅ Feedback (button pressed)
- ✅ Loading states (skeleton screens)
- ✅ Page transitions (fade in)
- ✅ Micro-interactions (hover effects)

**DON'T Animate:**
- ❌ Critical information (price changes)
- ❌ Text that users need to read
- ❌ Forms during input
- ❌ When user has `prefers-reduced-motion`

---

### 7.2 Duration Guidelines

```css
/* Quick Feedback */
--duration-instant: 50ms;   /* Button press */
--duration-fast: 150ms;     /* Hover effects */
--duration-normal: 300ms;   /* Modal open/close */
--duration-slow: 500ms;     /* Page transitions */
--duration-slower: 1000ms;  /* Skeleton → Content */

/* Easing Functions */
--ease-out: cubic-bezier(0, 0, 0.2, 1);        /* Elements entering */
--ease-in: cubic-bezier(0.4, 0, 1, 1);         /* Elements exiting */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Smooth both ways */
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Playful */
```

---

### 7.3 Respect User Preferences

```css
/* Disable animations for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. ICONOGRAPHY SYSTEM

### 8.1 Icon Library Choice

**Recommendation:** Lucide Icons (https://lucide.dev/)

**Why Lucide?**
- Consistent 24px grid
- Stroke-based (scalable without pixelation)
- 1000+ icons covering rental use cases
- Accessible (each has `aria-label`)

**Installation:**
```bash
npm install lucide-react
```

**Usage:**
```jsx
import { Heart, ShoppingBag, Calendar, MapPin } from 'lucide-react';

<button>
  <Heart className="w-6 h-6 text-red-500" />
  <span className="ml-2">Add to Favorites</span>
</button>
```

---

### 8.2 Custom Icons (Brand-Specific)

**When to create custom icons:**
- Sustainability badge (leaf + hanger)
- Style Twin avatar
- Cleaning certification badge

**Design Rules:**
- 24x24px artboard
- 2px stroke weight
- Round line caps
- No drop shadows

---

## 9. IMAGE GUIDELINES

### 9.1 Product Photo Requirements

**Technical Specs:**
- Minimum resolution: 1200x1600px (3:4 aspect ratio)
- Format: WebP (with JPG fallback)
- Max file size: 300KB (compressed)
- Background: Clean or transparent

**Quality Checklist:**
- ✅ Well-lit (natural light preferred)
- ✅ Sharp focus
- ✅ No clutter in background
- ✅ Model visible (for fit reference) OR flat lay
- ✅ Color-accurate (no heavy filters)

**AI Enhancement:**
- Automatic background removal (Remove.bg API)
- Blur detection (reject if Laplacian variance < 100)
- Color correction (Adobe Lightroom API)

---

### 9.2 Lazy Loading & Performance

```jsx
// Next.js Image Optimization
import Image from 'next/image';

<Image
  src="/lehenga-red-silk.webp"
  alt="Red silk lehenga with gold embroidery"
  width={600}
  height={800}
  loading="lazy"
  placeholder="blur"
  blurDataURL="/placeholder-blur.jpg"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## 10. MOBILE-FIRST RESPONSIVE BREAKPOINTS

**Tailwind Breakpoints (Mobile-First):**
```css
/* Default (< 640px) - Mobile */
.container { padding: 16px; }

/* sm: (≥ 640px) - Large phones */
@media (min-width: 640px) {
  .container { padding: 24px; }
}

/* md: (≥ 768px) - Tablets */
@media (min-width: 768px) {
  .container { padding: 32px; }
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* lg: (≥ 1024px) - Laptops */
@media (min-width: 1024px) {
  .container { max-width: 1024px; margin: 0 auto; }
  .grid { grid-template-columns: repeat(3, 1fr); }
}

/* xl: (≥ 1280px) - Desktops */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

---

## 11. BRAND STORYTELLING (SCROLLYTELLING)

### 11.1 What is Scrollytelling?

**Definition:** Narrative-driven scrolling where each section reveals story beats.

**Use Case:** Heritage items (e.g., Nizami necklace from 1800s)

**Structure:**
1. **Act 1 (Intro):** Full-screen image of item
2. **Act 2 (History):** Scroll reveals backstory text overlays
3. **Act 3 (Craftsmanship):** Parallax zoom into details
4. **Act 4 (Modern Context):** "Now available to rent"

**Code Example (using Framer Motion):**
```jsx
import { motion, useScroll, useTransform } from 'framer-motion';

const HeritageStory = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.2]);
  
  return (
    <div className="h-[300vh] relative">
      <motion.div 
        className="sticky top-0 h-screen flex items-center justify-center"
        style={{ opacity }}
      >
        <motion.img
          src="/nizami-necklace.jpg"
          alt="Nizami Diamond Necklace"
          style={{ scale }}
          className="w-full max-w-2xl"
        />
      </motion.div>
      
      <div className="absolute top-[100vh] w-full">
        <p className="text-4xl text-white text-center">
          This necklace adorned the Nizams of Hyderabad for 200 years...
        </p>
      </div>
    </div>
  );
};
```

---

## 12. ACCESSIBILITY AUDIT CHECKLIST

**Before Launch:**
- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AAA (7:1 for text)
- [ ] Keyboard navigation works (Tab, Enter, Esc)
- [ ] Focus indicators visible (2px outline)
- [ ] Screen reader tested (NVDA/JAWS)
- [ ] Form labels associated with inputs
- [ ] Error messages descriptive ("Email format invalid" not "Error")
- [ ] Zoom to 200% doesn't break layout
- [ ] Video captions (if using video content)
- [ ] Skip links ("Skip to main content")

**Tools:**
- Lighthouse (Performance + A11y)
- axe DevTools (Browser extension)
- WAVE (Web Accessibility Evaluation Tool)

---

## FINAL BRAND MANIFESTO

**We are Closetly.**

We don't sell clothes. We sell freedom from the tyranny of "nothing to wear."

For the 60-year-old mother attending her daughter's wedding, we are trust.  
For the 25-year-old eco-warrior, we are purpose.  
For the 15-year-old scrolling at midnight, we are FOMO solved.

We move as fast as Swiggy, but with the care of a family heirloom.

Our interface doesn't "pop" with noise. It breathes with intention.  
Our colors don't scream. They whisper confidence.

We are not a marketplace. We are a movement.

**Welcome to the Infinite Closet. 🪞**
