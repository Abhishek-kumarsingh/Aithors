import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Test bug fixing question generation
    const bugFixQuestion = {
      id: 'test-bug-fix-1',
      type: 'bug-fix',
      question: 'Fix the bug in this React component that causes infinite re-renders:',
      difficulty: 'medium',
      domain: 'Frontend Development',
      buggyCode: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(count + 1);
  }, [count]); // Bug: dependency causes infinite loop
  
  return <div>Count: {count}</div>;
}`,
      fixedCode: `function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    setCount(prevCount => prevCount + 1);
  }, []); // Fix: remove dependency or use functional update
  
  return <div>Count: {count}</div>;
}`,
      bugDescription: 'The useEffect has count in its dependency array, which causes it to run every time count changes, creating an infinite loop.',
      language: 'javascript',
      timeSpent: 0
    };

    const codingQuestion = {
      id: 'test-coding-1',
      type: 'coding',
      question: 'Write a function that finds the two numbers in an array that add up to a target sum.',
      difficulty: 'medium',
      domain: 'Algorithms',
      starterCode: `function twoSum(nums, target) {
  // Write your solution here
  
}`,
      solution: `function twoSum(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
      testCases: [
        {
          input: '[2, 7, 11, 15], 9',
          expectedOutput: '[0, 1]',
          isHidden: false
        },
        {
          input: '[3, 2, 4], 6',
          expectedOutput: '[1, 2]',
          isHidden: false
        }
      ],
      language: 'javascript',
      timeSpent: 0
    };

    return NextResponse.json({
      success: true,
      message: 'Test questions generated successfully',
      questions: {
        bugFix: bugFixQuestion,
        coding: codingQuestion
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test interview error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate test questions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
