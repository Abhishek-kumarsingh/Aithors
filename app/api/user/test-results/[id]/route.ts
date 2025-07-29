import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import TestResultModel from '@/lib/models/TestResult';
import UserModel from '@/lib/models/User';

// GET - Fetch specific test result
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const testResult = await TestResultModel.findOne({
      _id: params.id,
      userId: user._id
    }).lean() as any;

    if (!testResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      );
    }

    // Calculate grade if not present
    if (!testResult.grade) {
      testResult.grade = calculateGrade(testResult.performance.score);
    }

    return NextResponse.json({
      success: true,
      testResult
    });

  } catch (error) {
    console.error('Error fetching test result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to fetch detailed feedback for test result
async function getDetailedFeedback(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const testResult = await TestResultModel.findOne({
      _id: params.id,
      userId: user._id
    }).lean() as any;

    if (!testResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      );
    }

    // Generate detailed feedback if not present
    let detailedFeedback = testResult.feedback;
    
    if (!detailedFeedback || !detailedFeedback.overallFeedback) {
      detailedFeedback = await generateDetailedFeedback(testResult);
    }

    // Generate skill analysis if not present
    let skillAnalysis = testResult.skillAnalysis;
    
    if (!skillAnalysis || Object.keys(skillAnalysis).length === 0) {
      skillAnalysis = generateSkillAnalysis(testResult);
    }

    return NextResponse.json({
      success: true,
      feedback: {
        ...detailedFeedback,
        skillAnalysis,
        questionResults: testResult.questionResults || []
      }
    });

  } catch (error) {
    console.error('Error fetching detailed feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update test result
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const updatedTestResult = await TestResultModel.findOneAndUpdate(
      { _id: params.id, userId: user._id },
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedTestResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test result updated successfully',
      testResult: updatedTestResult
    });

  } catch (error) {
    console.error('Error updating test result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete test result
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const deletedTestResult = await TestResultModel.findOneAndDelete({
      _id: params.id,
      userId: user._id
    });

    if (!deletedTestResult) {
      return NextResponse.json(
        { error: 'Test result not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Test result deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting test result:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to calculate grade
function calculateGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

// Helper function to generate detailed feedback
async function generateDetailedFeedback(testResult: any) {
  const score = testResult.performance.score;
  const accuracy = testResult.performance.accuracy;
  
  let overallFeedback = '';
  let strengths: string[] = [];
  let improvements: string[] = [];
  let recommendations: string[] = [];
  let nextSteps: string[] = [];

  // Generate overall feedback based on performance
  if (score >= 90) {
    overallFeedback = 'Excellent performance! You demonstrate strong mastery of the subject matter and consistently provide accurate answers.';
    strengths = [
      'Exceptional accuracy in answering questions',
      'Strong understanding of core concepts',
      'Efficient problem-solving approach',
      'Consistent high-quality responses'
    ];
    recommendations = [
      'Consider taking on more challenging problems',
      'Share your knowledge by mentoring others',
      'Explore advanced topics in your field'
    ];
  } else if (score >= 80) {
    overallFeedback = 'Good performance! You show solid understanding with room for minor improvements in specific areas.';
    strengths = [
      'Good grasp of fundamental concepts',
      'Consistent performance across topics',
      'Effective problem-solving skills'
    ];
    improvements = [
      'Focus on areas with lower accuracy',
      'Practice more complex problem types',
      'Review concepts that caused confusion'
    ];
    recommendations = [
      'Take practice tests in weaker areas',
      'Study advanced concepts gradually',
      'Join study groups for collaborative learning'
    ];
  } else if (score >= 60) {
    overallFeedback = 'Average performance with clear areas for improvement. Focus on strengthening fundamental concepts.';
    strengths = [
      'Basic understanding of key concepts',
      'Shows potential for improvement'
    ];
    improvements = [
      'Strengthen fundamental knowledge',
      'Improve accuracy in basic concepts',
      'Develop better problem-solving strategies',
      'Increase practice frequency'
    ];
    recommendations = [
      'Review basic concepts thoroughly',
      'Practice with easier problems first',
      'Seek additional learning resources',
      'Consider getting help from tutors'
    ];
  } else {
    overallFeedback = 'Below average performance indicates need for significant improvement in fundamental concepts.';
    improvements = [
      'Review all fundamental concepts',
      'Practice basic problems extensively',
      'Improve understanding of core principles',
      'Develop systematic study approach'
    ];
    recommendations = [
      'Start with basic tutorials and guides',
      'Practice daily with simple problems',
      'Get help from instructors or tutors',
      'Use multiple learning resources'
    ];
  }

  // Generate next steps
  nextSteps = [
    'Review your incorrect answers and understand the mistakes',
    'Practice similar problems to reinforce learning',
    'Focus extra time on your weakest skill areas',
    'Take another practice test to measure improvement',
    'Set specific learning goals for the next week'
  ];

  return {
    overallFeedback,
    strengths,
    improvements,
    recommendations,
    nextSteps
  };
}

// Helper function to generate skill analysis
function generateSkillAnalysis(testResult: any) {
  const skillAnalysis: any = {};
  
  // If we have question results with skill tags, analyze them
  if (testResult.questionResults && testResult.questionResults.length > 0) {
    testResult.questionResults.forEach((question: any) => {
      if (question.skillTags && question.skillTags.length > 0) {
        question.skillTags.forEach((skill: string) => {
          if (!skillAnalysis[skill]) {
            skillAnalysis[skill] = {
              totalQuestions: 0,
              correctAnswers: 0,
              accuracy: 0,
              averageTime: 0
            };
          }
          
          skillAnalysis[skill].totalQuestions += 1;
          if (question.isCorrect) {
            skillAnalysis[skill].correctAnswers += 1;
          }
          skillAnalysis[skill].averageTime += question.timeSpent || 0;
        });
      }
    });
    
    // Calculate final metrics
    Object.keys(skillAnalysis).forEach(skill => {
      const data = skillAnalysis[skill];
      data.accuracy = (data.correctAnswers / data.totalQuestions) * 100;
      data.averageTime = data.averageTime / data.totalQuestions;
    });
  } else {
    // Generate sample skill analysis based on test category
    const category = testResult.testCategory || 'General';
    const score = testResult.performance.score;
    
    // Create sample skills based on category
    const sampleSkills = getSampleSkillsForCategory(category);
    
    sampleSkills.forEach(skill => {
      skillAnalysis[skill] = {
        totalQuestions: Math.floor(Math.random() * 5) + 3, // 3-7 questions
        correctAnswers: 0,
        accuracy: score + (Math.random() * 20 - 10), // ±10% variation
        averageTime: Math.floor(Math.random() * 60) + 30 // 30-90 seconds
      };
      
      skillAnalysis[skill].accuracy = Math.max(0, Math.min(100, skillAnalysis[skill].accuracy));
      skillAnalysis[skill].correctAnswers = Math.round(
        (skillAnalysis[skill].accuracy / 100) * skillAnalysis[skill].totalQuestions
      );
    });
  }
  
  return skillAnalysis;
}

// Helper function to get sample skills for category
function getSampleSkillsForCategory(category: string): string[] {
  const skillMap: { [key: string]: string[] } = {
    'Frontend Development': ['HTML/CSS', 'JavaScript', 'React', 'Responsive Design', 'DOM Manipulation'],
    'Backend Development': ['Node.js', 'Database Design', 'API Development', 'Authentication', 'Server Architecture'],
    'Full Stack Development': ['Frontend Frameworks', 'Backend APIs', 'Database Management', 'DevOps', 'System Design'],
    'Data Structures': ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'],
    'Algorithms': ['Sorting', 'Searching', 'Dynamic Programming', 'Recursion', 'Graph Algorithms'],
    'System Design': ['Scalability', 'Load Balancing', 'Caching', 'Database Design', 'Microservices'],
    'General': ['Problem Solving', 'Logic', 'Programming Concepts', 'Debugging', 'Code Quality']
  };
  
  return skillMap[category] || skillMap['General'];
}
