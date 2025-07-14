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
  Tooltip
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Assessment,
  History,
  Code,
  Psychology,
  BugReport,
  Home,
  ArrowBack,
  Schedule,
  EmojiEvents
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { InterviewSetupDialog } from '@/components/interview/InterviewSetupDialog';

interface Interview {
  id: string;
  title: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'coding' | 'mixed';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  difficulty: 'easy' | 'medium' | 'hard';
  setupMethod: 'resume' | 'techstack';
  duration: number;
  results?: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
  };
  createdAt: string;
}

export default function ModernInterviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);

  const interviewTypes = [
    {
      type: 'technical',
      label: 'Technical Interview',
      icon: <Code />,
      color: '#3b82f6',
      description: 'Focus on technical skills and problem-solving'
    },
    {
      type: 'behavioral',
      label: 'Behavioral Interview',
      icon: <Psychology />,
      color: '#10b981',
      description: 'Assess soft skills and cultural fit'
    },
    {
      type: 'coding',
      label: 'Coding Challenge',
      icon: <BugReport />,
      color: '#f59e0b',
      description: 'Live coding and algorithm problems'
    },
    {
      type: 'mixed',
      label: 'Mixed Interview',
      icon: <Assessment />,
      color: '#8b5cf6',
      description: 'Combination of all interview types'
    }
  ];
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    averageScore: 0,
    bestScore: 0
  });

  // Fetch interviews
  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/test-interview-simple');
      
      if (!response.ok) {
        throw new Error('Failed to fetch interviews');
      }

      const data = await response.json();
      setInterviews(data.interviews || []);
      
      // Calculate stats
      const completed = data.interviews.filter((i: Interview) => i.status === 'completed');
      const scores = completed.map((i: Interview) => i.results?.score || 0);
      
      setStats({
        total: data.interviews.length,
        completed: completed.length,
        averageScore: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
        bestScore: scores.length > 0 ? Math.max(...scores) : 0
      });

    } catch (error) {
      console.error('Error fetching interviews:', error);
      setError('Failed to load interviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchInterviews();
    }
  }, [status]);

  // Handle interview creation
  const handleCreateInterview = async (interviewData: any) => {
    try {
      const response = await fetch('/api/user/interviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interviewData),
      });

      if (!response.ok) {
        throw new Error('Failed to create interview');
      }

      const data = await response.json();
      setInterviews(prev => [data.interview, ...prev]);
      setSetupDialogOpen(false);
      
      // Redirect to interview session
      window.location.href = `/dashboard/interview/${data.interview._id}`;

    } catch (error) {
      console.error('Error creating interview:', error);
      setError('Failed to create interview. Please try again.');
    }
  };

  // Handle interview actions
  const handleInterviewStart = async (id: string) => {
    try {
      const response = await fetch(`/api/user/interviews/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'start' }),
      });

      if (response.ok) {
        window.location.href = `/dashboard/interview/${id}`;
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    }
  };

  const handleInterviewDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/user/interviews/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInterviews(prev => prev.filter(i => i.id !== id));
      }
    } catch (error) {
      console.error('Error deleting interview:', error);
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
                  Interview Practice
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Prepare for your next interview
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setSetupDialogOpen(true)}
              sx={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.3)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              New Interview
            </Button>

            <Button
              variant="outlined"
              startIcon={<History />}
              sx={{
                borderColor: '#6b7280',
                color: '#6b7280',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  borderColor: '#374151',
                  color: '#374151',
                  bgcolor: 'rgba(107, 114, 128, 0.1)'
                }
              }}
            >
              History
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

        {/* Quick Start Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Quick Start Interview
          </Typography>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 4
          }}>
            {interviewTypes.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  height: 180,
                  background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)`,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)' },
                  boxShadow: `0 8px 32px ${type.color}40`
                }}
                onClick={() => router.push(`/dashboard/interview/setup?type=${type.type}`)}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ fontSize: 40, opacity: 0.8 }}>
                        {type.icon}
                      </Box>
                      <PlayArrow sx={{ fontSize: 24 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {type.label}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.875rem' }}>
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Recent Interviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Recent Interviews
          </Typography>

          {interviews.length === 0 ? (
            <Card sx={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              p: 4
            }}>
              <Assessment sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                No interviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start your first interview to begin practicing
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setSetupDialogOpen(true)}
              >
                Start First Interview
              </Button>
            </Card>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: 2
            }}>
              {interviews.map((interview, index) => (
                <motion.div
                  key={interview.id}
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
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {interview.title}
                        </Typography>
                        <Chip
                          label={interview.status}
                          color={interview.status === 'completed' ? 'success' : 'primary'}
                          size="small"
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Chip label={interview.type} variant="outlined" size="small" />
                        <Chip label={interview.difficulty} variant="outlined" size="small" />
                        <Chip
                          label={`${interview.duration}min`}
                          variant="outlined"
                          size="small"
                          icon={<Schedule sx={{ fontSize: 16 }} />}
                        />
                      </Box>

                      {interview.results && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <EmojiEvents sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="body2">
                            Score: {interview.results.score}%
                          </Typography>
                        </Box>
                      )}

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </Typography>

                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PlayArrow />}
                        fullWidth
                        onClick={() => router.push(`/dashboard/interview/${interview.id}`)}
                      >
                        {interview.status === 'completed' ? 'Review' : 'Continue'}
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
        <Tooltip title="Interview History" placement="left">
          <Fab
            size="small"
            sx={{
              bgcolor: '#f59e0b',
              color: 'white',
              '&:hover': { bgcolor: '#d97706' }
            }}
          >
            <History />
          </Fab>
        </Tooltip>

        <Tooltip title="Back to Dashboard" placement="left">
          <Fab
            color="primary"
            onClick={() => router.push('/dashboard/home')}
          >
            <Home />
          </Fab>
        </Tooltip>
      </Box>

      {/* Interview Setup Dialog */}
      <InterviewSetupDialog
        open={setupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        onSubmit={handleCreateInterview}
      />
    </Box>
  );
}
