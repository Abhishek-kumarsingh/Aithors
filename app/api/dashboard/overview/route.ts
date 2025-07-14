import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import { getDashboardOverview } from '@/lib/utils/dashboardUtils';
import { UserModel } from '@/lib/models/User';
import { 
  DashboardAnalyticsModel, 
  UserActivityModel, 
  SystemMetricsModel,
  InterviewModel,
  ChatSessionModel 
} from '@/lib/models/DashboardModels';

// GET dashboard overview
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    try {
      await connectToMongoDB();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      // Return mock data when database is not available
      return NextResponse.json({
        overview: {
          users: {
            total: 150,
            newToday: 5,
            newThisWeek: 23,
            activeToday: 45,
            growthRate: 12.5
          },
          interviews: {
            total: 89,
            today: 3,
            completed: 67,
            completedToday: 2,
            completionRate: 75,
            growthRate: 8.3
          },
          chatSessions: {
            total: 234,
            today: 12
          },
          activities: {
            today: 156,
            errors: 3,
            errorRate: 1.9
          },
          systemHealth: {
            status: 'warning',
            cpu: 45,
            memory: 62,
            storage: 38,
            uptime: 86400
          }
        },
        analytics: [],
        recentActivities: [],
        systemMetrics: [],
        timeRange: 'mock',
        mockData: true
      });
    }

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '7d';
    const isAdmin = session.user?.role === 'admin';

    // Calculate time range
    let days = 7;
    switch (timeRange) {
      case '24h':
        days = 1;
        break;
      case '7d':
        days = 7;
        break;
      case '30d':
        days = 30;
        break;
      case '90d':
        days = 90;
        break;
    }

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    if (isAdmin) {
      // Admin gets full dashboard overview
      const overview = await getDashboardOverview(days);

      // Get additional admin-specific metrics
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // User statistics
      const totalUsers = await UserModel.countDocuments();
      const newUsersToday = await UserModel.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });
      const newUsersThisWeek = await UserModel.countDocuments({
        createdAt: { $gte: oneWeekAgo }
      });
      const activeUsersToday = await UserModel.countDocuments({
        lastActivity: { $gte: oneDayAgo }
      });

      // Interview statistics
      const totalInterviews = await InterviewModel.countDocuments();
      const interviewsToday = await InterviewModel.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });
      const completedInterviews = await InterviewModel.countDocuments({
        status: 'completed'
      });
      const completedToday = await InterviewModel.countDocuments({
        status: 'completed',
        endTime: { $gte: oneDayAgo }
      });

      // Chat session statistics
      const totalChatSessions = await ChatSessionModel.countDocuments();
      const chatSessionsToday = await ChatSessionModel.countDocuments({
        createdAt: { $gte: oneDayAgo }
      });

      // Activity statistics
      const activitiesToday = await UserActivityModel.countDocuments({
        timestamp: { $gte: oneDayAgo }
      });
      const errorActivitiesToday = await UserActivityModel.countDocuments({
        timestamp: { $gte: oneDayAgo },
        severity: 'error'
      });

      // Calculate growth rates
      const previousWeekStart = new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
      const previousWeekUsers = await UserModel.countDocuments({
        createdAt: { $gte: previousWeekStart, $lt: oneWeekAgo }
      });
      const userGrowthRate = previousWeekUsers > 0 ? 
        ((newUsersThisWeek - previousWeekUsers) / previousWeekUsers) * 100 : 0;

      const previousWeekInterviews = await InterviewModel.countDocuments({
        createdAt: { $gte: previousWeekStart, $lt: oneWeekAgo }
      });
      const interviewGrowthRate = previousWeekInterviews > 0 ? 
        ((interviewsToday - previousWeekInterviews) / previousWeekInterviews) * 100 : 0;

      return NextResponse.json({
        overview: {
          users: {
            total: totalUsers,
            newToday: newUsersToday,
            newThisWeek: newUsersThisWeek,
            activeToday: activeUsersToday,
            growthRate: Math.round(userGrowthRate * 100) / 100
          },
          interviews: {
            total: totalInterviews,
            today: interviewsToday,
            completed: completedInterviews,
            completedToday: completedToday,
            completionRate: totalInterviews > 0 ? 
              Math.round((completedInterviews / totalInterviews) * 100) : 0,
            growthRate: Math.round(interviewGrowthRate * 100) / 100
          },
          chatSessions: {
            total: totalChatSessions,
            today: chatSessionsToday
          },
          activities: {
            today: activitiesToday,
            errors: errorActivitiesToday,
            errorRate: activitiesToday > 0 ? 
              Math.round((errorActivitiesToday / activitiesToday) * 100) : 0
          },
          systemHealth: overview.summary.systemHealth
        },
        analytics: overview.analytics.slice(0, 30), // Last 30 days max
        recentActivities: overview.recentActivities.slice(0, 20), // Last 20 activities
        systemMetrics: overview.systemMetrics.slice(0, 100), // Last 100 metrics
        timeRange
      });

    } else {
      // Regular user gets limited overview
      const userId = session.user?.id;

      // User's personal statistics
      const userInterviews = await InterviewModel.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      const totalUserInterviews = await InterviewModel.countDocuments({ userId });
      const completedUserInterviews = await InterviewModel.countDocuments({ 
        userId, 
        status: 'completed' 
      });

      const userChatSessions = await ChatSessionModel.countDocuments({ userId });

      const userActivities = await UserActivityModel.find({ userId })
        .sort({ timestamp: -1 })
        .limit(10);

      // Calculate user's average score
      const completedInterviews = await InterviewModel.find({
        userId,
        status: 'completed',
        overallScore: { $exists: true }
      });

      const averageScore = completedInterviews.length > 0 ?
        completedInterviews.reduce((sum, interview) => sum + (interview.overallScore || 0), 0) / completedInterviews.length : 0;

      // User's recent performance trend
      const recentInterviews = await InterviewModel.find({
        userId,
        status: 'completed',
        endTime: { $gte: startDate }
      }).sort({ endTime: 1 });

      return NextResponse.json({
        overview: {
          interviews: {
            total: totalUserInterviews,
            completed: completedUserInterviews,
            completionRate: totalUserInterviews > 0 ? 
              Math.round((completedUserInterviews / totalUserInterviews) * 100) : 0,
            averageScore: Math.round(averageScore * 100) / 100
          },
          chatSessions: {
            total: userChatSessions
          },
          recentPerformance: recentInterviews.map(interview => ({
            date: interview.endTime,
            score: interview.overallScore,
            type: interview.type,
            duration: interview.duration
          }))
        },
        recentInterviews: userInterviews.map(interview => ({
          id: interview._id,
          title: interview.title,
          type: interview.type,
          status: interview.status,
          score: interview.overallScore,
          createdAt: interview.createdAt,
          endTime: interview.endTime
        })),
        recentActivities: userActivities.map(activity => ({
          id: activity._id,
          action: activity.action,
          description: activity.description,
          category: activity.category,
          severity: activity.severity,
          timestamp: activity.timestamp
        })),
        timeRange
      });
    }

  } catch (error: any) {
    console.error('Error in dashboard overview API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to refresh dashboard data
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Admin-only endpoint
    if (session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    await connectToMongoDB();

    const body = await req.json();
    const { action } = body;

    if (action === 'refresh_analytics') {
      // Trigger analytics generation for today
      const { generateDailyAnalytics } = await import('@/lib/utils/dashboardUtils');
      const success = await generateDailyAnalytics();

      return NextResponse.json({
        success,
        message: success ? 'Analytics refreshed successfully' : 'Failed to refresh analytics'
      });

    } else if (action === 'collect_metrics') {
      // Trigger system metrics collection
      const { collectSystemMetrics } = await import('@/lib/utils/dashboardUtils');
      const success = await collectSystemMetrics();

      return NextResponse.json({
        success,
        message: success ? 'System metrics collected successfully' : 'Failed to collect metrics'
      });

    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('Error refreshing dashboard data:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
