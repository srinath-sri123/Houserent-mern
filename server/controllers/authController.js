const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, avatar, bio } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email address already exists',
      });
    }

    // Default avatar if none provided
    const userAvatar =
      avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        name || 'HouseHunt'
      )}`;

    // Create user (default role is tenant if invalid role supplied, admin cannot be registered directly)
    const assignedRole = role === 'landlord' ? 'landlord' : 'tenant';

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '+1 (555) 019-2834',
      avatar: userAvatar,
      bio: bio || `Hello! I am a ${assignedRole} on HouseHunt.`,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          bio: user.bio,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data provided',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Check for user (select password explicitly because select: false in model)
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        bio: user.bio,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.avatar = req.body.avatar || user.avatar;
    user.bio = req.body.bio || user.bio;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        token: generateToken(updatedUser._id),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Demo Credentials for quick testing
// @route   GET /api/auth/demo-users
// @access  Public
const getDemoUsers = async (req, res) => {
  res.json({
    success: true,
    data: [
      {
        role: 'tenant',
        name: 'Alex Johnson (Tenant)',
        email: 'tenant@househunt.com',
        password: 'password123',
        description: 'Browse properties, schedule visits & apply for rentals',
      },
      {
        role: 'landlord',
        name: 'Sarah Sterling (Landlord)',
        email: 'landlord@househunt.com',
        password: 'password123',
        description: 'List properties, manage leases & approve visits',
      },
      {
        role: 'admin',
        name: 'Marcus Vance (Admin)',
        email: 'admin@househunt.com',
        password: 'password123',
        description: 'Platform moderation, approve listings & user control',
      },
    ],
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getDemoUsers,
};
