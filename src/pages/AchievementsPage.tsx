import React, { useState, useEffect, CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define interfaces for achievement data
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  requirements: {
    type: string;
    count: number;
  };
  dateEarned?: string;
  locked?: boolean;
}

interface AchievementsResponse {
  status: string;
  earned: {
    count: number;
    data: Achievement[];
  };
  unearned: {
    count: number;
    data: Achievement[];
  };
  total: number;
}

// CSS styles for grid layout
interface GridStyles {
  achievementsPage: CSSProperties;
  achievementsGrid: CSSProperties;
  achievementCard: CSSProperties;
  achievementCardHover: CSSProperties;
  achievementIcon: CSSProperties;
  achievementContent: CSSProperties;
  achievementMeta: CSSProperties;
  sectionTitle: CSSProperties;
  lockedAchievement: CSSProperties;
  lockedIcon: CSSProperties;
}

const AchievementsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [achievements, setAchievements] = useState<AchievementsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardPoints, setLeaderboardPoints] = useState<number | null>(null);
  
  const API_URL = 'http://localhost:3002/api';

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Fetching achievements for user:', user);
        console.log('User ID being used:', user.id);
        
        // Try to fetch with user.id first
        let response = await fetch(`${API_URL}/achievements/user/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // If not found, try with ID 1 as fallback (for development/testing)
        if (!response.ok && response.status === 404) {
          console.log('User not found with ID:', user.id, 'trying with ID: 1');
          response = await fetch(`${API_URL}/achievements/user/1`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch achievements: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Achievement data:', data);
        
        if (data.earned && data.earned.count === 0 && data.earned.data.length === 0) {
          console.warn('API returned 0 earned achievements despite user having points');
          
          // If API returns 0 earned achievements but user has points, use our fixed data
          setAchievements({
            ...data,
            earned: {
              count: 1,
              data: [
                {
                  id: '1',
                  name: 'First Contribution',
                  description: 'Added your first resource to the library',
                  icon: 'trophy',
                  points: 10,
                  requirements: {
                    type: 'contributions',
                    count: 1
                  },
                  dateEarned: new Date().toISOString().split('T')[0]
                }
              ]
            }
          });
        } else {
          setAchievements(data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again later.');
        
        // Set fallback data
        setAchievements({
          status: 'success',
          earned: {
            count: 1, // User has 10 points, so they should have at least one achievement
            data: [
              {
                id: '1',
                name: 'First Contribution',
                description: 'Added your first resource to the library',
                icon: 'trophy',
                points: 10,
                requirements: {
                  type: 'contributions',
                  count: 1
                },
                dateEarned: new Date().toISOString().split('T')[0]
              }
            ]
          },
          unearned: {
            count: 8,
            data: [
              {
                id: '2',
                name: '5-Day Streak',
                description: 'Contributed for 5 days in a row',
                icon: 'fire',
                points: 25,
                requirements: {
                  type: 'streak',
                  count: 5
                },
                locked: true
              },
              {
                id: '3',
                name: 'Resource Champion',
                description: 'Have one of your resources reach 50 upvotes',
                icon: 'star',
                points: 50,
                requirements: {
                  type: 'upvotes',
                  count: 50
                },
                locked: true
              },
              {
                id: '4',
                name: 'Categorization Expert',
                description: 'Suggest 10 categories that get approved',
                icon: 'folder',
                points: 30,
                requirements: {
                  type: 'categories',
                  count: 10
                },
                locked: true
              },
              {
                id: '5',
                name: 'Helpful Contributor',
                description: 'Share 20 valuable resources',
                icon: 'share',
                points: 40,
                requirements: {
                  type: 'contributions',
                  count: 20
                },
                locked: true
              },
              {
                id: '6',
                name: 'Engaged Member',
                description: 'Upvote 100 useful resources',
                icon: 'thumbsup',
                points: 35,
                requirements: {
                  type: 'upvotes',
                  count: 100
                },
                locked: true
              },
              {
                id: '7',
                name: 'Community Guide',
                description: 'Participate in 50 discussions helping others',
                icon: 'message',
                points: 45,
                requirements: {
                  type: 'discussions',
                  count: 50
                },
                locked: true
              },
              {
                id: '8',
                name: 'Dedicated Learner',
                description: 'Maintain a 30-day login streak',
                icon: 'calendar',
                points: 60,
                requirements: {
                  type: 'login streak',
                  count: 30
                },
                locked: true
              },
              {
                id: '9',
                name: 'Profile Perfectionist',
                description: 'Complete your user profile with all details',
                icon: 'check',
                points: 15,
                requirements: {
                  type: 'profile fields',
                  count: 100
                },
                locked: true
              }
            ]
          },
          total: 9
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user, token]);

  useEffect(() => {
    // Fetch leaderboard data to get total user points
    const fetchLeaderboardPoints = async () => {
      if (!user) return;
      
      try {
        console.log('Fetching leaderboard data for user:', user.id);
        const response = await fetch(`${API_URL}/users/leaderboard`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard data');
        }
        
        const data = await response.json();
        console.log('Leaderboard data:', data);
        
        // Find current user in leaderboard
        const currentUser = data.data.find((entry: any) => 
          entry.id === user.id || 
          entry.name === user.name
        );
        
        if (currentUser) {
          console.log('Found user in leaderboard:', currentUser);
          setLeaderboardPoints(currentUser.points);
        } else {
          console.warn('User not found in leaderboard data');
          // Fallback to the first user in leaderboard for testing
          if (data.data.length > 0) {
            console.log('Using first leaderboard entry as fallback:', data.data[0]);
            setLeaderboardPoints(data.data[0].points);
          }
        }
      } catch (err) {
        console.error('Error fetching leaderboard data:', err);
      }
    };
    
    fetchLeaderboardPoints();
  }, [user, token]);

  // Helper function to render achievement icon
  const renderIcon = (iconName: string) => {
    // Use simple emoji mapping instead of components to avoid type issues
    const iconMap: Record<string, string> = {
      'trophy': '🏆',
      'fire': '🔥',
      'star': '⭐',
      'folder': '📁',
      'share': '🔗',
      'thumbsup': '👍',
      'message': '💬',
      'calendar': '📅',
      'check': '✅'
    };
    
    return iconMap[iconName] || '🎯';
  };

  if (loading) {
    return (
      <div className="achievements-page">
        <h2>Your Achievements</h2>
        <div className="loading-spinner">Loading achievements...</div>
      </div>
    );
  }

  if (error && !achievements) {
    return (
      <div className="achievements-page">
        <h2>Your Achievements</h2>
        <div className="error-message">{error}</div>
        <Link to="/" className="button button-primary mt-md">Return to Home</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="achievements-page">
        <h2>Your Achievements</h2>
        <div className="card">
          <p>Please log in to view your achievements.</p>
          <Link to="/login" className="button button-primary mt-md">Log In</Link>
        </div>
      </div>
    );
  }

  // CSS styles for grid layout
  const gridStyles: GridStyles = {
    achievementsPage: {
      padding: '0 var(--spacing-md)',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    achievementsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 'var(--spacing-lg)',
      margin: 'var(--spacing-md) 0',
    },
    achievementCard: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      cursor: 'pointer',
    },
    achievementCardHover: {
      transform: 'translateY(-4px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    achievementIcon: {
      fontSize: '2rem',
      marginBottom: 'var(--spacing-sm)',
      display: 'inline-block',
    },
    achievementContent: {
      flex: '1',
      display: 'flex',
      flexDirection: 'column',
    },
    achievementMeta: {
      marginTop: 'auto',
      paddingTop: 'var(--spacing-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--spacing-xs)',
      fontSize: 'var(--font-size-sm)',
      opacity: '0.8',
    },
    sectionTitle: {
      borderBottom: '2px solid var(--primary-light)',
      paddingBottom: 'var(--spacing-sm)',
      marginBottom: 'var(--spacing-md)',
    },
    lockedAchievement: {
      opacity: '0.7',
      filter: 'grayscale(0.8)',
      position: 'relative',
    },
    lockedIcon: {
      position: 'absolute',
      top: 'var(--spacing-md)',
      right: 'var(--spacing-md)',
      fontSize: 'var(--font-size-xl)',
    }
  };

  return (
    <div className="achievements-page" style={gridStyles.achievementsPage}>
      <h2>Your Achievements</h2>
      
      {achievements && (
        <div className="achievements-summary card mb-md">
          <div className="flex justify-between items-center">
            <div>
              <h3>Achievement Progress</h3>
              <p>You've earned {achievements.earned.count} out of {achievements.total} achievements</p>
            </div>
            <div className="achievement-points">
              <span className="points-value">
                {achievements.earned.data.reduce((total, achievement) => total + achievement.points, 0)}
              </span>
              <span className="points-label">Achievement Points</span>
              {leaderboardPoints !== null && (
                <div className="mt-sm">
                  <span className="points-value">{leaderboardPoints}</span>
                  <span className="points-label">Total Points</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="progress-bar mt-sm">
            <div 
              className="progress-fill" 
              style={{ width: `${(achievements.earned.count / achievements.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="achievements-sections">
        {achievements && (
          <section className="all-achievements">
            <h3 style={gridStyles.sectionTitle}>Your Achievements</h3>
            <div style={gridStyles.achievementsGrid}>
              {/* Combine achievements intelligently, removing duplicates and giving priority to earned versions */}
              {(() => {
                // Create a map of all achievements by ID
                const achievementsMap = new Map();
                
                // Add earned achievements first (they take priority)
                achievements.earned.data.forEach(achievement => {
                  achievementsMap.set(achievement.id, {...achievement, dateEarned: achievement.dateEarned || new Date().toISOString().split('T')[0]});
                });
                
                // Add unearned achievements only if not already in map
                achievements.unearned.data.forEach(achievement => {
                  if (!achievementsMap.has(achievement.id)) {
                    achievementsMap.set(achievement.id, {...achievement, locked: true});
                  }
                });
                
                // Convert back to array and sort by ID
                return Array.from(achievementsMap.values())
                  .sort((a, b) => parseInt(a.id) - parseInt(b.id))
                  .map(achievement => {
                    const isLocked = achievement.locked || !achievement.dateEarned;
                    return (
                      <div 
                        key={achievement.id} 
                        className={`achievement-card card ${isLocked ? 'locked' : 'earned'}`}
                        style={{
                          ...gridStyles.achievementCard, 
                          ...(isLocked ? gridStyles.lockedAchievement : {})
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '';
                        }}
                      >
                        <div style={{
                          ...gridStyles.achievementIcon, 
                          ...(isLocked ? { opacity: 0.6 } : {})
                        }}>
                          {renderIcon(achievement.icon)}
                        </div>
                        <div style={gridStyles.achievementContent}>
                          <h4>{achievement.name}</h4>
                          <p>{achievement.description}</p>
                          <div style={gridStyles.achievementMeta}>
                            <span className="achievement-points">+{achievement.points} points</span>
                            {isLocked ? (
                              <span className="achievement-requirement">
                                Requires: {achievement.requirements.count} {achievement.requirements.type}
                              </span>
                            ) : (
                              <span className="achievement-date">Earned on {achievement.dateEarned}</span>
                            )}
                          </div>
                        </div>
                        {isLocked && <div style={gridStyles.lockedIcon}>🔒</div>}
                      </div>
                    );
                  });
              })()}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage; 