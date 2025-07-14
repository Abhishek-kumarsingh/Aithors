import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'info';

    if (action === 'redirect') {
      // Create a direct Google OAuth URL
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/google`;
      
      if (!clientId) {
        return NextResponse.json({
          error: 'Google Client ID not configured'
        }, { status: 500 });
      }

      const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      googleAuthUrl.searchParams.set('client_id', clientId);
      googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
      googleAuthUrl.searchParams.set('response_type', 'code');
      googleAuthUrl.searchParams.set('scope', 'openid email profile');
      googleAuthUrl.searchParams.set('state', 'test-direct-oauth');
      googleAuthUrl.searchParams.set('prompt', 'consent');
      googleAuthUrl.searchParams.set('access_type', 'offline');

      // Redirect to Google OAuth
      return NextResponse.redirect(googleAuthUrl.toString());
    }

    // Default: return info about the Google OAuth configuration
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    
    return NextResponse.json({
      status: 'Google OAuth Direct Test',
      configuration: {
        clientId: clientId ? `${clientId.substring(0, 10)}...` : 'NOT_SET',
        nextAuthUrl: nextAuthUrl || 'NOT_SET',
        expectedRedirectUri: `${nextAuthUrl}/api/auth/callback/google`,
        testRedirectUrl: `${nextAuthUrl}/api/test-google-direct?action=redirect`
      },
      instructions: {
        step1: 'Visit /api/test-google-direct?action=redirect to test direct Google OAuth',
        step2: 'This will bypass NextAuth and go directly to Google',
        step3: 'If this works, the issue is with NextAuth configuration',
        step4: 'If this fails, the issue is with Google Cloud Console setup'
      },
      googleCloudConsoleCheck: {
        authorizedJavaScriptOrigins: [nextAuthUrl],
        authorizedRedirectUris: [`${nextAuthUrl}/api/auth/callback/google`],
        note: 'Make sure these URLs are added to your Google OAuth app'
      }
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Direct Google OAuth test failed',
      details: String(error)
    }, { status: 500 });
  }
}
