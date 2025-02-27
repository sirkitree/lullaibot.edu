const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    trim: true,
    unique: true,
    maxlength: [100, 'Achievement name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true,
    maxlength: [500, 'Achievement description cannot be more than 500 characters']
  },
  icon: {
    type: String,
    default: 'default-achievement.svg'
  },
  pointsAwarded: {
    type: Number,
    required: [true, 'Points awarded is required'],
    min: [0, 'Points awarded cannot be negative']
  },
  category: {
    type: String,
    enum: ['contribution', 'engagement', 'learning', 'special'],
    default: 'contribution'
  },
  criteria: {
    type: {
      type: String,
      enum: ['resources_added', 'upvotes_received', 'login_streak', 'categories_used', 'custom'],
      required: [true, 'Criteria type is required']
    },
    threshold: {
      type: Number,
      required: [true, 'Criteria threshold is required'],
      min: [1, 'Criteria threshold must be at least 1']
    },
    timeframe: {
      type: String,
      enum: ['all_time', 'daily', 'weekly', 'monthly'],
      default: 'all_time'
    }
  },
  tier: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if a user has earned this achievement
AchievementSchema.methods.checkEarned = async function(userId) {
  const User = mongoose.model('User');
  const user = await User.findById(userId);
  
  if (!user) {
    return false;
  }
  
  // Logic to check if user has earned the achievement based on criteria
  switch (this.criteria.type) {
    case 'resources_added':
      return user.contributions >= this.criteria.threshold;
      
    case 'upvotes_received':
      // Implementation requires query to Resource model
      return false;
      
    case 'login_streak':
      return user.streak >= this.criteria.threshold;
      
    case 'categories_used':
      // Implementation requires query to Resource model
      return false;
      
    case 'custom':
      // Requires custom implementation
      return false;
      
    default:
      return false;
  }
};

// Create indexes
AchievementSchema.index({ name: 1 });
AchievementSchema.index({ category: 1 });
AchievementSchema.index({ 'criteria.type': 1 });

const Achievement = mongoose.model('Achievement', AchievementSchema);

module.exports = Achievement; 