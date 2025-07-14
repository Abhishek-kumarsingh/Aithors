import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToMongoDB } from '@/lib/mongodb';
import PracticeQuestionModel from '@/lib/models/PracticeQuestion';
import UserModel from '@/lib/models/User';

// GET - Fetch practice questions with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const domain = searchParams.get('domain');
    const difficulty = searchParams.get('difficulty');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const companies = searchParams.get('companies')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search');

    await connectToMongoDB();

    // Get user ID
    const user = await UserModel.findOne({ email: session.user.email }).select('_id');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Build query
    const query: any = {};
    
    if (domain && domain !== 'all') {
      query.domain = domain;
    }
    
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (tags.length > 0) {
      query.tags = { $in: tags };
    }
    
    if (companies.length > 0) {
      query.companies = { $in: companies };
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Fetch questions with pagination
    const questions = await PracticeQuestionModel.find(query)
      .sort({ difficulty: 1, title: 1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const totalQuestions = await PracticeQuestionModel.countDocuments(query);

    // Add user-specific data (attempts, bookmarks, etc.)
    const questionsWithUserData = questions.map(question => ({
      ...question,
      attempts: 0, // TODO: Get from user practice sessions
      isBookmarked: false, // TODO: Get from user bookmarks
      lastAttempted: null, // TODO: Get from user practice sessions
      bestScore: null // TODO: Get from user practice sessions
    }));

    return NextResponse.json({
      success: true,
      questions: questionsWithUserData,
      pagination: {
        page,
        limit,
        total: totalQuestions,
        pages: Math.ceil(totalQuestions / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching practice questions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new practice question (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      difficulty,
      domain,
      category,
      tags,
      type,
      timeLimit,
      points,
      content,
      companies,
      skills
    } = body;

    await connectToMongoDB();

    // Create new practice question
    const practiceQuestion = new PracticeQuestionModel({
      title,
      description,
      difficulty,
      domain,
      category,
      tags: tags || [],
      type,
      timeLimit,
      points,
      content,
      companies: companies || [],
      skills: skills || [],
      createdBy: user._id,
      isActive: true,
      stats: {
        totalAttempts: 0,
        successfulAttempts: 0,
        averageScore: 0,
        averageTime: 0
      }
    });

    await practiceQuestion.save();

    return NextResponse.json({
      success: true,
      message: 'Practice question created successfully',
      question: practiceQuestion
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating practice question:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
