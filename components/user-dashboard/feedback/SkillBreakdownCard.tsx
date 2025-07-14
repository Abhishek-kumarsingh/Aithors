"use client";

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Star,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface SkillAnalysis {
  [skillName: string]: {
    totalQuestions: number;
    correctAnswers: number;
    accuracy: number;
    averageTime: number;
  };
}

interface SkillBreakdownCardProps {
  skillAnalysis: SkillAnalysis;
}

export const SkillBreakdownCard: React.FC<SkillBreakdownCardProps> = ({
  skillAnalysis
}) => {
  const getSkillLevel = (accuracy: number) => {
    if (accuracy >= 90) return { level: 'Expert', color: '#10b981', icon: <Star /> };
    if (accuracy >= 80) return { level: 'Advanced', color: '#3b82f6', icon: <TrendingUp /> };
    if (accuracy >= 70) return { level: 'Intermediate', color: '#f59e0b', icon: <TrendingFlat /> };
    if (accuracy >= 60) return { level: 'Beginner', color: '#ef4444', icon: <TrendingDown /> };
    return { level: 'Needs Work', color: '#dc2626', icon: <Warning /> };
  };

  const getPerformanceIcon = (accuracy: number) => {
    if (accuracy >= 80) return <CheckCircle color="success" />;
    if (accuracy >= 60) return <Warning color="warning" />;
    return <Warning color="error" />;
  };

  const skillEntries = Object.entries(skillAnalysis).map(([skill, data]) => ({
    name: skill,
    ...data,
    level: getSkillLevel(data.accuracy)
  }));

  // Sort by accuracy (best first)
  skillEntries.sort((a, b) => b.accuracy - a.accuracy);

  const topSkill = skillEntries[0];
  const weakestSkill = skillEntries[skillEntries.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Skill Breakdown
          </Typography>

          {/* Top and Weakest Skills */}
          {topSkill && weakestSkill && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                    Strongest Skill
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {topSkill.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(topSkill.accuracy)}% accuracy
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                  <Star />
                </Avatar>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                    Focus Area
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {weakestSkill.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(weakestSkill.accuracy)}% accuracy
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                  <Warning />
                </Avatar>
              </Box>
            </Box>
          )}

          {/* Detailed Skill List */}
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
            Detailed Analysis
          </Typography>

          <List dense sx={{ p: 0 }}>
            {skillEntries.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {skill.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getPerformanceIcon(skill.accuracy)}
                          <Chip
                            label={skill.level.level}
                            size="small"
                            sx={{
                              bgcolor: skill.level.color,
                              color: 'white',
                              fontSize: '0.75rem',
                              height: 20
                            }}
                          />
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {skill.correctAnswers}/{skill.totalQuestions} correct
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {Math.round(skill.accuracy)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={skill.accuracy}
                          sx={{
                            height: 4,
                            borderRadius: 2,
                            bgcolor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 2,
                              bgcolor: skill.level.color
                            }
                          }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Avg. time: {Math.round(skill.averageTime)}s per question
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < skillEntries.length - 1 && (
                  <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', mx: 0 }} />
                )}
              </motion.div>
            ))}
          </List>

          {/* Summary Stats */}
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 1, display: 'block' }}>
              Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Skills Tested:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {skillEntries.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Average Accuracy:
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {Math.round(skillEntries.reduce((sum, skill) => sum + skill.accuracy, 0) / skillEntries.length)}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="caption" color="text.secondary">
                Strong Skills (≥80%):
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'success.main' }}>
                {skillEntries.filter(skill => skill.accuracy >= 80).length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};
