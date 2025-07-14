"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

interface WebSocketHookOptions {
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface SystemMetrics {
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

interface ActivityUpdate {
  id: string;
  userId: string;
  action: string;
  description: string;
  category: string;
  severity: string;
  timestamp: string;
}

interface UserStatusUpdate {
  userId: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  timestamp: string;
}

export const useWebSocket = (options: WebSocketHookOptions = {}) => {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityUpdate[]>([]);
  const [userStatusUpdates, setUserStatusUpdates] = useState<UserStatusUpdate[]>([]);

  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 1000
  } = options;

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    try {
      const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || '', {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnectionAttempts: reconnectAttempts,
        reconnectionDelay: reconnectDelay,
      });

      socketRef.current = socket;

      // Connection event handlers
      socket.on('connect', () => {
        console.log('🔌 WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);

        // Authenticate if session is available
        if (session?.user) {
          // In a real implementation, you'd send a proper JWT token
          socket.emit('authenticate', session.user.id);
        }
      });

      socket.on('disconnect', (reason) => {
        console.log('🔌 WebSocket disconnected:', reason);
        setIsConnected(false);
        setIsAuthenticated(false);
      });

      socket.on('connect_error', (error) => {
        console.error('🔌 WebSocket connection error:', error);
        setConnectionError(error.message);
        setIsConnected(false);
      });

      // Authentication event handlers
      socket.on('authenticated', (data) => {
        console.log('✅ WebSocket authenticated:', data);
        setIsAuthenticated(true);
        setConnectionError(null);
      });

      socket.on('authentication-error', (error) => {
        console.error('❌ WebSocket authentication error:', error);
        setConnectionError(error.message);
        setIsAuthenticated(false);
      });

      // Data event handlers
      socket.on('system-metrics-update', (metrics: SystemMetrics) => {
        setSystemMetrics(metrics);
      });

      socket.on('recent-activities-update', (activities: ActivityUpdate[]) => {
        setRecentActivities(activities);
      });

      socket.on('activity-updates', (newActivities: ActivityUpdate[]) => {
        setRecentActivities(prev => {
          const combined = [...newActivities, ...prev];
          // Remove duplicates and limit to 50 items
          const unique = combined.filter((item, index, arr) => 
            arr.findIndex(i => i.id === item.id) === index
          );
          return unique.slice(0, 50);
        });
      });

      socket.on('new-activity', (activity: ActivityUpdate) => {
        setRecentActivities(prev => [activity, ...prev.slice(0, 49)]);
      });

      socket.on('user-status-update', (update: UserStatusUpdate) => {
        setUserStatusUpdates(prev => [update, ...prev.slice(0, 99)]);
      });

      socket.on('dashboard-data-update', (data) => {
        // Handle dashboard data updates
        console.log('📊 Dashboard data updated:', data);
      });

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionError('Failed to create connection');
    }
  }, [session, reconnectAttempts, reconnectDelay]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setIsAuthenticated(false);
    }
  }, []);

  // Send activity log
  const logActivity = useCallback((
    action: string,
    description: string,
    category: 'authentication' | 'interview' | 'dashboard' | 'admin' | 'system',
    severity: 'info' | 'warning' | 'error' | 'success' = 'info',
    metadata?: any
  ) => {
    if (socketRef.current?.connected && isAuthenticated) {
      socketRef.current.emit('log-activity', {
        action,
        description,
        category,
        severity,
        metadata
      });
    }
  }, [isAuthenticated]);

  // Update user status
  const updateStatus = useCallback((status: 'online' | 'away' | 'busy') => {
    if (socketRef.current?.connected && isAuthenticated) {
      socketRef.current.emit('update-status', status);
    }
  }, [isAuthenticated]);

  // Request dashboard data
  const requestDashboardData = useCallback(() => {
    if (socketRef.current?.connected && isAuthenticated) {
      socketRef.current.emit('request-dashboard-data');
    }
  }, [isAuthenticated]);

  // Request system metrics (admin only)
  const requestSystemMetrics = useCallback(() => {
    if (socketRef.current?.connected && isAuthenticated && session?.user?.role === 'admin') {
      socketRef.current.emit('request-system-metrics');
    }
  }, [isAuthenticated, session?.user?.role]);

  // Subscribe to custom events
  const subscribe = useCallback((event: string, handler: (...args: any[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
      return () => {
        socketRef.current?.off(event, handler);
      };
    }
    return () => {};
  }, []);

  // Emit custom events
  const emit = useCallback((event: string, data?: any) => {
    if (socketRef.current?.connected && isAuthenticated) {
      socketRef.current.emit(event, data);
    }
  }, [isAuthenticated]);

  // Auto-connect when session is available
  useEffect(() => {
    if (autoConnect && session?.user && !socketRef.current?.connected) {
      connect();
    }

    return () => {
      if (socketRef.current) {
        disconnect();
      }
    };
  }, [session, autoConnect, connect, disconnect]);

  // Update user status to online when connected
  useEffect(() => {
    if (isAuthenticated) {
      updateStatus('online');
    }
  }, [isAuthenticated, updateStatus]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    // Connection state
    isConnected,
    isAuthenticated,
    connectionError,
    
    // Connection methods
    connect,
    disconnect,
    
    // Data
    systemMetrics,
    recentActivities,
    userStatusUpdates,
    
    // Methods
    logActivity,
    updateStatus,
    requestDashboardData,
    requestSystemMetrics,
    subscribe,
    emit,
    
    // Socket instance (for advanced usage)
    socket: socketRef.current
  };
};
