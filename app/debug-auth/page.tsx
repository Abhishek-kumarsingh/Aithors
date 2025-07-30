'use client';

import { useState, useEffect } from 'react';
import { signIn, getProviders, getCsrfToken } from 'next-auth/react';
import { 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Alert,
  Divider,
  TextField
} from '@mui/material';

export default function DebugAuthPage() {
  const [message, setMessage] = useState('');
  const [providers, setProviders] = useState<any>(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load providers and CSRF token on mount
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const [providersData, csrf] = await Promise.all([
        getProviders(),
        getCsrfToken()
      ]);
      
      setProviders(providersData);
      setCsrfToken(csrf || '');
      setMessage('✅ Auth data loaded successfully');
    } catch (error) {
      setMessage(`❌ Error loading auth data: ${error}`);
    }
  };

  const testGoogleSignIn = async () => {
    setLoading(true);
    setMessage('🔄 Testing Google sign-in...');
    
    try {
      console.log('🔍 Starting Google OAuth with signIn...');
      
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/dashboard'
      });
      
      console.log('🔍 signIn result:', result);
      
      if (result?.error) {
        setMessage(`❌ Google OAuth Error: ${result.error}`);
      } else if (result?.url) {
        setMessage(`✅ Redirect URL received: ${result.url}`);
        console.log('🔍 Redirecting to:', result.url);
        // Manual redirect for testing
        window.location.href = result.url;
      } else if (result?.ok) {
        setMessage('✅ Sign-in successful!');
      } else {
        setMessage(`⚠️ Unexpected result: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('🔍 Google OAuth error:', error);
      setMessage(`❌ Exception during Google OAuth: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectGoogleUrl = () => {
    const baseUrl = window.location.origin;
    const googleUrl = `${baseUrl}/api/auth/signin/google?callbackUrl=${encodeURIComponent('/dashboard')}`;
    setMessage(`🔗 Testing direct Google URL: ${googleUrl}`);
    window.location.href = googleUrl;
  };

  const testManualForm = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/signin/google';
    
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrfToken';
    csrfInput.value = csrfToken;
    
    const callbackInput = document.createElement('input');
    callbackInput.type = 'hidden';
    callbackInput.name = 'callbackUrl';
    callbackInput.value = '/dashboard';
    
    form.appendChild(csrfInput);
    form.appendChild(callbackInput);
    document.body.appendChild(form);
    
    setMessage('🔄 Submitting manual form...');
    form.submit();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        🔧 Authentication Debug Console
      </Typography>

      {/* Environment Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🌍 Environment Information
        </Typography>
        <Typography variant="body2">
          <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side'}
        </Typography>
        <Typography variant="body2">
          <strong>Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'Server-side'}
        </Typography>
        <Typography variant="body2">
          <strong>CSRF Token:</strong> {csrfToken ? 'Available' : 'Not loaded'}
        </Typography>
      </Paper>

      {/* Providers Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🔐 Available Providers
        </Typography>
        
        {providers ? (
          <Box>
            <Typography variant="body2" gutterBottom>
              <strong>Loaded Providers:</strong> {Object.keys(providers).join(', ')}
            </Typography>
            
            {providers.google && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2">Google Provider Config:</Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  ID: {providers.google.id}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  Name: {providers.google.name}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  Type: {providers.google.type}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  Sign-in URL: {providers.google.signinUrl}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  Callback URL: {providers.google.callbackUrl}
                </Typography>
              </Box>
            )}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading providers...
          </Typography>
        )}
      </Paper>

      {/* Test Methods */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          🧪 Test Google OAuth Methods
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
          <Button
            variant="contained"
            onClick={testGoogleSignIn}
            disabled={loading}
            sx={{ bgcolor: '#4285f4' }}
          >
            Method 1: signIn(&apos;google&apos;) with redirect: false
          </Button>

          <Button
            variant="outlined"
            onClick={testDirectGoogleUrl}
            sx={{ borderColor: '#4285f4', color: '#4285f4' }}
          >
            Method 2: Direct URL Navigation
          </Button>

          <Button
            variant="outlined"
            onClick={testManualForm}
            disabled={!csrfToken}
            sx={{ borderColor: '#34a853', color: '#34a853' }}
          >
            Method 3: Manual Form Submission
          </Button>
        </Box>
      </Paper>

      {/* Expected URLs */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          📋 Expected Google OAuth URLs
        </Typography>
        
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mb: 1 }}>
          <strong>Sign-in URL:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/signin/google
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem', mb: 1 }}>
          <strong>Callback URL:</strong> {typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback/google
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle2" gutterBottom>
          Google Cloud Console Configuration:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          • Authorized JavaScript origins: {typeof window !== 'undefined' ? window.location.origin : ''}
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          • Authorized redirect URIs: {typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/callback/google
        </Typography>
      </Paper>

      {/* Results */}
      {message && (
        <Box sx={{ mb: 3 }}>
          <Alert 
            severity={
              message.includes('✅') ? 'success' : 
              message.includes('🔄') ? 'info' : 
              message.includes('⚠️') ? 'warning' : 'error'
            }
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {message}
          </Alert>
        </Box>
      )}

      <Box sx={{ textAlign: 'center' }}>
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
