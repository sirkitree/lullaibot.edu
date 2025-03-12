import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tabs,
  Tab,
  Chip,
  Link,
  Card,
  CardContent,
  CardMedia,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../utils/api';

interface Resource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string; 
  tags: string[];
  submittedBy: {
    id: string;
    name: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  upvotes: number;
}

interface Props {
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

const ContentModeration: React.FC<Props> = ({ setError, setLoading }) => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalResources, setTotalResources] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: [] as string[],
    status: 'pending' as 'pending' | 'approved' | 'rejected'
  });

  // Get filter status based on tab
  const getFilterStatus = (): string => {
    switch (tabValue) {
      case 0: return ''; // All
      case 1: return 'pending';
      case 2: return 'approved';
      case 3: return 'rejected';
      default: return '';
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    let isLoading = false;
    let isMounted = true;
    
    const loadResources = async () => {
      // Prevent loading if we're already loading
      if (isLoading) return;
      
      try {
        isLoading = true;
        setLoading(true);
        const status = getFilterStatus();
        
        const response = await api.get('/admin/resources', {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search: searchTerm,
            status
          }
        });
        
        // Only update state if component is still mounted
        if (isMounted && response.data.success) {
          setResources(response.data.data);
          setTotalResources(response.data.total);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.response?.data?.message || 'Failed to fetch resources');
          console.error('Error fetching resources:', err);
        }
      } finally {
        if (isMounted) {
          isLoading = false;
          setLoading(false);
        }
      }
    };

    loadResources();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, rowsPerPage, searchTerm, tabValue]);

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Open edit dialog
  const handleEditClick = (resource: Resource) => {
    setSelectedResource(resource);
    setEditFormData({
      title: resource.title,
      url: resource.url,
      description: resource.description,
      category: resource.category,
      tags: resource.tags,
      status: resource.status
    });
    setEditDialogOpen(true);
  };

  // Open delete dialog
  const handleDeleteClick = (resource: Resource) => {
    setSelectedResource(resource);
    setDeleteDialogOpen(true);
  };

  // Handle approve resource
  const handleApprove = async (resource: Resource) => {
    try {
      setLoading(true);
      const response = await api.patch(`/admin/resources/${resource.id}/status`, {
        status: 'approved'
      });
      
      if (response.data.success) {
        // Update local state
        setResources(resources.map(r => 
          r.id === resource.id ? { ...r, status: 'approved' } : r
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve resource');
      console.error('Error approving resource:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle reject resource
  const handleReject = async (resource: Resource) => {
    try {
      setLoading(true);
      const response = await api.patch(`/admin/resources/${resource.id}/status`, {
        status: 'rejected'
      });
      
      if (response.data.success) {
        // Update local state
        setResources(resources.map(r => 
          r.id === resource.id ? { ...r, status: 'rejected' } : r
        ));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reject resource');
      console.error('Error rejecting resource:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit form change
  const handleEditFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle category/status change in select
  const handleSelectChange = (event: any) => {
    const { name, value } = event.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit resource edit
  const handleEditSubmit = async () => {
    if (!selectedResource) return;
    
    try {
      setLoading(true);
      const response = await api.put(`/admin/resources/${selectedResource.id}`, editFormData);
      
      if (response.data.success) {
        // Update local state
        setResources(resources.map(resource => 
          resource.id === selectedResource.id ? { ...resource, ...editFormData } : resource
        ));
        setEditDialogOpen(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update resource');
      console.error('Error updating resource:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit resource delete
  const handleDeleteSubmit = async () => {
    if (!selectedResource) return;
    
    try {
      setLoading(true);
      const response = await api.delete(`/admin/resources/${selectedResource.id}`);
      
      if (response.data.success) {
        // Update local state
        setResources(resources.filter(resource => resource.id !== selectedResource.id));
        setDeleteDialogOpen(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete resource');
      console.error('Error deleting resource:', err);
    } finally {
      setLoading(false);
    }
  };

  // Render status chip
  const renderStatusChip = (status: string) => {
    switch (status) {
      case 'pending':
        return <Chip label="Pending" color="warning" size="small" />;
      case 'approved':
        return <Chip label="Approved" color="success" size="small" />;
      case 'rejected':
        return <Chip label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Fetch resources from API (for manual refreshes)
  const fetchResources = async () => {
    try {
      const status = getFilterStatus();
      
      const response = await api.get('/admin/resources', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          status
        }
      });
      
      if (response.data.success) {
        setResources(response.data.data);
        setTotalResources(response.data.total);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch resources');
      console.error('Error fetching resources:', err);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Content Moderation
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => fetchResources()}
          >
            Refresh
          </Button>
          <TextField
            label="Search Resources"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="moderation tabs">
          <Tab label="All" />
          <Tab label="Pending" />
          <Tab label="Approved" />
          <Tab label="Rejected" />
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {resources.map((resource) => (
          <Grid item xs={12} md={6} lg={4} key={resource.id}>
            <Card>
              {resource.thumbnail && (
                <CardMedia
                  component="img"
                  height="140"
                  image={resource.thumbnail}
                  alt={resource.title}
                />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="div" noWrap>
                    {resource.title}
                  </Typography>
                  {renderStatusChip(resource.status)}
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  <Link href={resource.url} target="_blank" rel="noopener noreferrer">
                    {resource.url}
                  </Link>
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {resource.description.length > 100 
                    ? `${resource.description.substring(0, 100)}...` 
                    : resource.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                  {resource.tags.map(tag => (
                    <Chip 
                      key={tag} 
                      label={tag} 
                      size="small" 
                      variant="outlined"
                    />
                  ))}
                </Box>
                
                <Typography variant="caption" display="block">
                  Submitted by {resource.submittedBy.name} on {new Date(resource.createdAt).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  {resource.status === 'pending' && (
                    <>
                      <IconButton 
                        color="success" 
                        onClick={() => handleApprove(resource)}
                        size="small"
                        aria-label="approve"
                      >
                        <ApproveIcon />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => handleReject(resource)}
                        size="small"
                        aria-label="reject"
                      >
                        <RejectIcon />
                      </IconButton>
                    </>
                  )}
                  <IconButton 
                    color="primary" 
                    onClick={() => handleEditClick(resource)}
                    size="small"
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDeleteClick(resource)}
                    size="small"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ mt: 3 }}>
        <TablePagination
          rowsPerPageOptions={[6, 12, 24]}
          component="div"
          count={totalResources}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Edit Resource Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Resource</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editFormData.title}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="url"
            label="URL"
            type="url"
            fullWidth
            variant="outlined"
            value={editFormData.url}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={editFormData.description}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  name="category"
                  value={editFormData.category}
                  label="Category"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="Beginner Resources">Beginner Resources</MenuItem>
                  <MenuItem value="Intermediate Resources">Intermediate Resources</MenuItem>
                  <MenuItem value="Advanced Resources">Advanced Resources</MenuItem>
                  <MenuItem value="Documentation">Documentation</MenuItem>
                  <MenuItem value="Tools">Tools</MenuItem>
                  <MenuItem value="Tutorials">Tutorials</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="status"
                  value={editFormData.status}
                  label="Status"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField
            margin="dense"
            name="tags"
            label="Tags (comma separated)"
            fullWidth
            variant="outlined"
            value={editFormData.tags.join(', ')}
            onChange={(e) => {
              const tagsArray = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
              setEditFormData(prev => ({ ...prev, tags: tagsArray }));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Resource Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Resource</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedResource?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteSubmit} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentModeration; 