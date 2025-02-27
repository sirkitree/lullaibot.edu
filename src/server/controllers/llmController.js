import openaiService from '../services/llm/openaiService.js';
import contentExtractor from '../services/llm/contentExtractor.js';

/**
 * Analyze a URL and suggest categories, tags, and summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const analyzeUrl = async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Analyzing URL: ${url}`);
    
    // Extract content from the URL
    let extractedContent;
    let title = '';
    
    try {
      const extractionResult = await contentExtractor.extract(url);
      
      if (typeof extractionResult === 'object' && extractionResult.content) {
        extractedContent = extractionResult.content;
        title = extractionResult.title || '';
      } else {
        extractedContent = extractionResult;
      }
      
      console.log(`Content extracted successfully from ${url}, got title: "${title}"`);
    } catch (error) {
      console.error(`Error extracting content: ${error.message}`);
      extractedContent = '';
    }

    // Get suggested categories from OpenAI
    const openaiResponse = await openaiService.categorizeResource({
      url,
      title,
      content: extractedContent
    });
    
    console.log('OpenAI Response Structure:', JSON.stringify(openaiResponse, null, 2));
    
    // Structure the response exactly as the frontend expects it
    const responseData = {
      status: 'success',
      message: 'URL analyzed successfully',
      data: {
        categories: openaiResponse.categories || [],
        tags: openaiResponse.tags || [],
        summary: openaiResponse.summary || '',
        title: title
      }
    };
    
    console.log('Final Response Structure:', JSON.stringify(responseData, null, 2));
    return res.json(responseData);
  } catch (error) {
    console.error(`Error in analyzeUrl: ${error.message}`);
    return res.status(500).json({ error: 'Failed to analyze URL' });
  }
};

/**
 * Suggest categories based on a partial resource (without URL)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const suggestCategories = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    if (!title && !description) {
      return res.status(400).json({
        status: 'error',
        message: 'Title or description is required'
      });
    }
    
    // Check feature flags
    const enableLLM = process.env.ENABLE_LLM_CATEGORIZATION === 'true';
    if (!enableLLM) {
      return res.status(200).json({
        status: 'warning',
        message: 'LLM categorization is disabled',
        data: {
          categories: [
            { category: 'Beginner Resources', confidence: 0.87, selected: true },
            { category: 'Getting Started Guides', confidence: 0.76, selected: true }
          ]
        }
      });
    }

    // Categorize based on title and description
    const result = await openaiService.categorizeResource({
      title: title || '',
      description: description || '',
      url: '',
      tags: tags || []
    });

    // Return only categories from the result
    return res.status(200).json({
      status: 'success',
      message: 'Categories suggested successfully',
      data: {
        categories: result.categories
      }
    });
  } catch (error) {
    console.error('Category suggestion error:', error);
    return res.status(500).json({
      status: 'error',
      message: `Error suggesting categories: ${error.message}`
    });
  }
}; 