# 🗄️ Database Setup for AI Interview Platform

## 🚀 Quick Setup

### 1. Environment Variables
Add these to your `.env.local` file:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/aithor
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/aithor

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here

# Email Configuration (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 2. Install Dependencies
```bash
npm install mongoose bcrypt next-auth
```

### 3. Seed Admin User
```bash
npm run seed-admin
```

This will create the admin user with:
- **Email**: `alpsingh03@gmail.com`
- **Password**: `Aa2275aA`
- **Role**: `admin`

## 🔐 Authentication Flow

### Admin Login
1. Navigate to `/auth/login`
2. Enter admin credentials (hidden from UI)
3. Automatically redirects to `/admin` dashboard
4. Admin role is detected from database

### User Registration
1. Navigate to `/auth/register`
2. Complete 3-step process:
   - Enter name and email
   - Verify email with OTP
   - Set password
3. User is created in database with `user` role
4. Redirects to `/dashboard`

### Google OAuth
1. Click "Continue with Google" on login/register
2. User is created automatically if doesn't exist
3. Role defaults to `user`

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed),
  image: String (optional),
  role: String (enum: ['user', 'admin']),
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  twoFactorBackupCodes: [String],
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🛠️ Database Operations

### Check Database Connection
```bash
curl http://localhost:3000/api/test-db
```

### Create Additional Admin Users
```javascript
// In MongoDB shell or script
db.users.insertOne({
  name: "Another Admin",
  email: "admin2@example.com",
  password: "$2b$10$hashedPasswordHere",
  role: "admin",
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### Update User Role
```javascript
// Promote user to admin
db.users.updateOne(
  { email: "user@example.com" },
  { $set: { role: "admin" } }
);
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check if MongoDB is running
   mongosh
   # OR start MongoDB service
   sudo systemctl start mongod
   ```

2. **Admin User Not Found**
   ```bash
   # Re-run the seeding script
   npm run seed-admin
   ```

3. **Password Hash Issues**
   - The system uses bcrypt with salt rounds of 10
   - Passwords are automatically hashed on save
   - Use `comparePassword()` method for verification

4. **NextAuth Session Issues**
   ```bash
   # Clear browser cookies and restart
   # Check NEXTAUTH_SECRET is set
   ```

### Database Queries

```javascript
// Find all users
db.users.find({});

// Find admin users
db.users.find({ role: "admin" });

// Count users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
]);

// Find recent logins
db.users.find({ 
  lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) } 
});
```

## 🚀 Production Deployment

### MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in production environment

### Security Checklist
- [ ] Strong `NEXTAUTH_SECRET` (32+ characters)
- [ ] MongoDB connection uses authentication
- [ ] Environment variables are secure
- [ ] Admin credentials are changed from defaults
- [ ] Database backups are configured
- [ ] SSL/TLS enabled for production

### Performance Optimization
```javascript
// Add database indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ lastLogin: -1 });
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/send-otp` - Send email OTP
- `POST /api/auth/verify-otp` - Verify email OTP

### Admin
- `GET /api/admin/users` - List all users (admin only)
- `POST /api/admin/users` - Create user (admin only)
- `PUT /api/admin/users/[id]` - Update user (admin only)
- `DELETE /api/admin/users/[id]` - Delete user (admin only)

### Testing
- `GET /api/test-db` - Test database connection

## 🎯 Next Steps

1. **Run the setup**:
   ```bash
   npm run seed-admin
   npm run dev
   ```

2. **Test admin login**:
   - Go to `http://localhost:3000/auth/login`
   - Use: `alpsingh03@gmail.com` / `Aa2275aA`

3. **Test user registration**:
   - Go to `http://localhost:3000/auth/register`
   - Complete the signup flow

4. **Verify dashboards**:
   - Admin: `http://localhost:3000/admin`
   - User: `http://localhost:3000/dashboard`

---

**🎉 Your database authentication system is ready!**
