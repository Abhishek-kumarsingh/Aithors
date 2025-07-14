import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import InterviewModel from '@/lib/models/Interview';

// POST - Generate questions for interview
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
    const { interviewId, type, difficulty, setupMethod, count = 10 } = body;

    if (!interviewId || !type || !difficulty) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Get interview details
    const interview = await InterviewModel.findById(interviewId);
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    // Generate questions based on type and difficulty
    const questions = await generateQuestions(type, difficulty, count, interview);

    // Update interview with generated questions
    interview.questions = questions;
    await interview.save();

    return NextResponse.json({
      success: true,
      message: 'Questions generated successfully',
      questions
    });

  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Generate questions based on interview parameters
async function generateQuestions(type: string, difficulty: string, count: number, interview: any) {
  const questions = [];

  // Question distribution based on type
  let mcqCount = 0;
  let subjectiveCount = 0;
  let codingCount = 0;
  let bugFixCount = 0;

  switch (type) {
    case 'technical':
      mcqCount = Math.floor(count * 0.4); // 40%
      subjectiveCount = Math.floor(count * 0.3); // 30%
      codingCount = Math.floor(count * 0.3); // 30%
      break;
    case 'behavioral':
      subjectiveCount = count; // 100%
      break;
    case 'coding':
      codingCount = Math.floor(count * 0.7); // 70%
      bugFixCount = Math.floor(count * 0.3); // 30%
      break;
    case 'system-design':
      subjectiveCount = count; // 100%
      break;
    case 'mixed':
      mcqCount = Math.floor(count * 0.25); // 25%
      subjectiveCount = Math.floor(count * 0.25); // 25%
      codingCount = Math.floor(count * 0.35); // 35%
      bugFixCount = Math.floor(count * 0.15); // 15%
      break;
  }

  // Ensure we have the right total count
  const totalGenerated = mcqCount + subjectiveCount + codingCount + bugFixCount;
  if (totalGenerated < count) {
    mcqCount += count - totalGenerated;
  }

  let questionId = 1;

  // Generate MCQ questions
  for (let i = 0; i < mcqCount; i++) {
    questions.push(generateMCQQuestion(questionId++, difficulty, interview));
  }

  // Generate subjective questions
  for (let i = 0; i < subjectiveCount; i++) {
    questions.push(generateSubjectiveQuestion(questionId++, difficulty, type, interview));
  }

  // Generate coding questions
  for (let i = 0; i < codingCount; i++) {
    questions.push(generateCodingQuestion(questionId++, difficulty, interview));
  }

  // Generate bug fix questions
  for (let i = 0; i < bugFixCount; i++) {
    questions.push(generateBugFixQuestion(questionId++, difficulty, interview));
  }

  return questions;
}

// Generate MCQ question
function generateMCQQuestion(id: number, difficulty: string, interview: any) {
  const mcqQuestions = {
    easy: [
      {
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
        correctAnswer: 0
      },
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["String", "Boolean", "Integer", "Undefined"],
        correctAnswer: 2
      },
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlink and Text Markup Language"],
        correctAnswer: 0
      }
    ],
    medium: [
      {
        question: "What is the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n log n)", "O(n²)"],
        correctAnswer: 1
      },
      {
        question: "Which design pattern is used to create objects without specifying their concrete classes?",
        options: ["Singleton", "Factory", "Observer", "Strategy"],
        correctAnswer: 1
      },
      {
        question: "In React, what is the purpose of useEffect hook?",
        options: ["State management", "Side effects", "Component rendering", "Event handling"],
        correctAnswer: 1
      }
    ],
    hard: [
      {
        question: "What is the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 2
      },
      {
        question: "Which of the following is true about database ACID properties?",
        options: ["Atomicity ensures all operations succeed", "Consistency maintains data integrity", "Isolation allows concurrent access", "Durability ensures temporary storage"],
        correctAnswer: 1
      }
    ]
  };

  const questionPool = mcqQuestions[difficulty as keyof typeof mcqQuestions] || mcqQuestions.easy;
  const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  return {
    id: id.toString(),
    type: 'mcq',
    question: selectedQuestion.question,
    options: selectedQuestion.options,
    correctAnswer: selectedQuestion.correctAnswer,
    timeSpent: 0
  };
}

// Generate subjective question
function generateSubjectiveQuestion(id: number, difficulty: string, type: string, interview: any) {
  const subjectiveQuestions = {
    technical: {
      easy: [
        "Explain the difference between let, const, and var in JavaScript.",
        "What is the purpose of CSS and how does it work with HTML?",
        "Describe what a function is in programming and why it's useful."
      ],
      medium: [
        "Explain the concept of closures in JavaScript with an example.",
        "Describe the differences between SQL and NoSQL databases.",
        "What is the MVC architecture pattern and how does it work?"
      ],
      hard: [
        "Explain the CAP theorem and its implications for distributed systems.",
        "Describe the differences between microservices and monolithic architecture.",
        "Explain how garbage collection works in modern programming languages."
      ]
    },
    behavioral: {
      easy: [
        "Tell me about a time when you had to learn a new technology quickly.",
        "Describe a challenging project you worked on and how you overcame obstacles.",
        "How do you handle working under pressure and tight deadlines?"
      ],
      medium: [
        "Describe a situation where you had to work with a difficult team member.",
        "Tell me about a time when you had to make a decision with incomplete information.",
        "How do you approach debugging a complex problem?"
      ],
      hard: [
        "Describe a time when you had to lead a technical decision that was controversial.",
        "Tell me about a project where you had to balance technical debt with new features.",
        "How would you handle a situation where your team is consistently missing deadlines?"
      ]
    }
  };

  const questionType = type === 'behavioral' ? 'behavioral' : 'technical';
  const questionPool = subjectiveQuestions[questionType][difficulty as keyof typeof subjectiveQuestions.technical] || 
                     subjectiveQuestions.technical.easy;
  
  const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  return {
    id: id.toString(),
    type: 'subjective',
    question: selectedQuestion,
    timeSpent: 0
  };
}

// Generate coding question
function generateCodingQuestion(id: number, difficulty: string, interview: any) {
  const codingQuestions = {
    easy: [
      {
        question: "Write a function that returns the sum of two numbers.",
        description: "Create a function called 'add' that takes two parameters and returns their sum."
      },
      {
        question: "Write a function to check if a number is even or odd.",
        description: "Create a function that returns true if the number is even, false if odd."
      },
      {
        question: "Write a function to reverse a string.",
        description: "Create a function that takes a string and returns it reversed."
      }
    ],
    medium: [
      {
        question: "Implement a function to find the maximum element in an array.",
        description: "Write a function that takes an array of numbers and returns the largest number."
      },
      {
        question: "Write a function to check if a string is a palindrome.",
        description: "Create a function that returns true if the string reads the same forwards and backwards."
      },
      {
        question: "Implement a function to count the frequency of each character in a string.",
        description: "Return an object/map with characters as keys and their frequencies as values."
      }
    ],
    hard: [
      {
        question: "Implement a function to find the longest common subsequence of two strings.",
        description: "Use dynamic programming to find the length of the longest common subsequence."
      },
      {
        question: "Write a function to solve the coin change problem.",
        description: "Given coins of different denominations and a target amount, find the minimum number of coins needed."
      },
      {
        question: "Implement a function to detect a cycle in a linked list.",
        description: "Use Floyd's cycle detection algorithm to determine if a linked list has a cycle."
      }
    ]
  };

  const questionPool = codingQuestions[difficulty as keyof typeof codingQuestions] || codingQuestions.easy;
  const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  return {
    id: id.toString(),
    type: 'coding',
    question: `${selectedQuestion.question}\n\n${selectedQuestion.description}`,
    timeSpent: 0
  };
}

// Generate bug fix question
function generateBugFixQuestion(id: number, difficulty: string, interview: any) {
  const bugFixQuestions = {
    easy: [
      {
        question: "Fix the bug in this function that should return the factorial of a number:",
        buggyCode: `function factorial(n) {
    if (n = 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`
      }
    ],
    medium: [
      {
        question: "Fix the bug in this binary search implementation:",
        buggyCode: `function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length;
    
    while (left < right) {
        let mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid;
        } else {
            right = mid - 1;
        }
    }
    return -1;
}`
      }
    ],
    hard: [
      {
        question: "Fix the memory leak in this React component:",
        buggyCode: `function Timer() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCount(count + 1);
        }, 1000);
    }, []);
    
    return <div>{count}</div>;
}`
      }
    ]
  };

  const questionPool = bugFixQuestions[difficulty as keyof typeof bugFixQuestions] || bugFixQuestions.easy;
  const selectedQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];

  return {
    id: id.toString(),
    type: 'bug-fix',
    question: selectedQuestion.question,
    buggyCode: selectedQuestion.buggyCode,
    timeSpent: 0
  };
}
