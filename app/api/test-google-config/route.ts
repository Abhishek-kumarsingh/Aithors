import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const config = {
      hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
      hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      googleClientIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
      googleClientSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
      // Show first/last few characters for verification (security safe)
      googleClientIdPreview: process.env.GOOGLE_CLIENT_ID ? 
        `${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...${process.env.GOOGLE_CLIENT_ID.substring(-10)}` : 
        'NOT_SET',
      googleClientSecretPreview: process.env.GOOGLE_CLIENT_SECRET ? 
        `${process.env.GOOGLE_CLIENT_SECRET.substring(0, 6)}...${process.env.GOOGLE_CLIENT_SECRET.substring(-6)}` : 
        'NOT_SET'
    };

    // Check if all required variables are present
    const isConfigured = config.hasGoogleClientId && 
                        config.hasGoogleClientSecret && 
                        config.hasNextAuthSecret;

    return NextResponse.json({
      status: 'Google OAuth Configuration Check',
      configured: isConfigured,
      config,
      issues: [
        !config.hasGoogleClientId && 'Missing GOOGLE_CLIENT_ID',
        !config.hasGoogleClientSecret && 'Missing GOOGLE_CLIENT_SECRET', 
        !config.hasNextAuthSecret && 'Missing NEXTAUTH_SECRET',
        !config.nextAuthUrl && 'Missing NEXTAUTH_URL'
      ].filter(Boolean),
      recommendations: isConfigured ? 
        ['Configuration looks good! Check Google Cloud Console settings.'] :
        ['Set missing environment variables', 'Restart the application']
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Configuration check failed',
      details: String(error)
    }, { status: 500 });
  }
}
