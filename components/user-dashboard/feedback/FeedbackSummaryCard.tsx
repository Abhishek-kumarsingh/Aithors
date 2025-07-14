"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  Schedule,
  Assessment,
  EmojiEvents
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FeedbackSummaryCardProps {
  feedback: {
    overallFeedback: string;
    strengths: string[];
    improvements: string[];
  };
  performance: {
    score: number;
    accuracy: number;
    timeSpent: number;
    averageTimePerQuestion: number;
  };
}

export const FeedbackSummaryCard: React.FC<FeedbackSummaryCardProps> = ({
  feedback,
  performance
}) => {
  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', color: '#10b981', icon: <EmojiEvents /> };
    if (score >= 80) return { level: 'Good', color: '#3b82f6', icon: <TrendingUp /> };
    if (score >= 70) return { level: 'Average', color: '#f59e0b', icon: <Assessment /> };
    if (score >= 60) return { level: 'Below Average', color: '#ef4444', icon: <Schedule /> };
    return { level: 'Needs Improvement', color: '#dc2626', icon: <Schedule /> };
  };

  const performanceLevel = getPerformanceLevel(performance.score);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Performance Summary
          </Typography>

          {/* Performance Level */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ color: performanceLevel.color }}>
                {performanceLevel.icon}
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                Performance Level
              </Typography>
            </Box>
            
            <Chip
              label={performanceLevel.level}
              sx={{
                bgcolor: performanceLevel.color,
                color: 'white',
                fontWeight: 600,
                mb: 2
              }}
            />
            
            <LinearProgress
              variant="determinate"
              value={performance.score}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: performanceLevel.color
                }
              }}
            />
          </Box>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Accuracy Rate
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {performance.accuracy}%
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Total Time
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formatTime(performance.timeSpent)}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Avg. Time/Question
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {Math.round(performance.averageTimePerQuestion)}s
              </Typography>
            </Box>
          </Box>

          {/* Overall Feedback */}
          {feedback.overallFeedback && (
            <Alert 
              severity={performance.score >= 80 ? 'success' : performance.score >= 60 ? 'info' : 'warning'}
              sx={{ mb: 3 }}
            >
              <Typography variant="body2">
                {feedback.overallFeedback}
              </Typography>
            </Alert>
          )}

          {/* Key Insights */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Key Insights
            </Typography>
            
            {feedback.strengths.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Top Strength:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feedback.strengths[0]}
                </Typography>
              </Box>
            )}
            
            {feedback.improvements.length > 0 && (
              <Box>
                <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
                  Focus Area:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feedback.improvements[0]}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
