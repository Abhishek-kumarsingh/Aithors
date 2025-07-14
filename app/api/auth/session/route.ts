import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json(session || {});
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({}, { status: 200 }); // Return empty session instead of error
  }
}

export async function POST(request: NextRequest) {
  return GET(request); // Handle POST the same as GET for session
}
