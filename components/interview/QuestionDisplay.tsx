"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Code,
  Mic,
  MicOff,
  PlayArrow,
  Stop,
  Send,
  BugReport,
  QuestionAnswer,
  Psychology
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';

interface Question {
  id: string;
  type: 'mcq' | 'subjective' | 'coding' | 'bug-fix';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  userAnswer?: string;
  buggyCode?: string; // For bug-fix questions
  language?: string; // For bug-fix questions
  codeResponse?: {
    language: string;
    code: string;
    output?: string;
    isExecuted: boolean;
  };
}

interface QuestionDisplayProps {
  question: Question;
  onAnswerSubmit: (answer: any) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
  isPaused: boolean;
}

const getQuestionIcon = (type: string) => {
  switch (type) {
    case 'mcq': return <QuestionAnswer />;
    case 'subjective': return <Psychology />;
    case 'coding': return <Code />;
    case 'bug-fix': return <BugReport />;
    default: return <QuestionAnswer />;
  }
};

const getQuestionTypeLabel = (type: string) => {
  switch (type) {
    case 'mcq': return 'Multiple Choice';
    case 'subjective': return 'Subjective';
    case 'coding': return 'Coding Challenge';
    case 'bug-fix': return 'Bug Fix';
    default: return 'Question';
  }
};

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  onAnswerSubmit,
  isRecording,
  onRecordingChange,
  isPaused
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [textAnswer, setTextAnswer] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [voiceTranscription, setVoiceTranscription] = useState<string>('');
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setVoiceTranscription(prev => prev + finalTranscript);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onRecordingChange(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onRecordingChange]);

  // Handle voice recording
  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      onRecordingChange(false);
    } else {
      recognition.start();
      onRecordingChange(true);
    }
  };

  // Execute code
  const executeCode = async () => {
    setIsExecuting(true);
    try {
      const response = await fetch('/api/code/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCodeOutput(data.output || 'Code executed successfully');
      } else {
        setCodeOutput('Error executing code');
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setCodeOutput('Error executing code');
    } finally {
      setIsExecuting(false);
    }
  };

  // Submit answer
  const handleSubmit = () => {
    let answer: any = {};

    switch (question.type) {
      case 'mcq':
        answer = {
          type: 'mcq',
          selectedOption,
          text: selectedOption
        };
        break;
      
      case 'subjective':
        answer = {
          type: 'subjective',
          text: textAnswer || voiceTranscription,
          voiceData: voiceTranscription ? {
            transcription: voiceTranscription,
            audioPath: '' // Would be set by actual audio recording
          } : undefined
        };
        break;
      
      case 'coding':
      case 'bug-fix':
        answer = {
          type: question.type,
          code,
          language: selectedLanguage,
          output: codeOutput,
          isExecuted: !!codeOutput
        };
        break;
    }

    onAnswerSubmit(answer);
  };

  // Get starter code for coding questions
  const getStarterCode = () => {
    // For bug-fix questions, use the buggy code provided
    if (question.type === 'bug-fix' && question.buggyCode) {
      return question.buggyCode;
    }

    // For coding questions, use language-specific templates
    switch (selectedLanguage) {
      case 'javascript':
        return '// Write your solution here\nfunction solution() {\n    // Your code here\n}\n\n// Test your solution\nconsole.log(solution());';
      case 'python':
        return '# Write your solution here\ndef solution():\n    # Your code here\n    pass\n\n# Test your solution\nprint(solution())';
      case 'java':
        return 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n        System.out.println("Hello World");\n    }\n}';
      case 'cpp':
        return '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    cout << "Hello World" << endl;\n    return 0;\n}';
      default:
        return '// Write your solution here';
    }
  };

  // Initialize code with starter template
  useEffect(() => {
    if ((question.type === 'coding' || question.type === 'bug-fix') && !code) {
      // For bug-fix questions, set the language from the question if available
      if (question.type === 'bug-fix' && question.language) {
        setSelectedLanguage(question.language);
      }
      setCode(getStarterCode());
    }
  }, [question.type, selectedLanguage, code, question.buggyCode, question.language]);

  const canSubmit = () => {
    switch (question.type) {
      case 'mcq':
        return !!selectedOption;
      case 'subjective':
        return !!(textAnswer || voiceTranscription);
      case 'coding':
      case 'bug-fix':
        return !!code.trim();
      default:
        return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ maxWidth: '100%' }}>
        {/* Question Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.light',
              color: 'primary.main'
            }}
          >
            {getQuestionIcon(question.type)}
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
              {getQuestionTypeLabel(question.type)}
            </Typography>
            <Chip label={question.type.toUpperCase()} size="small" color="primary" variant="outlined" />
          </Box>
        </Box>

        {/* Question Content */}
        <Card sx={{ mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, lineHeight: 1.6 }}>
              {question.question}
            </Typography>
          </CardContent>
        </Card>

        {/* Answer Section */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            {question.type === 'mcq' && question.options && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Select your answer:
                </Typography>
                <RadioGroup
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.target.value)}
                >
                  {question.options.map((option, index) => (
                    <FormControlLabel
                      key={index}
                      value={option}
                      control={<Radio />}
                      label={
                        <Typography variant="body1" sx={{ py: 1 }}>
                          {option}
                        </Typography>
                      }
                      sx={{
                        mb: 1,
                        p: 2,
                        border: '1px solid',
                        borderColor: selectedOption === option ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        bgcolor: selectedOption === option ? 'primary.50' : 'transparent'
                      }}
                    />
                  ))}
                </RadioGroup>
              </Box>
            )}

            {question.type === 'subjective' && (
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Your answer:
                </Typography>
                
                <TextField
                  multiline
                  rows={6}
                  fullWidth
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  sx={{ mb: 2 }}
                />

                <Divider sx={{ my: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    OR
                  </Typography>
                </Divider>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <IconButton
                    onClick={toggleRecording}
                    color={isRecording ? 'error' : 'primary'}
                    sx={{
                      bgcolor: isRecording ? 'error.light' : 'primary.light',
                      '&:hover': {
                        bgcolor: isRecording ? 'error.main' : 'primary.main',
                        color: 'white'
                      }
                    }}
                  >
                    {isRecording ? <MicOff /> : <Mic />}
                  </IconButton>
                  <Typography variant="body2" color="text.secondary">
                    {isRecording ? 'Recording... Click to stop' : 'Click to record your answer'}
                  </Typography>
                </Box>

                {voiceTranscription && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Voice Transcription:</Typography>
                    <Typography variant="body2">{voiceTranscription}</Typography>
                  </Alert>
                )}
              </Box>
            )}

            {(question.type === 'coding' || question.type === 'bug-fix') && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {question.type === 'coding' ? 'Write your solution:' : 'Fix the bug in the code:'}
                  </Typography>
                  
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Language</InputLabel>
                    <Select
                      value={selectedLanguage}
                      label="Language"
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                      {programmingLanguages.map((lang) => (
                        <MenuItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
                  <Editor
                    height="400px"
                    language={selectedLanguage}
                    value={code}
                    onChange={(value) => setCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PlayArrow />}
                    onClick={executeCode}
                    disabled={isExecuting || !code.trim()}
                  >
                    {isExecuting ? 'Running...' : 'Run Code'}
                  </Button>
                </Box>

                {codeOutput && (
                  <Card sx={{ bgcolor: 'grey.900', color: 'white' }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.300' }}>
                        Output:
                      </Typography>
                      <Typography variant="body2" component="pre" sx={{ fontFamily: 'monospace' }}>
                        {codeOutput}
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </Box>
            )}

            {/* Submit Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Send />}
                onClick={handleSubmit}
                disabled={!canSubmit() || isPaused}
              >
                Submit Answer
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </motion.div>
  );
};
