const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { protect, authorize } = require('../middleware/auth');
// Import the User model for updating points and contributions
const User = require('../models/User');

// In-memory storage for development (will be replaced with database)
let resources = [
  {
    id: '1',
    title: 'Introduction to AI Concepts',
    description: 'A comprehensive guide to understanding fundamental AI concepts and terminology.',
    url: 'https://example.com/ai-intro',
    category: 'General AI Concepts',
    tags: ['ai', 'beginner', 'guide'],
    addedBy: 'john.doe@example.com',
    date: '2023-10-05',
    upvotes: 15
  },
  {
    id: '2',
    title: 'Prompt Engineering Best Practices',
    description: 'Learn how to craft effective prompts for LLMs to get better results.',
    url: 'https://example.com/prompt-engineering',
    category: 'Getting Started Guides',
    tags: ['prompt-engineering', 'llm', 'best-practices'],
    addedBy: 'jane.smith@example.com',
    date: '2023-10-10',
    upvotes: 8
  }
];

/**
 * @route GET /api/resources
 * @description Get all resources, with optional filtering
 * @access Public
 */
router.get('/', (req, res) => {
  const { category, tag, search, sort, direction = 'desc' } = req.query;
  
  let filteredResources = [...resources];
  
  // Apply filters
  if (category) {
    filteredResources = filteredResources.filter(r => 
      r.category.toLowerCase() === category.toLowerCase());
  }
  
  if (tag) {
    filteredResources = filteredResources.filter(r => 
      r.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredResources = filteredResources.filter(r => 
      r.title.toLowerCase().includes(searchLower) || 
      r.description.toLowerCase().includes(searchLower) ||
      r.tags.some(t => t.toLowerCase().includes(searchLower)));
  }
  
  // Apply sorting
  if (sort) {
    filteredResources.sort((a, b) => {
      const sortOrder = direction === 'asc' ? 1 : -1;
      if (sort === 'date') {
        return sortOrder * (new Date(a.date) - new Date(b.date));
      } else if (sort === 'upvotes') {
        return sortOrder * (a.upvotes - b.upvotes);
      } else if (sort === 'title') {
        return sortOrder * a.title.localeCompare(b.title);
      }
      return 0;
    });
  }
  
  return res.json({
    status: 'success',
    count: filteredResources.length,
    data: filteredResources
  });
});

/**
 * @route GET /api/resources/:id
 * @description Get a single resource by ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  const resource = resources.find(r => r.id === req.params.id);
  
  if (!resource) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }
  
  return res.json({
    status: 'success',
    data: resource
  });
});

/**
 * @route POST /api/resources
 * @description Create a new resource
 * @access Private
 */
router.post('/', protect, async (req, res) => {
  const { title, description, url, category, tags } = req.body;
  
  // Validate required fields
  if (!title || !url) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide title and URL'
    });
  }
  
  // Check if URL already exists
  const existingResource = resources.find(r => r.url === url);
  if (existingResource) {
    return res.status(400).json({
      status: 'error',
      message: 'Resource with this URL already exists'
    });
  }
  
  // Make sure to use the MongoDB _id as string for addedBy to match the format in the leaderboard
  const userId = req.user._id.toString();
  
  const newResource = {
    id: uuidv4(),
    title,
    description: description || '',
    url,
    category: category || 'Uncategorized',
    tags: tags || [],
    addedBy: userId, // Store as string to ensure consistent format
    date: new Date().toISOString().split('T')[0],
    upvotes: 0
  };
  
  resources.push(newResource);
  
  try {
    // Update MongoDB user stats - using the user object from req.user which already has the right ID
    const user = req.user;
    
    // Update points and contributions
    user.points += 5; // Award 5 points for adding a resource
    user.contributions += 1;
    
    await user.save();
    
    console.log(`Updated MongoDB user ${user.name}: points=${user.points}, contributions=${user.contributions}`);
    
    return res.status(201).json({
      status: 'success',
      data: newResource
    });
  } catch (error) {
    console.error('Error updating user stats:', error);
    
    // Still return success for the resource creation, even if user update fails
    return res.status(201).json({
      status: 'success',
      data: newResource,
      warning: 'Resource created but there was an issue updating user stats'
    });
  }
});

/**
 * @route PUT /api/resources/:id
 * @description Update a resource
 * @access Private
 */
router.put('/:id', protect, (req, res) => {
  const { title, description, url, category, tags } = req.body;
  
  const resourceIndex = resources.findIndex(r => r.id === req.params.id);
  
  if (resourceIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }
  
  // Check if user is the one who added the resource or is an admin
  if (resources[resourceIndex].addedBy !== req.user.email && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to update this resource'
    });
  }
  
  const updatedResource = {
    ...resources[resourceIndex],
    title: title || resources[resourceIndex].title,
    description: description !== undefined ? description : resources[resourceIndex].description,
    url: url || resources[resourceIndex].url,
    category: category || resources[resourceIndex].category,
    tags: tags || resources[resourceIndex].tags
  };
  
  resources[resourceIndex] = updatedResource;
  
  return res.json({
    status: 'success',
    data: updatedResource
  });
});

/**
 * @route DELETE /api/resources/:id
 * @description Delete a resource
 * @access Private
 */
router.delete('/:id', protect, (req, res) => {
  const resourceIndex = resources.findIndex(r => r.id === req.params.id);
  
  if (resourceIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }
  
  // Check if user is the one who added the resource or is an admin
  if (resources[resourceIndex].addedBy !== req.user.email && req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Not authorized to delete this resource'
    });
  }
  
  resources.splice(resourceIndex, 1);
  
  return res.json({
    status: 'success',
    data: {}
  });
});

/**
 * @route POST /api/resources/:id/upvote
 * @description Upvote a resource
 * @access Private
 */
router.post('/:id/upvote', protect, async (req, res) => {
  const resourceIndex = resources.findIndex(r => r.id === req.params.id);
  
  if (resourceIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }
  
  // Find the user who added this resource - convert to string format to match
  const addedByUserId = resources[resourceIndex].addedBy;
  const currentUserId = req.user._id.toString();
  
  // Increment the upvotes for the resource
  resources[resourceIndex].upvotes += 1;
  
  try {
    // Award a point to the user who added the resource (if it's not the same user upvoting)
    if (addedByUserId !== currentUserId) {
      // Find the user by their ID - this assumes addedByUserId is a valid MongoDB ObjectId as string
      const resourceOwner = await User.findById(addedByUserId);
      if (resourceOwner) {
        resourceOwner.points += 1; // Award 1 point for getting an upvote
        await resourceOwner.save();
        console.log(`Updated MongoDB user ${resourceOwner.name}: awarded 1 point for upvote`);
      }
    }
    
    return res.json({
      status: 'success',
      data: resources[resourceIndex]
    });
  } catch (error) {
    console.error('Error updating user points for upvote:', error);
    // Still return success for the upvote, even if user update fails
    return res.json({
      status: 'success',
      data: resources[resourceIndex],
      warning: 'Upvote recorded but there was an issue updating user points'
    });
  }
});

module.exports = router; 