# Claude API Integration

This document explains how the Claude API has been integrated into the application.

## Setup

1. The Claude API key has been added to the `.env` file:
   ```
   CLAUDE_API_KEY=your_claude_api_key_here
   ```

2. The Next.js configuration (`next.config.js`) has been updated to:
   - Remove the static export option to enable API routes
   - Make the API key available to the server-side code

3. A new API route has been created at `app/api/claude/route.ts` to handle requests to the Claude API

4. The Claude assistant component has been implemented at `components/enhanced-claude-chat.tsx` and integrated into the dashboard at `app/dashboard/claude-assistant/page.tsx`

## Usage

### API Endpoint

You can make POST requests to `/api/claude` with the following structure:

```json
{
  "prompt": "Your prompt text here"
}
```

The API will return the response from the Claude API.

### Claude Assistant Component

The Claude Assistant is accessible from the dashboard navigation where you can:
1. Enter a prompt
2. Submit it to the Claude API
3. View the response with markdown and code syntax highlighting
4. Provide feedback on responses (thumbs up/down)

## Example API Call

```javascript
const response = await fetch('/api/claude', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ prompt: 'Explain how AI works' }),
});

const data = await response.json();
// The response text is in data.text
```

## Direct API Call (for reference)

You can also call the Claude API directly using the following curl command:

```bash
curl "https://api.anthropic.com/v1/messages" \
-H 'Content-Type: application/json' \
-H 'x-api-key: YOUR_API_KEY' \
-H 'anthropic-version: 2023-06-01' \
-X POST \
-d '{
  "model": "claude-3-sonnet-20240229",
  "max_tokens": 2048,
  "messages": [{
    "role": "user",
    "content": "Explain how AI works"
  }]
}'
```

## Response Format

The Claude API returns responses in the following format:

```json
{
  "text": "The response text from Claude",
  "model": "claude-3-sonnet-20240229",
  "originalResponse": {
    // The full response object from the Claude API
  }
}
```

## Security Considerations

- The API key is stored in the `.env` file, which should not be committed to version control
- All API calls are made server-side to avoid exposing the API key to clients
- The implementation uses proper error handling and logging for debugging purposes
- The API route includes validation to ensure required parameters are provided

## Features

- Uses Claude 3 Sonnet model for high-quality responses
- Supports markdown rendering in responses
- Includes code syntax highlighting for multiple programming languages
- Provides message feedback functionality (thumbs up/down)
- Maintains chat history within sessions