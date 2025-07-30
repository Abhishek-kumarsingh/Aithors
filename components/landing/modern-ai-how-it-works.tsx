"use client";

import { motion } from "framer-motion";
import { Card, CardContent, Box, Typography } from "@mui/material";
import { 
  Search, 
  MessageSquare, 
  BarChart3, 
  Map,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Choose Domain",
    description: "Select your field of expertise from our comprehensive list of domains and sub-domains.",
    icon: Search,
    color: "from-blue-500 to-cyan-500",
    details: [
      "Web Development",
      "Data Science",
      "Mobile Development",
      "DevOps & Cloud",
      "AI/ML Engineering"
    ]
  },
  {
    id: 2,
    title: "AI Interview",
    description: "Engage with our AI interviewer for personalized, adaptive questions tailored to your level.",
    icon: MessageSquare,
    color: "from-purple-500 to-pink-500",
    details: [
      "Adaptive questioning",
      "Real-time analysis",
      "Natural conversation",
      "Multiple question types"
    ]
  },
  {
    id: 3,
    title: "Get Score & Feedback",
    description: "Receive detailed performance analysis with strengths, weaknesses, and improvement areas.",
    icon: BarChart3,
    color: "from-green-500 to-emerald-500",
    details: [
      "Detailed scoring",
      "Performance metrics",
      "Strength analysis",
      "Improvement suggestions"
    ]
  },
  {
    id: 4,
    title: "Personalized Roadmap",
    description: "Get a custom learning path with resources and milestones to achieve your career goals.",
    icon: Map,
    color: "from-orange-500 to-red-500",
    details: [
      "Custom learning path",
      "Resource recommendations",
      "Progress tracking",
      "Career milestones"
    ]
  }
];

export function ModernAIHowItWorks() {
  return (
    <Box
      component="section"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
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
            radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)
          `,
        },
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, position: 'relative', zIndex: 1 }}>
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: 'center', mb: 8 }}>
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
              How It{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Works
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
              Our AI-powered platform guides you through a comprehensive interview experience designed to help you succeed in your dream job.
            </Typography>
          </Box>
        </motion.div>

        {/* Enhanced Steps Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 4,
            mb: 8,
          }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "backOut" }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.15)',
                    background: 'rgba(255, 255, 255, 0.95)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: step.color.includes('blue')
                      ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                      : step.color.includes('purple')
                      ? 'linear-gradient(90deg, #9333ea, #ec4899)'
                      : 'linear-gradient(90deg, #10b981, #059669)',
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  {/* Step Number & Icon */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        background: step.color.includes('blue')
                          ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                          : step.color.includes('purple')
                          ? 'linear-gradient(135deg, #9333ea, #ec4899)'
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.25rem',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      {step.id}
                    </Box>
                    <Box
                      sx={{
                        color: step.color.includes('blue')
                          ? '#3b82f6'
                          : step.color.includes('purple')
                          ? '#9333ea'
                          : '#10b981',
                      }}
                    >
                      <step.icon size={32} />
                    </Box>
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 2,
                      fontSize: '1.25rem',
                    }}
                  >
                    {step.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.description}
                  </Typography>

                  {/* Details */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {step.details.map((detail, detailIndex) => (
                      <Box key={detailIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CheckCircle size={16} color="#10b981" />
                        <Typography
                          variant="caption"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                          }}
                        >
                          {detail}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>

              {/* Arrow Connector (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <Box
                  component={motion.div}
                  sx={{
                    display: { xs: 'none', lg: 'block' },
                    position: 'absolute',
                    top: '50%',
                    right: -16,
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 + 0.8 }}
                  viewport={{ once: true }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                        borderRadius: '50%',
                        filter: 'blur(4px)',
                        opacity: 0.3,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'relative',
                        backgroundColor: 'background.paper',
                        borderRadius: '50%',
                        p: 1,
                        boxShadow: 3,
                        border: '1px solid',
                        borderColor: 'rgba(147, 51, 234, 0.2)',
                      }}
                    >
                      <ArrowRight className="w-6 h-6 text-purple-600" />
                    </Box>
                  </Box>
                </Box>
              )}
            </motion.div>
          ))}
        </Box>

        {/* Bottom CTA */}
        <Box
          component={motion.div}
          sx={{ textAlign: 'center', mt: 8 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            component={motion.div}
            sx={{ display: 'inline-block' }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Box sx={{ position: 'relative', cursor: 'pointer' }}>
              {/* Glow effect */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: -4,
                  background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 50%, #9333ea 100%)',
                  borderRadius: '50px',
                  filter: 'blur(8px)',
                  opacity: 0.3,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 0.5,
                  },
                }}
              />

              {/* Main button */}
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 4,
                  py: 2,
                  background: 'linear-gradient(90deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  borderRadius: '50px',
                  fontWeight: 600,
                  boxShadow: 6,
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': {
                    boxShadow: 12,
                  },
                }}
              >
                <Typography variant="h6" component="span">
                  Ready to get started?
                </Typography>
                <Box
                  component={motion.div}
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-5 h-5" />
                </Box>
              </Box>

              {/* Shine effect */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  opacity: 0,
                  transition: 'opacity 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                    animation: 'pulse 1s infinite',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
