import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import PracticeQuestionModel from '@/lib/models/PracticeQuestion';
import UserModel from '@/lib/models/User';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API with load balancing
const geminiApiKeys = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3,
  process.env.GEMINI_API_KEY_4,
  process.env.GEMINI_API_KEY_5
].filter(Boolean);

let currentKeyIndex = 0;

function getNextApiKey() {
  const key = geminiApiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % geminiApiKeys.length;
  return key;
}

// POST - Generate practice questions using AI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      domain,
      subDomain,
      difficulty,
      type,
      count = 5,
      tags = [],
      companies = []
    } = body;

    if (!domain || !difficulty || !type) {
      return NextResponse.json(
        { error: 'Domain, difficulty, and type are required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Generate questions using Gemini API
    const generatedQuestions = await generateQuestionsWithAI(
      domain,
      subDomain,
      difficulty,
      type,
      count,
      tags,
      companies
    );

    // Save questions to database
    const savedQuestions = [];
    for (const questionData of generatedQuestions) {
      try {
        const practiceQuestion = new PracticeQuestionModel({
          title: questionData.title,
          description: questionData.description || questionData.title,
          difficulty,
          domain,
          subDomain,
          category: subDomain || domain,
          tags: [...tags, ...questionData.tags || []],
          type,
          timeLimit: getTimeLimit(difficulty, type),
          points: getPoints(difficulty),
          content: questionData.content,
          companies: [...companies, ...questionData.companies || []],
          skills: questionData.skills || [],
          createdBy: user._id,
          isActive: true,
          stats: {
            totalAttempts: 0,
            correctAttempts: 0,
            averageScore: 0,
            averageTime: 0
          }
        });

        const saved = await practiceQuestion.save();
        savedQuestions.push(saved);
      } catch (error) {
        console.error('Error saving question:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Generated and saved ${savedQuestions.length} practice questions`,
      questions: savedQuestions,
      generated: generatedQuestions.length,
      saved: savedQuestions.length
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating practice questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateQuestionsWithAI(
  domain: string,
  subDomain: string,
  difficulty: string,
  type: string,
  count: number,
  tags: string[],
  companies: string[]
): Promise<any[]> {
  try {
    const apiKey = getNextApiKey();
    if (!apiKey) {
      throw new Error('No Gemini API key available');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = createQuestionGenerationPrompt(
      domain,
      subDomain,
      difficulty,
      type,
      count,
      tags,
      companies
    );

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
    const questions = JSON.parse(cleanedText);

    return Array.isArray(questions) ? questions : [questions];
  } catch (error) {
    console.error('Error generating questions with AI:', error);
    // Return fallback questions if AI fails
    return generateFallbackQuestions(domain, subDomain, difficulty, type, count);
  }
}

function createQuestionGenerationPrompt(
  domain: string,
  subDomain: string,
  difficulty: string,
  type: string,
  count: number,
  tags: string[],
  companies: string[]
): string {
  const typeInstructions = {
    mcq: 'multiple-choice questions with 4 options and one correct answer',
    coding: 'coding problems with clear problem statements, examples, and constraints',
    subjective: 'open-ended questions that require detailed explanations',
    'system-design': 'system design questions focusing on architecture and scalability'
  };

  return `Generate exactly ${count} ${difficulty} level ${typeInstructions[type as keyof typeof typeInstructions]} for ${domain}${subDomain ? ` - ${subDomain}` : ''} domain.

Requirements:
- Each question should be relevant to ${domain}${subDomain ? ` and specifically ${subDomain}` : ''}
- Difficulty level: ${difficulty}
- Question type: ${type}
${tags.length > 0 ? `- Include these skills/tags: ${tags.join(', ')}` : ''}
${companies.length > 0 ? `- Style questions similar to those asked by: ${companies.join(', ')}` : ''}

For each question, provide:
1. A clear, concise title
2. Detailed question content
3. Appropriate difficulty for ${difficulty} level
4. Relevant tags and skills
5. ${type === 'mcq' ? 'Four options (A, B, C, D) with correct answer' : ''}
${type === 'coding' ? 'Sample input/output, constraints, and hints' : ''}

Format your response as a JSON array:
[
  {
    "title": "Question title",
    "content": {
      "question": "Detailed question text",
      ${type === 'mcq' ? '"options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"], "correctAnswer": 0,' : ''}
      ${type === 'coding' ? '"sampleInput": "Example input", "sampleOutput": "Expected output", "constraints": "Problem constraints", "hints": ["Hint 1", "Hint 2"],' : ''}
      "explanation": "Detailed explanation"
    },
    "tags": ["tag1", "tag2"],
    "skills": ["skill1", "skill2"],
    "companies": ["company1", "company2"]
  }
]

Ensure the response is valid JSON that can be parsed directly.`;
}

function generateFallbackQuestions(
  domain: string,
  subDomain: string,
  difficulty: string,
  type: string,
  count: number
): any[] {
  const fallbackQuestions = [];
  
  for (let i = 0; i < count; i++) {
    const question = {
      title: `${domain} ${type} Question ${i + 1}`,
      content: {
        question: `This is a ${difficulty} level ${type} question for ${domain}${subDomain ? ` - ${subDomain}` : ''}.`,
        ...(type === 'mcq' && {
          options: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4'],
          correctAnswer: 0
        }),
        ...(type === 'coding' && {
          sampleInput: 'Sample input',
          sampleOutput: 'Expected output',
          constraints: 'Problem constraints',
          hints: ['Think about the problem step by step']
        }),
        explanation: 'This is a fallback question generated when AI is unavailable.'
      },
      tags: [domain, difficulty],
      skills: [domain],
      companies: []
    };
    
    fallbackQuestions.push(question);
  }
  
  return fallbackQuestions;
}

function getTimeLimit(difficulty: string, type: string): number {
  const baseTime = {
    mcq: { easy: 5, medium: 10, hard: 15 },
    coding: { easy: 30, medium: 45, hard: 60 },
    subjective: { easy: 15, medium: 25, hard: 35 },
    'system-design': { easy: 30, medium: 45, hard: 60 }
  };
  
  return baseTime[type as keyof typeof baseTime]?.[difficulty as keyof typeof baseTime.mcq] || 30;
}

function getPoints(difficulty: string): number {
  const points = { easy: 10, medium: 20, hard: 30 };
  return points[difficulty as keyof typeof points] || 20;
}
