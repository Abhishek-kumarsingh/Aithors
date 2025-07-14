import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import ChatSessionModel from '@/lib/models/ChatSession';
import UserModel from '@/lib/models/User';

// GET - Fetch specific chat session with messages
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const chatSession = await ChatSessionModel.findOne({
      _id: params.id,
      userId: user._id
    }).lean();

    if (!chatSession) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      chatSession
    });

  } catch (error) {
    console.error('Error fetching chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update chat session
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedChatSession = await ChatSessionModel.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedChatSession) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chat session updated successfully',
      chatSession: updatedChatSession
    });

  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific chat session
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const deletedChatSession = await ChatSessionModel.findOneAndDelete({
      _id: params.id,
      userId: user._id
    });

    if (!deletedChatSession) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Add message or update session properties
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, data } = body;

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const chatSession = await ChatSessionModel.findOne({
      _id: params.id,
      userId: user._id
    });

    if (!chatSession) {
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'add_message':
        if (!data.message) {
          return NextResponse.json(
            { error: 'Message data is required' },
            { status: 400 }
          );
        }

        const newMessage = {
          id: Date.now().toString(),
          role: data.message.role,
          content: data.message.content,
          timestamp: new Date(),
          metadata: data.message.metadata || {}
        };

        chatSession.messages.push(newMessage);
        chatSession.metadata.lastActivity = new Date();
        
        // Update token count if provided
        if (data.message.metadata?.tokens) {
          chatSession.metadata.totalTokens += data.message.metadata.tokens;
        }

        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: 'Message added successfully',
          newMessage,
          chatSession
        });

      case 'pin':
        chatSession.metadata.isPinned = !chatSession.metadata.isPinned;
        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: `Chat session ${chatSession.metadata.isPinned ? 'pinned' : 'unpinned'} successfully`,
          chatSession
        });

      case 'archive':
        chatSession.metadata.isActive = false;
        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: 'Chat session archived successfully',
          chatSession
        });

      case 'restore':
        chatSession.metadata.isActive = true;
        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: 'Chat session restored successfully',
          chatSession
        });

      case 'rate':
        if (!data.rating || data.rating < 1 || data.rating > 5) {
          return NextResponse.json(
            { error: 'Rating must be between 1 and 5' },
            { status: 400 }
          );
        }

        chatSession.stats.rating = data.rating;
        chatSession.stats.feedback = data.feedback || '';
        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: 'Chat session rated successfully',
          chatSession
        });

      case 'clear_messages':
        chatSession.messages = [];
        chatSession.metadata.totalMessages = 0;
        chatSession.metadata.totalTokens = 0;
        chatSession.stats.userMessages = 0;
        chatSession.stats.assistantMessages = 0;
        chatSession.stats.codeSnippets = 0;
        await chatSession.save();
        
        return NextResponse.json({
          success: true,
          message: 'Chat messages cleared successfully',
          chatSession
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error updating chat session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
