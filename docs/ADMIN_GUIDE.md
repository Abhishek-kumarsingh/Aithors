# Admin Dashboard Guide

This comprehensive guide covers all administrative features and functionality available in the InterviewAI platform.

## Overview

The Admin Dashboard provides comprehensive tools for managing users, monitoring system performance, analyzing platform usage, and maintaining the InterviewAI platform.

### Admin Access
- **Default Admin Email**: `alpsingh03@gmail.com`
- **Default Password**: `Aa2275aA`
- **Dashboard URL**: `/dashboard/admin`

## Dashboard Navigation

### Main Navigation Menu
- **Dashboard** - Overview and key metrics
- **Analytics** - Detailed system analytics and reports
- **Users** - User management and administration
- **System Health** - Real-time system monitoring
- **Settings** - Platform configuration

### Top Navigation Bar
- **Search** - Global search across users and data
- **Notifications** - System alerts and updates
- **Profile Menu** - Admin profile and settings
- **Theme Toggle** - Switch between light/dark themes
- **Logout** - Secure logout

## Dashboard Overview

### Key Metrics Cards

#### Total Users
- **Display**: Current total registered users
- **Trend**: Growth percentage from previous period
- **Click Action**: Navigate to Users page

#### Active Users
- **Display**: Users active in last 24 hours
- **Trend**: Activity change from previous day
- **Click Action**: View active users list

#### Total Interviews
- **Display**: All interviews conducted on platform
- **Trend**: Interview volume change
- **Click Action**: Navigate to interview analytics

#### System Health
- **Display**: Overall system status (Healthy/Warning/Critical)
- **Indicators**: Uptime, response time, error rate
- **Click Action**: Navigate to System Health page

### Real-Time Charts

#### User Activity Chart
- **Type**: Line chart showing daily active users
- **Time Range**: Last 30 days
- **Features**: 
  - Hover for exact values
  - Zoom and pan functionality
  - Export to PNG/PDF

#### Interview Performance Chart
- **Type**: Bar chart showing interview completion rates
- **Metrics**: Started vs Completed interviews
- **Filters**: Date range, user role

#### System Performance Chart
- **Type**: Area chart showing system metrics
- **Metrics**: Response time, CPU usage, memory usage
- **Real-time**: Updates every 30 seconds

## User Management

### User List View

#### User Table Columns
- **Avatar & Name** - User profile picture and full name
- **Email** - User email address (clickable to send email)
- **Role** - User role (User/Admin) with role badge
- **Status** - Account status (Active/Blocked/Pending)
- **Last Login** - Last login timestamp
- **Interviews** - Total interviews completed
- **Actions** - Quick action buttons

#### User Actions
- **View Profile** - View detailed user information
- **Edit User** - Modify user details and settings
- **Block/Unblock** - Toggle user account status
- **Impersonate** - Login as user for support
- **Delete** - Permanently remove user account
- **Send Email** - Send notification email

### User Search and Filtering

#### Search Options
- **Global Search** - Search by name, email, or ID
- **Advanced Filters**:
  - Role (User/Admin)
  - Status (Active/Blocked/Pending)
  - Registration date range
  - Last login date range
  - Interview count range

#### Bulk Actions
- **Select All** - Select all visible users
- **Bulk Block** - Block multiple users
- **Bulk Unblock** - Unblock multiple users
- **Bulk Export** - Export user data to CSV
- **Bulk Email** - Send notification to multiple users

### User Profile Management

#### Profile Information
- **Basic Details**: Name, email, role, status
- **Account Settings**: Password reset, 2FA status
- **Activity History**: Login history, IP addresses
- **Interview History**: All interviews with scores
- **AI Usage**: Chat sessions and token usage

#### User Modification Options
- **Change Role** - Promote to admin or demote to user
- **Reset Password** - Force password reset on next login
- **Update Profile** - Modify name, email, avatar
- **Account Status** - Activate, block, or suspend account
- **Delete Account** - Permanently remove user and data

### User Impersonation

#### Starting Impersonation
1. Navigate to user profile
2. Click "Impersonate User" button
3. Confirm impersonation action
4. Automatically redirected to user dashboard

#### During Impersonation
- **Banner Display** - Warning banner showing impersonation status
- **Limited Actions** - Cannot modify admin settings
- **Session Tracking** - All actions logged for audit
- **Time Limit** - Maximum 1 hour session

#### Ending Impersonation
- **Stop Button** - Click "Stop Impersonation" in banner
- **Automatic Timeout** - Session ends after 1 hour
- **Return to Admin** - Redirected back to admin dashboard

## Analytics and Reporting

### System Analytics

#### User Analytics
- **Registration Trends** - New user signups over time
- **User Engagement** - Daily/monthly active users
- **User Retention** - User retention rates by cohort
- **Geographic Distribution** - User locations (if available)

#### Interview Analytics
- **Interview Volume** - Total interviews by time period
- **Completion Rates** - Started vs completed interviews
- **Average Scores** - Performance metrics across users
- **Popular Skills** - Most tested technical skills
- **Question Performance** - Question difficulty and success rates

#### AI Usage Analytics
- **Provider Performance** - Success rates by AI provider
- **Token Usage** - API consumption and costs
- **Response Times** - AI response performance metrics
- **Error Rates** - Failed requests and error types

### Performance Metrics

#### System Performance
- **Response Times** - API endpoint performance
- **Database Performance** - Query execution times
- **Error Rates** - Application error frequency
- **Uptime Statistics** - System availability metrics

#### Resource Usage
- **CPU Usage** - Server CPU utilization
- **Memory Usage** - RAM consumption patterns
- **Disk Usage** - Storage utilization
- **Network I/O** - Bandwidth usage statistics

### Export and Reporting

#### Available Reports
- **User Report** - Complete user data export
- **Interview Report** - Interview results and analytics
- **System Report** - Performance and health metrics
- **AI Usage Report** - AI provider usage and costs

#### Export Formats
- **CSV** - Spreadsheet-compatible format
- **PDF** - Formatted reports with charts
- **JSON** - Raw data for further processing
- **Excel** - Advanced spreadsheet format

#### Scheduled Reports
- **Daily Reports** - Automated daily summaries
- **Weekly Reports** - Weekly performance summaries
- **Monthly Reports** - Comprehensive monthly analytics
- **Custom Reports** - User-defined report schedules

## System Health Monitoring

### Real-Time Monitoring

#### System Status Dashboard
- **Overall Health** - Green/Yellow/Red status indicator
- **Uptime** - Current uptime percentage
- **Active Sessions** - Current user sessions
- **API Status** - All API endpoints status

#### Performance Metrics
- **Response Time** - Average API response time
- **Throughput** - Requests per second
- **Error Rate** - Percentage of failed requests
- **Database Performance** - Query response times

### AI Provider Monitoring

#### Provider Status
- **Gemini API** - Status, response time, error rate
- **DeepSeek API** - Availability and performance
- **Claude API** - Service status and latency
- **OpenAI API** - Connection status and usage

#### Failover Management
- **Automatic Failover** - AI provider switching
- **Manual Override** - Force specific provider
- **Provider Priority** - Set preferred provider order
- **Cost Tracking** - Monitor API usage costs

### Alert Management

#### Alert Types
- **System Alerts** - High CPU, memory, or disk usage
- **Performance Alerts** - Slow response times
- **Error Alerts** - High error rates or failures
- **Security Alerts** - Suspicious login attempts

#### Alert Configuration
- **Thresholds** - Set custom alert thresholds
- **Notification Methods** - Email, SMS, webhook
- **Alert Recipients** - Admin notification lists
- **Escalation Rules** - Alert escalation procedures

## Platform Configuration

### General Settings

#### Application Settings
- **Platform Name** - Customize platform branding
- **Logo Upload** - Update platform logo
- **Theme Configuration** - Default theme settings
- **Language Settings** - Default language and localization

#### Security Settings
- **Password Policy** - Password requirements
- **Session Timeout** - User session duration
- **2FA Requirements** - Enforce two-factor authentication
- **Login Attempt Limits** - Failed login restrictions

### AI Configuration

#### Provider Settings
- **API Keys** - Manage AI provider API keys
- **Provider Priority** - Set fallback order
- **Rate Limits** - Configure usage limits
- **Cost Limits** - Set spending thresholds

#### Model Configuration
- **Default Models** - Set preferred AI models
- **Temperature Settings** - AI response creativity
- **Token Limits** - Maximum tokens per request
- **Timeout Settings** - Request timeout values

### Email Configuration

#### SMTP Settings
- **Email Provider** - Configure email service
- **Authentication** - SMTP credentials
- **Security Settings** - TLS/SSL configuration
- **Rate Limiting** - Email sending limits

#### Email Templates
- **Welcome Email** - New user registration
- **OTP Email** - Two-factor authentication
- **Password Reset** - Password recovery
- **Notification Email** - System notifications

## Security and Audit

### Security Monitoring

#### Login Monitoring
- **Failed Login Attempts** - Track failed logins
- **Suspicious Activity** - Unusual login patterns
- **IP Tracking** - Monitor login locations
- **Session Management** - Active session monitoring

#### Access Control
- **Role Management** - User role assignments
- **Permission Auditing** - Track permission changes
- **Admin Actions** - Log all admin activities
- **Data Access** - Monitor sensitive data access

### Audit Logs

#### Activity Logging
- **User Actions** - All user activities
- **Admin Actions** - Administrative changes
- **System Events** - System-level events
- **Security Events** - Security-related activities

#### Log Management
- **Log Retention** - Configure log storage duration
- **Log Export** - Export logs for analysis
- **Log Search** - Search and filter logs
- **Log Alerts** - Automated log-based alerts

## Troubleshooting

### Common Admin Tasks

#### User Issues
- **Password Reset** - Reset user passwords
- **Account Unlock** - Unlock blocked accounts
- **Profile Recovery** - Restore user profiles
- **Data Export** - Export user data

#### System Issues
- **Performance Problems** - Diagnose slow performance
- **API Failures** - Troubleshoot AI provider issues
- **Database Issues** - Resolve database problems
- **Email Problems** - Fix email delivery issues

### Support Tools

#### Diagnostic Tools
- **System Health Check** - Comprehensive system test
- **Database Connectivity** - Test database connection
- **API Testing** - Test external API connections
- **Email Testing** - Test email delivery

#### Maintenance Tools
- **Cache Clearing** - Clear application cache
- **Database Cleanup** - Remove old data
- **Log Rotation** - Manage log files
- **Backup Verification** - Verify backup integrity

## Best Practices

### Daily Admin Tasks
1. **Check System Health** - Review overall system status
2. **Monitor User Activity** - Check for unusual patterns
3. **Review Alerts** - Address any system alerts
4. **Check AI Usage** - Monitor API consumption and costs

### Weekly Admin Tasks
1. **User Management Review** - Review new users and permissions
2. **Performance Analysis** - Analyze system performance trends
3. **Security Audit** - Review security logs and events
4. **Backup Verification** - Ensure backups are working

### Monthly Admin Tasks
1. **Comprehensive Analytics Review** - Analyze monthly trends
2. **System Optimization** - Optimize performance and resources
3. **Security Assessment** - Comprehensive security review
4. **Documentation Updates** - Update admin procedures

For additional support, refer to:
- [API Documentation](./API.md)
- [Database Schema](./DATABASE.md)
- [Authentication Guide](./AUTHENTICATION.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
