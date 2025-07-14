import { SystemMetricsModel, UserActivityModel, DashboardAnalyticsModel } from '@/lib/models/DashboardModels';
import { UserModel } from '@/lib/models/User';
import os from 'os';

// ==========================================
// System Monitoring Utilities
// ==========================================

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  cpu: number;
  memory: number;
  storage: number;
  uptime: number;
  services: {
    database: 'healthy' | 'warning' | 'critical';
    api: 'healthy' | 'warning' | 'critical';
    websocket: 'healthy' | 'warning' | 'critical';
  };
}

export async function getCurrentSystemMetrics(): Promise<SystemHealth> {
  const cpuUsage = await getCPUUsage();
  const memoryInfo = getMemoryInfo();
  const storageInfo = await getStorageInfo();
  const uptime = os.uptime();

  // Determine overall system status
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  if (cpuUsage > 80 || memoryInfo.usage > 85 || storageInfo.usage > 90) {
    status = 'critical';
  } else if (cpuUsage > 60 || memoryInfo.usage > 70 || storageInfo.usage > 75) {
    status = 'warning';
  }

  return {
    status,
    cpu: cpuUsage,
    memory: memoryInfo.usage,
    storage: storageInfo.usage,
    uptime,
    services: {
      database: await checkDatabaseHealth(),
      api: 'healthy', // This would be determined by API health checks
      websocket: 'healthy' // This would be determined by WebSocket health checks
    }
  };
}

async function getCPUUsage(): Promise<number> {
  return new Promise((resolve) => {
    const startMeasure = process.cpuUsage();
    const startTime = process.hrtime();

    setTimeout(() => {
      const endMeasure = process.cpuUsage(startMeasure);
      const endTime = process.hrtime(startTime);
      
      const totalTime = endTime[0] * 1000000 + endTime[1] / 1000;
      const totalCPU = endMeasure.user + endMeasure.system;
      const cpuPercent = (totalCPU / totalTime) * 100;
      
      resolve(Math.min(100, Math.max(0, cpuPercent)));
    }, 100);
  });
}

function getMemoryInfo() {
  const total = os.totalmem();
  const free = os.freemem();
  const used = total - free;
  const usage = (used / total) * 100;

  return {
    total: Math.round(total / 1024 / 1024), // MB
    used: Math.round(used / 1024 / 1024), // MB
    free: Math.round(free / 1024 / 1024), // MB
    usage: Math.round(usage * 100) / 100
  };
}

async function getStorageInfo() {
  // This is a simplified version - in production, you'd use fs.statvfs or similar
  // For now, we'll simulate storage metrics
  return {
    total: 100000, // 100GB in MB
    used: 45000,   // 45GB in MB
    free: 55000,   // 55GB in MB
    usage: 45      // 45%
  };
}

async function checkDatabaseHealth(): Promise<'healthy' | 'warning' | 'critical'> {
  try {
    // Simple database ping
    await UserModel.findOne().limit(1);
    return 'healthy';
  } catch (error) {
    console.error('Database health check failed:', error);
    return 'critical';
  }
}

// ==========================================
// Activity Logging Utilities
// ==========================================

export async function logUserActivity(
  userId: string,
  action: string,
  description: string,
  category: 'authentication' | 'interview' | 'dashboard' | 'admin' | 'system',
  severity: 'info' | 'warning' | 'error' | 'success' = 'info',
  metadata?: any
) {
  try {
    await UserActivityModel.create({
      userId,
      action,
      description,
      category,
      severity,
      metadata: metadata || {},
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Failed to log user activity:', error);
  }
}

// ==========================================
// Analytics Utilities
// ==========================================

export async function generateDailyAnalytics(date: Date = new Date()) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    // Get user metrics
    const totalUsers = await UserModel.countDocuments();
    const newUsers = await UserModel.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get active users (users who logged in today)
    const activeUsers = await UserModel.countDocuments({
      lastLogin: { $gte: startOfDay, $lte: endOfDay }
    });

    // Get interview metrics (placeholder - you'd implement based on your interview model)
    const totalInterviews = 0; // await InterviewModel.countDocuments();
    const completedInterviews = 0; // await InterviewModel.countDocuments({ status: 'completed' });

    // Calculate engagement metrics
    const userEngagement = {
      dailyActiveUsers: activeUsers,
      weeklyActiveUsers: await UserModel.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      monthlyActiveUsers: await UserModel.countDocuments({
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
      }),
      averageSessionDuration: 0 // This would be calculated from session data
    };

    // Save analytics
    await DashboardAnalyticsModel.findOneAndUpdate(
      { date: startOfDay },
      {
        date: startOfDay,
        metrics: {
          totalUsers,
          activeUsers,
          newUsers,
          totalInterviews,
          completedInterviews,
          averageScore: 0, // Calculate from interview results
          averageDuration: 0, // Calculate from interview durations
          topSkills: [], // Calculate from interview data
          userEngagement,
          systemPerformance: {
            averageResponseTime: 0, // Calculate from API metrics
            errorRate: 0, // Calculate from error logs
            uptime: 99.9 // Calculate from system metrics
          }
        }
      },
      { upsert: true, new: true }
    );

    return true;
  } catch (error) {
    console.error('Failed to generate daily analytics:', error);
    return false;
  }
}

// ==========================================
// Dashboard Data Aggregation
// ==========================================

export async function getDashboardOverview(days: number = 7) {
  const endDate = new Date();
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  try {
    // Get recent analytics
    const analytics = await DashboardAnalyticsModel.find({
      date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 }).limit(days);

    // Get recent user activities
    const recentActivities = await UserActivityModel.find({
      timestamp: { $gte: startDate, $lte: endDate }
    })
    .populate('userId', 'name email')
    .sort({ timestamp: -1 })
    .limit(50);

    // Get system metrics
    const systemMetrics = await SystemMetricsModel.find({
      timestamp: { $gte: startDate, $lte: endDate }
    }).sort({ timestamp: -1 }).limit(100);

    return {
      analytics,
      recentActivities,
      systemMetrics,
      summary: {
        totalUsers: analytics[0]?.metrics.totalUsers || 0,
        activeUsers: analytics[0]?.metrics.activeUsers || 0,
        totalInterviews: analytics[0]?.metrics.totalInterviews || 0,
        systemHealth: await getCurrentSystemMetrics()
      }
    };
  } catch (error) {
    console.error('Failed to get dashboard overview:', error);
    throw error;
  }
}

// ==========================================
// Real-time Metrics Collection
// ==========================================

export async function collectSystemMetrics() {
  try {
    const metrics = await getCurrentSystemMetrics();
    const memoryInfo = getMemoryInfo();
    const storageInfo = await getStorageInfo();

    await SystemMetricsModel.create({
      timestamp: new Date(),
      cpu: {
        usage: metrics.cpu,
        cores: os.cpus().length
      },
      memory: {
        total: memoryInfo.total,
        used: memoryInfo.used,
        free: memoryInfo.free,
        usage: memoryInfo.usage
      },
      storage: {
        total: storageInfo.total,
        used: storageInfo.used,
        free: storageInfo.free,
        usage: storageInfo.usage
      },
      network: {
        bytesIn: 0, // Would be collected from network interfaces
        bytesOut: 0,
        packetsIn: 0,
        packetsOut: 0
      },
      services: metrics.services,
      uptime: metrics.uptime
    });

    return true;
  } catch (error) {
    console.error('Failed to collect system metrics:', error);
    return false;
  }
}
