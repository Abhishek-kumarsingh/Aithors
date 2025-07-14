"use client";

import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { Timer, Pause } from '@mui/icons-material';

interface InterviewTimerProps {
  timeElapsed: number; // in seconds
  isPaused: boolean;
  totalDuration?: number; // in seconds
}

export const InterviewTimer: React.FC<InterviewTimerProps> = ({
  timeElapsed,
  isPaused,
  totalDuration
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (!totalDuration) return 'white';
    
    const percentage = (timeElapsed / totalDuration) * 100;
    if (percentage > 90) return '#ef4444'; // Red
    if (percentage > 75) return '#f59e0b'; // Orange
    return 'white';
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Timer sx={{ color: getTimeColor() }} />
      <Typography
        variant="h6"
        sx={{
          fontFamily: 'monospace',
          fontWeight: 600,
          color: getTimeColor()
        }}
      >
        {formatTime(timeElapsed)}
      </Typography>
      {isPaused && (
        <Chip
          icon={<Pause />}
          label="Paused"
          size="small"
          sx={{
            bgcolor: 'rgba(255,255,255,0.2)',
            color: 'white'
          }}
        />
      )}
      {totalDuration && (
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          / {formatTime(totalDuration)}
        </Typography>
      )}
    </Box>
  );
};
