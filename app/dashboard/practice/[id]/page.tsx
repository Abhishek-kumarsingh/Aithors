"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Timer,
  PlayArrow,
  Pause,
  Stop,
  CheckCircle,
  Flag,
  Bookmark,
  BookmarkBorder,
  Share,
  Lightbulb
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

// Import components
import { TopNavigation } from '@/components/user-dashboard/TopNavigation';
import { QuestionDisplay } from '@/components/interview/QuestionDisplay';
import { InterviewTimer } from '@/components/interview/InterviewTimer';
import { SubmissionDialog } from '@/components/practice/SubmissionDialog';

interface PracticeQuestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  domain: string;
  category: string;
  tags: string[];
  type: 'mcq' | 'coding' | 'subjective' | 'system-design';
  timeLimit: number;
  points: number;
  content: {
    question: string;
    options?: string[];
    correctAnswer?: string;
    explanation?: string;
    hints?: string[];
    examples?: any[];
    constraints?: string[];
    testCases?: any[];
  };
  attempts: number;
  isBookmarked: boolean;
  companies: string[];
  skills: string[];
}

interface PracticeSession {
  id: string;
  questionId: string;
  startTime: string;
  endTime?: string;
  timeSpent: number;
  answer: string;
  isCompleted: boolean;
  score?: number;
  feedback?: string;
}

export default function PracticeQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [question, setQuestion] = useState<PracticeQuestion | null>(null);
  const [practiceSession, setPracticeSession] = useState<PracticeSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [showHints, setShowHints] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch question data
  const fetchQuestion = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/practice/questions/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }

      const data = await response.json();
      setQuestion(data.question);

      // Start or resume practice session
      await startPracticeSession(data.question);

    } catch (error) {
      console.error('Error fetching question:', error);
      setError('Failed to load question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Start practice session
  const startPracticeSession = async (questionData: PracticeQuestion) => {
    try {
      const response = await fetch('/api/user/practice/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId: questionData.id,
          timeLimit: questionData.timeLimit
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPracticeSession(data.session);
        setTimeElapsed(data.session.timeSpent || 0);
        setIsTimerRunning(true);
        startTimer();
      }
    } catch (error) {
      console.error('Error starting practice session:', error);
    }
  };

  // Timer functions
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        
        // Auto-submit when time limit reached
        if (question && newTime >= question.timeLimit * 60) {
          handleSubmit();
          return newTime;
        }
        
        return newTime;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resumeTimer = () => {
    setIsTimerRunning(true);
    startTimer();
  };

  // Handle answer submission
  const handleSubmit = async () => {
    if (!practiceSession || !question) return;

    pauseTimer();
    
    try {
      const response = await fetch(`/api/user/practice/sessions/${practiceSession.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer,
          timeSpent: timeElapsed
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPracticeSession(data.session);
        setSubmissionDialogOpen(true);
      } else {
        throw new Error('Failed to submit answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError('Failed to submit answer. Please try again.');
      resumeTimer();
    }
  };

  // Handle bookmark toggle
  const handleBookmark = async () => {
    if (!question) return;

    try {
      const response = await fetch(`/api/user/practice/questions/${question.id}/bookmark`, {
        method: 'POST'
      });

      if (response.ok) {
        setQuestion(prev => prev ? { ...prev, isBookmarked: !prev.isBookmarked } : null);
      }
    } catch (error) {
      console.error('Error bookmarking question:', error);
    }
  };

  // Handle navigation
  const handleGoBack = () => {
    if (isTimerRunning) {
      pauseTimer();
    }
    router.push('/dashboard/practice');
  };

  const handleNextQuestion = () => {
    // Logic to navigate to next question
    router.push('/dashboard/practice');
  };

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchQuestion();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [status, params.id]);

  if (status === 'loading' || loading) {
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

  if (error || !question) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Question not found'}
        </Alert>
      </Container>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'hard': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const timeRemaining = Math.max(0, (question.timeLimit * 60) - timeElapsed);
  const progressPercentage = (timeElapsed / (question.timeLimit * 60)) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation */}
      <TopNavigation
        currentSection={2}
        onSectionChange={() => {}}
        user={session?.user}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link
              component="button"
              variant="body2"
              onClick={handleGoBack}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <ArrowBack fontSize="small" />
              Practice
            </Link>
            <Typography variant="body2" color="text.primary">
              {question.title}
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {question.title}
                    </Typography>
                    <Chip
                      label={question.difficulty}
                      sx={{ bgcolor: getDifficultyColor(question.difficulty), color: 'white' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip label={question.domain} color="primary" size="small" />
                    <Chip label={question.category} variant="outlined" size="small" />
                    <Chip label={question.type} color="secondary" size="small" />
                    <Chip label={`${question.points} points`} variant="outlined" size="small" />
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary">
                    {question.description}
                  </Typography>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      variant="outlined"
                      startIcon={question.isBookmarked ? <Bookmark /> : <BookmarkBorder />}
                      onClick={handleBookmark}
                      color={question.isBookmarked ? 'primary' : 'inherit'}
                    >
                      {question.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                    >
                      Share
                    </Button>
                    
                    <Button
                      variant="contained"
                      startIcon={<ArrowBack />}
                      onClick={handleGoBack}
                    >
                      Back
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Timer and Progress */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <InterviewTimer
                    timeElapsed={timeElapsed}
                    totalDuration={question.timeLimit * 60}
                    isPaused={!isTimerRunning}
                  />
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Progress:
                    </Typography>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(progressPercentage, 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: progressPercentage > 80 ? '#ef4444' : progressPercentage > 60 ? '#f59e0b' : '#10b981'
                          }
                        }}
                      />
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {Math.round(progressPercentage)}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Question Content */}
          {/* For coding questions, use full width to accommodate 80/20 split layout */}
          {question.type === 'coding' ? (
            <Box sx={{ width: '100%' }}>
              <QuestionDisplay
                question={{
                  id: question.id,
                  type: question.type as 'mcq' | 'subjective' | 'coding',
                  question: question.content.question,
                  options: question.content.options,
                  correctAnswer: question.content.correctAnswer
                }}
                onAnswerSubmit={(submittedAnswer) => {
                  setAnswer(submittedAnswer);
                  // Handle answer submission logic here
                }}
                isRecording={false}
                onRecordingChange={() => {}}
                isPaused={!isTimerRunning}
              />

              {/* Action buttons for coding questions - placed below the editor */}
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 2,
                mt: 3,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<CheckCircle />}
                  onClick={handleSubmit}
                  disabled={!answer.trim() || practiceSession?.isCompleted}
                >
                  Submit Answer
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Lightbulb />}
                  onClick={() => setShowHints(!showHints)}
                  disabled={!question.content.hints?.length}
                >
                  {showHints ? 'Hide Hints' : 'Show Hints'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Flag />}
                >
                  Report Issue
                </Button>
              </Box>

              {/* Hints for coding questions */}
              {showHints && question.content.hints && question.content.hints.length > 0 && (
                <Card sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Hints 💡
                    </Typography>

                    {question.content.hints.map((hint, index) => (
                      <Alert key={index} severity="info" sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>Hint {index + 1}:</strong> {hint}
                        </Typography>
                      </Alert>
                    ))}
                  </CardContent>
                </Card>
              )}
            </Box>
          ) : (
            /* For non-coding questions, use the original layout */
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <QuestionDisplay
                  question={{
                    id: question.id,
                    type: question.type === 'system-design' ? 'subjective' : question.type as 'mcq' | 'subjective' | 'coding',
                    question: question.content.question,
                    options: question.content.options,
                    correctAnswer: question.content.correctAnswer
                  }}
                  onAnswerSubmit={(submittedAnswer) => {
                    setAnswer(submittedAnswer);
                    // Handle answer submission logic here
                  }}
                  isRecording={false}
                  onRecordingChange={() => {}}
                  isPaused={!isTimerRunning}
                />
              </Box>

              <Box sx={{ width: { xs: '100%', lg: '33.333%' } }}>
                  {/* Action Panel */}
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Actions
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          startIcon={<CheckCircle />}
                          onClick={handleSubmit}
                          disabled={!answer.trim() || practiceSession?.isCompleted}
                          fullWidth
                        >
                          Submit Answer
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<Lightbulb />}
                          onClick={() => setShowHints(!showHints)}
                          disabled={!question.content.hints?.length}
                          fullWidth
                        >
                          {showHints ? 'Hide Hints' : 'Show Hints'}
                        </Button>

                        <Button
                          variant="outlined"
                          startIcon={<Flag />}
                          fullWidth
                        >
                          Report Issue
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  {/* Hints */}
                  {showHints && question.content.hints && question.content.hints.length > 0 && (
                    <Card sx={{ mb: 3 }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          Hints 💡
                        </Typography>

                        {question.content.hints.map((hint, index) => (
                          <Alert key={index} severity="info" sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              <strong>Hint {index + 1}:</strong> {hint}
                            </Typography>
                          </Alert>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Question Info */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Question Info
                      </Typography>

                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Attempts
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {question.attempts} previous attempts
                          </Typography>
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Skills & Tags
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {question.tags.map((tag, index) => (
                              <Chip key={index} label={tag} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </Box>

                        {question.companies.length > 0 && (
                          <>
                            <Divider />
                            <Box>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Companies
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                {question.companies.map((company, index) => (
                                  <Chip key={index} label={company} size="small" color="primary" variant="outlined" />
                                ))}
                              </Box>
                            </Box>
                          </>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )
          }
        </motion.div>
      </Container>

      {/* Submission Dialog */}
      {practiceSession && (
        <SubmissionDialog
          open={submissionDialogOpen}
          onClose={() => setSubmissionDialogOpen(false)}
          session={practiceSession}
          question={question}
          onNextQuestion={handleNextQuestion}
          onRetry={() => window.location.reload()}
        />
      )}
    </Box>
  );
}
