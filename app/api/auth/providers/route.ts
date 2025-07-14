import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth-config';

export async function GET() {
  try {
    const providers = authOptions.providers?.map(provider => {
      if ('id' in provider) {
        return {
          id: provider.id,
          name: provider.name,
          type: provider.type,
          signinUrl: `/api/auth/signin/${provider.id}`,
          callbackUrl: `/api/auth/callback/${provider.id}`
        };
      }
      return null;
    }).filter(Boolean) || [];

    return NextResponse.json(providers);
  } catch (error) {
    console.error('Providers error:', error);
    return NextResponse.json(
      { error: 'Failed to get providers' },
      { status: 500 }
    );
  }
}
