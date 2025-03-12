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

const SiteStats: React.FC = () => {
  const [siteStats, setSiteStats] = useState<SiteStatistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch site stats from API
        const response = await api.get('/admin/analytics/stats/overview');
        console.log('Stats response:', response); // Debug log
        
        if (response.data.status === 'success' && response.data.data) {
          setSiteStats(response.data.data);
        } else {
          throw new Error('Invalid response format from stats endpoint');
        }
      } catch (err) {
        console.error('Error fetching site stats:', err);
        setError('Failed to load site statistics. Please try again later.');
        // Set default values to prevent UI from breaking
        setSiteStats({
          totalResources: 0,
          totalUsers: 0,
          totalContributions: 0,
          popularCategories: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSiteStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading site statistics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!siteStats) {
    return null;
  }

  return (
    <div className="site-stats">
      <h2>Site Statistics</h2>
      <div className="stats-grid">
        <div className="stat-item">
          <h3>{siteStats.totalResources}</h3>
          <p>Total Resources</p>
        </div>
        <div className="stat-item">
          <h3>{siteStats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-item">
          <h3>{siteStats.totalContributions}</h3>
          <p>Total Contributions</p>
        </div>
      </div>
      
      {siteStats.popularCategories.length > 0 && (
        <div className="popular-categories">
          <h3>Popular Categories</h3>
          <ul>
            {siteStats.popularCategories.map((category, index) => (
              <li key={index}>
                <Link to={`/categories/${category.name}`}>
                  {category.name} ({category.count})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SiteStats; 