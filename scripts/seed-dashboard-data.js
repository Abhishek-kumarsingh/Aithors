const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Since we're using ES6 modules in a CommonJS script, we need to handle imports differently
// We'll define the models directly in this script to avoid import issues

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  lastLogin: Date,
  isOnline: { type: Boolean, default: false },
  lastActivity: Date,
  isBlocked: { type: Boolean, default: false },
  loginCount: { type: Number, default: 0 },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    ip: String
  },
  preferences: {
    theme: { type: String, enum: ['light', 'dark'], default: 'light' },
    notifications: { type: Boolean, default: true },
    language: { type: String, default: 'en' }
  }
}, { timestamps: true });

// System Metrics Schema
const systemMetricsSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now, index: true },
  cpu: {
    usage: { type: Number, required: true, min: 0, max: 100 },
    cores: { type: Number, required: true },
    temperature: Number
  },
  memory: {
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true },
    usage: { type: Number, required: true, min: 0, max: 100 }
  },
  storage: {
    total: { type: Number, required: true },
    used: { type: Number, required: true },
    free: { type: Number, required: true },
    usage: { type: Number, required: true, min: 0, max: 100 }
  },
  network: {
    bytesIn: Number,
    bytesOut: Number,
    packetsIn: Number,
    packetsOut: Number
  },
  services: {
    database: { type: String, enum: ['healthy', 'warning', 'critical'], default: 'healthy' },
    api: { type: String, enum: ['healthy', 'warning', 'critical'], default: 'healthy' },
    websocket: { type: String, enum: ['healthy', 'warning', 'critical'], default: 'healthy' },
    redis: { type: String, enum: ['healthy', 'warning', 'critical'], default: 'healthy' }
  },
  uptime: { type: Number, required: true }
}, { timestamps: true });

// User Activity Schema
const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['authentication', 'interview', 'dashboard', 'admin', 'system'],
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'success'],
    default: 'info',
    index: true
  },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

// Dashboard Analytics Schema
const dashboardAnalyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true, index: true },
  metrics: {
    totalUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    totalInterviews: { type: Number, default: 0 },
    completedInterviews: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    averageDuration: { type: Number, default: 0 },
    topSkills: [{
      skill: String,
      count: Number,
      averageScore: Number
    }],
    userEngagement: {
      dailyActiveUsers: { type: Number, default: 0 },
      weeklyActiveUsers: { type: Number, default: 0 },
      monthlyActiveUsers: { type: Number, default: 0 },
      averageSessionDuration: { type: Number, default: 0 }
    },
    systemPerformance: {
      averageResponseTime: { type: Number, default: 0 },
      errorRate: { type: Number, default: 0 },
      uptime: { type: Number, default: 100 }
    }
  }
}, { timestamps: true });

// Create models
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
const SystemMetricsModel = mongoose.models.SystemMetrics || mongoose.model('SystemMetrics', systemMetricsSchema);
const UserActivityModel = mongoose.models.UserActivity || mongoose.model('UserActivity', userActivitySchema);
const DashboardAnalyticsModel = mongoose.models.DashboardAnalytics || mongoose.model('DashboardAnalytics', dashboardAnalyticsSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aithor';

// Sample data generators
const generateSystemMetrics = (daysBack = 30) => {
  const metrics = [];
  const now = new Date();
  
  for (let i = daysBack; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // Generate realistic metrics with some variation
    const baseLoad = 30 + Math.sin(i * 0.1) * 20; // Cyclical load pattern
    const randomVariation = (Math.random() - 0.5) * 20;
    
    metrics.push({
      timestamp,
      cpu: {
        usage: Math.max(5, Math.min(95, baseLoad + randomVariation)),
        cores: 8,
        temperature: 45 + Math.random() * 20
      },
      memory: {
        total: 16384, // 16GB in MB
        used: Math.floor(6000 + Math.random() * 4000),
        free: 0, // Will be calculated
        usage: 0 // Will be calculated
      },
      storage: {
        total: 512000, // 512GB in MB
        used: Math.floor(200000 + Math.random() * 100000),
        free: 0, // Will be calculated
        usage: 0 // Will be calculated
      },
      network: {
        bytesIn: Math.floor(Math.random() * 1000000000), // Random bytes
        bytesOut: Math.floor(Math.random() * 500000000),
        packetsIn: Math.floor(Math.random() * 1000000),
        packetsOut: Math.floor(Math.random() * 800000)
      },
      services: {
        database: Math.random() > 0.95 ? 'warning' : 'healthy',
        api: Math.random() > 0.98 ? 'warning' : 'healthy',
        websocket: Math.random() > 0.97 ? 'warning' : 'healthy',
        redis: Math.random() > 0.96 ? 'warning' : 'healthy'
      },
      uptime: (daysBack - i) * 24 * 60 * 60 + Math.random() * 86400,
      createdAt: timestamp
    });
  }
  
  // Calculate derived values
  metrics.forEach(metric => {
    metric.memory.free = metric.memory.total - metric.memory.used;
    metric.memory.usage = (metric.memory.used / metric.memory.total) * 100;
    metric.storage.free = metric.storage.total - metric.storage.used;
    metric.storage.usage = (metric.storage.used / metric.storage.total) * 100;
  });
  
  return metrics;
};

const generateUserActivities = async (users, daysBack = 30) => {
  const activities = [];
  const now = new Date();
  
  const actionTypes = [
    { action: 'user_login', description: 'User logged into the system', category: 'authentication', severity: 'info' },
    { action: 'user_logout', description: 'User logged out of the system', category: 'authentication', severity: 'info' },
    { action: 'interview_started', description: 'Started a new interview session', category: 'interview', severity: 'info' },
    { action: 'interview_completed', description: 'Completed interview session', category: 'interview', severity: 'success' },
    { action: 'profile_updated', description: 'Updated user profile information', category: 'dashboard', severity: 'info' },
    { action: 'password_changed', description: 'Changed account password', category: 'authentication', severity: 'warning' },
    { action: 'admin_action', description: 'Performed administrative action', category: 'admin', severity: 'warning' },
    { action: 'system_error', description: 'System encountered an error', category: 'system', severity: 'error' },
    { action: 'backup_created', description: 'System backup was created', category: 'system', severity: 'success' },
    { action: 'user_blocked', description: 'User account was blocked', category: 'admin', severity: 'error' },
  ];
  
  for (let i = daysBack; i >= 0; i--) {
    const dayActivities = Math.floor(Math.random() * 50) + 10; // 10-60 activities per day
    
    for (let j = 0; j < dayActivities; j++) {
      const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000 + Math.random() * 24 * 60 * 60 * 1000);
      const user = users[Math.floor(Math.random() * users.length)];
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      activities.push({
        userId: user._id,
        action: actionType.action,
        description: actionType.description,
        category: actionType.category,
        severity: actionType.severity,
        metadata: {
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          duration: actionType.category === 'interview' ? Math.floor(Math.random() * 3600) : undefined,
          score: actionType.action === 'interview_completed' ? Math.floor(Math.random() * 40) + 60 : undefined,
        },
        timestamp,
        createdAt: timestamp
      });
    }
  }
  
  return activities.sort((a, b) => b.timestamp - a.timestamp);
};

const generateDashboardAnalytics = async (daysBack = 30) => {
  const analytics = [];
  const now = new Date();
  
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    date.setHours(0, 0, 0, 0);
    
    const baseUsers = 100 + i * 2; // Growing user base
    const dailyActive = Math.floor(baseUsers * (0.3 + Math.random() * 0.4)); // 30-70% daily active
    
    analytics.push({
      date,
      metrics: {
        totalUsers: baseUsers,
        activeUsers: dailyActive,
        newUsers: Math.floor(Math.random() * 10) + 1,
        totalInterviews: Math.floor(dailyActive * (0.5 + Math.random() * 0.8)),
        completedInterviews: Math.floor(dailyActive * (0.3 + Math.random() * 0.4)),
        averageScore: 70 + Math.random() * 25,
        averageDuration: 15 + Math.random() * 30, // 15-45 minutes
        topSkills: [
          { skill: 'JavaScript', count: Math.floor(Math.random() * 50) + 20, averageScore: 75 + Math.random() * 20 },
          { skill: 'React', count: Math.floor(Math.random() * 40) + 15, averageScore: 70 + Math.random() * 25 },
          { skill: 'Node.js', count: Math.floor(Math.random() * 35) + 10, averageScore: 72 + Math.random() * 23 },
          { skill: 'Python', count: Math.floor(Math.random() * 45) + 18, averageScore: 78 + Math.random() * 18 },
          { skill: 'SQL', count: Math.floor(Math.random() * 30) + 12, averageScore: 65 + Math.random() * 30 },
        ],
        userEngagement: {
          dailyActiveUsers: dailyActive,
          weeklyActiveUsers: Math.floor(baseUsers * (0.6 + Math.random() * 0.3)),
          monthlyActiveUsers: Math.floor(baseUsers * (0.8 + Math.random() * 0.2)),
          averageSessionDuration: 20 + Math.random() * 40 // 20-60 minutes
        },
        systemPerformance: {
          averageResponseTime: 100 + Math.random() * 200, // 100-300ms
          errorRate: Math.random() * 2, // 0-2%
          uptime: 99.5 + Math.random() * 0.5 // 99.5-100%
        }
      },
      createdAt: date,
      updatedAt: date
    });
  }
  
  return analytics;
};

const createSampleUsers = async () => {
  const users = [];
  const names = [
    'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown',
    'Emily Davis', 'Chris Miller', 'Lisa Garcia', 'Tom Anderson', 'Amy Taylor',
    'Kevin Martinez', 'Rachel White', 'Jason Lee', 'Michelle Clark', 'Ryan Lewis'
  ];
  
  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const email = name.toLowerCase().replace(' ', '.') + '@example.com';
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    users.push({
      name,
      email,
      password: hashedPassword,
      role: i < 2 ? 'admin' : 'user', // First 2 users are admins
      lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random login in last week
      isOnline: Math.random() > 0.7, // 30% chance of being online
      lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random activity in last day
      loginCount: Math.floor(Math.random() * 100) + 10,
      deviceInfo: {
        browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
        os: ['Windows', 'macOS', 'Linux'][Math.floor(Math.random() * 3)],
        device: 'Desktop',
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`
      },
      preferences: {
        theme: Math.random() > 0.5 ? 'light' : 'dark',
        notifications: Math.random() > 0.3,
        language: 'en'
      },
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Created in last 90 days
      updatedAt: new Date()
    });
  }
  
  return users;
};

async function seedDashboardData() {
  try {
    console.log('🌱 Starting dashboard data seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    console.log('🧹 Clearing existing dashboard data...');
    await SystemMetricsModel.deleteMany({});
    await UserActivityModel.deleteMany({});
    await DashboardAnalyticsModel.deleteMany({});
    
    // Create sample users if they don't exist
    const existingUsers = await UserModel.find({});
    let users = existingUsers;
    
    if (existingUsers.length < 5) {
      console.log('👥 Creating sample users...');
      const sampleUsers = await createSampleUsers();
      users = await UserModel.insertMany(sampleUsers);
      console.log(`✅ Created ${users.length} sample users`);
    } else {
      console.log(`✅ Using existing ${users.length} users`);
    }
    
    // Generate and insert system metrics
    console.log('📊 Generating system metrics...');
    const systemMetrics = generateSystemMetrics(30);
    await SystemMetricsModel.insertMany(systemMetrics);
    console.log(`✅ Inserted ${systemMetrics.length} system metrics records`);
    
    // Generate and insert user activities
    console.log('📝 Generating user activities...');
    const userActivities = await generateUserActivities(users, 30);
    await UserActivityModel.insertMany(userActivities);
    console.log(`✅ Inserted ${userActivities.length} user activity records`);
    
    // Generate and insert dashboard analytics
    console.log('📈 Generating dashboard analytics...');
    const dashboardAnalytics = await generateDashboardAnalytics(30);
    await DashboardAnalyticsModel.insertMany(dashboardAnalytics);
    console.log(`✅ Inserted ${dashboardAnalytics.length} dashboard analytics records`);
    
    console.log('🎉 Dashboard data seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   System Metrics: ${systemMetrics.length}`);
    console.log(`   User Activities: ${userActivities.length}`);
    console.log(`   Analytics Records: ${dashboardAnalytics.length}`);
    
  } catch (error) {
    console.error('❌ Error seeding dashboard data:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run the seeding function
if (require.main === module) {
  seedDashboardData();
}

module.exports = { seedDashboardData };
