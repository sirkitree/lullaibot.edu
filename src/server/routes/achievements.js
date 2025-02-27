const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for development (will be replaced with database)
let achievements = [
  {
    id: '1',
    name: 'First Contribution',
    description: 'Added your first resource to the library',
    icon: 'trophy',
    points: 10,
    requirements: {
      type: 'contributions',
      count: 1
    }
  },
  {
    id: '2',
    name: '5-Day Streak',
    description: 'Contributed for 5 days in a row',
    icon: 'fire',
    points: 25,
    requirements: {
      type: 'streak',
      count: 5
    }
  },
  {
    id: '3',
    name: 'Resource Champion',
    description: 'Have one of your resources reach 50 upvotes',
    icon: 'star',
    points: 50,
    requirements: {
      type: 'upvotes',
      count: 50
    }
  },
  {
    id: '4',
    name: 'Categorization Expert',
    description: 'Suggest 10 categories that get approved',
    icon: 'folder',
    points: 30,
    requirements: {
      type: 'categories',
      count: 10
    }
  },
  {
    id: '5',
    name: 'Helpful Contributor',
    description: 'Share 20 valuable resources',
    icon: 'share',
    points: 40,
    requirements: {
      type: 'contributions',
      count: 20
    }
  }
];

// Mock user achievements (in a real app, this would be in its own collection)
let userAchievements = [
  {
    userId: '1', // John Doe
    achievementId: '1',
    dateEarned: '2023-10-05'
  },
  {
    userId: '1', // John Doe
    achievementId: '2',
    dateEarned: '2023-10-10'
  },
  {
    userId: '2', // Alice Johnson
    achievementId: '1',
    dateEarned: '2023-08-20'
  },
  {
    userId: '2', // Alice Johnson
    achievementId: '2',
    dateEarned: '2023-08-25'
  },
  {
    userId: '2', // Alice Johnson
    achievementId: '3',
    dateEarned: '2023-09-10'
  },
  {
    userId: '2', // Alice Johnson
    achievementId: '5',
    dateEarned: '2023-10-01'
  }
];

/**
 * @route GET /api/achievements
 * @description Get all available achievements
 * @access Public
 */
router.get('/', (req, res) => {
  return res.json({
    status: 'success',
    count: achievements.length,
    data: achievements
  });
});

/**
 * @route GET /api/achievements/:id
 * @description Get a single achievement by ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  const achievement = achievements.find(a => a.id === req.params.id);
  
  if (!achievement) {
    return res.status(404).json({
      status: 'error',
      message: 'Achievement not found'
    });
  }
  
  return res.json({
    status: 'success',
    data: achievement
  });
});

/**
 * @route GET /api/achievements/user/:userId
 * @description Get achievements for a specific user
 * @access Public
 */
router.get('/user/:userId', (req, res) => {
  // Get all achievement IDs earned by this user
  const userAchievementIds = userAchievements
    .filter(ua => ua.userId === req.params.userId)
    .map(ua => ua.achievementId);
  
  // Get achievement details for each earned achievement
  const earnedAchievements = userAchievementIds.map(achievementId => {
    const achievement = achievements.find(a => a.id === achievementId);
    const userAchievement = userAchievements.find(
      ua => ua.userId === req.params.userId && ua.achievementId === achievementId
    );
    
    return {
      ...achievement,
      dateEarned: userAchievement.dateEarned
    };
  });
  
  // Get achievement details for each unearned achievement
  const unearnedAchievements = achievements
    .filter(a => !userAchievementIds.includes(a.id))
    .map(a => ({
      ...a,
      locked: true
    }));
  
  return res.json({
    status: 'success',
    earned: {
      count: earnedAchievements.length,
      data: earnedAchievements
    },
    unearned: {
      count: unearnedAchievements.length,
      data: unearnedAchievements
    },
    total: achievements.length
  });
});

/**
 * @route POST /api/achievements/award
 * @description Award an achievement to a user (admin/system only)
 * @access Private/Admin
 */
router.post('/award', (req, res) => {
  const { userId, achievementId } = req.body;
  
  if (!userId || !achievementId) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide userId and achievementId'
    });
  }
  
  // Check if achievement exists
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) {
    return res.status(404).json({
      status: 'error',
      message: 'Achievement not found'
    });
  }
  
  // Check if user already has this achievement
  const existingAward = userAchievements.find(
    ua => ua.userId === userId && ua.achievementId === achievementId
  );
  
  if (existingAward) {
    return res.status(400).json({
      status: 'error',
      message: 'User already has this achievement',
      data: existingAward
    });
  }
  
  // Award the achievement
  const newAward = {
    userId,
    achievementId,
    dateEarned: new Date().toISOString().split('T')[0]
  };
  
  userAchievements.push(newAward);
  
  return res.status(201).json({
    status: 'success',
    message: `Awarded '${achievement.name}' achievement to user`,
    data: {
      ...newAward,
      achievement
    }
  });
});

/**
 * @route GET /api/achievements/check/:userId
 * @description Check for new achievements earned by a user (system endpoint)
 * @access Private/System
 */
router.get('/check/:userId', (req, res) => {
  // This endpoint would typically be called by a background process
  // after user activities that could trigger achievements
  
  // Mock response - in a real implementation, this would check
  // user stats against achievement requirements
  const mockNewAchievements = [];
  
  return res.json({
    status: 'success',
    message: 'Achievement check completed',
    newAchievements: mockNewAchievements,
    earnedCount: userAchievements.filter(ua => ua.userId === req.params.userId).length
  });
});

/**
 * @route POST /api/achievements
 * @description Create a new achievement (admin only)
 * @access Admin
 */
router.post('/', (req, res) => {
  const { name, description, icon, points, requirements } = req.body;
  
  // Basic validation
  if (!name || !description || !points || !requirements) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide name, description, points and requirements'
    });
  }
  
  const newAchievement = {
    id: uuidv4(),
    name,
    description,
    icon: icon || 'trophy',
    points,
    requirements
  };
  
  achievements.push(newAchievement);
  
  return res.status(201).json({
    status: 'success',
    message: 'Achievement created successfully',
    data: newAchievement
  });
});

module.exports = { 
  router, 
  achievements,
  userAchievements
}; 