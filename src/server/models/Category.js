const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    unique: true,
    maxlength: [50, 'Category name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  level: {
    type: Number,
    default: 1
  },
  icon: {
    type: String,
    default: 'folder'
  },
  color: {
    type: String,
    default: '#4A6BF5'  // Default primary color
  },
  slug: {
    type: String,
    trim: true,
    unique: true
  },
  resourceCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for text search
CategorySchema.index({
  name: 'text',
  description: 'text'
});

// Create slug from name
CategorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  this.updatedAt = Date.now();
  next();
});

// Virtual for children categories
CategorySchema.virtual('children', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Virtual for resources in this category
CategorySchema.virtual('resources', {
  ref: 'Resource',
  localField: '_id',
  foreignField: 'category'
});

// Static method to get full category tree
CategorySchema.statics.getTree = async function() {
  // Get all root categories (those with no parent)
  const rootCategories = await this.find({ parent: null })
    .sort('name')
    .populate({
      path: 'children',
      options: { sort: { name: 1 } }
    });
  
  return rootCategories;
};

// Method to get full path (breadcrumb)
CategorySchema.methods.getPath = async function() {
  const path = [this];
  
  let currentCategory = this;
  while (currentCategory.parent) {
    currentCategory = await mongoose.model('Category').findById(currentCategory.parent);
    if (currentCategory) {
      path.unshift(currentCategory);
    } else {
      break;
    }
  }
  
  return path;
};

// Static method to update resource counts
CategorySchema.statics.updateResourceCount = async function(categoryId) {
  const resourceCount = await mongoose.model('Resource').countDocuments({ 
    category: categoryId,
    status: 'approved'
  });
  
  await this.findByIdAndUpdate(categoryId, { resourceCount });
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category; 