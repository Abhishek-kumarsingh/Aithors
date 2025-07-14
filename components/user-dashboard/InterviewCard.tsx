"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  MoreVert,
  Edit,
  Delete,
  Share,
  Assessment,
  Schedule,
  CheckCircle,
  Cancel,
  Code,
  Psychology,
  BugReport,
  QuestionAnswer,
  AccessTime,
  TrendingUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface Interview {
  id: string;
  title: string;
  type: 'technical' | 'behavioral' | 'system-design' | 'coding' | 'mixed';
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  difficulty: 'easy' | 'medium' | 'hard';
  setupMethod: 'resume' | 'techstack';
  duration: number; // in minutes
  results?: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

interface InterviewCardProps {
  interview: Interview;
  onStart?: (id: string) => void;
  onPause?: (id: string) => void;
  onStop?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onShare?: (id: string) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'in-progress': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    default: return 'default';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Schedule />;
    case 'in-progress': return <PlayArrow />;
    case 'completed': return <CheckCircle />;
    case 'cancelled': return <Cancel />;
    default: return <Schedule />;
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

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'technical': return <Code />;
    case 'behavioral': return <Psychology />;
    case 'system-design': return <Assessment />;
    case 'coding': return <BugReport />;
    case 'mixed': return <QuestionAnswer />;
    default: return <Assessment />;
  }
};

export const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onStart,
  onPause,
  onStop,
  onEdit,
  onDelete,
  onShare,
  variant = 'default'
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(interview.id);
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card sx={{ height: '100%', minHeight: 120 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                {interview.title}
              </Typography>
              <Chip
                size="small"
                label={interview.status}
                color={getStatusColor(interview.status) as any}
                icon={getStatusIcon(interview.status)}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip
                size="small"
                label={interview.type}
                variant="outlined"
                icon={getTypeIcon(interview.type)}
              />
              <Chip
                size="small"
                label={interview.difficulty}
                sx={{ bgcolor: getDifficultyColor(interview.difficulty), color: 'white' }}
              />
            </Box>
            
            {interview.results && (
              <Typography variant="body2" color="text.secondary">
                Score: {interview.results.score}% • {formatDate(interview.createdAt)}
              </Typography>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4 }}
      >
        <Card sx={{ height: '100%', minHeight: 300, position: 'relative' }}>
          {/* Header */}
          <Box sx={{ p: 3, pb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {interview.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    size="small"
                    label={interview.status}
                    color={getStatusColor(interview.status) as any}
                    icon={getStatusIcon(interview.status)}
                  />
                  <Chip
                    size="small"
                    label={interview.type}
                    variant="outlined"
                    icon={getTypeIcon(interview.type)}
                  />
                  <Chip
                    size="small"
                    label={interview.difficulty}
                    sx={{ bgcolor: getDifficultyColor(interview.difficulty), color: 'white' }}
                  />
                </Box>
              </Box>
              
              <IconButton onClick={handleMenuClick}>
                <MoreVert />
              </IconButton>
            </Box>

            {/* Setup Method */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.light' }}>
                {interview.setupMethod === 'resume' ? '📄' : '⚙️'}
              </Avatar>
              <Typography variant="body2" color="text.secondary">
                Setup via {interview.setupMethod === 'resume' ? 'Resume Upload' : 'Tech Stack Selection'}
              </Typography>
            </Box>
          </Box>

          <CardContent sx={{ pt: 0, pb: 2 }}>
            {/* Results */}
            {interview.results && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Performance Results
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: getScoreColor(interview.results.score) }}>
                      {interview.results.score}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Score
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {interview.results.accuracy}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Accuracy
                    </Typography>
                  </Box>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {interview.results.correctAnswers}/{interview.results.totalQuestions}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Correct
                    </Typography>
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={interview.results.score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: getScoreColor(interview.results.score)
                    }
                  }}
                />
              </Box>
            )}

            {/* Metadata */}
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDuration(interview.duration)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDate(interview.createdAt)}
                </Typography>
              </Box>
            </Box>
          </CardContent>

          {/* Actions */}
          <CardActions sx={{ p: 3, pt: 0, mt: 'auto' }}>
            {interview.status === 'pending' && (
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => onStart?.(interview.id)}
                fullWidth
              >
                Start Interview
              </Button>
            )}
            
            {interview.status === 'in-progress' && (
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <Button
                  variant="outlined"
                  startIcon={<Pause />}
                  onClick={() => onPause?.(interview.id)}
                  sx={{ flex: 1 }}
                >
                  Pause
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={() => onStop?.(interview.id)}
                  sx={{ flex: 1 }}
                >
                  Stop
                </Button>
              </Box>
            )}
            
            {interview.status === 'completed' && (
              <Button
                variant="outlined"
                startIcon={<TrendingUp />}
                fullWidth
              >
                View Results
              </Button>
            )}
          </CardActions>
        </Card>
      </motion.div>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { onEdit?.(interview.id); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => { onShare?.(interview.id); handleMenuClose(); }}>
          <Share sx={{ mr: 1 }} />
          Share
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Interview</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{interview.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
