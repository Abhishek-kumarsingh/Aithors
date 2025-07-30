"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Button,
  Fab,
  Tooltip
} from '@mui/material';
import {
  Add,
  Refresh,
  TrendingUp,
  Assessment,
  School,
  QuestionAnswer,
  EmojiEvents,
  Timeline,
  PlayArrow,
  SmartToy
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TopNavigation } from '@/components/user-dashboard/TopNavigation';

// Mock data for demonstration
const mockPerformanceData = [
  { name: 'Mon', score: 85, accuracy: 78, tests: 3 },
  { name: 'Tue', score: 92, accuracy: 85, tests: 4 },
  { name: 'Wed', score: 78, accuracy: 72, tests: 2 },
  { name: 'Thu', score: 88, accuracy: 82, tests: 5 },
  { name: 'Fri', score: 95, accuracy: 90, tests: 3 },
  { name: 'Sat', score: 82, accuracy: 76, tests: 2 },
  { name: 'Sun', score: 90, accuracy: 88, tests: 4 }
];

const mockSkillsData = [
  { name: 'React', value: 85, color: '#3b82f6' },
  { name: 'JavaScript', value: 92, color: '#10b981' },
  { name: 'Node.js', value: 78, color: '#f59e0b' },
  { name: 'TypeScript', value: 88, color: '#ef4444' },
  { name: 'Python', value: 75, color: '#8b5cf6' }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function UserDashboardHome() {
  const { data: session, status } = useSession();
  const [currentSection, setCurrentSection] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    window.location.href = '/auth/login';
    return null;
  }

  const user = session?.user || { name: 'Demo User', email: 'demo@example.com' };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      position: 'relative'
    }}>
      {/* Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)
          `,
          zIndex: 0
        }}
      />

      {/* Top Navigation */}
      <TopNavigation
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
        user={user}
        notifications={0}
      />

      {/* Main Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 1,
        px: { xs: 2, sm: 3, md: 4 },
        py: 3,
        maxWidth: '100vw',
        overflow: 'hidden'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Here&apos;s your interview preparation progress and recent activity.
            </Typography>
          </Box>

          {/* Stats Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: 2,
            mb: 3
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                height: 120,
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                        24
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Total Interviews
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>+12% this week</Typography>
                      </Box>
                    </Box>
                    <Assessment sx={{ fontSize: 36, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                height: 120,
                boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                        87%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Average Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>+5% improvement</Typography>
                      </Box>
                    </Box>
                    <EmojiEvents sx={{ fontSize: 36, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: 'white',
                height: 120,
                boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                        5
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Current Streak
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Keep it up!</Typography>
                      </Box>
                    </Box>
                    <Timeline sx={{ fontSize: 36, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                color: 'white',
                height: 120,
                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
              }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, fontSize: '2rem' }}>
                        95%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                        Best Score
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <EmojiEvents sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Personal best</Typography>
                      </Box>
                    </Box>
                    <School sx={{ fontSize: 36, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Charts Section */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
            mb: 3
          }}>
            {/* Performance Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <CardHeader
                  title="Performance Trends"
                  subheader="Your weekly interview performance"
                  action={
                    <IconButton>
                      <Refresh />
                    </IconButton>
                  }
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={mockPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="accuracy"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skills Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card sx={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <CardHeader
                  title="Skills Overview"
                  subheader="Your skill proficiency"
                />
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={mockSkillsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {mockSkillsData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card sx={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <CardHeader
                title="Recent Interviews"
                subheader="Your latest interview sessions"
                action={
                  <Button variant="outlined" startIcon={<Add />}>
                    New Interview
                  </Button>
                }
              />
              <CardContent>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                  gap: 2
                }}>
                  {[
                    { title: 'React Developer Interview', score: 92, date: '2024-01-15', status: 'completed' },
                    { title: 'JavaScript Fundamentals', score: 88, date: '2024-01-14', status: 'completed' },
                    { title: 'System Design', score: 85, date: '2024-01-13', status: 'completed' }
                  ].map((interview, index) => (
                    <Card key={index} variant="outlined" sx={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'transform 0.2s ease',
                      '&:hover': { transform: 'translateY(-2px)' }
                    }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '1rem' }}>
                          {interview.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <Chip
                            label={`${interview.score}%`}
                            color="success"
                            size="small"
                          />
                          <Chip
                            label={interview.status}
                            variant="outlined"
                            size="small"
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {interview.date}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PlayArrow />}
                          fullWidth
                        >
                          Review
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Box>

      {/* Floating Action Buttons */}
      <Box sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        zIndex: 1000
      }}>
        <Tooltip title="Start New Interview" placement="left">
          <Fab
            size="medium"
            color="primary"
            onClick={() => window.location.href = '/dashboard/interview'}
            sx={{
              boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
              width: 48,
              height: 48
            }}
          >
            <QuestionAnswer sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>

        <Tooltip title="Practice Questions" placement="left">
          <Fab
            size="medium"
            sx={{
              bgcolor: '#8b5cf6',
              color: 'white',
              boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
              '&:hover': { bgcolor: '#7c3aed' },
              width: 48,
              height: 48
            }}
            onClick={() => window.location.href = '/dashboard/practice'}
          >
            <School sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>

        <Tooltip title="AI Assistant" placement="left">
          <Fab
            size="medium"
            sx={{
              bgcolor: '#10b981',
              color: 'white',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
              '&:hover': { bgcolor: '#059669' },
              width: 48,
              height: 48
            }}
            onClick={() => window.location.href = '/dashboard/ai-assistant'}
          >
            <SmartToy sx={{ fontSize: 20 }} />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
}
