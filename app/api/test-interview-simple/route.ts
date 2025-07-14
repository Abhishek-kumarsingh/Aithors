import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Simple test endpoint for interview functionality
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock interview data for testing
    const mockInterviews = [
      {
        id: "1",
        title: "Frontend Developer Interview",
        type: "technical",
        status: "completed",
        difficulty: "medium",
        duration: 45,
        results: {
          score: 85,
          accuracy: 78,
          totalQuestions: 10,
          correctAnswers: 8
        },
        createdAt: new Date().toISOString()
      },
      {
        id: "2", 
        title: "React Developer Assessment",
        type: "coding",
        status: "in-progress",
        difficulty: "hard",
        duration: 60,
        createdAt: new Date(Date.now() - 86400000).toISOString() // Yesterday
      },
      {
        id: "3",
        title: "Behavioral Interview",
        type: "behavioral", 
        status: "pending",
        difficulty: "easy",
        duration: 30,
        createdAt: new Date(Date.now() - 172800000).toISOString() // 2 days ago
      }
    ];

    return NextResponse.json({
      success: true,
      interviews: mockInterviews,
      total: mockInterviews.length,
      user: session.user.email
    });

  } catch (error) {
    console.error('Test interview API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch test interviews',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create a new interview
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, difficulty, duration, title } = await request.json();

    // Mock interview creation
    const newInterview = {
      id: Date.now().toString(),
      title: title || `${type} Interview`,
      type,
      difficulty,
      duration: duration || 30,
      status: "pending",
      createdAt: new Date().toISOString(),
      userId: session.user.email
    };

    return NextResponse.json({
      success: true,
      interview: newInterview,
      message: "Interview created successfully"
    });

  } catch (error) {
    console.error('Create interview error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create interview',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
