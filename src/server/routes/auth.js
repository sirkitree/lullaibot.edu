const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateDetails,
  updatePassword,
  registerAdmin
} = require('../controllers/auth');

const router = express.Router();

// Import middleware
const { protect } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

// Admin routes
router.post('/register-admin', protect, registerAdmin);

module.exports = router; 