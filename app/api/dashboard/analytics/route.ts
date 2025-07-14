import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import { 
  DashboardAnalyticsModel, 
  UserActivityModel, 
  InterviewModel, 
  ChatSessionModel 
} from '@/lib/models/DashboardModels';
import { UserModel } from '@/lib/models/User';
import { generateDailyAnalytics } from '@/lib/utils/dashboardUtils';

// GET dashboard analytics
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '7d';
    const type = searchParams.get('type') || 'overview';

    // Calculate time range
    let startDate: Date;
    const endDate = new Date();

    switch (timeRange) {
      case '24h':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    if (type === 'overview') {
      // Get overview analytics
      const analytics = await DashboardAnalyticsModel.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });

      if (analytics.length === 0) {
        return NextResponse.json({
          analytics: [],
          summary: {
            totalUsers: 0,
            activeUsers: 0,
            totalInterviews: 0,
            averageScore: 0,
            growth: {
              users: 0,
              interviews: 0,
              activity: 0
            }
          },
          timeRange
        });
      }

      // Calculate growth rates
      const latest = analytics[0];
      const previous = analytics[Math.min(7, analytics.length - 1)];
      
      const userGrowth = previous ? 
        ((latest.metrics.totalUsers - previous.metrics.totalUsers) / previous.metrics.totalUsers) * 100 : 0;
      const interviewGrowth = previous ? 
        ((latest.metrics.totalInterviews - previous.metrics.totalInterviews) / previous.metrics.totalInterviews) * 100 : 0;
      const activityGrowth = previous ? 
        ((latest.metrics.activeUsers - previous.metrics.activeUsers) / previous.metrics.activeUsers) * 100 : 0;

      return NextResponse.json({
        analytics: analytics.map(a => ({
          date: a.date,
          totalUsers: a.metrics.totalUsers,
          activeUsers: a.metrics.activeUsers,
          newUsers: a.metrics.newUsers,
          totalInterviews: a.metrics.totalInterviews,
          completedInterviews: a.metrics.completedInterviews,
          averageScore: a.metrics.averageScore,
          averageDuration: a.metrics.averageDuration
        })),
        summary: {
          totalUsers: latest.metrics.totalUsers,
          activeUsers: latest.metrics.activeUsers,
          totalInterviews: latest.metrics.totalInterviews,
          averageScore: Math.round(latest.metrics.averageScore * 100) / 100,
          growth: {
            users: Math.round(userGrowth * 100) / 100,
            interviews: Math.round(interviewGrowth * 100) / 100,
            activity: Math.round(activityGrowth * 100) / 100
          }
        },
        timeRange
      });

    } else if (type === 'skills') {
      // Get skills analytics
      const analytics = await DashboardAnalyticsModel.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });

      // Aggregate skills data
      const skillsMap = new Map();
      analytics.forEach((a: any) => {
        a.metrics.topSkills.forEach((skill: any) => {
          if (skillsMap.has(skill.skill)) {
            const existing = skillsMap.get(skill.skill);
            skillsMap.set(skill.skill, {
              skill: skill.skill,
              count: existing.count + skill.count,
              totalScore: existing.totalScore + (skill.averageScore * skill.count),
              sessions: existing.sessions + 1
            });
          } else {
            skillsMap.set(skill.skill, {
              skill: skill.skill,
              count: skill.count,
              totalScore: skill.averageScore * skill.count,
              sessions: 1
            });
          }
        });
      });

      const skillsData = Array.from(skillsMap.values())
        .map(skill => ({
          skill: skill.skill,
          count: skill.count,
          averageScore: Math.round((skill.totalScore / skill.count) * 100) / 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return NextResponse.json({
        skills: skillsData,
        timeRange
      });

    } else if (type === 'engagement') {
      // Get user engagement analytics
      const analytics = await DashboardAnalyticsModel.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });

      const engagementData = analytics.map(a => ({
        date: a.date,
        dailyActive: a.metrics.userEngagement.dailyActiveUsers,
        weeklyActive: a.metrics.userEngagement.weeklyActiveUsers,
        monthlyActive: a.metrics.userEngagement.monthlyActiveUsers,
        avgSessionDuration: a.metrics.userEngagement.averageSessionDuration
      }));

      return NextResponse.json({
        engagement: engagementData,
        timeRange
      });

    } else if (type === 'performance') {
      // Get system performance analytics
      const analytics = await DashboardAnalyticsModel.find({
        date: { $gte: startDate, $lte: endDate }
      }).sort({ date: -1 });

      const performanceData = analytics.map(a => ({
        date: a.date,
        responseTime: a.metrics.systemPerformance.averageResponseTime,
        errorRate: a.metrics.systemPerformance.errorRate,
        uptime: a.metrics.systemPerformance.uptime
      }));

      return NextResponse.json({
        performance: performanceData,
        timeRange
      });

    } else if (type === 'realtime') {
      // Get real-time statistics
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      // Get current active users (active in last 5 minutes)
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const activeUsers = await UserModel.countDocuments({
        lastActivity: { $gte: fiveMinutesAgo }
      });

      // Get recent activities
      const recentActivities = await UserActivityModel.find({
        timestamp: { $gte: oneHourAgo }
      })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 })
      .limit(20);

      // Get today's stats
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const todayUsers = await UserModel.countDocuments({
        lastLogin: { $gte: todayStart }
      });

      const todayInterviews = await InterviewModel.countDocuments({
        createdAt: { $gte: todayStart }
      });

      const todayCompletedInterviews = await InterviewModel.countDocuments({
        status: 'completed',
        endTime: { $gte: todayStart }
      });

      return NextResponse.json({
        realtime: {
          activeUsers,
          todayUsers,
          todayInterviews,
          todayCompletedInterviews,
          recentActivities: recentActivities.map(activity => ({
            id: activity._id,
            user: activity.userId ? {
              name: (activity.userId as any).name,
              email: (activity.userId as any).email
            } : null,
            action: activity.action,
            description: activity.description,
            category: activity.category,
            severity: activity.severity,
            timestamp: activity.timestamp
          }))
        },
        timestamp: now.toISOString()
      });
    }

    return NextResponse.json(
      { error: 'Invalid analytics type' },
      { status: 400 }
    );

  } catch (error: any) {
    console.error('Error in dashboard analytics API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to generate analytics for a specific date
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
    const { date } = body;

    const targetDate = date ? new Date(date) : new Date();
    const success = await generateDailyAnalytics(targetDate);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Analytics generated successfully',
        date: targetDate.toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to generate analytics' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error generating analytics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
