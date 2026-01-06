const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', login);

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, getMe);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

module.exports = router;