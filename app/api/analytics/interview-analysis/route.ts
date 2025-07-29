import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { db } from "@/lib/db";
import { mockInterviewAnalysis } from "@/lib/mock-analytics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // For development, return mock data if not authenticated
    if (!session || !session.user) {
      console.log("No authenticated user found, returning mock interview analysis data");
      return NextResponse.json(mockInterviewAnalysis);
    }

    // Parse query parameters
    const url = new URL(req.url);
    const interviewId = url.searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { error: "Interview ID is required" },
        { status: 400 }
      );
    }

    // Fetch the interview
    const interview = await db.findInterviewById(interviewId);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    // Check if the interview belongs to the authenticated user
    if (interview.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized access to interview" },
        { status: 403 }
      );
    }

    // Check if the interview is completed and has feedback
    if (interview.status !== "completed" || !interview.overallFeedback) {
      return NextResponse.json(
        { error: "Interview analysis not available" },
        { status: 400 }
      );
    }

    // Extract skill scores from questions if available
    const skillScores = interview.questions
      .filter(q => q.score !== undefined)
      .map(q => ({
        name: q.question.split('?')[0].trim(),
        score: q.score || 0
      }));

    // Analyze the interview feedback
    // This is a simplified version - in a real app, you might use NLP or more sophisticated analysis
    const analysis = {
      overallScore: interview.score || 0,
      summary: interview.overallFeedback,
      strengths: extractStrengths(interview.overallFeedback),
      weaknesses: extractWeaknesses(interview.overallFeedback),
      skillBreakdown: skillScores,
      recommendations: generateRecommendations(interview.overallFeedback, skillScores)
    };

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error analyzing interview:", error);
    return NextResponse.json(
      { error: "Failed to analyze interview" },
      { status: 500 }
    );
  }
}

// Helper function to extract strengths from feedback
function extractStrengths(feedback: string): string[] {
  // This is a simplified implementation
  // In a real app, you might use NLP or more sophisticated analysis
  const strengthKeywords = [
    "strong", "excellent", "impressive", "good", "great", "solid", "proficient", "skilled"
  ];
  
  const sentences = feedback.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const strengths = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return strengthKeywords.some(keyword => lowerSentence.includes(keyword));
  }).map(s => s.trim());
  
  return strengths.length > 0 ? strengths : ["No specific strengths identified"];
}

// Helper function to extract weaknesses from feedback
function extractWeaknesses(feedback: string): string[] {
  // This is a simplified implementation
  // In a real app, you might use NLP or more sophisticated analysis
  const weaknessKeywords = [
    "improve", "lacking", "weak", "needs", "should", "could", "better", "work on"
  ];
  
  const sentences = feedback.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const weaknesses = sentences.filter(sentence => {
    const lowerSentence = sentence.toLowerCase();
    return weaknessKeywords.some(keyword => lowerSentence.includes(keyword));
  }).map(s => s.trim());
  
  return weaknesses.length > 0 ? weaknesses : ["No specific areas for improvement identified"];
}

// Helper function to generate recommendations based on feedback and skill scores
function generateRecommendations(feedback: string, skillScores?: Array<{name: string, score: number}>): string[] {
  // This is a simplified implementation
  // In a real app, you might use more sophisticated analysis or AI
  const recommendations: string[] = [];
  
  // Add general recommendations based on feedback
  if (feedback.toLowerCase().includes("communication")) {
    recommendations.push("Practice explaining technical concepts clearly and concisely.");
  }
  
  if (feedback.toLowerCase().includes("problem solving")) {
    recommendations.push("Work on breaking down complex problems into smaller, manageable parts.");
  }
  
  if (feedback.toLowerCase().includes("algorithm") || feedback.toLowerCase().includes("data structure")) {
    recommendations.push("Review fundamental algorithms and data structures.");
  }
  
  // Add recommendations based on skill scores
  if (skillScores && skillScores.length > 0) {
    const lowestSkill = skillScores.reduce((prev, current) => 
      (prev.score < current.score) ? prev : current
    );
    
    if (lowestSkill.score < 50) {
      recommendations.push(`Focus on improving your ${lowestSkill.name.toLowerCase()} skills.`);
    }
  }
  
  return recommendations.length > 0 ? recommendations : ["Continue practicing and gaining experience in your field."];
}