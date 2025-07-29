"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Grid,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add,
  AutoAwesome,
  Refresh,
  Delete,
  Edit,
  Visibility,
  Code,
  Quiz,
  School,
  Architecture
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface GenerationConfig {
  domain: string;
  subDomain: string;
  difficulty: string;
  type: string;
  count: number;
  tags: string[];
  companies: string[];
}

export default function AdminPracticeQuestionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  
  const [config, setConfig] = useState<GenerationConfig>({
    domain: 'frontend',
    subDomain: 'react',
    difficulty: 'medium',
    type: 'mcq',
    count: 5,
    tags: [],
    companies: []
  });

  // Check if user is admin
  useEffect(() => {
    if (session && session.user?.email !== 'alpsingh03@gmail.com') {
      router.push('/dashboard/home');
    }
  }, [session, router]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/practice/questions?limit=50');
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        setError('Failed to fetch questions');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateQuestions = async () => {
    try {
      setGenerating(true);
      setError('');
      setSuccess('');

      const response = await fetch('/api/admin/practice/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully generated ${data.saved} questions!`);
        setGenerateDialogOpen(false);
        fetchQuestions(); // Refresh the list
      } else {
        setError(data.error || 'Failed to generate questions');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const domains = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'fullstack', label: 'Full Stack' },
    { value: 'algorithms', label: 'Algorithms & DS' },
    { value: 'system-design', label: 'System Design' }
  ];

  const subDomains = {
    frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'css'],
    backend: ['nodejs', 'python', 'java', 'databases', 'apis', 'microservices'],
    fullstack: ['mern', 'mean', 'django', 'rails', 'system-design'],
    algorithms: ['arrays', 'strings', 'trees', 'graphs', 'dynamic-programming', 'sorting'],
    'system-design': ['scalability', 'databases', 'caching', 'load-balancing', 'microservices']
  };

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice', icon: <Quiz />, color: '#3b82f6' },
    { value: 'coding', label: 'Coding', icon: <Code />, color: '#10b981' },
    { value: 'subjective', label: 'Subjective', icon: <School />, color: '#f59e0b' },
    { value: 'system-design', label: 'System Design', icon: <Architecture />, color: '#8b5cf6' }
  ];

  const difficulties = ['easy', 'medium', 'hard'];

  if (!session || session.user?.email !== 'alpsingh03@gmail.com') {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          This page is only accessible to administrators.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              🎯 Practice Questions Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Generate and manage practice questions for the question bank
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchQuestions}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AutoAwesome />}
              onClick={() => setGenerateDialogOpen(true)}
              disabled={generating}
            >
              Generate Questions
            </Button>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {questionTypes.map((type) => {
            const count = questions.filter((q: any) => q.type === type.value).length;
            return (
              <Grid key={type.value} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ color: type.color, mr: 1 }}>
                        {type.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {count}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {type.label} Questions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Questions Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Questions ({questions.length})
            </Typography>
            
            {loading ? (
              <LinearProgress />
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Domain</TableCell>
                      <TableCell>Difficulty</TableCell>
                      <TableCell>Time Limit</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {questions.slice(0, 20).map((question: any) => (
                      <TableRow key={question._id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {question.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={question.type} 
                            size="small" 
                            variant="outlined"
                            color={question.type === 'coding' ? 'success' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {question.domain}
                            {question.subDomain && ` / ${question.subDomain}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={question.difficulty} 
                            size="small"
                            color={
                              question.difficulty === 'easy' ? 'success' :
                              question.difficulty === 'medium' ? 'warning' : 'error'
                            }
                          />
                        </TableCell>
                        <TableCell>{question.timeLimit} min</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="View">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton size="small">
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error">
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Generate Questions Dialog */}
        <Dialog open={generateDialogOpen} onClose={() => setGenerateDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Generate Practice Questions</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Domain</InputLabel>
                  <Select
                    value={config.domain}
                    label="Domain"
                    onChange={(e) => setConfig({ ...config, domain: e.target.value, subDomain: '' })}
                  >
                    {domains.map((domain) => (
                      <MenuItem key={domain.value} value={domain.value}>
                        {domain.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Sub Domain</InputLabel>
                  <Select
                    value={config.subDomain}
                    label="Sub Domain"
                    onChange={(e) => setConfig({ ...config, subDomain: e.target.value })}
                  >
                    {subDomains[config.domain as keyof typeof subDomains]?.map((subDomain) => (
                      <MenuItem key={subDomain} value={subDomain}>
                        {subDomain}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Question Type</InputLabel>
                  <Select
                    value={config.type}
                    label="Question Type"
                    onChange={(e) => setConfig({ ...config, type: e.target.value })}
                  >
                    {questionTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={config.difficulty}
                    label="Difficulty"
                    onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                  >
                    {difficulties.map((difficulty) => (
                      <MenuItem key={difficulty} value={difficulty}>
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Questions"
                  value={config.count}
                  onChange={(e) => setConfig({ ...config, count: parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1, max: 20 }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setGenerateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={generateQuestions} 
              variant="contained" 
              disabled={generating}
              startIcon={generating ? <LinearProgress /> : <AutoAwesome />}
            >
              {generating ? 'Generating...' : 'Generate Questions'}
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  );
}
