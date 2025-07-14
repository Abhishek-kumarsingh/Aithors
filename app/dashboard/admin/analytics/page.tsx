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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Analytics,
  TrendingUp,
  People,
  Assessment,
  Speed,
  Refresh,
  DateRange,
} from '@mui/icons-material';

import { ModernStatsCard } from '@/components/admin/dashboard/ModernStatsCard';
import { ModernChartCard } from '@/components/admin/dashboard/ModernChartCard';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    activeUsers: number;
    totalInterviews: number;
    averageScore: number;
    growth: {
      users: number;
      interviews: number;
      activity: number;
    };
  };
  analytics: Array<{
    date: string;
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    totalInterviews: number;
    completedInterviews: number;
    averageScore: number;
    averageDuration: number;
  }>;
  skills: Array<{
    skill: string;
    count: number;
    averageScore: number;
  }>;
  engagement: Array<{
    date: string;
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    avgSessionDuration: number;
  }>;
  performance: Array<{
    date: string;
    responseTime: number;
    errorRate: number;
    uptime: number;
  }>;
}

export default function AdminAnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState('7d');

  // Redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      
      // Fetch overview analytics
      const overviewResponse = await fetch(`/api/dashboard/analytics?type=overview&range=${timeRange}`);
      if (!overviewResponse.ok) throw new Error('Failed to fetch overview analytics');
      const overviewData = await overviewResponse.json();

      // Fetch skills analytics
      const skillsResponse = await fetch(`/api/dashboard/analytics?type=skills&range=${timeRange}`);
      if (!skillsResponse.ok) throw new Error('Failed to fetch skills analytics');
      const skillsData = await skillsResponse.json();

      // Fetch engagement analytics
      const engagementResponse = await fetch(`/api/dashboard/analytics?type=engagement&range=${timeRange}`);
      if (!engagementResponse.ok) throw new Error('Failed to fetch engagement analytics');
      const engagementData = await engagementResponse.json();

      // Fetch performance analytics
      const performanceResponse = await fetch(`/api/dashboard/analytics?type=performance&range=${timeRange}`);
      if (!performanceResponse.ok) throw new Error('Failed to fetch performance analytics');
      const performanceData = await performanceResponse.json();

      const combinedData: AnalyticsData = {
        overview: overviewData.summary,
        analytics: overviewData.analytics,
        skills: skillsData.skills || [],
        engagement: engagementData.engagement || [],
        performance: performanceData.performance || []
      };

      setAnalyticsData(combinedData);
      
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchAnalyticsData();
    }
  }, [status, session, timeRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAnalyticsData();
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
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
          <Analytics sx={{ fontSize: 60, color: 'primary.main' }} />
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
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
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
                Analytics Dashboard 📊
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                Comprehensive system analytics and insights
              </Typography>
            </Box>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Time Range"
                onChange={handleTimeRangeChange}
              >
                <MenuItem value="24h">Last 24 Hours</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="90d">Last 90 Days</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Overview Stats */}
          {analyticsData && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Total Users"
                  value={analyticsData.overview.totalUsers.toLocaleString()}
                  subtitle="Registered users"
                  icon={<People />}
                  color="primary"
                  trend={{
                    value: analyticsData.overview.growth.users,
                    direction: analyticsData.overview.growth.users >= 0 ? 'up' : 'down',
                    label: 'growth rate'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Active Users"
                  value={analyticsData.overview.activeUsers.toLocaleString()}
                  subtitle="Recently active"
                  icon={<TrendingUp />}
                  color="success"
                  trend={{
                    value: analyticsData.overview.growth.activity,
                    direction: analyticsData.overview.growth.activity >= 0 ? 'up' : 'down',
                    label: 'activity rate'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Total Interviews"
                  value={analyticsData.overview.totalInterviews.toLocaleString()}
                  subtitle="All time"
                  icon={<Assessment />}
                  color="info"
                  trend={{
                    value: analyticsData.overview.growth.interviews,
                    direction: analyticsData.overview.growth.interviews >= 0 ? 'up' : 'down',
                    label: 'interview growth'
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <ModernStatsCard
                  title="Average Score"
                  value={`${analyticsData.overview.averageScore.toFixed(1)}%`}
                  subtitle="Interview performance"
                  icon={<Speed />}
                  color="warning"
                  progress={{
                    value: analyticsData.overview.averageScore,
                    max: 100,
                    label: 'Performance'
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* Main Charts */}
          {analyticsData && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, lg: 8 }}>
                <ModernChartCard
                  title="User Growth Trend"
                  subtitle="Daily user statistics over time"
                  data={analyticsData.analytics.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    total: item.totalUsers,
                    active: item.activeUsers,
                    new: item.newUsers
                  }))}
                  chartType="area"
                  dataKey="total"
                  xAxisKey="date"
                  color="#3b82f6"
                  height={350}
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 4 }}>
                <ModernChartCard
                  title="Top Skills"
                  subtitle="Most practiced skills"
                  data={analyticsData.skills.slice(0, 5)}
                  chartType="donut"
                  dataKey="count"
                  xAxisKey="skill"
                  height={350}
                  colors={['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
                />
              </Grid>
            </Grid>
          )}

          {/* Secondary Charts */}
          {analyticsData && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <ModernChartCard
                  title="Interview Performance"
                  subtitle="Completion rates and scores"
                  data={analyticsData.analytics.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    completed: item.completedInterviews,
                    score: item.averageScore,
                    duration: item.averageDuration
                  }))}
                  chartType="bar"
                  dataKey="completed"
                  xAxisKey="date"
                  color="#10b981"
                  height={300}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <ModernChartCard
                  title="User Engagement"
                  subtitle="Daily, weekly, and monthly active users"
                  data={analyticsData.engagement.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    daily: item.dailyActive,
                    weekly: item.weeklyActive,
                    monthly: item.monthlyActive
                  }))}
                  chartType="line"
                  dataKey="daily"
                  xAxisKey="date"
                  color="#8b5cf6"
                  height={300}
                />
              </Grid>
            </Grid>
          )}

          {/* System Performance */}
          {analyticsData && analyticsData.performance.length > 0 && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12 }}>
                <ModernChartCard
                  title="System Performance"
                  subtitle="Response time, error rate, and uptime"
                  data={analyticsData.performance.map(item => ({
                    date: new Date(item.date).toLocaleDateString(),
                    responseTime: item.responseTime,
                    errorRate: item.errorRate,
                    uptime: item.uptime
                  }))}
                  chartType="line"
                  dataKey="responseTime"
                  xAxisKey="date"
                  color="#f59e0b"
                  height={300}
                />
              </Grid>
            </Grid>
          )}

          {/* Floating Refresh Button */}
          <Fab
            color="primary"
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                transform: 'scale(1.1)',
              },
            }}
          >
            {refreshing ? <CircularProgress size={24} color="inherit" /> : <Refresh />}
          </Fab>
        </motion.div>
      </Container>
    </Box>
  );
}
