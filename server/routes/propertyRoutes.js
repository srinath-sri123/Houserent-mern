const express = require('express');
const router = express.Router();
const {
  getProperties,
  getFeaturedProperties,
  getCitiesList,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordProperties,
  approveProperty,
  rejectProperty,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/cities', getCitiesList);

// Landlord & Admin routes
router.get(
  '/my-properties',
  protect,
  authorize('landlord', 'admin'),
  getLandlordProperties
);
router.post(
  '/',
  protect,
  authorize('landlord', 'admin'),
  createProperty
);

// Single property routes
router.get('/:id', getPropertyById);
router.put('/:id', protect, authorize('landlord', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('landlord', 'admin'), deleteProperty);

// Admin Moderation routes
router.put('/:id/approve', protect, authorize('admin'), approveProperty);
router.put('/:id/reject', protect, authorize('admin'), rejectProperty);

module.exports = router;
