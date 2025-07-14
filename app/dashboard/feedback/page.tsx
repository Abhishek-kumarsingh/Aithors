"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Fab,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  Assessment, 
  TrendingUp, 
  School, 
  EmojiEvents,
  Home,
  ArrowBack,
  FilterList,
  Refresh,
  Visibility,
  Schedule,
  CheckCircle,
  Cancel,
  Timer
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface TestResult {
  id: string;
  testTitle: string;
  testType: 'interview' | 'practice' | 'mock-test' | 'assessment';
  testCategory: string;
  difficulty: 'easy' | 'medium' | 'hard';
  performance: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  };
  feedback: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    overallRating: number;
  };
  completedAt: string;
  status: 'completed' | 'in-progress' | 'failed';
}

export default function ModernFeedbackPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const testTypes = [
    { value: 'interview', label: 'Interview', color: '#3b82f6' },
    { value: 'practice', label: 'Practice', color: '#10b981' },
    { value: 'mock-test', label: 'Mock Test', color: '#f59e0b' },
    { value: 'assessment', label: 'Assessment', color: '#8b5cf6' }
  ];

  useEffect(() => {
    fetchTestResults();
  }, [filterType, filterDifficulty]);

  const fetchTestResults = async () => {
    try {
      setLoading(true);

      // Fetch real test results from API
      const response = await fetch('/api/user/test-results');

      if (!response.ok) {
        throw new Error('Failed to fetch test results');
      }

      const data = await response.json();

      if (data.success && data.testResults) {
        // Transform the data to match our interface
        const transformedResults: TestResult[] = data.testResults.map((result: any) => ({
          id: result._id,
          testTitle: result.testTitle,
          testType: result.testType,
          testCategory: result.testCategory,
          difficulty: result.difficulty,
          performance: result.performance,
          feedback: result.feedback,
          completedAt: result.completedAt,
          status: result.status
        }));

        setTestResults(transformedResults);
      } else {
        // If no results found, show empty state
        setTestResults([]);
      }
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError('Failed to fetch test results');
      // Show empty state on error
      setTestResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const typeObj = testTypes.find(t => t.value === type);
    return typeObj?.color || '#6b7280';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

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

      {/* Header */}
      <Box sx={{ 
        position: 'relative', 
        zIndex: 1, 
        p: 3, 
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.push('/dashboard/home')} sx={{ color: 'primary.main' }}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <Assessment />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Test Feedback & Analytics
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Detailed performance analysis and insights
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Type</InputLabel>
              <Select
                value={filterType}
                label="Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                {testTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>{type.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filterDifficulty}
                label="Difficulty"
                onChange={(e) => setFilterDifficulty(e.target.value)}
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2
                }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={fetchTestResults}
              sx={{ 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Refresh
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Performance Overview
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 4 
          }}>
            {[
              { label: 'Total Tests', value: testResults.length, icon: <Assessment />, color: '#3b82f6' },
              { label: 'Average Score', value: '88%', icon: <TrendingUp />, color: '#10b981' },
              { label: 'Best Score', value: '92%', icon: <EmojiEvents />, color: '#f59e0b' },
              { label: 'Time Spent', value: '2.5h', icon: <Timer />, color: '#8b5cf6' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}dd 100%)`,
                  color: 'white',
                  height: 120
                }}>
                  <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="h4" sx={{ fontWeight: 700 }}>
                        {stat.value}
                      </Typography>
                      <Box sx={{ fontSize: 32, opacity: 0.8 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Test Results
          </Typography>
          
          {testResults.length === 0 ? (
            <Card sx={{ 
              background: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              p: 4
            }}>
              <Assessment sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                No test results yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Complete some tests to see your feedback and analytics here
              </Typography>
            </Card>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, 
              gap: 3 
            }}>
              {testResults.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ 
                    background: 'rgba(255,255,255,0.9)', 
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {result.testTitle}
                        </Typography>
                        <Chip 
                          label={result.status} 
                          color={result.status === 'completed' ? 'success' : 'primary'}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                        <Chip 
                          label={result.testType} 
                          size="small"
                          sx={{ 
                            bgcolor: getTypeColor(result.testType),
                            color: 'white'
                          }}
                        />
                        <Chip 
                          label={result.difficulty} 
                          size="small"
                          sx={{ 
                            bgcolor: getDifficultyColor(result.difficulty),
                            color: 'white'
                          }}
                        />
                        <Chip 
                          label={result.testCategory} 
                          variant="outlined" 
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 3 }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {result.performance.score}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Score
                          </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {result.performance.accuracy}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Accuracy
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, fontSize: '0.875rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="body2">
                            {result.performance.correctAnswers}/{result.performance.totalQuestions}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {result.performance.timeSpent}min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmojiEvents sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">
                            {result.feedback.overallRating}/5
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {new Date(result.completedAt).toLocaleDateString()}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        fullWidth
                        onClick={() => router.push(`/dashboard/feedback/${result.id}`)}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        View Detailed Feedback
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </motion.div>
      </Box>

      {/* Floating Actions */}
      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Tooltip title="Back to Dashboard" placement="left">
          <Fab
            color="primary"
            onClick={() => router.push('/dashboard/home')}
          >
            <Home />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
}
