import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import UserModel from '@/lib/models/User';

// GET - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    const user = await UserModel.findOne({ email: session.user.email })
      .select('-password -twoFactorSecret -twoFactorBackupCodes')
      .lean() as any;

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        profile: user.profile || {},
        performance: user.performance || {},
        interviewPreferences: user.interviewPreferences || {},
        preferences: user.preferences || {},
        createdAt: user.createdAt,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { profile, interviewPreferences, preferences } = body;

    await connectToMongoDB();

    const updateData: any = {};
    
    if (profile) {
      updateData.profile = profile;
    }
    
    if (interviewPreferences) {
      updateData.interviewPreferences = interviewPreferences;
    }
    
    if (preferences) {
      updateData.preferences = preferences;
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -twoFactorSecret -twoFactorBackupCodes');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        profile: updatedUser.profile || {},
        performance: updatedUser.performance || {},
        interviewPreferences: updatedUser.interviewPreferences || {},
        preferences: updatedUser.preferences || {}
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update specific profile fields
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { field, value } = body;

    if (!field) {
      return NextResponse.json(
        { error: 'Field is required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const updateData: any = {};
    updateData[field] = value;

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password -twoFactorSecret -twoFactorBackupCodes');

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${field} updated successfully`,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role,
        profile: updatedUser.profile || {},
        performance: updatedUser.performance || {},
        interviewPreferences: updatedUser.interviewPreferences || {},
        preferences: updatedUser.preferences || {}
      }
    });

  } catch (error) {
    console.error('Error updating user profile field:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
