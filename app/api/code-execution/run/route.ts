import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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
  
  try {
    // Create a safe execution context
    const logs: string[] = [];
    const originalConsoleLog = console.log;
    
    // Override console.log to capture output
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => String(arg)).join(' '));
    };

    // Create a function with the user's code
    const userFunction = new Function('input', `
      ${code}
      return { logs: [], error: null };
    `);

    // Execute the code
    const result = userFunction(input);
    
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
    console.log = console.log; // Restore console.log
    
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
  // Mock Python execution
  const startTime = Date.now();
  
  try {
    // This is a mock implementation
    // In reality, you would use a Python execution service
    
    let output = '';
    
    // Simple pattern matching for common Python patterns
    if (code.includes('print("Hello, World!")')) {
      output = 'Hello, World!';
    } else if (code.includes('print(')) {
      // Extract print statements (very basic)
      const printMatches = code.match(/print\((.*?)\)/g);
      if (printMatches) {
        output = printMatches.map(match => {
          const content = match.replace(/print\(|\)/g, '').replace(/['"]/g, '');
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
  // Mock C++ execution
  const startTime = Date.now();
  
  try {
    let output = '';
    
    // Simple pattern matching for C++
    if (code.includes('cout << "Hello, World!"')) {
      output = 'Hello, World!';
    } else if (code.includes('cout <<')) {
      // Extract cout statements (very basic)
      const coutMatches = code.match(/cout\s*<<\s*(.*?);/g);
      if (coutMatches) {
        output = coutMatches.map(match => {
          const content = match.replace(/cout\s*<<\s*|;/g, '').replace(/['"]/g, '').replace(/endl/g, '\n');
          return content;
        }).join('');
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
