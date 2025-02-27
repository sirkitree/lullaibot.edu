import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteStats from '../components/SiteStats';
import ResourceCard from '../components/ResourceCard';
import { mockResources } from '../data/mockResources';

const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  
  // Get most recent resources, sorted by date
  const recentResources = [...mockResources]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3); // Only take the 3 most recent

  const categories = [
    { id: 1, name: 'General AI Concepts', count: 3 },
    { id: 2, name: 'Getting Started Guides', count: 3 },
    { id: 3, name: 'Developer Resources', count: 3 },
    { id: 4, name: 'Project Management Resources', count: 2 },
    { id: 5, name: 'Advanced Technical Resources', count: 3 },
    { id: 6, name: 'Security and Best Practices', count: 1 }
  ];

  useEffect(() => {
    // In a real app, we would fetch recent resources from the API
    // This is just a placeholder for now
    const fetchRecentResources = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        // Keep using mock data for now
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent resources:', error);
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
      <section className="hero mb-lg">
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