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
  School, 
  PlayArrow, 
  Code, 
  Quiz,
  Home,
  ArrowBack,
  FilterList,
  TrendingUp,
  EmojiEvents,
  Timer
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Question {
  id: string;
  title: string;
  type: 'mcq' | 'coding' | 'subjective' | 'bug-fix';
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string;
  category: string;
  timeLimit: number;
  attempts: number;
  successRate: number;
  tags: string[];
}

export default function ModernPracticePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const domains = [
    'Frontend Development',
    'Backend Development', 
    'Full Stack Development',
    'Data Structures & Algorithms',
    'System Design',
    'Database Design',
    'DevOps'
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  const questionTypes = [
    { 
      type: 'mcq', 
      label: 'Multiple Choice', 
      icon: <Quiz />, 
      color: '#3b82f6',
      description: 'Quick knowledge checks'
    },
    { 
      type: 'coding', 
      label: 'Coding Challenge', 
      icon: <Code />, 
      color: '#10b981',
      description: 'Algorithm and programming problems'
    },
    { 
      type: 'subjective', 
      label: 'Subjective', 
      icon: <School />, 
      color: '#f59e0b',
      description: 'Open-ended questions'
    },
    { 
      type: 'bug-fix', 
      label: 'Bug Fixing', 
      icon: <Code />, 
      color: '#ef4444',
      description: 'Find and fix code issues'
    }
  ];

  useEffect(() => {
    fetchQuestions();
  }, [selectedDomain, selectedDifficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDomain !== 'all') params.append('domain', selectedDomain);
      if (selectedDifficulty !== 'all') params.append('difficulty', selectedDifficulty);
      
      const response = await fetch(`/api/user/practice/questions?${params}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const startPractice = (type: string) => {
    router.push(`/dashboard/practice/session?type=${type}`);
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
                <School />
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Practice Questions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sharpen your skills with targeted practice
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Domain</InputLabel>
              <Select
                value={selectedDomain}
                label="Domain"
                onChange={(e) => setSelectedDomain(e.target.value)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2
                }}
              >
                <MenuItem value="all">All Domains</MenuItem>
                {domains.map((domain) => (
                  <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={selectedDifficulty}
                label="Difficulty"
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 2
                }}
              >
                <MenuItem value="all">All Levels</MenuItem>
                {difficulties.map((diff) => (
                  <MenuItem key={diff} value={diff}>
                    {diff.charAt(0).toUpperCase() + diff.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              startIcon={<FilterList />}
              sx={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Apply Filters
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

        {/* Quick Practice Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Quick Practice
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, 
            gap: 2, 
            mb: 4 
          }}>
            {questionTypes.map((type, index) => (
              <motion.div
                key={type.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{ 
                  height: 160,
                  background: `linear-gradient(135deg, ${type.color} 0%, ${type.color}dd 100%)`,
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)' },
                  boxShadow: `0 8px 32px ${type.color}40`
                }}
                onClick={() => startPractice(type.type)}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ fontSize: 36, opacity: 0.8 }}>
                        {type.icon}
                      </Box>
                      <PlayArrow sx={{ fontSize: 20 }} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                      {type.label}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.8rem' }}>
                      {type.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Available Questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Available Questions ({questions.length})
          </Typography>
          
          {questions.length === 0 ? (
            <Card sx={{ 
              background: 'rgba(255,255,255,0.9)', 
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
              p: 4
            }}>
              <School sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
                No questions found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your filters or check back later
              </Typography>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSelectedDomain('all');
                  setSelectedDifficulty('all');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
              gap: 2 
            }}>
              {questions.slice(0, 12).map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card sx={{
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    transition: 'transform 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)' },
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            fontSize: '1rem',
                            flex: 1,
                            lineHeight: 1.3,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            mr: 1
                          }}
                        >
                          {question.title}
                        </Typography>
                        <Chip
                          label={question.difficulty}
                          size="small"
                          sx={{
                            bgcolor: getDifficultyColor(question.difficulty),
                            color: 'white',
                            flexShrink: 0
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                        <Chip
                          label={question.type}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                        <Chip
                          label={question.domain.length > 15 ? question.domain.substring(0, 15) + '...' : question.domain}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        mb: 2,
                        fontSize: '0.875rem',
                        flexWrap: 'wrap'
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Timer sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {question.timeLimit}min
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp sx={{ fontSize: 14, color: 'success.main' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {question.successRate}%
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <EmojiEvents sx={{ fontSize: 14, color: 'warning.main' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                            {question.attempts}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ mt: 'auto' }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<PlayArrow />}
                          fullWidth
                          onClick={() => router.push(`/dashboard/practice/${question.id}`)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                        >
                          Start Practice
                        </Button>
                      </Box>
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
