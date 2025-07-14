#!/usr/bin/env node

/**
 * MongoDB Atlas Production Data Seeding Script
 * Seeds real, production-ready data into MongoDB Atlas
 * Removes any dummy/test data and creates realistic content
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// Create User Schema (since we're using CommonJS)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  image: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastActivity: {
    type: Date
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  loginCount: {
    type: Number,
    default: 0
  },
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

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

console.log('🚀 InterviewAI Atlas Database Seeding Script');
console.log('============================================');

// Verify we're using Atlas
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in environment variables');
  process.exit(1);
}

if (!MONGODB_URI.includes('mongodb+srv://')) {
  console.error('❌ This script is designed for MongoDB Atlas (mongodb+srv://)');
  console.log('💡 Current URI:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
  process.exit(1);
}

console.log('✅ Using MongoDB Atlas:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));

/**
 * Real Interview Questions Database
 */
const REAL_INTERVIEW_QUESTIONS = {
  frontend: [
    {
      question: "Explain the difference between React's useState and useEffect hooks.",
      type: "technical",
      difficulty: "medium",
      expectedAnswer: "useState manages component state, useEffect handles side effects and lifecycle events",
      skills: ["React", "JavaScript", "Hooks"]
    },
    {
      question: "How would you optimize a React application's performance?",
      type: "technical", 
      difficulty: "hard",
      expectedAnswer: "Use React.memo, useMemo, useCallback, code splitting, lazy loading, and proper state management",
      skills: ["React", "Performance", "Optimization"]
    },
    {
      question: "Describe the CSS Box Model and how it affects layout.",
      type: "technical",
      difficulty: "easy",
      expectedAnswer: "Content, padding, border, margin - affects element sizing and positioning",
      skills: ["CSS", "Layout", "Web Development"]
    }
  ],
  backend: [
    {
      question: "Explain the principles of RESTful API design.",
      type: "technical",
      difficulty: "medium", 
      expectedAnswer: "Stateless, uniform interface, cacheable, client-server architecture, layered system",
      skills: ["API Design", "REST", "Backend"]
    },
    {
      question: "How would you design a scalable microservices architecture?",
      type: "system-design",
      difficulty: "hard",
      expectedAnswer: "Service decomposition, API gateway, service discovery, load balancing, data consistency",
      skills: ["Microservices", "System Design", "Architecture"]
    },
    {
      question: "What are the ACID properties in database transactions?",
      type: "technical",
      difficulty: "medium",
      expectedAnswer: "Atomicity, Consistency, Isolation, Durability - ensure reliable database operations",
      skills: ["Database", "Transactions", "ACID"]
    }
  ],
  fullstack: [
    {
      question: "How would you implement authentication in a full-stack application?",
      type: "technical",
      difficulty: "hard",
      expectedAnswer: "JWT tokens, secure storage, refresh tokens, proper validation, HTTPS",
      skills: ["Authentication", "Security", "Full Stack"]
    },
    {
      question: "Explain the difference between SQL and NoSQL databases.",
      type: "technical", 
      difficulty: "medium",
      expectedAnswer: "SQL: structured, ACID, relational. NoSQL: flexible schema, horizontal scaling, document/key-value",
      skills: ["Database", "SQL", "NoSQL"]
    }
  ]
};

/**
 * Real User Profiles (Production Ready)
 */
const REAL_USERS = [
  {
    name: "Admin User",
    email: "alpsingh03@gmail.com",
    password: "Aa2275aA", // Your specified admin password
    role: "admin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "dark",
      notifications: true,
      language: "en"
    }
  },
  {
    name: "Sarah Chen",
    email: "sarah.chen@techcorp.com", 
    password: "SecurePass123!",
    role: "user",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "light",
      notifications: true,
      language: "en"
    }
  },
  {
    name: "Michael Rodriguez",
    email: "m.rodriguez@startup.io",
    password: "DevLife2024#",
    role: "user", 
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "dark",
      notifications: false,
      language: "en"
    }
  },
  {
    name: "Emily Johnson",
    email: "emily.j@innovate.com",
    password: "Frontend2024$",
    role: "user",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "light", 
      notifications: true,
      language: "en"
    }
  },
  {
    name: "David Kim",
    email: "david.kim@cloudtech.dev",
    password: "Backend2024!",
    role: "user",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    preferences: {
      theme: "dark",
      notifications: true,
      language: "en"
    }
  }
];

/**
 * Real Tech Stacks and Domains
 */
const TECH_STACKS = {
  frontend: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "CSS", "HTML", "Tailwind CSS"],
  backend: ["Node.js", "Python", "Java", "C#", "Go", "Express.js", "Django", "Spring Boot"],
  database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "DynamoDB"],
  cloud: ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"],
  tools: ["Git", "Jest", "Webpack", "Vite", "ESLint", "Prettier"]
};

/**
 * Seed Database Function
 */
async function seedAtlasDatabase() {
  try {
    console.log('\n🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas successfully!');

    // Clear existing data
    console.log('\n🧹 Clearing existing data...');
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`   ✅ Cleared ${collection.name} collection`);
    }

    console.log('\n👥 Creating real user accounts...');
    const createdUsers = [];

    for (const userData of REAL_USERS) {
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new User({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
        image: userData.image,
        preferences: userData.preferences,
        isOnline: Math.random() > 0.5, // Random online status
        lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random last login within 7 days
        loginCount: Math.floor(Math.random() * 50) + 1,
        deviceInfo: {
          browser: ["Chrome", "Firefox", "Safari", "Edge"][Math.floor(Math.random() * 4)],
          os: ["Windows", "macOS", "Linux"][Math.floor(Math.random() * 3)],
          device: "Desktop",
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`
        }
      });

      await user.save();
      createdUsers.push(user);
      
      console.log(`   ✅ Created ${userData.role}: ${userData.name} (${userData.email})`);
    }

    console.log('\n📊 Creating database indexes for performance...');
    
    // Create indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ isOnline: 1 });
    await User.collection.createIndex({ lastLogin: -1 });
    
    console.log('   ✅ Database indexes created');

    console.log('\n📝 Creating question bank...');

    // Create Questions Collection
    const questionSchema = new mongoose.Schema({
      question: String,
      type: String,
      difficulty: String,
      category: String,
      expectedAnswer: String,
      skills: [String],
      timeLimit: Number,
      createdAt: { type: Date, default: Date.now }
    });

    const Question = mongoose.models.Question || mongoose.model('Question', questionSchema);

    const allQuestions = [];
    Object.entries(REAL_INTERVIEW_QUESTIONS).forEach(([category, questions]) => {
      questions.forEach(q => {
        allQuestions.push({
          ...q,
          category,
          timeLimit: q.difficulty === 'easy' ? 300 : q.difficulty === 'medium' ? 600 : 900
        });
      });
    });

    await Question.insertMany(allQuestions);
    console.log(`   ✅ Created ${allQuestions.length} real interview questions`);

    console.log('\n📈 Database seeding completed successfully!');
    console.log('\n🔐 Login Credentials:');
    console.log('=====================================');
    console.log('👑 ADMIN ACCESS:');
    console.log('   Email: alpsingh03@gmail.com');
    console.log('   Password: Aa2275aA');
    console.log('\n👤 SAMPLE USER ACCOUNTS:');

    REAL_USERS.filter(u => u.role === 'user').forEach(user => {
      console.log(`   📧 ${user.email}`);
      console.log(`   🔑 ${user.password}`);
      console.log('   ---');
    });

    console.log('\n📊 Database Statistics:');
    console.log(`   👥 Users: ${createdUsers.length}`);
    console.log(`   👑 Admins: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`   👤 Regular Users: ${createdUsers.filter(u => u.role === 'user').length}`);
    console.log(`   📝 Questions: ${allQuestions.length}`);
    console.log(`   🌐 Database: interviewai (MongoDB Atlas)`);

    console.log('\n🎉 Your InterviewAI platform is ready for production!');
    console.log('🚀 Start your application: npm run dev');
    console.log('🌐 Access at: http://localhost:3000');

  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    
    if (error.code === 11000) {
      console.log('💡 Duplicate key error - some users may already exist');
    } else if (error.name === 'MongoNetworkError') {
      console.log('💡 Network error - check your internet connection and MongoDB Atlas access');
    } else if (error.name === 'MongooseError') {
      console.log('💡 Database connection error - verify your MONGODB_URI');
    }
    
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB Atlas');
  }
}

// Run the seeding script
if (require.main === module) {
  seedAtlasDatabase();
}

module.exports = { seedAtlasDatabase, REAL_USERS, REAL_INTERVIEW_QUESTIONS };
