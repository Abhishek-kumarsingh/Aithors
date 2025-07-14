import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-config';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    
    // Return signin page data
    return NextResponse.json({
      url: `/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`,
      providers: authOptions.providers?.map(provider => {
        if ('id' in provider) {
          return {
            id: provider.id,
            name: provider.name,
            type: provider.type
          };
        }
        return null;
      }).filter(Boolean) || []
    });
  } catch (error) {
    console.error('Signin route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      message: 'Use /api/auth/callback for authentication',
      received: body 
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }
}
