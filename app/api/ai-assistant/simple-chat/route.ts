import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import { generateChatResponse } from "@/lib/utils/gemini-api";

// Simple AI chat without complex session management
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, category = 'general' } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // System prompts for different categories
    const systemPrompts = {
      general: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses.",
      interview_prep: "You are an expert interview coach. Help with technical interviews, practice questions, and career advice.",
      coding_help: "You are a senior software engineer. Help with programming problems, code review, and debugging.",
      career_advice: "You are an experienced career counselor in tech. Provide guidance on career development and job searching.",
    };

    const systemPrompt = systemPrompts[category as keyof typeof systemPrompts] || systemPrompts.general;

    // Use the new Gemini API utility with load balancing
    try {
      const response = await generateChatResponse(
        [{ role: 'user', content: message }],
        systemPrompt
      );

      return NextResponse.json({
        success: true,
        response: response,
        provider: 'gemini',
        timestamp: new Date().toISOString(),
        tokens: 0 // Token count would be available in the full response
      });

    } catch (error) {
      console.error('Gemini API error:', error);
      // Fall through to fallback response
    }

    // Fallback response when no APIs are available
    const fallbackResponses = {
      general: "I'm here to help! I can assist with interview preparation, coding questions, career advice, and general tech topics. What would you like to know?",
      interview_prep: "I'd love to help you prepare for your interview! I can help with technical questions, behavioral questions, system design, and interview strategies. What specific area would you like to focus on?",
      coding_help: "I can help you with coding problems! Whether it's debugging, algorithm questions, code review, or learning new concepts, I'm here to assist. What coding challenge are you working on?",
      career_advice: "I'm here to help with your career development! I can provide guidance on job searching, skill development, career transitions, and professional growth in tech. What career question do you have?"
    };

    const fallbackResponse = fallbackResponses[category as keyof typeof fallbackResponses] || fallbackResponses.general;

    return NextResponse.json({
      success: true,
      response: `${fallbackResponse}\n\nRegarding your question: "${message}" - I'm currently in demo mode. Please configure AI API keys for full functionality.`,
      provider: 'fallback',
      timestamp: new Date().toISOString(),
      tokens: 0
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
