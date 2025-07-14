import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { exec } from 'child_process';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);

// POST - Execute code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    // Create temp directory if it doesn't exist
    const tempDir = join(process.cwd(), 'temp', 'code-execution');
    if (!existsSync(tempDir)) {
      await mkdir(tempDir, { recursive: true });
    }

    const timestamp = Date.now();
    let output = '';
    let error = '';

    try {
      switch (language) {
        case 'javascript':
          output = await executeJavaScript(code, tempDir, timestamp);
          break;
        case 'python':
          output = await executePython(code, tempDir, timestamp);
          break;
        case 'java':
          output = await executeJava(code, tempDir, timestamp);
          break;
        case 'cpp':
          output = await executeCpp(code, tempDir, timestamp);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }
    } catch (execError: any) {
      error = execError.message || 'Execution failed';
    }

    return NextResponse.json({
      success: !error,
      output: output || error,
      error: error || null
    });

  } catch (error) {
    console.error('Error executing code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Execute JavaScript code
async function executeJavaScript(code: string, tempDir: string, timestamp: number): Promise<string> {
  const fileName = `script_${timestamp}.js`;
  const filePath = join(tempDir, fileName);

  try {
    await writeFile(filePath, code);
    
    const { stdout, stderr } = await execAsync(`node "${filePath}"`, {
      timeout: 10000, // 10 seconds timeout
      cwd: tempDir
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } finally {
    // Clean up
    try {
      await unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
  }
}

// Execute Python code
async function executePython(code: string, tempDir: string, timestamp: number): Promise<string> {
  const fileName = `script_${timestamp}.py`;
  const filePath = join(tempDir, fileName);

  try {
    await writeFile(filePath, code);
    
    const { stdout, stderr } = await execAsync(`python "${filePath}"`, {
      timeout: 10000, // 10 seconds timeout
      cwd: tempDir
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } finally {
    // Clean up
    try {
      await unlink(filePath);
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
    }
  }
}

// Execute Java code
async function executeJava(code: string, tempDir: string, timestamp: number): Promise<string> {
  const className = extractJavaClassName(code) || 'Solution';
  const fileName = `${className}_${timestamp}.java`;
  const filePath = join(tempDir, fileName);

  try {
    await writeFile(filePath, code);
    
    // Compile
    const { stderr: compileError } = await execAsync(`javac "${filePath}"`, {
      timeout: 10000,
      cwd: tempDir
    });

    if (compileError) {
      throw new Error(`Compilation error: ${compileError}`);
    }

    // Execute
    const { stdout, stderr } = await execAsync(`java -cp "${tempDir}" ${className}_${timestamp}`, {
      timeout: 10000,
      cwd: tempDir
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } finally {
    // Clean up
    try {
      await unlink(filePath);
      await unlink(join(tempDir, `${className}_${timestamp}.class`));
    } catch (cleanupError) {
      console.error('Error cleaning up files:', cleanupError);
    }
  }
}

// Execute C++ code
async function executeCpp(code: string, tempDir: string, timestamp: number): Promise<string> {
  const fileName = `program_${timestamp}.cpp`;
  const executableName = `program_${timestamp}`;
  const filePath = join(tempDir, fileName);
  const executablePath = join(tempDir, executableName);

  try {
    await writeFile(filePath, code);
    
    // Compile
    const { stderr: compileError } = await execAsync(`g++ "${filePath}" -o "${executablePath}"`, {
      timeout: 10000,
      cwd: tempDir
    });

    if (compileError) {
      throw new Error(`Compilation error: ${compileError}`);
    }

    // Execute
    const { stdout, stderr } = await execAsync(`"${executablePath}"`, {
      timeout: 10000,
      cwd: tempDir
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout || 'Code executed successfully (no output)';
  } finally {
    // Clean up
    try {
      await unlink(filePath);
      if (process.platform === 'win32') {
        await unlink(`${executablePath}.exe`);
      } else {
        await unlink(executablePath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up files:', cleanupError);
    }
  }
}

// Helper function to extract Java class name
function extractJavaClassName(code: string): string | null {
  const classMatch = code.match(/public\s+class\s+(\w+)/);
  return classMatch ? classMatch[1] : null;
}
