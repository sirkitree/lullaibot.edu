import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteStats from '../components/SiteStats';
import ResourceCard from '../components/ResourceCard';
import api from '../utils/api';
import { ResourceProps } from '../components/ResourceCard';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [recentResources, setRecentResources] = useState<ResourceProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Categories - will be dynamically generated from API data
  const [categories, setCategories] = useState<{id: number; name: string; count: number}[]>([]);

  useEffect(() => {
    // Fetch recent resources from the API
    const fetchRecentResources = async () => {
      try {
        setLoading(true);
        const response = await api.get('/resources', {
          params: {
            limit: 3,
            sort: '-createdAt' // Sort by most recent
          }
        });
        
        if (response.data.status === 'success') {
          setRecentResources(response.data.data);
          
          // Generate category counts from all resources
          const allResourcesResponse = await api.get('/resources');
          if (allResourcesResponse.data.status === 'success') {
            const allResources = allResourcesResponse.data.data;
            
            // Count resources by category
            const categoryCounts: Record<string, number> = {};
            allResources.forEach((resource: ResourceProps) => {
              const category = resource.category;
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            
            // Convert to array for display
            const categoryArray = Object.entries(categoryCounts).map(([name, count], index) => ({
              id: index + 1,
              name,
              count
            }));
            
            setCategories(categoryArray);
          }
        } else {
          throw new Error('Failed to fetch resources');
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching recent resources:', error);
        setError('Failed to load recent resources');
        // Show empty state
        setRecentResources([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentResources();
  }, []);

  // Handle resource click
  const handleResourceClick = (id: string) => {
    console.log(`Resource clicked: ${id}`);
    // Could navigate to resource detail page or open modal with details
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        {loading ? (
          <div className="loading-state">Loading resources...</div>
        ) : error ? (
          <div className="error-state">{error}</div>
        ) : (
          <div className="card">
            <h2>Welcome to LullAIbot Education</h2>
            <p>
              Discover, contribute, and learn from Lullabot's collection of AI resources.
              Add new links, browse existing content, and earn achievements along the way.
            </p>
            <div className="flex gap-md mt-md">
              <Link to="/resources" className="button button-primary">Browse Resources</Link>
              <Link to="/add-resource" className="button button-outline">Add New Resource</Link>
            </div>
          </div>
        )}
      </section>

      <div className="dashboard-grid">
        <section className="recent-activity">
          <h3>Recent Additions</h3>
          {loading ? (
            <div className="loading-spinner">Loading resources...</div>
          ) : (
            <div className="activity-list">
              {recentResources.map(resource => (
                <ResourceCard 
                  key={resource.id}
                  resource={resource}
                  variant="compact"
                  onClick={handleResourceClick}
                />
              ))}
            </div>
          )}
          <Link to="/resources" className="view-all">View all resources →</Link>
        </section>

        <SiteStats />

        <section className="categories-overview">
          <h3>Resource Categories</h3>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                to={`/resources?category=${encodeURIComponent(category.name)}`} 
                key={category.id} 
                className="category-card"
              >
                <h4>{category.name}</h4>
                <span className="category-count">{category.count} resources</span>
              </Link>
            ))}
          </div>
          <div className="mt-md">
            <Link to="/resources" className="button button-secondary">View All Categories</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage; 