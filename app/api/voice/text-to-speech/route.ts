import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Free text-to-speech services
const TTS_PROVIDERS = {
  // Web Speech API (browser-based, free)
  webspeech: {
    name: 'Web Speech API',
    free: true,
    clientSide: true,
  },
  
  // ResponsiveVoice (free tier available)
  responsivevoice: {
    name: 'ResponsiveVoice',
    free: true,
    apiKey: process.env.RESPONSIVEVOICE_API_KEY,
    endpoint: 'https://responsivevoice.org/responsivevoice/getvoice.php',
  },
  
  // FreeTTS (open source)
  freetts: {
    name: 'FreeTTS',
    free: true,
    endpoint: 'https://api.freetts.com/v1/synthesize',
  },
  
  // Google Cloud TTS (has free tier)
  google: {
    name: 'Google Cloud TTS',
    free: false, // Has free tier but requires API key
    apiKey: process.env.GOOGLE_CLOUD_TTS_API_KEY,
    endpoint: 'https://texttospeech.googleapis.com/v1/text:synthesize',
  },
};

// Voice configurations
const VOICE_CONFIGS = {
  english: {
    language: 'en-US',
    voices: [
      { name: 'US English Female', value: 'en-US-Standard-C' },
      { name: 'US English Male', value: 'en-US-Standard-B' },
      { name: 'UK English Female', value: 'en-GB-Standard-A' },
      { name: 'UK English Male', value: 'en-GB-Standard-B' },
    ],
  },
  spanish: {
    language: 'es-ES',
    voices: [
      { name: 'Spanish Female', value: 'es-ES-Standard-A' },
      { name: 'Spanish Male', value: 'es-ES-Standard-B' },
    ],
  },
  french: {
    language: 'fr-FR',
    voices: [
      { name: 'French Female', value: 'fr-FR-Standard-A' },
      { name: 'French Male', value: 'fr-FR-Standard-B' },
    ],
  },
};

async function generateSpeechWithResponsiveVoice(text: string, voice: string = 'UK English Female'): Promise<Buffer> {
  try {
    // ResponsiveVoice free API
    const response = await fetch('https://responsivevoice.org/responsivevoice/getvoice.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        t: text,
        tl: 'en',
        sv: voice,
        vn: '',
        pitch: '0.5',
        rate: '0.5',
        vol: '1',
      }),
    });

    if (!response.ok) {
      throw new Error(`ResponsiveVoice API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  } catch (error) {
    console.error('ResponsiveVoice TTS error:', error);
    throw error;
  }
}

async function generateSpeechWithFreeTTS(text: string, voice: string = 'en'): Promise<Buffer> {
  try {
    // Mock FreeTTS implementation
    // In reality, you would integrate with an actual free TTS service
    
    // For now, return a mock audio buffer
    // This would be replaced with actual TTS service integration
    const mockAudioData = Buffer.from('mock-audio-data');
    return mockAudioData;
  } catch (error) {
    console.error('FreeTTS error:', error);
    throw error;
  }
}

async function generateSpeechWithGoogleTTS(text: string, voice: string = 'en-US-Standard-C'): Promise<Buffer> {
  try {
    if (!TTS_PROVIDERS.google.apiKey) {
      throw new Error('Google Cloud TTS API key not configured');
    }

    const response = await fetch(TTS_PROVIDERS.google.endpoint!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TTS_PROVIDERS.google.apiKey}`,
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: voice.split('-').slice(0, 2).join('-'),
          name: voice,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 1.0,
          pitch: 0.0,
          volumeGainDb: 0.0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Google TTS API error: ${response.statusText}`);
    }

    const data = await response.json();
    return Buffer.from(data.audioContent, 'base64');
  } catch (error) {
    console.error('Google TTS error:', error);
    throw error;
  }
}

// Client-side Web Speech API configuration
function getWebSpeechConfig(text: string, voice: string = 'en-US') {
  return {
    text,
    voice,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    lang: voice,
  };
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, voice = 'en-US-Standard-C', provider = 'webspeech', format = 'mp3' } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Limit text length for free services
    if (text.length > 5000) {
      return NextResponse.json({ error: "Text too long. Maximum 5000 characters allowed." }, { status: 400 });
    }

    // For Web Speech API, return configuration for client-side synthesis
    if (provider === 'webspeech') {
      const config = getWebSpeechConfig(text, voice);
      return NextResponse.json({
        provider: 'webspeech',
        clientSide: true,
        config,
        message: 'Use Web Speech API on client side',
      });
    }

    let audioBuffer: Buffer;

    try {
      switch (provider) {
        case 'responsivevoice':
          audioBuffer = await generateSpeechWithResponsiveVoice(text, voice);
          break;
        case 'freetts':
          audioBuffer = await generateSpeechWithFreeTTS(text, voice);
          break;
        case 'google':
          audioBuffer = await generateSpeechWithGoogleTTS(text, voice);
          break;
        default:
          // Fallback to client-side Web Speech API
          const config = getWebSpeechConfig(text, voice);
          return NextResponse.json({
            provider: 'webspeech',
            clientSide: true,
            config,
            message: 'Fallback to Web Speech API',
          });
      }

      // Return audio file
      return new Response(audioBuffer, {
        headers: {
          'Content-Type': format === 'wav' ? 'audio/wav' : 'audio/mpeg',
          'Content-Length': audioBuffer.length.toString(),
          'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        },
      });

    } catch (providerError) {
      console.error(`TTS provider ${provider} failed:`, providerError);
      
      // Fallback to Web Speech API configuration
      const config = getWebSpeechConfig(text, voice);
      return NextResponse.json({
        provider: 'webspeech',
        clientSide: true,
        config,
        message: 'Provider failed, fallback to Web Speech API',
        error: `${provider} service unavailable`,
      });
    }

  } catch (error) {
    console.error("Error in text-to-speech API:", error);
    return NextResponse.json(
      { error: "Text-to-speech generation failed" },
      { status: 500 }
    );
  }
}

// Get available voices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'english';

    const voices = VOICE_CONFIGS[language as keyof typeof VOICE_CONFIGS] || VOICE_CONFIGS.english;

    return NextResponse.json({
      language: voices.language,
      voices: voices.voices,
      providers: Object.entries(TTS_PROVIDERS).map(([key, provider]) => ({
        id: key,
        name: provider.name,
        free: provider.free,
        clientSide: (provider as any).clientSide || false,
      })),
    });

  } catch (error) {
    console.error("Error getting TTS voices:", error);
    return NextResponse.json(
      { error: "Failed to get available voices" },
      { status: 500 }
    );
  }
}
