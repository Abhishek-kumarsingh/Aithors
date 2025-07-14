# Aithor API Testing Guide

This document provides instructions on how to test the Aithor API endpoints to verify that both backend and frontend API connections are working correctly.

## Available Testing Methods

There are three ways to test the Aithor API:

1. **Browser-based Test Page** - A user-friendly visual interface
2. **Command-line Test Script** - For terminal-based testing
3. **JavaScript Test Module** - For programmatic testing in your code

## 1. Browser-based Test Page

The browser-based test page provides a visual interface to test API endpoints and view the results.

### How to Use

1. Start your Aithor application:
   ```
   npm run dev
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/api-test.html
   ```

3. Click the "Run API Tests" button to start testing all endpoints.

4. View the results for each endpoint, including:
   - Success/failure status
   - HTTP status code
   - Response data (can be toggled)
   - Authentication requirements

### Understanding the Results

- **Green (SUCCESS)**: The endpoint is accessible and returned a successful response
- **Yellow (AUTH REQUIRED)**: The endpoint requires authentication (expected for protected endpoints)
- **Red (FAILED)**: The endpoint could not be reached or returned an error

## 2. Command-line Test Script

The command-line script allows you to test API endpoints directly from your terminal.

### How to Use

1. Make sure your Aithor application is running:
   ```
   npm run dev
   ```

2. Open a new terminal window and run:
   ```
   node scripts/test-api-cli.js
   ```

3. The script will test all endpoints and display the results in the terminal.

### Options

You can specify a custom base URL by setting the `API_BASE_URL` environment variable:

```
API_BASE_URL=https://your-deployment-url.com node scripts/test-api-cli.js
```

## 3. JavaScript Test Module

The JavaScript module can be imported and used in your own code for programmatic testing.

### How to Use

```javascript
const apiTester = require('./scripts/test-api-cli');

async function runMyTests() {
  // Test all endpoints
  const results = await apiTester.runTests();
  console.log(results.summary);
  
  // Or test a specific endpoint
  const singleResult = await apiTester.testEndpoint({
    name: 'Custom Endpoint',
    path: '/api/my-custom-endpoint'
  });
  console.log(singleResult);
}

runMyTests();
```

## Tested Endpoints

The following API endpoints are tested by default:

1. **API Health Check** - `/api/test`
2. **Candidates** - `/api/candidates`
3. **Interviews** - `/api/interviews`
4. **Analytics Overview** - `/api/analytics/overview`
5. **Analytics Domains** - `/api/analytics/domains`
6. **Analytics Feedback Themes** - `/api/analytics/feedback-themes`
7. **Recent Completed Interviews** - `/api/analytics/recent-completed-interviews`
8. **Init Tasks** - `/api/init-tasks`

## Troubleshooting

### Authentication Errors (401)

Many endpoints require authentication. This is expected behavior and will show as "AUTH REQUIRED" in the test results. To test these endpoints with authentication:

1. Log in to the application in your browser
2. Run the browser-based test while logged in

### Connection Errors

If you see connection errors:

1. Verify that your Aithor application is running
2. Check that you're using the correct base URL
3. Ensure there are no network issues or firewalls blocking the connections
4. Check the server logs for any backend errors

### Timeout Errors

If requests are timing out:

1. The server might be overloaded
2. The endpoint might be performing a long-running operation
3. There might be a deadlock or infinite loop in the API handler

## Extending the Tests

To add more endpoints to test, you can modify:

- `public/api-test.html` - For the browser-based test
- `scripts/test-api-cli.js` - For the command-line test
- `scripts/api-test.js` - For the JavaScript module

Find the endpoint lists in each file and add your new endpoints following the existing pattern.