const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Add review for a property
// @route   POST /api/reviews
// @access  Private (Tenant, Landlord, Admin)
const createReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user already reviewed this property
    let existingReview = await Review.findOne({
      property: propertyId,
      user: req.user._id,
    });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
      await existingReview.save();

      const populated = await Review.findById(existingReview._id).populate(
        'user',
        'name avatar'
      );

      return res.json({
        success: true,
        message: 'Your review has been updated!',
        data: populated,
      });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'name avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Review posted successfully!',
      data: populatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
};
