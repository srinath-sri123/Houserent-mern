const express = require('express');
const router = express.Router();
const {
  createReview,
  getPropertyReviews,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/property/:propertyId', getPropertyReviews);
router.post('/', protect, createReview);

module.exports = router;
