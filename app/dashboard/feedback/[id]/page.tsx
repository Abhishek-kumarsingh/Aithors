"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  Divider
} from '@mui/material';

import {
  ArrowBack,
  Assessment,
  TrendingUp,
  Schedule,
  CheckCircle,
  Error,
  Share,
  Download,
  Refresh
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

// Import components
import { TopNavigation } from '@/components/user-dashboard/TopNavigation';
import { PerformanceChart } from '@/components/user-dashboard/PerformanceChart';
import { FeedbackSummaryCard } from '@/components/user-dashboard/feedback/FeedbackSummaryCard';
import { SkillBreakdownCard } from '@/components/user-dashboard/feedback/SkillBreakdownCard';
import { RecommendationsCard } from '@/components/user-dashboard/feedback/RecommendationsCard';

interface TestResult {
  id: string;
  testTitle: string;
  testType: string;
  testCategory: string;
  difficulty: string;
  performance: {
    score: number;
    accuracy: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
    averageTimePerQuestion: number;
  };
  feedback: {
    overallFeedback: string;
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    nextSteps: string[];
  };
  skillAnalysis: {
    [skillName: string]: {
      totalQuestions: number;
      correctAnswers: number;
      accuracy: number;
      averageTime: number;
    };
  };
  questionResults: any[];
  createdAt: string;
  grade: string;
}

export default function FeedbackDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch test result details
  const fetchTestResult = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/test-results/${params.id}`);
      
      if (!response.ok) {
        throw new globalThis.Error('Failed to fetch test result');
      }

      const data = await response.json();
      setTestResult(data.testResult);

    } catch (error) {
      console.error('Error fetching test result:', error);
      setError('Failed to load test result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated' && params.id) {
      fetchTestResult();
    }
  }, [status, params.id]);

  const handleGoBack = () => {
    router.push('/dashboard/feedback');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Test Result - ${testResult?.testTitle}`,
          text: `I scored ${testResult?.performance.score}% on ${testResult?.testTitle}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    window.print();
  };

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

  if (error || !testResult) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" action={
          <Button onClick={fetchTestResult} startIcon={<Refresh />}>
            Retry
          </Button>
        }>
          {error || 'Test result not found'}
        </Alert>
      </Container>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prepare skill data for chart
  const skillData = Object.entries(testResult.skillAnalysis || {}).map(([skill, data]) => ({
    name: skill,
    accuracy: Math.round(data.accuracy),
    questions: data.totalQuestions,
    correct: data.correctAnswers
  }));

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation */}
      <TopNavigation
        currentSection={4}
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
              Feedback
            </Link>
            <Typography variant="body2" color="text.primary">
              {testResult.testTitle}
            </Typography>
          </Breadcrumbs>

          {/* Header */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: getScoreColor(testResult.performance.score),
                        fontSize: '1.5rem',
                        fontWeight: 700
                      }}
                    >
                      {testResult.grade}
                    </Avatar>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {testResult.testTitle}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={testResult.testType} color="primary" size="small" />
                        <Chip label={testResult.testCategory} variant="outlined" size="small" />
                        <Chip label={testResult.difficulty} color="secondary" size="small" />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary">
                    Completed on {formatDate(testResult.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShare}
                    >
                      Share
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownload}
                    >
                      Export
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

          {/* Performance Overview */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, mb: 4 }}>
            <Box sx={{ flex: 1 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Performance Overview
                  </Typography>
                  
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 3 }}>
                    <Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: getScoreColor(testResult.performance.score) }}>
                          {testResult.performance.score}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Score
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {testResult.performance.accuracy}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Accuracy
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                          {testResult.performance.correctAnswers}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Correct
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: 'info.main' }}>
                          {formatTime(testResult.performance.timeSpent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Time
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Progress Bars */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Overall Score</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {testResult.performance.score}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={testResult.performance.score}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            bgcolor: getScoreColor(testResult.performance.score)
                          }
                        }}
                      />
                    </Box>
                    
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Questions Answered</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {testResult.performance.correctAnswers}/{testResult.performance.totalQuestions}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(testResult.performance.correctAnswers / testResult.performance.totalQuestions) * 100}
                        sx={{ height: 8, borderRadius: 4 }}
                        color="success"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>

            <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
              <FeedbackSummaryCard
                feedback={testResult.feedback}
                performance={testResult.performance}
              />
            </Box>
          </Box>

          {/* Skill Analysis */}
          {skillData.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 4 }}>
              <Box sx={{ flex: 1 }}>
                <Card>
                  <CardContent>
                    <PerformanceChart
                      title="Skill-wise Performance"
                      subtitle="Your performance across different skills"
                      data={skillData}
                      chartType="radar"
                      dataKey="accuracy"
                      xAxisKey="name"
                      color="#3b82f6"
                      height={400}
                      showLegend={false}
                      variant="detailed"
                    />
                  </CardContent>
                </Card>
              </Box>

              <Box sx={{ width: { xs: '100%', lg: '33.333%' } }}>
                <SkillBreakdownCard skillAnalysis={testResult.skillAnalysis} />
              </Box>
            </Box>
          )}

          {/* Recommendations */}
          <RecommendationsCard
            strengths={testResult.feedback.strengths}
            improvements={testResult.feedback.improvements}
            recommendations={testResult.feedback.recommendations}
            nextSteps={testResult.feedback.nextSteps}
          />
        </motion.div>
      </Container>
    </Box>
  );
}
