'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';

export interface QuickStartDialogProps {
  open: boolean;
  onClose: () => void;
  onStart?: (config: PracticeConfig) => void;
}

export interface PracticeConfig {
  domain: string;
  questionType: string;
  difficulty: string;
  questionCount: number;
  timeLimit: number;
}

const presets = [
  {
    id: 'frontend',
    title: 'Frontend Focus',
    description: 'React, JavaScript, CSS',
    config: { domain: 'frontend', questionType: 'mcq', difficulty: 'medium', questionCount: 10, timeLimit: 30 }
  },
  {
    id: 'backend',
    title: 'Backend Mastery',
    description: 'Node.js, APIs, Databases',
    config: { domain: 'backend', questionType: 'coding', difficulty: 'hard', questionCount: 8, timeLimit: 45 }
  },
  {
    id: 'fullstack',
    title: 'Full Stack Challenge',
    description: 'Complete development cycle',
    config: { domain: 'fullstack', questionType: 'mixed', difficulty: 'medium', questionCount: 15, timeLimit: 60 }
  }
];

const steps = ['Choose Your Path', 'Configure', 'Review & Start'];

export const QuickStartDialog: React.FC<QuickStartDialogProps> = ({
  open,
  onClose,
  onStart,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<PracticeConfig>({
    domain: 'frontend',
    questionType: 'mcq',
    difficulty: 'medium',
    questionCount: 10,
    timeLimit: 30,
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setConfig(preset.config);
    handleNext();
  };

  const handleStart = () => {
    onStart?.(config);
    onClose();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Quick Start Presets
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {presets.map((preset) => (
                <Card
                  key={preset.id}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <CardContent>
                    <Typography variant="h6">{preset.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {preset.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Configure Your Practice Session
            </Typography>
            <Box display="flex" flexDirection="column" gap={3}>
              <FormControl fullWidth>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={config.domain}
                  label="Domain"
                  onChange={(e) => setConfig({ ...config, domain: e.target.value })}
                >
                  <MenuItem value="frontend">Frontend</MenuItem>
                  <MenuItem value="backend">Backend</MenuItem>
                  <MenuItem value="fullstack">Full Stack</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle2">Question Type</Typography>
              <Typography variant="subtitle2">Difficulty Level</Typography>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Number of Questions: {config.questionCount}
                </Typography>
                <Slider
                  value={config.questionCount}
                  onChange={(_, value) => setConfig({ ...config, questionCount: value as number })}
                  min={5}
                  max={20}
                  step={1}
                  marks
                  data-testid="question-slider"
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Time Limit: {config.timeLimit} minutes
                </Typography>
                <Slider
                  value={config.timeLimit}
                  onChange={(_, value) => setConfig({ ...config, timeLimit: value as number })}
                  min={15}
                  max={90}
                  step={15}
                  marks
                  data-testid="time-slider"
                />
              </Box>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Configuration
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Typography><strong>Domain:</strong> {config.domain}</Typography>
              <Typography><strong>Question Type:</strong> {config.questionType}</Typography>
              <Typography><strong>Difficulty:</strong> {config.difficulty}</Typography>
              <Typography><strong>Questions:</strong> {config.questionCount}</Typography>
              <Typography><strong>Time Limit:</strong> {config.timeLimit} minutes</Typography>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h5">Quick Start Practice</Typography>
        <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      <DialogContent sx={{ mt: 2 }}>
        {renderStepContent()}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleBack}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleStart} variant="contained">
            Start Practice
          </Button>
        ) : (
          <Button onClick={handleNext} variant="contained">
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
