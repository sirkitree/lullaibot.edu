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
            sort: '-date' // Sort by most recent
          }
        });
        
        // Log the response for debugging
        console.log('Recent resources response:', response);
        
        // Handle both array and object response formats
        const resourcesData = Array.isArray(response.data) ? response.data : 
                            response.data?.data || response.data?.resources || [];
        
        if (resourcesData.length > 0) {
          // Map API response to match ResourceProps interface
          const mappedResources = resourcesData.map((resource: any) => ({
            id: resource.id || '',
            title: resource.title || '',
            description: resource.description || '',
            url: resource.url || '',
            category: resource.category || 'Uncategorized',
            addedBy: resource.addedBy || resource.submittedBy?.name || 'Unknown',
            date: resource.date || resource.createdAt || new Date().toISOString(),
            tags: resource.tags || [],
            upvotes: resource.upvotes || 0,
            screenshot: resource.screenshot || resource.thumbnail || null
          }));
          setRecentResources(mappedResources);
          
          // Generate category counts from all resources
          const allResourcesResponse = await api.get('/resources');
          console.log('All resources response:', allResourcesResponse);
          
          // Handle both array and object response formats for all resources
          const allResourcesData = Array.isArray(allResourcesResponse.data) ? allResourcesResponse.data :
                                 allResourcesResponse.data?.data || allResourcesResponse.data?.resources || [];
          
          if (allResourcesData.length > 0) {
            // Count resources by category
            const categoryCounts: Record<string, number> = {};
            allResourcesData.forEach((resource: any) => {
              const category = resource.category || 'Uncategorized';
              categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            });
            
            // Convert to array for display
            const categoryArray = Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a) // Sort by count descending
              .map(([name, count], index) => ({
                id: index + 1,
                name,
                count
              }));
            
            setCategories(categoryArray);
          }
        } else {
          console.log('No resources found in the response');
          setRecentResources([]);
          setCategories([]);
        }
        
        setError(null);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setError('Failed to load resources');
        // Show empty state
        setRecentResources([]);
        setCategories([]);
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
              Add new links and browse existing content.
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