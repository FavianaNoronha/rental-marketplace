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
  // Premium/subscription
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
