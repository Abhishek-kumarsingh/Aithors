import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check environment variables
    const envCheck = {
      gemini: !!process.env.GEMINI_API_KEY,
      deepseek: !!process.env.DEEPSEEK_API_KEY,
      claude: !!process.env.ANTHROPIC_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
    };

    // Test a simple Gemini API call
    let geminiTest = null;
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: 'Hello, respond with "AI is working!" if you can see this message.' }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 100,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          geminiTest = {
            success: true,
            response: data.candidates[0].content.parts[0].text
          };
        } else {
          geminiTest = {
            success: false,
            error: `HTTP ${response.status}: ${response.statusText}`
          };
        }
      } catch (error) {
        geminiTest = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }

    return NextResponse.json({
      success: true,
      message: 'AI API test completed',
      environmentVariables: envCheck,
      geminiTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to test AI APIs',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Simple test response using Gemini
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `You are a helpful AI assistant. Please respond to: ${message}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({
          success: true,
          response: data.candidates[0].content.parts[0].text,
          provider: 'gemini',
          timestamp: new Date().toISOString()
        });
      } else {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }
    }

    // Fallback response if no API keys available
    return NextResponse.json({
      success: true,
      response: `I received your message: "${message}". However, I'm currently in test mode. Please check the API configuration.`,
      provider: 'fallback',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('AI chat test error:', error);
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
