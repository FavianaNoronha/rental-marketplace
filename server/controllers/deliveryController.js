const Delivery = require('../models/Delivery');
const Rental = require('../models/Rental');
const Product = require('../models/Product');
const { getHyperlocalAvailability, estimateDeliveryTime, calculateDeliveryCost } = require('../utils/geofencing');

/**
 * @desc    Create delivery for rental
 * @route   POST /api/deliveries
 * @access  Private
 */
exports.createDelivery = async (req, res) => {
  try {
    const {
      rentalId,
      type,
      provider,
      serviceType,
      from,
      to,
      scheduledAt,
      specialInstructions
    } = req.body;
    
    const rental = await Rental.findById(rentalId).populate('product');
    
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }
    
    // Create delivery
    const delivery = await Delivery.create({
      rental: rentalId,
      product: rental.product._id,
      type,
      provider: provider || 'self',
      serviceType: serviceType || 'standard',
      from,
      to,
      scheduledAt,
      specialInstructions
    });
    
    // Calculate distance and costs
    if (delivery.from.address.coordinates && delivery.to.address.coordinates) {
      delivery.calculateDistance();
      
      const cost = calculateDeliveryCost(
        delivery.distanceKm,
        delivery.serviceType,
        delivery.provider
      );
      
      delivery.cost = {
        base: cost.base,
        surcharge: cost.surcharge,
        total: cost.total,
        paidBy: 'renter'
      };
      
      const time = estimateDeliveryTime(
        delivery.distanceKm,
        delivery.serviceType,
        delivery.provider
      );
      
      delivery.estimatedDeliveryTime = time.estimatedTime.max;
      delivery.isExpressDelivery = delivery.isHyperlocal && delivery.serviceType === 'express';
      
      await delivery.save();
    }
    
    res.status(201).json({
      success: true,
      data: delivery,
      message: 'Delivery created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating delivery',
      error: error.message
    });
  }
};

/**
 * @desc    Get delivery by ID
 * @route   GET /api/deliveries/:id
 * @access  Private
 */
exports.getDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('rental')
      .populate('product', 'title images');
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching delivery',
      error: error.message
    });
  }
};

/**
 * @desc    Get deliveries for a rental
 * @route   GET /api/deliveries/rental/:rentalId
 * @access  Private
 */
exports.getDeliveriesForRental = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ rental: req.params.rentalId })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: deliveries.length,
      data: deliveries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching deliveries',
      error: error.message
    });
  }
};

/**
 * @desc    Update delivery status
 * @route   PUT /api/deliveries/:id/status
 * @access  Private
 */
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { status, location, message } = req.body;
    
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    // Add tracking update
    await delivery.addTrackingUpdate(status, message, location);
    
    // Update timestamps based on status
    if (status === 'in_transit' && !delivery.pickedUpAt) {
      delivery.pickedUpAt = new Date();
    } else if (status === 'delivered' && !delivery.deliveredAt) {
      delivery.deliveredAt = new Date();
    }
    
    await delivery.save();
    
    res.status(200).json({
      success: true,
      data: delivery,
      message: 'Delivery status updated'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating delivery status',
      error: error.message
    });
  }
};

/**
 * @desc    Check hyperlocal availability
 * @route   POST /api/deliveries/check-hyperlocal
 * @access  Public
 */
exports.checkHyperlocalAvailability = async (req, res) => {
  try {
    const { productId, userLocation } = req.body;
    
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const availability = getHyperlocalAvailability(product, userLocation);
    
    res.status(200).json({
      success: true,
      data: availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking hyperlocal availability',
      error: error.message
    });
  }
};

/**
 * @desc    Schedule concierge pickup
 * @route   POST /api/deliveries/:id/concierge-pickup
 * @access  Private
 */
exports.scheduleConciergePickup = async (req, res) => {
  try {
    const { scheduledAt, dryCleaning, vaultStorage } = req.body;
    
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    delivery.isConciergeService = true;
    delivery.scheduledAt = scheduledAt;
    delivery.conciergeDetails = {
      pickupScheduled: true,
      dryCleaning: dryCleaning || { required: false },
      vaultStorage: vaultStorage || { required: false }
    };
    
    await delivery.save();
    
    res.status(200).json({
      success: true,
      data: delivery,
      message: 'Concierge pickup scheduled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error scheduling concierge pickup',
      error: error.message
    });
  }
};

/**
 * @desc    Upload proof of delivery
 * @route   POST /api/deliveries/:id/proof
 * @access  Private
 */
exports.uploadProofOfDelivery = async (req, res) => {
  try {
    const { type, images } = req.body; // type: 'pickup' | 'delivery'
    
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    if (type === 'pickup') {
      delivery.proofOfPickup = images;
    } else if (type === 'delivery') {
      delivery.proofOfDelivery = images;
      delivery.deliveredAt = new Date();
      delivery.status = 'delivered';
    }
    
    await delivery.save();
    
    res.status(200).json({
      success: true,
      data: delivery,
      message: 'Proof uploaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading proof',
      error: error.message
    });
  }
};

/**
 * @desc    Get delivery tracking
 * @route   GET /api/deliveries/:id/tracking
 * @access  Public
 */
exports.getTracking = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        status: delivery.status,
        trackingUpdates: delivery.trackingUpdates,
        estimatedDeliveryTime: delivery.estimatedDeliveryTime,
        deliveryPartner: delivery.deliveryPartner,
        isExpressDelivery: delivery.isExpressDelivery,
        isHyperlocal: delivery.isHyperlocal
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tracking',
      error: error.message
    });
  }
};

module.exports = exports;
