import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";
import EnhancedInterviewModel from "@/lib/models/EnhancedInterview";
import UserModel from "@/lib/models/User";

// AI providers for question generation
const AI_PROVIDERS = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
};

async function extractResumeText(resumeFile: File): Promise<string> {
  // In a real implementation, you would use a PDF parsing library
  // For now, return a mock extracted text
  return `
    John Doe
    Senior Software Engineer
    
    Experience:
    - 5 years of experience in React and Node.js
    - Built scalable web applications
    - Experience with TypeScript, MongoDB, AWS
    
    Skills:
    - Frontend: React, Vue.js, JavaScript, TypeScript
    - Backend: Node.js, Python, Express.js
    - Database: MongoDB, PostgreSQL
    - Cloud: AWS, Docker, Kubernetes
    
    Projects:
    - E-commerce platform with 100k+ users
    - Real-time chat application
    - Microservices architecture implementation
  `;
}

async function generateQuestionsWithAI(
  provider: string,
  config: any,
  resumeText?: string
): Promise<any[]> {
  const prompt = createQuestionGenerationPrompt(config, resumeText);
  
  try {
    let response;
    
    switch (provider) {
      case 'gemini':
        response = await callGeminiAPI(prompt);
        break;
      case 'deepseek':
        response = await callDeepSeekAPI(prompt);
        break;
      case 'claude':
        response = await callClaudeAPI(prompt);
        break;
      case 'openai':
        response = await callOpenAIAPI(prompt);
        break;
      default:
        response = await callGeminiAPI(prompt);
    }
    
    return parseGeneratedQuestions(response.content);
  } catch (error) {
    console.error(`Error generating questions with ${provider}:`, error);
    // Fallback to mock questions if AI fails
    return generateMockQuestions(config);
  }
}

function createQuestionGenerationPrompt(config: any, resumeText?: string): string {
  let prompt = `Generate interview questions based on the following requirements:

Domain: ${config.domain}
Difficulty: ${config.difficulty}
Tech Stack: ${config.techStack?.join(', ') || 'General'}

Question Types Needed:`;

  if (config.questionCounts.mcq > 0) {
    prompt += `\n- ${config.questionCounts.mcq} Multiple Choice Questions (MCQ)`;
  }
  if (config.questionCounts.subjective > 0) {
    prompt += `\n- ${config.questionCounts.subjective} Subjective Questions`;
  }
  if (config.questionCounts.coding > 0) {
    prompt += `\n- ${config.questionCounts.coding} Coding Questions`;
  }
  if (config.questionCounts.bugFix > 0) {
    prompt += `\n- ${config.questionCounts.bugFix} Bug Fix Questions`;
  }

  if (resumeText) {
    prompt += `\n\nCandidate Resume:\n${resumeText}\n\nGenerate questions that are relevant to the candidate's experience and skills mentioned in the resume.`;
  }

  prompt += `\n\nReturn the questions in the following JSON format:
{
  "questions": [
    {
      "id": "unique_id",
      "type": "mcq|subjective|coding|bug-fix",
      "question": "Question text",
      "difficulty": "easy|medium|hard",
      "domain": "${config.domain}",
      "options": ["option1", "option2", "option3", "option4"], // Only for MCQ
      "correctAnswer": 0, // Only for MCQ (index of correct option)
      "codeSnippet": "starter code", // Only for coding questions
      "language": "javascript|python|java|cpp", // Only for coding questions
      "testCases": [{"input": "test input", "expectedOutput": "expected output"}], // Only for coding
      "buggyCode": "code with bug", // Only for bug-fix
      "fixedCode": "corrected code", // Only for bug-fix
      "bugDescription": "description of the bug" // Only for bug-fix
    }
  ]
}`;

  return prompt;
}

async function callGeminiAPI(prompt: string) {
  const response = await fetch(`${AI_PROVIDERS.gemini.endpoint}?key=${AI_PROVIDERS.gemini.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    tokens: data.usageMetadata?.totalTokenCount || 0,
  };
}

async function callDeepSeekAPI(prompt: string) {
  const response = await fetch(AI_PROVIDERS.deepseek.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_PROVIDERS.deepseek.apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
  };
}

async function callClaudeAPI(prompt: string) {
  const response = await fetch(AI_PROVIDERS.claude.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_PROVIDERS.claude.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
  };
}

async function callOpenAIAPI(prompt: string) {
  const response = await fetch(AI_PROVIDERS.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_PROVIDERS.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
  };
}

function parseGeneratedQuestions(content: string): any[] {
  try {
    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.questions || [];
    }
  } catch (error) {
    console.error('Error parsing AI response:', error);
  }
  
  // Return empty array if parsing fails
  return [];
}

function generateMockQuestions(config: any): any[] {
  const questions = [];
  let questionId = 1;

  // Generate MCQ questions
  for (let i = 0; i < config.questionCounts.mcq; i++) {
    questions.push({
      id: `mcq_${questionId++}`,
      type: 'mcq',
      question: `What is the primary purpose of ${config.techStack[0] || 'React'} in web development?`,
      difficulty: config.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] : config.difficulty,
      domain: config.domain,
      options: [
        'Building user interfaces',
        'Database management',
        'Server-side rendering',
        'Network security'
      ],
      correctAnswer: 0,
    });
  }

  // Generate subjective questions
  for (let i = 0; i < config.questionCounts.subjective; i++) {
    questions.push({
      id: `subj_${questionId++}`,
      type: 'subjective',
      question: `Explain the concept of state management in ${config.techStack[0] || 'React'} applications and discuss different approaches.`,
      difficulty: config.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] : config.difficulty,
      domain: config.domain,
    });
  }

  // Generate coding questions
  for (let i = 0; i < config.questionCounts.coding; i++) {
    questions.push({
      id: `code_${questionId++}`,
      type: 'coding',
      question: 'Write a function to reverse a string without using built-in reverse methods.',
      difficulty: config.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] : config.difficulty,
      domain: config.domain,
      codeSnippet: `function reverseString(str) {
  // Your code here
  
}`,
      language: 'javascript',
      testCases: [
        { input: '"hello"', expectedOutput: '"olleh"' },
        { input: '"world"', expectedOutput: '"dlrow"' },
      ],
    });
  }

  // Generate bug fix questions
  for (let i = 0; i < config.questionCounts.bugFix; i++) {
    questions.push({
      id: `bug_${questionId++}`,
      type: 'bug-fix',
      question: 'Fix the bug in the following function that should calculate the factorial of a number.',
      difficulty: config.difficulty === 'mixed' ? ['easy', 'medium', 'hard'][i % 3] : config.difficulty,
      domain: config.domain,
      buggyCode: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n); // Bug: should be n-1
}`,
      fixedCode: `function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}`,
      bugDescription: 'The recursive call should use n-1, not n, to avoid infinite recursion.',
      language: 'javascript',
    });
  }

  return questions;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const configStr = formData.get('config') as string;
    const provider = formData.get('provider') as string || 'gemini';
    const resumeFile = formData.get('resume') as File | null;

    if (!configStr) {
      return NextResponse.json({ error: "Configuration is required" }, { status: 400 });
    }

    const config = JSON.parse(configStr);

    await connectToDatabase();

    // Find user
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract resume text if provided
    let resumeText: string | undefined;
    let resumeAnalysis: any = undefined;

    if (resumeFile && (config.type === 'resume_based' || config.type === 'mixed')) {
      resumeText = await extractResumeText(resumeFile);
      
      // Analyze resume (mock analysis for now)
      resumeAnalysis = {
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        experience: '5 years',
        projects: ['E-commerce platform', 'Real-time chat application'],
        technologies: ['JavaScript', 'Python', 'Docker', 'Kubernetes'],
        aiSummary: 'Experienced full-stack developer with strong React and Node.js skills',
      };
    }

    // Generate questions using AI
    const questions = await generateQuestionsWithAI(provider, config, resumeText);

    // Create interview session
    const interview = new EnhancedInterviewModel({
      userId: user._id,
      title: `${config.domain} Interview - ${config.difficulty}`,
      description: `AI-generated interview for ${config.domain} development`,
      type: config.type,
      difficulty: config.difficulty,
      domain: config.domain,
      subDomain: config.subDomain,
      questionConfig: {
        totalQuestions: Object.values(config.questionCounts).reduce((sum: number, count: any) => sum + count, 0),
        questionTypes: config.questionCounts,
        timeLimit: config.duration,
        voiceEnabled: config.voiceEnabled,
      },
      resumeAnalysis,
      questions: questions.map(q => ({
        ...q,
        createdAt: new Date(),
      })),
      status: 'scheduled',
      performance: {
        overallScore: 0,
        categoryScores: {
          mcq: 0,
          subjective: 0,
          coding: 0,
          bugFix: 0,
        },
        timeEfficiency: 0,
        accuracyRate: 0,
        completionRate: 0,
      },
      feedback: {
        overall: '',
        strengths: [],
        weaknesses: [],
        recommendations: [],
        skillAssessment: new Map(),
        nextSteps: [],
      },
      apiUsage: {
        questionGeneration: {
          provider,
          tokensUsed: 0, // Will be updated with actual usage
          cost: 0,
        },
        feedbackGeneration: {
          provider,
          tokensUsed: 0,
          cost: 0,
        },
      },
      metadata: {
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '',
        deviceInfo: {
          browser: 'Unknown',
          os: 'Unknown',
          device: 'Unknown',
        },
        interviewMode: 'practice',
        tags: config.techStack || [],
      },
      savedToQuestionBank: false,
    });

    await interview.save();

    return NextResponse.json({
      success: true,
      interviewId: interview._id,
      questionsGenerated: questions.length,
    });

  } catch (error) {
    console.error("Error creating enhanced interview:", error);
    return NextResponse.json(
      { error: "Failed to create interview" },
      { status: 500 }
    );
  }
}
