const Dispute = require('../models/Dispute');
const Rental = require('../models/Rental');

// Raise a dispute
exports.raiseDispute = async (req, res) => {
  try {
    const {
      rentalId,
      type,
      description,
      evidence
    } = req.body;

    const rental = await Rental.findById(rentalId);
    if (!rental) {
      return res.status(404).json({
        success: false,
        message: 'Rental not found'
      });
    }

    // Verify user is involved in the rental
    const isRenter = rental.renter.toString() === req.user._id.toString();
    const isOwner = rental.owner.toString() === req.user._id.toString();
    
    if (!isRenter && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to raise a dispute for this rental'
      });
    }

    const againstUser = isRenter ? rental.owner : rental.renter;

    const dispute = await Dispute.create({
      rental: rentalId,
      raisedBy: req.user._id,
      againstUser,
      type,
      description,
      evidence: evidence || []
    });

    // Mark rental as disputed
    rental.disputeRaised = true;
    await rental.save();

    res.status(201).json({
      success: true,
      message: 'Dispute raised successfully',
      data: dispute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to raise dispute',
      error: error.message
    });
  }
};

// Get user's disputes
exports.getUserDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find({
      $or: [
        { raisedBy: req.user._id },
        { againstUser: req.user._id }
      ]
    })
    .populate('rental')
    .populate('raisedBy', 'name email')
    .populate('againstUser', 'name email')
    .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: disputes.length,
      data: disputes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disputes',
      error: error.message
    });
  }
};

// Add comment to dispute
exports.addDisputeComment = async (req, res) => {
  try {
    const { disputeId, text } = req.body;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    dispute.comments.push({
      user: req.user._id,
      text
    });

    await dispute.save();

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: dispute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// Resolve dispute (Admin only)
exports.resolveDispute = async (req, res) => {
  try {
    const { disputeId, decision, compensationAmount, notes } = req.body;

    const dispute = await Dispute.findById(disputeId);
    if (!dispute) {
      return res.status(404).json({
        success: false,
        message: 'Dispute not found'
      });
    }

    dispute.status = 'resolved';
    dispute.resolution = {
      decision,
      compensationAmount: compensationAmount || 0,
      resolvedBy: req.user._id,
      resolvedAt: new Date(),
      notes
    };

    await dispute.save();

    res.status(200).json({
      success: true,
      message: 'Dispute resolved successfully',
      data: dispute
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to resolve dispute',
      error: error.message
    });
  }
};
