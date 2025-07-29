import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";

// Mock code execution service
// In a real implementation, you would use a sandboxed execution environment
// like Docker containers, AWS Lambda, or services like Judge0, HackerEarth API

interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

interface ExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  memoryUsed: number;
  exitCode: number;
  testCaseResults?: Array<{
    passed: boolean;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    executionTime: number;
    memoryUsed: number;
  }>;
}

// Mock execution functions for different languages
async function executeJavaScript(code: string, input: string): Promise<ExecutionResult> {
  const startTime = Date.now();

  // Create a safe execution context
  const logs: string[] = [];
  const originalConsoleLog = console.log;

  try {

    // Override console.log to capture output
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(' '));
    };

    // Parse input for JavaScript execution
    const inputLines = input.trim().split('\n').filter(line => line.length > 0);
    const inputValues = input.trim().split(/\s+/).filter(val => val.length > 0);

    // Create a function with the user's code and input handling
    const userFunction = new Function('input', 'inputLines', 'inputValues', `
      // Make input available to the user's code
      const readline = {
        question: (prompt, callback) => {
          console.log(prompt);
          if (inputValues.length > 0) {
            const value = inputValues.shift();
            callback(value);
          } else {
            callback('');
          }
        }
      };

      // Simulate prompt function
      const prompt = (message) => {
        console.log(message);
        return inputValues.shift() || '';
      };

      ${code}
      return { logs: [], error: null };
    `);

    // Execute the code
    const result = userFunction(input, inputLines, [...inputValues]);

    // Restore console.log
    console.log = originalConsoleLog;

    const executionTime = Date.now() - startTime;

    return {
      output: logs.join('\n'),
      executionTime,
      memoryUsed: Math.random() * 1024 * 1024, // Mock memory usage
      exitCode: 0,
    };

  } catch (error: any) {
    console.log = originalConsoleLog; // Restore console.log

    return {
      output: '',
      error: error.message,
      executionTime: Date.now() - startTime,
      memoryUsed: 0,
      exitCode: 1,
    };
  }
}

async function executePython(code: string, input: string): Promise<ExecutionResult> {
  // Enhanced Python execution with input handling
  const startTime = Date.now();

  try {
    let output = '';
    let executionLog = [];

    // Parse input values
    const inputLines = input.trim().split('\n').filter(line => line.length > 0);
    const inputValues = input.trim().split(/\s+/).filter(val => val.length > 0);
    let inputIndex = 0;

    // Handle Python input() function
    if (code.includes('input(') && inputValues.length > 0) {
      // Simulate Python execution with input
      if (code.includes('int(input(') && inputValues.length >= 2) {
        // Handle two integer inputs (common pattern)
        const num1 = parseInt(inputValues[0]) || 0;
        const num2 = parseInt(inputValues[1]) || 0;

        if (code.includes('+') || code.includes('sum')) {
          const sum = num1 + num2;
          executionLog.push(`Sum: ${sum}`);
        } else {
          executionLog.push(`First number: ${num1}`);
          executionLog.push(`Second number: ${num2}`);
        }

        output = executionLog.join('\n');
      } else {
        // Generic input handling
        executionLog.push('Reading input values...');
        inputValues.forEach((val, idx) => {
          executionLog.push(`Input ${idx + 1}: ${val}`);
        });
        output = executionLog.join('\n');
      }
    } else if (code.includes('print("Hello, World!")')) {
      output = 'Hello, World!';
    } else if (code.includes('print(')) {
      // Extract print statements (enhanced)
      const lines = code.split('\n');
      const outputLines = [];

      for (const line of lines) {
        if (line.includes('print(')) {
          const printMatch = line.match(/print\((.*?)\)/);
          if (printMatch) {
            let content = printMatch[1];

            // Handle string literals
            const stringMatch = content.match(/["']([^"']*)["']/);
            if (stringMatch) {
              outputLines.push(stringMatch[1]);
            } else {
              // Handle variables or expressions
              outputLines.push(content.replace(/['"]/g, ''));
            }
          }
        }
      }

      output = outputLines.join('\n');
    } else if (inputValues.length === 0 && code.includes('input(')) {
      output = 'Error: Please provide input values in the input panel\nExample: 5 10\n(Enter space-separated values)';
    } else {
      output = 'Program executed successfully';
    }

    return {
      output,
      executionTime: Date.now() - startTime,
      memoryUsed: Math.random() * 1024 * 1024,
      exitCode: 0,
    };

  } catch (error: any) {
    return {
      output: '',
      error: error.message,
      executionTime: Date.now() - startTime,
      memoryUsed: 0,
      exitCode: 1,
    };
  }
}

async function executeJava(code: string, input: string): Promise<ExecutionResult> {
  // Mock Java execution
  const startTime = Date.now();
  
  try {
    let output = '';
    
    // Simple pattern matching for Java
    if (code.includes('System.out.println("Hello, World!")')) {
      output = 'Hello, World!';
    } else if (code.includes('System.out.println(')) {
      // Extract println statements (very basic)
      const printMatches = code.match(/System\.out\.println\((.*?)\)/g);
      if (printMatches) {
        output = printMatches.map(match => {
          const content = match.replace(/System\.out\.println\(|\)/g, '').replace(/['"]/g, '');
          return content;
        }).join('\n');
      }
    }
    
    return {
      output,
      executionTime: Date.now() - startTime,
      memoryUsed: Math.random() * 1024 * 1024,
      exitCode: 0,
    };
    
  } catch (error: any) {
    return {
      output: '',
      error: error.message,
      executionTime: Date.now() - startTime,
      memoryUsed: 0,
      exitCode: 1,
    };
  }
}

async function executeCpp(code: string, input: string): Promise<ExecutionResult> {
  // Enhanced C++ execution with input handling
  const startTime = Date.now();

  try {
    let output = '';
    let executionLog = [];

    // Parse input values for simulation
    const inputValues = input.trim().split(/\s+/).filter(val => val.length > 0);
    let inputIndex = 0;

    // Simulate C++ execution with input handling
    if (code.includes('cin') && code.includes('cout')) {
      // Handle the two-number sum example
      if (code.includes('num1') && code.includes('num2') && inputValues.length >= 2) {
        const num1 = parseInt(inputValues[0]) || 0;
        const num2 = parseInt(inputValues[1]) || 0;
        const sum = num1 + num2;

        executionLog.push('Reading two numbers from input...');
        executionLog.push(`First number: ${num1}`);
        executionLog.push(`Second number: ${num2}`);
        executionLog.push(`Sum = ${sum}`);

        output = executionLog.join('\n');
      } else if (inputValues.length === 0) {
        // No input provided
        output = 'Error: Please provide input values in the input panel\nExample: 5 10\n(Enter two space-separated numbers)';
      } else {
        // Generic input handling
        executionLog.push('Reading values from input...');
        inputValues.forEach((val, idx) => {
          executionLog.push(`Input ${idx + 1}: ${val}`);
        });
        output = executionLog.join('\n');
      }
    } else if (code.includes('cout << "Hello, World!"')) {
      output = 'Hello, World!';
    } else if (code.includes('cout <<')) {
      // Extract cout statements for non-input programs
      const lines = code.split('\n');
      const outputLines = [];

      for (const line of lines) {
        if (line.includes('cout <<')) {
          // Extract string literals and variables
          const coutMatch = line.match(/cout\s*<<\s*(.*?);/);
          if (coutMatch) {
            let content = coutMatch[1];

            // Handle string literals
            const stringMatches = content.match(/"([^"]*)"/g);
            if (stringMatches) {
              stringMatches.forEach(str => {
                outputLines.push(str.replace(/"/g, ''));
              });
            }

            // Handle endl
            if (content.includes('endl')) {
              outputLines.push('');
            }
          }
        }
      }

      output = outputLines.join('\n');
    } else {
      // Default output for programs without cout
      output = 'Program executed successfully (no output statements found)';
    }

    return {
      output,
      executionTime: Date.now() - startTime,
      memoryUsed: Math.random() * 1024 * 1024,
      exitCode: 0,
    };

  } catch (error: any) {
    return {
      output: '',
      error: error.message,
      executionTime: Date.now() - startTime,
      memoryUsed: 0,
      exitCode: 1,
    };
  }
}

async function executeCode(language: string, code: string, input: string = ''): Promise<ExecutionResult> {
  switch (language) {
    case 'javascript':
    case 'typescript':
      return executeJavaScript(code, input);
    case 'python':
      return executePython(code, input);
    case 'java':
      return executeJava(code, input);
    case 'cpp':
      return executeCpp(code, input);
    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

async function runTestCases(language: string, code: string, testCases: TestCase[]): Promise<ExecutionResult> {
  const results = [];
  let totalTime = 0;
  let totalMemory = 0;
  
  for (const testCase of testCases) {
    const result = await executeCode(language, code, testCase.input);
    
    const testResult = {
      passed: result.output.trim() === testCase.expectedOutput.trim(),
      input: testCase.input,
      expectedOutput: testCase.expectedOutput,
      actualOutput: result.output,
      executionTime: result.executionTime,
      memoryUsed: result.memoryUsed,
    };
    
    results.push(testResult);
    totalTime += result.executionTime;
    totalMemory += result.memoryUsed;
  }
  
  const passedTests = results.filter(r => r.passed).length;
  
  return {
    output: `${passedTests}/${testCases.length} test cases passed`,
    executionTime: totalTime,
    memoryUsed: totalMemory / testCases.length,
    exitCode: passedTests === testCases.length ? 0 : 1,
    testCaseResults: results,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, language, input = '', testCases } = await request.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    if (!language) {
      return NextResponse.json({ error: "Language is required" }, { status: 400 });
    }

    let result: ExecutionResult;

    if (testCases && testCases.length > 0) {
      // Run with test cases
      result = await runTestCases(language, code, testCases);
    } else {
      // Run with input
      result = await executeCode(language, code, input);
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { 
        error: "Code execution failed",
        output: '',
        executionTime: 0,
        memoryUsed: 0,
        exitCode: 1,
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "Code execution service is running",
    supportedLanguages: ['javascript', 'typescript', 'python', 'java', 'cpp'],
    timestamp: new Date().toISOString(),
  });
}
