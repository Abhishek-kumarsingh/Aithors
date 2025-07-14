import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import TestResultModel from '@/lib/models/TestResult';
import UserModel from '@/lib/models/User';

// GET - Fetch user test results
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
    const testType = searchParams.get('testType');
    const testCategory = searchParams.get('testCategory');
    const difficulty = searchParams.get('difficulty');
    const isCompleted = searchParams.get('completed');

    // Build query
    const query: any = { userId: user._id };
    if (testType) query.testType = testType;
    if (testCategory) query.testCategory = testCategory;
    if (difficulty) query.difficulty = difficulty;
    if (isCompleted !== null) query['metadata.isCompleted'] = isCompleted === 'true';

    // Get test results with pagination
    const testResults = await TestResultModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await TestResultModel.countDocuments(query);

    // Get analytics data
    const analytics = await TestResultModel.aggregate([
      { $match: { userId: user._id, 'metadata.isCompleted': true } },
      {
        $group: {
          _id: null,
          totalTests: { $sum: 1 },
          averageScore: { $avg: '$performance.score' },
          averageAccuracy: { $avg: '$performance.accuracy' },
          totalTimeSpent: { $sum: '$performance.timeSpent' },
          bestScore: { $max: '$performance.score' },
          worstScore: { $min: '$performance.score' }
        }
      }
    ]);

    // Get category-wise performance
    const categoryPerformance = await TestResultModel.aggregate([
      { $match: { userId: user._id, 'metadata.isCompleted': true } },
      {
        $group: {
          _id: '$testCategory',
          count: { $sum: 1 },
          averageScore: { $avg: '$performance.score' },
          averageAccuracy: { $avg: '$performance.accuracy' },
          bestScore: { $max: '$performance.score' }
        }
      },
      { $sort: { averageScore: -1 } }
    ]);

    return NextResponse.json({
      success: true,
      testResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      analytics: analytics[0] || {
        totalTests: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        worstScore: 0
      },
      categoryPerformance
    });

  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new test result
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
      interviewId,
      questionId,
      testType,
      testTitle,
      testCategory,
      difficulty,
      performance,
      questionResults,
      skillAnalysis,
      feedback,
      metadata,
      insights
    } = body;

    // Validation
    if (!testType || !testTitle || !testCategory || !difficulty || !performance || !metadata) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Get previous test result for comparison
    let comparison = undefined;
    if (testType === 'practice' || testType === 'assessment') {
      const previousResult = await TestResultModel.findOne({
        userId: user._id,
        testCategory,
        difficulty,
        'metadata.isCompleted': true
      }).sort({ createdAt: -1 });

      if (previousResult) {
        comparison = {
          previousScore: previousResult.performance.score,
          scoreImprovement: performance.score - previousResult.performance.score,
          previousAccuracy: previousResult.performance.accuracy,
          accuracyImprovement: performance.accuracy - previousResult.performance.accuracy,
          previousTime: previousResult.performance.timeSpent,
          timeImprovement: previousResult.performance.timeSpent - performance.timeSpent,
          overallProgress: performance.score > previousResult.performance.score ? 'improved' : 
                          performance.score < previousResult.performance.score ? 'declined' : 'stable'
        };
      }
    }

    // Create new test result
    const newTestResult = new TestResultModel({
      userId: user._id,
      interviewId,
      questionId,
      testType,
      testTitle,
      testCategory,
      difficulty,
      performance,
      questionResults: questionResults || [],
      skillAnalysis: skillAnalysis || new Map(),
      feedback: feedback || {
        overallFeedback: '',
        strengths: [],
        weaknesses: [],
        improvements: [],
        recommendations: [],
        nextSteps: []
      },
      comparison,
      metadata,
      insights: insights || {
        strongAreas: [],
        weakAreas: [],
        timeManagement: 'average',
        consistencyScore: 0,
        confidenceLevel: 0,
        recommendedDifficulty: difficulty
      }
    });

    const savedTestResult = await newTestResult.save();

    // Update user performance statistics
    await updateUserPerformance(user._id, savedTestResult);

    return NextResponse.json({
      success: true,
      message: 'Test result saved successfully',
      testResult: savedTestResult
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating test result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to update user performance statistics
async function updateUserPerformance(userId: string, testResult: any) {
  try {
    const user = await UserModel.findById(userId);
    if (!user) return;

    if (!user.performance) {
      user.performance = {
        totalInterviews: 0,
        completedInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyProgress: 0,
        monthlyProgress: 0,
        skillProgress: new Map()
      };
    }

    // Update basic stats
    if (testResult.testType === 'interview') {
      user.performance.totalInterviews += 1;
      if (testResult.metadata.isCompleted) {
        user.performance.completedInterviews += 1;
      }
    }

    if (testResult.metadata.isCompleted) {
      // Update average score
      const totalCompleted = user.performance.completedInterviews;
      const currentAvg = user.performance.averageScore || 0;
      user.performance.averageScore = ((currentAvg * (totalCompleted - 1)) + testResult.performance.score) / totalCompleted;

      // Update best score
      if (testResult.performance.score > (user.performance.bestScore || 0)) {
        user.performance.bestScore = testResult.performance.score;
      }

      // Update skill progress
      if (testResult.skillAnalysis) {
        for (const [skill, data] of Object.entries(testResult.skillAnalysis)) {
          const skillData = data as any;
          user.performance.skillProgress.set(skill, {
            score: skillData.accuracy,
            improvement: skillData.improvement || 0,
            lastUpdated: new Date()
          });
        }
      }
    }

    await user.save();
  } catch (error) {
    console.error('Error updating user performance:', error);
  }
}
