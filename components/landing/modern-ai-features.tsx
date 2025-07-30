"use client";

import { motion } from "framer-motion";
import { Card, CardContent, Button, Box, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  Brain, 
  Map, 
  Database, 
  MessageCircle,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "AI Interviews",
    description: "Experience intelligent, adaptive interviews that adjust to your skill level and provide real-time feedback.",
    icon: Brain,
    color: "from-blue-500 to-cyan-500",
    benefits: [
      "Adaptive questioning based on your responses",
      "Real-time performance analysis",
      "Natural conversation flow",
      "Multiple interview formats"
    ],
    highlight: "Smart & Adaptive"
  },
  {
    id: 2,
    title: "Smart Roadmaps",
    description: "Get personalized learning paths tailored to your career goals and current skill level.",
    icon: Map,
    color: "from-purple-500 to-pink-500",
    benefits: [
      "Personalized learning paths",
      "Progress tracking and milestones",
      "Resource recommendations",
      "Career goal alignment"
    ],
    highlight: "Personalized"
  },
  {
    id: 3,
    title: "Question Bank",
    description: "Access thousands of curated questions across different domains and difficulty levels.",
    icon: Database,
    color: "from-green-500 to-emerald-500",
    benefits: [
      "10,000+ curated questions",
      "Multiple domains covered",
      "Difficulty-based categorization",
      "Regular content updates"
    ],
    highlight: "Comprehensive"
  },
  {
    id: 4,
    title: "AI Assistant",
    description: "Get instant help and guidance from our ChatGPT-like AI assistant throughout your journey.",
    icon: MessageCircle,
    color: "from-orange-500 to-red-500",
    benefits: [
      "24/7 instant support",
      "Context-aware responses",
      "Learning assistance",
      "Career guidance"
    ],
    highlight: "Always Available"
  }
];

export function ModernAIFeatures() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleExploreFeature = (featureId: number) => {
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
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #e2e8f0 100%)',
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
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(236, 72, 153, 0.03) 0%, transparent 50%)
          `,
        },
      }}
    >
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
              <Sparkles size={18} />
              <Typography variant="body2" fontWeight={600}>
                Powerful Features
              </Typography>
            </Box>

            <Box sx={{ position: 'relative', mb: 4 }}>
              {/* Floating badge */}
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 4,
                  py: 2,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1), rgba(236, 72, 153, 0.1))',
                  border: '1px solid rgba(147, 51, 234, 0.3)',
                  color: '#9333ea',
                  fontWeight: 700,
                  mb: 6,
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(147, 51, 234, 0.15)',
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #9333ea, #ec4899)',
                    animation: 'pulse 2s infinite',
                    '@keyframes pulse': {
                      '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                      '50%': { opacity: 0.7, transform: 'scale(1.1)' },
                    },
                  }}
                />
                <Typography variant="body1" fontWeight={700}>
                  🚀 Complete Interview Solution
                </Typography>
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2rem', md: '2.8rem' },
                  fontWeight: 700,
                  color: '#1e293b',
                  mb: 3,
                  lineHeight: 1.2,
                  textShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
                }}
              >
                Everything You Need to{' '}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #3b82f6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -8,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: 'linear-gradient(90deg, #9333ea, #ec4899, #3b82f6)',
                      borderRadius: 2,
                      opacity: 0.3,
                    },
                  }}
                >
                  Succeed
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                  fontSize: { xs: '1rem', md: '1.1rem' },
                  fontWeight: 400,
                  mb: 2,
                }}
              >
                Transform your interview skills with our{' '}
                <Box component="span" sx={{ color: '#9333ea', fontWeight: 600 }}>
                  AI-powered platform
                </Box>
                {' '}that combines cutting-edge technology with proven techniques
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  maxWidth: '500px',
                  mx: 'auto',
                  opacity: 0.8,
                  fontSize: '0.95rem',
                }}
              >
                Join thousands of professionals who've landed their dream jobs
              </Typography>
            </Box>
          </Box>
        </motion.div>

        {/* Enhanced Features Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            gap: { xs: 2.5, md: 3 },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "backOut" }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 2.5,
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(147, 51, 234, 0.12)',
                    background: 'rgba(255, 255, 255, 0.98)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  {/* Enhanced Header */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: { xs: 2.5, md: 3 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 2.5 } }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2.5,
                          background: feature.color.includes('blue')
                            ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                            : feature.color.includes('purple')
                            ? 'linear-gradient(135deg, #9333ea, #ec4899)'
                            : feature.color.includes('green')
                            ? 'linear-gradient(135deg, #10b981, #059669)'
                            : 'linear-gradient(135deg, #f59e0b, #d97706)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                          transition: 'transform 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <feature.icon size={28} color="white" />
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 0.5,
                            fontSize: '1.1rem',
                          }}
                        >
                          {feature.title}
                        </Typography>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 2,
                            py: 0.5,
                            borderRadius: 6,
                            background: feature.color.includes('blue')
                              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                              : feature.color.includes('purple')
                              ? 'linear-gradient(135deg, #9333ea, #ec4899)'
                              : feature.color.includes('green')
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #f59e0b, #d97706)',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          <Zap size={12} />
                          {feature.highlight}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      mb: 2.5,
                      lineHeight: 1.5,
                      fontSize: '0.95rem',
                    }}
                  >
                    {feature.description}
                  </Typography>

                  {/* Enhanced Benefits */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2.5 }}>
                    {feature.benefits.slice(0, 3).map((benefit, benefitIndex) => (
                      <Box key={benefitIndex} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            background: feature.color.includes('blue')
                              ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                              : feature.color.includes('purple')
                              ? 'linear-gradient(135deg, #9333ea, #ec4899)'
                              : feature.color.includes('green')
                              ? 'linear-gradient(135deg, #10b981, #059669)'
                              : 'linear-gradient(135deg, #f59e0b, #d97706)',
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            fontSize: '0.85rem',
                          }}
                        >
                          {benefit}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Enhanced CTA */}
                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<TrendingUp size={16} />}
                    onClick={() => handleExploreFeature(feature.id)}
                    sx={{
                      background: feature.color.includes('blue')
                        ? 'linear-gradient(135deg, #3b82f6, #06b6d4)'
                        : feature.color.includes('purple')
                        ? 'linear-gradient(135deg, #9333ea, #ec4899)'
                        : feature.color.includes('green')
                        ? 'linear-gradient(135deg, #10b981, #059669)'
                        : 'linear-gradient(135deg, #f59e0b, #d97706)',
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', md: '1rem' },
                      py: { xs: 1, md: 1.5 },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {session ? 'Go to Dashboard' : 'Explore Feature'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>

        {/* Enhanced Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-3xl -m-8"></div>

          <Box
            sx={{
              mt: 10,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              position: 'relative',
              zIndex: 1,
              py: 4,
            }}
          >
            {[
              { label: "Active Users", value: "10K+", icon: Target, color: "from-blue-500 to-cyan-500" },
              { label: "Questions", value: "50K+", icon: Database, color: "from-green-500 to-emerald-500" },
              { label: "Success Rate", value: "95%", icon: TrendingUp, color: "from-purple-500 to-pink-500" },
              { label: "AI Accuracy", value: "99%", icon: Brain, color: "from-orange-500 to-red-500" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.8 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  {/* Icon container with gradient background */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      mb: 3,
                      position: 'relative'
                    }}
                  >
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <div className="absolute inset-0 bg-white/20 rounded-2xl"></div>
                      <stat.icon size={32} color="white" className="relative z-10" />
                    </div>
                  </Box>

                  {/* Value with enhanced styling */}
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 900,
                      background: `linear-gradient(135deg, #9333ea 0%, #ec4899 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '2.5rem' },
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </Typography>

                  {/* Label with better typography */}
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '1rem',
                      fontWeight: 500,
                      letterSpacing: '0.025em',
                    }}
                  >
                    {stat.label}
                  </Typography>

                  {/* Subtle glow effect on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -m-2"></div>
                </Box>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Box>
    </Box>
  );
}
