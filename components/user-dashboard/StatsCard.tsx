"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Info,
  CheckCircle,
  Schedule,
  Assessment,
  Psychology,
  EmojiEvents,
  Speed,
  ErrorOutline
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  variant?: 'default' | 'gradient' | 'outlined' | 'minimal';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'flat';
    label?: string;
  };
  progress?: {
    value: number;
    max: number;
    label?: string;
  };
  badge?: {
    label: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  onClick?: () => void;
  loading?: boolean;
  description?: string;
}

const getColorGradient = (color: string) => {
  switch (color) {
    case 'primary':
      return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    case 'secondary':
      return 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)';
    case 'success':
      return 'linear-gradient(135deg, #10b981 0%, #047857 100%)';
    case 'warning':
      return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    case 'error':
      return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    case 'info':
      return 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)';
    default:
      return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)';
  }
};

const getIconByType = (type: string) => {
  switch (type) {
    case 'tests': return <CheckCircle />;
    case 'practice': return <Psychology />;
    case 'time': return <Schedule />;
    case 'score': return <Assessment />;
    case 'streak': return <EmojiEvents />;
    case 'speed': return <Speed />;
    case 'errors': return <ErrorOutline />;
    default: return <Assessment />;
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  variant = 'default',
  trend,
  progress,
  badge,
  onClick,
  loading = false,
  description
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    switch (trend.direction) {
      case 'up':
        return <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />;
      case 'down':
        return <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />;
      case 'flat':
        return <TrendingFlat sx={{ fontSize: 16, color: '#6b7280' }} />;
      default:
        return null;
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text.secondary';
    
    switch (trend.direction) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      case 'flat': return '#6b7280';
      default: return 'text.secondary';
    }
  };

  const cardContent = (
    <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : `${color}.light`,
                color: variant === 'gradient' ? 'white' : `${color}.main`
              }}
            >
              {icon}
            </Box>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: variant === 'gradient' ? 'white' : 'text.primary',
              fontSize: '0.95rem'
            }}
          >
            {title}
          </Typography>
        </Box>
        
        {description && (
          <Tooltip title={description}>
            <IconButton size="small" sx={{ color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : 'text.secondary' }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        
        {badge && (
          <Chip
            label={badge.label}
            size="small"
            color={badge.color || 'primary'}
            sx={{
              bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : undefined,
              color: variant === 'gradient' ? 'white' : undefined
            }}
          />
        )}
      </Box>

      {/* Main Value */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={40} sx={{ color: variant === 'gradient' ? 'white' : `${color}.main` }} />
          </Box>
        ) : (
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: variant === 'gradient' ? 'white' : 'text.primary',
              mb: 1,
              lineHeight: 1.2
            }}
          >
            {value}
          </Typography>
        )}

        {subtitle && (
          <Typography
            variant="body2"
            sx={{
              color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
              mb: 1
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Trend */}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            {getTrendIcon()}
            <Typography
              variant="body2"
              sx={{
                color: variant === 'gradient' ? 'rgba(255,255,255,0.9)' : getTrendColor(),
                fontWeight: 500
              }}
            >
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </Typography>
            {trend.label && (
              <Typography
                variant="caption"
                sx={{
                  color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : 'text.secondary'
                }}
              >
                {trend.label}
              </Typography>
            )}
          </Box>
        )}

        {/* Progress */}
        {progress && (
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : 'text.secondary'
                }}
              >
                {progress.label || 'Progress'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                  fontWeight: 500
                }}
              >
                {progress.value}/{progress.max}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progress.value / progress.max) * 100}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: variant === 'gradient' ? 'rgba(255,255,255,0.2)' : 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: variant === 'gradient' ? 'white' : `${color}.main`
                }
              }}
            />
          </Box>
        )}
      </Box>
    </CardContent>
  );

  const getCardStyles = () => {
    const baseStyles = {
      height: '100%',
      minHeight: 200,
      position: 'relative',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: 4
      } : {}
    };

    switch (variant) {
      case 'gradient':
        return {
          ...baseStyles,
          background: getColorGradient(color),
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -20,
            right: -20,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            zIndex: 0
          }
        };
      
      case 'outlined':
        return {
          ...baseStyles,
          border: `2px solid`,
          borderColor: `${color}.main`,
          bgcolor: 'background.paper'
        };
      
      case 'minimal':
        return {
          ...baseStyles,
          bgcolor: 'background.paper',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider'
        };
      
      default:
        return {
          ...baseStyles,
          bgcolor: 'background.paper'
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={onClick ? { scale: 1.02 } : {}}
    >
      <Card
        sx={getCardStyles()}
        onClick={onClick}
      >
        {cardContent}
      </Card>
    </motion.div>
  );
};
