import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import InterviewModel from '@/lib/models/Interview';
import UserModel from '@/lib/models/User';
import { TestResultModel } from '@/lib/models/TestResult';

// GET - Fetch specific interview
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

    const interview = await InterviewModel.findOne({
      _id: params.id,
      userId: user._id
    }).lean();

    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      interview
    });

  } catch (error) {
    console.error('Error fetching interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update interview
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

    const updatedInterview = await InterviewModel.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedInterview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Interview updated successfully',
      interview: updatedInterview
    });

  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Handle specific actions like completing interview
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

    const { action, data } = await request.json();

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get the interview
    const interview = await InterviewModel.findOne({ _id: params.id, userId: user._id });
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    if (action === 'complete') {
      // Update interview status
      const updatedInterview = await InterviewModel.findOneAndUpdate(
        { _id: params.id, userId: user._id },
        {
          $set: {
            status: 'completed',
            completedAt: new Date(),
            duration: data.duration || 0
          }
        },
        { new: true, runValidators: true }
      );

      // Create TestResult for feedback
      const testResult = new TestResultModel({
        userId: user._id,
        interviewId: interview._id,
        testTitle: interview.title || `${interview.type} Interview`,
        testType: 'interview',
        testCategory: interview.type || 'General',
        difficulty: interview.difficulty || 'medium',
        performance: {
          score: calculateScore(interview.questions || []),
          accuracy: calculateAccuracy(interview.questions || []),
          totalQuestions: interview.questions?.length || 0,
          correctAnswers: countCorrectAnswers(interview.questions || []),
          timeSpent: data.duration || 0
        },
        feedback: {
          strengths: ["Interview completed successfully"],
          improvements: ["Continue practicing"],
          recommendations: ["Review your answers"],
          overallRating: 4.0
        },
        completedAt: new Date(),
        status: 'completed',
        metadata: {
          isCompleted: true,
          submittedAt: new Date(),
          browserInfo: 'Web Application',
          ipAddress: '127.0.0.1'
        }
      });

      await testResult.save();

      return NextResponse.json({
        success: true,
        message: 'Interview completed successfully',
        interview: updatedInterview,
        testResultId: testResult._id
      });
    } else if (action === 'cancel') {
      // Update interview status to cancelled
      const updatedInterview = await InterviewModel.findOneAndUpdate(
        { _id: params.id, userId: user._id },
        { $set: { status: 'cancelled' } },
        { new: true, runValidators: true }
      );

      return NextResponse.json({
        success: true,
        message: 'Interview cancelled',
        interview: updatedInterview
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error handling interview action:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper functions for calculating performance metrics
function calculateScore(questions: any[]): number {
  if (!questions || questions.length === 0) return 0;
  const correctAnswers = countCorrectAnswers(questions);
  return Math.round((correctAnswers / questions.length) * 100);
}

function calculateAccuracy(questions: any[]): number {
  if (!questions || questions.length === 0) return 0;
  const answeredQuestions = questions.filter(q => q.userAnswer);
  if (answeredQuestions.length === 0) return 0;
  const correctAnswers = countCorrectAnswers(answeredQuestions);
  return Math.round((correctAnswers / answeredQuestions.length) * 100);
}

function countCorrectAnswers(questions: any[]): number {
  return questions.filter(q => {
    if (q.type === 'multiple-choice') {
      return q.userAnswer === q.correctAnswer;
    } else if (q.type === 'coding') {
      // For coding questions, we'll assume they're correct if answered
      return q.userAnswer && q.userAnswer.trim().length > 0;
    } else {
      // For other types, basic check
      return q.userAnswer && q.userAnswer.trim().length > 0;
    }
  }).length;
}

// DELETE - Delete specific interview
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

    const deletedInterview = await InterviewModel.findOneAndDelete({
      _id: params.id,
      userId: user._id
    });

    if (!deletedInterview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Interview deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


