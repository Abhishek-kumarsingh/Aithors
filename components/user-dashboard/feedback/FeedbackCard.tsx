"use client";

import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  LinearProgress,
  Avatar,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Visibility,
  Assessment,
  Schedule,
  TrendingUp,
  CheckCircle,
  Error,
  School,
  Code,
  Psychology,
  BugReport,
  QuestionAnswer
} from '@mui/icons-material';
import { motion } from 'framer-motion';

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
  createdAt: string;
  grade?: string;
}

interface FeedbackCardProps {
  testResult: TestResult;
  onViewDetails: () => void;
  variant?: 'default' | 'compact';
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'interview': return <QuestionAnswer />;
    case 'practice': return <School />;
    case 'mock-test': return <Assessment />;
    case 'assessment': return <Code />;
    default: return <Assessment />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'interview': return '#3b82f6';
    case 'practice': return '#10b981';
    case 'mock-test': return '#f59e0b';
    case 'assessment': return '#8b5cf6';
    default: return '#6b7280';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'hard': return '#ef4444';
    default: return '#6b7280';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return '#10b981';
  if (score >= 80) return '#3b82f6';
  if (score >= 70) return '#f59e0b';
  if (score >= 60) return '#ef4444';
  return '#dc2626';
};

const getGrade = (score: number) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
};

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  testResult,
  onViewDetails,
  variant = 'default'
}) => {
  const grade = testResult.grade || getGrade(testResult.performance.score);
  const scoreColor = getScoreColor(testResult.performance.score);

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ height: '100%', minHeight: 140 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                {testResult.testTitle}
              </Typography>
              <Chip
                label={grade}
                size="small"
                sx={{ bgcolor: scoreColor, color: 'white', fontWeight: 600 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                size="small"
                label={testResult.testType}
                variant="outlined"
                icon={getTypeIcon(testResult.testType)}
                sx={{ color: getTypeColor(testResult.testType) }}
              />
              <Chip
                size="small"
                label={testResult.difficulty}
                sx={{ bgcolor: getDifficultyColor(testResult.difficulty), color: 'white' }}
              />
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              Score: {testResult.performance.score}% • {formatDate(testResult.createdAt)}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <Card sx={{ height: '100%', minHeight: 320, position: 'relative' }}>
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${getTypeColor(testResult.testType)}15 0%, ${getTypeColor(testResult.testType)}25 100%)`,
            p: 3,
            pb: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {testResult.testTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {testResult.testCategory}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  size="small"
                  label={testResult.testType}
                  icon={getTypeIcon(testResult.testType)}
                  sx={{ bgcolor: getTypeColor(testResult.testType), color: 'white' }}
                />
                <Chip
                  size="small"
                  label={testResult.difficulty}
                  sx={{ bgcolor: getDifficultyColor(testResult.difficulty), color: 'white' }}
                />
              </Box>
            </Box>
            
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: scoreColor,
                fontSize: '1.25rem',
                fontWeight: 700
              }}
            >
              {grade}
            </Avatar>
          </Box>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Performance Metrics */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Performance Overview
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: scoreColor }}>
                  {testResult.performance.score}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {testResult.performance.accuracy}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Accuracy
                </Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {testResult.performance.correctAnswers}/{testResult.performance.totalQuestions}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Correct
                </Typography>
              </Box>
            </Box>

            {/* Progress Bar */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Progress
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {testResult.performance.score}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={testResult.performance.score}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    bgcolor: scoreColor
                  }
                }}
              />
            </Box>
          </Box>

          {/* Additional Info */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatTime(testResult.performance.timeSpent)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Assessment sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(testResult.createdAt)}
              </Typography>
            </Box>
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Tooltip title="Questions Answered">
              <Chip
                size="small"
                icon={<CheckCircle />}
                label={testResult.performance.correctAnswers}
                color="success"
                variant="outlined"
              />
            </Tooltip>
            
            <Tooltip title="Questions Missed">
              <Chip
                size="small"
                icon={<Error />}
                label={testResult.performance.totalQuestions - testResult.performance.correctAnswers}
                color="error"
                variant="outlined"
              />
            </Tooltip>
            
            <Tooltip title="Time per Question">
              <Chip
                size="small"
                icon={<Schedule />}
                label={`${Math.round(testResult.performance.timeSpent / testResult.performance.totalQuestions)}s`}
                color="info"
                variant="outlined"
              />
            </Tooltip>
          </Box>
        </CardContent>

        {/* Actions */}
        <CardActions sx={{ p: 3, pt: 0, mt: 'auto' }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Visibility />}
            onClick={onViewDetails}
          >
            View Detailed Feedback
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};
