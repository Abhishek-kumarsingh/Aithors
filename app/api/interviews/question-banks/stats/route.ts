import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectToDatabase from "@/lib/mongodb";

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Return mock data for now since we're using MongoDB
    const mockStats = {
      totalQuestions: 15000,
      countByDomain: {
        "Frontend Development": 3500,
        "Backend Development": 3000,
        "Data Science": 2500,
        "DevOps": 2000,
        "Mobile Development": 2000,
        "System Design": 1500,
        "Behavioral": 500
      },
      recentlyAdded: 150
    };

    return NextResponse.json(mockStats);
  } catch (error) {
    console.error("Error fetching question bank stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch question bank statistics" },
      { status: 500 }
    );
  }
}