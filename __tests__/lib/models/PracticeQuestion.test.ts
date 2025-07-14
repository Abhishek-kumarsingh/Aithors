import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import PracticeQuestionModel, { IPracticeQuestion } from '../../../lib/models/PracticeQuestion'

describe('PracticeQuestion Model', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  })

  afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(async () => {
    await PracticeQuestionModel.deleteMany({})
  })

  const validQuestionData = {
    title: 'Test Question',
    description: 'A test question for testing',
    type: 'mcq' as const,
    difficulty: 'medium' as const,
    domain: 'frontend',
    subDomain: 'react',
    tags: ['react', 'hooks'],
    content: {
      question: 'What is useState?',
      options: ['A hook', 'A component', 'A method', 'A library'],
      correctAnswer: 0,
    },
    timeLimit: 30,
    points: 10,
    companies: ['Google', 'Facebook'],
    createdBy: new mongoose.Types.ObjectId(),
  }

  describe('Model Creation', () => {
    it('should create a valid practice question', async () => {
      const question = new PracticeQuestionModel(validQuestionData)
      const savedQuestion = await question.save()

      expect(savedQuestion._id).toBeDefined()
      expect(savedQuestion.title).toBe(validQuestionData.title)
      expect(savedQuestion.type).toBe(validQuestionData.type)
      expect(savedQuestion.difficulty).toBe(validQuestionData.difficulty)
      expect(savedQuestion.isActive).toBe(true) // Default value
    })

    it('should require mandatory fields', async () => {
      const question = new PracticeQuestionModel({})
      
      await expect(question.save()).rejects.toThrow()
    })

    it('should validate question type enum', async () => {
      const invalidQuestion = new PracticeQuestionModel({
        ...validQuestionData,
        type: 'invalid-type' as any,
      })

      await expect(invalidQuestion.save()).rejects.toThrow()
    })

    it('should validate difficulty enum', async () => {
      const invalidQuestion = new PracticeQuestionModel({
        ...validQuestionData,
        difficulty: 'invalid-difficulty' as any,
      })

      await expect(invalidQuestion.save()).rejects.toThrow()
    })
  })

  describe('Virtual Properties', () => {
    it('should calculate success rate correctly', async () => {
      const question = new PracticeQuestionModel({
        ...validQuestionData,
        stats: {
          totalAttempts: 10,
          correctAttempts: 7,
          averageTime: 120,
          averageScore: 75,
        },
      })

      await question.save()
      expect(question.successRate).toBe(70)
    })

    it('should return 0 success rate for no attempts', async () => {
      const question = new PracticeQuestionModel(validQuestionData)
      await question.save()
      
      expect(question.successRate).toBe(0)
    })
  })

  describe('Instance Methods', () => {
    it('should update stats correctly', async () => {
      const question = new PracticeQuestionModel(validQuestionData)
      await question.save()

      question.updateStats(true, 150, 90)

      expect(question.stats.totalAttempts).toBe(1)
      expect(question.stats.correctAttempts).toBe(1)
      expect(question.stats.averageTime).toBe(150)
      expect(question.stats.averageScore).toBe(90)
      expect(question.frequency).toBe(1)
      expect(question.stats.lastAttempted).toBeInstanceOf(Date)
    })

    it('should handle incorrect answers in stats', async () => {
      const question = new PracticeQuestionModel(validQuestionData)
      await question.save()

      question.updateStats(false, 120, 40)

      expect(question.stats.totalAttempts).toBe(1)
      expect(question.stats.correctAttempts).toBe(0)
      expect(question.stats.averageTime).toBe(120)
      expect(question.stats.averageScore).toBe(40)
    })

    it('should calculate running averages correctly', async () => {
      const question = new PracticeQuestionModel({
        ...validQuestionData,
        stats: {
          totalAttempts: 2,
          correctAttempts: 1,
          averageTime: 100,
          averageScore: 70,
        },
      })
      await question.save()

      question.updateStats(true, 200, 90)

      expect(question.stats.totalAttempts).toBe(3)
      expect(question.stats.correctAttempts).toBe(2)
      expect(question.stats.averageTime).toBe(133.33333333333334) // (100*2 + 200) / 3
      expect(question.stats.averageScore).toBe(76.66666666666667) // (70*2 + 90) / 3
    })
  })

  describe('Static Methods', () => {
    beforeEach(async () => {
      // Create test questions
      await PracticeQuestionModel.create([
        { ...validQuestionData, domain: 'frontend', difficulty: 'easy' },
        { ...validQuestionData, domain: 'frontend', difficulty: 'medium' },
        { ...validQuestionData, domain: 'backend', difficulty: 'hard' },
        { ...validQuestionData, domain: 'backend', difficulty: 'easy', isActive: false },
      ])
    })

    it('should find questions by domain', async () => {
      const frontendQuestions = await PracticeQuestionModel.findByDomain('frontend')
      expect(frontendQuestions).toHaveLength(2)
      expect(frontendQuestions.every((q: any) => q.domain === 'frontend')).toBe(true)
      expect(frontendQuestions.every((q: any) => q.isActive === true)).toBe(true)
    })

    it('should find questions by domain and difficulty', async () => {
      const easyFrontendQuestions = await PracticeQuestionModel.findByDomain('frontend', 'easy')
      expect(easyFrontendQuestions).toHaveLength(1)
      expect(easyFrontendQuestions[0].domain).toBe('frontend')
      expect(easyFrontendQuestions[0].difficulty).toBe('easy')
    })

    it('should find questions by type', async () => {
      const mcqQuestions = await PracticeQuestionModel.findByType('mcq')
      expect(mcqQuestions).toHaveLength(3) // Only active questions
      expect(mcqQuestions.every((q: any) => q.type === 'mcq')).toBe(true)
      expect(mcqQuestions.every((q: any) => q.isActive === true)).toBe(true)
    })

    it('should get random questions', async () => {
      const randomQuestions = await PracticeQuestionModel.getRandomQuestions(2)
      expect(randomQuestions).toHaveLength(2)
    })

    it('should get random questions with filters', async () => {
      const randomFrontendQuestions = await PracticeQuestionModel.getRandomQuestions(1, {
        domain: 'frontend',
      })
      expect(randomFrontendQuestions).toHaveLength(1)
      expect(randomFrontendQuestions[0].domain).toBe('frontend')
    })
  })

  describe('Indexes', () => {
    it('should have proper indexes defined', async () => {
      const indexes = await PracticeQuestionModel.collection.getIndexes()
      
      // Check if required indexes exist
      const indexNames = Object.keys(indexes)
      expect(indexNames).toContain('domain_1_difficulty_1')
      expect(indexNames).toContain('type_1_isActive_1')
      expect(indexNames).toContain('tags_1')
      expect(indexNames).toContain('companies_1')
    })
  })
})
