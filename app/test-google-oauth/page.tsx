'use client';

import { useState } from 'react';
import { signIn, getProviders } from 'next-auth/react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Alert,
  Divider
} from '@mui/material';

export default function TestGoogleOAuthPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<any>(null);

  const testProviders = async () => {
    try {
      const providers = await getProviders();
      setProviders(providers);
      setMessage(`✅ Providers loaded: ${Object.keys(providers || {}).join(', ')}`);
    } catch (error) {
      setMessage(`❌ Error loading providers: ${error}`);
    }
  };

  const testGoogleOAuth = async () => {
    setLoading(true);
    setMessage('🔄 Initiating Google OAuth...');
    
    try {
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard'
      });
      
      if (result?.error) {
        setMessage(`❌ Google OAuth Error: ${result.error}`);
      } else if (result?.url) {
        setMessage(`✅ Google OAuth initiated! Redirecting to: ${result.url}`);
        // Manually redirect to test
        window.location.href = result.url;
      } else {
        setMessage('✅ Google OAuth successful!');
      }
    } catch (error) {
      setMessage(`❌ Google OAuth failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectGoogleUrl = () => {
    const googleAuthUrl = `/api/auth/signin/google?callbackUrl=${encodeURIComponent('/dashboard')}`;
    setMessage(`🔗 Direct Google URL: ${googleAuthUrl}`);
    window.location.href = googleAuthUrl;
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        🧪 Google OAuth Testing
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔍 Test NextAuth Providers
        </Typography>
        
        <Button
          variant="outlined"
          onClick={testProviders}
          sx={{ mb: 2 }}
        >
          Load Providers
        </Button>

        {providers && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Available Providers:</Typography>
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
              {JSON.stringify(providers, null, 2)}
            </pre>
          </Box>
        )}
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔐 Test Google OAuth Methods
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Button
            variant="contained"
            onClick={testGoogleOAuth}
            disabled={loading}
            sx={{ bgcolor: '#4285f4' }}
          >
            Test signIn('google') Method
          </Button>

          <Button
            variant="outlined"
            onClick={testDirectGoogleUrl}
            sx={{ borderColor: '#4285f4', color: '#4285f4' }}
          >
            Test Direct Google URL
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          📋 Environment Check
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}
          </Typography>
          <Typography variant="body2">
            <strong>Google Client ID:</strong> {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}
          </Typography>
          <Typography variant="body2">
            <strong>Google Client Secret:</strong> {process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Expected Google OAuth URLs:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          • Authorized JavaScript origins: {window.location.origin}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          • Authorized redirect URIs: {window.location.origin}/api/auth/callback/google
        </Typography>
      </Paper>

      {message && (
        <Box sx={{ mt: 3 }}>
          <Alert 
            severity={message.includes('✅') ? 'success' : message.includes('🔄') ? 'info' : 'error'}
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {message}
          </Alert>
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="text"
          onClick={() => setMessage('')}
        >
          Clear Results
        </Button>
      </Box>
    </Container>
  );
}
