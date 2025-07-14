import { NextRequest, NextResponse } from 'next/server';
import { otpStorage } from '../send-otp/route';

// Maximum verification attempts
const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Get stored OTP data
    const storedData = otpStorage.get(email);

    if (!storedData) {
      return NextResponse.json(
        { error: 'No OTP found for this email. Please request a new one.' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expires) {
      otpStorage.delete(email);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check attempt limit
    if (storedData.attempts >= MAX_ATTEMPTS) {
      otpStorage.delete(email);
      return NextResponse.json(
        { error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.code !== otp.toString()) {
      storedData.attempts++;
      
      const remainingAttempts = MAX_ATTEMPTS - storedData.attempts;
      
      if (remainingAttempts === 0) {
        otpStorage.delete(email);
        return NextResponse.json(
          { error: 'Invalid OTP. Maximum attempts exceeded. Please request a new OTP.' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { 
          error: `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining.`,
          remainingAttempts 
        },
        { status: 400 }
      );
    }

    // OTP is valid - remove from storage
    otpStorage.delete(email);

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check OTP status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const storedData = otpStorage.get(email);

    if (!storedData) {
      return NextResponse.json({
        exists: false,
        message: 'No OTP found for this email'
      });
    }

    const isExpired = Date.now() > storedData.expires;
    const timeRemaining = Math.max(0, storedData.expires - Date.now());

    return NextResponse.json({
      exists: true,
      expired: isExpired,
      timeRemaining: Math.floor(timeRemaining / 1000), // in seconds
      attempts: storedData.attempts,
      maxAttempts: MAX_ATTEMPTS
    });

  } catch (error) {
    console.error('Check OTP status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
