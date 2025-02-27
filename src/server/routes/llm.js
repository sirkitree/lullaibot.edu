const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const llmController = require('../controllers/llmController');

/**
 * @route POST /api/llm/analyze-url
 * @description Analyze a URL and suggest categories, tags, and summary
 * @access Protected
 */
router.post('/analyze-url', protect, llmController.analyzeUrl);

/**
 * @route POST /api/llm/suggest-categories
 * @description Suggest categories based on a title and description
 * @access Protected
 */
router.post('/suggest-categories', protect, llmController.suggestCategories);

module.exports = router; 