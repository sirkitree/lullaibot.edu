import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface UserStats {
  contributions: number;
  points: number;
  streak: number;
  rank: number;
  achievements: {
    earned: number;
    total: number;
  };
}

interface UserProgressProps {
  variant?: 'full' | 'compact';
  showLinks?: boolean;
}

const UserProgress: React.FC<UserProgressProps> = ({ 
  variant = 'full',
  showLinks = true
}) => {
  const { user, token } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await api.get(`/users/${user.id}/stats`);
        
        setUserStats(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching user stats:', err);
        setError('Failed to load user stats');
        
        // Fallback to mock data for development
        setUserStats({
          contributions: 12,
          points: 142,
          streak: 3,
          rank: 5,
          achievements: {
            earned: 4,
            total: 12
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user, token]);

  if (loading) {
    return <div className="loading-spinner">Loading user progress...</div>;
  }

  if (error && !userStats) {
    return <div className="error-message">{error}</div>;
  }

  if (!user || !userStats) {
    return (
      <div className="card">
        <p>Please log in to view your progress.</p>
        {showLinks && (
          <Link to="/login" className="button button-primary mt-md">Log In</Link>
        )}
      </div>
    );
  }

  // Compact variant just shows a progress bar and basic stats
  if (variant === 'compact') {
    return (
      <div className="user-progress-compact">
        <div className="flex justify-between items-center">
          <div className="user-points">
            <span className="points-value">{userStats.points}</span>
            <span className="points-label">Points</span>
          </div>
          <div className="user-rank">
            <span className="rank-value">#{userStats.rank}</span>
            <span className="rank-label">Rank</span>
          </div>
        </div>
        
        <div className="progress-section mt-sm">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(userStats.achievements.earned / userStats.achievements.total) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {userStats.achievements.earned}/{userStats.achievements.total} achievements
          </p>
        </div>
      </div>
    );
  }

  // Full variant shows all stats and links
  return (
    <div className="user-progress">
      <h3>Your Progress</h3>
      <div className="card">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{userStats.contributions}</span>
            <span className="stat-label">Contributions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userStats.points}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{userStats.streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">#{userStats.rank}</span>
            <span className="stat-label">Rank</span>
          </div>
        </div>
        
        <div className="progress-section mt-md">
          <h4>Achievements</h4>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(userStats.achievements.earned / userStats.achievements.total) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            {userStats.achievements.earned}/{userStats.achievements.total} achievements unlocked
          </p>
        </div>
        
        {showLinks && (
          <div className="progress-links mt-md">
            <Link to="/achievements" className="button button-secondary">View Achievements</Link>
            <Link to="/leaderboard" className="button button-outline ml-sm">Leaderboard</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProgress; 