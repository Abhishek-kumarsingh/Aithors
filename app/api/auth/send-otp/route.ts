import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { otpStorage } from '@/lib/otp-storage';

// Rate limiting storage
const rateLimitStorage = new Map<string, { count: number; resetTime: number }>();

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

// Generate 6-digit OTP
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

// Rate limiting check
const checkRateLimit = (email: string): boolean => {
  const now = Date.now();
  const rateLimit = rateLimitStorage.get(email);
  
  if (!rateLimit || now > rateLimit.resetTime) {
    // Reset or create new rate limit
    rateLimitStorage.set(email, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15 minutes
    return true;
  }
  
  if (rateLimit.count >= 5) {
    return false; // Too many attempts
  }
  
  rateLimit.count++;
  return true;
};

// Email template
const getEmailTemplate = (otp: string, name?: string) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification - AI Interview Platform</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); padding: 40px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 20px; }
        .otp-box { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border: 2px solid #a855f7; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0; }
        .otp-code { font-size: 36px; font-weight: 700; color: #a855f7; letter-spacing: 8px; margin: 10px 0; }
        .footer { background-color: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
        .button { display: inline-block; background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 AI Interview Platform</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Email Verification Required</p>
        </div>
        <div class="content">
          <h2 style="color: #1e293b; margin-bottom: 20px;">Hello${name ? ` ${name}` : ''}! 👋</h2>
          <p style="color: #64748b; font-size: 16px; line-height: 1.6;">
            Welcome to AI Interview Platform! To complete your registration, please verify your email address using the code below:
          </p>
          
          <div class="otp-box">
            <p style="margin: 0 0 10px 0; color: #64748b; font-weight: 600;">Your Verification Code</p>
            <div class="otp-code">${otp}</div>
            <p style="margin: 10px 0 0 0; color: #64748b; font-size: 14px;">This code expires in 10 minutes</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            If you didn't request this verification, please ignore this email. Your account will not be created without verification.
          </p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Security Note:</strong> Never share this code with anyone. Our team will never ask for your verification code.
            </p>
          </div>
        </div>
        <div class="footer">
          <p style="margin: 0;">© ${new Date().getFullYear()} AI Interview Platform. All rights reserved.</p>
          <p style="margin: 10px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again in 15 minutes.' },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStorage.set(email, { code: otp, expires, attempts: 0 });

    console.log(`🔐 OTP for ${email}: ${otp}`);

    // Send email
    try {
      // Check if email configuration is available
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS ||
          process.env.SMTP_USER === 'your-email@gmail.com') {
        throw new Error('Email configuration not set up');
      }

      const transporter = createTransporter();

      // Verify transporter first
      await transporter.verify();

      await transporter.sendMail({
        from: `"AI Interview Platform" <${process.env.SMTP_USER}>`,
        to: email,
        subject: '🔐 Your Email Verification Code - AI Interview Platform',
        html: getEmailTemplate(otp, name),
      });

      console.log(`📧 Email verification code sent to ${email}`);

      return NextResponse.json({
        success: true,
        message: 'OTP sent to your email successfully',
        debug: process.env.NODE_ENV === 'development' ? {
          otp,
          note: 'Email sent + OTP shown for development'
        } : undefined
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);

      // Fallback - return OTP for testing when email fails
      console.log(`🔐 OTP for ${email}: ${otp} (Email failed, using console fallback)`);

      return NextResponse.json({
        success: true,
        message: 'OTP generated (email configuration needed)',
        debug: {
          otp,
          error: 'Email not configured - check SMTP settings',
          note: 'Using console fallback for development'
        }
      });
    }

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


