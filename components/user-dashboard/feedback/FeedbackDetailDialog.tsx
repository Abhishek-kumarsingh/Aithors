"use client";

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  LinearProgress,

  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  IconButton
} from '@mui/material';
import {
  Close,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Error as ErrorIcon,
  Schedule,
  Assessment,
  Psychology,
  Code,
  Lightbulb,
  School,
  Star,
  Warning
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { PerformanceChart } from '@/components/user-dashboard/PerformanceChart';

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
  };
  createdAt: string;
}

interface DetailedFeedback {
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  nextSteps: string[];
  skillAnalysis: {
    [skillName: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
  questionResults: {
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    skillTags: string[];
  }[];
}

interface FeedbackDetailDialogProps {
  open: boolean;
  onClose: () => void;
  testResult: TestResult;
}

export const FeedbackDetailDialog: React.FC<FeedbackDetailDialogProps> = ({
  open,
  onClose,
  testResult
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [detailedFeedback, setDetailedFeedback] = useState<DetailedFeedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch detailed feedback
  const fetchDetailedFeedback = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/test-results/${testResult.id}/detailed`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch detailed feedback');
      }

      const data = await response.json();
      setDetailedFeedback(data.feedback);

    } catch (error) {
      console.error('Error fetching detailed feedback:', error);
      setError('Failed to load detailed feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && testResult.id) {
      fetchDetailedFeedback();
    }
  }, [open, testResult.id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const skillData = detailedFeedback ? Object.entries(detailedFeedback.skillAnalysis).map(([skill, data]) => ({
    name: skill,
    percentage: data.percentage,
    correct: data.correct,
    total: data.total
  })) : [];

  const renderOverviewTab = () => (
    <Box sx={{ p: 3 }}>
      {/* Performance Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Performance Summary
          </Typography>
          
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Box sx={{ textAlign: 'center', p: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: getScoreColor(testResult.performance.score),
                    fontSize: '2rem',
                    fontWeight: 700,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {getGrade(testResult.performance.score)}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {testResult.performance.score}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Overall Score
                </Typography>
              </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Accuracy</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {testResult.performance.accuracy}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={testResult.performance.accuracy}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Questions Correct</Typography>
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
                
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip
                    icon={<Schedule />}
                    label={formatTime(testResult.performance.timeSpent)}
                    variant="outlined"
                    size="small"
                  />
                  <Chip
                    icon={<Assessment />}
                    label={`${Math.round(testResult.performance.timeSpent / testResult.performance.totalQuestions)}s/Q`}
                    variant="outlined"
                    size="small"
                  />
                </Box>
              </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Overall Feedback */}
      {detailedFeedback?.overallFeedback && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Overall Feedback
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                {detailedFeedback.overallFeedback}
              </Typography>
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );

  const renderSkillAnalysisTab = () => (
    <Box sx={{ p: 3 }}>
      {skillData.length > 0 ? (
        <>
          {/* Skill Performance Chart */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <PerformanceChart
                title="Skill-wise Performance"
                subtitle="Your performance across different skills"
                data={skillData}
                chartType="bar"
                dataKey="percentage"
                xAxisKey="name"
                color="#3b82f6"
                height={300}
                showLegend={false}
                variant="minimal"
              />
            </CardContent>
          </Card>

          {/* Detailed Skill Breakdown */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Detailed Skill Analysis
              </Typography>
              
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  gap: 2,
                }}
              >
                {skillData.map((skill, index) => (
                  <Box key={index}>
                    <Card variant="outlined">
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {skill.name}
                          </Typography>
                          <Chip
                            label={`${skill.percentage}%`}
                            size="small"
                            color={skill.percentage >= 80 ? 'success' : skill.percentage >= 60 ? 'warning' : 'error'}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {skill.correct} out of {skill.total} questions correct
                        </Typography>
                        
                        <LinearProgress
                          variant="determinate"
                          value={skill.percentage}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: skill.percentage >= 80 ? '#10b981' : skill.percentage >= 60 ? '#f59e0b' : '#ef4444'
                            }
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert severity="info">
          Skill analysis data is not available for this test.
        </Alert>
      )}
    </Box>
  );

  const renderRecommendationsTab = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {/* Strengths */}
        {detailedFeedback?.strengths && detailedFeedback.strengths.length > 0 && (
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUp color="success" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                    Strengths
                  </Typography>
                </Box>
                
                <List dense>
                  {detailedFeedback.strengths.map((strength, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={strength}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Areas for Improvement */}
        {detailedFeedback?.improvements && detailedFeedback.improvements.length > 0 && (
          <Box>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingDown color="warning" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                    Areas for Improvement
                  </Typography>
                </Box>
                
                <List dense>
                  {detailedFeedback.improvements.map((improvement, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Warning color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={improvement}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Recommendations */}
        {detailedFeedback?.recommendations && detailedFeedback.recommendations.length > 0 && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Lightbulb color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    Recommendations
                  </Typography>
                </Box>
                
                <List dense>
                  {detailedFeedback.recommendations.map((recommendation, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Star color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={recommendation}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Next Steps */}
        {detailedFeedback?.nextSteps && detailedFeedback.nextSteps.length > 0 && (
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <School color="secondary" />
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                    Next Steps
                  </Typography>
                </Box>
                
                <List dense>
                  {detailedFeedback.nextSteps.map((step, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                          {index + 1}.
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={step}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        )}
      </Box>
    </Box>
  );

  const renderQuestionReviewTab = () => (
    <Box sx={{ p: 3 }}>
      {detailedFeedback?.questionResults && detailedFeedback.questionResults.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {detailedFeedback.questionResults.map((question, index) => (
            <Card key={question.questionId} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, flex: 1 }}>
                    Question {index + 1}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      icon={question.isCorrect ? <CheckCircle /> : <ErrorIcon />}
                      label={question.isCorrect ? 'Correct' : 'Incorrect'}
                      color={question.isCorrect ? 'success' : 'error'}
                      size="small"
                    />
                    <Chip
                      icon={<Schedule />}
                      label={formatTime(question.timeSpent)}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {question.question}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Your Answer:
                    </Typography>
                    <Typography variant="body2" color={question.isCorrect ? 'success.main' : 'error.main'}>
                      {question.userAnswer}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                      Correct Answer:
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      {question.correctAnswer}
                    </Typography>
                  </Box>
                </Box>
                
                {question.skillTags && question.skillTags.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                      Skills tested:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {question.skillTags.map((tag, tagIndex) => (
                        <Chip key={tagIndex} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Alert severity="info">
          Question-by-question review is not available for this test.
        </Alert>
      )}
    </Box>
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          Detailed Feedback - {testResult.testTitle}
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
              <Tab label="Overview" />
              <Tab label="Skill Analysis" />
              <Tab label="Recommendations" />
              <Tab label="Question Review" />
            </Tabs>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 0 && renderOverviewTab()}
                {activeTab === 1 && renderSkillAnalysisTab()}
                {activeTab === 2 && renderRecommendationsTab()}
                {activeTab === 3 && renderQuestionReviewTab()}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button variant="contained" onClick={() => window.print()}>
          Export Report
        </Button>
      </DialogActions>
    </Dialog>
  );
};
