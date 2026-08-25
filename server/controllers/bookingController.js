const Booking = require('../models/Booking');
const Property = require('../models/Property');

// @desc    Create new rental booking or visit schedule
// @route   POST /api/bookings
// @access  Private (Tenant, Landlord, Admin)
const createBooking = async (req, res, next) => {
  try {
    const {
      propertyId,
      visitType,
      checkInDate,
      checkOutDate,
      preferredTime,
      notes,
    } = req.body;

    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot book or schedule visits for your own property',
      });
    }

    // Calculate estimated total amount if rental
    let totalAmount = 0;
    if (visitType === 'rental') {
      totalAmount = property.rentPrice + (property.securityDeposit || 0);
    }

    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id,
      owner: property.owner,
      visitType: visitType || 'visit',
      checkInDate: new Date(checkInDate),
      checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
      preferredTime: preferredTime || '11:00 AM',
      totalAmount,
      notes: notes || '',
      status: 'pending',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title address city rentPrice images propertyType')
      .populate('user', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message:
        visitType === 'visit'
          ? 'Tour visit scheduled successfully! The owner will confirm shortly.'
          : 'Rental application submitted successfully! Owner will review your request.',
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings created by logged in user (Tenant)
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title address city state rentPrice securityDeposit images propertyType virtualTourUrl')
      .populate('owner', 'name email phone avatar')
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

// @desc    Get bookings received for properties owned by logged in Landlord
// @route   GET /api/bookings/landlord-requests
// @access  Private (Landlord, Admin)
const getLandlordBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ owner: req.user._id })
      .populate('property', 'title address city rentPrice propertyType images')
      .populate('user', 'name email phone avatar')
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

// @desc    Update booking status (Confirm / Reject by owner)
// @route   PUT /api/bookings/:id/status
// @access  Private (Landlord, Admin)
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, ownerResponse } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Verify landlord ownership or admin
    if (
      booking.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this booking',
      });
    }

    booking.status = status || booking.status;
    if (ownerResponse) booking.ownerResponse = ownerResponse;

    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('property', 'title address city rentPrice images')
      .populate('user', 'name email phone avatar')
      .populate('owner', 'name email phone avatar');

    res.json({
      success: true,
      message: `Booking has been marked as ${booking.status}`,
      data: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (Tenant or Admin)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check if requester is tenant who created or admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking',
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  updateBookingStatus,
  cancelBooking,
};
