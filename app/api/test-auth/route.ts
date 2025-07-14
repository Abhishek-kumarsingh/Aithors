import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import connectToDatabase from '@/lib/mongodb';
import UserModel from '@/lib/models/User';

export async function GET(request: NextRequest) {
  try {
    // Test session
    const session = await getServerSession(authOptions);
    
    // Test database connection
    await connectToDatabase();
    
    // Get user count
    const userCount = await UserModel.countDocuments();
    
    // Get admin user
    const adminUser = await UserModel.findOne({ email: 'alpsingh03@gmail.com' });
    
    return NextResponse.json({
      success: true,
      session: session,
      database: {
        connected: true,
        userCount: userCount,
        adminExists: !!adminUser,
        adminRole: adminUser?.role
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
        hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
        hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
        hasNextauthSecret: !!process.env.NEXTAUTH_SECRET
      }
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }
    
    // Test database connection
    await connectToDatabase();
    
    // Find user
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Test password comparison
    const isValidPassword = await user.comparePassword(password);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      },
      passwordValid: isValidPassword,
      message: isValidPassword ? 'Authentication successful' : 'Invalid password'
    });
    
  } catch (error) {
    console.error('Test auth POST error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
