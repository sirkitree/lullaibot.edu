import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Avatar, Paper, Grid, Button, Divider, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import UserProgress from '../components/UserProgress';
import api from '../utils/api';

const ProfileBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

interface UserStats {
  contributions: number;
  points: number;
  streak: number;
  rank: number;
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [userResources, setUserResources] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch user stats
        const statsResponse = await api.get(`/users/${user.id}/stats`);
        if (statsResponse.data.status === 'success') {
          setStats(statsResponse.data.data);
        }
        
        // Fetch user resources
        const resourcesResponse = await api.get(`/users/${user.id}/resources`);
        if (resourcesResponse.data.status === 'success') {
          setUserResources(resourcesResponse.data.data);
        }
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Alert severity="warning">Please log in to view your profile</Alert>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="1200px" mx="auto">
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* User Basic Information */}
        <Grid item xs={12} md={4}>
          <ProfileBox>
            <Box display="flex" flexDirection="column" alignItems="center">
              <StyledAvatar
                src={user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                alt={user.name}
              />
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {user.email}
              </Typography>
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }}
                href="/account-settings"
              >
                Edit Profile
              </Button>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>Bio</Typography>
              <Typography variant="body1">
                {user.bio || 'No bio available. Add one in your account settings!'}
              </Typography>
            </Box>
          </ProfileBox>
        </Grid>
        
        {/* User Stats */}
        <Grid item xs={12} md={8}>
          <ProfileBox>
            <Typography variant="h6" gutterBottom>Activity Stats</Typography>
            
            {stats ? (
              <UserProgress 
                points={stats.points} 
                contributions={stats.contributions} 
                streak={stats.streak}
                rank={stats.rank}
                variant="full"
                showLinks={true}
              />
            ) : (
              <Typography variant="body1">No stats available</Typography>
            )}
          </ProfileBox>
          
          {/* Recent Contributions */}
          <ProfileBox>
            <Typography variant="h6" gutterBottom>Recent Contributions</Typography>
            
            {userResources.length > 0 ? (
              userResources.slice(0, 5).map((resource, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1">{resource.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Added on {new Date(resource.createdAt).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    {resource.description?.substring(0, 100)}
                    {resource.description?.length > 100 ? '...' : ''}
                  </Typography>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              ))
            ) : (
              <Typography variant="body1">No contributions yet</Typography>
            )}
            
            {userResources.length > 5 && (
              <Button variant="text" sx={{ mt: 1 }}>
                View All Contributions
              </Button>
            )}
          </ProfileBox>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage; 