const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, 'Please provide a valid phone number']
  },
  location: {
    city: String,
    state: String,
    country: String,
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  phoneVerified: {
    type: Boolean,
    default: false
  },
  kycVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // Social features
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true,
    match: [/^[a-zA-Z0-9_]{3,20}$/, 'Username must be 3-20 characters, alphanumeric and underscore only']
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followingCount: {
    type: Number,
    default: 0
  },
  followersCount: {
    type: Number,
    default: 0
  },
  // Gamification & points
  points: {
    total: {
      type: Number,
      default: 0,
      index: true
    },
    level: {
      type: Number,
      default: 1
    },
    badges: [{
      name: String,
      icon: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActive: Date
    }
  },
  // Premium/subscription (Style Pass)
  premium: {
    isActive: {
      type: Boolean,
      default: false,
      index: true
    },
    tier: {
      type: String,
      enum: ['free', 'basic', 'pro', 'elite'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    features: {
      boostListing: {
        type: Number,
        default: 0 // Number of boosts available
      },
      prioritySupport: {
        type: Boolean,
        default: false
      },
      analytics: {
        type: Boolean,
        default: false
      },
      verifiedBadge: {
        type: Boolean,
        default: false
      }
    }
  },
  // Active subscription reference
  activeSubscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subscription'
  },
  // AI Style Profile for Style Twins matching
  styleProfile: {
    // Body measurements
    measurements: {
      height: {
        type: Number, // in cm
        min: 100,
        max: 250
      },
      weight: {
        type: Number, // in kg
        min: 30,
        max: 200
      },
      bust: Number, // in inches
      waist: Number,
      hips: Number,
      shoulders: Number,
      inseam: Number,
      // Standard sizes
      topSize: {
        type: String,
        enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
      },
      bottomSize: {
        type: String,
        enum: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL']
      },
      shoeSize: {
        type: Number,
        min: 4,
        max: 15
      },
      // Indian sizing
      lehengaSize: String,
      blouseSize: String,
      sareeSize: String
    },
    // Physical characteristics
    bodyType: {
      type: String,
      enum: ['petite', 'slim', 'athletic', 'curvy', 'plus_size', 'tall']
    },
    skinTone: {
      type: String,
      enum: ['fair', 'light', 'medium', 'olive', 'tan', 'brown', 'dark']
    },
    hairColor: {
      type: String,
      enum: ['black', 'brown', 'blonde', 'red', 'grey', 'other']
    },
    // Style preferences
    stylePreferences: {
      preferredColors: [String],
      avoidColors: [String],
      occasions: [{
        type: String,
        enum: ['casual', 'formal', 'party', 'wedding', 'ethnic', 'western', 'fusion']
      }],
      brands: [String],
      priceRange: {
        min: Number,
        max: Number
      }
    },
    // AI matching metadata
    styleTwinScore: {
      type: Number,
      default: 0 // Similarity score for matching
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  // Aadhaar KYC for security
  aadhaar: {
    number: {
      type: String,
      select: false, // Don't return in queries by default
      match: [/^[0-9]{12}$/, 'Invalid Aadhaar number']
    },
    verified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    videoKycCompleted: {
      type: Boolean,
      default: false
    },
    videoKycDate: Date,
    kycProvider: {
      type: String,
      enum: ['signzy', 'hyperverge', 'manual']
    },
    kycReferenceId: String
  },
  // Security deposits & financial
  paymentMethods: [{
    type: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet']
    },
    provider: String, // razorpay, cashfree
    last4: String,
    isDefault: Boolean,
    customerId: String // Razorpay/Cashfree customer ID
  }],
  // Earnings & commission tracking
  earnings: {
    total: {
      type: Number,
      default: 0
    },
    available: {
      type: Number,
      default: 0 // Amount available for withdrawal
    },
    pending: {
      type: Number,
      default: 0 // Amount in pending transactions
    },
    withdrawn: {
      type: Number,
      default: 0
    }
  },
  // Activity stats
  stats: {
    totalListings: {
      type: Number,
      default: 0
    },
    totalRentals: {
      type: Number,
      default: 0
    },
    totalSales: {
      type: Number,
      default: 0
    },
    completedTransactions: {
      type: Number,
      default: 0
    },
    responseTime: {
      type: Number, // Average in hours
      default: 24
    },
    responseRate: {
      type: Number, // Percentage
      default: 0
    }
  },
  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      }
    },
    privacy: {
      showEmail: {
        type: Boolean,
        default: false
      },
      showPhone: {
        type: Boolean,
        default: false
      },
      showLocation: {
        type: Boolean,
        default: true
      },
      profileVisibility: {
        type: String,
        enum: ['public', 'followers', 'private'],
        default: 'public'
      }
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
