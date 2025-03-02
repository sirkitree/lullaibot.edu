import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

class RelevanceScoringService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
    });
    this.model = process.env.LLM_MODEL || 'gpt-3.5-turbo';
  }

  /**
   * Calculate relevance scores for resources based on a query
   * @param {string} query - User's search query
   * @param {Array} resources - List of resources to score
   * @returns {Promise<Array>} Resources with relevance scores
   */
  async scoreResources(query, resources) {
    if (!query.trim() || resources.length === 0) {
      return resources;
    }

    // For efficiency, process in batches of maximum 10 resources
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < resources.length; i += batchSize) {
      batches.push(resources.slice(i, i + batchSize));
    }

    const scoredBatches = await Promise.all(
      batches.map(batch => this.scoreBatch(query, batch))
    );

    // Flatten the batches back into a single array
    return scoredBatches.flat();
  }

  /**
   * Score a batch of resources
   * @param {string} query - User's search query
   * @param {Array} batch - Batch of resources to score
   * @returns {Promise<Array>} Resources with relevance scores
   */
  async scoreBatch(query, batch) {
    try {
      const prompt = this.getRelevancePrompt(query, batch);
      
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
        top_p: 0.8,
      });

      const responseText = completion.choices[0].message.content;
      const scoredResources = this.parseResponse(responseText, batch);
      
      return scoredResources;
    } catch (error) {
      console.error('Error scoring resources:', error);
      // If scoring fails, return the resources with default score of 0
      return batch.map(resource => ({ ...resource, relevanceScore: 0 }));
    }
  }

  /**
   * Parse the OpenAI response into scored resources
   * @param {string} responseText - Raw response from OpenAI
   * @param {Array} originalResources - Original resources batch
   * @returns {Array} Resources with relevance scores
   */
  parseResponse(responseText, originalResources) {
    try {
      // Extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in the response');
      }
      
      const jsonStr = jsonMatch[0];
      const result = JSON.parse(jsonStr);
      
      if (!result.scores || !Array.isArray(result.scores)) {
        throw new Error('Invalid scores format in the response');
      }
      
      // Map scores back to original resources
      return originalResources.map((resource, index) => {
        const score = result.scores[index] || 0;
        return {
          ...resource,
          relevanceScore: score
        };
      });
    } catch (error) {
      console.error('Error parsing relevance scores:', error);
      // Return original resources with default score of 0
      return originalResources.map(resource => ({ ...resource, relevanceScore: 0 }));
    }
  }

  /**
   * Get the prompt for calculating relevance scores
   * @param {string} query - User's search query
   * @param {Array} resources - Resources to score
   * @returns {string} Prompt text
   */
  getRelevancePrompt(query, resources) {
    const resourcesJSON = resources.map((resource, index) => ({
      id: index,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      tags: resource.tags || []
    }));
    
    return `
You are an AI assistant for a resource library focused on artificial intelligence and machine learning education.

Given a user's search query and a list of resources, assign a relevance score between 0 and 1 to each resource.
The score should indicate how well the resource matches the user's query, where 1 is a perfect match and 0 is completely irrelevant.

User Query: "${query}"

Resources:
${JSON.stringify(resourcesJSON, null, 2)}

Consider the following factors when scoring:
1. How well the resource title matches the query
2. How well the resource description matches the query
3. Whether the resource category is relevant to the query
4. Whether any tags match or are similar to the query
5. The overall usefulness of the resource for someone interested in the query topic

Respond ONLY with a JSON object containing an array of scores in the same order as the provided resources:
{
  "scores": [0.95, 0.72, 0.45, ...]
}
`;
  }

  /**
   * Calculate a simple relevance score without using LLM (for fallback)
   * @param {string} query - User's search query
   * @param {Array} resources - Resources to score
   * @returns {Array} Resources with relevance scores
   */
  calculateSimpleScores(query, resources) {
    if (!query.trim()) {
      return resources.map(resource => ({ ...resource, relevanceScore: 0 }));
    }
    
    const queryWords = query.toLowerCase().split(/\s+/);
    
    return resources.map(resource => {
      const titleWords = resource.title.toLowerCase().split(/\s+/);
      const descriptionWords = resource.description.toLowerCase().split(/\s+/);
      const tagWords = (resource.tags || []).join(' ').toLowerCase().split(/\s+/);
      
      // Count matches in title (weighted higher)
      const titleMatches = queryWords.filter(word => 
        titleWords.some(titleWord => titleWord.includes(word))
      ).length;
      
      // Count matches in description
      const descriptionMatches = queryWords.filter(word => 
        descriptionWords.some(descWord => descWord.includes(word))
      ).length;
      
      // Count matches in tags
      const tagMatches = queryWords.filter(word => 
        tagWords.some(tag => tag.includes(word))
      ).length;
      
      // Calculate score (title matches have 3x weight, tags have 2x weight)
      const maxPossibleScore = queryWords.length * (3 + 1 + 2);
      const score = (titleMatches * 3 + descriptionMatches + tagMatches * 2) / maxPossibleScore;
      
      return { 
        ...resource, 
        relevanceScore: Math.min(Math.max(score, 0), 1) // Ensure score is between 0 and 1
      };
    });
  }
}

export default new RelevanceScoringService(); 