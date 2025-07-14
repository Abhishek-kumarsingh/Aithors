"use client";

import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  centered?: boolean;
  overlay?: boolean;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message,
  centered = false,
  overlay = false,
  className,
}) => {
  const containerStyles = {
    ...(centered && {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '200px',
    }),
    ...(overlay && {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }),
  };

  return (
    <Box
      data-testid="loading-spinner-container"
      className={className}
      sx={containerStyles}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <CircularProgress
          size={size}
          sx={{
            width: `${size}px !important`,
            height: `${size}px !important`,
          }}
        />
        {message && (
          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
          >
            {message}
          </Typography>
        )}
      </Box>
    </Box>
  );
};
