/**
 * Gemini API Utility with Load Balancing
 * Handles multiple API keys and automatic failover
 */

interface GeminiAPIConfig {
  model: string;
  temperature?: number;
  topK?: number;
  topP?: number;
  maxOutputTokens?: number;
}

interface GeminiAPIResponse {
  text: string;
  model: string;
  tokensUsed?: number;
  keyUsed: string;
}

// Get all available Gemini API keys
const getGeminiAPIKeys = (): { name: string; key: string }[] => {
  const keys = [
    { name: 'GEMINI_API_KEY', key: process.env.GEMINI_API_KEY },
    { name: 'GEMINI_API_KEY_2', key: process.env.GEMINI_API_KEY_2 },
    { name: 'GEMINI_API_KEY_3', key: process.env.GEMINI_API_KEY_3 },
    { name: 'GEMINI_API_KEY_4', key: process.env.GEMINI_API_KEY_4 },
    { name: 'GEMINI_API_KEY_5', key: process.env.GEMINI_API_KEY_5 }
  ].filter(item => item.key && item.key.trim() !== '');

  return keys as { name: string; key: string }[];
};

// Default configuration
const DEFAULT_CONFIG: GeminiAPIConfig = {
  model: 'gemini-1.5-flash',
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048
};

// Call Gemini API with a specific key
async function callGeminiWithKey(
  prompt: string,
  apiKey: string,
  keyName: string,
  config: GeminiAPIConfig = DEFAULT_CONFIG
): Promise<GeminiAPIResponse> {
  const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${config.model}:generateContent?key=${apiKey}`;
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: config.temperature,
        topK: config.topK,
        topP: config.topP,
        maxOutputTokens: config.maxOutputTokens,
      }
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error with key ${keyName}: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(`No text response from Gemini API with key ${keyName}`);
  }

  return {
    text,
    model: config.model,
    tokensUsed: data.usageMetadata?.totalTokenCount || 0,
    keyUsed: keyName
  };
}

// Main function with load balancing and failover
export async function callGeminiAPI(
  prompt: string,
  config: Partial<GeminiAPIConfig> = {}
): Promise<GeminiAPIResponse> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const availableKeys = getGeminiAPIKeys();

  if (availableKeys.length === 0) {
    throw new Error('No Gemini API keys available');
  }

  console.log(`Attempting to call Gemini API with ${availableKeys.length} available keys`);

  // Try each key in sequence until one works
  let lastError: Error | null = null;
  
  for (let i = 0; i < availableKeys.length; i++) {
    const { name, key } = availableKeys[i];
    
    try {
      console.log(`Trying Gemini API with key: ${name}`);
      const result = await callGeminiWithKey(prompt, key, name, finalConfig);
      console.log(`✅ Success with key: ${name}`);
      return result;
    } catch (error) {
      console.log(`❌ Failed with key ${name}:`, error instanceof Error ? error.message : error);
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Add delay between retries to avoid rate limiting
      if (i < availableKeys.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // If all keys failed, throw the last error
  throw new Error(`All Gemini API keys failed. Last error: ${lastError?.message || 'Unknown error'}`);
}

// Utility function for simple text generation
export async function generateText(
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  } = {}
): Promise<string> {
  const config: Partial<GeminiAPIConfig> = {
    temperature: options.temperature,
    maxOutputTokens: options.maxTokens,
    model: options.model || 'gemini-1.5-flash'
  };

  const result = await callGeminiAPI(prompt, config);
  return result.text;
}

// Utility function for chat-style conversations
export async function generateChatResponse(
  messages: { role: string; content: string }[],
  systemPrompt?: string
): Promise<string> {
  let prompt = '';
  
  if (systemPrompt) {
    prompt += `System: ${systemPrompt}\n\n`;
  }
  
  prompt += messages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  prompt += '\nAssistant:';

  const result = await callGeminiAPI(prompt);
  return result.text;
}

// Export configuration for external use
export { DEFAULT_CONFIG, getGeminiAPIKeys };
export type { GeminiAPIConfig, GeminiAPIResponse };
