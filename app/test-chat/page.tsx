"use client";

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert
} from '@mui/material';
import { Send } from '@mui/icons-material';

export default function TestChatPage() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.success) {
        setResponse(data.response);
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const testAPIStatus = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/test-ai');
      const data = await res.json();
      
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setError('Failed to check API status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        AI Chat Test
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Test AI Response
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Send />}
            >
              Send
            </Button>
          </Box>

          <Button
            variant="outlined"
            onClick={testAPIStatus}
            disabled={loading}
            sx={{ mb: 2 }}
          >
            Check API Status
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {response && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Response:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    backgroundColor: 'grey.100',
                    p: 2,
                    borderRadius: 1
                  }}
                >
                  {response}
                </Typography>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Instructions
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            1. Click &quot;Check API Status&quot; to verify AI API configuration
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            2. Enter a message and click &quot;Send&quot; to test AI response
          </Typography>
          <Typography variant="body2">
            3. Check the response to see if AI is working properly
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
