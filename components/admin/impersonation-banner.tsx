"use client";

import { useState, useEffect } from "react";
import { Alert, AlertTitle, Button, Box } from "@mui/material";
import { ExitToApp } from "@mui/icons-material";

interface ImpersonationState {
  isImpersonating: boolean;
  originalAdminId?: string;
  targetUserId?: string;
  targetUserName?: string;
}

export function ImpersonationBanner() {
  const [impersonationState, setImpersonationState] = useState<ImpersonationState>({
    isImpersonating: false
  });

  useEffect(() => {
    // Check if we're in impersonation mode
    const checkImpersonationState = () => {
      const impersonationData = sessionStorage.getItem('impersonation');
      if (impersonationData) {
        try {
          const data = JSON.parse(impersonationData);
          setImpersonationState({
            isImpersonating: true,
            originalAdminId: data.originalAdminId,
            targetUserId: data.targetUserId,
            targetUserName: data.targetUserName
          });
        } catch (error) {
          console.error('Error parsing impersonation data:', error);
        }
      }
    };

    checkImpersonationState();
    
    // Listen for storage changes
    window.addEventListener('storage', checkImpersonationState);
    
    return () => {
      window.removeEventListener('storage', checkImpersonationState);
    };
  }, []);

  const handleExitImpersonation = async () => {
    try {
      // Call API to exit impersonation
      const response = await fetch('/api/admin/impersonation/exit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear impersonation data
        sessionStorage.removeItem('impersonation');
        setImpersonationState({ isImpersonating: false });
        
        // Redirect to admin dashboard
        window.location.href = '/admin/dashboard';
      } else {
        console.error('Failed to exit impersonation');
      }
    } catch (error) {
      console.error('Error exiting impersonation:', error);
    }
  };

  if (!impersonationState.isImpersonating) {
    return null;
  }

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      <Alert 
        severity="warning" 
        sx={{ 
          borderRadius: 0,
          '& .MuiAlert-message': {
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }}
      >
        <Box>
          <AlertTitle>Admin Impersonation Mode</AlertTitle>
          You are viewing as: <strong>{impersonationState.targetUserName}</strong>
        </Box>
        <Button
          variant="contained"
          size="small"
          startIcon={<ExitToApp />}
          onClick={handleExitImpersonation}
          sx={{ ml: 2 }}
        >
          Exit Impersonation
        </Button>
      </Alert>
    </Box>
  );
}
