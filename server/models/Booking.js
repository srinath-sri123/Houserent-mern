const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property ID is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Renter/User ID is required'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Landlord/Owner ID is required'],
    },
    visitType: {
      type: String,
      enum: ['visit', 'rental'],
      default: 'visit',
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in or visit date is required'],
    },
    checkOutDate: {
      type: Date,
    },
    preferredTime: {
      type: String,
      default: '11:00 AM',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
    ownerResponse: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
