"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Box,
  Grid,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  People,
  PersonAdd,
  TrendingUp,
  Security,
  Computer,
  Refresh,
} from '@mui/icons-material';

import { ModernStatsCard } from '@/components/admin/dashboard/ModernStatsCard';
import { ModernChartCard } from '@/components/admin/dashboard/ModernChartCard';
import { UserManagement } from '@/components/admin/dashboard/UserManagement';

interface UserStats {
  totalUsers: number;
  onlineUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  blockedUsers: number;
  adminUsers: number;
  userGrowthRate: number;
  loginActivity: Array<{
    date: string;
    logins: number;
  }>;
  deviceStats: Array<{
    device: string;
    count: number;
  }>;
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      setError(null);
      
      const response = await fetch('/api/admin/users/status');
      if (!response.ok) throw new Error('Failed to fetch user statistics');
      
      const data = await response.json();
      
      // Transform the data to match our interface
      const stats: UserStats = {
        totalUsers: data.summary.totalUsers,
        onlineUsers: data.summary.totalOnline,
        newUsersToday: 0, // This would come from analytics
        newUsersThisWeek: 0, // This would come from analytics
        blockedUsers: data.summary.totalBlocked,
        adminUsers: 0, // Calculate from user data
        userGrowthRate: 0, // Calculate from historical data
        loginActivity: data.loginActivity?.map((item: any) => ({
          date: new Date(item._id).toLocaleDateString(),
          logins: item.count
        })) || [],
        deviceStats: data.deviceStats?.map((item: any) => ({
          device: `${item._id.browser} (${item._id.os})`,
          count: item.count
        })) || []
      };
      
      setUserStats(stats);
      
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchUserStats();
    }
  }, [status, session]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserStats();
  };

  if (status === 'loading' || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <People sx={{ fontSize: 60, color: 'primary.main' }} />
        </motion.div>
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (session?.user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">
          Access denied. Admin privileges required.
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Tooltip title="Retry">
              <Fab 
                size="small" 
                color="primary" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                {refreshing ? <CircularProgress size={20} /> : <Refresh />}
              </Fab>
            </Tooltip>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        p: 3,
      }}
    >
      <Container maxWidth="xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1,
              }}
            >
              User Management 👥
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
              Manage users, monitor activity, and control access
            </Typography>
          </Box>

          {/* Stats Cards */}
          {userStats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Total Users"
                  value={userStats.totalUsers.toLocaleString()}
                  subtitle={`${userStats.newUsersToday} new today`}
                  icon={<People />}
                  color="primary"
                  trend={{
                    value: userStats.userGrowthRate,
                    direction: userStats.userGrowthRate >= 0 ? 'up' : 'down',
                    label: 'vs last week'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Online Users"
                  value={userStats.onlineUsers.toLocaleString()}
                  subtitle="Currently active"
                  icon={<Computer />}
                  color="success"
                  progress={{
                    value: userStats.onlineUsers,
                    max: userStats.totalUsers,
                    label: 'Activity Rate'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Admin Users"
                  value={userStats.adminUsers.toLocaleString()}
                  subtitle="System administrators"
                  icon={<Security />}
                  color="warning"
                  badge={{
                    label: 'Privileged',
                    color: 'warning'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Blocked Users"
                  value={userStats.blockedUsers.toLocaleString()}
                  subtitle="Restricted accounts"
                  icon={<Security />}
                  color="error"
                  badge={{
                    label: userStats.blockedUsers > 0 ? 'Action Required' : 'All Clear',
                    color: userStats.blockedUsers > 0 ? 'error' : 'success'
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Charts */}
          {userStats && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ModernChartCard
                  title="Login Activity"
                  subtitle="Daily user logins"
                  data={userStats.loginActivity}
                  chartType="area"
                  dataKey="logins"
                  xAxisKey="date"
                  color="#3b82f6"
                  height={300}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ModernChartCard
                  title="Device Distribution"
                  subtitle="User devices and browsers"
                  data={userStats.deviceStats}
                  chartType="pie"
                  dataKey="count"
                  xAxisKey="device"
                  height={300}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                />
              </Grid>
            </Grid>
          )}

          {/* User Management Table */}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <UserManagement
                title="All Users"
                onUserUpdate={(user) => {
                  console.log('User updated:', user);
                  // Refresh stats after user update
                  fetchUserStats();
                }}
                onUserDelete={(userId) => {
                  console.log('User deleted:', userId);
                  // Refresh stats after user deletion
                  fetchUserStats();
                }}
              />
            </Grid>
          </Grid>

          {/* Floating Action Buttons */}
          <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Fab
              color="secondary"
              size="medium"
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <PersonAdd />
            </Fab>
            
            <Fab
              color="primary"
              onClick={handleRefresh}
              disabled={refreshing}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              {refreshing ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
            </Fab>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
