import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-config";
import connectToDatabase from "@/lib/mongodb";
import EnhancedChatSessionModel from "@/lib/models/EnhancedChatSession";

// Multiple AI providers configuration
const AI_PROVIDERS = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    endpoint: 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  },
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY,
    endpoint: 'https://api.deepseek.com/v1/chat/completions',
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    endpoint: 'https://api.anthropic.com/v1/messages',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    endpoint: 'https://api.openai.com/v1/chat/completions',
  },
};

// System prompts for different categories
const SYSTEM_PROMPTS = {
  general: "You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions.",
  interview_prep: "You are an expert interview coach. Help users prepare for technical interviews with detailed explanations, practice questions, and career advice. Focus on programming concepts, system design, and interview strategies.",
  coding_help: "You are a senior software engineer and coding mentor. Help users with programming problems, code review, debugging, and best practices. Provide clear explanations and working code examples.",
  career_advice: "You are an experienced career counselor in the tech industry. Provide guidance on career development, job searching, skill building, and professional growth in technology fields.",
  technical_questions: "You are a technical expert. Answer complex technical questions with detailed explanations, examples, and practical applications. Cover topics like algorithms, data structures, system design, and software engineering principles.",
};

async function callGeminiAPI(messages: any[], systemPrompt: string) {
  const response = await fetch(`${AI_PROVIDERS.gemini.endpoint}?key=${AI_PROVIDERS.gemini.apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: systemPrompt + '\n\n' + messages.map(m => `${m.role}: ${m.content}`).join('\n') }]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.candidates[0].content.parts[0].text,
    tokens: data.usageMetadata?.totalTokenCount || 0,
  };
}

async function callDeepSeekAPI(messages: any[], systemPrompt: string) {
  const response = await fetch(AI_PROVIDERS.deepseek.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_PROVIDERS.deepseek.apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
  };
}

async function callClaudeAPI(messages: any[], systemPrompt: string) {
  const response = await fetch(AI_PROVIDERS.claude.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_PROVIDERS.claude.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 2048,
      system: systemPrompt,
      messages: messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.content[0].text,
    tokens: data.usage?.input_tokens + data.usage?.output_tokens || 0,
  };
}

async function callOpenAIAPI(messages: any[], systemPrompt: string) {
  const response = await fetch(AI_PROVIDERS.openai.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AI_PROVIDERS.openai.apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 2048,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    content: data.choices[0].message.content,
    tokens: data.usage?.total_tokens || 0,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, message, category = 'general', provider = 'gemini' } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find or create chat session
    let chatSession = await EnhancedChatSessionModel.findById(sessionId);
    if (!chatSession) {
      return NextResponse.json({ error: "Chat session not found" }, { status: 404 });
    }

    // Get system prompt for category
    const systemPrompt = SYSTEM_PROMPTS[category as keyof typeof SYSTEM_PROMPTS] || SYSTEM_PROMPTS.general;

    // Prepare messages for AI API
    const messages = chatSession.messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the new user message
    messages.push({ role: 'user', content: message });

    const startTime = Date.now();
    let aiResponse;

    // Call appropriate AI provider
    try {
      switch (provider) {
        case 'gemini':
          aiResponse = await callGeminiAPI(messages, systemPrompt);
          break;
        case 'deepseek':
          aiResponse = await callDeepSeekAPI(messages, systemPrompt);
          break;
        case 'claude':
          aiResponse = await callClaudeAPI(messages, systemPrompt);
          break;
        case 'openai':
          aiResponse = await callOpenAIAPI(messages, systemPrompt);
          break;
        default:
          aiResponse = await callGeminiAPI(messages, systemPrompt);
      }
    } catch (error) {
      console.error(`Error calling ${provider} API:`, error);
      // Fallback to Gemini if primary provider fails
      if (provider !== 'gemini') {
        aiResponse = await callGeminiAPI(messages, systemPrompt);
      } else {
        throw error;
      }
    }

    const responseTime = Date.now() - startTime;

    // Add assistant message to session
    const assistantMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: aiResponse.content,
      timestamp: new Date(),
      metadata: {
        tokens: aiResponse.tokens,
        model: provider === 'gemini' ? 'gemini-pro' : provider === 'deepseek' ? 'deepseek-chat' : provider === 'claude' ? 'claude-3' : 'gpt-4',
        provider,
        cost: calculateCost(provider, aiResponse.tokens),
        responseTime,
      },
    };

    chatSession.messages.push(assistantMessage);
    chatSession.lastActivity = new Date();
    await chatSession.save();

    // Return streaming response for real-time effect
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Simulate streaming by sending chunks
        const words = aiResponse.content.split(' ');
        let index = 0;

        const sendChunk = () => {
          if (index < words.length) {
            const chunk = words.slice(index, index + 3).join(' ') + ' ';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            index += 3;
            setTimeout(sendChunk, 50); // Simulate typing delay
          } else {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
            controller.close();
          }
        };

        sendChunk();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

function calculateCost(provider: string, tokens: number): number {
  // Rough cost estimates (in USD per 1000 tokens)
  const costs = {
    gemini: 0.0005, // Free tier, minimal cost
    deepseek: 0.0014,
    claude: 0.008,
    openai: 0.03,
  };

  return (tokens / 1000) * (costs[provider as keyof typeof costs] || 0);
}
