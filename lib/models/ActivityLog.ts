import mongoose from 'mongoose';

// Define the interface for Activity Log document
export interface IActivityLog extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  action: string;
  description: string;
  category: 'auth' | 'interview' | 'profile' | 'admin' | 'system';
  metadata?: {
    ip?: string;
    userAgent?: string;
    browser?: string;
    os?: string;
    device?: string;
    location?: string;
    sessionId?: string;
    interviewId?: string;
    targetUserId?: string;
    oldValue?: any;
    newValue?: any;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'success' | 'failed' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      // Authentication actions
      'login', 'logout', 'register', 'password_change', 'password_reset',
      'two_factor_enable', 'two_factor_disable', 'account_locked', 'account_unlocked',
      
      // Interview actions
      'interview_start', 'interview_complete', 'interview_pause', 'interview_resume',
      'interview_cancel', 'interview_schedule', 'interview_reschedule',
      
      // Profile actions
      'profile_update', 'avatar_change', 'preferences_update', 'email_change',
      
      // Admin actions
      'user_create', 'user_update', 'user_delete', 'user_block', 'user_unblock',
      'role_change', 'impersonate_start', 'impersonate_end', 'bulk_action',
      
      // System actions
      'system_backup', 'system_restore', 'maintenance_start', 'maintenance_end',
      'error_occurred', 'security_alert', 'data_export', 'data_import'
    ]
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['auth', 'interview', 'profile', 'admin', 'system'],
    required: true
  },
  metadata: {
    ip: String,
    userAgent: String,
    browser: String,
    os: String,
    device: String,
    location: String,
    sessionId: String,
    interviewId: String,
    targetUserId: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'pending'],
    default: 'success'
  }
}, {
  timestamps: true,
  collection: 'activity_logs'
});

// Add indexes for better query performance
activityLogSchema.index({ userId: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ category: 1, createdAt: -1 });
activityLogSchema.index({ severity: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

// Create the model
const ActivityLogModel = mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);

export default ActivityLogModel;
