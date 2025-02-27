import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  CalendarDays, 
  CalendarRange, 
  Award, 
  FileText, 
  User, 
  Medal, 
  Crown, 
  Star, 
  ThumbsUp, 
  UserCheck, 
  CalendarClock, 
  FilePlus 
} from 'lucide-react';

// API URL
const API_URL = 'http://localhost:3002/api';

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  avatar?: string;
  points: number;
  contributions: number;
}

const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timePeriod, setTimePeriod] = useState<string>('all');
  const { token, user } = useAuth();
  const [currentUserData, setCurrentUserData] = useState<LeaderboardUser | null>(null);

  // Helper function to check if a leaderboard entry belongs to the current user
  const isCurrentUser = (leaderId: string) => {
    if (!user) return false;
    
    // Try different ID comparisons to be safe
    const userId = user.id;
    const stringLeaderId = String(leaderId);
    const stringUserId = String(userId);
    
    return stringLeaderId === stringUserId;
  };

  // Helper function to render rank icon based on position
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown size={16} className="rank-icon" color="gold" />;
      case 2:
        return <Medal size={16} className="rank-icon" color="silver" />;
      case 3:
        return <Medal size={16} className="rank-icon" color="#cd7f32" />;
      default:
        return rank;
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/users/leaderboard?period=${timePeriod}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          console.error('Leaderboard request failed:', {
            status: response.status,
            statusText: response.statusText,
            url: response.url
          });
          const errorData = await response.json().catch(() => ({}));
          console.error('Error response:', errorData);
          throw new Error(`Failed to fetch leaderboard data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status === 'success') {
          setLeaderboard(data.data);
          
          // Check for the current user in the leaderboard data
          if (user) {
            console.log('Current user:', user);
            console.log('User ID from auth context:', user.id);
            console.log('All leaderboard IDs:', data.data.map((l: LeaderboardUser) => l.id));
            
            // Try to find the user by comparing IDs as strings
            const userInLeaderboard = data.data.find((leader: LeaderboardUser) => 
              isCurrentUser(leader.id)
            );
            
            console.log('User found in leaderboard:', userInLeaderboard);
            
            if (userInLeaderboard) {
              setCurrentUserData(userInLeaderboard);
            } else {
              // Force a reload of user data to ensure we have the latest info
              console.log('Could not find user in leaderboard. Try refreshing the page.');
            }
          }
        } else {
          throw new Error(data.message || 'Failed to load leaderboard');
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        
        // Use mock data as fallback
        setLeaderboard([
          { rank: 1, id: '1', name: 'Jane Smith', points: 1250, contributions: 15 },
          { rank: 2, id: '2', name: 'John Doe', points: 980, contributions: 12 },
          { rank: 3, id: '3', name: 'Alice Johnson', points: 840, contributions: 10 },
          { rank: 4, id: '4', name: 'Bob Williams', points: 720, contributions: 8 },
          { rank: 5, id: '5', name: 'Carol Brown', points: 650, contributions: 7 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [token, timePeriod, user]);

  const handlePeriodChange = (period: string) => {
    setTimePeriod(period);
  };

  // If we don't have currentUserData but we have leaderboard data, try to refresh
  useEffect(() => {
    if (!currentUserData && leaderboard.length > 0 && user) {
      // Print all user IDs to console for debugging
      console.log('User IDs in leaderboard:', leaderboard.map(leader => leader.id));
      console.log('Current user ID:', user.id);
      
      // Try to find user again in case they have different ID formats
      const foundUser = leaderboard.find(leader => isCurrentUser(leader.id));
      if (foundUser) {
        console.log('Found user on second attempt:', foundUser);
        setCurrentUserData(foundUser);
      }
    }
  }, [leaderboard, user, currentUserData]);

  return (
    <div className="page leaderboard-page">
      <div className="page-header">
        <h1>Community Leaderboard</h1>
        <p className="page-description">
          See who's contributing the most to our AI education community.
        </p>
      </div>

      <div className="leaderboard-filters">
        <div className="filter-group">
          <label>Time Period:</label>
          <div className="button-group">
            <button 
              className={`button ${timePeriod === 'all' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => handlePeriodChange('all')}
            >
              <Calendar size={16} className="icon" /> All Time
            </button>
            <button 
              className={`button ${timePeriod === 'month' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => handlePeriodChange('month')}
            >
              <CalendarDays size={16} className="icon" /> This Month
            </button>
            <button 
              className={`button ${timePeriod === 'week' ? 'button-primary' : 'button-secondary'}`}
              onClick={() => handlePeriodChange('week')}
            >
              <CalendarRange size={16} className="icon" /> This Week
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading leaderboard data...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {user && (
            <div className="user-rank">
              <div className="user-rank-info">
                <div className="user-rank-title">
                  Your Current Rank: #{currentUserData?.rank || 'N/A'}
                </div>
                <div className="user-rank-stats">
                  <span><Award size={16} className="icon" /> Points: {currentUserData?.points || 0}</span>
                  <span><FileText size={16} className="icon" /> Contributions: {currentUserData?.contributions || 0}</span>
                </div>
              </div>
            </div>
          )}

          <div className="leaderboard-top-users">
            {leaderboard.slice(0, 3).map((leader) => (
              <div 
                key={leader.id} 
                className={`top-user rank-${leader.rank}`}
              >
                <div className="rank-badge">
                  {getRankIcon(leader.rank)}
                </div>
                <div className="avatar">
                  <div className="avatar-placeholder">
                    <User size={32} />
                  </div>
                </div>
                <div className="name">{leader.name}</div>
                <div className="points"><Star size={16} className="icon" /> {leader.points} points</div>
                <div className="contributions"><FileText size={16} className="icon" /> {leader.contributions} contributions</div>
                {isCurrentUser(leader.id) && (
                  <div className="current-user-badge">You</div>
                )}
              </div>
            ))}
          </div>

          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th><Star size={16} className="icon" />Points</th>
                  <th><FileText size={16} className="icon" />Contributions</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((leader) => (
                  <tr 
                    key={leader.id}
                    className={isCurrentUser(leader.id) ? 'current-user' : ''}
                  >
                    <td className="rank-cell">{getRankIcon(leader.rank)}</td>
                    <td className="user">
                      <span className="name">{leader.name}</span>
                      {isCurrentUser(leader.id) && (
                        <span className="current-user-indicator"> (You)</span>
                      )}
                    </td>
                    <td className="points">{leader.points}</td>
                    <td className="contributions">{leader.contributions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="leaderboard-info">
            <h3>How to Earn Points</h3>
            <ul>
              <li><FilePlus size={16} className="icon" /> <strong>+5 points</strong> for adding a new resource</li>
              <li><ThumbsUp size={16} className="icon" /> <strong>+1 point</strong> for receiving an upvote on your resource</li>
              <li><UserCheck size={16} className="icon" /> <strong>+20 points</strong> for completing your profile</li>
              <li><CalendarClock size={16} className="icon" /> <strong>+1 point</strong> for each day of your login streak</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default LeaderboardPage; 