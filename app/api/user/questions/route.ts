import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { connectToMongoDB } from '@/lib/mongodb';
import QuestionModel from '@/lib/models/Question';
import UserModel from '@/lib/models/User';

// GET - Fetch questions for practice
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const domain = searchParams.get('domain');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query for public and verified questions
    const query: any = {
      isPublic: true,
      isVerified: true
    };

    if (domain) query.domain = domain;
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;

    // Add text search if provided
    if (search) {
      query.$text = { $search: search };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get questions with pagination
    const questions = await QuestionModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name')
      .lean();

    const totalCount = await QuestionModel.countDocuments(query);

    // Get filter options for frontend
    const domains = await QuestionModel.distinct('domain', { isPublic: true, isVerified: true });
    const categories = await QuestionModel.distinct('category', { isPublic: true, isVerified: true });

    return NextResponse.json({
      success: true,
      questions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      },
      filters: {
        domains,
        categories,
        types: ['mcq', 'subjective', 'coding', 'bug-fix'],
        difficulties: ['easy', 'medium', 'hard']
      }
    });

  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new question (for community contribution)
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
    const {
      title,
      description,
      type,
      difficulty,
      domain,
      category,
      tags,
      content,
      codingDetails,
      bugFixDetails
    } = body;

    // Validation
    if (!title || !description || !type || !difficulty || !domain || !category || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (type === 'coding' && !codingDetails) {
      return NextResponse.json(
        { error: 'Coding details are required for coding questions' },
        { status: 400 }
      );
    }

    if (type === 'bug-fix' && !bugFixDetails) {
      return NextResponse.json(
        { error: 'Bug fix details are required for bug fix questions' },
        { status: 400 }
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

    // Create new question
    const newQuestion = new QuestionModel({
      title,
      description,
      type,
      difficulty,
      domain,
      category,
      tags: tags || [],
      content,
      codingDetails: type === 'coding' ? codingDetails : undefined,
      bugFixDetails: type === 'bug-fix' ? bugFixDetails : undefined,
      author: user._id,
      isPublic: true,
      isVerified: false, // Needs admin verification
      stats: {
        totalAttempts: 0,
        correctAttempts: 0,
        averageTime: 0,
        successRate: 0,
        rating: 0,
        ratingCount: 0
      },
      likes: 0,
      dislikes: 0,
      reports: 0
    });

    const savedQuestion = await newQuestion.save();

    return NextResponse.json({
      success: true,
      message: 'Question submitted successfully. It will be reviewed before being published.',
      question: savedQuestion
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update question stats (for practice attempts)
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questionId, action, data } = body;

    if (!questionId || !action) {
      return NextResponse.json(
        { error: 'Question ID and action are required' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    const question = await QuestionModel.findById(questionId);
    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'attempt':
        question.stats.totalAttempts += 1;
        if (data.isCorrect) {
          question.stats.correctAttempts += 1;
        }
        question.stats.successRate = (question.stats.correctAttempts / question.stats.totalAttempts) * 100;
        
        // Update average time
        const totalTime = question.stats.averageTime * (question.stats.totalAttempts - 1) + data.timeSpent;
        question.stats.averageTime = totalTime / question.stats.totalAttempts;
        break;

      case 'rate':
        if (data.rating < 1 || data.rating > 5) {
          return NextResponse.json(
            { error: 'Rating must be between 1 and 5' },
            { status: 400 }
          );
        }
        
        const totalRating = question.stats.rating * question.stats.ratingCount + data.rating;
        question.stats.ratingCount += 1;
        question.stats.rating = totalRating / question.stats.ratingCount;
        break;

      case 'like':
        question.likes += 1;
        break;

      case 'dislike':
        question.dislikes += 1;
        break;

      case 'report':
        question.reports += 1;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    await question.save();

    return NextResponse.json({
      success: true,
      message: 'Question updated successfully',
      stats: question.stats
    });

  } catch (error) {
    console.error('Error updating question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
