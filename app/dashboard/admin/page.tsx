"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
// We'll use minimal Material UI components and mostly Tailwind CSS
import {
  Users as People,
  Monitor as Computer,
  BarChart3 as Assessment,
  Shield as Security,
  RefreshCw as Refresh,
  UserPlus as PersonAdd,
  CheckCircle,
  AlertTriangle as Warning,
  AlertCircle as Error,
  Activity as Timeline,
} from 'lucide-react';

// Import our custom components
import { DashboardAnalytics } from '@/components/admin/dashboard/DashboardAnalytics';
import { EnhancedUserManagement } from '@/components/admin/dashboard/EnhancedUserManagement';
import { ModeToggle } from '@/components/shared/mode-toggle';
import { ProfileDropdown } from '@/components/shared/profile-dropdown';



export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('analytics');
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
  }>>([]);

  // Redirect if not admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Simple refresh function
  const handleRefresh = () => {
    setRefreshing(true);

    // Add notification for manual refresh
    const notification = {
      id: Date.now().toString(),
      message: 'Admin panel refreshed',
      type: 'info' as const,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
      // Auto-remove notification after 3 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 3000);
    }, 1000);
  };

  // Simple initialization
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      setLoading(false);
    }
  }, [status, session]);

  const addNotification = (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    setNotifications(prev => [notification, ...prev.slice(0, 4)]);

    // Auto-remove notification after 3 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 3000);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/login');
    return null;
  }

  if (session?.user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto mt-16 p-6">
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <Error className="h-5 w-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 font-medium">
              Access denied. Admin privileges required.
            </span>
          </div>
        </div>
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Admin Header */}
      <div className="sticky top-0 z-50 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="font-semibold text-lg">InterviewAI Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span>System Online</span>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-2">
                  Admin Control Panel 🛡️
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  System management and administration
                </p>

                {/* Quick Status Chips */}
                <div className="flex gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    System Online
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm">
                    <Assessment className="h-4 w-4" />
                    Analytics Active
                  </div>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    All Services Running
                  </div>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'analytics'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setActiveSection('analytics')}
                >
                  <Assessment className="h-4 w-4" />
                  Analytics
                </button>
                <button
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'tools'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setActiveSection('tools')}
                >
                  <Computer className="h-4 w-4" />
                  Admin Tools
                </button>
                <button
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === 'users'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => setActiveSection('users')}
                >
                  <People className="h-4 w-4" />
                  User Management
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  title="Refresh Dashboard"
                >
                  {refreshing ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
                  ) : (
                    <Refresh className="h-4 w-4" />
                  )}
                  Refresh
                </button>
              </div>
            </div>
          </div>



          {/* Dynamic Content Based on Active Section */}
          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <DashboardAnalytics
                onRefresh={handleRefresh}
                refreshing={refreshing}
              />
            </motion.div>
          )}

          {activeSection === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Admin Tools
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* System Health Card */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <Computer className="h-6 w-6 mr-3" />
                      <h3 className="text-lg font-semibold">System Health</h3>
                    </div>
                    <p className="text-green-100 mb-4 text-sm">
                      Monitor system performance and health metrics
                    </p>
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>

                  {/* User Management Card */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <People className="h-6 w-6 mr-3" />
                      <h3 className="text-lg font-semibold">User Management</h3>
                    </div>
                    <p className="text-amber-100 mb-4 text-sm">
                      Manage users, block/unblock, view profiles
                    </p>
                    <button
                      className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                      onClick={() => setActiveSection('users')}
                    >
                      Manage Users
                    </button>
                  </div>

                  {/* Security Settings Card */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <Security className="h-6 w-6 mr-3" />
                      <h3 className="text-lg font-semibold">Security Settings</h3>
                    </div>
                    <p className="text-purple-100 mb-4 text-sm">
                      Configure security and access controls
                    </p>
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                      Configure
                    </button>
                  </div>

                  {/* Activity Logs Card */}
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center mb-4">
                      <Timeline className="h-6 w-6 mr-3" />
                      <h3 className="text-lg font-semibold">Activity Logs</h3>
                    </div>
                    <p className="text-blue-100 mb-4 text-sm">
                      View recent system events and activities
                    </p>
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <EnhancedUserManagement
                onUserUpdate={(user) => {
                  console.log('User updated:', user);
                  // Handle user update
                }}
                onUserDelete={(userId) => {
                  console.log('User deleted:', userId);
                  // Handle user deletion
                }}
              />
            </motion.div>
          )}

          {/* Real-time Notifications */}
          <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 max-w-sm">
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg shadow-lg backdrop-blur-sm border ${
                  notification.type === 'success' ? 'bg-green-50/90 border-green-200 text-green-800 dark:bg-green-900/90 dark:border-green-700 dark:text-green-200' :
                  notification.type === 'error' ? 'bg-red-50/90 border-red-200 text-red-800 dark:bg-red-900/90 dark:border-red-700 dark:text-red-200' :
                  notification.type === 'warning' ? 'bg-yellow-50/90 border-yellow-200 text-yellow-800 dark:bg-yellow-900/90 dark:border-yellow-700 dark:text-yellow-200' :
                  'bg-blue-50/90 border-blue-200 text-blue-800 dark:bg-blue-900/90 dark:border-blue-700 dark:text-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{notification.message}</span>
                  <button
                    onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Action Buttons */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            <button
              className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110"
              onClick={() => {
                setActiveSection('users');
                addNotification('Switched to User Management', 'info');
              }}
              title="Add New User"
            >
              <PersonAdd className="h-5 w-5" />
            </button>

            <button
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh Admin Panel"
            >
              {refreshing ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <Refresh className="h-5 w-5" />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
