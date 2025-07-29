import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import TestResultModel from '@/lib/models/TestResult';
import InterviewModel from '@/lib/models/Interview';
import ChatSessionModel from '@/lib/models/ChatSession';
import UserModel from '@/lib/models/User';

// GET - Fetch user dashboard analytics
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
    const user = await UserModel.findOne({ email: session.user.email }).select('_id performance');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(timeRange));

    // Get basic stats
    const [
      totalInterviews,
      completedInterviews,
      totalPracticeSessions,
      totalChatSessions,
      recentTestResults
    ] = await Promise.all([
      InterviewModel.countDocuments({ userId: user._id }),
      InterviewModel.countDocuments({ userId: user._id, status: 'completed' }),
      TestResultModel.countDocuments({ userId: user._id, testType: 'practice' }),
      ChatSessionModel.countDocuments({ userId: user._id }),
      TestResultModel.find({ 
        userId: user._id, 
        'metadata.isCompleted': true,
        createdAt: { $gte: startDate }
      }).sort({ createdAt: -1 }).limit(10)
    ]);

    // Calculate performance metrics
    const performanceMetrics = await TestResultModel.aggregate([
      { 
        $match: { 
          userId: user._id, 
          'metadata.isCompleted': true,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: null,
          averageScore: { $avg: '$performance.score' },
          averageAccuracy: { $avg: '$performance.accuracy' },
          totalTimeSpent: { $sum: '$performance.timeSpent' },
          totalQuestions: { $sum: '$performance.totalQuestions' },
          correctAnswers: { $sum: '$performance.correctAnswers' },
          wrongAnswers: { $sum: '$performance.wrongAnswers' }
        }
      }
    ]);

    // Get daily performance trend
    const dailyPerformance = await TestResultModel.aggregate([
      { 
        $match: { 
          userId: user._id, 
          'metadata.isCompleted': true,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            } 
          },
          averageScore: { $avg: '$performance.score' },
          averageAccuracy: { $avg: '$performance.accuracy' },
          testsCompleted: { $sum: 1 },
          totalTimeSpent: { $sum: '$performance.timeSpent' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get skill-wise performance
    const skillPerformance = await TestResultModel.aggregate([
      { 
        $match: { 
          userId: user._id, 
          'metadata.isCompleted': true,
          createdAt: { $gte: startDate }
        } 
      },
      { $unwind: '$questionResults' },
      { $unwind: '$questionResults.skillTags' },
      {
        $group: {
          _id: '$questionResults.skillTags',
          totalQuestions: { $sum: 1 },
          correctAnswers: { $sum: { $cond: ['$questionResults.isCorrect', 1, 0] } },
          averageTime: { $avg: '$questionResults.timeSpent' },
          totalPoints: { $sum: '$questionResults.points' }
        }
      },
      {
        $addFields: {
          accuracy: { 
            $multiply: [
              { $divide: ['$correctAnswers', '$totalQuestions'] }, 
              100
            ] 
          }
        }
      },
      { $sort: { accuracy: -1 } }
    ]);

    // Get category-wise performance
    const categoryPerformance = await TestResultModel.aggregate([
      { 
        $match: { 
          userId: user._id, 
          'metadata.isCompleted': true,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: '$testCategory',
          testsCompleted: { $sum: 1 },
          averageScore: { $avg: '$performance.score' },
          averageAccuracy: { $avg: '$performance.accuracy' },
          bestScore: { $max: '$performance.score' },
          totalTimeSpent: { $sum: '$performance.timeSpent' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    // Get recent activity
    const recentActivity = await Promise.all([
      InterviewModel.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title type status createdAt results.score')
        .lean(),
      ChatSessionModel.find({ userId: user._id })
        .sort({ 'metadata.lastActivity': -1 })
        .limit(5)
        .select('title metadata.lastActivity stats')
        .lean(),
      TestResultModel.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('testTitle testType performance.score createdAt')
        .lean()
    ]);

    // Calculate streaks and achievements
    const streakData = await calculateStreaks(user._id, startDate);
    const achievements = await calculateAchievements(user._id);

    // Prepare response
    const analytics = {
      overview: {
        totalInterviews,
        completedInterviews,
        practiceSessionsCompleted: totalPracticeSessions,
        chatHistoryCount: totalChatSessions,
        feedbackScore: user.performance?.averageScore || 0,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak
      },
      performance: performanceMetrics[0] || {
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0
      },
      trends: {
        daily: dailyPerformance,
        skills: skillPerformance.slice(0, 10), // Top 10 skills
        categories: categoryPerformance
      },
      recentActivity: {
        interviews: recentActivity[0],
        chatSessions: recentActivity[1],
        testResults: recentActivity[2]
      },
      achievements,
      streaks: streakData,
      timeRange: parseInt(timeRange)
    };

    return NextResponse.json({
      success: true,
      analytics
    });

  } catch (error) {
    console.error('Error fetching user analytics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate streaks
async function calculateStreaks(userId: string, startDate: Date) {
  try {
    const dailyActivity = await TestResultModel.aggregate([
      { 
        $match: { 
          userId: userId, 
          'metadata.isCompleted': true,
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { 
              format: "%Y-%m-%d", 
              date: "$createdAt" 
            } 
          },
          testsCompleted: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date();
    
    // Calculate current streak
    for (let i = 0; i < 30; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasActivity = dailyActivity.some(day => day._id === dateStr);
      
      if (hasActivity) {
        if (dateStr === today || currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (dateStr === today) {
          // No activity today, but check yesterday
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        tempStreak = 0;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return { currentStreak, longestStreak };
  } catch (error) {
    console.error('Error calculating streaks:', error);
    return { currentStreak: 0, longestStreak: 0 };
  }
}

// Helper function to calculate achievements
async function calculateAchievements(userId: string) {
  try {
    const [totalTests, perfectScores, fastCompletions] = await Promise.all([
      TestResultModel.countDocuments({ userId, 'metadata.isCompleted': true }),
      TestResultModel.countDocuments({ userId, 'performance.score': 100 }),
      TestResultModel.countDocuments({ 
        userId, 
        'performance.averageTimePerQuestion': { $lt: 30 } // Less than 30 seconds per question
      })
    ]);

    const achievements = [];

    // Test completion achievements
    if (totalTests >= 1) achievements.push({ name: 'First Test', description: 'Completed your first test', icon: '🎯' });
    if (totalTests >= 10) achievements.push({ name: 'Test Taker', description: 'Completed 10 tests', icon: '📝' });
    if (totalTests >= 50) achievements.push({ name: 'Test Master', description: 'Completed 50 tests', icon: '🏆' });
    if (totalTests >= 100) achievements.push({ name: 'Test Legend', description: 'Completed 100 tests', icon: '👑' });

    // Perfect score achievements
    if (perfectScores >= 1) achievements.push({ name: 'Perfect Score', description: 'Achieved 100% on a test', icon: '💯' });
    if (perfectScores >= 5) achievements.push({ name: 'Perfectionist', description: 'Achieved 100% on 5 tests', icon: '⭐' });

    // Speed achievements
    if (fastCompletions >= 1) achievements.push({ name: 'Speed Demon', description: 'Completed test quickly', icon: '⚡' });

    return achievements;
  } catch (error) {
    console.error('Error calculating achievements:', error);
    return [];
  }
}
