const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  rental: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rental',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['pickup', 'delivery', 'return'],
    required: true
  },
  // Delivery service
  provider: {
    type: String,
    enum: ['borzo', 'dunzo', 'porter', 'self', 'concierge'],
    default: 'self'
  },
  serviceType: {
    type: String,
    enum: ['express', 'standard', 'scheduled', 'hyperlocal'],
    default: 'standard'
  },
  // Addresses
  from: {
    name: String,
    phone: String,
    address: {
      street: String,
      landmark: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number] // [longitude, latitude]
      }
    }
  },
  to: {
    name: String,
    phone: String,
    address: {
      street: String,
      landmark: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: [Number]
      }
    }
  },
  // Geofencing check
  distanceKm: {
    type: Number,
    min: 0
  },
  isHyperlocal: {
    type: Boolean,
    default: false // True if within 15km radius
  },
  hyperLocalEligible: {
    type: Boolean,
    default: false
  },
  // Status tracking
  status: {
    type: String,
    enum: [
      'pending',
      'scheduled',
      'assigned',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'failed',
      'cancelled'
    ],
    default: 'pending'
  },
  // Delivery partner details
  deliveryPartner: {
    name: String,
    phone: String,
    vehicleNumber: String,
    trackingId: String,
    externalOrderId: String // Borzo/Dunzo order ID
  },
  // Time tracking
  scheduledAt: Date,
  pickedUpAt: Date,
  deliveredAt: Date,
  estimatedDeliveryTime: Date,
  // 90-minute express delivery for hyperlocal
  isExpressDelivery: {
    type: Boolean,
    default: false
  },
  // Costs
  cost: {
    base: {
      type: Number,
      default: 0
    },
    surcharge: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      default: 0
    },
    paidBy: {
      type: String,
      enum: ['renter', 'owner', 'platform', 'subscription'],
      default: 'renter'
    }
  },
  // Tracking
  trackingUpdates: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    status: String,
    location: {
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: [Number]
    },
    message: String
  }],
  // Photos
  proofOfPickup: [String],
  proofOfDelivery: [String],
  // Notes
  specialInstructions: String,
  notes: String,
  // Concierge service (white-glove)
  isConciergeService: {
    type: Boolean,
    default: false
  },
  conciergeDetails: {
    pickupScheduled: Boolean,
    dryCleaning: {
      required: Boolean,
      provider: String, // e.g., "Fabklean"
      cost: Number,
      status: String
    },
    vaultStorage: {
      required: Boolean,
      vaultId: String,
      storedAt: Date,
      retrievedAt: Date
    }
  }
}, {
  timestamps: true
});

// Geospatial index for location queries
deliverySchema.index({ 'from.address.coordinates': '2dsphere' });
deliverySchema.index({ 'to.address.coordinates': '2dsphere' });
deliverySchema.index({ rental: 1, type: 1 });
deliverySchema.index({ status: 1 });

// Calculate distance between two points (Haversine formula)
deliverySchema.methods.calculateDistance = function() {
  const from = this.from.address.coordinates.coordinates;
  const to = this.to.address.coordinates.coordinates;
  
  if (!from || !to || from.length !== 2 || to.length !== 2) {
    return null;
  }
  
  const [lon1, lat1] = from;
  const [lon2, lat2] = to;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  this.distanceKm = distance;
  this.isHyperlocal = distance <= 15; // Within 15km
  
  return distance;
};

// Update tracking
deliverySchema.methods.addTrackingUpdate = function(status, message, location) {
  this.trackingUpdates.push({
    status,
    message,
    location: location ? {
      type: 'Point',
      coordinates: location
    } : undefined
  });
  
  this.status = status;
  return this.save();
};

module.exports = mongoose.model('Delivery', deliverySchema);
