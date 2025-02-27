import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { mockResources } from '../data/mockResources';

interface SiteStatistics {
  totalResources: number;
  totalUsers: number;
  totalContributions: number;
  popularCategories: {
    name: string;
    count: number;
  }[];
}

const SiteStats: React.FC = () => {
  const [siteStats, setSiteStats] = useState<SiteStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        setLoading(true);
        
        // In a production app, you would fetch from an API endpoint
        // const response = await fetch(`${API_URL}/stats/overall`);
        
        // For development, calculate stats from mock resources
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Calculate resource stats from mockResources
        const totalResources = mockResources.length;
        
        // Count resources by category
        const categoryCounts = mockResources.reduce((acc: Record<string, number>, resource) => {
          const category = resource.category;
          acc[category] = (acc[category] || 0) + 1;
          return acc;
        }, {});
        
        // Sort categories by count (descending)
        const popularCategories = Object.entries(categoryCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);
        
        // Set mock users data - would normally come from API
        const totalUsers = 42; // Fixed mock value
        
        // Calculate total contributions - assume each resource is a contribution
        const totalContributions = totalResources;
        
        // Set the statistics with calculated values
        setSiteStats({
          totalResources,
          totalUsers,
          totalContributions,
          popularCategories
        });
        
        setError(null);
      } catch (err) {
        console.error('Error fetching site stats:', err);
        setError('Failed to load site statistics');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSiteStats();
  }, []);

  if (loading) {
    return (
      <div className="site-stats-section">
        <h3>Site Statistics</h3>
        <div className="loading-spinner">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="site-stats-section">
        <h3>Site Statistics</h3>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="site-stats-section">
      <h3>Site Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-value">{siteStats?.totalResources}</span>
          <span className="stat-label">Resources</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{siteStats?.totalUsers}</span>
          <span className="stat-label">Users</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{siteStats?.totalContributions}</span>
          <span className="stat-label">Contributions</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">
            {siteStats?.popularCategories[0]?.count || 0}
          </span>
          <span className="stat-label">Top Category</span>
        </div>
      </div>
      
      <div className="progress-section mt-md">
        <h4>Popular Categories</h4>
        <div className="popular-categories">
          {siteStats?.popularCategories.slice(0, 3).map((category, index) => (
            <div key={index} className="popular-category">
              <span className="category-name">{category.name}</span>
              <span className="category-count">{category.count} resources</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="site-links mt-md">
        <Link to="/resources" className="button button-secondary">Browse Resources</Link>
        <Link to="/leaderboard" className="button button-outline ml-sm">View Leaderboard</Link>
      </div>
    </div>
  );
};

export default SiteStats; 