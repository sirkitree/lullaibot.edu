import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ResourceCard, { ResourceProps } from './ResourceCard';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface ResourceListProps {
  resources: ResourceProps[];
  title?: string;
  emptyMessage?: string;
  showFilters?: boolean;
  initialCategory?: string;
}

const ResourceList: React.FC<ResourceListProps> = ({
  resources,
  title = 'Resources',
  emptyMessage = 'No resources found.',
  showFilters = true,
  initialCategory = '',
}) => {
  const [viewMode, setViewMode] = useState<'compact' | 'full'>('compact');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'upvotes'>('date');
  const [filterCategory, setFilterCategory] = useState<string>(initialCategory);
  const [localResources, setLocalResources] = useState<ResourceProps[]>(resources);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();

  // Update local resources when prop resources change
  useEffect(() => {
    setLocalResources(resources);
  }, [resources]);

  // Effect to initialize category from prop when it changes
  useEffect(() => {
    if (initialCategory) {
      setFilterCategory(initialCategory);
    }
  }, [initialCategory]);

  // Get unique categories from resources
  const categories = ['All', ...new Set(resources.map(resource => resource.category))];

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setFilterCategory(category);
    
    // Update URL with new category parameter
    const queryParams = new URLSearchParams(location.search);
    if (category) {
      queryParams.set('category', category);
    } else {
      queryParams.delete('category');
    }
    
    // Replace state to avoid adding to browser history on every filter change
    navigate({
      pathname: location.pathname,
      search: queryParams.toString()
    }, { replace: true });
  };

  // Handle upvoting a resource
  const handleUpvote = async (id: string) => {
    if (!token) {
      // Redirect to login if not authenticated
      alert('Please log in to upvote resources');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    try {
      const response = await api.post(`/resources/${id}/upvote`);
      
      if (response.data.status === 'success') {
        // Update the resource in our local state with the new upvote count
        setLocalResources(prev => 
          prev.map(resource => 
            resource.id === id 
              ? { ...resource, upvotes: (resource.upvotes || 0) + 1 } 
              : resource
          )
        );
        
        alert('Resource upvoted!');
      }
    } catch (error) {
      console.error('Error upvoting resource:', error);
      alert('Failed to upvote resource. Please try again.');
    }
  };

  // Sort resources
  const sortedResources = [...localResources].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'upvotes') {
      return (b.upvotes || 0) - (a.upvotes || 0);
    }
    return a.title.localeCompare(b.title);
  });

  // Filter resources by category
  const filteredResources = filterCategory 
    ? sortedResources.filter(resource => {
        // Add detailed console log for each resource being filtered
        const matches = resource.category.toLowerCase() === filterCategory.toLowerCase();
        console.log(`Resource ${resource.id}: "${resource.title}" - Category "${resource.category}" matches "${filterCategory}"? ${matches}`);
        return matches;
      })
    : sortedResources;

  // Console log for debugging
  console.log('Filtering resources:', {
    totalResources: resources.length,
    filterCategory,
    filteredCount: filteredResources.length,
    allCategories: [...new Set(resources.map(r => r.category))],
    allResources: resources.map(r => ({id: r.id, title: r.title, category: r.category}))
  });

  const handleResourceClick = (id: string) => {
    console.log(`Resource clicked: ${id}`);
    // Navigate to resource detail page or open modal with details
  };

  return (
    <div className="resource-list-container">
      <div className="resource-list-header flex justify-between items-center">
        <h2>{title}</h2>
        
        {showFilters && (
          <div className="resource-list-controls flex gap-md items-center">
            <div className="sort-control flex gap-sm items-center">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'upvotes')}
                className="sort-select"
              >
                <option value="date">Newest</option>
                <option value="title">Title</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
            
            <div className="filter-control flex gap-sm items-center">
              <label htmlFor="category-select">Category:</label>
              <select
                id="category-select"
                value={filterCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="category-select"
              >
                <option value="">All</option>
                {categories.map(category => (
                  category !== 'All' && (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  )
                ))}
              </select>
            </div>
            
            <div className="view-toggle">
              <button
                className={`view-toggle-button ${viewMode === 'compact' ? 'active' : ''}`}
                onClick={() => setViewMode('compact')}
              >
                Compact
              </button>
              <button 
                className={`view-toggle-button ${viewMode === 'full' ? 'active' : ''}`}
                onClick={() => setViewMode('full')}
              >
                Detailed
              </button>
            </div>
          </div>
        )}
      </div>
      
      {filteredResources.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="resource-list">
          {filteredResources.map(resource => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              variant={viewMode}
              onClick={handleResourceClick}
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResourceList; 