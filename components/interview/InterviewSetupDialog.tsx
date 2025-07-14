"use client";

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Autocomplete,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
  IconButton,
  Divider
} from '@mui/material';
import {
  Close,
  CloudUpload,
  Code,
  Assessment,
  Psychology,
  BugReport,
  QuestionAnswer,
  Schedule
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface InterviewSetupDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const steps = ['Setup Method', 'Configuration', 'Review & Start'];

const interviewTypes = [
  { value: 'technical', label: 'Technical Interview', icon: <Code />, description: 'Focus on technical skills and problem-solving' },
  { value: 'behavioral', label: 'Behavioral Interview', icon: <Psychology />, description: 'Assess soft skills and cultural fit' },
  { value: 'system-design', label: 'System Design', icon: <Assessment />, description: 'Design scalable systems and architecture' },
  { value: 'coding', label: 'Coding Challenge', icon: <BugReport />, description: 'Live coding and algorithm problems' },
  { value: 'mixed', label: 'Mixed Interview', icon: <QuestionAnswer />, description: 'Combination of all interview types' }
];

const difficultyLevels = [
  { value: 'easy', label: 'Easy', color: '#10b981', description: 'Basic concepts and simple problems' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', description: 'Intermediate level with moderate complexity' },
  { value: 'hard', label: 'Hard', color: '#ef4444', description: 'Advanced concepts and challenging problems' }
];

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

export const InterviewSetupDialog: React.FC<InterviewSetupDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [setupMethod, setSetupMethod] = useState<'resume' | 'techstack'>('techstack');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    type: 'technical',
    difficulty: 'medium',
    duration: 60,
    setupMethod: 'techstack',
    resumeData: null as any,
    techStackData: {
      selectedStack: [] as string[],
      domain: '',
      experienceLevel: 'intermediate'
    }
  });

  // File upload handling
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('resume', file);

      const response = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Failed to upload resume');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        resumeData: {
          fileName: file.name,
          filePath: data.filePath,
          extractedSkills: data.extractedSkills || [],
          extractedExperience: data.extractedExperience || ''
        }
      }));

    } catch (error) {
      console.error('Error uploading resume:', error);
      setError('Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate setup method
      if (setupMethod === 'resume' && !formData.resumeData) {
        setError('Please upload your resume first.');
        return;
      }
      if (setupMethod === 'techstack' && formData.techStackData.selectedStack.length === 0) {
        setError('Please select at least one technology.');
        return;
      }
    }
    
    setError(null);
    setActiveStep(prev => prev + 1);
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    setLoading(true);
    
    const interviewData = {
      ...formData,
      title: formData.title || `${formData.type} Interview - ${new Date().toLocaleDateString()}`,
      setupMethod
    };

    onSubmit(interviewData);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Choose Setup Method
            </Typography>
            
            <RadioGroup
              value={setupMethod}
              onChange={(e) => {
                setSetupMethod(e.target.value as 'resume' | 'techstack');
                setFormData(prev => ({ ...prev, setupMethod: e.target.value as 'resume' | 'techstack' }));
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <FormControlLabel
                  value="resume"
                  control={<Radio />}
                  label={
                    <Card sx={{ width: '100%', cursor: 'pointer' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CloudUpload color="primary" />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Upload Resume
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              AI will extract your skills and generate relevant questions
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  }
                />
                
                <FormControlLabel
                  value="techstack"
                  control={<Radio />}
                  label={
                    <Card sx={{ width: '100%', cursor: 'pointer' }}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Code color="primary" />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              Select Tech Stack
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Manually choose technologies and domains for targeted questions
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  }
                />
              </Box>
            </RadioGroup>

            {setupMethod === 'resume' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Upload Your Resume
                </Typography>
                
                <Box
                  {...getRootProps()}
                  sx={{
                    border: '2px dashed',
                    borderColor: isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: isDragActive ? 'primary.50' : 'background.paper',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <input {...getInputProps()} />
                  <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    or click to browse files
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Supports PDF, DOC, DOCX (max 10MB)
                  </Typography>
                </Box>

                {formData.resumeData && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Resume uploaded successfully: {formData.resumeData.fileName}
                    <br />
                    Extracted {formData.resumeData.extractedSkills.length} skills
                  </Alert>
                )}
              </Box>
            )}

            {setupMethod === 'techstack' && (
              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Autocomplete
                  multiple
                  options={techStackOptions}
                  value={formData.techStackData.selectedStack}
                  onChange={(_, newValue) => setFormData(prev => ({
                    ...prev,
                    techStackData: { ...prev.techStackData, selectedStack: newValue }
                  }))}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Technologies" placeholder="Choose technologies" />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({ index })} key={index} />
                    ))
                  }
                />

                <FormControl fullWidth>
                  <InputLabel>Domain</InputLabel>
                  <Select
                    value={formData.techStackData.domain}
                    label="Domain"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      techStackData: { ...prev.techStackData, domain: e.target.value }
                    }))}
                  >
                    {domainOptions.map((domain) => (
                      <MenuItem key={domain} value={domain}>{domain}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Experience Level</InputLabel>
                  <Select
                    value={formData.techStackData.experienceLevel}
                    label="Experience Level"
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      techStackData: { ...prev.techStackData, experienceLevel: e.target.value }
                    }))}
                  >
                    <MenuItem value="beginner">Beginner (0-1 years)</MenuItem>
                    <MenuItem value="intermediate">Intermediate (2-4 years)</MenuItem>
                    <MenuItem value="advanced">Advanced (5+ years)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        );

      case 1:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Interview Configuration
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Interview Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Frontend Developer Interview"
                fullWidth
              />

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Interview Type
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {interviewTypes.map((type) => (
                    <Card
                      key={type.value}
                      sx={{
                        cursor: 'pointer',
                        border: formData.type === type.value ? '2px solid' : '1px solid',
                        borderColor: formData.type === type.value ? 'primary.main' : 'divider',
                        bgcolor: formData.type === type.value ? 'primary.50' : 'background.paper'
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          {type.icon}
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {type.label}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {type.description}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Difficulty Level
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {difficultyLevels.map((level) => (
                    <Card
                      key={level.value}
                      sx={{
                        flex: 1,
                        cursor: 'pointer',
                        border: formData.difficulty === level.value ? '2px solid' : '1px solid',
                        borderColor: formData.difficulty === level.value ? level.color : 'divider',
                        bgcolor: formData.difficulty === level.value ? `${level.color}15` : 'background.paper'
                      }}
                      onClick={() => setFormData(prev => ({ ...prev, difficulty: level.value }))}
                    >
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: level.color }}>
                          {level.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {level.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Duration (minutes)"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  inputProps={{ min: 15, max: 180, step: 15 }}
                  sx={{ flex: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  <Schedule color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Recommended: 45-90 minutes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Review & Start Interview
            </Typography>

            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Interview Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Title:</Typography>
                    <Typography variant="body2">{formData.title || 'Untitled Interview'}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Type:</Typography>
                    <Typography variant="body2">{interviewTypes.find(t => t.value === formData.type)?.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Difficulty:</Typography>
                    <Typography variant="body2">{difficultyLevels.find(d => d.value === formData.difficulty)?.label}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Duration:</Typography>
                    <Typography variant="body2">{formData.duration} minutes</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">Setup Method:</Typography>
                    <Typography variant="body2">{setupMethod === 'resume' ? 'Resume Upload' : 'Tech Stack Selection'}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {setupMethod === 'resume' && formData.resumeData && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Resume Analysis
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    File: {formData.resumeData.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Extracted Skills: {formData.resumeData.extractedSkills.length}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.resumeData.extractedSkills.slice(0, 10).map((skill: string, index: number) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {setupMethod === 'techstack' && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Tech Stack Configuration
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Domain:</Typography>
                      <Typography variant="body2">{formData.techStackData.domain}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">Experience:</Typography>
                      <Typography variant="body2">{formData.techStackData.experienceLevel}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Selected Technologies:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.techStackData.selectedStack.map((tech, index) => (
                      <Chip key={index} label={tech} size="small" variant="outlined" />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            <Alert severity="info">
              Your interview will be generated based on the selected configuration. 
              You can pause and resume the interview at any time.
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Setup New Interview</Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}
        {activeStep < steps.length - 1 ? (
          <Button onClick={handleNext} variant="contained" disabled={loading}>
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Start Interview'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
