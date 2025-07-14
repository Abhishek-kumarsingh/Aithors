import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import { SystemMetricsModel } from '@/lib/models/DashboardModels';
import { getCurrentSystemMetrics, collectSystemMetrics } from '@/lib/utils/dashboardUtils';

// GET system metrics
export async function GET(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('range') || '24h';
    const live = searchParams.get('live') === 'true';

    // If requesting live data, return current metrics
    if (live) {
      try {
        await connectToMongoDB();
        const currentMetrics = await getCurrentSystemMetrics();
        return NextResponse.json({
          current: currentMetrics,
          timestamp: new Date().toISOString()
        });
      } catch (dbError) {
        console.error('Database connection failed, returning mock metrics:', dbError);
        // Return mock system metrics when database is not available
        return NextResponse.json({
          current: {
            status: 'warning',
            cpu: 45,
            memory: 62,
            storage: 38,
            uptime: 86400,
            services: {
              database: 'warning',
              api: 'healthy',
              websocket: 'healthy'
            }
          },
          timestamp: new Date().toISOString(),
          mockData: true
        });
      }
    }

    try {
      await connectToMongoDB();
    } catch (dbError) {
      console.error('Database connection failed:', dbError);
      // Return mock historical data when database is not available
      return NextResponse.json({
        metrics: [],
        summary: {
          avgCpu: 45,
          avgMemory: 62,
          avgStorage: 38,
          uptime: 86400
        },
        timeRange,
        mockData: true
      });
    }

    // Calculate time range
    let startTime: Date;
    const endTime = new Date();

    switch (timeRange) {
      case '1h':
        startTime = new Date(endTime.getTime() - 60 * 60 * 1000);
        break;
      case '6h':
        startTime = new Date(endTime.getTime() - 6 * 60 * 60 * 1000);
        break;
      case '24h':
        startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(endTime.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(endTime.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);
    }

    // Fetch historical metrics
    const metrics = await SystemMetricsModel.find({
      timestamp: { $gte: startTime, $lte: endTime }
    })
    .sort({ timestamp: 1 })
    .limit(1000); // Limit to prevent too much data

    // Calculate aggregated statistics
    const totalMetrics = metrics.length;
    if (totalMetrics === 0) {
      return NextResponse.json({
        metrics: [],
        summary: {
          avgCpu: 0,
          avgMemory: 0,
          avgStorage: 0,
          uptime: 0,
          healthScore: 100
        },
        timeRange,
        totalDataPoints: 0
      });
    }

    const avgCpu = metrics.reduce((sum, m) => sum + m.cpu.usage, 0) / totalMetrics;
    const avgMemory = metrics.reduce((sum, m) => sum + m.memory.usage, 0) / totalMetrics;
    const avgStorage = metrics.reduce((sum, m) => sum + m.storage.usage, 0) / totalMetrics;
    const latestUptime = metrics[metrics.length - 1]?.uptime || 0;

    // Calculate health score based on average usage
    const healthScore = Math.max(0, 100 - (
      (avgCpu > 80 ? (avgCpu - 80) * 2 : 0) +
      (avgMemory > 85 ? (avgMemory - 85) * 2 : 0) +
      (avgStorage > 90 ? (avgStorage - 90) * 3 : 0)
    ));

    // Format metrics for chart display
    const formattedMetrics = metrics.map(metric => ({
      timestamp: metric.timestamp,
      cpu: Math.round(metric.cpu.usage * 100) / 100,
      memory: Math.round(metric.memory.usage * 100) / 100,
      storage: Math.round(metric.storage.usage * 100) / 100,
      uptime: metric.uptime,
      services: metric.services
    }));

    return NextResponse.json({
      metrics: formattedMetrics,
      summary: {
        avgCpu: Math.round(avgCpu * 100) / 100,
        avgMemory: Math.round(avgMemory * 100) / 100,
        avgStorage: Math.round(avgStorage * 100) / 100,
        uptime: latestUptime,
        healthScore: Math.round(healthScore * 100) / 100
      },
      timeRange,
      totalDataPoints: totalMetrics
    });

  } catch (error: any) {
    console.error('Error in system metrics API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST to collect new system metrics
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

    // Collect current system metrics
    const success = await collectSystemMetrics();

    if (success) {
      const currentMetrics = await getCurrentSystemMetrics();
      return NextResponse.json({
        success: true,
        message: 'System metrics collected successfully',
        metrics: currentMetrics
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to collect system metrics' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Error collecting system metrics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE old metrics (cleanup)
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
    const daysToKeep = parseInt(searchParams.get('days') || '30');

    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await SystemMetricsModel.deleteMany({
      timestamp: { $lt: cutoffDate }
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} old metric records`,
      deletedCount: result.deletedCount
    });

  } catch (error: any) {
    console.error('Error deleting old metrics:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
