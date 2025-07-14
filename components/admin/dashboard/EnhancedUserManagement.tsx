"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  Badge,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  Person,
  AdminPanelSettings,
  Block,
  CheckCircle,
  Edit,
  Delete,
  Visibility,
  PersonAdd,
  Search,
  FilterList,
  Refresh,
  Computer,
  Phone,
  Email,
  CalendarToday,
  TrendingUp,
  Warning,
  Security,
  Close,
} from '@mui/icons-material';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isOnline: boolean;
  isBlocked: boolean;
  avatar?: string;
  lastActivity: string;
  lastLogin: string;
  joinDate: string;
  loginCount: number;
  deviceInfo: {
    browser: string;
    os: string;
    device: string;
    ip?: string;
  };
  stats: {
    interviewsCompleted: number;
    chatSessions: number;
    questionsAnswered: number;
    averageScore: number;
  };
}

interface EnhancedUserManagementProps {
  onUserUpdate?: (user: User) => void;
  onUserDelete?: (userId: string) => void;
}

export const EnhancedUserManagement: React.FC<EnhancedUserManagementProps> = ({
  onUserUpdate,
  onUserDelete,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'user' | 'admin'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'online' | 'offline' | 'blocked'>('all');

  const fetchUsers = async () => {
    try {
      setError(null);
      
      // Fetch users from API
      const response = await fetch('/api/admin/users?limit=100');
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
      
      // Fallback to demo data
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          isOnline: true,
          isBlocked: false,
          lastActivity: '2 minutes ago',
          lastLogin: '2024-01-15T10:30:00Z',
          joinDate: '2024-01-01T00:00:00Z',
          loginCount: 45,
          deviceInfo: {
            browser: 'Chrome',
            os: 'Windows',
            device: 'Desktop',
            ip: '192.168.1.100'
          },
          stats: {
            interviewsCompleted: 12,
            chatSessions: 28,
            questionsAnswered: 156,
            averageScore: 85
          }
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          isOnline: false,
          isBlocked: false,
          lastActivity: '1 hour ago',
          lastLogin: '2024-01-14T15:45:00Z',
          joinDate: '2023-12-15T00:00:00Z',
          loginCount: 78,
          deviceInfo: {
            browser: 'Safari',
            os: 'macOS',
            device: 'Desktop',
            ip: '192.168.1.101'
          },
          stats: {
            interviewsCompleted: 25,
            chatSessions: 52,
            questionsAnswered: 298,
            averageScore: 92
          }
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'user',
          isOnline: false,
          isBlocked: true,
          lastActivity: '2 days ago',
          lastLogin: '2024-01-12T09:20:00Z',
          joinDate: '2024-01-05T00:00:00Z',
          loginCount: 15,
          deviceInfo: {
            browser: 'Firefox',
            os: 'Linux',
            device: 'Desktop',
            ip: '192.168.1.102'
          },
          stats: {
            interviewsCompleted: 3,
            chatSessions: 8,
            questionsAnswered: 45,
            averageScore: 65
          }
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          role: 'admin',
          isOnline: true,
          isBlocked: false,
          lastActivity: '5 minutes ago',
          lastLogin: '2024-01-15T08:00:00Z',
          joinDate: '2023-11-01T00:00:00Z',
          loginCount: 120,
          deviceInfo: {
            browser: 'Chrome',
            os: 'Windows',
            device: 'Desktop',
            ip: '192.168.1.103'
          },
          stats: {
            interviewsCompleted: 0,
            chatSessions: 5,
            questionsAnswered: 0,
            averageScore: 0
          }
        }
      ];
      
      setUsers(demoUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUserAction = async (userId: string, action: 'block' | 'unblock' | 'view' | 'edit' | 'delete') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    switch (action) {
      case 'block':
      case 'unblock':
        try {
          const method = action === 'block' ? 'POST' : 'DELETE';
          const response = await fetch(`/api/admin/users/${userId}/block`, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: action === 'block' ? JSON.stringify({ reason: 'Blocked by admin' }) : undefined,
          });

          if (response.ok) {
            setUsers(prevUsers =>
              prevUsers.map(u =>
                u.id === userId
                  ? { ...u, isBlocked: action === 'block', isOnline: action === 'block' ? false : u.isOnline }
                  : u
              )
            );
          }
        } catch (err) {
          console.error(`Error ${action}ing user:`, err);
        }
        break;
      case 'view':
        setSelectedUser(user);
        setProfileDialogOpen(true);
        break;
      case 'edit':
        setSelectedUser(user);
        setEditDialogOpen(true);
        break;
      case 'delete':
        if (user.role !== 'admin') {
          try {
            const response = await fetch(`/api/admin/users/${userId}`, {
              method: 'DELETE',
            });

            if (response.ok) {
              setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
              if (onUserDelete) onUserDelete(userId);
            }
          } catch (err) {
            console.error('Error deleting user:', err);
          }
        }
        break;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' ||
                         (filterStatus === 'online' && user.isOnline) ||
                         (filterStatus === 'offline' && !user.isOnline && !user.isBlocked) ||
                         (filterStatus === 'blocked' && user.isBlocked);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const userStats = {
    total: users.length,
    online: users.filter(u => u.isOnline).length,
    blocked: users.filter(u => u.isBlocked).length,
    admins: users.filter(u => u.role === 'admin').length,
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* User Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {userStats.total}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {userStats.online}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Online Now
                  </Typography>
                </Box>
                <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {userStats.blocked}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Blocked Users
                  </Typography>
                </Box>
                <Block sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {userStats.admins}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Administrators
                  </Typography>
                </Box>
                <AdminPanelSettings sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main User Management Card */}
      <Card>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                User Management
              </Typography>
              <Badge badgeContent={filteredUsers.length} color="primary" max={999}>
                <Person />
              </Badge>
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh">
                <IconButton onClick={fetchUsers} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => setAddUserDialogOpen(true)}
              >
                Add User
              </Button>
            </Box>
          }
        />

        <CardContent>
          {/* Search and Filters */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={filterRole}
                label="Role"
                onChange={(e) => setFilterRole(e.target.value as any)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                <MenuItem value="user">Users</MenuItem>
                <MenuItem value="admin">Admins</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                label="Status"
                onChange={(e) => setFilterStatus(e.target.value as any)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="online">Online</MenuItem>
                <MenuItem value="offline">Offline</MenuItem>
                <MenuItem value="blocked">Blocked</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Users List */}
          <List>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ListItem divider>
                  <ListItemAvatar>
                    <Badge
                      color={user.isOnline ? 'success' : 'default'}
                      variant="dot"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                      <Avatar sx={{ 
                        bgcolor: user.isBlocked ? 'error.main' : 
                                user.role === 'admin' ? 'primary.main' : 'success.main' 
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        {user.role === 'admin' && (
                          <Chip icon={<AdminPanelSettings />} label="Admin" size="small" color="primary" />
                        )}
                        {user.isOnline && (
                          <Chip label="Online" size="small" color="success" />
                        )}
                        {user.isBlocked && (
                          <Chip icon={<Block />} label="Blocked" size="small" color="error" />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {user.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Last active: {user.lastActivity} • {user.loginCount} logins • {user.deviceInfo.browser} on {user.deviceInfo.os}
                        </Typography>
                      </Box>
                    }
                  />
                  
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="View Profile">
                        <IconButton size="small" onClick={() => handleUserAction(user.id, 'view')}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleUserAction(user.id, 'edit')}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={user.isBlocked ? "Unblock User" : "Block User"}>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUserAction(user.id, user.isBlocked ? 'unblock' : 'block')}
                          color={user.isBlocked ? "success" : "warning"}
                        >
                          {user.isBlocked ? <CheckCircle /> : <Block />}
                        </IconButton>
                      </Tooltip>
                      {user.role !== 'admin' && (
                        <Tooltip title="Delete User">
                          <IconButton 
                            size="small" 
                            onClick={() => handleUserAction(user.id, 'delete')} 
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              </motion.div>
            ))}
          </List>

          {filteredUsers.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                No users found matching your criteria
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={profileDialogOpen} onClose={() => setProfileDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          User Profile
          <IconButton onClick={() => setProfileDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Avatar sx={{
                  width: 100,
                  height: 100,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: selectedUser.isBlocked ? 'error.main' :
                          selectedUser.role === 'admin' ? 'primary.main' : 'success.main',
                  fontSize: '2.5rem'
                }}>
                  {selectedUser.name.charAt(0)}
                </Avatar>

                <Typography variant="h4" sx={{ mb: 1 }}>
                  {selectedUser.name}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                  <Chip
                    icon={selectedUser.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                    label={selectedUser.role}
                    color={selectedUser.role === 'admin' ? 'primary' : 'default'}
                  />
                  <Chip
                    label={selectedUser.isOnline ? 'Online' : 'Offline'}
                    color={selectedUser.isOnline ? 'success' : 'default'}
                  />
                  {selectedUser.isBlocked && (
                    <Chip icon={<Block />} label="Blocked" color="error" />
                  )}
                </Box>
              </Box>

              <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Basic Info" />
                <Tab label="Activity" />
                <Tab label="Statistics" />
                <Tab label="Device Info" />
              </Tabs>

              {currentTab === 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Email color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{selectedUser.email}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarToday color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Join Date</Typography>
                      <Typography variant="body1">
                        {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Security color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Account Status</Typography>
                      <Typography variant="body1">
                        {selectedUser.isBlocked ? 'Blocked' : 'Active'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              {currentTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Activity</Typography>
                    <Typography variant="body1">{selectedUser.lastActivity}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Last Login</Typography>
                    <Typography variant="body1">
                      {new Date(selectedUser.lastLogin).toLocaleString()}
                    </Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="body2" color="text.secondary">Total Logins</Typography>
                    <Typography variant="body1">{selectedUser.loginCount}</Typography>
                  </Box>
                </Box>
              )}

              {currentTab === 2 && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary.main">
                          {selectedUser.stats.interviewsCompleted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Interviews Completed
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main">
                          {selectedUser.stats.chatSessions}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Chat Sessions
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="info.main">
                          {selectedUser.stats.questionsAnswered}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Questions Answered
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main">
                          {selectedUser.stats.averageScore}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Score
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {currentTab === 3 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Computer color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Browser</Typography>
                      <Typography variant="body1">{selectedUser.deviceInfo.browser}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Computer color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Operating System</Typography>
                      <Typography variant="body1">{selectedUser.deviceInfo.os}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Phone color="primary" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">Device Type</Typography>
                      <Typography variant="body1">{selectedUser.deviceInfo.device}</Typography>
                    </Box>
                  </Box>
                  {selectedUser.deviceInfo.ip && (
                    <>
                      <Divider />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Security color="primary" />
                        <Box>
                          <Typography variant="body2" color="text.secondary">IP Address</Typography>
                          <Typography variant="body1">{selectedUser.deviceInfo.ip}</Typography>
                        </Box>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProfileDialogOpen(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              setProfileDialogOpen(false);
              setEditDialogOpen(true);
            }}
          >
            Edit User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Name"
                defaultValue={selectedUser.name}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                defaultValue={selectedUser.email}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  defaultValue={selectedUser.role}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                control={<Switch defaultChecked={!selectedUser.isBlocked} />}
                label="Account Active"
              />
              <FormControlLabel
                control={<Switch defaultChecked={selectedUser.isOnline} />}
                label="Force Online Status"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setEditDialogOpen(false)}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addUserDialogOpen} onClose={() => setAddUserDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Name"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                defaultValue="user"
                label="Role"
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send Welcome Email"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddUserDialogOpen(false)}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
