import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// POST - Send message to AI and get response
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { sessionId, message, messages = [] } = body;

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and session ID are required' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Try different AI providers in order of preference
    let response = '';
    let model = '';
    let tokens = 0;

    try {
      // Try Gemini first
      const geminiResponse = await callGeminiAPI(message, messages);
      if (geminiResponse.success && geminiResponse.response) {
        response = geminiResponse.response;
        model = geminiResponse.model || 'gemini-pro';
        tokens = geminiResponse.tokens || 0;
      } else {
        throw new Error('Gemini API failed');
      }
    } catch (geminiError) {
      console.log('Gemini failed, trying DeepSeek:', geminiError);
      
      try {
        // Fallback to DeepSeek
        const deepseekResponse = await callDeepSeekAPI(message, messages);
        if (deepseekResponse.success && deepseekResponse.response) {
          response = deepseekResponse.response;
          model = deepseekResponse.model || 'deepseek-chat';
          tokens = deepseekResponse.tokens || 0;
        } else {
          throw new Error('DeepSeek API failed');
        }
      } catch (deepseekError) {
        console.log('DeepSeek failed, using fallback:', deepseekError);
        
        // Final fallback - simple response
        response = generateFallbackResponse(message);
        model = 'fallback';
        tokens = response.length;
      }
    }

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      response,
      model,
      tokens,
      responseTime,
      sessionId
    });

  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Call Gemini API
async function callGeminiAPI(message: string, messages: any[]) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Prepare conversation history for Gemini
    const conversationHistory = messages.slice(-10).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    // Add current message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_HATE_SPEECH',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {
              category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
              threshold: 'BLOCK_MEDIUM_AND_ABOVE'
            }
          ]
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const responseText = data.candidates[0].content.parts[0].text;
      const tokens = data.usageMetadata?.totalTokenCount || responseText.length;
      
      return {
        success: true,
        response: responseText,
        model: 'gemini-1.5-flash',
        tokens
      };
    } else {
      throw new Error('Invalid response from Gemini API');
    }

  } catch (error) {
    console.error('Gemini API error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Call DeepSeek API
async function callDeepSeekAPI(message: string, messages: any[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DeepSeek API key not configured');
  }

  try {
    // Prepare conversation history for DeepSeek (OpenAI format)
    const conversationHistory = [
      {
        role: 'system',
        content: 'You are a helpful AI assistant specialized in programming, technical interviews, and software development. Provide clear, accurate, and helpful responses.'
      },
      ...messages.slice(-10),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 2048,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const responseText = data.choices[0].message.content;
      const tokens = data.usage?.total_tokens || responseText.length;
      
      return {
        success: true,
        response: responseText,
        model: 'deepseek-chat',
        tokens
      };
    } else {
      throw new Error('Invalid response from DeepSeek API');
    }

  } catch (error) {
    console.error('DeepSeek API error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Generate fallback response when APIs are unavailable
function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Programming-related responses
  if (lowerMessage.includes('react') || lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
    return `I'd be happy to help with React/JavaScript! While I'm currently running in fallback mode, I can still provide some guidance:

**React Best Practices:**
- Use functional components with hooks
- Keep components small and focused
- Use proper state management (useState, useReducer, or external libraries)
- Implement proper error boundaries
- Follow the principle of composition over inheritance

**Common JavaScript Concepts:**
- Closures and scope
- Promises and async/await
- Event handling and DOM manipulation
- ES6+ features (arrow functions, destructuring, modules)

For more detailed help, please try again in a moment when our AI services are fully available.`;
  }
  
  if (lowerMessage.includes('interview') || lowerMessage.includes('coding')) {
    return `Great question about technical interviews! Here are some key tips:

**Technical Interview Preparation:**
1. **Data Structures & Algorithms**: Focus on arrays, linked lists, trees, graphs, and common algorithms
2. **System Design**: Understand scalability, load balancing, databases, and caching
3. **Coding Practice**: Use platforms like LeetCode, HackerRank, or CodeSignal
4. **Communication**: Explain your thought process clearly
5. **Ask Questions**: Clarify requirements before coding

**Common Interview Topics:**
- Time and space complexity analysis
- Database design and SQL queries
- API design and REST principles
- Testing strategies and debugging

I'm currently in fallback mode, but feel free to ask more specific questions when our full AI services are restored!`;
  }
  
  if (lowerMessage.includes('python') || lowerMessage.includes('algorithm')) {
    return `Python is excellent for algorithms and data structures! Here's a quick overview:

**Python for Algorithms:**
- Clean, readable syntax perfect for interviews
- Rich standard library with useful data structures
- Built-in functions like sorted(), enumerate(), zip()
- List comprehensions for concise code

**Key Data Structures in Python:**
- Lists: Dynamic arrays with O(1) append
- Dictionaries: Hash tables with O(1) average lookup
- Sets: For unique elements and fast membership testing
- Collections module: deque, Counter, defaultdict

**Algorithm Patterns:**
- Two pointers technique
- Sliding window
- Dynamic programming
- Recursion with memoization

I'm in fallback mode right now, but I'd love to help with specific algorithm questions when our full AI services are back online!`;
  }
  
  // General helpful response
  return `Thank you for your question! I'm currently running in fallback mode while our AI services are temporarily unavailable.

I'm designed to help with:
- Programming and software development
- Technical interview preparation
- Code review and debugging
- System design concepts
- Best practices and architecture

**Popular Topics I Can Help With:**
- JavaScript/TypeScript and React development
- Python programming and data science
- Database design and SQL
- API development and system architecture
- Algorithm and data structure problems
- DevOps and deployment strategies

Please try asking your question again in a few moments when our full AI capabilities are restored. I'll be able to provide much more detailed and personalized assistance!

Is there a specific programming topic or technical concept you'd like to discuss?`;
}
