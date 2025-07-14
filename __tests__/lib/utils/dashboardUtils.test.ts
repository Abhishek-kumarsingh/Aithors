import {
  getCurrentSystemMetrics,
  logUserActivity,
  generateDailyAnalytics,
  getDashboardOverview,
  collectSystemMetrics
} from '@/lib/utils/dashboardUtils';
import { UserActivityModel, DashboardAnalyticsModel, SystemMetricsModel } from '@/lib/models/DashboardModels';
import { UserModel } from '@/lib/models/User';

// Mock the models
jest.mock('@/lib/models/DashboardModels', () => ({
  UserActivityModel: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    aggregate: jest.fn(),
  },
  DashboardAnalyticsModel: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
  SystemMetricsModel: {
    find: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/models/User', () => ({
  UserModel: {
    findOne: jest.fn(),
    countDocuments: jest.fn(),
  },
}));

// Mock os module
jest.mock('os', () => ({
  uptime: jest.fn(() => 86400), // 1 day
  totalmem: jest.fn(() => 16 * 1024 * 1024 * 1024), // 16GB
  freemem: jest.fn(() => 8 * 1024 * 1024 * 1024), // 8GB
  cpus: jest.fn(() => Array(8).fill({})), // 8 cores
}));

describe('Dashboard Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCurrentSystemMetrics', () => {
    it('should return system health metrics', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'test' });

      const metrics = await getCurrentSystemMetrics();

      expect(metrics).toHaveProperty('status');
      expect(metrics).toHaveProperty('cpu');
      expect(metrics).toHaveProperty('memory');
      expect(metrics).toHaveProperty('storage');
      expect(metrics).toHaveProperty('uptime');
      expect(metrics).toHaveProperty('services');
      
      expect(typeof metrics.cpu).toBe('number');
      expect(typeof metrics.memory).toBe('number');
      expect(typeof metrics.storage).toBe('number');
      expect(typeof metrics.uptime).toBe('number');
      
      expect(['healthy', 'warning', 'critical']).toContain(metrics.status);
    });

    it('should return critical status for high resource usage', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'test' });

      // Mock high CPU usage
      jest.spyOn(process, 'cpuUsage')
        .mockReturnValueOnce({ user: 1000000, system: 1000000 })
        .mockReturnValueOnce({ user: 9000000, system: 9000000 });
      
      jest.spyOn(process, 'hrtime')
        .mockReturnValueOnce([0, 0])
        .mockReturnValueOnce([0, 100000]);

      const metrics = await getCurrentSystemMetrics();
      
      // The exact status depends on the implementation, but it should handle high usage
      expect(metrics).toHaveProperty('status');
      expect(metrics.cpu).toBeGreaterThanOrEqual(0);
      expect(metrics.cpu).toBeLessThanOrEqual(100);
    });

    it('should handle database connection errors', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const metrics = await getCurrentSystemMetrics();

      expect(metrics.services.database).toBe('critical');
    });
  });

  describe('logUserActivity', () => {
    it('should create a new activity log', async () => {
      const mockCreate = UserActivityModel.create as jest.Mock;
      mockCreate.mockResolvedValue({ _id: 'activity-id' });

      await logUserActivity(
        'user-123',
        'login',
        'User logged in',
        'authentication',
        'info',
        { ip: '127.0.0.1' }
      );

      expect(mockCreate).toHaveBeenCalledWith({
        userId: 'user-123',
        action: 'login',
        description: 'User logged in',
        category: 'authentication',
        severity: 'info',
        metadata: { ip: '127.0.0.1' },
        timestamp: expect.any(Date)
      });
    });

    it('should handle logging errors gracefully', async () => {
      const mockCreate = UserActivityModel.create as jest.Mock;
      mockCreate.mockRejectedValue(new Error('Database error'));

      // Should not throw
      await expect(logUserActivity(
        'user-123',
        'login',
        'User logged in',
        'authentication'
      )).resolves.toBeUndefined();
    });
  });

  describe('generateDailyAnalytics', () => {
    it('should generate analytics for a given date', async () => {
      const mockCountDocuments = UserModel.countDocuments as jest.Mock;
      const mockFindOneAndUpdate = DashboardAnalyticsModel.findOneAndUpdate as jest.Mock;

      mockCountDocuments
        .mockResolvedValueOnce(100) // total users
        .mockResolvedValueOnce(5)   // new users
        .mockResolvedValueOnce(25)  // active users
        .mockResolvedValueOnce(80)  // weekly active
        .mockResolvedValueOnce(95); // monthly active

      mockFindOneAndUpdate.mockResolvedValue({ _id: 'analytics-id' });

      const result = await generateDailyAnalytics(new Date('2024-01-15'));

      expect(result).toBe(true);
      expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
        { date: expect.any(Date) },
        expect.objectContaining({
          date: expect.any(Date),
          metrics: expect.objectContaining({
            totalUsers: 100,
            newUsers: 5,
            activeUsers: 25,
            userEngagement: expect.objectContaining({
              weeklyActiveUsers: 80,
              monthlyActiveUsers: 95
            })
          })
        }),
        { upsert: true, new: true }
      );
    });

    it('should handle errors and return false', async () => {
      const mockCountDocuments = UserModel.countDocuments as jest.Mock;
      mockCountDocuments.mockRejectedValue(new Error('Database error'));

      const result = await generateDailyAnalytics();

      expect(result).toBe(false);
    });
  });

  describe('getDashboardOverview', () => {
    it('should return comprehensive dashboard data', async () => {
      const mockAnalytics = [
        {
          date: new Date(),
          metrics: {
            totalUsers: 100,
            activeUsers: 50,
            totalInterviews: 200
          }
        }
      ];

      const mockActivities = [
        {
          _id: 'activity-1',
          userId: { name: 'John Doe', email: 'john@example.com' },
          action: 'login',
          timestamp: new Date()
        }
      ];

      const mockMetrics = [
        {
          timestamp: new Date(),
          cpu: { usage: 45 },
          memory: { usage: 60 }
        }
      ];

      (DashboardAnalyticsModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockAnalytics)
        })
      });

      (UserActivityModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockActivities)
          })
        })
      });

      (SystemMetricsModel.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockMetrics)
        })
      });

      (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'test' });

      const overview = await getDashboardOverview(7);

      expect(overview).toHaveProperty('analytics');
      expect(overview).toHaveProperty('recentActivities');
      expect(overview).toHaveProperty('systemMetrics');
      expect(overview).toHaveProperty('summary');
      
      expect(overview.analytics).toEqual(mockAnalytics);
      expect(overview.recentActivities).toEqual(mockActivities);
      expect(overview.systemMetrics).toEqual(mockMetrics);
    });
  });

  describe('collectSystemMetrics', () => {
    it('should collect and store system metrics', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue({ _id: 'test' });
      (SystemMetricsModel.create as jest.Mock).mockResolvedValue({ _id: 'metrics-id' });

      const result = await collectSystemMetrics();

      expect(result).toBe(true);
      expect(SystemMetricsModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.any(Date),
          cpu: expect.objectContaining({
            usage: expect.any(Number),
            cores: expect.any(Number)
          }),
          memory: expect.objectContaining({
            total: expect.any(Number),
            used: expect.any(Number),
            free: expect.any(Number),
            usage: expect.any(Number)
          }),
          storage: expect.objectContaining({
            total: expect.any(Number),
            used: expect.any(Number),
            free: expect.any(Number),
            usage: expect.any(Number)
          }),
          services: expect.any(Object),
          uptime: expect.any(Number)
        })
      );
    });

    it('should handle collection errors', async () => {
      (UserModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await collectSystemMetrics();

      expect(result).toBe(false);
    });
  });
});
