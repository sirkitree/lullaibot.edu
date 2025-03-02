import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResourceList from '../components/ResourceList';
import SearchAutocomplete from '../components/SearchAutocomplete';
import { ResourceProps } from '../components/ResourceCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  filters?: {
    category?: string;
    tag?: string;
  };
  createdAt: string;
}

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState<ResourceProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [newSavedSearchName, setNewSavedSearchName] = useState('');
  const [hasRelevanceScores, setHasRelevanceScores] = useState(false);
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
        
        const response = await api.get('/resources');

        if (response.data.status === 'success') {
          console.log('Resources from API:', response.data.data);
          
          const apiResources = response.data.data;
          setResources(apiResources);
          
          // Generate search suggestions from resource titles, categories, and tags
          const suggestions = new Set<string>();
          
          apiResources.forEach((resource: ResourceProps) => {
            // Add resource title words
            resource.title.split(' ').forEach(word => {
              if (word.length > 3) suggestions.add(word);
            });
            
            // Add category
            suggestions.add(resource.category);
            
            // Add tags
            if (resource.tags) {
              resource.tags.forEach(tag => suggestions.add(tag));
            }
          });
          
          setSearchSuggestions(Array.from(suggestions));
        } else {
          throw new Error('Failed to fetch resources');
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources. Please try again later.');
        
        // Show empty state instead of fallback to mock data
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    // Load saved and recent searches from localStorage
    const loadSavedSearches = () => {
      try {
        const savedSearchesJson = localStorage.getItem('savedSearches');
        const recentSearchesJson = localStorage.getItem('recentSearches');
        
        if (savedSearchesJson) {
          const savedSearchesData = JSON.parse(savedSearchesJson);
          setSavedSearches(savedSearchesData);
        }
        
        if (recentSearchesJson) {
          const recentSearchesData = JSON.parse(recentSearchesJson);
          setRecentSearches(recentSearchesData);
        }
      } catch (err) {
        console.error('Error loading saved searches:', err);
      }
    };

    // Fetch resources as soon as token is available
    fetchResources();
    
    // Load saved searches
    loadSavedSearches();
  }, [token]);

  // Search resources with relevance scoring
  const searchResources = async (query: string) => {
    if (!query.trim()) {
      // Reset to default unfiltered resources
      return;
    }

    setLoading(true);
    setError(null);
    setHasRelevanceScores(false);

    try {
      // Use the new search endpoint with relevance scoring
      const searchResponse = await api.get(`/resources/search`, {
        params: {
          query,
          category: initialCategory || undefined,
          sort: 'relevance'
        }
      });

      if (searchResponse.data.status === 'success') {
        const searchResults = searchResponse.data.data;
        
        // Check if results have relevance scores
        const hasScores = searchResults.length > 0 && 
                          searchResults.some((r: ResourceProps) => typeof r.relevanceScore !== 'undefined');
        
        setHasRelevanceScores(hasScores);
        setResources(searchResults);
      } else {
        throw new Error('Failed to search resources');
      }
    } catch (err) {
      console.error('Error searching resources:', err);
      setError('Failed to search resources. Using basic filtering instead.');
      
      // Fallback to client-side filtering
      const filteredResources = resources.filter(resource => {
        const query = searchQuery.toLowerCase();
        return (
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query) ||
          resource.category.toLowerCase().includes(query) ||
          (resource.tags && resource.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      });
      
      setResources(filteredResources);
    } finally {
      setLoading(false);
    }
  };

  // Handle search execution
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Add to recent searches
    const updatedRecentSearches = [
      searchQuery,
      ...recentSearches.filter(s => s !== searchQuery)
    ].slice(0, 5); // Keep only 5 most recent searches
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    
    // Execute search with relevance scoring
    searchResources(searchQuery);
  };
  
  // Handle recent search click
  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    // Automatically search when clicking a recent search
    setTimeout(() => {
      searchResources(search);
    }, 0);
  };
  
  // Handle remove recent search
  const handleRemoveRecentSearch = (search: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedRecentSearches = recentSearches.filter(s => s !== search);
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
  };
  
  // Handle save current search
  const handleSaveSearch = () => {
    if (!searchQuery.trim() || !newSavedSearchName.trim()) return;
    
    const newSavedSearch: SavedSearch = {
      id: Date.now().toString(),
      name: newSavedSearchName,
      query: searchQuery,
      filters: {
        category: initialCategory
      },
      createdAt: new Date().toISOString()
    };
    
    const updatedSavedSearches = [...savedSearches, newSavedSearch];
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSavedSearches));
    
    setNewSavedSearchName('');
    setShowSavedSearches(false);
  };
  
  // Handle load saved search
  const handleLoadSavedSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query);
    // Execute search immediately after loading a saved search
    setTimeout(() => {
      searchResources(savedSearch.query);
    }, 0);
  };
  
  // Handle delete saved search
  const handleDeleteSavedSearch = (id: string) => {
    const updatedSavedSearches = savedSearches.filter(s => s.id !== id);
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSavedSearches));
  };

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
        <SearchAutocomplete
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
          placeholder="Search resources..."
          loading={loading}
        />
        
        {user && (
          <div className="search-actions">
            <button 
              className="button button-outline-primary save-search-button"
              onClick={() => setShowSavedSearches(!showSavedSearches)}
            >
              {showSavedSearches ? 'Cancel' : 'Save Search'}
            </button>
            
            {showSavedSearches && (
              <div className="save-search-form">
                <input
                  type="text"
                  placeholder="Name your search"
                  value={newSavedSearchName}
                  onChange={(e) => setNewSavedSearchName(e.target.value)}
                  className="save-search-input"
                />
                <button 
                  className="button button-primary"
                  onClick={handleSaveSearch}
                  disabled={!newSavedSearchName.trim() || !searchQuery.trim()}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}
        
        {recentSearches.length > 0 && (
          <div className="recent-searches">
            <div className="recent-searches-title">Recent Searches:</div>
            <div className="recent-search-tags">
              {recentSearches.map((search, index) => (
                <div 
                  key={index} 
                  className="recent-search-tag"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                  <span 
                    className="clear-search-button"
                    onClick={(e) => handleRemoveRecentSearch(search, e)}
                  >
                    ✕
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {user && savedSearches.length > 0 && (
          <div className="saved-searches">
            <div className="saved-searches-title">Saved Searches</div>
            {savedSearches.map(search => (
              <div key={search.id} className="saved-search-item">
                <div className="saved-search-details">
                  <div className="saved-search-name">{search.name}</div>
                  <div className="saved-search-query">"{search.query}"</div>
                </div>
                <div className="saved-search-actions">
                  <button 
                    className="button button-outline-primary"
                    onClick={() => handleLoadSavedSearch(search)}
                  >
                    Load
                  </button>
                  <button 
                    className="button button-outline-danger"
                    onClick={() => handleDeleteSavedSearch(search.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading resources...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="resources-container">
          <ResourceList 
            resources={resources}
            title="All Resources"
            emptyMessage="No resources match your search criteria. Try adjusting your filters or search terms."
            showFilters={true}
            initialCategory={initialCategory}
            showRelevanceSort={hasRelevanceScores && searchQuery.trim() !== ''}
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