"use client";

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Avatar,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Star,
  Timer,
  TrendingUp,
  Refresh,
  ArrowForward,
  EmojiEvents,
  School
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface PracticeSession {
  id: string;
  questionId: string;
  startTime: string;
  endTime?: string;
  timeSpent: number;
  answer: string;
  isCompleted: boolean;
  score?: number;
  feedback?: string;
}

interface PracticeQuestion {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  content: {
    correctAnswer?: string;
    explanation?: string;
  };
}

interface SubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  session: PracticeSession;
  question: PracticeQuestion;
  onNextQuestion: () => void;
  onRetry: () => void;
}

export const SubmissionDialog: React.FC<SubmissionDialogProps> = ({
  open,
  onClose,
  session,
  question,
  onNextQuestion,
  onRetry
}) => {
  const score = session.score || 0;
  const isCorrect = score >= 80;
  const timeSpentMinutes = Math.floor(session.timeSpent / 60);
  const timeSpentSeconds = session.timeSpent % 60;

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#3b82f6';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: 'Excellent', icon: <EmojiEvents />, color: '#10b981' };
    if (score >= 70) return { level: 'Good', icon: <Star />, color: '#3b82f6' };
    if (score >= 50) return { level: 'Average', icon: <School />, color: '#f59e0b' };
    return { level: 'Needs Improvement', icon: <TrendingUp />, color: '#ef4444' };
  };

  const performance = getPerformanceLevel(score);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              bgcolor: getScoreColor(score),
              mx: 'auto',
              mb: 2
            }}
          >
            {isCorrect ? <CheckCircle sx={{ fontSize: 40 }} /> : <Cancel sx={{ fontSize: 40 }} />}
          </Avatar>
        </motion.div>
        
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {isCorrect ? 'Well Done!' : 'Keep Practicing!'}
        </Typography>
        
        <Typography variant="body1" color="text.secondary">
          You've completed "{question.title}"
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {/* Score Overview */}
        <Card sx={{ mb: 3, bgcolor: `${getScoreColor(score)}15` }}>
          <CardContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="h2" sx={{ fontWeight: 700, color: getScoreColor(score), mb: 1 }}>
              {score}%
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ color: performance.color }}>
                {performance.icon}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {performance.level}
              </Typography>
            </Box>
            
            <LinearProgress
              variant="determinate"
              value={score}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4,
                  bgcolor: getScoreColor(score)
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Performance Details */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 3 }}>
          <Box>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Timer sx={{ fontSize: 32, color: 'info.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {timeSpentMinutes}:{timeSpentSeconds.toString().padStart(2, '0')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Time Spent
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Star sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {Math.round((score / 100) * question.points)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Points Earned
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card variant="outlined">
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <TrendingUp sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {question.difficulty}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Difficulty
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Feedback */}
        {session.feedback && (
          <Alert 
            severity={isCorrect ? 'success' : 'info'} 
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              <strong>Feedback:</strong> {session.feedback}
            </Typography>
          </Alert>
        )}

        {/* Correct Answer & Explanation */}
        {question.content.correctAnswer && (
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Solution & Explanation
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Correct Answer:
                </Typography>
                <Card variant="outlined" sx={{ bgcolor: 'success.50', p: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    {question.content.correctAnswer}
                  </Typography>
                </Card>
              </Box>
              
              {question.content.explanation && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Explanation:
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {question.content.explanation}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Performance Tips */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Performance Tips
            </Typography>
            
            {score >= 80 ? (
              <Alert severity="success">
                <Typography variant="body2">
                  Excellent work! You've mastered this concept. Try tackling harder problems or explore related topics to continue improving.
                </Typography>
              </Alert>
            ) : score >= 60 ? (
              <Alert severity="info">
                <Typography variant="body2">
                  Good effort! Review the solution and try similar problems to strengthen your understanding of this concept.
                </Typography>
              </Alert>
            ) : (
              <Alert severity="warning">
                <Typography variant="body2">
                  Don't give up! Review the fundamentals, practice similar problems, and consider seeking additional resources or help.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={onRetry}
        >
          Try Again
        </Button>
        
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Review Solution
        </Button>
        
        <Button
          variant="contained"
          startIcon={<ArrowForward />}
          onClick={onNextQuestion}
        >
          Next Question
        </Button>
      </DialogActions>
    </Dialog>
  );
};
