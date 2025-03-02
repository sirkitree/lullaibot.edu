import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminRegistration: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Register admin user directly
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'admin' // Explicitly set role to admin
      });
      
      if (response.data.success) {
        setSuccess('Admin user registered successfully! Redirecting to login...');
        // Navigate to login after a delay
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err: any) {
      console.error('Admin registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Register Admin User
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Create a permanent admin user with localStorage persistence
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField
              label="Full Name"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Email Address"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
            <TextField
              label="Confirm Password"
              variant="outlined"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            
            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
              >
                {loading ? 'Registering...' : 'Register Admin User'}
              </Button>
            </Box>
            
            <Box sx={{ mt: 2 }}>
              <Button
                variant="text"
                color="inherit"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Back to Login
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminRegistration; 