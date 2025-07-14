"use client";

import { useState, useEffect } from "react";
import { Button, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Target } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ModernAILandingHero() {
  const [currentText, setCurrentText] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  const texts = [
    "AI-Powered Interviews",
    "Smart Feedback",
    "Personalized Roadmaps",
    "Real-time Analysis"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleStartInterview = () => {
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

  const handleTryDemo = () => {
    // Scroll to demo section
    const demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      component="section"
      className="full-width-no-margin"
      sx={{
        position: 'relative',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        paddingTop: '60px', // Account for fixed header
        boxSizing: 'border-box',
      }}
    >
      {/* Enhanced Animated Background */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #581c87 50%, #1e1b4b 75%, #0f172a 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: `
              radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.2) 0%, transparent 50%)
            `,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(147, 51, 234, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(147, 51, 234, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'linear-gradient(180deg, white, rgba(255,255,255,0.1))',
          },
        }}
      >
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '25%',
            left: '25%',
            width: '20rem',
            height: '20rem',
            borderRadius: '50%',
            filter: 'blur(48px)',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.4) 0%, rgba(147, 51, 234, 0.1) 70%, transparent 100%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            bottom: '25%',
            right: '25%',
            width: '24rem',
            height: '24rem',
            borderRadius: '50%',
            filter: 'blur(48px)',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 70%, transparent 100%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Box
          component={motion.div}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '16rem',
            height: '16rem',
            borderRadius: '50%',
            filter: 'blur(48px)',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.05) 70%, transparent 100%)',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </Box>

      <Box
        sx={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 3, sm: 4, md: 6, lg: 8 },
          textAlign: 'center',
          width: '100%',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Enhanced Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "backOut" }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 3,
                py: 1.5,
                borderRadius: 8,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.95)',
                mb: 4,
                boxShadow: '0 8px 32px rgba(147, 51, 234, 0.2)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Sparkles size={18} />
              <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.9rem' }}>
                AI-Powered Interview Platform
              </Typography>
            </Box>
          </motion.div>

          {/* Enhanced Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ marginBottom: '2rem' }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.8rem', lg: '4.5rem' },
                fontWeight: 700,
                color: 'white',
                lineHeight: 1.1,
                mb: 2,
                textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
              }}
            >
              Ace Your Dream Job with{" "}
              <Box component="span" sx={{ position: 'relative', display: 'inline-block' }}>
                <motion.span
                  key={currentText}
                  initial={{ opacity: 0, y: 30, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -30, rotateX: 90 }}
                  transition={{ duration: 0.6, ease: "backOut" }}
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f59e0b 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    display: 'inline-block',
                  }}
                >
                  {texts[currentText]}
                </motion.span>
              </Box>
            </Typography>
          </motion.div>

          {/* Enhanced Subheading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'rgba(255, 255, 255, 0.85)',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6,
                mb: 4,
                fontWeight: 400,
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              Smart, domain-specific interviews with{' '}
              <Box component="span" sx={{
                fontWeight: 600,
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}>
                real-time feedback
              </Box>
              , roadmap suggestions, and a built-in AI assistant to help you succeed.
            </Typography>
          </motion.div>

          {/* Enhanced CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 3,
                justifyContent: 'center',
                alignItems: 'center',
                mt: 4,
              }}
            >
              <Button
                size="large"
                variant="contained"
                endIcon={<ArrowRight size={18} />}
                onClick={handleStartInterview}
                sx={{
                  background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  borderRadius: 2.5,
                  minWidth: { xs: '160px', md: '180px' },
                  boxShadow: '0 10px 30px rgba(147, 51, 234, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 20px 40px rgba(147, 51, 234, 0.5)',
                    '&:before': {
                      left: '100%',
                    },
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {session ? 'Go to Dashboard' : 'Start Interview'}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleTryDemo}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  px: { xs: 3, md: 4 },
                  py: { xs: 1.25, md: 1.5 },
                  borderRadius: 2.5,
                  minWidth: { xs: '160px', md: '180px' },
                  backdropFilter: 'blur(10px)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  '&:hover': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 25px rgba(255, 255, 255, 0.1)',
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                Try Demo
              </Button>
            </Box>
          </motion.div>

          {/* Enhanced Feature Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: { xs: 4, sm: 6 },
                pt: 6,
                flexWrap: 'wrap',
              }}
            >
              {[
                { icon: Brain, text: 'AI-Powered' },
                { icon: Target, text: 'Domain-Specific' },
                { icon: Sparkles, text: 'Real-time Feedback' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      color: 'rgba(255, 255, 255, 0.8)',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.05)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <feature.icon size={20} />
                    <Typography variant="body2" fontWeight={500}>
                      {feature.text}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </motion.div>
      </Box>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Box
            sx={{
              width: 24,
              height: 40,
              border: '2px solid rgba(255, 255, 255, 0.4)',
              borderRadius: 6,
              display: 'flex',
              justifyContent: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                borderColor: 'rgba(255, 255, 255, 0.6)',
              },
              transition: 'border-color 0.3s ease',
            }}
          >
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 4,
                height: 12,
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                borderRadius: 2,
                marginTop: 8,
              }}
            />
          </Box>
        </motion.div>
      </motion.div>
    </Box>
  );
}
