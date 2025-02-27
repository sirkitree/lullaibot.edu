const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// In-memory storage for development (will be replaced with database)
let categories = [
  {
    id: '1',
    name: 'Beginner Resources',
    description: 'Introductory materials for those new to AI concepts',
    count: 15,
    parentId: null
  },
  {
    id: '2',
    name: 'Intermediate Resources',
    description: 'Content for those with basic knowledge looking to expand skills',
    count: 23,
    parentId: null
  },
  {
    id: '3',
    name: 'Expert Resources',
    description: 'Advanced materials for experienced AI practitioners',
    count: 18,
    parentId: null
  },
  {
    id: '4',
    name: 'Developer Resources',
    description: 'Tools, libraries, and documentation for AI development',
    count: 31,
    parentId: null
  },
  {
    id: '5',
    name: 'Getting Started Guides',
    description: 'Step-by-step guides for beginners',
    count: 8,
    parentId: '1'
  }
];

/**
 * @route GET /api/categories
 * @description Get all categories, with optional nesting structure
 * @access Public
 */
router.get('/', (req, res) => {
  const { flat } = req.query;
  
  if (flat === 'true') {
    // Return flat structure
    return res.json({
      status: 'success',
      count: categories.length,
      data: categories
    });
  } else {
    // Return nested structure
    const rootCategories = categories.filter(c => c.parentId === null);
    
    // Add children to each root category
    const nestedCategories = rootCategories.map(root => {
      const children = categories.filter(c => c.parentId === root.id);
      return {
        ...root,
        children
      };
    });
    
    return res.json({
      status: 'success',
      count: rootCategories.length,
      data: nestedCategories
    });
  }
});

/**
 * @route GET /api/categories/:id
 * @description Get a single category by ID
 * @access Public
 */
router.get('/:id', (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  
  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }
  
  // Get children if any
  const children = categories.filter(c => c.parentId === category.id);
  
  return res.json({
    status: 'success',
    data: {
      ...category,
      children
    }
  });
});

/**
 * @route POST /api/categories
 * @description Create a new category
 * @access Admin
 */
router.post('/', (req, res) => {
  const { name, description, parentId } = req.body;
  
  // Basic validation
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide a category name'
    });
  }
  
  // Check if category already exists
  const existingCategory = categories.find(c => 
    c.name.toLowerCase() === name.toLowerCase()
  );
  
  if (existingCategory) {
    return res.status(400).json({
      status: 'error',
      message: 'A category with this name already exists',
      existingCategory
    });
  }
  
  // Validate parent if provided
  if (parentId) {
    const parentExists = categories.some(c => c.id === parentId);
    if (!parentExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Parent category not found'
      });
    }
  }
  
  const newCategory = {
    id: uuidv4(),
    name,
    description: description || '',
    count: 0,
    parentId: parentId || null
  };
  
  // Add to collection
  categories.push(newCategory);
  
  return res.status(201).json({
    status: 'success',
    message: 'Category created successfully',
    data: newCategory
  });
});

/**
 * @route PUT /api/categories/:id
 * @description Update a category
 * @access Admin
 */
router.put('/:id', (req, res) => {
  const { name, description, parentId } = req.body;
  
  const categoryIndex = categories.findIndex(c => c.id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }
  
  // Prevent circular references
  if (parentId && parentId === req.params.id) {
    return res.status(400).json({
      status: 'error',
      message: 'A category cannot be its own parent'
    });
  }
  
  // If changing name, check for duplicates
  if (name && name !== categories[categoryIndex].name) {
    const duplicateName = categories.some(c => 
      c.id !== req.params.id && c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (duplicateName) {
      return res.status(400).json({
        status: 'error',
        message: 'A category with this name already exists'
      });
    }
  }
  
  // Update fields
  const updatedCategory = {
    ...categories[categoryIndex],
    ...(name && { name }),
    ...(description !== undefined && { description }),
    ...(parentId !== undefined && { parentId: parentId || null })
  };
  
  // Replace in array
  categories[categoryIndex] = updatedCategory;
  
  return res.json({
    status: 'success',
    message: 'Category updated successfully',
    data: updatedCategory
  });
});

/**
 * @route DELETE /api/categories/:id
 * @description Delete a category
 * @access Admin
 */
router.delete('/:id', (req, res) => {
  const categoryIndex = categories.findIndex(c => c.id === req.params.id);
  
  if (categoryIndex === -1) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }
  
  // Check if category has children
  const hasChildren = categories.some(c => c.parentId === req.params.id);
  
  if (hasChildren) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete a category with subcategories. Please delete or reassign subcategories first.'
    });
  }
  
  // Check if category has resources (not actually implemented yet, but API check included)
  if (categories[categoryIndex].count > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Cannot delete a category with resources. Please reassign resources first.'
    });
  }
  
  // Remove from array
  const deletedCategory = categories[categoryIndex];
  categories = categories.filter(c => c.id !== req.params.id);
  
  return res.json({
    status: 'success',
    message: 'Category deleted successfully',
    data: deletedCategory
  });
});

/**
 * @route GET /api/categories/:id/resources
 * @description Get resources belonging to a category
 * @access Public
 * @note This is a stub that would call Resources service in a real implementation
 */
router.get('/:id/resources', (req, res) => {
  const category = categories.find(c => c.id === req.params.id);
  
  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found'
    });
  }
  
  // Note: This would call the resources service in a real implementation
  // For now, we return mock data
  return res.json({
    status: 'success',
    message: `This would return resources for category: ${category.name}`,
    data: []
  });
});

/**
 * @route POST /api/categories/suggest
 * @description Suggest category based on resource data using AI
 * @access Public
 */
router.post('/suggest', (req, res) => {
  const { title, description, url } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide title and description for category suggestion'
    });
  }
  
  // This is a mock LLM response - in real implementation, this would call the LLM service
  const suggestedCategories = [
    {
      id: '1',
      name: 'Beginner Resources',
      confidence: 0.92
    },
    {
      id: '5',
      name: 'Getting Started Guides',
      confidence: 0.76
    },
    {
      id: '4',
      name: 'Developer Resources',
      confidence: 0.45
    }
  ];
  
  return res.json({
    status: 'success',
    message: 'Category suggestions generated',
    data: suggestedCategories
  });
});

module.exports = router; 