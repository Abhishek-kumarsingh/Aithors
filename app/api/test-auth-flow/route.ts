import { NextRequest, NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otp-storage';

export async function POST(request: NextRequest) {
  try {
    const { action, email, otp } = await request.json();

    if (action === 'send-otp') {
      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store OTP
      otpStorage.set(email, {
        code: otpCode,
        expires,
        attempts: 0
      });

      console.log(`🔐 Test OTP for ${email}: ${otpCode}`);
      
      return NextResponse.json({
        success: true,
        message: 'OTP generated successfully',
        debug: { 
          otp: otpCode,
          email,
          expires: new Date(expires).toISOString()
        }
      });
    }

    if (action === 'verify-otp') {
      const storedData = otpStorage.get(email);

      if (!storedData) {
        return NextResponse.json({
          success: false,
          error: 'No OTP found for this email'
        }, { status: 404 });
      }

      if (Date.now() > storedData.expires) {
        otpStorage.delete(email);
        return NextResponse.json({
          success: false,
          error: 'OTP has expired'
        }, { status: 400 });
      }

      if (storedData.code !== otp) {
        storedData.attempts++;
        return NextResponse.json({
          success: false,
          error: 'Invalid OTP',
          attempts: storedData.attempts
        }, { status: 400 });
      }

      // Success - remove OTP
      otpStorage.delete(email);
      return NextResponse.json({
        success: true,
        message: 'OTP verified successfully'
      });
    }

    if (action === 'check-storage') {
      const allOtps = Array.from(otpStorage.entries()).map(([email, data]) => ({
        email,
        code: data.code,
        expires: new Date(data.expires).toISOString(),
        attempts: data.attempts,
        isExpired: Date.now() > data.expires
      }));

      return NextResponse.json({
        success: true,
        storage: allOtps,
        count: otpStorage.size
      });
    }

    return NextResponse.json({
      error: 'Invalid action. Use: send-otp, verify-otp, or check-storage'
    }, { status: 400 });

  } catch (error) {
    console.error('Test auth flow error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auth flow test endpoint',
    actions: ['send-otp', 'verify-otp', 'check-storage'],
    usage: {
      'send-otp': 'POST { "action": "send-otp", "email": "test@example.com" }',
      'verify-otp': 'POST { "action": "verify-otp", "email": "test@example.com", "otp": "123456" }',
      'check-storage': 'POST { "action": "check-storage" }'
    }
  });
}
