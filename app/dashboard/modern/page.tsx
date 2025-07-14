"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, CircularProgress, Typography } from '@mui/material';

export default function ModernDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the actual dashboard home page
    router.replace('/dashboard/home');
  }, [router]);

  // Show loading while redirecting
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        gap: 2,
      }}
    >
      <CircularProgress size={60} sx={{ color: 'white' }} />
      <Typography variant="h6">
        Redirecting to Dashboard...
      </Typography>
    </Box>
  );
}
