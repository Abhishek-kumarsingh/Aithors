import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import PracticeQuestionModel from '@/lib/models/PracticeQuestion';
import UserModel from '@/lib/models/User';

// GET - Fetch a specific practice question by ID
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

    const { id } = params;

    if (!id) {
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

    // Fetch the specific question
    const question = await PracticeQuestionModel.findById(id).lean();

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if question is active
    if (!question.isActive) {
      return NextResponse.json(
        { error: 'Question is not available' },
        { status: 404 }
      );
    }

    // Add user-specific data (attempts, bookmarks, etc.)
    const questionWithUserData = {
      ...question,
      attempts: 0, // TODO: Get from user practice sessions
      isBookmarked: false, // TODO: Get from user bookmarks
      lastAttempted: null, // TODO: Get from user practice sessions
      bestScore: null // TODO: Get from user practice sessions
    };

    return NextResponse.json({
      success: true,
      question: questionWithUserData
    });

  } catch (error) {
    console.error('Error fetching practice question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update practice question (admin only)
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
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
      title,
      description,
      difficulty,
      domain,
      category,
      tags,
      type,
      timeLimit,
      points,
      content,
      companies,
      skills,
      isActive
    } = body;

    await connectToMongoDB();

    // Update the practice question
    const updatedQuestion = await PracticeQuestionModel.findByIdAndUpdate(
      id,
      {
        title,
        description,
        difficulty,
        domain,
        category,
        tags: tags || [],
        type,
        timeLimit,
        points,
        content,
        companies: companies || [],
        skills: skills || [],
        isActive: isActive !== undefined ? isActive : true
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Practice question updated successfully',
      question: updatedQuestion
    });

  } catch (error) {
    console.error('Error updating practice question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete practice question (admin only)
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
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

    await connectToMongoDB();

    // Soft delete by setting isActive to false
    const deletedQuestion = await PracticeQuestionModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!deletedQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Practice question deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting practice question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
