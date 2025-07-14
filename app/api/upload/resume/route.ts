import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import mammoth from 'mammoth';

// POST - Upload and parse resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'resumes');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Parse file content
    let extractedText = '';
    
    try {
      if (file.type === 'application/pdf') {
        // Dynamic import to avoid build-time issues
        const pdf = (await import('pdf-parse')).default;
        const pdfData = await pdf(buffer);
        extractedText = pdfData.text;
      } else if (file.type.includes('word')) {
        const docData = await mammoth.extractRawText({ buffer });
        extractedText = docData.value;
      }
    } catch (parseError) {
      console.error('Error parsing file:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse resume content' },
        { status: 500 }
      );
    }

    // Extract skills and experience using AI or pattern matching
    const extractedSkills = extractSkillsFromText(extractedText);
    const extractedExperience = extractExperienceFromText(extractedText);

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      filePath: `/uploads/resumes/${fileName}`,
      extractedSkills,
      extractedExperience,
      fileName: file.name
    });

  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to extract skills from text
function extractSkillsFromText(text: string): string[] {
  const skillKeywords = [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
    'Scala', 'Perl', 'R', 'MATLAB', 'Objective-C', 'Dart', 'Elixir', 'Haskell', 'Clojure',
    
    // Frontend Technologies
    'React', 'Vue.js', 'Angular', 'Svelte', 'jQuery', 'HTML', 'CSS', 'SASS', 'SCSS', 'Less',
    'Bootstrap', 'Tailwind CSS', 'Material-UI', 'Chakra UI', 'Ant Design', 'Styled Components',
    
    // Backend Technologies
    'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Laravel',
    'Ruby on Rails', 'Gin', 'Echo', 'Fiber', 'NestJS', 'Koa.js', 'Hapi.js',
    
    // Databases
    'MongoDB', 'PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Elasticsearch', 'Cassandra',
    'DynamoDB', 'Firebase', 'Supabase', 'PlanetScale', 'CockroachDB',
    
    // Cloud & DevOps
    'AWS', 'Azure', 'Google Cloud', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'GitLab CI',
    'GitHub Actions', 'CircleCI', 'Travis CI', 'Terraform', 'Ansible', 'Chef', 'Puppet',
    
    // Tools & Others
    'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Slack', 'Discord',
    'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 'Postman', 'Insomnia',
    
    // Mobile Development
    'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova', 'PhoneGap',
    
    // Testing
    'Jest', 'Mocha', 'Chai', 'Cypress', 'Selenium', 'Puppeteer', 'Playwright',
    'JUnit', 'TestNG', 'PyTest', 'RSpec', 'Jasmine', 'Karma',
    
    // Data Science & ML
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
    'Jupyter', 'Anaconda', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow',
    
    // API & Communication
    'REST API', 'GraphQL', 'gRPC', 'WebSocket', 'Socket.io', 'SOAP', 'JSON', 'XML',
    
    // Architecture & Patterns
    'Microservices', 'Serverless', 'Event-driven', 'MVC', 'MVP', 'MVVM', 'Clean Architecture',
    'Domain-driven Design', 'SOLID', 'Design Patterns', 'Agile', 'Scrum', 'Kanban'
  ];

  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();

  skillKeywords.forEach(skill => {
    const skillLower = skill.toLowerCase();
    if (lowerText.includes(skillLower)) {
      foundSkills.push(skill);
    }
  });

  // Remove duplicates and return
  return Array.from(new Set(foundSkills));
}

// Helper function to extract experience from text
function extractExperienceFromText(text: string): string {
  const experiencePatterns = [
    /(\d+)\s*(?:\+)?\s*years?\s+(?:of\s+)?experience/gi,
    /(\d+)\s*(?:\+)?\s*yrs?\s+(?:of\s+)?experience/gi,
    /experience\s*:?\s*(\d+)\s*(?:\+)?\s*years?/gi,
    /(\d+)\s*(?:\+)?\s*years?\s+in/gi,
    /(\d+)\s*(?:\+)?\s*years?\s+working/gi
  ];

  let totalExperience = 0;
  let experienceText = '';

  experiencePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        const yearMatch = match.match(/\d+/);
        if (yearMatch) {
          const years = parseInt(yearMatch[0]);
          if (years > totalExperience) {
            totalExperience = years;
            experienceText = match;
          }
        }
      });
    }
  });

  if (totalExperience > 0) {
    return `${totalExperience}+ years of experience`;
  }

  // Look for job titles and companies to estimate experience
  const jobTitlePatterns = [
    /(?:software\s+)?(?:engineer|developer|programmer|architect|lead|manager|director|cto|ceo)/gi,
    /(?:senior|junior|mid-level|principal|staff|lead)/gi
  ];

  let hasJobTitles = false;
  jobTitlePatterns.forEach(pattern => {
    if (pattern.test(text)) {
      hasJobTitles = true;
    }
  });

  if (hasJobTitles) {
    return 'Professional experience in software development';
  }

  return 'Experience level not specified';
}
