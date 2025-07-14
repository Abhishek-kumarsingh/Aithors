import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get the session from NextAuth
    const session = await getServerSession(authOptions);
    
    // Return the session data (or null if not authenticated)
    return NextResponse.json(session);
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Failed to check session" },
      { status: 500 }
    );
  }
}