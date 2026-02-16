const express = require('express');
const router = express.Router();
const RentalCalendar = require('../models/RentalCalendar');
const Waitlist = require('../models/Waitlist');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @route   GET /api/rental-status/:productId
// @desc    Get rental status and availability for a product
// @access  Public
router.get('/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    
    // Get current rental status
    const currentStatus = await RentalCalendar.getCurrentStatus(productId);
    
    // Get upcoming rentals
    const now = new Date();
    const upcomingRentals = await RentalCalendar.find({
      product: productId,
      status: { $in: ['booked', 'active'] },
      startDate: { $gte: now }
    })
      .sort({ startDate: 1 })
      .limit(5)
      .lean();
    
    // Get next available date
    const nextAvailable = await RentalCalendar.getNextAvailableDate(productId);
    
    // Get waitlist count
    const waitlistCount = await Waitlist.countDocuments({
      product: productId,
      status: 'waiting'
    });
    
    res.json({
      success: true,
      data: {
        current: currentStatus,
        upcoming: upcomingRentals,
        nextAvailable,
        waitlistCount,
        isAvailableNow: !currentStatus.isRented
      }
    });
  } catch (error) {
    console.error('Get rental status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching rental status',
      error: error.message
    });
  }
});

// @route   GET /api/rental-status/:productId/calendar
// @desc    Get calendar view of rental availability
// @access  Public
router.get('/:productId/calendar', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + 90 * 24 * 60 * 60 * 1000); // 90 days
    
    const rentals = await RentalCalendar.find({
      product: req.params.productId,
      status: { $in: ['booked', 'active'] },
      $or: [
        { startDate: { $gte: start, $lte: end } },
        { endDate: { $gte: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } }
      ]
    })
      .populate('renter', 'name avatar')
      .sort({ startDate: 1 });
    
    // Generate calendar data
    const calendar = [];
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      const dayData = {
        date: new Date(currentDate),
        available: true,
        rental: null
      };
      
      // Check if this day is booked
      for (const rental of rentals) {
        if (currentDate >= rental.startDate && currentDate <= rental.endDate) {
          dayData.available = false;
          dayData.rental = {
            id: rental._id,
            renter: rental.renter,
            startDate: rental.startDate,
            endDate: rental.endDate,
            status: rental.status
          };
          break;
        }
      }
      
      calendar.push(dayData);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    res.json({
      success: true,
      data: {
        calendar,
        rentals
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching calendar',
      error: error.message
    });
  }
});

// @route   POST /api/rental-status/:productId/check-availability
// @desc    Check if specific dates are available
// @access  Public
router.post('/:productId/check-availability', async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required'
      });
    }
    
    const isAvailable = await RentalCalendar.isAvailable(
      req.params.productId,
      new Date(startDate),
      new Date(endDate)
    );
    
    if (!isAvailable) {
      // Find conflicting rentals
      const conflicts = await RentalCalendar.find({
        product: req.params.productId,
        status: { $in: ['booked', 'active'] },
        $or: [
          { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(startDate) } },
          { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(endDate) } },
          { startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } }
        ]
      });
      
      return res.json({
        success: true,
        available: false,
        conflicts,
        message: 'Selected dates are not available'
      });
    }
    
    res.json({
      success: true,
      available: true,
      message: 'Dates are available'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking availability',
      error: error.message
    });
  }
});

// @route   POST /api/rental-status/:productId/waitlist
// @desc    Join waitlist for a product
// @access  Private
router.post('/:productId/waitlist', protect, async (req, res) => {
  try {
    const { desiredStartDate, desiredEndDate, notes } = req.body;
    
    // Check if already on waitlist
    const existing = await Waitlist.findOne({
      product: req.params.productId,
      user: req.user.id,
      status: 'waiting'
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already on the waitlist for this product'
      });
    }
    
    // Calculate duration
    const start = new Date(desiredStartDate);
    const end = new Date(desiredEndDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const duration = days === 1 ? '1 day' : `${days} days`;
    
    const waitlistEntry = await Waitlist.create({
      product: req.params.productId,
      user: req.user.id,
      desiredStartDate,
      desiredEndDate,
      duration,
      notes
    });
    
    // Update waitlist count on product
    await Product.findByIdAndUpdate(
      req.params.productId,
      { $inc: { waitlistCount: 1 } }
    );
    
    // Get position
    const position = await waitlistEntry.getPosition();
    
    res.status(201).json({
      success: true,
      data: waitlistEntry,
      position,
      message: `You're #${position} on the waitlist`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error joining waitlist',
      error: error.message
    });
  }
});

// @route   GET /api/rental-status/:productId/waitlist
// @desc    Get waitlist for a product
// @access  Public
router.get('/:productId/waitlist', async (req, res) => {
  try {
    const waitlist = await Waitlist.find({
      product: req.params.productId,
      status: 'waiting'
    })
      .populate('user', 'name avatar username')
      .sort({ priority: -1, createdAt: 1 });
    
    res.json({
      success: true,
      data: waitlist,
      count: waitlist.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waitlist',
      error: error.message
    });
  }
});

// @route   DELETE /api/rental-status/waitlist/:waitlistId
// @desc    Leave waitlist
// @access  Private
router.delete('/waitlist/:waitlistId', protect, async (req, res) => {
  try {
    const waitlistEntry = await Waitlist.findOne({
      _id: req.params.waitlistId,
      user: req.user.id
    });
    
    if (!waitlistEntry) {
      return res.status(404).json({
        success: false,
        message: 'Waitlist entry not found'
      });
    }
    
    const productId = waitlistEntry.product;
    
    waitlistEntry.status = 'cancelled';
    waitlistEntry.cancelledAt = new Date();
    await waitlistEntry.save();
    
    // Decrement waitlist count
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { waitlistCount: -1 } }
    );
    
    res.json({
      success: true,
      message: 'Removed from waitlist'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error leaving waitlist',
      error: error.message
    });
  }
});

// @route   GET /api/rental-status/user/waitlist
// @desc    Get user's waitlist entries
// @access  Private
router.get('/user/waitlist', protect, async (req, res) => {
  try {
    const waitlist = await Waitlist.find({
      user: req.user.id,
      status: { $in: ['waiting', 'notified'] }
    })
      .populate('product', 'title images price seller')
      .sort({ createdAt: -1 });
    
    // Add position for each entry
    for (let entry of waitlist) {
      entry.position = await entry.getPosition();
    }
    
    res.json({
      success: true,
      data: waitlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching waitlist',
      error: error.message
    });
  }
});

module.exports = router;
