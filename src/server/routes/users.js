const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// Import resources from resources router
const resourcesModule = require('./resources');
const resources = resourcesModule.resources;

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
router.get('/:id/stats', async (req, res) => {
  try {
    // First try to find user in MongoDB database
    let dbUser;
    try {
      // Handle both ObjectId and string ID formats
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Valid ObjectId format
        dbUser = await User.findById(req.params.id);
      } else {
        // String ID format - try to find by other fields
        dbUser = await User.findOne({ 
          $or: [
            { legacyId: req.params.id },
            { id: req.params.id }
          ]
        });
      }
    } catch (err) {
      console.log(`Error finding user by ID: ${err.message}`);
    }
    
    if (!dbUser) {
      console.log(`User not found in database with ID: ${req.params.id}`);
      
      // Fall back to in-memory array (primarily for development)
      const memUser = users.find(u => u.id === req.params.id || u._id === req.params.id);
      
      if (!memUser) {
        console.log(`User not found in memory array either with ID: ${req.params.id}`);
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Use memory user data
      return sendUserStats(req, res, memUser);
    }
    
    // Use database user data
    return sendUserStats(req, res, dbUser);
  } catch (err) {
    console.error(`Error fetching user stats: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user stats'
    });
  }
});

// Helper function to send user stats
function sendUserStats(req, res, user) {
  // In a real app, we'd query the achievements collection
  // Here we'll use mock data that matches the expected interface
  const userAchievements = [
    { id: '1', name: 'First Contribution', dateEarned: '2023-10-05' },
    { id: '2', name: '5-Day Streak', dateEarned: '2023-10-10' }
  ];
  
  // For MongoDB users, we'll just use their position in the leaderboard as rank
  // In a real app, this would be calculated with an aggregation query
  const userRank = user.points > 100 ? 1 : (user.points > 50 ? 2 : 3);
  
  const stats = {
    contributions: user.contributions || 0,
    points: user.points || 0,
    streak: user.currentStreak || 0,
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
}

/**
 * @route GET /api/users/:id/resources
 * @description Get resources contributed by a user
 * @access Public
 */
router.get('/:id/resources', async (req, res) => {
  try {
    // First try to find user in MongoDB database
    const dbUser = await User.findById(req.params.id);
    
    if (!dbUser) {
      console.log(`User not found in database with ID: ${req.params.id}`);
      
      // Fall back to in-memory array (primarily for development)
      const memUser = users.find(u => u.id === req.params.id || u._id === req.params.id);
      
      if (!memUser) {
        console.log(`User not found in memory array either with ID: ${req.params.id}`);
        return res.status(404).json({
          status: 'error',
          message: 'User not found'
        });
      }
      
      // Get resources from the in-memory array for development
      const userMemResources = resources.filter(r => r.addedBy === memUser.id || r.addedBy === memUser.email);
      return res.json({
        status: 'success',
        data: userMemResources
      });
    }
    
    // For database users, return mock resources or from the in-memory array
    // In a real app, this would query the resources collection
    const userId = dbUser._id.toString();
    const userResources = resources.filter(r => r.addedBy === userId || r.addedBy === dbUser.email);
    
    console.log(`Found ${userResources.length} resources for user ${dbUser.name} with ID ${userId}`);
    
    // If no resources found, return demo/mock resources to show UI
    if (userResources.length === 0) {
      const mockResources = [
        {
          id: 'demo1',
          title: 'Demo Resource 1',
          description: 'This is a demo resource to demonstrate the UI.',
          url: 'https://example.com/demo1',
          category: 'Demo',
          addedBy: userId,
          date: new Date().toISOString().split('T')[0],
          upvotes: 5
        },
        {
          id: 'demo2',
          title: 'Demo Resource 2',
          description: 'Another demo resource to demonstrate the UI.',
          url: 'https://example.com/demo2',
          category: 'Demo',
          addedBy: userId,
          date: new Date().toISOString().split('T')[0],
          upvotes: 3
        }
      ];
      
      return res.json({
        status: 'success',
        data: mockResources,
        message: 'No actual resources found. Showing demo resources.'
      });
    }
    
    return res.json({
      status: 'success',
      data: userResources
    });
  } catch (err) {
    console.error(`Error fetching user resources: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user resources'
    });
  }
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

/**
 * @route GET /api/users/debug-user/:id
 * @description Debug endpoint to get raw user data for a specific ID
 * @access Public (for development only)
 */
router.get('/debug-user/:id', async (req, res) => {
  try {
    console.log(`Attempting to find user with ID: ${req.params.id}`);
    
    // Try to find the user in MongoDB
    let dbUser;
    try {
      // Handle both ObjectId and string ID formats
      if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        // Valid ObjectId format
        dbUser = await User.findById(req.params.id);
      } else {
        // String ID format - try to find by other fields
        dbUser = await User.findOne({ 
          $or: [
            { legacyId: req.params.id },
            { id: req.params.id }
          ]
        });
      }
    } catch (err) {
      console.log(`Error finding user by ID: ${err.message}`);
    }
    
    if (dbUser) {
      console.log(`Found user in MongoDB: ${dbUser.name}`);
      return res.json({
        status: 'success',
        source: 'mongodb',
        data: {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
          points: dbUser.points,
          contributions: dbUser.contributions,
          rawData: dbUser
        }
      });
    }
    
    // Try to find in memory array
    const memUser = users.find(u => u.id === req.params.id || u._id === req.params.id);
    
    if (memUser) {
      console.log(`Found user in memory array: ${memUser.name}`);
      return res.json({
        status: 'success',
        source: 'memory',
        data: memUser
      });
    }
    
    console.log(`User not found in either source with ID: ${req.params.id}`);
    return res.status(404).json({
      status: 'error',
      message: 'User not found in any data source'
    });
    
  } catch (err) {
    console.error(`Error in debug-user: ${err.message}`);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user debug data',
      error: err.message 
    });
  }
});

/**
 * @route GET /api/users/admin/users
 * @description Get all users (admin only)
 * @access Admin
 */
router.get('/admin/users', protect, async (req, res) => {
  try {
    // For production, we should verify the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      });
    }

    // Get query parameters for pagination and search
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    let query = {};
    
    // Add search functionality if search parameter is provided
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // First try to find users in MongoDB
    let users;
    let total;
    
    try {
      // Execute query with pagination
      users = await User.find(query)
        .select('-password') // Exclude password
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });
      
      // Get total count for pagination
      total = await User.countDocuments(query);
      
      console.log(`Found ${users.length} users in database matching query`);
      
      // Transform the Mongo document for the frontend
      users = users.map(user => {
        const userObject = user.toObject();
        userObject.id = userObject._id.toString();
        return userObject;
      });
    } catch (err) {
      console.error('Error querying database:', err);
      // Fall back to in-memory users if database query fails
      users = mockAuthUsers
        .filter(user => 
          !search || 
          user.name.toLowerCase().includes(search.toLowerCase()) || 
          user.email.toLowerCase().includes(search.toLowerCase())
        )
        .slice((page - 1) * limit, page * limit)
        .map(({ password, ...user }) => user);
      
      total = mockAuthUsers.length;
      console.log(`Using in-memory users instead. Found ${users.length} users.`);
    }
    
    return res.status(200).json({
      success: true,
      data: users,
      total,
      page,
      limit
    });
  } catch (err) {
    console.error('Error in admin/users route:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error fetching users'
    });
  }
});

/**
 * @route PUT /api/users/admin/users/:id
 * @description Update a user (admin only)
 * @access Admin
 */
router.put('/admin/users/:id', protect, async (req, res) => {
  try {
    // Verify the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      });
    }
    
    const userId = req.params.id;
    
    // Check if userId is valid
    if (!userId || userId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID provided'
      });
    }
    
    // Try to find and update user in the database
    try {
      // Check if user exists
      const existingUser = await User.findById(userId);
      
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Update allowed fields
      const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        points: req.body.points,
        contributions: req.body.contributions,
        streak: req.body.streak
      };
      
      // Remove undefined fields
      Object.keys(fieldsToUpdate).forEach(key => 
        fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
      );
      
      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        fieldsToUpdate,
        { new: true, runValidators: true }
      ).select('-password');
      
      // Add id property for frontend consistency
      const userResponse = updatedUser.toObject();
      userResponse.id = userResponse._id.toString();
      
      return res.status(200).json({
        success: true,
        data: userResponse
      });
    } catch (err) {
      console.error('Database error updating user:', err);
      return res.status(500).json({
        success: false,
        message: 'Error updating user'
      });
    }
  } catch (err) {
    console.error('Server error in admin/users/:id route:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error updating user'
    });
  }
});

/**
 * @route DELETE /api/users/admin/users/:id
 * @description Delete a user (admin only)
 * @access Admin
 */
router.delete('/admin/users/:id', protect, async (req, res) => {
  try {
    // Verify the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Admin privileges required'
      });
    }
    
    const userId = req.params.id;
    
    // Check if userId is valid
    if (!userId || userId === 'undefined') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID provided'
      });
    }
    
    try {
      // Check if user exists
      const existingUser = await User.findById(userId);
      
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Delete user
      await User.findByIdAndDelete(userId);
      
      return res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (err) {
      console.error('Database error deleting user:', err);
      return res.status(500).json({
        success: false,
        message: 'Error deleting user'
      });
    }
  } catch (err) {
    console.error('Server error in admin/users/:id route:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error deleting user'
    });
  }
});

// Export router in an object format
module.exports = {
  router: router
}; 