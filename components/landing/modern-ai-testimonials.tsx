"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  Avatar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Star, Quote, ChevronLeft, ChevronRight, Award } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Frontend Developer",
    company: "Google",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "The AI interviewer was incredibly realistic and helped me identify areas I needed to improve. I landed my dream job at Google after practicing here!",
    achievement: "Landed job at Google",
    domain: "Frontend Development",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Data Scientist",
    company: "Microsoft",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "The personalized roadmap feature is game-changing. It gave me a clear path from junior to senior data scientist role.",
    achievement: "Promoted to Senior DS",
    domain: "Data Science",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Full Stack Developer",
    company: "Amazon",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "I was nervous about technical interviews, but this platform's AI feedback helped me build confidence and improve my communication skills.",
    achievement: "Joined Amazon",
    domain: "Full Stack Development",
  },
  {
    id: 4,
    name: "David Kim",
    role: "DevOps Engineer",
    company: "Netflix",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "The real-time feedback during practice sessions was invaluable. I could see exactly where I was going wrong and how to improve.",
    achievement: "Netflix DevOps Role",
    domain: "DevOps & Cloud",
  },
  {
    id: 5,
    name: "Emily Rodriguez",
    role: "Product Manager",
    company: "Spotify",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "Even for non-technical roles, the behavioral interview practice was excellent. The AI understood context and asked relevant follow-ups.",
    achievement: "PM at Spotify",
    domain: "Product Management",
  },
  {
    id: 6,
    name: "Alex Thompson",
    role: "Mobile Developer",
    company: "Uber",
    image: "/api/placeholder/64/64",
    rating: 5,
    text: "The question bank is comprehensive and up-to-date with current industry standards. Highly recommend for mobile developers!",
    achievement: "Senior iOS Developer",
    domain: "Mobile Development",
  },
];

export function ModernAITestimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handleTestimonialClick = (index: number) => {
    setActiveTestimonial(index);
    setIsAutoPlaying(false);
  };

  const activeTestimonialData = testimonials[activeTestimonial];

  return (
    <Box
      component="section"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Modern floating background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
        }}
      />
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 3, lg: 4 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Modern Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.5,
                px: 4,
                py: 2,
                borderRadius: 12,
                background: "rgba(147, 51, 234, 0.1)",
                border: "1px solid rgba(147, 51, 234, 0.3)",
                color: "#a855f7",
                fontWeight: 600,
                mb: 6,
                backdropFilter: "blur(10px)",
              }}
            >
              <Star size={20} fill="currentColor" />
              <Typography variant="body1" fontWeight={600}>
                Success Stories
              </Typography>
            </Box>

            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2rem', md: '2.8rem' },
                fontWeight: 700,
                color: 'white',
                mb: 3,
                textShadow: '0 2px 12px rgba(147, 51, 234, 0.2)',
              }}
            >
              What Our Users{' '}
              <Box
                component="span"
                sx={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Say
              </Box>
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#cbd5e1',
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6,
                fontSize: '1.1rem',
                opacity: 0.9,
              }}
            >
              Real stories from developers who transformed their careers with our AI-powered interview platform.
            </Typography>
          </Box>
        </motion.div>

        {/* Modern Testimonials Layout - Carousel Style */}
        <Box sx={{ position: 'relative', maxWidth: '1000px', mx: 'auto' }}>
          {/* Main Testimonial Card - Modern Design */}
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Box
              sx={{
                position: 'relative',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 100%)',
                backdropFilter: 'blur(20px)',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2)',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(168, 85, 247, 0.8) 50%, transparent 100%)',
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  background: 'linear-gradient(45deg, #a855f7, #ec4899, #3b82f6, #a855f7)',
                  borderRadius: 6,
                  zIndex: -1,
                  opacity: 0.1,
                },
              }}
            >
              {/* Floating Quote Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -15,
                  right: 25,
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)',
                }}
              >
                <Quote size={20} style={{ color: 'white' }} />
              </Box>

              {/* Content */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {/* Rating Stars */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 3 }}>
                  {[...Array(activeTestimonialData.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.3 }}
                    >
                      <Star size={24} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                    </motion.div>
                  ))}
                  <Typography variant="body2" sx={{ color: '#fbbf24', ml: 1, fontWeight: 600 }}>
                    {activeTestimonialData.rating}.0
                  </Typography>
                </Box>

                {/* Testimonial Text */}
                <Typography
                  variant="h5"
                  sx={{
                    color: 'white',
                    lineHeight: 1.5,
                    mb: 3,
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  "{activeTestimonialData.text}"
                </Typography>

                {/* User Info with Achievement */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar
                        src={activeTestimonialData.image}
                        alt={activeTestimonialData.name}
                        sx={{
                          width: 60,
                          height: 60,
                          border: '2px solid rgba(168, 85, 247, 0.4)',
                          boxShadow: '0 6px 20px rgba(168, 85, 247, 0.25)'
                        }}
                      >
                        {activeTestimonialData.name.charAt(0)}
                      </Avatar>
                      {/* Online indicator */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 2,
                          right: 2,
                          width: 16,
                          height: 16,
                          background: '#10b981',
                          borderRadius: '50%',
                          border: '2px solid white',
                        }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, mb: 0.5 }}>
                        {activeTestimonialData.name}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#cbd5e1', fontWeight: 500 }}>
                        {activeTestimonialData.role}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#a855f7', fontWeight: 600 }}>
                        {activeTestimonialData.company}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Achievement Badge */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 3,
                      py: 2,
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 12,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <Award size={20} style={{ color: '#10b981' }} />
                    <Typography variant="body1" sx={{ color: '#10b981', fontWeight: 700 }}>
                      {activeTestimonialData.achievement}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Navigation Dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 6 }}>
            {testimonials.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleTestimonialClick(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: index === activeTestimonial ? 40 : 12,
                  height: 12,
                  borderRadius: 6,
                  border: 'none',
                  cursor: 'pointer',
                  background: index === activeTestimonial
                    ? 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)'
                    : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Box>

          {/* Mini Preview Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            mt: 8,
            maxWidth: '900px',
            mx: 'auto'
          }}>
            {testimonials
              .filter((_, index) => index !== activeTestimonial)
              .slice(0, 3)
              .map((testimonial, index) => {
                const originalIndex = testimonials.findIndex(t => t.id === testimonial.id);
                return (
                  <motion.div
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Box
                      onClick={() => handleTestimonialClick(originalIndex)}
                      sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
                        backdropFilter: 'blur(15px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 4,
                        p: 3,
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
                          borderColor: 'rgba(168, 85, 247, 0.4)',
                          boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)',
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '2px',
                          background: 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                        },
                        '&:hover::before': {
                          opacity: 1,
                        },
                      }}
                    >
                      {/* Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar
                          src={testimonial.image}
                          alt={testimonial.name}
                          sx={{
                            width: 40,
                            height: 40,
                            border: '2px solid rgba(168, 85, 247, 0.3)',
                            transition: 'all 0.3s ease',
                          }}
                        >
                          {testimonial.name.charAt(0)}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="body1" sx={{
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {testimonial.name}
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: '#a855f7',
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }}>
                            {testimonial.company}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} size={12} style={{ color: '#fbbf24', fill: '#fbbf24' }} />
                          ))}
                        </Box>
                      </Box>

                      {/* Quote */}
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#cbd5e1',
                          lineHeight: 1.5,
                          fontSize: '0.85rem',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          fontStyle: 'italic',
                        }}
                      >
                        "{testimonial.text.substring(0, 100)}..."
                      </Typography>
                    </Box>
                  </motion.div>
                );
              })}
          </Box>
        </Box>

        {/* Navigation Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 8 }}>
          {testimonials.map((_, index) => (
            <Box
              key={index}
              component="button"
              onClick={() => handleTestimonialClick(index)}
              sx={{
                width: index === activeTestimonial ? 24 : 12,
                height: 12,
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: index === activeTestimonial
                  ? 'linear-gradient(90deg, #a855f7 0%, #ec4899 100%)'
                  : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          ))}
        </Box>

        {/* Bottom Stats */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          sx={{ mt: 10, position: 'relative' }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(90deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(147, 51, 234, 0.1) 100%)',
              borderRadius: 6,
              m: -4,
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 10,
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 4,
              textAlign: 'center',
              py: 4,
            }}
          >
            {[
              { value: "95%", label: "Success Rate", color: "#10b981" },
              { value: "10K+", label: "Happy Users", color: "#3b82f6" },
              { value: "500+", label: "Companies", color: "#9333ea" },
              { value: "4.9/5", label: "Average Rating", color: "#f59e0b" },
            ].map((stat, index) => (
              <Box
                key={index}
                component={motion.div}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 + 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, scale: 1.05 }}
                sx={{ position: 'relative' }}
              >
                {/* Gradient background for value */}
                <Box
                  sx={{
                    display: 'inline-block',
                    p: 0.5,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                    mb: 1.5,
                    boxShadow: 3,
                    transition: 'box-shadow 0.3s ease',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'background.paper',
                      borderRadius: 3,
                      px: 2,
                      py: 1,
                    }}
                  >
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: { xs: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        mb: 1,
                        background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    fontSize: { xs: '0.875rem', md: '1rem' },
                  }}
                >
                  {stat.label}
                </Typography>

                {/* Subtle glow effect on hover */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    m: -1,
                    '&:hover': {
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
