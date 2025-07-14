"use client";

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  LinearProgress,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Edit,
  School,
  Work,
  Star,
  TrendingUp,
  EmojiEvents,
  Close,
  Save,
  Person,
  Code,
  Psychology
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  profile?: {
    techStack?: string[];
    experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredDomains?: string[];
    targetRoles?: string[];
    skills?: {
      name: string;
      level: number;
      category: string;
    }[];
    goals?: {
      weeklyInterviews?: number;
      targetScore?: number;
      focusAreas?: string[];
    };
  };
  performance?: {
    totalInterviews?: number;
    averageScore?: number;
    bestScore?: number;
    currentStreak?: number;
  };
}

interface ProfileCardProps {
  user: UserProfile;
  onUpdate?: (updatedProfile: any) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const techStackOptions = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js', 'Express.js',
  'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C++', 'C#', '.NET',
  'PHP', 'Laravel', 'Ruby', 'Rails', 'Go', 'Rust', 'Swift', 'Kotlin',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
  'AWS', 'Azure', 'GCP', 'Git', 'GraphQL', 'REST API'
];

const domainOptions = [
  'Frontend Development', 'Backend Development', 'Full Stack Development',
  'Mobile Development', 'DevOps', 'Data Science', 'Machine Learning',
  'AI/ML', 'Cybersecurity', 'Cloud Computing', 'Game Development'
];

const roleOptions = [
  'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer', 'DevOps Engineer', 'Data Scientist', 'ML Engineer',
  'Product Manager', 'Tech Lead', 'Engineering Manager', 'Solution Architect'
];

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  onUpdate,
  variant = 'default'
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(user.profile || {});

  const handleEdit = () => {
    setEditData(user.profile || {});
    setEditMode(true);
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ profile: editData });
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditData(user.profile || {});
    setEditMode(false);
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#757575';
    }
  };

  const getSkillLevelLabel = (level: number) => {
    if (level <= 3) return 'Beginner';
    if (level <= 6) return 'Intermediate';
    if (level <= 8) return 'Advanced';
    return 'Expert';
  };

  if (variant === 'compact') {
    return (
      <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={user.image}
              sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                {user.name}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                {user.profile?.preferredDomains?.[0] || 'Software Developer'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  size="small"
                  label={user.profile?.experienceLevel || 'Beginner'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}
                />
                <Chip
                  size="small"
                  label={`${user.performance?.currentStreak || 0} day streak`}
                  icon={<EmojiEvents sx={{ fontSize: '0.875rem !important' }} />}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.75rem' }}
                />
              </Box>
            </Box>
            <IconButton onClick={handleEdit} sx={{ color: 'white' }}>
              <Edit />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 3,
              color: 'white',
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={user.image}
                  sx={{ width: 80, height: 80, bgcolor: 'rgba(255,255,255,0.2)' }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    {user.name}
                  </Typography>
                  <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.profile?.experienceLevel || 'Beginner'}
                    size="small"
                    sx={{
                      bgcolor: getExperienceColor(user.profile?.experienceLevel || 'beginner'),
                      color: 'white',
                      fontWeight: 600
                    }}
                  />
                </Box>
              </Box>
              <IconButton onClick={handleEdit} sx={{ color: 'white' }}>
                <Edit />
              </IconButton>
            </Box>

            {/* Performance Stats */}
            <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user.performance?.totalInterviews || 0}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Interviews
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user.performance?.averageScore || 0}%
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Avg Score
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user.performance?.currentStreak || 0}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Day Streak
                </Typography>
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 3 }}>
            {/* Tech Stack */}
            {user.profile?.techStack && user.profile.techStack.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Code color="primary" />
                  Tech Stack
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {user.profile.techStack.slice(0, 8).map((tech, index) => (
                    <Chip
                      key={index}
                      label={tech}
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                  {user.profile.techStack.length > 8 && (
                    <Chip
                      label={`+${user.profile.techStack.length - 8} more`}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Skills */}
            {user.profile?.skills && user.profile.skills.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Psychology color="primary" />
                  Top Skills
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {user.profile.skills.slice(0, 5).map((skill, index) => (
                    <Box key={index}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {skill.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getSkillLevelLabel(skill.level)}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={(skill.level / 10) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            bgcolor: skill.level <= 3 ? '#4caf50' : skill.level <= 6 ? '#ff9800' : skill.level <= 8 ? '#f44336' : '#9c27b0'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Goals */}
            {user.profile?.goals && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Star color="primary" />
                  Goals
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {user.profile.goals.weeklyInterviews && (
                    <Chip
                      label={`${user.profile.goals.weeklyInterviews} interviews/week`}
                      icon={<TrendingUp />}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {user.profile.goals.targetScore && (
                    <Chip
                      label={`Target: ${user.profile.goals.targetScore}%`}
                      icon={<EmojiEvents />}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Edit Profile</Typography>
          <IconButton onClick={handleCancel}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Experience Level */}
            <FormControl fullWidth>
              <InputLabel>Experience Level</InputLabel>
              <Select
                value={editData.experienceLevel || ''}
                label="Experience Level"
                onChange={(e) => setEditData({ ...editData, experienceLevel: e.target.value })}
              >
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
                <MenuItem value="expert">Expert</MenuItem>
              </Select>
            </FormControl>

            {/* Tech Stack */}
            <Autocomplete
              multiple
              options={techStackOptions}
              value={editData.techStack || []}
              onChange={(_, newValue) => setEditData({ ...editData, techStack: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Tech Stack" placeholder="Select technologies" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
            />

            {/* Preferred Domains */}
            <Autocomplete
              multiple
              options={domainOptions}
              value={editData.preferredDomains || []}
              onChange={(_, newValue) => setEditData({ ...editData, preferredDomains: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Preferred Domains" placeholder="Select domains" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
            />

            {/* Target Roles */}
            <Autocomplete
              multiple
              options={roleOptions}
              value={editData.targetRoles || []}
              onChange={(_, newValue) => setEditData({ ...editData, targetRoles: newValue })}
              renderInput={(params) => (
                <TextField {...params} label="Target Roles" placeholder="Select target roles" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                ))
              }
            />

            {/* Goals */}
            <Typography variant="h6" sx={{ mt: 2 }}>Goals</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Weekly Interviews"
                type="number"
                value={editData.goals?.weeklyInterviews || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  goals: { ...editData.goals, weeklyInterviews: parseInt(e.target.value) || 0 }
                })}
                inputProps={{ min: 1, max: 20 }}
              />
              <TextField
                label="Target Score (%)"
                type="number"
                value={editData.goals?.targetScore || ''}
                onChange={(e) => setEditData({
                  ...editData,
                  goals: { ...editData.goals, targetScore: parseInt(e.target.value) || 0 }
                })}
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
