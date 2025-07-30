"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Button, Tabs, Tab, Box, Typography } from "@mui/material";
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  Code, 
  Trophy,
  ArrowRight,
  Target,
  Zap
} from "lucide-react";

const roadmaps = {
  frontend: {
    title: "Frontend Developer",
    description: "Complete roadmap to become a professional frontend developer",
    duration: "6-8 months",
    steps: [
      {
        id: 1,
        title: "HTML & CSS Fundamentals",
        description: "Master the building blocks of web development",
        status: "completed",
        duration: "2-3 weeks",
        resources: ["MDN Web Docs", "CSS Grid Garden", "Flexbox Froggy"],
        skills: ["HTML5", "CSS3", "Responsive Design", "Flexbox", "Grid"]
      },
      {
        id: 2,
        title: "JavaScript Essentials",
        description: "Learn modern JavaScript and ES6+ features",
        status: "completed",
        duration: "4-6 weeks",
        resources: ["JavaScript.info", "FreeCodeCamp", "Eloquent JavaScript"],
        skills: ["ES6+", "DOM Manipulation", "Async/Await", "Promises"]
      },
      {
        id: 3,
        title: "React Development",
        description: "Build dynamic user interfaces with React",
        status: "in-progress",
        duration: "6-8 weeks",
        resources: ["React Docs", "React Router", "Redux Toolkit"],
        skills: ["Components", "Hooks", "State Management", "Routing"]
      },
      {
        id: 4,
        title: "Advanced React & Tools",
        description: "Master advanced React patterns and development tools",
        status: "pending",
        duration: "4-6 weeks",
        resources: ["Next.js", "TypeScript", "Testing Library"],
        skills: ["Next.js", "TypeScript", "Testing", "Performance"]
      },
      {
        id: 5,
        title: "Portfolio & Job Prep",
        description: "Build portfolio projects and prepare for interviews",
        status: "pending",
        duration: "3-4 weeks",
        resources: ["GitHub", "Netlify", "Interview Prep"],
        skills: ["Portfolio", "Git", "Deployment", "Interview Skills"]
      }
    ]
  },
  backend: {
    title: "Backend Developer",
    description: "Comprehensive path to backend development mastery",
    duration: "8-10 months",
    steps: [
      {
        id: 1,
        title: "Programming Fundamentals",
        description: "Master a backend programming language",
        status: "completed",
        duration: "4-6 weeks",
        resources: ["Python.org", "Node.js Docs", "Java Tutorial"],
        skills: ["Python/Node.js", "Data Structures", "Algorithms", "OOP"]
      },
      {
        id: 2,
        title: "Database Design",
        description: "Learn database concepts and SQL",
        status: "in-progress",
        duration: "3-4 weeks",
        resources: ["PostgreSQL", "MongoDB", "SQL Tutorial"],
        skills: ["SQL", "NoSQL", "Database Design", "Optimization"]
      },
      {
        id: 3,
        title: "API Development",
        description: "Build RESTful APIs and web services",
        status: "pending",
        duration: "6-8 weeks",
        resources: ["Express.js", "FastAPI", "Spring Boot"],
        skills: ["REST APIs", "Authentication", "Middleware", "Testing"]
      },
      {
        id: 4,
        title: "DevOps & Deployment",
        description: "Learn deployment and infrastructure basics",
        status: "pending",
        duration: "4-6 weeks",
        resources: ["Docker", "AWS", "CI/CD"],
        skills: ["Docker", "Cloud Services", "CI/CD", "Monitoring"]
      }
    ]
  },
  datascience: {
    title: "Data Scientist",
    description: "Journey from beginner to professional data scientist",
    duration: "10-12 months",
    steps: [
      {
        id: 1,
        title: "Python & Statistics",
        description: "Foundation in Python programming and statistics",
        status: "completed",
        duration: "6-8 weeks",
        resources: ["Python.org", "Khan Academy", "Coursera"],
        skills: ["Python", "Statistics", "Probability", "NumPy", "Pandas"]
      },
      {
        id: 2,
        title: "Data Analysis & Visualization",
        description: "Learn to analyze and visualize data effectively",
        status: "in-progress",
        duration: "4-6 weeks",
        resources: ["Matplotlib", "Seaborn", "Plotly", "Tableau"],
        skills: ["Data Cleaning", "EDA", "Visualization", "Storytelling"]
      },
      {
        id: 3,
        title: "Machine Learning",
        description: "Master ML algorithms and model building",
        status: "pending",
        duration: "8-10 weeks",
        resources: ["Scikit-learn", "TensorFlow", "PyTorch"],
        skills: ["Supervised Learning", "Unsupervised Learning", "Model Evaluation"]
      }
    ]
  }
};

export function ModernAIRoadmapPreview() {
  const [selectedRoadmap, setSelectedRoadmap] = useState(0);

  const roadmapKeys = ["frontend", "backend", "datascience"];
  const currentRoadmapKey = roadmapKeys[selectedRoadmap] || "frontend";

  // Convert roadmaps object to array for mapping
  const roadmapsArray = [
    { key: "frontend", ...roadmaps.frontend },
    { key: "backend", ...roadmaps.backend },
    { key: "datascience", ...roadmaps.datascience }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "in-progress":
        return <Clock className="w-6 h-6 text-blue-500" />;
      default:
        return <Circle className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50 dark:bg-green-900/20";
      case "in-progress":
        return "border-blue-500 bg-blue-50 dark:bg-blue-900/20";
      default:
        return "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50";
    }
  };

  const currentRoadmap = roadmaps[currentRoadmapKey as keyof typeof roadmaps];

  // Safety check to prevent undefined errors
  if (!currentRoadmap) {
    return null;
  }

  return (
    <Box
      component="section"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ede9fe 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)
          `,
        },
      }}
    >
      {/* Enhanced Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: '5rem',
          left: '2.5rem',
          width: '18rem',
          height: '18rem',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5rem',
          right: '2.5rem',
          width: '24rem',
          height: '24rem',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />

      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 3,
                py: 1.5,
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
                border: '1px solid rgba(147, 51, 234, 0.2)',
                color: '#9333ea',
                fontWeight: 600,
                mb: 4,
              }}
            >
              <Target size={18} />
              <Typography variant="body2" fontWeight={600}>
                Personalized Learning
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 800,
                color: '#1e293b',
                mb: 3,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              Your Learning{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Roadmap
              </Box>
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: '1.25rem',
              }}
            >
              Get a personalized learning path based on your interview performance and career goals. Track your progress and achieve your objectives step by step.
            </Typography>
          </Box>
        </motion.div>

        {/* Horizontal Roadmap Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 6 }}>
            {roadmapsArray.map((roadmap, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  onClick={() => setSelectedRoadmap(index)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: selectedRoadmap === index ? '2px solid #9333ea' : '2px solid transparent',
                    background: selectedRoadmap === index
                      ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)'
                      : 'background.paper',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                      border: '2px solid rgba(147, 51, 234, 0.5)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        background: selectedRoadmap === index
                          ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
                          : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {index === 0 && <Code size={24} color={selectedRoadmap === index ? 'white' : '#64748b'} />}
                      {index === 1 && <Zap size={24} color={selectedRoadmap === index ? 'white' : '#64748b'} />}
                      {index === 2 && <Trophy size={24} color={selectedRoadmap === index ? 'white' : '#64748b'} />}
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: selectedRoadmap === index ? '#9333ea' : '#1e293b',
                        mb: 1
                      }}
                    >
                      {roadmap.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                      {roadmap.description}
                    </Typography>

                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 2,
                        py: 1,
                        borderRadius: 4,
                        background: selectedRoadmap === index
                          ? 'rgba(147, 51, 234, 0.1)'
                          : 'rgba(148, 163, 184, 0.1)',
                      }}
                    >
                      <Clock size={14} />
                      <Typography variant="caption" fontWeight={600}>
                        {roadmap.duration}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Selected Roadmap Details */}
        <motion.div
          key={selectedRoadmap}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card sx={{ backgroundColor: 'background.paper', border: 0, boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    {currentRoadmap.title} Roadmap
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {currentRoadmap.description}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    textAlign: 'right',
                    px: 3,
                    py: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    border: '1px solid rgba(147, 51, 234, 0.2)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Total Duration
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#9333ea' }}>
                    {currentRoadmap.duration}
                  </Typography>
                </Box>
              </Box>

              {/* Modern Timeline Layout */}
              <Box sx={{ position: 'relative' }}>
                {/* Timeline Line */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 30,
                    top: 30,
                    bottom: 30,
                    width: 2,
                    background: 'linear-gradient(180deg, #9333ea 0%, #ec4899 100%)',
                    borderRadius: 1,
                  }}
                />

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {currentRoadmap.steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                        {/* Timeline Node */}
                        <Box
                          sx={{
                            position: 'relative',
                            zIndex: 1,
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            background: step.status === 'completed'
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : step.status === 'in-progress'
                              ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                              : 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 3,
                            flexShrink: 0,
                          }}
                        >
                          {getStatusIcon(step.status)}
                        </Box>

                        {/* Step Content */}
                        <Box
                          sx={{
                            flex: 1,
                            p: 3,
                            borderRadius: 3,
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(248, 250, 252, 0.8) 100%)',
                            border: '1px solid rgba(148, 163, 184, 0.2)',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: 4,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                              {step.title}
                            </Typography>
                            <Box
                              sx={{
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                background: 'rgba(147, 51, 234, 0.1)',
                                border: '1px solid rgba(147, 51, 234, 0.2)',
                              }}
                            >
                              <Typography variant="caption" sx={{ color: '#9333ea', fontWeight: 600 }}>
                                {step.duration}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                            {step.description}
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {step.skills.map((skill, skillIndex) => (
                              <Box
                                key={skillIndex}
                                component="span"
                                sx={{
                                  px: 2,
                                  py: 1,
                                  backgroundColor: 'rgba(147, 51, 234, 0.1)',
                                  color: '#9333ea',
                                  fontSize: '0.875rem',
                                  fontWeight: 500,
                                  borderRadius: 6,
                                  border: '1px solid rgba(147, 51, 234, 0.2)',
                                }}
                              >
                                {skill}
                              </Box>
                            ))}
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                            <BookOpen size={16} />
                            <Typography variant="body2" fontWeight={500}>
                              {step.resources.length} resources available
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              </Box>

              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button
                  size="large"
                  variant="contained"
                  endIcon={<ArrowRight size={20} />}
                  sx={{
                    background: 'linear-gradient(45deg, #9333ea 30%, #ec4899 90%)',
                    color: 'white',
                    px: 6,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(147, 51, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(147, 51, 234, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  Get Your Personalized Roadmap
                </Button>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Box>
  );
}
