import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface SiteStatistics {
  totalResources: number;
  totalUsers: number;
  totalContributions: number;
  popularCategories: {
    name: string;
    count: number;
  }[];
}

interface ResourceType {
  category: string;
  [key: string]: any;
}

const SiteStats: React.FC = () => {
  const [siteStats, setSiteStats] = useState<SiteStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        setLoading(true);
        
        // Fetch site stats from API
        const statsResponse = await api.get('/stats/overview');
        
        if (statsResponse.data.status === 'success') {
          setSiteStats(statsResponse.data.data);
        } else {
          // Fallback: Calculate from resources if stats endpoint fails
          const resourcesResponse = await api.get('/resources');
          
          if (resourcesResponse.data.status === 'success') {
            const resources = resourcesResponse.data.data as ResourceType[];
            
            // Calculate resource stats
            const totalResources = resources.length;
            
            // Count resources by category
            const categoryCounts = resources.reduce((acc: Record<string, number>, resource: ResourceType) => {
              const category = resource.category;
              acc[category] = (acc[category] || 0) + 1;
              return acc;
            }, {});
            
            // Sort categories by count (descending)
            const popularCategories = Object.entries(categoryCounts)
              .map(([name, count]) => ({ name, count: count as number }))
              .sort((a, b) => b.count - a.count);
            
            // Try to get user count from API
            let totalUsers = 0;
            try {
              const usersResponse = await api.get('/users/count');
              if (usersResponse.data.status === 'success') {
                totalUsers = usersResponse.data.data.count;
              } else {
                // Fallback user count
                totalUsers = 1;
              }
            } catch (err) {
              console.error('Error fetching user count:', err);
              totalUsers = 1; // Fallback
            }
            
            // Assume each resource is a contribution (fallback)
            const totalContributions = totalResources;
            
            // Set the statistics with calculated values
            setSiteStats({
              totalResources,
              totalUsers,
              totalContributions,
              popularCategories
            });
          } else {
            throw new Error('Failed to fetch resources to calculate stats');
          }
        }
        
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