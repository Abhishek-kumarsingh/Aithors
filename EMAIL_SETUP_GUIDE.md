# 📧 Email Setup Guide for OTP Functionality

## 🎯 Overview
This guide will help you set up Gmail to send OTP emails for user registration and authentication.

## 📋 Prerequisites
- Gmail account
- 2-Factor Authentication enabled on Gmail

## 🔧 Step-by-Step Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Click on **Security** in the left sidebar
3. Under **Signing in to Google**, click **2-Step Verification**
4. Follow the setup process if not already enabled

### Step 2: Generate App Password
1. In Google Account Settings → **Security**
2. Under **Signing in to Google**, click **App passwords**
3. You might need to sign in again
4. Select **Mail** as the app
5. Select **Other (Custom name)** as the device
6. Enter: `AI Interview Platform`
7. Click **Generate**
8. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 3: Update Environment Variables
Edit your `.env.local` file and update these lines:

```env
# Email Configuration (for OTP verification)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=your-16-character-app-password
```

**Example:**
```env
SMTP_USER=john.doe@gmail.com
SMTP_PASS=abcdefghijklmnop
```

### Step 4: Restart the Development Server
```bash
npm run dev
```

## ✅ Testing Email Functionality

### Option 1: Use the Test Page
1. Go to `http://localhost:3000/test-auth`
2. Enter your email address
3. Click "Send OTP"
4. Check your email inbox

### Option 2: Use the Registration Page
1. Go to `http://localhost:3000/auth/register`
2. Fill in your details
3. Click "Send Verification Code"
4. Check your email inbox

## 🔍 Troubleshooting

### Common Issues:

#### "Email configuration not set up"
- Make sure `SMTP_USER` and `SMTP_PASS` are set in `.env.local`
- Restart the development server after changes

#### "Authentication failed"
- Double-check the App Password (16 characters, no spaces)
- Make sure 2-Factor Authentication is enabled
- Try generating a new App Password

#### "Connection refused"
- Check your internet connection
- Verify SMTP settings (host: smtp.gmail.com, port: 587)

#### Email not received
- Check spam/junk folder
- Verify the recipient email address
- Check Gmail's sent folder to confirm email was sent

## 🎨 Email Template Features

The OTP emails include:
- ✅ Professional HTML template
- ✅ Responsive design
- ✅ Security warnings
- ✅ Expiration time (10 minutes)
- ✅ Branded styling

## 🔒 Security Notes

- App passwords are specific to applications
- They bypass 2-factor authentication for the app
- Keep your app password secure
- You can revoke app passwords anytime from Google Account settings

## 📝 Current Behavior

### Development Mode:
- ✅ OTP shown in console/debug response
- ✅ Email sent to recipient (if configured)
- ✅ Fallback to console if email fails

### Production Mode:
- ✅ Email sent to recipient
- ❌ OTP not shown in response
- ✅ Graceful fallback handling

## 🚀 Next Steps

After email setup:
1. Test OTP sending and receiving
2. Test OTP verification
3. Test complete registration flow
4. Test Google OAuth integration
