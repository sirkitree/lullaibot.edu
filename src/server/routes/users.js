const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// In-memory storage for development (will be replaced with database)
let users = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe',
    points: 145,
    contributions: 12,
    currentStreak: 3,
    longestStreak: 7,
    createdAt: '2023-09-01'
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson',
    points: 450,
    contributions: 25,
    currentStreak: 12,
    longestStreak: 15,
    createdAt: '2023-08-15'
  }
];

// Track the relationship between a user's JWT token and their ID
// In a real app, this would come from the database
const tokenToUserId = new Map();

/**
 * @route GET /api/users
 * @description Get all users
 * @access Admin
 */
router.get('/', (req, res) => {
  // In a real app, this would be paginated and filtered
  // Also, sensitive data like emails would be hidden in non-admin requests
  
  return res.json({
    status: 'success',
    count: users.length,
    data: users.map(user => ({
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      points: user.points,
      contributions: user.contributions
    }))
  });
});

/**
 * @route GET /api/users/me/profile
 * @description Get current user profile
 * @access Private
 */
router.get('/me/profile', (req, res) => {
  // Mock current user - in real app, this would be from JWT or session
  const currentUser = users[0];
  
  return res.json({
    status: 'success',
    data: currentUser
  });
});

/**
 * @route GET /api/users/debug
 * @description Debug endpoint to check users array
 * @access Public
 */
router.get('/debug', (req, res) => {
  return res.json({
    status: 'success',
    usersCount: users.length,
    usersEmpty: users.length === 0,
    usersArray: Array.isArray(users),
    firstUser: users.length > 0 ? {
      id: users[0].id,
      name: users[0].name
    } : null
  });
});

/**
 * @route GET /api/users/leaderboard
 * @description Get user leaderboard
 * @access Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const { period = 'all', department } = req.query;
    
    // Query users from the database
    const dbUsers = await User.find()
      .select('name profilePicture points contributions')
      .sort({ points: -1 });
    
    console.log('Leaderboard request received. Found users:', dbUsers.length);
    
    // Map to leaderboard format
    const leaderboard = dbUsers.map((user, index) => {
      // Ensure ID is a consistent string format
      const userId = user._id.toString();
      console.log(`User ${user.name}, ID: ${userId}, Points: ${user.points}, Contributions: ${user.contributions}`);
      
      return {
        rank: index + 1,
        id: userId,  // Ensure this is a string
        name: user.name,
        avatar: user.profilePicture,
        points: user.points,
        contributions: user.contributions
      };
    });
    
    return res.json({
      status: 'success',
      count: leaderboard.length,
      data: leaderboard
    });
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching leaderboard'
    });
  }
});

/**
 * @route GET /api/users/:id
 * @description Get a single user by ID
 * @access Private/Admin
 */
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // In a real app, we would check if the requesting user
  // is the same as the requested user ID or an admin
  
  return res.json({
    status: 'success',
    data: user
  });
});

/**
 * @route PUT /api/users/me
 * @description Update current user profile
 * @access Private
 */
router.put('/me/profile', (req, res) => {
  const { name, avatar } = req.body;
  
  // Mock current user - in real app, this would be from JWT or session
  const currentUserIndex = 0;
  
  // Update fields
  const updatedUser = {
    ...users[currentUserIndex],
    ...(name && { name }),
    ...(avatar && { avatar })
  };
  
  // Replace in array
  users[currentUserIndex] = updatedUser;
  
  return res.json({
    status: 'success',
    message: 'Profile updated successfully',
    data: updatedUser
  });
});

/**
 * @route GET /api/users/:id/stats
 * @description Get user stats for profile, achievements, and leaderboards
 * @access Private
 */
router.get('/:id/stats', (req, res) => {
  // Find the user
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }

  // In a real app, we'd query the achievements collection
  // Here we'll use mock data that matches the expected interface
  const userAchievements = [
    { id: '1', name: 'First Contribution', dateEarned: '2023-10-05' },
    { id: '2', name: '5-Day Streak', dateEarned: '2023-10-10' }
  ];
  
  // Get the user's position/rank based on points
  const rankedUsers = [...users].sort((a, b) => b.points - a.points);
  const userRank = rankedUsers.findIndex(u => u.id === user.id) + 1;
  
  const stats = {
    contributions: user.contributions,
    points: user.points,
    streak: user.currentStreak,
    rank: userRank,
    achievements: {
      earned: userAchievements.length,
      total: 10 // Total possible achievements in the system
    }
  };
  
  return res.json({
    status: 'success',
    data: stats
  });
});

/**
 * @route GET /api/users/:id/resources
 * @description Get resources contributed by a user
 * @access Public
 */
router.get('/:id/resources', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Mock resources - in real app, this would query the resources collection
  const mockResources = [
    {
      id: '101',
      title: 'Introduction to AI',
      url: 'https://example.com/intro-ai',
      addedBy: user.id,
      date: '2023-10-15',
      upvotes: 15
    },
    {
      id: '102',
      title: 'ChatGPT Guide',
      url: 'https://example.com/chatgpt-guide',
      addedBy: user.id,
      date: '2023-10-10',
      upvotes: 8
    }
  ];
  
  return res.json({
    status: 'success',
    count: mockResources.length,
    data: mockResources
  });
});

/**
 * @route GET /api/users/:id/achievements
 * @description Get achievements earned by a user
 * @access Public
 */
router.get('/:id/achievements', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Mock achievements - in real app, this would query the achievements collection
  const mockAchievements = [
    {
      id: '1',
      name: 'First Contribution',
      description: 'Added your first resource to the library',
      icon: 'trophy',
      dateEarned: '2023-10-05'
    },
    {
      id: '2',
      name: '5-Day Streak',
      description: 'Contributed for 5 days in a row',
      icon: 'fire',
      dateEarned: '2023-10-10'
    }
  ];
  
  return res.json({
    status: 'success',
    count: mockAchievements.length,
    data: mockAchievements
  });
});

/**
 * @route POST /api/users/:id/award-points
 * @description Award points to a user
 * @access Admin
 */
router.post('/:id/award-points', (req, res) => {
  const { points, reason } = req.body;
  
  if (!points || points <= 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a positive number of points'
    });
  }
  
  const userIndex = users.findIndex(u => u.id === req.params.id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    });
  }
  
  // Update user points
  users[userIndex].points += points;
  
  return res.json({
    status: 'success',
    message: `Awarded ${points} points to ${users[userIndex].name}`,
    data: {
      user: users[userIndex],
      pointsAwarded: points,
      reason: reason || 'Manual adjustment',
      timestamp: new Date().toISOString()
    }
  });
});

/**
 * @route GET /api/users/debug-current
 * @description Debug endpoint to check current user info
 * @access Private
 */
router.get('/debug-current', protect, async (req, res) => {
  try {
    // Get the user from req.user (added by the protect middleware)
    const currentUser = req.user;
    
    // Format the response in a helpful way
    const userInfo = {
      id: currentUser._id.toString(),
      mongoId: {
        raw: currentUser._id,
        string: currentUser._id.toString(),
        valueOf: currentUser._id.valueOf()
      },
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      points: currentUser.points,
      contributions: currentUser.contributions
    };
    
    console.log('Debug current user info:', userInfo);
    
    return res.json({
      status: 'success',
      data: userInfo
    });
  } catch (err) {
    console.error('Error getting current user debug info:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Server error getting user debug info'
    });
  }
});

module.exports = { 
  router, 
  users  // Export the users array
}; 