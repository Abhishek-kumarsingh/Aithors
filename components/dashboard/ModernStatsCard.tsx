'use client';

import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';
import { motion } from 'framer-motion';

export interface ModernStatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string | number;
    label: string;
    isPositive?: boolean;
    direction?: 'up' | 'down';
  };
  progress?: {
    label: string;
    value: string | number;
    total?: string | number;
    max?: number;
  };
  badge?: {
    label: string;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  };
  color?: string;
  variant?: 'default' | 'glassmorphism' | 'minimal';
  loading?: boolean;
  onClick?: () => void;
}

export const ModernStatsCard: React.FC<ModernStatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  progress,
  badge,
  color = '#1976d2',
  variant = 'default',
  loading = false,
  onClick,
}) => {
  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography>...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      style={{ height: '100%' }}
    >
      <Card
        sx={{
          height: '100%',
          cursor: onClick ? 'pointer' : 'default',
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          '&:hover': onClick ? {
            boxShadow: 3,
            borderColor: `${color}40`,
          } : {},
        }}
        onClick={onClick}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6" color="text.secondary" fontWeight={500}>
              {title}
            </Typography>
            {icon && (
              <Avatar
                sx={{
                  bgcolor: `${color}20`,
                  color: color,
                  width: 40,
                  height: 40,
                }}
                data-testid="people-icon"
              >
                {icon}
              </Avatar>
            )}
          </Box>

          <Typography variant="h4" fontWeight="bold" color="text.primary" mb={1}>
            {value}
          </Typography>

          {subtitle && (
            <Typography variant="body2" color="text.secondary" mb={2}>
              {subtitle}
            </Typography>
          )}

          {trend && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Typography
                variant="body2"
                color={
                  trend.isPositive !== undefined
                    ? (trend.isPositive ? 'success.main' : 'error.main')
                    : (trend.direction === 'up' ? 'success.main' : 'error.main')
                }
                fontWeight={600}
              >
                {trend.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {trend.label}
              </Typography>
            </Box>
          )}

          {progress && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {progress.label}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {progress.value}
                {progress.total && `/${progress.total}`}
              </Typography>
            </Box>
          )}

          {badge && (
            <Box mt={2}>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: `${badge.color || 'primary'}.main`,
                  color: 'white',
                }}
              >
                {badge.label}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
