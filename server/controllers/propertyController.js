const Property = require('../models/Property');
const Review = require('../models/Review');

// @desc    Get all properties with multi-factor filtering & sorting
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res, next) => {
  try {
    const {
      keyword,
      city,
      state,
      propertyType,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishedStatus,
      amenities,
      featured,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { status: 'approved' };

    // Text / Keyword Search
    if (keyword && keyword.trim() !== '') {
      const regex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { title: regex },
        { description: regex },
        { address: regex },
        { city: regex },
        { state: regex },
      ];
    }

    // City Filter
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    // Property Type Filter (can be comma-separated or single)
    if (propertyType && propertyType !== 'All') {
      const types = propertyType.split(',').map((t) => t.trim());
      query.propertyType = { $in: types };
    }

    // Price Range Filter
    if (minPrice || maxPrice) {
      query.rentPrice = {};
      if (minPrice) query.rentPrice.$gte = Number(minPrice);
      if (maxPrice) query.rentPrice.$lte = Number(maxPrice);
    }

    // Bedrooms Filter
    if (bedrooms && bedrooms !== 'All') {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Bathrooms Filter
    if (bathrooms && bathrooms !== 'All') {
      query.bathrooms = { $gte: Number(bathrooms) };
    }

    // Furnished Status
    if (furnishedStatus && furnishedStatus !== 'All') {
      query.furnishedStatus = furnishedStatus;
    }

    // Amenities (comma separated: e.g. WiFi,Gym,Swimming Pool)
    if (amenities) {
      const amenityList = amenities.split(',').map((a) => a.trim());
      query.amenities = { $all: amenityList };
    }

    // Featured only
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // Default: Newest first
    if (sort === 'price_asc') {
      sortOptions = { rentPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOptions = { rentPrice: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sort === 'area_desc') {
      sortOptions = { areaSqFt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: properties.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured top properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .populate('owner', 'name email phone avatar')
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of unique cities for quick filters
// @route   GET /api/properties/cities
// @access  Public
const getCitiesList = async (req, res, next) => {
  try {
    const cities = await Property.find({ status: 'approved' }).distinct('city');
    res.json({
      success: true,
      data: cities.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      'owner',
      'name email phone avatar bio createdAt'
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found with specified ID',
      });
    }

    // Fetch reviews for this property
    const reviews = await Review.find({ property: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        ...property.toObject(),
        reviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new property listing
// @route   POST /api/properties
// @access  Private (Landlord, Admin)
const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      description,
      propertyType,
      rentPrice,
      securityDeposit,
      address,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      areaSqFt,
      furnishedStatus,
      amenities,
      images,
      virtualTourUrl,
    } = req.body;

    // Landlords have their properties set to 'pending' for admin approval. Admins are automatically 'approved'.
    const initialStatus = req.user.role === 'admin' ? 'approved' : 'pending';

    const defaultImages = [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    ];

    const property = await Property.create({
      title,
      description,
      propertyType: propertyType || 'Apartment',
      rentPrice: Number(rentPrice),
      securityDeposit: Number(securityDeposit) || Number(rentPrice),
      address,
      city,
      state,
      zipCode: zipCode || '90210',
      bedrooms: Number(bedrooms) || 1,
      bathrooms: Number(bathrooms) || 1,
      areaSqFt: Number(areaSqFt) || 850,
      furnishedStatus: furnishedStatus || 'Furnished',
      amenities: Array.isArray(amenities) ? amenities : [],
      images: images && images.length > 0 ? images : defaultImages,
      virtualTourUrl:
        virtualTourUrl ||
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      status: initialStatus,
      owner: req.user._id,
      rating: 5.0,
      numReviews: 0,
    });

    res.status(201).json({
      success: true,
      message:
        initialStatus === 'approved'
          ? 'Property listing created and live!'
          : 'Property submitted successfully! It is currently in the moderation queue for admin verification.',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner Landlord, Admin)
const updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Verify ownership or admin rights
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this property listing',
      });
    }

    // Update fields
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Property listing updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner Landlord, Admin)
const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Verify ownership or admin rights
    if (
      property.owner.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ property: req.params.id });

    res.json({
      success: true,
      message: 'Property removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get properties owned by the logged-in landlord
// @route   GET /api/properties/my-properties
// @access  Private (Landlord, Admin)
const getLandlordProperties = async (req, res, next) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve property listing
// @route   PUT /api/properties/:id/approve
// @access  Private (Admin only)
const approveProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.status = 'approved';
    property.rejectionReason = '';
    await property.save();

    res.json({
      success: true,
      message: `Property "${property.title}" has been approved and is now live!`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject property listing
// @route   PUT /api/properties/:id/reject
// @access  Private (Admin only)
const rejectProperty = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.status = 'rejected';
    property.rejectionReason = reason || 'Listing does not meet platform quality guidelines.';
    await property.save();

    res.json({
      success: true,
      message: `Property "${property.title}" has been marked as rejected.`,
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};
