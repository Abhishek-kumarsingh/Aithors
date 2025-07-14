import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import PracticeSessionModel from '@/lib/models/PracticeSession';
import UserModel from '@/lib/models/User';

// GET - Fetch user practice sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const questionId = searchParams.get('questionId');

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build query
    const query: any = { userId: user._id };
    if (questionId) {
      query.questionId = questionId;
    }

    // Fetch sessions with pagination
    const sessions = await PracticeSessionModel.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalSessions = await PracticeSessionModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      sessions,
      pagination: {
        page,
        limit,
        total: totalSessions,
        pages: Math.ceil(totalSessions / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching practice sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new practice session
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
    const { questionId, timeLimit } = body;

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
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

    // Check if there's an existing incomplete session for this question
    const existingSession = await PracticeSessionModel.findOne({
      userId: user._id,
      questionId,
      isCompleted: false
    });

    if (existingSession) {
      // Resume existing session
      return NextResponse.json({
        success: true,
        message: 'Resumed existing practice session',
        session: existingSession
      });
    }

    // Create new practice session
    const practiceSession = new PracticeSessionModel({
      userId: user._id,
      questionId,
      startTime: new Date(),
      timeLimit: timeLimit || 60, // Default 60 minutes
      timeSpent: 0,
      answer: '',
      isCompleted: false,
      metadata: {
        userAgent: request.headers.get('user-agent') || '',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
      }
    });

    await practiceSession.save();

    return NextResponse.json({
      success: true,
      message: 'Practice session created successfully',
      session: practiceSession
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating practice session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
