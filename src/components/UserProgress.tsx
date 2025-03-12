import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface UserStats {
  contributions: number;
  points: number;
  streak: number;
  rank: number;
}

interface UserProgressProps {
  variant?: 'full' | 'compact';
  showLinks?: boolean;
  points: number;
  contributions: number;
  streak: number;
  rank: number;
}

const UserProgress: React.FC<UserProgressProps> = ({ 
  variant = 'full',
  showLinks = true,
  points,
  contributions,
  streak,
  rank
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
          rank: 5
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
            <span className="points-value">{points}</span>
            <span className="points-label">Points</span>
          </div>
          <div className="user-rank">
            <span className="rank-value">#{rank}</span>
            <span className="rank-label">Rank</span>
          </div>
        </div>
      </div>
    );
  }

  // Full variant shows all stats
  return (
    <div className="user-progress">
      <h3>Your Progress</h3>
      <div className="card">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-value">{contributions}</span>
            <span className="stat-label">Contributions</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{points}</span>
            <span className="stat-label">Points</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">#{rank}</span>
            <span className="stat-label">Rank</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProgress; 