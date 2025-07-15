# Coding Layout Guide - 80/20 Split-Screen Implementation

This document describes the implementation of the 80/20 split-screen layout for coding interview questions and question bank coding problems.

## Overview

The 80/20 split-screen layout provides an optimal coding experience by dedicating 80% of the screen width to the Monaco code editor and 20% to the question/problem statement panel. This layout is implemented across multiple components in the InterviewAI platform.

## Implementation Details

### Components Modified

1. **`components/interview/QuestionDisplay.tsx`**
   - Updated to use the new 80/20 split layout for coding and bug-fix questions
   - Replaced complex inline layout with shared `CodingLayout` component

2. **`app/dashboard/practice/[id]/page.tsx`**
   - Modified to handle coding questions with full-width layout
   - Non-coding questions maintain the original sidebar layout
   - Coding questions use the 80/20 split layout from `QuestionDisplay`

3. **`app/dashboard/code-environment/page.tsx`** (New)
   - Standalone code environment page with 80/20 split layout
   - Professional coding environment with multi-language support
   - Real-time code execution and performance metrics

4. **`components/shared/CodingLayout.tsx`** (New)
   - Reusable component implementing the 80/20 split layout
   - Configurable for different use cases
   - Consistent design across all coding interfaces

5. **`components/user-dashboard/TopNavigation.tsx`**
   - Added "Code Editor" navigation item
   - Links to the new code environment page

## Layout Structure

### Desktop Layout (md and above)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                Header/Navigation                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────┐  ┌─────────────────────────┐  │
│  │                                             │  │                         │  │
│  │              Code Editor                    │  │    Problem Statement    │  │
│  │                (80%)                        │  │         (20%)           │  │
│  │                                             │  │                         │  │
│  │  ┌─────────────────────────────────────┐    │  │  ┌─────────────────────┐ │  │
│  │  │         Language Selector           │    │  │  │     Question        │ │  │
│  │  └─────────────────────────────────────┘    │  │  │     Content         │ │  │
│  │                                             │  │  │                     │ │  │
│  │  ┌─────────────────────────────────────┐    │  │  │  ┌─────────────────┐ │ │  │
│  │  │                                     │    │  │  │  │   Instructions  │ │ │  │
│  │  │         Monaco Editor               │    │  │  │  │                 │ │ │  │
│  │  │                                     │    │  │  │  │   • Write code  │ │ │  │
│  │  │                                     │    │  │  │  │   • Run tests   │ │ │  │
│  │  │                                     │    │  │  │  │   • Submit      │ │ │  │
│  │  │                                     │    │  │  │  └─────────────────┘ │ │  │
│  │  └─────────────────────────────────────┘    │  │  └─────────────────────┘ │  │
│  │                                             │  │                         │  │
│  │  ┌─────────────────────────────────────┐    │  │                         │  │
│  │  │    [Run Code]  [Reset]  [Save]      │    │  │                         │  │
│  │  └─────────────────────────────────────┘    │  │                         │  │
│  │                                             │  │                         │  │
│  │  ┌─────────────────────────────────────┐    │  │                         │  │
│  │  │           Output Panel              │    │  │                         │  │
│  │  └─────────────────────────────────────┘    │  │                         │  │
│  └─────────────────────────────────────────────┘  └─────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (xs to sm)
```
┌─────────────────────────────────────────┐
│            Header/Navigation            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │        Problem Statement            │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │         Question Content        │ │ │
│  │  │                                 │ │ │
│  │  │  ┌─────────────────────────────┐ │ │ │
│  │  │  │       Instructions          │ │ │ │
│  │  │  └─────────────────────────────┘ │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └─────────────────────────────────────┘ │
│                                         │
│  ┌─────────────────────────────────────┐ │
│  │           Code Editor               │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │       Language Selector         │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │                                 │ │ │
│  │  │        Monaco Editor            │ │ │
│  │  │                                 │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │   [Run Code]  [Reset]  [Save]   │ │ │
│  │  └─────────────────────────────────┘ │ │
│  │                                     │ │
│  │  ┌─────────────────────────────────┐ │ │
│  │  │        Output Panel             │ │ │
│  │  └─────────────────────────────────┘ │ │
│  └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

## Features

### Code Editor (Left Side - 80%)
- **Monaco Editor Integration**: Full-featured code editor with syntax highlighting
- **Multi-language Support**: JavaScript, TypeScript, Python, Java, C++, Go, Rust
- **Language Selector**: Dropdown to switch between programming languages
- **Code Actions**: Run, Reset, Save buttons
- **Output Display**: Real-time code execution results
- **Editor Features**:
  - Syntax highlighting
  - Auto-completion
  - Error detection
  - Code formatting
  - Line numbers
  - Bracket matching
  - Word wrapping
  - Code folding

### Question Panel (Right Side - 20%)
- **Problem Statement**: Clear display of the coding question
- **Instructions**: Step-by-step guidance for solving the problem
- **Buggy Code Display**: For bug-fix questions, shows the problematic code
- **Language Indicator**: Shows currently selected programming language
- **Scrollable Content**: Handles long problem statements gracefully

## Responsive Design

### Desktop (md and above)
- 80/20 horizontal split layout
- Fixed height of 70vh for optimal viewing
- Side-by-side panels for efficient screen usage

### Mobile (xs to sm)
- Vertical stacking layout
- Question panel appears above code editor
- Maintains full functionality on smaller screens
- Adaptive heights for mobile viewing

## Usage Examples

### Interview Questions
```typescript
<QuestionDisplay
  question={{
    id: "coding-1",
    type: "coding",
    question: "Implement a function to reverse a string",
    // ... other props
  }}
  onAnswerSubmit={handleSubmit}
  isRecording={false}
  onRecordingChange={() => {}}
  isPaused={false}
/>
```

### Practice Sessions
The practice page automatically detects coding questions and applies the 80/20 layout:
- Coding questions: Full-width 80/20 split layout
- Non-coding questions: Original sidebar layout with action panel

### Standalone Code Environment
Access via navigation: Dashboard → Code Editor
- Professional coding environment
- Multi-language templates
- Real-time execution
- Performance metrics
- Code export/import functionality

## Configuration Options

The `CodingLayout` component accepts various props for customization:

```typescript
interface CodingLayoutProps {
  // Code editor configuration
  code: string;
  onCodeChange: (code: string) => void;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  
  // Question configuration
  questionContent: string;
  questionType?: 'coding' | 'bug-fix';
  buggyCode?: string;
  
  // Execution configuration
  onExecuteCode: () => void;
  isExecuting: boolean;
  codeOutput?: string;
  
  // Customization options
  height?: string; // Default: '70vh'
  editorTheme?: string; // Default: 'vs-dark'
  showInstructions?: boolean; // Default: true
  customInstructions?: string[];
}
```

## Benefits

1. **Optimal Screen Usage**: 80/20 split maximizes coding space while keeping problem statement visible
2. **Consistent Experience**: Same layout across interviews, practice, and standalone coding
3. **Mobile Responsive**: Adapts gracefully to different screen sizes
4. **Professional Feel**: Monaco editor provides IDE-like experience
5. **Reusable Component**: Shared `CodingLayout` ensures consistency and maintainability

## Future Enhancements

- **Split Pane Resizing**: Allow users to adjust the 80/20 ratio
- **Multiple Test Cases**: Display test cases in the question panel
- **Code Collaboration**: Real-time collaborative editing
- **Performance Metrics**: Display execution time and memory usage
- **Code Templates**: Pre-built templates for different problem types
- **Syntax Themes**: Multiple editor themes for user preference
