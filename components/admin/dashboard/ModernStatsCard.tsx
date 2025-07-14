"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  MoreVert,
  InfoOutlined,
} from '@mui/icons-material';

export interface ModernStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
    direction: 'up' | 'down' | 'flat';
  };
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  gradient?: string;
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  badge?: {
    label: string;
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  };
  onClick?: () => void;
  loading?: boolean;
  variant?: 'default' | 'glassmorphism' | 'minimal';
}

const colorGradients = {
  primary: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  secondary: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  success: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  info: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
};

const getTrendIcon = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return <TrendingUp sx={{ fontSize: 16 }} />;
    case 'down':
      return <TrendingDown sx={{ fontSize: 16 }} />;
    default:
      return <TrendingFlat sx={{ fontSize: 16 }} />;
  }
};

const getTrendColor = (direction: 'up' | 'down' | 'flat') => {
  switch (direction) {
    case 'up':
      return 'success.main';
    case 'down':
      return 'error.main';
    default:
      return 'text.secondary';
  }
};

export const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'primary',
  gradient,
  progress,
  badge,
  onClick,
  loading = false,
  variant = 'default',
}) => {
  const cardGradient = gradient || colorGradients[color];

  const cardVariants = {
    default: {
      background: cardGradient,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: `0 12px 40px ${color === 'primary' ? 'rgba(59, 130, 246, 0.3)' : 
                                   color === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                                   color === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                                   color === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                   'rgba(0, 0, 0, 0.2)'}`,
      } : {},
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        width: '100px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transform: 'translate(30px, -30px)',
      },
    },
    glassmorphism: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        background: 'rgba(255, 255, 255, 0.15)',
        transform: 'translateY(-2px)',
      } : {},
    },
    minimal: {
      background: 'transparent',
      border: '1px solid',
      borderColor: 'divider',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        borderColor: `${color}.main`,
        boxShadow: 1,
      } : {},
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
    >
      <Card
        sx={cardVariants[variant]}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: variant === 'default' ? 'rgba(255, 255, 255, 0.2)' : `${color}.main`,
                  color: variant === 'default' ? 'white' : 'white',
                  width: 48,
                  height: 48,
                }}
              >
                {icon}
              </Avatar>
              {badge && (
                <Chip
                  label={badge.label}
                  color={badge.color}
                  size="small"
                  sx={{ 
                    fontWeight: 600,
                    ...(variant === 'default' && {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    })
                  }}
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="More information">
                <IconButton 
                  size="small" 
                  sx={{ 
                    color: variant === 'default' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                  }}
                >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </Tooltip>
              <IconButton 
                size="small" 
                sx={{ 
                  color: variant === 'default' ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary',
                }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Main Content */}
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: variant === 'default' ? 0.9 : 0.7,
                mb: 1,
                fontWeight: 500,
              }}
            >
              {title}
            </Typography>
            
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: subtitle ? 1 : 0,
                color: variant === 'default' ? 'white' : 'text.primary',
              }}
            >
              {loading ? '...' : value}
            </Typography>
            
            {subtitle && (
              <Typography 
                variant="body2" 
                sx={{ 
                  opacity: variant === 'default' ? 0.8 : 0.6,
                  fontWeight: 400,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>

          {/* Progress Bar */}
          {progress && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {progress.label || 'Progress'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {progress.value}/{progress.max}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress.max > 0 ? Math.min((progress.value / progress.max) * 100, 100) : 0}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: variant === 'default' ? 'rgba(255, 255, 255, 0.2)' : 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    backgroundColor: variant === 'default' ? 'white' : `${color}.main`,
                  },
                }}
              />
            </Box>
          )}

          {/* Trend */}
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: variant === 'default' ? 'white' : getTrendColor(trend.direction),
                }}
              >
                {getTrendIcon(trend.direction)}
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {trend.value > 0 ? '+' : ''}{trend.value}%
                </Typography>
              </Box>
              <Typography 
                variant="caption" 
                sx={{ 
                  opacity: variant === 'default' ? 0.8 : 0.6,
                }}
              >
                {trend.label}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
