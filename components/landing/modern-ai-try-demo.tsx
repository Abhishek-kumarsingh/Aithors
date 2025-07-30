"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, Button, TextField, Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Play, 
  MessageSquare, 
  User, 
  Bot,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock
} from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    domain: "Frontend Development",
    question: "Explain the difference between React's useState and useEffect hooks.",
    type: "Technical",
    difficulty: "Intermediate"
  },
  {
    id: 2,
    domain: "Data Science",
    question: "How would you handle missing data in a machine learning dataset?",
    type: "Analytical",
    difficulty: "Advanced"
  },
  {
    id: 3,
    domain: "Backend Development",
    question: "Describe the benefits of using microservices architecture.",
    type: "System Design",
    difficulty: "Senior"
  }
];

const demoConversation = [
  {
    role: "bot",
    message: "Hello! I'm your AI interviewer. Let's start with a technical question about React hooks.",
    timestamp: "10:30 AM"
  },
  {
    role: "user",
    message: "useState is for managing component state, while useEffect handles side effects like API calls.",
    timestamp: "10:31 AM"
  },
  {
    role: "bot",
    message: "Great! Can you give me an example of when you'd use useEffect with a dependency array?",
    timestamp: "10:31 AM"
  }
];

export function ModernAITryDemo() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % sampleQuestions.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const startDemo = () => {
    setIsPlaying(true);
    setCurrentStep(0);
    
    // Simulate demo progression
    const steps = [0, 1, 2];
    steps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(step);
      }, index * 2000);
    });
    
    setTimeout(() => {
      setIsPlaying(false);
      setCurrentStep(0);
    }, 8000);
  };

  const handleStartRealInterview = () => {
    if (session) {
      // User is authenticated, redirect to dashboard
      if (session.user?.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      // User is not authenticated, redirect to register
      router.push('/auth/register');
    }
  };

  return (
    <Box
      component="section"
      id="demo"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%)',
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
            radial-gradient(circle at 20% 20%, rgba(34, 197, 94, 0.05) 0%, transparent 50%),
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
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
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
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
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
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                color: '#059669',
                fontWeight: 600,
                mb: 4,
              }}
            >
              <Play size={18} />
              <Typography variant="body2" fontWeight={600}>
                Interactive Demo
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
              Try It{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #059669 0%, #2563eb 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Now
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
              Experience our AI interviewer in action. See how it adapts to your responses and provides intelligent follow-up questions.
            </Typography>
          </Box>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 6, alignItems: 'center' }}>
          {/* Sample Questions Carousel */}
          <Box
            component={motion.div}
            sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Sample Interview Questions
            </Typography>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card sx={{ backgroundColor: 'background.paper', boxShadow: 3, border: 0 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        {sampleQuestions[currentQuestion].domain}
                      </Typography>
                      <Box
                        component="span"
                        sx={{
                          px: 1,
                          py: 0.5,
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          fontSize: '0.75rem',
                          borderRadius: 8,
                        }}
                      >
                        {sampleQuestions[currentQuestion].difficulty}
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ color: '#1e293b', lineHeight: 1.6, mb: 2 }}>
                      {sampleQuestions[currentQuestion].question}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <MessageSquare className="w-4 h-4" />
                      <Typography variant="body2">{sampleQuestions[currentQuestion].type} Question</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Question Indicators */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
              {sampleQuestions.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    transition: 'all 0.3s ease',
                    background: index === currentQuestion
                      ? 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)'
                      : '#d1d5db',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Interactive Demo */}
          <Box
            component={motion.div}
            sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 } }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: { xs: 2.5, md: 3 }, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Live Demo
              </Typography>
              <Button
                onClick={startDemo}
                disabled={isPlaying}
                variant="contained"
                startIcon={<Play size={16} />}
                sx={{
                  background: 'linear-gradient(45deg, #059669 30%, #2563eb 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #047857 30%, #1d4ed8 90%)',
                  },
                }}
              >
                {isPlaying ? "Running..." : "Start Demo"}
              </Button>
            </Box>

            <Card sx={{ backgroundColor: 'background.paper', boxShadow: 2, border: 0, minHeight: '350px', borderRadius: 2 }}>
              <CardContent sx={{ p: 2.5 }}>
                {!isPlaying ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                      }}
                    >
                      <Play className="w-8 h-8 text-white" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b', mb: 1, fontSize: '1.1rem' }}>
                      Ready to Experience AI Interview?
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2.5, fontSize: '0.95rem' }}>
                      Click &quot;Start Demo&quot; to see how our AI interviewer works
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Typography variant="body2">Real-time feedback</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Typography variant="body2">Adaptive questions</Typography>
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {demoConversation.slice(0, currentStep + 1).map((message, index) => (
                      <Box
                        key={index}
                        component={motion.div}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        sx={{
                          display: 'flex',
                          gap: 1.5,
                          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            gap: 1.5,
                            maxWidth: '80%',
                            flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                          }}
                        >
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: message.role === 'user'
                                ? '#3b82f6'
                                : 'linear-gradient(90deg, #10b981 0%, #3b82f6 100%)',
                            }}
                          >
                            {message.role === 'user' ? (
                              <User className="w-4 h-4 text-white" />
                            ) : (
                              <Bot className="w-4 h-4 text-white" />
                            )}
                          </Box>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              backgroundColor: message.role === 'user'
                                ? '#3b82f6'
                                : 'background.default',
                              color: message.role === 'user' ? 'white' : 'text.primary',
                            }}
                          >
                            <Typography variant="body2">{message.message}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, opacity: 0.7 }}>
                              <Clock className="w-3 h-3" />
                              <Typography variant="caption">{message.timestamp}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    ))}
                    
                    {currentStep === demoConversation.length - 1 && (
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        sx={{
                          mt: 3,
                          p: 2,
                          backgroundColor: 'rgba(16, 185, 129, 0.05)',
                          borderRadius: 2,
                          border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#10b981' }}>
                          <Sparkles className="w-4 h-4" />
                          <Typography variant="body2" fontWeight={500}>AI Analysis Complete</Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: '#059669', mt: 0.5 }}>
                          Great technical knowledge! Your understanding of React hooks is solid.
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowRight size={20} />}
                onClick={handleStartRealInterview}
                sx={{
                  background: 'linear-gradient(45deg, #059669 30%, #2563eb 90%)',
                  color: 'white',
                  px: { xs: 2.5, md: 4 },
                  py: { xs: 1, md: 1.5 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #047857 30%, #1d4ed8 90%)',
                  },
                }}
              >
                {session ? 'Go to Dashboard' : 'Start Your Real Interview'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
