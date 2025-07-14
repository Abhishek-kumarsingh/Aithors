"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipNext,
  Mic,
  MicOff,
  Timer,
  Assessment,
  Code,
  BugReport,
  QuestionAnswer
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import { TopNavigation } from '@/components/user-dashboard/TopNavigation';
import { QuestionDisplay } from '@/components/interview/QuestionDisplay';
import { InterviewTimer } from '@/components/interview/InterviewTimer';

interface Question {
  id: string;
  type: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  userAnswer?: string;
  isCorrect?: boolean;
  timeSpent: number;
  voiceResponse?: {
    audioPath: string;
    transcription: string;
  };
  codeResponse?: {
    language: string;
    code: string;
    output?: string;
    isExecuted: boolean;
  };
}

interface Interview {
  _id: string;
  id?: string; // For compatibility
  title: string;
  type: string;
  status: string;
  difficulty: string;
  questions: Question[];
  duration: number;
  startedAt?: string;
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [interview, setInterview] = useState<Interview | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [generatingQuestions, setGeneratingQuestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});

  // Fetch interview data
  const fetchInterview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/interviews/${params.id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch interview');
      }

      const data = await response.json();
      console.log('Fetched interview data:', data.interview);

      // Generate questions if not already generated
      if (!data.interview.questions || data.interview.questions.length === 0) {
        console.log('Generating questions for interview...', data.interview);
        setGeneratingQuestions(true);
        const questionsGenerated = await generateQuestions(data.interview);
        setGeneratingQuestions(false);

        if (questionsGenerated) {
          // Fetch the updated interview with questions
          console.log('Questions generated, fetching updated interview...');
          const updatedResponse = await fetch(`/api/user/interviews/${params.id}`);
          if (updatedResponse.ok) {
            const updatedData = await updatedResponse.json();
            console.log('Updated interview data:', updatedData.interview);
            setInterview(updatedData.interview);
          } else {
            console.log('Failed to fetch updated interview, using original data');
            setInterview(data.interview);
          }
        } else {
          setError('Failed to generate questions. Please try again.');
          return;
        }
      } else {
        console.log('Interview already has questions:', data.interview.questions.length);
        setInterview(data.interview);
      }

    } catch (error) {
      console.error('Error fetching interview:', error);
      setError('Failed to load interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate questions based on interview setup
  const generateQuestions = async (interviewData: Interview): Promise<boolean> => {
    try {
      console.log('Generating questions for interview:', interviewData.id);
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interviewId: interviewData._id || interviewData.id,
          type: interviewData.type,
          difficulty: interviewData.difficulty,
          setupMethod: 'techstack', // This should come from interview data
          count: 10 // Number of questions to generate
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Questions generated successfully:', data.questions.length);
        return true;
      } else {
        console.error('Failed to generate questions:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      return false;
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchInterview();
    }
  }, [status, params.id]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (interview && !isPaused && !loading) {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [interview, isPaused, loading]);

  // Handle answer submission
  const handleAnswerSubmit = async (answer: any) => {
    if (!interview || !interview.questions[currentQuestionIndex]) return;

    const currentQuestion = interview.questions[currentQuestionIndex];
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: answer
    };
    
    setAnswers(updatedAnswers);

    // Update question with user answer
    const updatedQuestions = [...interview.questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer.text || answer.code || answer.selectedOption,
      timeSpent: timeElapsed,
      codeResponse: answer.code ? {
        language: answer.language || 'javascript',
        code: answer.code,
        output: answer.output,
        isExecuted: answer.isExecuted || false
      } : undefined,
      voiceResponse: answer.voiceData ? {
        audioPath: answer.voiceData.audioPath,
        transcription: answer.voiceData.transcription
      } : undefined
    };

    setInterview(prev => prev ? { ...prev, questions: updatedQuestions } : null);

    // Auto-advance to next question
    if (currentQuestionIndex < interview.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Interview completed
      await completeInterview();
    }
  };

  // Complete interview
  const completeInterview = async () => {
    if (!interview) return;

    try {
      const interviewId = interview._id || interview.id;
      const response = await fetch(`/api/user/interviews/${interviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete',
          data: {
            questions: interview.questions,
            duration: Math.floor(timeElapsed / 60), // Convert to minutes
            completedAt: new Date().toISOString()
          }
        }),
      });

      if (response.ok) {
        router.push(`/dashboard/feedback/${interviewId}`);
      }
    } catch (error) {
      console.error('Error completing interview:', error);
    }
  };

  // Handle pause/resume
  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  // Handle exit interview
  const handleExit = () => {
    setShowExitDialog(true);
  };

  const confirmExit = async () => {
    if (!interview) return;

    try {
      const interviewId = interview._id || interview.id;
      await fetch(`/api/user/interviews/${interviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'cancel'
        }),
      });

      router.push('/dashboard/interview');
    } catch (error) {
      console.error('Error cancelling interview:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: 2 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          {generatingQuestions ? 'Generating interview questions...' : 'Loading interview...'}
        </Typography>
        {generatingQuestions && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
            Please wait while we create personalized questions for your interview. This may take a few moments.
          </Typography>
        )}
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (error || !interview) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Interview not found'}
        </Alert>
      </Container>
    );
  }

  // Check if interview has questions
  if (!interview.questions || interview.questions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          No questions available for this interview. Please try refreshing the page or contact support.
        </Alert>
      </Container>
    );
  }

  const currentQuestion = interview.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation */}
      <TopNavigation
        currentSection={1}
        onSectionChange={() => {}}
        user={session?.user}
      />

      {/* Interview Header */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 2 }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {interview.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <Chip label={interview.type} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                <Chip label={interview.difficulty} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <InterviewTimer timeElapsed={timeElapsed} isPaused={isPaused} />
              <Button
                variant="outlined"
                color="inherit"
                startIcon={isPaused ? <PlayArrow /> : <Pause />}
                onClick={handlePauseResume}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Stop />}
                onClick={handleExit}
              >
                Exit
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Box sx={{ py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Question {currentQuestionIndex + 1} of {interview.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% Complete
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {currentQuestion && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card sx={{ minHeight: '60vh' }}>
                <CardContent sx={{ p: 4 }}>
                  <QuestionDisplay
                    question={currentQuestion}
                    onAnswerSubmit={handleAnswerSubmit}
                    isRecording={isRecording}
                    onRecordingChange={setIsRecording}
                    isPaused={isPaused}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        )}

        {/* Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            variant="outlined"
            disabled={currentQuestionIndex === 0}
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
          >
            Previous
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {interview.questions.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: index === currentQuestionIndex ? 'primary.main' : 
                           index < currentQuestionIndex ? 'success.main' : 'grey.300',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestionIndex(index)}
              />
            ))}
          </Box>
          
          <Button
            variant="contained"
            disabled={currentQuestionIndex === interview.questions.length - 1}
            onClick={() => setCurrentQuestionIndex(prev => Math.min(interview.questions.length - 1, prev + 1))}
            startIcon={<SkipNext />}
          >
            Next
          </Button>
        </Box>
      </Container>

      {/* Exit Confirmation Dialog */}
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Exit Interview</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to exit this interview? Your progress will be saved, but the interview will be marked as incomplete.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Cancel</Button>
          <Button onClick={confirmExit} color="error" variant="contained">
            Exit Interview
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
