"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Alert } from "@mui/material";

export default function AdminRedirectPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (status === 'unauthenticated') {
      // Redirect to login if not authenticated
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'admin') {
      // Redirect non-admin users to regular dashboard
      router.push('/dashboard');
      return;
    }

    // Redirect admin users to the actual admin dashboard
    router.push('/dashboard/admin');
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading admin dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        p: 3,
      }}
    >
      {message && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {decodeURIComponent(message)}
        </Alert>
      )}
      <CircularProgress size={40} />
      <Typography variant="body1" color="text.secondary">
        Redirecting to admin dashboard...
      </Typography>
    </Box>
  );
}
