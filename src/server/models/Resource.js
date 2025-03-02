const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourceSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  url: {
    type: String,
    required: [true, 'Resource URL is required'],
    trim: true,
    unique: true
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  upvotedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  metaData: {
    favicon: String,
    siteName: String,
    image: String,
    author: String
  },
  aiGeneratedTags: [{
    type: String,
    trim: true
  }],
  aiSummary: {
    type: String,
    trim: true
  },
  relevanceScore: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  ratings: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for full-text search
ResourceSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  aiGeneratedTags: 'text'
});

// Add URL domain extraction method
ResourceSchema.methods.getDomain = function() {
  try {
    const url = new URL(this.url);
    return url.hostname;
  } catch (error) {
    return null;
  }
};

// Pre-save hook to update timestamps
ResourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find similar resources
ResourceSchema.statics.findSimilar = async function(resourceId) {
  const resource = await this.findById(resourceId);
  
  if (!resource) {
    return [];
  }
  
  // Find resources with same category or tags
  return this.find({
    _id: { $ne: resourceId },
    $or: [
      { category: resource.category },
      { tags: { $in: resource.tags } }
    ]
  })
  .limit(5)
  .sort({ upvotes: -1 });
};

// Virtual for formatted date
ResourceSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toISOString().split('T')[0];
});

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource; 