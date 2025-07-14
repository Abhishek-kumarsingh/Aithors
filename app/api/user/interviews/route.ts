import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import InterviewModel from '@/lib/models/Interview';
import UserModel from '@/lib/models/User';

// GET - Fetch user interviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');

    // Build query
    const query: any = { userId: user._id };
    if (status) query.status = status;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    // Get interviews with pagination
    const interviews = await InterviewModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await InterviewModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      interviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new interview
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
    const { 
      title, 
      type, 
      difficulty, 
      setupMethod, 
      resumeData, 
      techStackData 
    } = body;

    // Validation
    if (!title || !type || !difficulty || !setupMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (setupMethod === 'resume' && !resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required for resume setup method' },
        { status: 400 }
      );
    }

    if (setupMethod === 'techstack' && !techStackData) {
      return NextResponse.json(
        { error: 'Tech stack data is required for tech stack setup method' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new interview
    const newInterview = new InterviewModel({
      userId: user._id,
      title,
      type,
      difficulty,
      setupMethod,
      resumeData: setupMethod === 'resume' ? resumeData : undefined,
      techStackData: setupMethod === 'techstack' ? techStackData : undefined,
      status: 'pending',
      questions: [],
      results: {
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        skippedAnswers: 0,
        accuracy: 0,
        totalTimeSpent: 0,
        averageTimePerQuestion: 0,
        score: 0,
        skillWiseScore: new Map()
      },
      feedback: {
        overallFeedback: '',
        strengths: [],
        improvements: [],
        recommendations: [],
        nextSteps: []
      },
      duration: 0
    });

    const savedInterview = await newInterview.save();

    return NextResponse.json({
      success: true,
      message: 'Interview created successfully',
      interview: savedInterview
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple interviews
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { interviewIds } = body;

    if (!interviewIds || !Array.isArray(interviewIds) || interviewIds.length === 0) {
      return NextResponse.json(
        { error: 'Interview IDs are required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete interviews (only user's own interviews)
    const result = await InterviewModel.deleteMany({
      _id: { $in: interviewIds },
      userId: user._id
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} interview(s) deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting interviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
