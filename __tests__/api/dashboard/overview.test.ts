import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/dashboard/overview/route';
import { getServerSession } from 'next-auth';
import { getDashboardOverview, generateDailyAnalytics } from '@/lib/utils/dashboardUtils';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/mongodb', () => ({
  connectToMongoDB: jest.fn(),
}));

jest.mock('@/lib/utils/dashboardUtils', () => ({
  getDashboardOverview: jest.fn(),
  generateDailyAnalytics: jest.fn(),
}));

jest.mock('@/lib/models/User', () => ({
  UserModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
}));

jest.mock('@/lib/models/DashboardModels', () => ({
  InterviewModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
  ChatSessionModel: {
    countDocuments: jest.fn(),
  },
  UserActivityModel: {
    countDocuments: jest.fn(),
    find: jest.fn(),
  },
}));

const mockGetServerSession = getServerSession as jest.Mock;
const mockGetDashboardOverview = getDashboardOverview as jest.Mock;
const mockGenerateDailyAnalytics = generateDailyAnalytics as jest.Mock;

describe('/api/dashboard/overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return admin dashboard overview for admin users', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin',
          email: 'admin@example.com'
        }
      };

      const mockOverview = {
        analytics: [
          {
            date: '2024-01-15',
            metrics: {
              totalUsers: 100,
              activeUsers: 50
            }
          }
        ],
        recentActivities: [
          {
            id: 'activity-1',
            action: 'login',
            description: 'User logged in'
          }
        ],
        systemMetrics: [
          {
            timestamp: '2024-01-15T10:00:00Z',
            cpu: { usage: 45 }
          }
        ],
        summary: {
          systemHealth: {
            status: 'healthy',
            cpu: 45,
            memory: 60
          }
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockGetDashboardOverview.mockResolvedValue(mockOverview);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview?range=7d');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.overview).toBeDefined();
      expect(data.overview.users).toBeDefined();
      expect(data.overview.interviews).toBeDefined();
      expect(data.overview.systemHealth).toBeDefined();
      expect(data.analytics).toEqual(mockOverview.analytics);
      expect(data.recentActivities).toEqual(mockOverview.recentActivities);
      expect(data.systemMetrics).toEqual(mockOverview.systemMetrics);
    });

    it('should return user-specific overview for regular users', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: 'user',
          email: 'user@example.com'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      // Mock user-specific data
      const { InterviewModel } = require('@/lib/models/DashboardModels');
      const { ChatSessionModel } = require('@/lib/models/DashboardModels');
      const { UserActivityModel } = require('@/lib/models/DashboardModels');

      InterviewModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            {
              _id: 'interview-1',
              title: 'Test Interview',
              type: 'technical',
              status: 'completed',
              overallScore: 85
            }
          ])
        })
      });

      InterviewModel.countDocuments
        .mockResolvedValueOnce(10) // total interviews
        .mockResolvedValueOnce(8); // completed interviews

      ChatSessionModel.countDocuments.mockResolvedValue(5);

      UserActivityModel.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([
            {
              _id: 'activity-1',
              action: 'interview_completed',
              description: 'Completed technical interview'
            }
          ])
        })
      });

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview?range=7d');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.overview).toBeDefined();
      expect(data.overview.interviews).toBeDefined();
      expect(data.overview.chatSessions).toBeDefined();
      expect(data.recentInterviews).toBeDefined();
      expect(data.recentActivities).toBeDefined();
    });

    it('should handle different time ranges', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockGetDashboardOverview.mockResolvedValue({
        analytics: [],
        recentActivities: [],
        systemMetrics: [],
        summary: { systemHealth: { status: 'healthy' } }
      });

      const timeRanges = ['24h', '7d', '30d', '90d'];

      for (const range of timeRanges) {
        const request = new NextRequest(`http://localhost:3000/api/dashboard/overview?range=${range}`);
        const response = await GET(request);

        expect(response.status).toBe(200);
        expect(mockGetDashboardOverview).toHaveBeenCalledWith(
          range === '24h' ? 1 : 
          range === '7d' ? 7 : 
          range === '30d' ? 30 : 90
        );
      }
    });

    it('should handle errors gracefully', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockGetDashboardOverview.mockRejectedValue(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Database error');
    });
  });

  describe('POST', () => {
    it('should return 401 if user is not authenticated', async () => {
      mockGetServerSession.mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview', {
        method: 'POST',
        body: JSON.stringify({ action: 'refresh_analytics' })
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe('Unauthorized');
    });

    it('should return 403 if user is not admin', async () => {
      const mockSession = {
        user: {
          id: 'user-123',
          role: 'user'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview', {
        method: 'POST',
        body: JSON.stringify({ action: 'refresh_analytics' })
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toBe('Forbidden - Admin access required');
    });

    it('should refresh analytics successfully', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockGenerateDailyAnalytics.mockResolvedValue(true);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview', {
        method: 'POST',
        body: JSON.stringify({ action: 'refresh_analytics' })
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe('Analytics refreshed successfully');
      expect(mockGenerateDailyAnalytics).toHaveBeenCalled();
    });

    it('should handle analytics refresh failure', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);
      mockGenerateDailyAnalytics.mockResolvedValue(false);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview', {
        method: 'POST',
        body: JSON.stringify({ action: 'refresh_analytics' })
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.message).toBe('Failed to refresh analytics');
    });

    it('should return 400 for invalid action', async () => {
      const mockSession = {
        user: {
          id: 'admin-123',
          role: 'admin'
        }
      };

      mockGetServerSession.mockResolvedValue(mockSession);

      const request = new NextRequest('http://localhost:3000/api/dashboard/overview', {
        method: 'POST',
        body: JSON.stringify({ action: 'invalid_action' })
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid action');
    });
  });
});
