const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Import models or data sources
const User = require('../models/User');
const { resources } = require('./resources');

/**
 * @route GET /api/admin/analytics/stats
 * @description Get overall statistics for the admin dashboard
 * @access Private/Admin
 */
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Get user count from MongoDB
    const totalUsers = await User.countDocuments({});
    
    // For other stats, use mock data for now
    // In a real implementation, these would be queried from the database
    const stats = {
      totalUsers,
      activeUsers: Math.round(totalUsers * 0.7), // Mock: 70% of users are active
      totalResources: resources.length,
      pendingResources: resources.filter(r => r.status === 'pending').length || 2,
      totalCategories: [...new Set(resources.map(r => r.category))].length || 5,
      totalVotes: resources.reduce((sum, r) => sum + (r.upvotes || 0), 0)
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Error fetching analytics stats:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics stats'
    });
  }
});

/**
 * @route GET /api/admin/analytics/user-registrations
 * @description Get user registration data over time
 * @access Private/Admin
 */
router.get('/user-registrations', protect, authorize('admin'), async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Mock data for user registrations
    // In production, this would be a database aggregation
    const labels = [];
    const values = [];
    
    // Generate dates for the past 30 days (or based on timeRange)
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Format date as MM/DD
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(formattedDate);
      
      // Generate random registration count (1-5)
      values.push(Math.floor(Math.random() * 5) + 1);
    }
    
    res.json({
      success: true,
      data: {
        labels,
        values
      }
    });
  } catch (err) {
    console.error('Error fetching user registration data:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user registration data'
    });
  }
});

/**
 * @route GET /api/admin/analytics/resources-by-category
 * @description Get resources grouped by category
 * @access Private/Admin
 */
router.get('/resources-by-category', protect, authorize('admin'), (req, res) => {
  try {
    // Get all unique categories
    const categories = [...new Set(resources.map(r => r.category))];
    
    // Count resources in each category
    const counts = categories.map(category => {
      return resources.filter(r => r.category === category).length;
    });
    
    res.json({
      success: true,
      data: {
        labels: categories,
        values: counts
      }
    });
  } catch (err) {
    console.error('Error fetching resources by category:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching resource categories'
    });
  }
});

/**
 * @route GET /api/admin/analytics/activity
 * @description Get activity data (resource submissions, logins, votes)
 * @access Private/Admin
 */
router.get('/activity', protect, authorize('admin'), (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;
    
    // Mock data for activity
    // In production, this would come from logs or activity tracking
    const labels = [];
    const resources = [];
    const logins = [];
    const votes = [];
    
    // Generate dates for the past 30 days (or based on timeRange)
    const days = timeRange === '7d' ? 7 : timeRange === '90d' ? 90 : 30;
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Format date as MM/DD
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      labels.push(formattedDate);
      
      // Generate random activity counts
      resources.push(Math.floor(Math.random() * 3)); // 0-2 resources per day
      logins.push(Math.floor(Math.random() * 10) + 5); // 5-14 logins per day
      votes.push(Math.floor(Math.random() * 8) + 2); // 2-9 votes per day
    }
    
    res.json({
      success: true,
      data: {
        labels,
        resources,
        logins,
        votes
      }
    });
  } catch (err) {
    console.error('Error fetching activity data:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching activity data'
    });
  }
});

module.exports = router; 