"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Container
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { HelpCircle, MessageSquare, Brain, Shield, Clock, Trophy } from "lucide-react";

const faqs = [
  {
    id: "1",
    question: "How does the AI interviewer work?",
    answer: "Our AI interviewer uses advanced natural language processing to conduct realistic interviews. It adapts questions based on your responses, provides real-time feedback, and evaluates your performance across multiple criteria including technical knowledge, communication skills, and problem-solving approach.",
    icon: Brain
  },
  {
    id: "2",
    question: "What types of interviews are available?",
    answer: "We offer various interview types including technical interviews for software development, data science, DevOps, and more. We also provide behavioral interviews, system design sessions, and coding challenges. Each interview is tailored to specific roles and experience levels.",
    icon: MessageSquare
  },
  {
    id: "3",
    question: "How accurate is the AI feedback?",
    answer: "Our AI feedback system has been trained on thousands of real interviews and achieves 95%+ accuracy in performance evaluation. The feedback includes detailed analysis of your strengths, areas for improvement, and specific recommendations for skill development.",
    icon: Trophy
  },
  {
    id: "4",
    question: "Is my data secure and private?",
    answer: "Yes, we take data security very seriously. All interview sessions are encrypted, and your personal information is protected according to industry standards. We never share your interview data with third parties, and you have full control over your data.",
    icon: Shield
  },
  {
    id: "5",
    question: "How long does an interview session take?",
    answer: "Interview sessions typically last between 30-60 minutes, depending on the type and complexity. Technical interviews may take longer due to coding challenges, while behavioral interviews are usually shorter. You can pause and resume sessions as needed.",
    icon: Clock
  },
  {
    id: "6",
    question: "Can I practice for specific companies?",
    answer: "Yes! We have company-specific interview preparation for major tech companies like Google, Amazon, Microsoft, and more. Our question bank includes real interview questions from these companies, and our AI adapts to their specific interview styles.",
    icon: HelpCircle
  },
  {
    id: "7",
    question: "What happens after I complete an interview?",
    answer: "After completing an interview, you'll receive a comprehensive report including your score, detailed feedback, performance analysis, and a personalized learning roadmap. You can also download a PDF report and track your progress over time.",
    icon: Trophy
  },
  {
    id: "8",
    question: "Do you offer different difficulty levels?",
    answer: "Absolutely! We offer interviews for all experience levels - from entry-level to senior positions. Our AI automatically adjusts question difficulty based on your responses and selected experience level, ensuring an appropriate challenge.",
    icon: Brain
  },
  {
    id: "9",
    question: "Can I get help during the interview?",
    answer: "While the interview itself should be completed independently for accurate assessment, our AI assistant is available before and after sessions to help you prepare, understand concepts, and clarify any questions about the feedback.",
    icon: MessageSquare
  },
  {
    id: "10",
    question: "Is there a free trial available?",
    answer: "Yes, we offer a free trial that includes one complete interview session with basic feedback. This allows you to experience our platform and see the quality of our AI interviewer before committing to a subscription.",
    icon: HelpCircle
  }
];

export function ModernAIFAQ() {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 50%, #e2e8f0 100%)',
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
            radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)
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
          width: '16rem',
          height: '16rem',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 100%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '5rem',
          right: '2.5rem',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
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
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                color: '#2563eb',
                fontWeight: 600,
                mb: 4,
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                Frequently Asked Questions
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
              Got{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Questions?
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
              Find answers to the most common questions about our AI-powered interview platform. Can't find what you're looking for? Contact our support team.
            </Typography>
          </Box>
        </motion.div>

        {/* FAQ Accordion - Parallel Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: { xs: 2, md: 4 },
            alignItems: 'start'
          }}>
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Accordion
                  sx={{
                    backgroundColor: 'background.paper',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0,
                      boxShadow: '0 8px 30px rgba(147, 51, 234, 0.15)',
                      borderColor: 'rgba(147, 51, 234, 0.2)',
                    },
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(0, 0, 0, 0.12)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: '#9333ea' }} />}
                    sx={{
                      px: { xs: 2.5, md: 3 },
                      py: { xs: 1.5, md: 2 },
                      minHeight: { xs: 60, md: 72 },
                      '&:hover': {
                        backgroundColor: 'rgba(147, 51, 234, 0.04)',
                      },
                      '& .MuiAccordionSummary-content': {
                        margin: '12px 0',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={2} width="100%">
                      <Box
                        sx={{
                          width: { xs: 28, md: 32 },
                          height: { xs: 28, md: 32 },
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
                        }}
                      >
                        <faq.icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </Box>
                      <Typography
                        variant="h6"
                        component="span"
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: '0.95rem', md: '1.1rem' },
                          lineHeight: 1.3,
                          color: '#1e293b',
                        }}
                      >
                        {faq.question}
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: { xs: 2.5, md: 3 }, pb: { xs: 2.5, md: 3 }, pt: 0 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Box sx={{ pl: { xs: 4, md: 5 } }}>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            fontSize: { xs: '0.9rem', md: '1rem' },
                          }}
                        >
                          {faq.answer}
                        </Typography>
                      </Box>
                    </motion.div>
                  </AccordionDetails>
                </Accordion>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Box
              sx={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
                borderRadius: 3,
                p: 4,
                border: '1px solid rgba(59, 130, 246, 0.2)',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 2,
                }}
              >
                Still have questions?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Our support team is here to help you succeed. Get in touch with us for personalized assistance.
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="button"
                  sx={{
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    color: 'white',
                    borderRadius: 2,
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  Contact Support
                </Box>
                <Box
                  component="button"
                  sx={{
                    px: { xs: 2.5, md: 3 },
                    py: { xs: 1.25, md: 1.5 },
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    border: '1px solid',
                    borderColor: 'divider',
                    color: '#1e293b',
                    borderRadius: 2,
                    fontWeight: 600,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Schedule a Demo
                </Box>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
