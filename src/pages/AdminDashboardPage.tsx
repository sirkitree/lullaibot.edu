import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Container, Alert, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import UserManagement from '../components/admin/UserManagement';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ContentModeration from '../components/admin/ContentModeration';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import AnalyticsDashboard from '../components/admin/AnalyticsDashboard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `admin-tab-${index}`,
    'aria-controls': `admin-tabpanel-${index}`,
  };
}

const AdminDashboardPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Loading state is handled within child components
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setLoading = (_loading: boolean) => {
    // We don't need to do anything here since we're not using loading state
    // at this level anymore, but we need to pass this function to children
  };

  // Check if user has admin rights
  if (!user || user.role !== 'admin') {
    return <Navigate to="/404" />;
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          Manage users, moderate content, and view analytics
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={() => setError(null)} color="inherit" size="small">
              Dismiss
            </Button>
          </Alert>
        )}

        <Paper sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="admin dashboard tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="User Management" {...a11yProps(0)} />
              <Tab label="Content Moderation" {...a11yProps(1)} />
              <Tab label="Analytics" {...a11yProps(2)} />
            </Tabs>
          </Box>
          
          <>
            <TabPanel value={tabValue} index={0}>
              <UserManagement setError={setError} setLoading={setLoading} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ContentModeration setError={setError} setLoading={setLoading} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <AnalyticsDashboard setError={setError} setLoading={setLoading} />
            </TabPanel>
          </>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage; 