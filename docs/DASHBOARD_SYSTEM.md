# Modern Dashboard System Documentation

## Overview

The Modern Dashboard System is a comprehensive, real-time analytics and monitoring solution built for the AI-powered interview platform. It provides both user and admin dashboards with advanced features including real-time updates, system monitoring, user activity tracking, and comprehensive analytics.

## Architecture

### Core Components

1. **Dashboard Models** (`lib/models/DashboardModels.ts`)
   - SystemMetrics: Real-time system performance data
   - UserActivity: User action logging and tracking
   - DashboardAnalytics: Aggregated daily analytics
   - Interview: Enhanced interview session tracking
   - ChatSession: AI chat session monitoring

2. **Dashboard Utilities** (`lib/utils/dashboardUtils.ts`)
   - System health monitoring
   - Activity logging
   - Analytics generation
   - Data aggregation

3. **Modern UI Components** (`components/dashboard/`)
   - ModernStatsCard: Advanced statistics display
   - ModernChartCard: Interactive data visualization
   - ActivityFeed: Real-time activity monitoring
   - SystemHealthMonitor: Live system status
   - UserManagement: Comprehensive user administration
   - QuickActions: Contextual action shortcuts

4. **Real-time Features** (`lib/websocket/`, `hooks/useWebSocket.ts`)
   - WebSocket server for live updates
   - React hooks for real-time data
   - Live system monitoring
   - User activity broadcasting

## Features

### User Dashboard
- **Personal Analytics**: Interview performance, completion rates, skill progression
- **Real-time Updates**: Live activity feed, status updates
- **Performance Trends**: Visual charts showing improvement over time
- **Quick Actions**: Easy access to common tasks
- **Responsive Design**: Optimized for all screen sizes

### Admin Dashboard
- **System Monitoring**: CPU, memory, storage, network metrics
- **User Management**: View, edit, block/unblock users
- **Analytics Overview**: Platform-wide statistics and trends
- **Activity Monitoring**: Real-time user activity tracking
- **Performance Metrics**: System health and response times

### Real-time Features
- **Live System Metrics**: Auto-updating system performance data
- **User Activity Streams**: Real-time activity broadcasting
- **Status Updates**: Online/offline user status tracking
- **Instant Notifications**: Real-time alerts and updates

## API Endpoints

### Dashboard Overview
```
GET /api/dashboard/overview
- Query params: range (24h, 7d, 30d, 90d)
- Returns: User-specific or admin dashboard data
- Auth: Required (user/admin)
```

### System Metrics
```
GET /api/dashboard/system-metrics
- Query params: range, live
- Returns: System performance data
- Auth: Required (admin only)

POST /api/dashboard/system-metrics
- Body: N/A
- Returns: Triggers metrics collection
- Auth: Required (admin only)
```

### Analytics
```
GET /api/dashboard/analytics
- Query params: type (overview, skills, engagement, performance), range
- Returns: Analytics data by type
- Auth: Required

POST /api/dashboard/analytics
- Body: { date }
- Returns: Generates analytics for date
- Auth: Required (admin only)
```

### User Activities
```
GET /api/dashboard/activities
- Query params: page, limit, category, severity, userId, range
- Returns: Paginated activity logs
- Auth: Required

POST /api/dashboard/activities
- Body: { action, description, category, severity, metadata }
- Returns: Logs new activity
- Auth: Required
```

## Component Usage

### ModernStatsCard

```tsx
import { ModernStatsCard } from '@/components/dashboard/ModernStatsCard';

<ModernStatsCard
  title="Total Users"
  value="1,234"
  subtitle="Registered users"
  icon={<People />}
  color="primary"
  trend={{
    value: 12,
    direction: 'up',
    label: 'vs last month'
  }}
  progress={{
    value: 75,
    max: 100,
    label: 'Goal Progress'
  }}
  badge={{
    label: 'Active',
    color: 'success'
  }}
  onClick={() => console.log('Card clicked')}
/>
```

### ModernChartCard

```tsx
import { ModernChartCard } from '@/components/dashboard/ModernChartCard';

<ModernChartCard
  title="User Growth"
  subtitle="Daily user registrations"
  data={chartData}
  chartType="area"
  dataKey="users"
  xAxisKey="date"
  color="#3b82f6"
  height={300}
  trend={{
    value: 8,
    direction: 'up',
    label: 'growth rate'
  }}
  onRefresh={() => fetchData()}
  onExport={(format) => exportChart(format)}
/>
```

### ActivityFeed

```tsx
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

<ActivityFeed
  title="Recent Activity"
  activities={activities}
  onRefresh={handleRefresh}
  onFilterChange={(category, severity) => applyFilters(category, severity)}
  maxItems={15}
  showFilters={true}
/>
```

### Real-time Dashboard

```tsx
import { RealTimeDashboard } from '@/components/dashboard/RealTimeDashboard';

<RealTimeDashboard
  showSystemMetrics={true}
  showUserActivity={true}
  showUserStatus={true}
  maxActivities={10}
  autoRefresh={true}
/>
```

## WebSocket Integration

### Client-side Usage

```tsx
import { useWebSocket } from '@/hooks/useWebSocket';

function DashboardComponent() {
  const {
    isConnected,
    isAuthenticated,
    systemMetrics,
    recentActivities,
    logActivity,
    updateStatus,
    subscribe
  } = useWebSocket();

  // Log user activity
  const handleAction = () => {
    logActivity(
      'button_click',
      'User clicked dashboard button',
      'dashboard',
      'info'
    );
  };

  // Subscribe to custom events
  useEffect(() => {
    const unsubscribe = subscribe('custom-event', (data) => {
      console.log('Received custom event:', data);
    });

    return unsubscribe;
  }, [subscribe]);

  return (
    <div>
      <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
      {/* Dashboard content */}
    </div>
  );
}
```

## Data Seeding

### Dashboard Data Seeding

```bash
# Seed dashboard data with sample metrics, activities, and analytics
npm run seed-dashboard

# This creates:
# - 30 days of system metrics
# - Sample user activities
# - Daily analytics records
# - Sample users if needed
```

### Manual Data Generation

```typescript
import { generateDailyAnalytics, collectSystemMetrics } from '@/lib/utils/dashboardUtils';

// Generate analytics for specific date
await generateDailyAnalytics(new Date('2024-01-15'));

// Collect current system metrics
await collectSystemMetrics();
```

## Configuration

### Environment Variables

```env
# WebSocket configuration
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000

# Database configuration
MONGODB_URI=mongodb://localhost:27017/aithor

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Theme Customization

The dashboard supports multiple visual variants:

- **Default**: Standard Material-UI styling with gradients
- **Glassmorphism**: Translucent backgrounds with blur effects
- **Minimal**: Clean, borderless design

```tsx
<ModernStatsCard variant="glassmorphism" />
<ModernChartCard variant="minimal" />
<ActivityFeed variant="default" />
```

## Performance Considerations

### Optimization Strategies

1. **Data Pagination**: All list components support pagination
2. **Real-time Throttling**: WebSocket updates are throttled to prevent spam
3. **Lazy Loading**: Charts and heavy components load on demand
4. **Caching**: API responses are cached where appropriate
5. **Virtualization**: Large lists use virtual scrolling

### Monitoring

- System metrics are collected every 30 seconds
- User activities are logged in real-time
- Analytics are generated daily via cron job
- WebSocket connections are monitored for health

## Security

### Access Control

- **User Dashboard**: Users can only see their own data
- **Admin Dashboard**: Admins have access to all system data
- **API Endpoints**: Protected by session-based authentication
- **WebSocket**: Authenticated connections only

### Data Privacy

- Personal data is anonymized in analytics
- Activity logs exclude sensitive information
- System metrics don't contain user-identifiable data

## Troubleshooting

### Common Issues

1. **WebSocket Connection Failed**
   - Check NEXT_PUBLIC_WEBSOCKET_URL configuration
   - Verify server is running with WebSocket support
   - Check firewall/proxy settings

2. **Dashboard Data Not Loading**
   - Verify database connection
   - Check user authentication status
   - Review API endpoint logs

3. **Real-time Updates Not Working**
   - Confirm WebSocket authentication
   - Check browser console for errors
   - Verify user permissions

### Debug Mode

Enable debug logging:

```typescript
// In your component
const { socket } = useWebSocket();

useEffect(() => {
  if (socket) {
    socket.on('connect', () => console.log('WebSocket connected'));
    socket.on('disconnect', () => console.log('WebSocket disconnected'));
    socket.on('error', (error) => console.error('WebSocket error:', error));
  }
}, [socket]);
```

## Future Enhancements

### Planned Features

1. **Advanced Analytics**: Machine learning insights
2. **Custom Dashboards**: User-configurable layouts
3. **Export Functionality**: PDF/Excel report generation
4. **Mobile App**: React Native dashboard app
5. **Alerting System**: Configurable notifications
6. **Multi-tenant Support**: Organization-level dashboards

## Quick Start Guide

### 1. Installation

```bash
# Install dependencies
npm install

# Install additional dashboard dependencies
npm install socket.io socket.io-client recharts framer-motion
```

### 2. Database Setup

```bash
# Seed the database with dashboard data
npm run seed-dashboard

# This will create:
# - Sample users (including admin)
# - 30 days of system metrics
# - User activity logs
# - Daily analytics records
```

### 3. Environment Configuration

Create or update your `.env.local` file:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/aithor

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# WebSocket (optional for real-time features)
NEXT_PUBLIC_WEBSOCKET_URL=ws://localhost:3000
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# The dashboard will be available at:
# User Dashboard: http://localhost:3000/dashboard
# Admin Dashboard: http://localhost:3000/dashboard/admin
```

### 5. Default Admin Access

After seeding, you can log in as admin with:
- Email: `alpsingh03@gmail.com`
- Password: `Aa2275aA`

## Testing

### Running Tests

```bash
# Run all dashboard tests
npm test -- __tests__/components/dashboard/
npm test -- __tests__/lib/utils/dashboardUtils.test.ts
npm test -- __tests__/api/dashboard/

# Run with coverage
npm test -- --coverage

# Watch mode for development
npm test -- --watch
```

### Test Structure

```
__tests__/
├── components/
│   └── dashboard/
│       ├── ModernStatsCard.test.tsx
│       ├── ModernChartCard.test.tsx
│       └── ActivityFeed.test.tsx
├── lib/
│   └── utils/
│       └── dashboardUtils.test.ts
└── api/
    └── dashboard/
        ├── overview.test.ts
        ├── analytics.test.ts
        └── system-metrics.test.ts
```

### Contributing

When adding new dashboard features:

1. Follow the established component patterns
2. Add comprehensive tests
3. Update documentation
4. Consider real-time implications
5. Ensure responsive design
6. Test with different user roles
