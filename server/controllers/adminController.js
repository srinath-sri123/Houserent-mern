const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// @desc    Get system-wide analytics & KPIs
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getPlatformStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'tenant' });
    const totalLandlords = await User.countDocuments({ role: 'landlord' });

    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({
      status: 'pending',
    });
    const approvedProperties = await Property.countDocuments({
      status: 'approved',
    });
    const rejectedProperties = await Property.countDocuments({
      status: 'rejected',
    });

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({
      status: 'confirmed',
    });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });

    const confirmedBookingsData = await Booking.find({ status: 'confirmed' });
    const totalRevenueVolume = confirmedBookingsData.reduce(
      (acc, b) => acc + (b.totalAmount || 0),
      0
    );

    const totalReviews = await Review.countDocuments();

    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          tenants: totalTenants,
          landlords: totalLandlords,
        },
        properties: {
          total: totalProperties,
          pending: pendingProperties,
          approved: approvedProperties,
          rejected: rejectedProperties,
        },
        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          revenueVolume: totalRevenueVolume,
        },
        reviews: {
          total: totalReviews,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, keyword } = req.query;
    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (keyword) {
      query.$or = [
        { name: new RegExp(keyword, 'i') },
        { email: new RegExp(keyword, 'i') },
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['tenant', 'landlord', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User role changed to ${role}`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot delete their own account from active session',
      });
    }

    await User.findByIdAndDelete(req.params.id);
    await Property.deleteMany({ owner: req.params.id });
    await Booking.deleteMany({
      $or: [{ user: req.params.id }, { owner: req.params.id }],
    });

    res.json({
      success: true,
      message: 'User and all associated listings removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all properties (including pending/rejected for moderation)
// @route   GET /api/admin/properties
// @access  Private (Admin only)
const getAllProperties = async (req, res, next) => {
  try {
    const { status, keyword } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { city: new RegExp(keyword, 'i') },
        { address: new RegExp(keyword, 'i') },
      ];
    }

    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all platform bookings for audit
// @route   GET /api/admin/bookings
// @access  Private (Admin only)
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('property', 'title address city rentPrice images')
      .populate('user', 'name email phone')
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlatformStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllProperties,
  getAllBookings,
};
