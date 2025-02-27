import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResourceList from '../components/ResourceList';
import { mockResources } from '../data/mockResources';
import { ResourceProps } from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';

// Using direct URL as Vite environment variables may not be properly typed
const API_URL = 'http://localhost:3002/api';

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<ResourceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse URL parameters to get the initial category
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || '';
  
  // Log the initial category from URL for debugging
  console.log('Initial category from URL:', initialCategory);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/resources`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }

        const data = await response.json();
        console.log('Fetched resources from API:', data);
        
        // For now, use only mock resources to ensure consistency with homepage counts
        console.log('Using mock resources instead of API data for consistency');
        setResources(mockResources);
        
        // Commenting out API mixing logic until we resolve category consistency
        /*
        if (data.status === 'success') {
          // Combine API resources with mock resources
          // Create a Set of existing IDs to avoid duplicates
          const existingIds = new Set(data.data.map((r: ResourceProps) => r.id));
          
          // Filter out mock resources that have the same ID as API resources
          const uniqueMockResources = mockResources.filter(mockResource => 
            !existingIds.has(mockResource.id)
          );
          
          // Combine the API resources with unique mock resources
          const combinedResources = [...data.data, ...uniqueMockResources];
          console.log('Combined resources count:', combinedResources.length);
          
          setResources(combinedResources);
        } else {
          // If the API returns an error, fall back to mock data
          console.warn('API returned an error, using mock data');
          setResources(mockResources);
        }
        */
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources from API. Using mock data instead.');
        setResources(mockResources);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [token]);

  // Filter resources based on search query
  const filteredResources = resources.filter(resource => {
    const query = searchQuery.toLowerCase();
    return (
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      resource.category.toLowerCase().includes(query) ||
      (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  // Handle add resource button click
  const handleAddResourceClick = () => {
    // Check if user is logged in by checking if user data exists
    if (!user) {
      // If not logged in, redirect to login page with a return URL
      navigate('/login', { state: { from: '/add-resource' } });
    } else {
      // If logged in, go directly to add resource page
      navigate('/add-resource');
    }
  };

  return (
    <div className="page resources-page">
      <div className="page-header">
        <h1>AI Learning Resources</h1>
        <p className="page-description">
          Discover and explore curated resources for learning about artificial intelligence and machine learning.
        </p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button className="button-primary">
          Search
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading resources...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="resources-container">
          <ResourceList 
            resources={filteredResources}
            title="All Resources"
            emptyMessage="No resources match your search criteria. Try adjusting your filters or search terms."
            showFilters={true}
            initialCategory={initialCategory}
          />
        </div>
      )}

      <div className="resources-footer">
        <h3>Don't see what you're looking for?</h3>
        <p>
          Contribute to our community by adding new resources that you've found helpful in your AI learning journey.
        </p>
        <button 
          onClick={handleAddResourceClick} 
          className="button button-primary"
        >
          Add New Resource{!user && " (Login Required)"}
        </button>
      </div>
    </div>
  );
};

export default ResourcesPage; 