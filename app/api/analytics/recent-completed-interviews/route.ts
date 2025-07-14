import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { mockRecentInterviews } from "@/lib/mock-analytics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // For development, return mock data if not authenticated
    if (!session || !session.user) {
      console.log("No authenticated user found, returning mock recent interviews data");
      return NextResponse.json(mockRecentInterviews);
    }

    // Parse query parameters
    const url = new URL(req.url);
    const domain = url.searchParams.get("domain");
    const timeframe = url.searchParams.get("timeframe");
    const limit = parseInt(url.searchParams.get("limit") || "5", 10);

    // Get date range based on timeframe
    const dateRange = getDateRange(timeframe);

    // Fetch completed interviews from our database with filters
    const interviews = await db.findInterviews({
      userId: session.user.id,
      domain: domain || undefined,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      status: "completed",
      limit: limit
    });

    // Format the response
    const recentInterviews = await Promise.all(
      interviews.map(async (interview) => {
        // Get candidate information if available
        const candidate = interview.candidateId
          ? await db.findCandidateById(interview.candidateId)
          : null;

        return {
          id: interview.id,
          title: interview.title,
          candidateName: candidate?.name || "Unknown Candidate",
          candidateRole: candidate?.role || interview.title || "N/A",
          date: interview.updatedAt || interview.createdAt,
          score: interview.score,
          domain: interview.domain,
          difficulty: interview.level
          // Removed avatarUrl since it doesn't exist in the Candidate interface
        };
      })
    );

    return NextResponse.json(recentInterviews);
  } catch (error) {
    console.error("Error fetching recent completed interviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent completed interviews" },
      { status: 500 }
    );
  }
}

// Helper function to get date range based on timeframe
function getDateRange(timeframe: string | null) {
  const now = new Date();
  let startDate = new Date(now);

  switch (timeframe) {
    case "7d":
    case "week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
    case "month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "90d":
    case "quarter":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "365d":
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      // Default to all time
      startDate = new Date(0); // January 1, 1970
  }

  return {
    startDate,
    endDate: now
  };
}