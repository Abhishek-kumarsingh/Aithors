import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables (safely)
    const envCheck = {
      // Email Configuration
      SMTP_HOST: process.env.SMTP_HOST || 'NOT_SET',
      SMTP_PORT: process.env.SMTP_PORT || 'NOT_SET',
      SMTP_USER: process.env.SMTP_USER ? 
        (process.env.SMTP_USER === 'your-email@gmail.com' ? 'PLACEHOLDER_VALUE' : 'SET') : 'NOT_SET',
      SMTP_PASS: process.env.SMTP_PASS ? 
        (process.env.SMTP_PASS === 'your-app-password' ? 'PLACEHOLDER_VALUE' : 'SET') : 'NOT_SET',
      
      // NextAuth Configuration
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'NOT_SET',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      
      // Google OAuth
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'NOT_SET',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT_SET',
      
      // MongoDB
      MONGODB_URI: process.env.MONGODB_URI ? 'SET' : 'NOT_SET',
      
      // Node Environment
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
    };

    // Check for common issues
    const issues = [];
    
    if (envCheck.SMTP_USER === 'PLACEHOLDER_VALUE') {
      issues.push('SMTP_USER still has placeholder value');
    }
    
    if (envCheck.SMTP_PASS === 'PLACEHOLDER_VALUE') {
      issues.push('SMTP_PASS still has placeholder value');
    }
    
    if (envCheck.NEXTAUTH_SECRET === 'NOT_SET') {
      issues.push('NEXTAUTH_SECRET not set');
    }
    
    if (envCheck.GOOGLE_CLIENT_ID === 'NOT_SET') {
      issues.push('GOOGLE_CLIENT_ID not set');
    }

    // Email configuration status
    const emailConfigured = 
      envCheck.SMTP_USER === 'SET' && 
      envCheck.SMTP_PASS === 'SET' &&
      envCheck.SMTP_HOST !== 'NOT_SET';

    return NextResponse.json({
      status: 'Environment Check',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      issues: issues,
      emailConfigured: emailConfigured,
      recommendations: {
        email: emailConfigured ? 
          'Email configuration looks good' : 
          'Update SMTP_USER and SMTP_PASS in .env.local',
        oauth: envCheck.GOOGLE_CLIENT_ID === 'SET' ? 
          'Google OAuth configuration looks good' : 
          'Check Google OAuth credentials'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Environment check failed',
      details: String(error)
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    
    if (action === 'test-email-config') {
      // Test email configuration without sending
      const emailConfigured = 
        process.env.SMTP_USER && 
        process.env.SMTP_PASS && 
        process.env.SMTP_USER !== 'your-email@gmail.com' &&
        process.env.SMTP_PASS !== 'your-app-password';
        
      return NextResponse.json({
        emailConfigured,
        details: {
          hasUser: !!process.env.SMTP_USER,
          hasPass: !!process.env.SMTP_PASS,
          userIsPlaceholder: process.env.SMTP_USER === 'your-email@gmail.com',
          passIsPlaceholder: process.env.SMTP_PASS === 'your-app-password'
        }
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action'
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      details: String(error)
    }, { status: 500 });
  }
}
