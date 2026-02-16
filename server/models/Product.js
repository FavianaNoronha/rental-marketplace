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
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Clothes', 'Shoes', 'Accessories', 'Bags', 'Jewelry', 'Other']
  },
  subcategory: {
    type: String,
    required: [true, 'Please select a subcategory'],
    enum: ['Men', 'Women', 'Kids', 'Unisex']
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
  // Boost/promotion features
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
    }
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
