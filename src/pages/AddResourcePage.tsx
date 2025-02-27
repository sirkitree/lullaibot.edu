import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface FormData {
  url: string;
  title: string;
  description: string;
  tags: string;
}

interface Category {
  category: string;
  confidence: number;
  selected: boolean;
}

// Using direct URL as Vite environment variables may not be properly typed
// const API_URL = 'http://localhost:3002/api';

const AddResourcePage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    url: '',
    title: '',
    description: '',
    tags: ''
  });
  
  const [suggestedCategories, setSuggestedCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    if (!user) {
      // Redirect to login page with return URL
      navigate('/login', { state: { from: '/add-resource' } });
    }
  }, [user, navigate]);
  
  // If user is not authenticated, don't render the page content
  if (!user) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const analyzeUrl = async () => {
    if (!formData.url) return;
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Call the real LLM API endpoint
      const response = await api.post('/llm/analyze-url', { 
        url: formData.url,
        title: formData.title,
        description: formData.description
      });
      
      const data = response.data;
      
      if (data.status === 'warning') {
        console.warn('LLM categorization is disabled, using mock data');
      }
      
      // Transform the categories to include selected status
      const categories = data.data.categories.map((cat: any) => ({
        ...cat,
        selected: cat.confidence >= 0.5 // Select categories with confidence >= 0.5
      }));
      
      // Update form data with title and description if not already provided
      setFormData(prev => ({
        ...prev,
        title: prev.title || data.data.title || '',
        description: prev.description || data.data.summary || '',
        tags: prev.tags || (data.data.tags ? data.data.tags.join(', ') : '')
      }));
      
      setSuggestedCategories(categories);
    } catch (error) {
      console.error('Error analyzing URL:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      
      // Use mock data as fallback in case of error
      const mockCategories = [
        { category: 'Beginner Resources', confidence: 0.87, selected: true },
        { category: 'Getting Started Guides', confidence: 0.76, selected: true },
        { category: 'Developer Resources', confidence: 0.45, selected: false },
        { category: 'Content Creation', confidence: 0.32, selected: false }
      ];
      
      setSuggestedCategories(mockCategories);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const toggleCategory = (index: number) => {
    setSuggestedCategories(prev => 
      prev.map((cat, i) => 
        i === index ? { ...cat, selected: !cat.selected } : cat
      )
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Get selected categories
      const selectedCategories = suggestedCategories
        .filter(cat => cat.selected)
        .map(cat => cat.category);
      
      // Convert tags from string to array
      const tagArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
      
      setSubmitting(true);
      
      // Call API to save the resource
      const response = await api.post('/resources', {
        url: formData.url,
        title: formData.title,
        description: formData.description,
        categories: selectedCategories,
        tags: tagArray
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 201 || response.status === 200) {
        // Reset form and show success message
        setFormData({ url: '', title: '', description: '', tags: '' });
        setSuggestedCategories([]);
        setSubmissionStatus('success');
        
        // Redirect after a delay
        setTimeout(() => {
          navigate('/resources');
        }, 2000);
      } else {
        throw new Error('Failed to create resource');
      }
    } catch (error) {
      console.error('Error adding resource:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };
  
  return (
    <div className="add-resource-page">
      <div className="card">
        <h2>Add New Resource</h2>
        <p className="mb-lg">
          Share valuable AI resources with the Lullabot community. 
          Our system will automatically analyze and categorize the link.
        </p>
        
        {error && (
          <div className="error-message mb-md">
            {error}
          </div>
        )}

        {submissionStatus === 'success' && (
          <div className="success-message mb-md">
            Resource added successfully! Redirecting...
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-md">
            <label htmlFor="url">URL*</label>
            <div className="url-input-group">
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/resource"
                required
              />
              <button 
                type="button" 
                className="button button-secondary"
                onClick={analyzeUrl}
                disabled={!formData.url || isAnalyzing}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>
          
          <div className="form-group mb-md">
            <label htmlFor="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Resource title"
              required
            />
          </div>
          
          <div className="form-group mb-md">
            <label htmlFor="description">Description*</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the resource"
              rows={4}
              required
            />
            <div className="character-count">
              {formData.description.length}/300 characters
            </div>
          </div>
          
          <div className="form-group mb-md">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="ai, prompt-engineering, beginners"
            />
          </div>
          
          {suggestedCategories.length > 0 && (
            <div className="suggested-categories mb-lg">
              <h3>Suggested Categories</h3>
              <p className="mb-sm">Our AI analyzed the content and suggested these categories:</p>
              
              <div className="categories-list">
                {suggestedCategories.map((cat, index) => (
                  <div key={index} className="category-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={cat.selected}
                        onChange={() => toggleCategory(index)}
                      />
                      <span className="category-name">{cat.category}</span>
                      <span className="confidence-badge" style={{ 
                        backgroundColor: cat.confidence > 0.7 ? 'var(--success)' : 
                                         cat.confidence > 0.4 ? 'var(--warning)' : 
                                         'var(--error)'
                      }}>
                        {Math.round(cat.confidence * 100)}%
                      </span>
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="new-category mt-md">
                <p>Don't see an appropriate category? Suggest a new one:</p>
                <input
                  type="text"
                  placeholder="New category name"
                  className="mt-sm"
                />
                <p className="helper-text">New categories require admin approval</p>
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="button button-primary" 
              disabled={isLoading || submitting}
            >
              {submitting ? 'Submitting...' : 'Add Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResourcePage; 