const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide property title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide detailed property description'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },
    propertyType: {
      type: String,
      required: [true, 'Please specify property type'],
      enum: ['Apartment', 'House', 'Villa', 'Studio', 'Condo', 'Townhouse'],
      default: 'Apartment',
    },
    rentPrice: {
      type: Number,
      required: [true, 'Please specify monthly rent price'],
      min: [0, 'Rent price must be a positive number'],
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      required: [true, 'Please specify street address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please specify city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please specify state/region'],
      trim: true,
    },
    zipCode: {
      type: String,
      default: '90210',
    },
    bedrooms: {
      type: Number,
      required: [true, 'Please specify number of bedrooms'],
      min: 0,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: [true, 'Please specify number of bathrooms'],
      min: 1,
      default: 1,
    },
    areaSqFt: {
      type: Number,
      required: [true, 'Please specify floor area in square feet'],
      min: [50, 'Area must be at least 50 sq ft'],
    },
    furnishedStatus: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Furnished',
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A property must have at least one image',
      },
    },
    virtualTourUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance searches
propertySchema.index({ city: 'text', title: 'text', address: 'text', description: 'text' });
propertySchema.index({ rentPrice: 1, propertyType: 1, status: 1 });

const Property = mongoose.model('Property', propertySchema);
module.exports = Property;
