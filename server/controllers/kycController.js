const KYC = require('../models/KYC');
const User = require('../models/User');

// Submit KYC
exports.submitKYC = async (req, res) => {
  try {
    const {
      fullName,
      dateOfBirth,
      address,
      idType,
      idNumber,
      idFrontImage,
      idBackImage,
      selfieImage,
      addressProofType,
      addressProofImage
    } = req.body;

    // Check if KYC already submitted
    let kyc = await KYC.findOne({ user: req.user._id });

    if (kyc && kyc.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'KYC already approved'
      });
    }

    if (kyc && kyc.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'KYC is already under review'
      });
    }

    // Create or update KYC
    if (!kyc) {
      kyc = await KYC.create({
        user: req.user._id,
        fullName,
        dateOfBirth,
        address,
        idType,
        idNumber,
        idFrontImage,
        idBackImage,
        selfieImage,
        addressProofType,
        addressProofImage,
        status: 'pending'
      });
    } else {
      kyc.fullName = fullName;
      kyc.dateOfBirth = dateOfBirth;
      kyc.address = address;
      kyc.idType = idType;
      kyc.idNumber = idNumber;
      kyc.idFrontImage = idFrontImage;
      kyc.idBackImage = idBackImage;
      kyc.selfieImage = selfieImage;
      kyc.addressProofType = addressProofType;
      kyc.addressProofImage = addressProofImage;
      kyc.status = 'pending';
      await kyc.save();
    }

    res.status(200).json({
      success: true,
      message: 'KYC submitted successfully and is under review',
      data: kyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit KYC',
      error: error.message
    });
  }
};

// Get KYC status
exports.getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user._id });

    if (!kyc) {
      return res.status(200).json({
        success: true,
        data: { status: 'not_started' }
      });
    }

    res.status(200).json({
      success: true,
      data: kyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC status',
      error: error.message
    });
  }
};

// Review KYC (Admin only)
exports.reviewKYC = async (req, res) => {
  try {
    const { kycId, status, rejectionReason, notes } = req.body;

    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: 'KYC not found'
      });
    }

    kyc.status = status;
    kyc.reviewedBy = req.user._id;
    kyc.reviewedAt = new Date();
    
    if (status === 'rejected') {
      kyc.rejectionReason = rejectionReason;
    }
    
    if (status === 'approved') {
      kyc.expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      
      // Update user verification status
      await User.findByIdAndUpdate(kyc.user, { kycVerified: true });
    }
    
    kyc.notes = notes;
    await kyc.save();

    res.status(200).json({
      success: true,
      message: `KYC ${status} successfully`,
      data: kyc
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to review KYC',
      error: error.message
    });
  }
};
