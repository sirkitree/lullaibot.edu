import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
    });
    this.model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Generate categories, tags, and summary for a resource
   * @param {Object} resource - Resource details
   * @param {string} resource.title - Title of the resource
   * @param {string} resource.description - Description of the resource
   * @param {string} resource.url - URL of the resource
   * @param {string} [resource.content] - Extracted content from the URL (optional)
   * @returns {Promise<Object>} Categories, tags, and summary
   */
  async categorizeResource(resource) {
    const { title, description, url, content } = resource;
    
    let prompt;
    if (content) {
      // Use enhanced prompt with content
      prompt = this.getEnhancedPrompt(title, description, url, content);
    } else {
      // Use basic prompt
      prompt = this.getBasicPrompt(title, description, url);
    }

    try {
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.8,
      });

      const responseText = completion.choices[0].message.content;
      return this.parseResponse(responseText);
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`Failed to categorize resource: ${error.message}`);
    }
  }

  /**
   * Parse the OpenAI response into a structured format
   * @param {string} responseText - Raw response from OpenAI
   * @returns {Object} Parsed response with categories, tags, and summary
   */
  parseResponse(responseText) {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the response');
      }
      
      const jsonStr = jsonMatch[0];
      const result = JSON.parse(jsonStr);
      
      return {
        categories: result.categories || [],
        tags: result.tags || [],
        summary: result.summary || ''
      };
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      throw new Error(`Failed to parse OpenAI response: ${error.message}`);
    }
  }

  /**
   * Get the basic prompt for categorization without content
   * @param {string} title - Resource title
   * @param {string} description - Resource description
   * @param {string} url - Resource URL
   * @returns {string} Prompt text
   */
  getBasicPrompt(title, description, url) {
    return `
You are an AI assistant for a resource library focused on artificial intelligence and machine learning education.

Given the following resource information, suggest the most appropriate categories from the list below. Provide a confidence score between 0 and 1 for each suggested category.

Resource Title: ${title}
Resource Description: ${description}
Resource URL: ${url}

Available Categories:
- Beginner Resources
- Intermediate Resources 
- Expert Resources
- General AI Concepts
- Getting Started Guides
- Developer Resources
- Project Management Resources
- Content Creation Resources
- Advanced Technical Resources
- Security and Best Practices

Also suggest up to 5 relevant tags for this resource.

Respond in JSON format:
{
  "categories": [
    {
      "category": "Category Name",
      "confidence": 0.95
    },
    ...
  ],
  "tags": ["tag1", "tag2", "tag3", ...],
  "summary": "Brief summary of the resource"
}
`;
  }

  /**
   * Get the enhanced prompt for categorization with content
   * @param {string} title - Resource title
   * @param {string} description - Resource description
   * @param {string} url - Resource URL
   * @param {string} content - Extracted content
   * @returns {string} Prompt text
   */
  getEnhancedPrompt(title, description, url, content) {
    return `
You are an AI assistant for a resource library focused on artificial intelligence and machine learning education.

I will provide you with a resource title, description, URL, and extracted content. Your task is to:
1. Identify the most appropriate categories for this resource
2. Suggest relevant tags
3. Provide a brief (50 words max) summary of the resource

Resource Title: ${title}
Resource Description: ${description}
Resource URL: ${url}
Extracted Content: ${content.substring(0, 3000)} ${content.length > 3000 ? '...(content truncated)' : ''}

Available Categories:
- Beginner Resources
- Intermediate Resources 
- Expert Resources
- General AI Concepts
- Getting Started Guides
- Developer Resources
- Project Management Resources
- Content Creation Resources
- Advanced Technical Resources
- Security and Best Practices

Respond in JSON format:
{
  "categories": [
    {
      "category": "Category Name",
      "confidence": 0.95
    },
    ...
  ],
  "tags": ["tag1", "tag2", "tag3", ...],
  "summary": "Brief summary of the resource"
}
`;
  }
}

export default new OpenAIService(); 