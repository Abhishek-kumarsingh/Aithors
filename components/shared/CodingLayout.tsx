"use client";

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  Code,
  QuestionAnswer,
  BugReport
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';

interface CodingLayoutProps {
  // Code editor props
  code: string;
  onCodeChange: (code: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  programmingLanguages: { value: string; label: string }[];
  
  // Question/Problem props
  questionTitle?: string;
  questionContent: string;
  buggyCode?: string;
  questionType?: 'coding' | 'bug-fix';
  
  // Execution props
  onExecuteCode: () => void;
  isExecuting: boolean;
  codeOutput?: string;
  
  // Additional props
  onResetCode?: () => void;
  showInstructions?: boolean;
  customInstructions?: string[];
  height?: string;
  editorTheme?: string;
}

export const CodingLayout: React.FC<CodingLayoutProps> = ({
  code,
  onCodeChange,
  selectedLanguage,
  onLanguageChange,
  programmingLanguages,
  questionTitle,
  questionContent,
  buggyCode,
  questionType = 'coding',
  onExecuteCode,
  isExecuting,
  codeOutput,
  onResetCode,
  showInstructions = true,
  customInstructions,
  height = '70vh',
  editorTheme = 'vs-dark'
}) => {
  const defaultInstructions = [
    'Write your solution in the code editor',
    'Use the "Run Code" button to test your solution',
    'Make sure your code handles edge cases',
    'Click "Submit Answer" when ready'
  ];

  const instructions = customInstructions || defaultInstructions;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' },
      gap: 2,
      height: { xs: 'auto', md: height },
      minHeight: '500px'
    }}>
      {/* Left side - Code Editor (80% width) */}
      <Box sx={{ 
        flex: { xs: '1', md: '0 0 80%' },
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: '400px', md: '100%' }
      }}>
        {/* Editor Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Code color="primary" />
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {questionType === 'coding' ? 'Code Editor' : 'Fix the Bug'}
            </Typography>
          </Box>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Language</InputLabel>
            <Select
              value={selectedLanguage}
              label="Language"
              onChange={(e) => onLanguageChange(e.target.value)}
            >
              {programmingLanguages.map((lang) => (
                <MenuItem key={lang.value} value={lang.value}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Monaco Editor */}
        <Box sx={{ 
          flex: 1,
          border: '1px solid', 
          borderColor: 'divider', 
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <Editor
            height="100%"
            language={selectedLanguage}
            value={code}
            onChange={(value) => onCodeChange(value || '')}
            theme={editorTheme}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              wordWrap: 'on',
              folding: true,
              bracketMatching: 'always',
              autoIndent: 'full',
              formatOnPaste: true,
              formatOnType: true
            }}
          />
        </Box>

        {/* Code Actions */}
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          mt: 2,
          p: 2,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={onExecuteCode}
            disabled={isExecuting || !code.trim()}
            size="small"
          >
            {isExecuting ? 'Running...' : 'Run Code'}
          </Button>
          
          {onResetCode && (
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              size="small"
              onClick={onResetCode}
            >
              Reset Code
            </Button>
          )}
        </Box>

        {/* Code Output */}
        {codeOutput && (
          <Card sx={{ bgcolor: 'grey.900', color: 'white', mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'grey.300' }}>
                Output:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ 
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap'
              }}>
                {codeOutput}
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Right side - Question Panel (20% width) */}
      <Box sx={{ 
        flex: { xs: '1', md: '0 0 20%' },
        display: 'flex',
        flexDirection: 'column',
        minHeight: { xs: '300px', md: '100%' }
      }}>
        <Card sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardContent sx={{ 
            flex: 1,
            overflow: 'auto',
            p: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <QuestionAnswer color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {questionTitle || 'Problem Statement'}
              </Typography>
            </Box>
            
            <Typography variant="body2" sx={{ 
              mb: 2,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap'
            }}>
              {questionContent}
            </Typography>

            {questionType === 'bug-fix' && buggyCode && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Buggy Code:
                </Typography>
                <Box sx={{ 
                  p: 1,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}>
                  <Typography variant="body2" component="pre" sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto'
                  }}>
                    {buggyCode}
                  </Typography>
                </Box>
              </Box>
            )}

            {showInstructions && (
              <>
                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Instructions:
                </Typography>
                <Typography variant="body2" sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  lineHeight: 1.5
                }}>
                  {instructions.map((instruction, index) => (
                    <span key={index}>
                      • {instruction}
                      {index < instructions.length - 1 && <br />}
                    </span>
                  ))}
                </Typography>

                {/* Input Guidelines for Interactive Programs */}
                {(selectedLanguage === 'cpp' || selectedLanguage === 'python' || selectedLanguage === 'java') && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
                      💡 Input Guidelines:
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      For programs that read input (cin, input(), Scanner), provide values in the input panel below.
                      <br />
                      Example: For two numbers, enter "5 10" (space-separated)
                      <br />
                      Each line or space represents a separate input value.
                    </Typography>
                  </Box>
                )}
              </>
            )}

            {/* Language indicator */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Current Language:
              </Typography>
              <Chip 
                label={programmingLanguages.find(lang => lang.value === selectedLanguage)?.label || selectedLanguage}
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
