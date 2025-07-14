import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { NextApiRequest } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { getCurrentSystemMetrics, logUserActivity } from '@/lib/utils/dashboardUtils';
import { UserActivityModel, SystemMetricsModel } from '@/lib/models/DashboardModels';
import { UserModel } from '@/lib/models/User';

export interface SocketWithAuth extends Socket {
  userId?: string;
  userRole?: string;
}

interface DashboardRoom {
  userId: string;
  role: string;
  joinedAt: Date;
}

class WebSocketManager {
  private io: SocketIOServer | null = null;
  private dashboardRooms: Map<string, DashboardRoom> = new Map();
  private systemMetricsInterval: NodeJS.Timeout | null = null;
  private userActivityInterval: NodeJS.Timeout | null = null;

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
      },
      path: '/api/socket'
    });

    this.setupEventHandlers();
    this.startSystemMonitoring();
    
    console.log('🔌 WebSocket server initialized');
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', async (socket: any) => {
      console.log(`🔗 Client connected: ${socket.id}`);

      // Authenticate the socket connection
      socket.on('authenticate', async (token: string) => {
        try {
          // In a real implementation, you'd verify the JWT token
          // For now, we'll use a simplified approach
          const session = await this.getSessionFromToken(token);
          
          if (session?.user) {
            socket.userId = session.user.id;
            socket.userRole = session.user.role;
            
            // Join appropriate rooms based on role
            if (session.user.role === 'admin') {
              socket.join('admin-dashboard');
              socket.join('system-monitoring');
            }
            socket.join(`user-${session.user.id}`);
            socket.join('dashboard-updates');

            // Store room information
            this.dashboardRooms.set(socket.id, {
              userId: session.user.id,
              role: session.user.role,
              joinedAt: new Date()
            });

            socket.emit('authenticated', { 
              success: true, 
              userId: session.user.id,
              role: session.user.role 
            });

            // Send initial data
            await this.sendInitialData(socket);

            console.log(`✅ User authenticated: ${session.user.email} (${session.user.role})`);
          } else {
            socket.emit('authentication-error', { message: 'Invalid session' });
          }
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('authentication-error', { message: 'Authentication failed' });
        }
      });

      // Handle dashboard data requests
      socket.on('request-dashboard-data', async () => {
        if (socket.userId) {
          await this.sendDashboardData(socket);
        }
      });

      // Handle system metrics requests (admin only)
      socket.on('request-system-metrics', async () => {
        if (socket.userRole === 'admin') {
          await this.sendSystemMetrics(socket);
        }
      });

      // Handle user activity logging
      socket.on('log-activity', async (data: {
        action: string;
        description: string;
        category: string;
        severity?: string;
        metadata?: any;
      }) => {
        if (socket.userId) {
          await logUserActivity(
            socket.userId,
            data.action,
            data.description,
            data.category as any,
            data.severity as any || 'info',
            data.metadata
          );

          // Broadcast to admin dashboard
          this.io?.to('admin-dashboard').emit('new-activity', {
            userId: socket.userId,
            ...data,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle user status updates
      socket.on('update-status', async (status: 'online' | 'away' | 'busy') => {
        if (socket.userId) {
          await UserModel.findByIdAndUpdate(socket.userId, {
            isOnline: status === 'online',
            lastActivity: new Date()
          });

          // Broadcast status update to admin dashboard
          this.io?.to('admin-dashboard').emit('user-status-update', {
            userId: socket.userId,
            status,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`🔌 Client disconnected: ${socket.id}`);
        
        const roomInfo = this.dashboardRooms.get(socket.id);
        if (roomInfo) {
          // Update user status to offline
          await UserModel.findByIdAndUpdate(roomInfo.userId, {
            isOnline: false,
            lastActivity: new Date()
          });

          // Broadcast offline status to admin dashboard
          this.io?.to('admin-dashboard').emit('user-status-update', {
            userId: roomInfo.userId,
            status: 'offline',
            timestamp: new Date().toISOString()
          });

          this.dashboardRooms.delete(socket.id);
        }
      });
    });
  }

  private async getSessionFromToken(token: string): Promise<{ user: { id: string; email: string; role: string } } | null> {
    // This is a simplified implementation
    // In production, you'd properly verify the JWT token
    try {
      // For now, we'll assume the token is valid and contains user info
      // You should implement proper JWT verification here

      // Placeholder implementation - in real app, decode and verify JWT
      if (!token) return null;

      // Return a mock session for now - replace with actual JWT verification
      return {
        user: {
          id: 'mock-user-id',
          email: 'mock@example.com',
          role: 'user'
        }
      };
    } catch (error) {
      return null;
    }
  }

  private async sendInitialData(socket: any) {
    try {
      if (socket.userRole === 'admin') {
        // Send admin-specific initial data
        const systemMetrics = await getCurrentSystemMetrics();
        socket.emit('system-metrics-update', systemMetrics);

        // Send recent activities
        const recentActivities = await UserActivityModel.find()
          .populate('userId', 'name email')
          .sort({ timestamp: -1 })
          .limit(20);

        socket.emit('recent-activities-update', recentActivities);
      }

      // Send user-specific data
      await this.sendDashboardData(socket);
    } catch (error) {
      console.error('Error sending initial data:', error);
    }
  }

  private async sendDashboardData(socket: any) {
    try {
      // This would fetch user-specific dashboard data
      // Implementation depends on your data structure
      socket.emit('dashboard-data-update', {
        timestamp: new Date().toISOString(),
        // Add dashboard data here
      });
    } catch (error) {
      console.error('Error sending dashboard data:', error);
    }
  }

  private async sendSystemMetrics(socket: any) {
    try {
      const metrics = await getCurrentSystemMetrics();
      socket.emit('system-metrics-update', metrics);
    } catch (error) {
      console.error('Error sending system metrics:', error);
    }
  }

  private startSystemMonitoring() {
    // Collect and broadcast system metrics every 30 seconds
    this.systemMetricsInterval = setInterval(async () => {
      try {
        const metrics = await getCurrentSystemMetrics();
        
        // Broadcast to admin dashboard
        this.io?.to('system-monitoring').emit('system-metrics-update', metrics);
        
        // Store metrics in database
        await SystemMetricsModel.create({
          timestamp: new Date(),
          cpu: {
            usage: metrics.cpu,
            cores: 8 // This would be dynamic
          },
          memory: {
            total: 16384,
            used: Math.floor(16384 * (metrics.memory / 100)),
            free: Math.floor(16384 * ((100 - metrics.memory) / 100)),
            usage: metrics.memory
          },
          storage: {
            total: 512000,
            used: Math.floor(512000 * (metrics.storage / 100)),
            free: Math.floor(512000 * ((100 - metrics.storage) / 100)),
            usage: metrics.storage
          },
          network: {
            bytesIn: Math.floor(Math.random() * 1000000),
            bytesOut: Math.floor(Math.random() * 500000),
            packetsIn: Math.floor(Math.random() * 10000),
            packetsOut: Math.floor(Math.random() * 8000)
          },
          services: metrics.services,
          uptime: metrics.uptime
        });
      } catch (error) {
        console.error('Error in system monitoring:', error);
      }
    }, 30000);

    // Broadcast user activity updates every 10 seconds
    this.userActivityInterval = setInterval(async () => {
      try {
        const recentActivities = await UserActivityModel.find({
          timestamp: { $gte: new Date(Date.now() - 10000) } // Last 10 seconds
        })
        .populate('userId', 'name email')
        .sort({ timestamp: -1 });

        if (recentActivities.length > 0) {
          this.io?.to('admin-dashboard').emit('activity-updates', recentActivities);
        }
      } catch (error) {
        console.error('Error broadcasting activity updates:', error);
      }
    }, 10000);
  }

  // Public methods for external use
  public broadcastToAdmins(event: string, data: any) {
    this.io?.to('admin-dashboard').emit(event, data);
  }

  public broadcastToUser(userId: string, event: string, data: any) {
    this.io?.to(`user-${userId}`).emit(event, data);
  }

  public broadcastToAll(event: string, data: any) {
    this.io?.emit(event, data);
  }

  public getConnectedUsers(): number {
    return this.dashboardRooms.size;
  }

  public cleanup() {
    if (this.systemMetricsInterval) {
      clearInterval(this.systemMetricsInterval);
    }
    if (this.userActivityInterval) {
      clearInterval(this.userActivityInterval);
    }
    if (this.io) {
      this.io.close();
    }
  }
}

export const webSocketManager = new WebSocketManager();
