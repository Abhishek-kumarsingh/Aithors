import { db } from "@/lib/db";

// Define the interview template type
interface InterviewTemplate {
  id: string;
  title: string;
  description: string;
  domain: string;
  subDomain: string;
  level: string;
  status: string;
  type: string;
  score?: number;
  overallFeedback?: string;
  questions: Array<{
    question: string;
    answer: string;
    feedback: string;
  }>;
}

// Sample interview templates
const sampleInterviewTemplates: Record<string, InterviewTemplate> = {
  "sample-interview-1": {
    id: "sample-interview-1",
    title: "Frontend Developer Interview",
    description: "Technical interview for frontend developer position",
    domain: "frontend",
    subDomain: "react",
    level: "intermediate",
    status: "scheduled",
    type: "technical",
    questions: [
      {
        question: "What is the difference between let, const, and var in JavaScript?",
        answer: "",
        feedback: ""
      },
      {
        question: "Explain how the virtual DOM works in React.",
        answer: "",
        feedback: ""
      },
      {
        question: "What are React hooks and how do they work?",
        answer: "",
        feedback: ""
      },
      {
        question: "Describe the component lifecycle in React.",
        answer: "",
        feedback: ""
      },
      {
        question: "How do you handle state management in a large React application?",
        answer: "",
        feedback: ""
      }
    ]
  },
  "sample-interview-2": {
    id: "sample-interview-2",
    title: "Backend Developer Interview",
    description: "Technical interview for backend developer position",
    domain: "backend",
    subDomain: "nodejs",
    level: "advanced",
    status: "scheduled",
    type: "technical",
    questions: [
      {
        question: "Explain RESTful API design principles.",
        answer: "",
        feedback: ""
      },
      {
        question: "What are the benefits of using a NoSQL database?",
        answer: "",
        feedback: ""
      },
      {
        question: "How do you handle authentication and authorization in Node.js?",
        answer: "",
        feedback: ""
      },
      {
        question: "Explain the event loop in Node.js.",
        answer: "",
        feedback: ""
      },
      {
        question: "How do you optimize database queries for performance?",
        answer: "",
        feedback: ""
      }
    ]
  },
  "sample-interview-3": {
    id: "sample-interview-3",
    title: "Full Stack Developer Interview",
    description: "Technical interview for full stack developer position",
    domain: "fullstack",
    subDomain: "javascript",
    level: "intermediate",
    status: "completed",
    type: "technical",
    score: 85,
    overallFeedback: "Strong candidate with good knowledge of both frontend and backend technologies. Excellent React skills and solid understanding of Node.js. Could improve on database optimization and advanced state management patterns.",
    questions: [
      {
        question: "Describe your approach to building a full stack application.",
        answer: "I would start by designing the database schema, then create RESTful APIs using Node.js and Express, and finally build the frontend using React with proper state management.",
        feedback: "Good comprehensive approach. Shows understanding of the full development lifecycle."
      },
      {
        question: "How do you handle authentication in a full stack application?",
        answer: "I use JWT tokens for authentication, store them securely on the client side, and validate them on the server for protected routes.",
        feedback: "Solid understanding of JWT authentication. Could mention refresh tokens for better security."
      },
      {
        question: "Explain how you would optimize the performance of a web application.",
        answer: "I would implement code splitting, lazy loading, optimize images, use CDN, minimize bundle size, and implement caching strategies.",
        feedback: "Excellent knowledge of performance optimization techniques."
      }
    ]
  }
};

/**
 * Ensures that a sample interview exists in the database
 * If it doesn't exist, creates it using the template
 */
export async function ensureSampleInterview(interviewId: string, userId: string) {
  try {
    // First, try to find the existing interview
    let interview = await db.findInterviewById(interviewId);
    
    if (interview) {
      console.log(`Sample interview ${interviewId} already exists`);
      return interview;
    }

    // If not found, check if we have a template for this interview
    const template = sampleInterviewTemplates[interviewId];

    if (!template) {
      throw new Error(`No template found for sample interview: ${interviewId}`);
    }

    console.log(`Creating sample interview ${interviewId} from template`);

    // Create the interview using the template
    const newInterview = {
      id: template.id,
      title: template.title,
      description: template.description,
      domain: template.domain,
      subDomain: template.subDomain,
      level: template.level,
      status: template.status,
      type: template.type,
      score: template.score || null,
      overallFeedback: template.overallFeedback || null,
      userId: userId,
      questions: template.questions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add the interview to the database
    interview = await db.createInterview(newInterview);
    
    console.log(`Sample interview ${interviewId} created successfully`);
    return interview;
    
  } catch (error) {
    console.error(`Error ensuring sample interview ${interviewId}:`, error);
    throw error;
  }
}

/**
 * Get all available sample interview templates
 */
export function getSampleInterviewTemplates() {
  return Object.values(sampleInterviewTemplates);
}

/**
 * Check if an interview ID is a sample interview
 */
export function isSampleInterview(interviewId: string): boolean {
  return interviewId.startsWith('sample-interview');
}

/**
 * Get a specific sample interview template
 */
export function getSampleInterviewTemplate(interviewId: string): InterviewTemplate | undefined {
  return sampleInterviewTemplates[interviewId];
}
