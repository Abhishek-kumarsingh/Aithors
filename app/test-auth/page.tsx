'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Divider,
  Grid
} from '@mui/material';

export default function TestAuthPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const testSendOtp = async () => {
    if (!email) {
      setMessage('Please enter an email');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/send-otp-simple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: 'Test User' })
      });

      const data = await response.json();
      
      if (response.ok) {
        setGeneratedOtp(data.debug?.otp || '');
        setMessage(`✅ OTP sent! Generated OTP: ${data.debug?.otp || 'Check console'}`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testVerifyOtp = async () => {
    if (!email || !otp) {
      setMessage('Please enter email and OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ OTP verified successfully!');
      } else {
        setMessage(`❌ Verification failed: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testGoogleAuth = async () => {
    setLoading(true);
    try {
      const result = await signIn('google', { 
        callbackUrl: '/dashboard',
        redirect: false 
      });
      
      if (result?.error) {
        setMessage(`❌ Google auth error: ${result.error}`);
      } else if (result?.url) {
        setMessage('✅ Google auth initiated, redirecting...');
        window.location.href = result.url;
      } else {
        setMessage('✅ Google auth successful!');
      }
    } catch (error) {
      setMessage(`❌ Google auth error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCredentialsAuth = async () => {
    if (!email) {
      setMessage('Please enter email for credentials test');
      return;
    }

    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: email,
        password: 'demo123', // Test with demo password
        redirect: false
      });

      if (result?.error) {
        setMessage(`❌ Credentials auth error: ${result.error}`);
      } else if (result?.ok) {
        setMessage('✅ Credentials auth successful!');
        // Get session to verify
        const session = await getSession();
        setMessage(prev => prev + ` Session: ${JSON.stringify(session?.user)}`);
      }
    } catch (error) {
      setMessage(`❌ Credentials auth error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        🧪 Authentication Testing
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        {/* OTP Testing */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📧 OTP Testing
            </Typography>
            
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              type="email"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={testSendOtp}
                disabled={loading}
                sx={{ mb: 1 }}
              >
                Send OTP
              </Button>
            </Box>

            {generatedOtp && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Generated OTP: <strong>{generatedOtp}</strong>
              </Alert>
            )}

            <TextField
              fullWidth
              label="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 6 }}
            />

            <Button
              fullWidth
              variant="outlined"
              onClick={testVerifyOtp}
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Verify OTP
            </Button>
          </Paper>
        </Box>

        {/* OAuth Testing */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🔐 OAuth Testing
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={testGoogleAuth}
              disabled={loading}
              sx={{ mb: 2, bgcolor: '#4285f4' }}
            >
              Test Google OAuth
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <Button
              fullWidth
              variant="outlined"
              onClick={testCredentialsAuth}
              disabled={loading}
            >
              Test Credentials Auth
            </Button>

            <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
              Uses demo@example.com / demo123
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Results */}
      {message && (
        <Box sx={{ mt: 3 }}>
          <Alert 
            severity={message.includes('✅') ? 'success' : 'error'}
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {message}
          </Alert>
        </Box>
      )}

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          variant="text"
          onClick={() => {
            setMessage('');
            setOtp('');
            setGeneratedOtp('');
          }}
        >
          Clear Results
        </Button>
      </Box>
    </Container>
  );
}
