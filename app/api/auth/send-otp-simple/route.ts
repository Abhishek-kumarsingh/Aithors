import { NextRequest, NextResponse } from 'next/server';
import { otpStorage } from '@/lib/otp-storage';
import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Simple email template
const getSimpleEmailTemplate = (otp: string, name?: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verification - AI Interview Platform</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; }
        .header { text-align: center; margin-bottom: 30px; }
        .otp-box { background: #f8f9fa; border: 2px solid #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 AI Interview Platform</h1>
          <h2>Email Verification</h2>
        </div>
        <p>Hello${name ? ` ${name}` : ''}!</p>
        <p>Your verification code is:</p>
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
          <p>This code expires in 10 minutes</p>
        </div>
        <p>If you didn't request this code, please ignore this email.</p>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    console.log('OTP request received');

    const body = await request.json();
    console.log('Request body:', body);

    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate simple 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + (10 * 60 * 1000); // 10 minutes

    // Store OTP
    otpStorage.set(email, {
      code: otp,
      expires,
      attempts: 0
    });

    console.log(`🔐 OTP for ${email}: ${otp}`);

    // Try to send email
    try {
      // Check if email configuration is available
      if (process.env.SMTP_USER && process.env.SMTP_PASS &&
          process.env.SMTP_USER !== 'your-email@gmail.com') {

        const transporter = createTransporter();
        await transporter.verify();

        await transporter.sendMail({
          from: `"AI Interview Platform" <${process.env.SMTP_USER}>`,
          to: email,
          subject: '🔐 Your Verification Code - AI Interview Platform',
          html: getSimpleEmailTemplate(otp, name),
        });

        console.log(`📧 Email sent to ${email}`);

        return NextResponse.json({
          success: true,
          message: 'OTP sent to your email successfully',
          debug: process.env.NODE_ENV === 'development' ? {
            otp,
            note: 'Email sent + OTP shown for development'
          } : undefined
        });
      } else {
        throw new Error('Email configuration not set up');
      }
    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      // Fallback - return OTP for testing
      return NextResponse.json({
        success: true,
        message: 'OTP generated (email configuration needed)',
        debug: {
          otp,
          note: 'Email not configured - using console fallback',
          error: 'Set up SMTP_USER and SMTP_PASS in .env.local'
        }
      });
    }

  } catch (error) {
    console.error('OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP', details: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'OTP endpoint working' });
}
