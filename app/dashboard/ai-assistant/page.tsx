"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Avatar,
  Button,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Drawer,
  AppBar,
  Toolbar,
  Divider,
  Menu,
  MenuItem,
  Tooltip,
  Fab
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Add,
  Menu as MenuIcon,
  History,
  Delete,
  Edit,
  AttachFile,
  Mic,
  Stop,
  Home,
  MoreVert
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  provider?: string;
  tokens?: number;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatGPTAIAssistant() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatSessions();
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Save current session to localStorage
    if (currentSessionId && messages.length > 0) {
      const currentSession = chatSessions.find(s => s.id === currentSessionId);
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          messages,
          updatedAt: new Date()
        };
        const updatedSessions = chatSessions.map(s => 
          s.id === currentSessionId ? updatedSession : s
        );
        setChatSessions(updatedSessions);
        localStorage.setItem('ai-chat-sessions', JSON.stringify(updatedSessions));
      }
    }
  }, [messages, currentSessionId, chatSessions]);

  const loadChatSessions = () => {
    const saved = localStorage.getItem('ai-chat-sessions');
    if (saved) {
      const sessions = JSON.parse(saved).map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
      setChatSessions(sessions);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setSidebarOpen(false);
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setSidebarOpen(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    localStorage.setItem('ai-chat-sessions', JSON.stringify(updatedSessions));
    
    if (currentSessionId === sessionId) {
      setCurrentSessionId(null);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Create new session if none exists
    if (!currentSessionId) {
      createNewChat();
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai-assistant/simple-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          category: 'general'
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: 'assistant',
          timestamp: new Date(),
          provider: data.provider,
          tokens: data.tokens
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update session title if it's the first message
        if (messages.length === 0) {
          const title = inputMessage.length > 30 
            ? inputMessage.substring(0, 30) + '...' 
            : inputMessage;
          
          setChatSessions(prev => prev.map(s => 
            s.id === currentSessionId ? { ...s, title } : s
          ));
        }
      } else {
        setError(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f7f7f8' }}>
      {/* Sidebar */}
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#171717',
            color: 'white',
            borderRight: 'none'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={createNewChat}
            sx={{
              color: 'white',
              borderColor: 'rgba(255,255,255,0.2)',
              '&:hover': {
                borderColor: 'rgba(255,255,255,0.4)',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            New Chat
          </Button>
        </Box>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {chatSessions.map((session) => (
            <ListItem key={session.id} disablePadding>
              <ListItemButton
                onClick={() => loadChatSession(session.id)}
                selected={currentSessionId === session.id}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                <ListItemText
                  primary={session.title}
                  secondary={session.updatedAt.toLocaleDateString()}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    noWrap: true
                  }}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.6)'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Chat Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            bgcolor: 'white', 
            color: 'black',
            borderBottom: '1px solid #e5e5e5'
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => setSidebarOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <Avatar sx={{ bgcolor: '#10a37f', mr: 2 }}>
                <SmartToy />
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                ChatGPT
              </Typography>
            </Box>

            <IconButton onClick={() => router.push('/dashboard/home')}>
              <Home />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Messages Area */}
        <Box sx={{ 
          flex: 1, 
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {messages.length === 0 ? (
            <Box sx={{ 
              flex: 1,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              p: 4,
              textAlign: 'center'
            }}>
              <SmartToy sx={{ fontSize: 80, color: '#10a37f', mb: 2, opacity: 0.7 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                How can I help you today?
              </Typography>
              <Typography variant="body1" color="text.secondary">
                I can assist with coding, interviews, career advice, and more.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ maxWidth: 800, mx: 'auto', width: '100%', p: 2 }}>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box sx={{ 
                      display: 'flex',
                      mb: 4,
                      alignItems: 'flex-start',
                      gap: 3
                    }}>
                      <Avatar sx={{ 
                        bgcolor: message.sender === 'user' ? '#6366f1' : '#10a37f',
                        width: 32,
                        height: 32
                      }}>
                        {message.sender === 'user' ? 
                          <Person sx={{ fontSize: 18 }} /> : 
                          <SmartToy sx={{ fontSize: 18 }} />
                        }
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-wrap',
                            lineHeight: 1.6,
                            fontSize: '1rem'
                          }}
                        >
                          {message.content}
                        </Typography>
                        
                        {message.provider && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              mt: 1,
                              display: 'block'
                            }}
                          >
                            {message.timestamp.toLocaleTimeString()} • {message.provider}
                            {message.tokens && ` • ${message.tokens} tokens`}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <Box sx={{ 
                  display: 'flex',
                  mb: 4,
                  alignItems: 'flex-start',
                  gap: 3
                }}>
                  <Avatar sx={{ bgcolor: '#10a37f', width: 32, height: 32 }}>
                    <SmartToy sx={{ fontSize: 18 }} />
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={16} />
                    <Typography variant="body2" color="text.secondary">
                      Thinking...
                    </Typography>
                  </Box>
                </Box>
              )}
              
              <div ref={messagesEndRef} />
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ 
          borderTop: '1px solid #e5e5e5',
          bgcolor: 'white',
          p: 3
        }}>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {error && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#fee2e2', borderRadius: 1 }}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            )}
            
            <Paper
              elevation={1}
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                p: 1,
                borderRadius: 3,
                border: '1px solid #e5e5e5'
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={4}
                placeholder="Message ChatGPT..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1rem', p: 1 }
                }}
              />
              
              <Box sx={{ display: 'flex', gap: 0.5, ml: 1 }}>
                <IconButton
                  size="small"
                  disabled={isLoading}
                  sx={{ color: 'text.secondary' }}
                >
                  <AttachFile fontSize="small" />
                </IconButton>
                
                <IconButton
                  size="small"
                  disabled={isLoading}
                  onClick={sendMessage}
                  sx={{
                    bgcolor: inputMessage.trim() ? '#10a37f' : 'transparent',
                    color: inputMessage.trim() ? 'white' : 'text.secondary',
                    '&:hover': {
                      bgcolor: inputMessage.trim() ? '#0d8f6f' : 'rgba(0,0,0,0.04)'
                    }
                  }}
                >
                  {isLoading ? 
                    <CircularProgress size={16} color="inherit" /> : 
                    <Send fontSize="small" />
                  }
                </IconButton>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
