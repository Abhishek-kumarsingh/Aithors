import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CLAUDE_API_KEY;
    console.log('Claude API Key exists:', apiKey ? 'Yes' : 'No');
    console.log('API key length:', apiKey?.length);
    console.log('API key first 4 chars:', apiKey?.substring(0, 4));
    console.log('API key last 4 chars:', apiKey?.substring(apiKey.length - 4));

    // Check if API key is defined
    if (!apiKey) {
      console.error('Claude API key not found in environment variables');
      return NextResponse.json(
        {
          error: 'API key not configured',
          message: 'Please add your Claude API key to the .env file.'
        },
        { status: 500 }
      );
    }

    console.log("Sending prompt to Claude API:", prompt);

    // Call Claude API
    const apiUrl = 'https://api.anthropic.com/v1/messages';
    console.log(`Using API URL: ${apiUrl}`);

    const response = await fetch(
      apiUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-sonnet-20240229",
          max_tokens: 2048,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      let errorData;
      let errorText;

      try {
        // Try to get the response as JSON first
        errorData = await response.json();
        console.error("Claude API error (JSON):", errorData);
      } catch (e) {
        // If response is not JSON, get the text
        try {
          errorText = await response.text();
          console.error("Claude API error (text):", errorText);
          errorData = { message: errorText || 'Failed to parse error response' };
        } catch (textError) {
          console.error("Failed to read error response:", textError);
          errorData = { message: `Error with status ${response.status}` };
        }
      }

      // Extract the specific error message if available
      const errorMessage =
        errorData?.error?.message ||
        errorData?.message ||
        errorText ||
        `API error with status ${response.status}`;

      return NextResponse.json(
        {
          error: 'Claude API error',
          message: errorMessage,
          details: errorData
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) {
      console.error('Unexpected Claude API response format:', data);
      return NextResponse.json(
        {
          error: 'Unexpected response format',
          message: 'The Claude API returned an unexpected response format',
          details: data
        },
        { status: 500 }
      );
    }

    console.log('Claude API response received successfully');

    // Return a simplified response format
    return NextResponse.json({
      text,
      model: 'claude-3-sonnet-20240229',
      originalResponse: data
    });
  } catch (error: any) {
    console.error('Error in Claude API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}