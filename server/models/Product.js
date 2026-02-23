const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  // Professional Taxonomy (Myntra-level categorization)
  pillar: {
    type: String,
    required: [true, 'Please select a pillar category'],
    enum: ['Utsav', 'Safar', 'Alankrit', 'Niche-Luxe', 'Completers']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      // Utsav (Festive/Occasion)
      'Lehenga', 'Anarkali', 'Sharara', 'Structured-Drape', 'Saree',
      'Sherwani', 'Jodhpuri', 'Bandhgala', 'Nehru-Jacket', 'Kurta-Set',
      // Safar (Travel/Western)
      'Travel-Pack', 'Resort-Wear', 'Vacation-Dress', 'Kaftan', 'Power-Casual',
      'Blazer', 'Jumpsuit', 'Maxi-Dress', 'Beach-Wear',
      // Alankrit (Jewelry)
      'Necklace', 'Choker', 'Earrings', 'Bangles', 'Maang-Tikka', 'Bracelet',
      // Niche-Luxe
      'Maternity', 'Nursing-Wear', 'Plus-Size', 'Luxury-Bag', 'Designer-Handbag',
      // Completers
      'Mojari', 'Jutii', 'Kolhapuri', 'Designer-Heels', 'Luxury-Sneakers', 'Clutch',
      // General
      'Other'
    ]
  },
  gender: {
    type: String,
    required: [true, 'Please select gender category'],
    enum: ['Women', 'Men', 'Kids', 'Unisex']
  },
  occasion: {
    type: String,
    enum: [
      'Wedding', 'Sangeet', 'Mehendi', 'Reception', 'Engagement',
      'Festival', 'Party', 'Corporate', 'Vacation', 'Beach', 'Hill-Station',
      'Daily-Wear', 'Date-Night', 'Brunch', 'Cocktail', 'Traditional-Event'
    ]
  },
  vibe: {
    type: [String],
    enum: [
      'Neon-Gothic', 'Mermaidcore', 'Cottagecore', 'Dark-Academia',
      'Coastal-Grandmother', 'Clean-Girl', 'Barbiecore', 'Y2K',
      'Minimalist', 'Maximalist', 'Bohemian', 'Royal', 'Contemporary'
    ]
  },
  condition: {
    type: String,
    required: [true, 'Please select a condition'],
    enum: ['New', 'Like New', 'Good', 'Fair']
  },
  listingType: {
    type: String,
    required: [true, 'Please select a listing type'],
    enum: ['sale', 'rent', 'both']
  },
  price: {
    sale: {
      type: Number,
      min: 0
    },
    rent: {
      perDay: {
        type: Number,
        min: 0
      },
      perWeek: {
        type: Number,
        min: 0
      },
      deposit: {
        type: Number,
        min: 0
      }
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    public_id: String
  }],
  specifications: {
    brand: String,
    size: String,
    color: String,
    material: String
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: 1,
    default: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide city']
    },
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pricePerDay: {
    type: Number,
    min: 0
  },
  securityDeposit: {
    type: Number,
    min: 0
  },
  minimumRentalDays: {
    type: Number,
    default: 1,
    min: 1
  },
  maximumRentalDays: {
    type: Number,
    default: 30
  },
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  tags: [String],
  rentalDates: [{
    startDate: Date,
    endDate: Date,
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Social engagement features
  likesCount: {
    type: Number,
    default: 0,
    index: true
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  sharesCount: {
    type: Number,
    default: 0
  },
  savesCount: {
    type: Number,
    default: 0
  },
  // Boost/promotion features (PPC)
  boosted: {
    isActive: {
      type: Boolean,
      default: false
    },
    startDate: Date,
    endDate: Date,
    impressions: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    budget: {
      type: Number,
      default: 0
    },
    costPerClick: {
      type: Number,
      default: 5 // ₹5 per click
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    position: {
      type: String,
      enum: ['top', 'featured_carousel', 'category_top'],
      default: 'top'
    }
  },
  // Destination Bundles (Travel Pack)
  isPartOfBundle: {
    type: Boolean,
    default: false
  },
  bundles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bundle'
  }],
  // Influencer/Celebrity closet
  celebOwned: {
    isCelebItem: {
      type: Boolean,
      default: false
    },
    celebId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    celebName: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  // Geofencing metadata
  geofence: {
    expressDeliveryAvailable: {
      type: Boolean,
      default: false
    },
    hyperlocalOnly: {
      type: Boolean,
      default: false // Only show within 15km
    },
    deliveryRadius: {
      type: Number,
      default: 15 // km
    }
  },
  // Concierge service availability
  conciergeAvailable: {
    type: Boolean,
    default: false
  },
  vaultStored: {
    type: Boolean,
    default: false // Stored in central vault for instant dispatch
  },
  // Rental availability tracking
  currentRental: {
    isRented: {
      type: Boolean,
      default: false,
      index: true
    },
    rentedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rentalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental'
    },
    availableFrom: Date,
    returnDate: Date
  },
  // Waitlist count for display
  waitlistCount: {
    type: Number,
    default: 0
  },
  // Try before buy option
  tryBeforeBuy: {
    enabled: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number, // days
      default: 3
    },
    fee: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for geospatial queries
productSchema.index({ 'location.coordinates': '2dsphere' });

// Index for text search
productSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
