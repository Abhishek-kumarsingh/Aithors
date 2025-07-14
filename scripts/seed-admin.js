const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aithor';

// Admin user details
const ADMIN_USER = {
  name: 'Admin User',
  email: 'alpsingh03@gmail.com',
  password: 'Aa2275aA',
  role: 'admin',
  image: null
};

// User schema (should match your actual schema)
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
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
  twoFactorSecret: {
    type: String,
    select: false
  },
  twoFactorBackupCodes: {
    type: [String],
    select: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Add password comparison method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Create User model
const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedAdminUser() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists with email:', ADMIN_USER.email);
      
      // Update password if needed
      const isPasswordValid = await existingAdmin.comparePassword(ADMIN_USER.password);
      if (!isPasswordValid) {
        console.log('🔄 Updating admin password...');
        existingAdmin.password = ADMIN_USER.password; // Will be hashed by pre-save hook
        await existingAdmin.save();
        console.log('✅ Admin password updated');
      } else {
        console.log('✅ Admin password is already correct');
      }
      
      // Ensure role is admin
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('✅ Admin role updated');
      }
      
      return;
    }

    // Create new admin user
    console.log('👤 Creating admin user...');
    const adminUser = new User(ADMIN_USER);
    await adminUser.save();
    
    console.log('🎉 Admin user created successfully!');
    console.log('📧 Email:', ADMIN_USER.email);
    console.log('🔑 Password:', ADMIN_USER.password);
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedAdminUser();
}

module.exports = { seedAdminUser };
