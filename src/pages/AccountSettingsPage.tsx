import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Alert, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import api from '../utils/api';

const SettingsBox = styled(Paper)(({ theme }: { theme: any }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
}));

const AccountSettingsPage: React.FC = () => {
  const { user, loading: authLoading, updateUserProfile } = useAuth();
  
  // Form states
  const [name, setName] = useState<string>(user?.name || '');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [bio, setBio] = useState<string>(user?.bio || '');
  const [profilePicture, setProfilePicture] = useState<string>(user?.profilePicture || '');
  
  // Password change fields
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setBio(user.bio || '');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/auth/updatedetails', {
        name,
        email,
        bio,
        profilePicture
      });
      
      if (response.data.success) {
        setSuccessMessage('Profile information updated successfully');
        setOpenSnackbar(true);
        
        // Refresh user data using the new context method
        await updateUserProfile();
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put('/auth/updatepassword', {
        currentPassword,
        newPassword
      });
      
      if (response.data.success) {
        setSuccessMessage('Password updated successfully');
        setOpenSnackbar(true);
        
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      console.error('Error updating password:', err);
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Alert severity="warning">Please log in to access account settings</Alert>
      </Box>
    );
  }

  return (
    <Box p={3} maxWidth="800px" mx="auto">
      <Typography variant="h4" component="h1" gutterBottom>
        Account Settings
      </Typography>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={successMessage}
      />
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Profile Information */}
      <SettingsBox>
        <Typography variant="h5" gutterBottom>
          Profile Information
        </Typography>
        
        <form onSubmit={handleProfileUpdate}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Bio"
                fullWidth
                multiline
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Profile Picture URL"
                fullWidth
                value={profilePicture}
                onChange={(e) => setProfilePicture(e.target.value)}
                margin="normal"
                variant="outlined"
                helperText="Enter a URL for your profile picture or leave blank for default"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SettingsBox>
      
      {/* Change Password */}
      <SettingsBox>
        <Typography variant="h5" gutterBottom>
          Change Password
        </Typography>
        
        <form onSubmit={handlePasswordChange}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Current Password"
                fullWidth
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="New Password"
                fullWidth
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Confirm New Password"
                fullWidth
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                required
                error={newPassword !== confirmPassword && confirmPassword !== ''}
                helperText={
                  newPassword !== confirmPassword && confirmPassword !== ''
                    ? 'Passwords do not match'
                    : ''
                }
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                sx={{ mt: 2 }}
              >
                {loading ? 'Updating...' : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </SettingsBox>
      
      {/* Notification Preferences (can be expanded in future) */}
      <SettingsBox>
        <Typography variant="h5" gutterBottom>
          Notification Preferences
        </Typography>
        
        <Typography variant="body1" color="textSecondary">
          Notification settings coming soon.
        </Typography>
      </SettingsBox>
    </Box>
  );
};

export default AccountSettingsPage; 