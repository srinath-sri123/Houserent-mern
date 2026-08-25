const express = require('express');
const router = express.Router();
const {
  createBooking,
  getMyBookings,
  getLandlordBookings,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect); // All booking routes require login

router.post('/', createBooking);
router.get('/my-bookings', getMyBookings);
router.get(
  '/landlord-requests',
  authorize('landlord', 'admin'),
  getLandlordBookings
);
router.put('/:id/status', authorize('landlord', 'admin'), updateBookingStatus);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
