import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  LibraryBooks as ResourcesIcon,
  Bookmark as CategoryIcon,
  ThumbUp as VoteIcon
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import api from '../../utils/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Props {
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

interface StatCard {
  title: string;
  value: number;
  icon: JSX.Element;
  description: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

const AnalyticsDashboard: React.FC<Props> = ({ setError, setLoading }) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalResources: 0,
    pendingResources: 0,
    totalCategories: 0,
    totalVotes: 0
  });
  const [userRegistrationData, setUserRegistrationData] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'New Users',
      data: [],
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  });
  const [resourcesByCategory, setResourcesByCategory] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Resources',
      data: [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderWidth: 1
    }]
  });
  const [activityByDay, setActivityByDay] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Resource Submissions',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'User Logins',
        data: [],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Votes',
        data: [],
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      }
    ]
  });

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch main stats
      const statsResponse = await api.get('/admin/analytics/stats', {
        params: { timeRange }
      });
      
      if (statsResponse.data.success) {
        setStats(statsResponse.data.data);
      }
      
      // Fetch user registration data
      const userRegResponse = await api.get('/admin/analytics/user-registrations', {
        params: { timeRange }
      });
      
      if (userRegResponse.data.success) {
        setUserRegistrationData({
          labels: userRegResponse.data.data.labels,
          datasets: [{
            label: 'New Users',
            data: userRegResponse.data.data.values,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        });
      }
      
      // Fetch resources by category
      const categoryResponse = await api.get('/admin/analytics/resources-by-category');
      
      if (categoryResponse.data.success) {
        setResourcesByCategory({
          labels: categoryResponse.data.data.labels,
          datasets: [{
            label: 'Resources',
            data: categoryResponse.data.data.values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              'rgba(153, 102, 255, 0.5)',
              'rgba(255, 159, 64, 0.5)',
            ],
            borderWidth: 1
          }]
        });
      }
      
      // Fetch activity by day
      const activityResponse = await api.get('/admin/analytics/activity', {
        params: { timeRange }
      });
      
      if (activityResponse.data.success) {
        setActivityByDay({
          labels: activityResponse.data.data.labels,
          datasets: [
            {
              label: 'Resource Submissions',
              data: activityResponse.data.data.resources,
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
              label: 'User Logins',
              data: activityResponse.data.data.logins,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
            {
              label: 'Votes',
              data: activityResponse.data.data.votes,
              backgroundColor: 'rgba(255, 206, 86, 0.5)',
            }
          ]
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when time range changes
  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  // Create stat cards
  const statCards: StatCard[] = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <UsersIcon fontSize="large" color="primary" />,
      description: 'Total registered users'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: <UsersIcon fontSize="large" color="secondary" />,
      description: `Active in the last ${timeRange}`
    },
    {
      title: 'Total Resources',
      value: stats.totalResources,
      icon: <ResourcesIcon fontSize="large" color="primary" />,
      description: 'Total resources submitted'
    },
    {
      title: 'Pending Resources',
      value: stats.pendingResources,
      icon: <ResourcesIcon fontSize="large" color="warning" />,
      description: 'Resources pending approval'
    },
    {
      title: 'Categories',
      value: stats.totalCategories,
      icon: <CategoryIcon fontSize="large" color="primary" />,
      description: 'Number of categories'
    },
    {
      title: 'Total Votes',
      value: stats.totalVotes,
      icon: <VoteIcon fontSize="large" color="primary" />,
      description: 'Total resource votes'
    }
  ];

  // Chart options
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'User Registration Over Time',
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Activity By Day',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Resources By Category',
      },
    },
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Analytics Dashboard
        </Typography>
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="time-range-select-label">Time Range</InputLabel>
          <Select
            labelId="time-range-select-label"
            value={timeRange}
            label="Time Range"
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="7d">Last 7 Days</MenuItem>
            <MenuItem value="30d">Last 30 Days</MenuItem>
            <MenuItem value="90d">Last 90 Days</MenuItem>
            <MenuItem value="all">All Time</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  {card.icon}
                  <Typography variant="h6" component="div">
                    {card.title}
                  </Typography>
                </Stack>
                <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                  {card.value.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Line options={lineOptions} data={userRegistrationData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Pie options={pieOptions} data={resourcesByCategory} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Bar options={barOptions} data={activityByDay} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard; 