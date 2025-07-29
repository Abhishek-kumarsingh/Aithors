import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import PracticeSessionModel from '@/lib/models/PracticeSession';
import UserModel from '@/lib/models/User';

// GET - Fetch user practice statistics
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

    // Get all practice sessions for the user
    const sessions = await PracticeSessionModel.find({ userId: user._id }).lean();

    // Calculate statistics
    const stats = {
      totalQuestions: 0,
      questionsAttempted: 0,
      questionsCompleted: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      streakDays: 0,
      favoriteCategory: 'Algorithms',
      strongestSkill: 'Problem Solving',
      weeklyProgress: 0
    };

    if (sessions.length > 0) {
      const completedSessions = sessions.filter(s => s.isCompleted);
      
      stats.questionsAttempted = sessions.length;
      stats.questionsCompleted = completedSessions.length;
      stats.totalTimeSpent = sessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0);
      
      if (completedSessions.length > 0) {
        const totalScore = completedSessions.reduce((sum, s) => sum + (s.score || 0), 0);
        stats.averageScore = totalScore / completedSessions.length;
      }

      // Calculate streak (simplified - consecutive days with practice)
      const today = new Date();
      const practiceDate = new Date(sessions[sessions.length - 1].createdAt);
      const daysDiff = Math.floor((today.getTime() - practiceDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        stats.streakDays = Math.min(sessions.length, 30); // Cap at 30 for demo
      }

      // Calculate weekly progress (simplified)
      const lastWeekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.createdAt);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      });

      const previousWeekSessions = sessions.filter(s => {
        const sessionDate = new Date(s.createdAt);
        const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= twoWeeksAgo && sessionDate < weekAgo;
      });

      if (previousWeekSessions.length > 0) {
        stats.weeklyProgress = ((lastWeekSessions.length - previousWeekSessions.length) / previousWeekSessions.length) * 100;
      } else if (lastWeekSessions.length > 0) {
        stats.weeklyProgress = 100;
      }
    }

    // Get total available questions (simplified)
    stats.totalQuestions = 150; // This would come from PracticeQuestionModel.countDocuments()

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching practice stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
