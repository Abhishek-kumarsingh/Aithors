"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Chat,
  Quiz,
  Refresh,
  Timeline,
  BarChart,
  ShowChart,
  PieChart,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AnalyticsData {
  userMetrics: {
    daily: Array<{
      date: string;
      usersAdded: number;
      totalUsers: number;
      activeUsers: number;
    }>;
    weekly: Array<{
      week: string;
      usersAdded: number;
      totalUsers: number;
    }>;
    monthly: Array<{
      month: string;
      usersAdded: number;
      totalUsers: number;
    }>;
  };
  chatMetrics: {
    daily: Array<{
      date: string;
      chatsGenerated: number;
      totalChats: number;
      avgDuration: number;
    }>;
  };
  questionMetrics: {
    daily: Array<{
      date: string;
      questionsGenerated: number;
      totalQuestions: number;
      categories: Array<{ name: string; count: number }>;
    }>;
  };
  summary: {
    totalUsers: number;
    totalChats: number;
    totalQuestions: number;
    userGrowthRate: number;
    chatGrowthRate: number;
    questionGrowthRate: number;
  };
}

interface DashboardAnalyticsProps {
  onRefresh?: () => void;
  refreshing?: boolean;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  onRefresh,
  refreshing = false,
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [chartType, setChartType] = useState<'line' | 'area' | 'bar'>('area');

  const fetchAnalyticsData = async () => {
    try {
      setError(null);
      
      // Simulate API calls - replace with real endpoints
      const response = await fetch('/api/dashboard/analytics?range=30d');
      
      if (response.ok) {
        const data = await response.json();

        // Ensure the data structure is complete with fallbacks
        const processedData: AnalyticsData = {
          userMetrics: {
            daily: data.userMetrics?.daily || generateDemoUserData(),
            weekly: data.userMetrics?.weekly || generateDemoWeeklyData(),
            monthly: data.userMetrics?.monthly || generateDemoMonthlyData(),
          },
          chatMetrics: {
            daily: data.chatMetrics?.daily || generateDemoChatData(),
          },
          questionMetrics: {
            daily: data.questionMetrics?.daily || generateDemoQuestionData(),
          },
          summary: {
            totalUsers: data.summary?.totalUsers || 1250,
            totalChats: data.summary?.totalChats || 3420,
            totalQuestions: data.summary?.totalQuestions || 8750,
            userGrowthRate: data.summary?.userGrowthRate || 12.5,
            chatGrowthRate: data.summary?.chatGrowthRate || 18.3,
            questionGrowthRate: data.summary?.questionGrowthRate || 25.7,
          },
        };

        setAnalyticsData(processedData);
      } else {
        throw new Error('Failed to fetch analytics data');
      }
    } catch (err: any) {
      console.error('Error fetching analytics:', err);
      setError(err.message);
      
      // Fallback to demo data
      const demoData: AnalyticsData = {
        userMetrics: {
          daily: generateDemoUserData(),
          weekly: generateDemoWeeklyData(),
          monthly: generateDemoMonthlyData(),
        },
        chatMetrics: {
          daily: generateDemoChatData(),
        },
        questionMetrics: {
          daily: generateDemoQuestionData(),
        },
        summary: {
          totalUsers: 1250,
          totalChats: 3420,
          totalQuestions: 8750,
          userGrowthRate: 12.5,
          chatGrowthRate: 18.3,
          questionGrowthRate: 25.7,
        },
      };

      setAnalyticsData(demoData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize with demo data immediately to prevent undefined errors
    const initialData: AnalyticsData = {
      userMetrics: {
        daily: generateDemoUserData(),
        weekly: generateDemoWeeklyData(),
        monthly: generateDemoMonthlyData(),
      },
      chatMetrics: {
        daily: generateDemoChatData(),
      },
      questionMetrics: {
        daily: generateDemoQuestionData(),
      },
      summary: {
        totalUsers: 1250,
        totalChats: 3420,
        totalQuestions: 8750,
        userGrowthRate: 12.5,
        chatGrowthRate: 18.3,
        questionGrowthRate: 25.7,
      },
    };

    setAnalyticsData(initialData);
    setLoading(false);

    // Then fetch real data
    fetchAnalyticsData();
  }, []);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(fetchAnalyticsData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    fetchAnalyticsData();
    if (onRefresh) onRefresh();
  };

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: 'daily' | 'weekly' | 'monthly' | null,
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  const handleChartTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newChartType: 'line' | 'area' | 'bar' | null,
  ) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  if (loading && !analyticsData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !analyticsData) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const currentData = analyticsData?.userMetrics?.[timeRange] || [];
  const chatData = analyticsData?.chatMetrics?.daily || [];
  const questionData = analyticsData?.questionMetrics?.daily || [];

  const renderChart = (data: any[], dataKey: string, color: string, title: string) => {
    // Ensure data is always an array
    const chartData = Array.isArray(data) && data.length > 0 ? data : [
      { date: new Date().toLocaleDateString(), [dataKey]: 0 }
    ];

    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.6} />
          </AreaChart>
        );
      case 'bar':
        return (
          <RechartsBarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </RechartsBarChart>
        );
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
          </LineChart>
        );
    }
  };

  return (
    <Box>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {analyticsData?.summary?.totalUsers?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Total Users
                    </Typography>
                  </Box>
                  <People sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {(analyticsData?.summary?.userGrowthRate || 0) >= 0 ? (
                    <TrendingUp sx={{ fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16 }} />
                  )}
                  <Typography variant="caption">
                    {analyticsData?.summary?.userGrowthRate || 0}% this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {analyticsData?.summary?.totalChats?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Chats Generated
                    </Typography>
                  </Box>
                  <Chat sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {(analyticsData?.summary?.chatGrowthRate || 0) >= 0 ? (
                    <TrendingUp sx={{ fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16 }} />
                  )}
                  <Typography variant="caption">
                    {analyticsData?.summary?.chatGrowthRate || 0}% this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {analyticsData?.summary?.totalQuestions?.toLocaleString() || '0'}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Questions Generated
                    </Typography>
                  </Box>
                  <Quiz sx={{ fontSize: 40, opacity: 0.8 }} />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  {(analyticsData?.summary?.questionGrowthRate || 0) >= 0 ? (
                    <TrendingUp sx={{ fontSize: 16 }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16 }} />
                  )}
                  <Typography variant="caption">
                    {analyticsData?.summary?.questionGrowthRate || 0}% this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Chart Controls */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="System Analytics"
          action={
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={handleTimeRangeChange}
                size="small"
              >
                <ToggleButton value="daily">Daily</ToggleButton>
                <ToggleButton value="weekly">Weekly</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
              </ToggleButtonGroup>

              <ToggleButtonGroup
                value={chartType}
                exclusive
                onChange={handleChartTypeChange}
                size="small"
              >
                <ToggleButton value="line">
                  <ShowChart />
                </ToggleButton>
                <ToggleButton value="area">
                  <Timeline />
                </ToggleButton>
                <ToggleButton value="bar">
                  <BarChart />
                </ToggleButton>
              </ToggleButtonGroup>

              <Tooltip title="Refresh">
                <IconButton onClick={handleRefresh} disabled={refreshing}>
                  {refreshing ? <CircularProgress size={20} /> : <Refresh />}
                </IconButton>
              </Tooltip>
            </Box>
          }
        />
      </Card>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* User Growth Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="User Growth"
              subheader={`${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} user additions`}
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(currentData, 'usersAdded', '#3b82f6', 'Users Added')}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Chat Generation Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="Chat Generation"
              subheader="Daily chat sessions created"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(chatData, 'chatsGenerated', '#10b981', 'Chats Generated')}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Question Generation Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="Question Generation"
              subheader="Daily questions created"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                {renderChart(questionData, 'questionsGenerated', '#f59e0b', 'Questions Generated')}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Question Categories Pie Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardHeader
              title="Question Categories"
              subheader="Distribution by category"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <RechartsTooltip />
                  <Legend />
                  <RechartsPieChart
                    data={questionData?.length > 0 ? questionData[questionData.length - 1]?.categories || [] : [
                      { name: 'Technical', count: 45 },
                      { name: 'Behavioral', count: 30 },
                      { name: 'Problem Solving', count: 25 }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="count"
                  >
                    {(questionData?.length > 0 ? questionData[questionData.length - 1]?.categories || [] : [
                      { name: 'Technical', count: 45 },
                      { name: 'Behavioral', count: 30 },
                      { name: 'Problem Solving', count: 25 }
                    ]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </RechartsPieChart>
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Combined Metrics Chart */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader
              title="Combined Metrics Overview"
              subheader="All metrics in one view"
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="usersAdded"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Users Added"
                  />
                  <Line
                    type="monotone"
                    dataKey="activeUsers"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Active Users"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// Demo data generators
function generateDemoUserData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      usersAdded: Math.floor(Math.random() * 20) + 5,
      totalUsers: 1200 + (29 - i) * 15,
      activeUsers: Math.floor(Math.random() * 100) + 50,
    });
  }
  return data;
}

function generateDemoWeeklyData() {
  const data = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i * 7);
    data.push({
      week: `Week ${12 - i}`,
      usersAdded: Math.floor(Math.random() * 100) + 50,
      totalUsers: 800 + (11 - i) * 80,
    });
  }
  return data;
}

function generateDemoMonthlyData() {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 11; i >= 0; i--) {
    data.push({
      month: months[11 - i],
      usersAdded: Math.floor(Math.random() * 300) + 100,
      totalUsers: 200 + (11 - i) * 200,
    });
  }
  return data;
}

function generateDemoChatData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      chatsGenerated: Math.floor(Math.random() * 50) + 10,
      totalChats: 3000 + (29 - i) * 25,
      avgDuration: Math.floor(Math.random() * 20) + 10,
    });
  }
  return data;
}

function generateDemoQuestionData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString(),
      questionsGenerated: Math.floor(Math.random() * 100) + 20,
      totalQuestions: 8000 + (29 - i) * 50,
      categories: [
        { name: 'Technical', count: Math.floor(Math.random() * 30) + 10 },
        { name: 'Behavioral', count: Math.floor(Math.random() * 25) + 8 },
        { name: 'Problem Solving', count: Math.floor(Math.random() * 20) + 5 },
      ],
    });
  }
  return data;
}
