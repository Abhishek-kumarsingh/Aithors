import { Worker, Queue, Job, ConnectionOptions } from 'bullmq';
import { connectToMongoDB } from '../mongodb';
import { InterviewModel as Interview, IInterview } from '../models/schema-design';
import { InterviewPDFExportService } from './interviewPdfExportService';
import { Server } from 'socket.io';

// Define job data interfaces
interface ResumeAnalysisJobData {
  resumeText: string;
  userId: string;
  resumePath?: string;
  jobDescription?: string;
}

interface InterviewScoringJobData {
  interviewId: string;
  userId: string;
}

interface PdfGenerationJobData {
  interviewId: string;
  userId: string;
}

// Store worker instances for cleanup
let workers: Worker[] = [];

export class BackgroundWorker {
  private static resumeAnalysisQueue: Queue<ResumeAnalysisJobData>;
  private static interviewScoringQueue: Queue<InterviewScoringJobData>;
  private static pdfGenerationQueue: Queue<PdfGenerationJobData>;
  private static io: Server | null = null;

  static initialize(redisUrl: string, io?: Server): void {
    // Store the Socket.IO server instance if provided
    if (io) {
      this.io = io;
    }

    // Initialize job queues
    this.resumeAnalysisQueue = new Queue('resume-analysis', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.interviewScoringQueue = new Queue('interview-scoring', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    this.pdfGenerationQueue = new Queue('pdf-generation', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });

    // Initialize workers
    const resumeAnalysisWorker = new Worker<ResumeAnalysisJobData>('resume-analysis', 
      async (job: Job<ResumeAnalysisJobData>) => this.processResumeAnalysisJob(job), {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
    workers.push(resumeAnalysisWorker);

    const interviewScoringWorker = new Worker<InterviewScoringJobData>('interview-scoring', 
      async (job: Job<InterviewScoringJobData>) => this.processInterviewScoringJob(job), {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
    workers.push(interviewScoringWorker);

    const pdfGenerationWorker = new Worker<PdfGenerationJobData>('pdf-generation', 
      async (job: Job<PdfGenerationJobData>) => this.generatePdfJob(job), {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    });
    workers.push(pdfGenerationWorker);

    // Set up event listeners
    this.interviewScoringQueue.on('completed' as any, async (job: Job<InterviewScoringJobData>) => {
      console.log(`Interview scoring job ${job.id} completed`);
      // Queue PDF generation after scoring is complete
      const jobData = job.data;
      await this.queuePdfGeneration(jobData.interviewId, jobData.userId);
    });

    this.pdfGenerationQueue.on('completed' as any, async (job: Job<PdfGenerationJobData>) => {
      console.log(`PDF generation job ${job.id} completed`);
      // Notify client that PDF is ready
      if (this.io) {
        const jobData = job.data;
        this.io.emit('interview:pdf-generated', { interviewId: jobData.interviewId });
      }
    });

    console.log('Background workers initialized');
  }

  // Process job handlers
  private static async processResumeAnalysisJob(job: Job<ResumeAnalysisJobData>): Promise<any> {
    const { userId, resumeText, resumePath, jobDescription } = job.data;
    // Implementation would go here
    console.log(`Processing resume analysis for user ${userId}`);
    return { success: true };
  }

  private static async processInterviewScoringJob(job: Job<InterviewScoringJobData>): Promise<any> {
    const { interviewId, userId } = job.data;
    // Implementation would go here
    console.log(`Processing interview scoring for interview ${interviewId}`);
    return { success: true };
  }

  private static async generatePdfJob(job: Job<PdfGenerationJobData>): Promise<any> {
    const { interviewId, userId } = job.data;
    // Implementation would go here
    console.log(`Generating PDF for interview ${interviewId}`);
    return { success: true, pdfPath: `/path/to/pdf/${interviewId}.pdf` };
  }

  // Public API methods
  static async processResumeAnalysis(userId: string, resumeText: string, jobDescription?: string): Promise<void> {
    await this.resumeAnalysisQueue.add('analyze', { 
      userId, 
      resumeText,
      jobDescription
    } as ResumeAnalysisJobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
    
    console.log(`Resume analysis job queued for user ${userId}`);
  }
  
  static async processInterviewScoring(interviewId: string, userId: string): Promise<void> {
    await this.interviewScoringQueue.add('score', { 
      interviewId,
      userId
    } as InterviewScoringJobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
    
    console.log(`Interview scoring job queued for interview ${interviewId}`);
  }
  
  private static async queuePdfGeneration(interviewId: string, userId: string): Promise<void> {
    await this.pdfGenerationQueue.add('generate', { 
      interviewId,
      userId
    } as PdfGenerationJobData, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });
    
    console.log(`PDF generation job queued for interview ${interviewId}`);
  }
  
  static async generatePdf(interviewId: string): Promise<string> {
    try {
      console.log(`Generating PDF directly for interview ${interviewId}`);
      
      // Connect to MongoDB
      await connectToMongoDB();
      
      // Fetch the interview data
      const interview = await Interview.findById(interviewId);
      
      if (!interview) {
        throw new Error(`Interview ${interviewId} not found`);
      }
      
      // Generate the PDF
      const pdfPath = await InterviewPDFExportService.generateInterviewPDF(
        interview,
        true, // includeAnswers
        true  // includeFeedback
      );
      
      // Update the interview with the PDF path
      interview.pdfPath = pdfPath;
      await interview.save();
      
      return pdfPath;
    } catch (error) {
      console.error('Direct PDF generation failed:', error);
      throw error;
    }
  }

  // Setup background workers with event callbacks
  static setupBackgroundWorkers(options: {
    io?: Server;
    onPdfGenerated?: (interviewId: string, pdfPath: string) => void;
    onInterviewScored?: (interviewId: string, resultSummary: any) => void;
  } = {}): { close: () => Promise<void> } {
    // Initialize the workers
    this.initialize(process.env.REDIS_URL || 'redis://localhost:6379', options.io);

    // Return an object with methods to control the workers
    return {
      // Method to close all queues and workers
      close: async (): Promise<void> => {
        console.log('Closing background worker queues...');
        await Promise.all([
          this.resumeAnalysisQueue.close(),
          this.interviewScoringQueue.close(),
          this.pdfGenerationQueue.close(),
          ...workers.map(worker => worker.close())
        ]);
        console.log('All background worker queues and workers closed');
      }
    };
  }
}