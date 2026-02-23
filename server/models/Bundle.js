const mongoose = require('mongoose');

const bundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a bundle name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a description']
  },
  type: {
    type: String,
    enum: ['destination', 'occasion', 'seasonal', 'curated', 'celebrity'],
    required: true
  },
  // Destination-specific (Travel Pack)
  destination: {
    name: String, // e.g., "Goa Beach Wedding"
    city: String,
    country: String,
    climate: {
      type: String,
      enum: ['tropical', 'cold', 'desert', 'moderate']
    },
    duration: {
      type: Number, // Trip duration in days
      default: 7
    }
  },
  // Occasion-specific
  occasion: {
    type: String,
    enum: ['wedding', 'cocktail', 'corp_event', 'party', 'festival', 'date_night', 'photoshoot']
  },
  // Products in bundle
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    category: {
      type: String,
      enum: ['clothing', 'accessories', 'jewelry', 'shoes', 'bags']
    },
    isRequired: {
      type: Boolean,
      default: true
    }
  }],
  // Pricing
  pricing: {
    individualTotal: {
      type: Number,
      required: true
    },
    bundlePrice: {
      type: Number,
      required: true
    },
    discount: {
      percentage: Number,
      amount: Number
    },
    securityDeposit: {
      type: Number,
      required: true
    }
  },
  // Creator (curator or brand)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  curator: {
    name: String,
    title: String, // e.g., "Celebrity Stylist"
    verified: Boolean
  },
  // Availability
  status: {
    type: String,
    enum: ['active', 'inactive', 'sold_out', 'seasonal'],
    default: 'active'
  },
  available: {
    type: Boolean,
    default: true
  },
  // Rental configuration
  rentalDuration: {
    min: {
      type: Number,
      default: 3 // Minimum days
    },
    max: {
      type: Number,
      default: 14
    },
    recommended: {
      type: Number,
      default: 7
    }
  },
  // Images & media
  images: [{
    url: String,
    caption: String
  }],
  coverImage: String,
  // Marketing
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  // Engagement
  views: {
    type: Number,
    default: 0
  },
  bookings: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Delivery options
  delivery: {
    hotelDelivery: {
      type: Boolean,
      default: true // Deliver to hotel
    },
    airportPickup: {
      type: Boolean,
      default: false
    },
    cities: [String] // Available in these cities
  },
  // Booking calendar
  bookings: [{
    startDate: Date,
    endDate: Date,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental'
    }
  }],
  // SEO & Discovery
  slug: {
    type: String,
    unique: true
  },
  metaTitle: String,
  metaDescription: String,
  // Season (for seasonal bundles)
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter', 'festive', 'wedding_season']
  },
  activeFrom: Date,
  activeTo: Date
}, {
  timestamps: true
});

// Indexes
bundleSchema.index({ type: 1, status: 1 });
bundleSchema.index({ 'destination.city': 1 });
bundleSchema.index({ slug: 1 });
bundleSchema.index({ featured: 1 });

// Generate slug before saving
bundleSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  next();
});

// Check if bundle is available for dates
bundleSchema.methods.isAvailableForDates = function(startDate, endDate) {
  return !this.bookings.some(booking => {
    return (
      (startDate >= booking.startDate && startDate <= booking.endDate) ||
      (endDate >= booking.startDate && endDate <= booking.endDate) ||
      (startDate <= booking.startDate && endDate >= booking.endDate)
    );
  });
};

// Calculate bundle savings
bundleSchema.methods.calculateSavings = function() {
  const savings = this.pricing.individualTotal - this.pricing.bundlePrice;
  const percentage = (savings / this.pricing.individualTotal) * 100;
  
  return {
    amount: savings,
    percentage: Math.round(percentage)
  };
};

module.exports = mongoose.model('Bundle', bundleSchema);
