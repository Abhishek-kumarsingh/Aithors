"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  Save,
  Upload,
  Download,
  Refresh,
  Settings,
  Code,
  Terminal,
  BugReport,
  Home,
  ArrowBack,
  Dashboard
} from '@mui/icons-material';
import Editor from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { CodingLayout } from '@/components/shared/CodingLayout';
import { useRouter } from 'next/navigation';

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' }
];

const codeTemplates = {
  javascript: `// JavaScript Template - Interactive Input Example
// Use the input panel to provide values (e.g., "5 10")
const readline = require('readline');

// For web execution, input values are provided via the input panel
console.log("Enter two numbers (space-separated in input panel):");

// Example: If input panel contains "5 10"
// This will read those values
const input = "5 10"; // This gets replaced with actual input
const numbers = input.trim().split(' ');
const num1 = parseInt(numbers[0]) || 0;
const num2 = parseInt(numbers[1]) || 0;

console.log(\`First number: \${num1}\`);
console.log(\`Second number: \${num2}\`);
console.log(\`Sum: \${num1 + num2}\`);`,

  typescript: `// TypeScript Template - Interactive Input Example
// Use the input panel to provide values (e.g., "5 10")

function calculateSum(): void {
  console.log("Enter two numbers (space-separated in input panel):");

  // Example: If input panel contains "5 10"
  const input = "5 10"; // This gets replaced with actual input
  const numbers: string[] = input.trim().split(' ');
  const num1: number = parseInt(numbers[0]) || 0;
  const num2: number = parseInt(numbers[1]) || 0;

  console.log(\`First number: \${num1}\`);
  console.log(\`Second number: \${num2}\`);
  console.log(\`Sum: \${num1 + num2}\`);
}

calculateSum();`,

  python: `# Python Template - Interactive Input Example
# Use the input panel to provide values (e.g., "5 10")

print("Enter two numbers (space-separated in input panel):")

# For web execution, input values come from the input panel
# Example: If input panel contains "5 10"
try:
    # This simulates reading from input panel
    numbers = input().split()  # Input: "5 10"
    num1 = int(numbers[0])
    num2 = int(numbers[1])

    print(f"First number: {num1}")
    print(f"Second number: {num2}")
    print(f"Sum: {num1 + num2}")

except (ValueError, IndexError):
    print("Please provide two valid numbers in the input panel")
    print("Example: 5 10")`,

  java: `// Java Template - Interactive Input Example
import java.util.Scanner;

public class Solution {
    public static void main(String[] args) {
        System.out.println("Enter two numbers (space-separated in input panel):");

        Scanner scanner = new Scanner(System.in);

        try {
            int num1 = scanner.nextInt();
            int num2 = scanner.nextInt();

            System.out.println("First number: " + num1);
            System.out.println("Second number: " + num2);
            System.out.println("Sum: " + (num1 + num2));

        } catch (Exception e) {
            System.out.println("Please provide two valid numbers in the input panel");
            System.out.println("Example: 5 10");
        }

        scanner.close();
    }
}`,

  cpp: `// C++ Template - Interactive Input Example
// Use the input panel to provide values (e.g., "5 10")
#include <iostream>
using namespace std;

int main() {
    int num1, num2;

    cout << "Enter two numbers (space-separated in input panel):" << endl;

    // Read two integers from input
    // Input should be provided in the input panel as: 5 10
    if (cin >> num1 >> num2) {
        cout << "First number: " << num1 << endl;
        cout << "Second number: " << num2 << endl;
        cout << "Sum: " << (num1 + num2) << endl;
    } else {
        cout << "Error: Please provide two valid numbers in the input panel" << endl;
        cout << "Example input: 5 10" << endl;
    }

    return 0;
}`,

  go: `// Go Template - Interactive Input Example
package main

import (
    "fmt"
)

func main() {
    var num1, num2 int

    fmt.Println("Enter two numbers (space-separated in input panel):")

    // Read two integers from input
    n, err := fmt.Scanf("%d %d", &num1, &num2)

    if err != nil || n != 2 {
        fmt.Println("Error: Please provide two valid numbers in the input panel")
        fmt.Println("Example input: 5 10")
        return
    }

    fmt.Printf("First number: %d\\n", num1)
    fmt.Printf("Second number: %d\\n", num2)
    fmt.Printf("Sum: %d\\n", num1 + num2)
}`,

  rust: `// Rust Template - Interactive Input Example
use std::io;

fn main() {
    println!("Enter two numbers (space-separated in input panel):");

    let mut input = String::new();

    match io::stdin().read_line(&mut input) {
        Ok(_) => {
            let numbers: Vec<&str> = input.trim().split_whitespace().collect();

            if numbers.len() >= 2 {
                match (numbers[0].parse::<i32>(), numbers[1].parse::<i32>()) {
                    (Ok(num1), Ok(num2)) => {
                        println!("First number: {}", num1);
                        println!("Second number: {}", num2);
                        println!("Sum: {}", num1 + num2);
                    }
                    _ => {
                        println!("Error: Please provide two valid numbers");
                        println!("Example input: 5 10");
                    }
                }
            } else {
                println!("Error: Please provide two numbers in the input panel");
                println!("Example input: 5 10");
            }
        }
        Err(_) => {
            println!("Error reading input");
        }
    }
}`
};

export default function CodeEnvironmentPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number>(0);
  const [memoryUsed, setMemoryUsed] = useState<number>(0);

  // Initialize code with template
  useEffect(() => {
    setCode(codeTemplates[selectedLanguage as keyof typeof codeTemplates] || '');
  }, [selectedLanguage]);

  const executeCode = async () => {
    setIsExecuting(true);
    setOutput('');
    
    try {
      const response = await fetch('/api/code-execution/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          input
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOutput(data.output || 'Code executed successfully');
        setExecutionTime(data.executionTime || 0);
        setMemoryUsed(data.memoryUsed || 0);
      } else {
        setOutput('Error executing code');
      }
    } catch (error) {
      console.error('Error executing code:', error);
      setOutput('Network error occurred');
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(codeTemplates[selectedLanguage as keyof typeof codeTemplates] || '');
    setOutput('');
    setInput('');
  };

  const downloadCode = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `solution.${selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Navigation Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/dashboard/home')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              <Home sx={{ mr: 0.5, fontSize: 16 }} />
              Dashboard
            </Link>
            <Typography color="text.primary" variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
              <Code sx={{ mr: 0.5, fontSize: 16 }} />
              Code Environment
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                💻 Code Environment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Professional coding environment with multi-language support and real-time execution
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => router.push('/dashboard/home')}
              sx={{ minWidth: 'auto' }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>

        {/* 80/20 Split Screen Layout */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          height: { xs: 'auto', md: '80vh' },
          minHeight: '600px'
        }}>
          {/* Left side - Code Editor (80% width) */}
          <Box sx={{ 
            flex: { xs: '1', md: '0 0 80%' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '500px', md: '100%' }
          }}>
            {/* Editor Header */}
            <Card sx={{ mb: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Code color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Code Editor
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

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Reset Code">
                      <IconButton onClick={resetCode} size="small">
                        <Refresh />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Download Code">
                      <IconButton onClick={downloadCode} size="small">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small">
                        <Settings />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Monaco Editor */}
            <Card sx={{ flex: 1, overflow: 'hidden' }}>
              <Editor
                height="100%"
                language={selectedLanguage}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: true },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  folding: true,
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true
                }}
              />
            </Card>

            {/* Code Actions */}
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    startIcon={<PlayArrow />}
                    onClick={executeCode}
                    disabled={isExecuting || !code.trim()}
                    size="large"
                  >
                    {isExecuting ? 'Running...' : 'Run Code'}
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Stop />}
                    disabled={!isExecuting}
                  >
                    Stop
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<Save />}
                  >
                    Save
                  </Button>

                  {executionTime > 0 && (
                    <Chip 
                      label={`${executionTime}ms`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  )}
                  
                  {memoryUsed > 0 && (
                    <Chip 
                      label={`${(memoryUsed / 1024 / 1024).toFixed(2)}MB`} 
                      size="small" 
                      color="secondary" 
                      variant="outlined" 
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Right side - Input/Output Panel (20% width) */}
          <Box sx={{ 
            flex: { xs: '1', md: '0 0 20%' },
            display: 'flex',
            flexDirection: 'column',
            minHeight: { xs: '400px', md: '100%' },
            gap: 2
          }}>
            {/* Input Panel */}
            <Card sx={{ flex: '0 0 auto' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Terminal color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Input
                  </Typography>
                </Box>
                
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Enter input for your program..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  variant="outlined"
                  size="small"
                />
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <BugReport color="primary" />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Output
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  flex: 1,
                  bgcolor: 'grey.900',
                  color: 'white',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  overflow: 'auto',
                  minHeight: '200px'
                }}>
                  {output ? (
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
                  ) : (
                    <Typography variant="body2" sx={{ color: 'grey.400', fontStyle: 'italic' }}>
                      Output will appear here after running your code...
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Quick Actions
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Button variant="outlined" size="small" fullWidth>
                    Load Template
                  </Button>
                  <Button variant="outlined" size="small" fullWidth>
                    Share Code
                  </Button>
                  <Button variant="outlined" size="small" fullWidth>
                    Export PDF
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
}
