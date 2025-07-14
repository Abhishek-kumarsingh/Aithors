import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import { UserActivityModel } from '@/lib/models/DashboardModels';
import { logUserActivity } from '@/lib/utils/dashboardUtils';

// GET user activities
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);

    try {
      await connectToMongoDB();
    } catch (dbError) {
      console.error('Database connection failed, returning mock activities:', dbError);
      // Return mock activities when database is not available
      return NextResponse.json({
        activities: [
          {
            id: '1',
            userId: session.user?.id || 'demo-user',
            userName: session.user?.name || 'Demo User',
            action: 'login',
            description: 'User logged in successfully',
            category: 'authentication',
            severity: 'info',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
            metadata: { ip: '127.0.0.1', userAgent: 'Demo Browser' }
          },
          {
            id: '2',
            userId: session.user?.id || 'demo-user',
            userName: session.user?.name || 'Demo User',
            action: 'dashboard_view',
            description: 'Viewed admin dashboard',
            category: 'navigation',
            severity: 'info',
            timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
            metadata: { page: '/dashboard/admin' }
          }
        ],
        pagination: {
          page: 1,
          limit: 50,
          total: 2,
          pages: 1
        },
        mockData: true
      });
    }
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');
    const userId = searchParams.get('userId');
    const timeRange = searchParams.get('range') || '7d';

    // Build filter
    const filter: any = {};

    // Time range filter
    let startDate: Date;
    const endDate = new Date();

    switch (timeRange) {
      case '1h':
        startDate = new Date(endDate.getTime() - 60 * 60 * 1000);
        break;
      case '24h':
        startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    filter.timestamp = { $gte: startDate, $lte: endDate };

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Severity filter
    if (severity && severity !== 'all') {
      filter.severity = severity;
    }

    // User filter (for admin viewing specific user activities)
    if (userId && session.user?.role === 'admin') {
      filter.userId = userId;
    } else if (session.user?.role !== 'admin') {
      // Non-admin users can only see their own activities
      filter.userId = session.user?.id;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get activities with user information
    const activities = await UserActivityModel.find(filter)
      .populate('userId', 'name email image')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await UserActivityModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Format activities
    const formattedActivities = activities.map(activity => ({
      id: activity._id.toString(),
      userId: activity.userId._id.toString(),
      userName: (activity.userId as any).name,
      userEmail: (activity.userId as any).email,
      userAvatar: (activity.userId as any).image,
      action: activity.action,
      description: activity.description,
      category: activity.category,
      severity: activity.severity,
      metadata: activity.metadata,
      timestamp: activity.timestamp.toISOString()
    }));

    // Get activity statistics for the time range
    const stats = await UserActivityModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          categoryCounts: {
            $push: '$category'
          },
          severityCounts: {
            $push: '$severity'
          }
        }
      }
    ]);

    let categoryStats = {};
    let severityStats = {};

    if (stats.length > 0) {
      // Count categories
      const categories = stats[0].categoryCounts;
      categoryStats = categories.reduce((acc: any, cat: string) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      // Count severities
      const severities = stats[0].severityCounts;
      severityStats = severities.reduce((acc: any, sev: string) => {
        acc[sev] = (acc[sev] || 0) + 1;
        return acc;
      }, {});
    }

    return NextResponse.json({
      activities: formattedActivities,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      stats: {
        total: totalCount,
        categories: categoryStats,
        severities: severityStats
      },
      timeRange
    });

  } catch (error: any) {
    console.error('Error in activities API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to log a new activity
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    const body = await req.json();
    const { 
      action, 
      description, 
      category, 
      severity = 'info', 
      metadata = {} 
    } = body;

    // Validate required fields
    if (!action || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: action, description, category' },
        { status: 400 }
      );
    }

    // Validate category
    const validCategories = ['authentication', 'interview', 'dashboard', 'admin', 'system'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Validate severity
    const validSeverities = ['info', 'warning', 'error', 'success'];
    if (!validSeverities.includes(severity)) {
      return NextResponse.json(
        { error: 'Invalid severity' },
        { status: 400 }
      );
    }

    // Log the activity
    await logUserActivity(
      session.user?.id || '',
      action,
      description,
      category,
      severity,
      {
        ...metadata,
        ip: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Activity logged successfully'
    });

  } catch (error: any) {
    console.error('Error logging activity:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE activities (cleanup)
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const daysToKeep = parseInt(searchParams.get('days') || '90');
    const category = searchParams.get('category');
    const severity = searchParams.get('severity');

    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    // Build delete filter
    const deleteFilter: any = {
      timestamp: { $lt: cutoffDate }
    };

    if (category) {
      deleteFilter.category = category;
    }

    if (severity) {
      deleteFilter.severity = severity;
    }

    const result = await UserActivityModel.deleteMany(deleteFilter);

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} old activity records`,
      deletedCount: result.deletedCount
    });

  } catch (error: any) {
    console.error('Error deleting activities:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
