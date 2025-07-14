import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserModel, InterviewModel, ChatSessionModel } from '../lib/models/schema-design';

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/aithor';

/**
 * Seed the database with initial data
 */
async function seedDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('Clearing existing data...');
    await UserModel.deleteMany({});
    await InterviewModel.deleteMany({});
    await ChatSessionModel.deleteMany({});
    console.log('Existing data cleared');

    // Create admin user
    console.log('Creating admin user...');
    const adminPassword = 'admin123'; // Change this in production
    const adminSalt = await bcrypt.genSalt(10);
    const adminHashedPassword = await bcrypt.hash(adminPassword, adminSalt);

    const adminUser = await UserModel.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminHashedPassword,
      role: 'admin',
      registeredAt: new Date(),
    });

    // Create regular user
    console.log('Creating regular user...');
    const userPassword = 'user123'; // Change this in production
    const userSalt = await bcrypt.genSalt(10);
    const userHashedPassword = await bcrypt.hash(userPassword, userSalt);

    const regularUser = await UserModel.create({
      name: 'Regular User',
      email: 'user@example.com',
      password: userHashedPassword,
      role: 'user',
      registeredAt: new Date(),
    });

    // Create sample interviews for the regular user
    console.log('Creating sample interviews...');
    const frontendInterview = await InterviewModel.create({
      userId: regularUser._id,
      stream: 'Frontend Development',
      questions: [
        {
          question: 'Explain the difference between let, const, and var in JavaScript.',
          generatedAt: new Date(),
          response: 'Let and const were introduced in ES6. Var is function-scoped, while let and const are block-scoped. Const cannot be reassigned after declaration.',
          score: 85
        },
        {
          question: 'What is the virtual DOM in React and why is it used?',
          generatedAt: new Date(),
          response: 'The virtual DOM is a lightweight copy of the actual DOM. React uses it to improve performance by minimizing direct DOM manipulation.',
          score: 90
        },
        {
          question: 'Describe the CSS Box Model.',
          generatedAt: new Date(),
          response: 'The CSS Box Model consists of content, padding, border, and margin. It defines how elements are rendered on the page.',
          score: 80
        }
      ],
      startedAt: new Date(Date.now() - 7200000), // 2 hours ago
      endedAt: new Date(Date.now() - 5400000), // 1.5 hours ago
      resultSummary: {
        strengths: [
          'Strong understanding of modern JavaScript',
          'Good knowledge of React concepts',
          'Solid CSS fundamentals'
        ],
        weaknesses: [
          'Could improve on advanced CSS techniques',
          'More examples would strengthen answers'
        ],
        feedback: 'Overall, the candidate demonstrated good knowledge of frontend development concepts. They have a strong foundation in JavaScript and React, but could benefit from more practice with advanced CSS techniques.'
      }
    });

    const backendInterview = await InterviewModel.create({
      userId: regularUser._id,
      stream: 'Backend Development',
      questions: [
        {
          question: 'Explain RESTful API design principles.',
          generatedAt: new Date(),
          response: 'REST APIs use HTTP methods like GET, POST, PUT, DELETE. They are stateless, cacheable, and follow a client-server architecture with a uniform interface.',
          score: 95
        },
        {
          question: 'What is database normalization?',
          generatedAt: new Date(),
          response: 'Database normalization is the process of structuring a database to reduce data redundancy and improve data integrity. It involves organizing fields and tables to minimize dependency.',
          score: 85
        },
        {
          question: 'Describe the differences between SQL and NoSQL databases.',
          generatedAt: new Date(),
          response: 'SQL databases are relational with structured schemas, while NoSQL databases are non-relational and offer flexible schemas. SQL uses tables with rows and columns, while NoSQL can use documents, key-value pairs, graphs, etc.',
          score: 90
        }
      ],
      startedAt: new Date(Date.now() - 3600000), // 1 hour ago
      endedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      resultSummary: {
        strengths: [
          'Excellent understanding of API design',
          'Good database knowledge',
          'Clear communication of technical concepts'
        ],
        weaknesses: [
          'Could go deeper on database optimization',
          'More specific examples would be helpful'
        ],
        feedback: 'The candidate shows strong backend development skills, particularly in API design. They have a good grasp of database concepts but could benefit from more experience with optimization techniques.'
      }
    });

    // Create an in-progress interview
    const inProgressInterview = await InterviewModel.create({
      userId: regularUser._id,
      stream: 'Full Stack Development',
      questions: [
        {
          question: 'Explain how you would structure a full-stack application.',
          generatedAt: new Date(),
          response: 'I would separate the frontend and backend concerns. For the frontend, I would use React with a state management solution like Redux. For the backend, I would create a RESTful API using Node.js and Express, with MongoDB for data storage.',
          score: 88
        },
        {
          question: 'How do you handle authentication in a full-stack application?',
          generatedAt: new Date(),
          response: 'I typically use JWT (JSON Web Tokens) for authentication. The server validates credentials and issues a token, which the client stores and sends with subsequent requests. The server verifies the token before processing protected requests.',
          score: 92
        },
        {
          question: 'Describe your approach to testing in a full-stack application.',
          generatedAt: new Date()
          // No response yet - in progress
        }
      ],
      startedAt: new Date(Date.now() - 1800000), // 30 minutes ago
      interrupted: true
    });

    // Update user with interview references
    regularUser.interviewHistory = [
      frontendInterview._id,
      backendInterview._id,
      inProgressInterview._id
    ];
    await regularUser.save();

    // Create sample chat sessions
    console.log('Creating sample chat sessions...');
    const resumeHelpChat = await ChatSessionModel.create({
      userId: regularUser._id,
      startedAt: new Date(Date.now() - 86400000), // 1 day ago
      endedAt: new Date(Date.now() - 82800000), // 23 hours ago
      contextTags: ['resume', 'career advice'],
      messages: [
        {
          role: 'user',
          content: 'Can you help me improve my resume for a frontend developer position?',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          role: 'assistant',
          content: 'I\'d be happy to help! Please share your current resume or tell me about your experience and skills, and I can provide specific suggestions for improvement.',
          timestamp: new Date(Date.now() - 86390000)
        },
        {
          role: 'user',
          content: 'I have 2 years of experience with React and JavaScript. I\'ve worked on 3 major projects...',
          timestamp: new Date(Date.now() - 86380000)
        },
        {
          role: 'assistant',
          content: 'Based on your experience, here are some suggestions to improve your resume:\n\n1. Highlight your React projects with specific metrics\n2. Include any state management experience (Redux, Context API)\n3. Mention any testing frameworks you\'ve used\n4. Add a skills section with all relevant technologies\n5. Consider adding a brief summary statement at the top',
          timestamp: new Date(Date.now() - 86370000)
        }
      ],
      isActive: false
    });

    const interviewPrepChat = await ChatSessionModel.create({
      userId: regularUser._id,
      startedAt: new Date(Date.now() - 43200000), // 12 hours ago
      contextTags: ['interview preparation', 'frontend'],
      messages: [
        {
          role: 'user',
          content: 'I have a frontend developer interview tomorrow. What should I prepare for?',
          timestamp: new Date(Date.now() - 43200000)
        },
        {
          role: 'assistant',
          content: 'For a frontend developer interview, you should be prepared to discuss:\n\n1. JavaScript fundamentals (closures, promises, async/await)\n2. React concepts (components, hooks, state management)\n3. CSS layout techniques (flexbox, grid)\n4. Browser rendering and performance optimization\n5. Common algorithms and data structures\n\nWould you like me to provide sample questions for any of these areas?',
          timestamp: new Date(Date.now() - 43190000)
        },
        {
          role: 'user',
          content: 'Yes, please give me some sample React questions.',
          timestamp: new Date(Date.now() - 43180000)
        },
        {
          role: 'assistant',
          content: 'Here are some common React interview questions:\n\n1. What is the virtual DOM and how does it work?\n2. Explain the component lifecycle in React.\n3. What are hooks in React and why were they introduced?\n4. How do you handle state management in React?\n5. What is the difference between controlled and uncontrolled components?\n6. How do you optimize performance in a React application?\n7. Explain the concept of lifting state up.\n8. How do you handle side effects in React components?\n\nWould you like me to provide answers to any of these questions?',
          timestamp: new Date(Date.now() - 43170000)
        }
      ],
      isActive: true
    });

    // Update user with chat session references
    regularUser.chatSessions = [resumeHelpChat._id, interviewPrepChat._id];
    await regularUser.save();

    console.log('Database seeded successfully!');
    console.log('\nSample credentials:');
    console.log('Admin: admin@example.com / admin123');
    console.log('User: user@example.com / user123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();