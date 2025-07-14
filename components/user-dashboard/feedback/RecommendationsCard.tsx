"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,

  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  Warning,
  Lightbulb,
  School,
  CheckCircle,
  Star,
  ArrowForward,
  BookmarkBorder
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface RecommendationsCardProps {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  nextSteps: string[];
}

export const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  strengths,
  improvements,
  recommendations,
  nextSteps
}) => {
  const handleSaveRecommendations = () => {
    // Implementation for saving recommendations
    console.log('Saving recommendations...');
  };

  const handleStartLearning = () => {
    // Implementation for starting learning path
    console.log('Starting learning path...');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Personalized Recommendations
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<BookmarkBorder />}
                onClick={handleSaveRecommendations}
                size="small"
              >
                Save
              </Button>
              <Button
                variant="contained"
                startIcon={<School />}
                onClick={handleStartLearning}
                size="small"
              >
                Start Learning
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 3,
            }}
          >
            {/* Strengths */}
            {strengths.length > 0 && (
              <Box>
                <Card variant="outlined" sx={{ height: '100%', bgcolor: 'success.50' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <TrendingUp color="success" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                        Your Strengths
                      </Typography>
                      <Chip
                        label={strengths.length}
                        size="small"
                        color="success"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Areas where you excel and should continue to build upon
                    </Typography>
                    
                    <List dense sx={{ p: 0 }}>
                      {strengths.map((strength, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <CheckCircle color="success" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={strength}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Areas for Improvement */}
            {improvements.length > 0 && (
              <Box>
                <Card variant="outlined" sx={{ height: '100%', bgcolor: 'warning.50' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Warning color="warning" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.main' }}>
                        Focus Areas
                      </Typography>
                      <Chip
                        label={improvements.length}
                        size="small"
                        color="warning"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Skills that need attention to improve your overall performance
                    </Typography>
                    
                    <List dense sx={{ p: 0 }}>
                      {improvements.map((improvement, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <ListItem sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              <Warning color="warning" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText
                              primary={improvement}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                sx: { fontWeight: 500 }
                              }}
                            />
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Lightbulb color="primary" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        Personalized Recommendations
                      </Typography>
                      <Chip
                        label={recommendations.length}
                        size="small"
                        color="primary"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Tailored suggestions to help you improve and reach your goals
                    </Typography>
                    
                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                        gap: 2,
                      }}
                    >
                      {recommendations.map((recommendation, index) => (
                        <Box key={index}>
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                              <CardContent sx={{ p: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                  <Star color="primary" fontSize="small" sx={{ mt: 0.5 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {recommendation}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}

            {/* Next Steps */}
            {nextSteps.length > 0 && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Card variant="outlined" sx={{ bgcolor: 'secondary.50' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <School color="secondary" />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        Your Learning Path
                      </Typography>
                      <Chip
                        label={`${nextSteps.length} steps`}
                        size="small"
                        color="secondary"
                        sx={{ ml: 'auto' }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Follow these steps to systematically improve your skills
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {nextSteps.map((step, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Card variant="outlined" sx={{ bgcolor: 'background.paper' }}>
                            <CardContent sx={{ p: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box
                                  sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '50%',
                                    bgcolor: 'secondary.main',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>
                                  {step}
                                </Typography>
                                <ArrowForward color="action" fontSize="small" />
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ready to start your improvement journey?
                      </Typography>
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<School />}
                        onClick={handleStartLearning}
                      >
                        Begin Learning Path
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
