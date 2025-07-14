import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import ChatSessionModel from '@/lib/models/ChatSession';
import UserModel from '@/lib/models/User';

// GET - Fetch user chat sessions
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
    const isActive = searchParams.get('active');
    const isPinned = searchParams.get('pinned');

    // Build query
    const query: any = { userId: user._id };
    if (isActive !== null) query['metadata.isActive'] = isActive === 'true';
    if (isPinned !== null) query['metadata.isPinned'] = isPinned === 'true';

    // Get chat sessions with pagination
    const chatSessions = await ChatSessionModel.find(query)
      .sort({ 'metadata.lastActivity': -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('-messages') // Exclude messages for list view
      .lean();

    const totalCount = await ChatSessionModel.countDocuments(query);

    return NextResponse.json({
      success: true,
      chatSessions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new chat session
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
    const { title, description, config, initialMessage } = body;

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Create new chat session
    const newChatSession = new ChatSessionModel({
      userId: user._id,
      title: title || 'New Chat',
      description: description || '',
      config: {
        model: config?.model || 'gemini',
        temperature: config?.temperature || 0.7,
        maxTokens: config?.maxTokens || 2048,
        systemPrompt: config?.systemPrompt || 'You are a helpful AI assistant for interview preparation and coding practice.'
      },
      messages: initialMessage ? [{
        id: Date.now().toString(),
        role: 'user',
        content: initialMessage,
        timestamp: new Date()
      }] : [],
      metadata: {
        totalMessages: initialMessage ? 1 : 0,
        totalTokens: 0,
        totalCost: 0,
        averageResponseTime: 0,
        sessionDuration: 0,
        lastActivity: new Date(),
        isActive: true,
        isPinned: false,
        tags: []
      },
      stats: {
        userMessages: initialMessage ? 1 : 0,
        assistantMessages: 0,
        codeSnippets: 0,
        questionsAsked: 0,
        problemsSolved: 0
      },
      sharing: {
        isPublic: false,
        allowComments: false,
        viewCount: 0,
        likes: 0
      }
    });

    const savedChatSession = await newChatSession.save();

    return NextResponse.json({
      success: true,
      message: 'Chat session created successfully',
      chatSession: savedChatSession
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete multiple chat sessions
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
    const { sessionIds } = body;

    if (!sessionIds || !Array.isArray(sessionIds) || sessionIds.length === 0) {
      return NextResponse.json(
        { error: 'Session IDs are required' },
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

    // Delete chat sessions (only user's own sessions)
    const result = await ChatSessionModel.deleteMany({
      _id: { $in: sessionIds },
      userId: user._id
    });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} chat session(s) deleted successfully`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('Error deleting chat sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
