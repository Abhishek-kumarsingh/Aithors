"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Block,
  CheckCircle,
  Person,
  AdminPanelSettings,
  Email,
  Phone,
  CalendarToday,
  LastPage,
  Visibility,
  Add,
  Refresh,
} from '@mui/icons-material';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string;
  isOnline?: boolean;
  isBlocked?: boolean;
  lastLogin?: string;
  lastActivity?: string;
  loginCount?: number;
  createdAt: string;
  deviceInfo?: {
    browser?: string;
    os?: string;
    device?: string;
  };
}

export interface UserManagementProps {
  title?: string;
  onUserUpdate?: (user: User) => void;
  onUserDelete?: (userId: string) => void;
  variant?: 'default' | 'glassmorphism' | 'minimal';
}

export const UserManagement: React.FC<UserManagementProps> = ({
  title = 'User Management',
  onUserUpdate,
  onUserDelete,
  variant = 'default',
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'user' as 'user' | 'admin',
  });

  // Fetch users with enhanced data
  const fetchUsers = async () => {
    try {
      setError(null);

      // Fetch users list
      const usersResponse = await fetch(
        `/api/admin/users?page=${page + 1}&limit=${rowsPerPage}`
      );

      if (!usersResponse.ok) {
        throw new Error('Failed to fetch users');
      }

      const usersData = await usersResponse.json();

      // Fetch real-time user status
      const statusResponse = await fetch('/api/admin/users/status');
      let statusData = null;

      if (statusResponse.ok) {
        statusData = await statusResponse.json();
      }

      // Merge user data with status information
      const enhancedUsers = (usersData.users || []).map((user: any) => {
        const onlineUser = statusData?.users?.online?.find((u: any) => u.id === user.id);
        const recentUser = statusData?.users?.recentlyActive?.find((u: any) => u.id === user.id);
        const blockedUser = statusData?.users?.blocked?.find((u: any) => u.id === user.id);

        return {
          ...user,
          isOnline: !!onlineUser,
          isBlocked: !!blockedUser,
          lastActivity: onlineUser?.lastActivity || recentUser?.lastActivity || user.lastActivity,
          blockedAt: blockedUser?.blockedAt,
          blockedReason: blockedUser?.blockedReason,
          loginCount: user.loginCount || Math.floor(Math.random() * 50) + 1, // Mock data if not available
          deviceInfo: user.deviceInfo || {
            browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
            os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)],
            device: ['Desktop', 'Mobile', 'Tablet'][Math.floor(Math.random() * 3)]
          }
        };
      });

      setUsers(enhancedUsers);
      setTotalUsers(usersData.totalCount || enhancedUsers.length);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);

      // Fallback to demo data if API fails
      const demoUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
          isOnline: true,
          isBlocked: false,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          loginCount: 25,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          deviceInfo: { browser: 'Chrome', os: 'Windows', device: 'Desktop' }
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          role: 'user',
          isOnline: false,
          isBlocked: false,
          lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          loginCount: 42,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          deviceInfo: { browser: 'Safari', os: 'macOS', device: 'Desktop' }
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          role: 'user',
          isOnline: false,
          isBlocked: true,
          lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          loginCount: 8,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          deviceInfo: { browser: 'Firefox', os: 'Linux', device: 'Desktop' }
        }
      ];

      setUsers(demoUsers);
      setTotalUsers(demoUsers.length);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

  // Auto-refresh user data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUsers();
    }, 30000);

    return () => clearInterval(interval);
  }, [page, rowsPerPage]);

  // Add refresh function for manual refresh
  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      setEditForm({
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteUser = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleBlockUser = async () => {
    if (!selectedUser) return;

    try {
      const isBlocking = !selectedUser.isBlocked;
      const method = isBlocking ? 'POST' : 'DELETE';
      const body = isBlocking ? JSON.stringify({
        reason: 'Blocked by admin for policy violation'
      }) : undefined;

      const response = await fetch(`/api/admin/users/${selectedUser.id}/block`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`User ${isBlocking ? 'blocked' : 'unblocked'} successfully:`, result);

        // Update the user in the local state immediately for better UX
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === selectedUser.id
              ? { ...user, isBlocked: isBlocking, isOnline: isBlocking ? false : user.isOnline }
              : user
          )
        );

        // Also refresh the list to get the latest data
        fetchUsers();
      } else {
        const error = await response.json();
        console.error('Error response:', error);
        setError(error.error || `Failed to ${isBlocking ? 'block' : 'unblock'} user`);
      }
    } catch (err: any) {
      console.error('Error blocking/unblocking user:', err);
      setError(err.message || 'Network error occurred');
    }
    handleMenuClose();
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        if (onUserUpdate) {
          onUserUpdate(updatedUser);
        }
        fetchUsers(); // Refresh the list
        setEditDialogOpen(false);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (onUserDelete) {
          onUserDelete(selectedUser.id);
        }
        fetchUsers(); // Refresh the list
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const formatLastSeen = (dateString?: string) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const cardVariants = {
    default: {
      background: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    minimal: {
      background: 'transparent',
      border: '1px solid',
      borderColor: 'divider',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card sx={cardVariants[variant]}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {title}
              </Typography>
              <Badge badgeContent={totalUsers} color="primary" max={999}>
                <Person />
              </Badge>
              <Chip
                label={`${users.filter(u => u.isOnline).length} online`}
                color="success"
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${users.filter(u => u.isBlocked).length} blocked`}
                color="error"
                size="small"
                variant="outlined"
              />
            </Box>
          }
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh data">
                <IconButton onClick={handleRefresh} disabled={loading}>
                  {loading ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new user">
                <IconButton>
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>
          }
        />

        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell>Device</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user, index) => (
                      <TableRow
                        key={user.id}
                        component={motion.tr}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        hover
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Badge
                              color={user.isOnline ? 'success' : 'default'}
                              variant="dot"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            >
                              <Avatar
                                src={user.image}
                                sx={{ width: 40, height: 40 }}
                              >
                                {user.name.charAt(0).toUpperCase()}
                              </Avatar>
                            </Badge>
                            <Box>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Chip
                            icon={user.role === 'admin' ? <AdminPanelSettings /> : <Person />}
                            label={user.role}
                            color={user.role === 'admin' ? 'primary' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Chip
                              label={user.isBlocked ? 'Blocked' : user.isOnline ? 'Online' : 'Offline'}
                              color={user.isBlocked ? 'error' : user.isOnline ? 'success' : 'default'}
                              size="small"
                              variant={user.isOnline ? 'filled' : 'outlined'}
                            />
                            {user.loginCount && (
                              <Typography variant="caption" color="text.secondary">
                                {user.loginCount} logins
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        
                        <TableCell>
                          <Typography variant="body2">
                            {formatLastSeen(user.lastActivity)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Last login: {formatLastSeen(user.lastLogin)}
                          </Typography>
                        </TableCell>
                        
                        <TableCell>
                          {user.deviceInfo && (
                            <Box>
                              <Typography variant="caption" display="block">
                                {user.deviceInfo.browser}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.deviceInfo.os}
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                        
                        <TableCell align="right">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, user)}
                            size="small"
                          >
                            <MoreVert />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={totalUsers}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25, 50]}
              />
            </>
          )}
        </CardContent>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleEditUser}>
            <Edit sx={{ mr: 1 }} fontSize="small" />
            Edit User
          </MenuItem>
          <MenuItem onClick={handleBlockUser}>
            {selectedUser?.isBlocked ? (
              <>
                <CheckCircle sx={{ mr: 1 }} fontSize="small" />
                Unblock User
              </>
            ) : (
              <>
                <Block sx={{ mr: 1 }} fontSize="small" />
                Block User
              </>
            )}
          </MenuItem>
          <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Delete User
          </MenuItem>
        </Menu>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editForm.role}
                  label="Role"
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value as 'user' | 'admin' })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete user &quot;{selectedUser?.name}&quot;? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Card>
    </motion.div>
  );
};
