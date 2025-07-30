"use client";

import { motion } from "framer-motion";
import { Button, Box, Typography } from "@mui/material";
import { 
  Brain, 
  Twitter, 
  Github, 
  Linkedin, 
  Mail,
  MapPin,
  Phone,
  ArrowRight,
  Heart
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Demo", href: "#demo" },
    { name: "Roadmaps", href: "#roadmaps" }
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Blog", href: "/blog" },
    { name: "Press", href: "/press" },
    { name: "Contact", href: "/contact" }
  ],
  resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Help Center", href: "/help" },
    { name: "Community", href: "/community" },
    { name: "API Reference", href: "/api" },
    { name: "Status", href: "/status" }
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "GDPR", href: "/gdpr" },
    { name: "Security", href: "/security" }
  ]
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/interviewai" },
  { name: "GitHub", icon: Github, href: "https://github.com/interviewai" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/interviewai" },
  { name: "Email", icon: Mail, href: "mailto:contact@aithor.in" }
];

const contactNumbers = [
  "+91-9876543210",
  "+91-8765432109",
  "+91-7654321098",
  "+91-6543210987",
  "+91-5432109876",
  "+91-4321098765",
  "+91-3210987654",
  "+91-2109876543",
  "+91-1098765432",
  "+91-9087654321"
];

export function ModernAIFooter() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        color: 'white',
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
            radial-gradient(circle at 25% 25%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)
          `,
        },
      }}
    >
      {/* Enhanced Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '25%',
          width: '24rem',
          height: '24rem',
          background: 'radial-gradient(circle, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          right: '25%',
          width: '20rem',
          height: '20rem',
          background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
        }}
      />
      {/* Newsletter Section */}
      <Box sx={{ borderBottom: '1px solid #1e293b' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 8, position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                sx={{
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  color: 'white',
                }}
              >
                Stay Updated with{" "}
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  Interview AI
                </Box>
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  color: '#cbd5e1',
                  mb: 4,
                  maxWidth: '600px',
                  mx: 'auto',
                }}
              >
                Get the latest updates on new features, interview tips, and career advice
                delivered straight to your inbox.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center',
                  maxWidth: '400px',
                  mx: 'auto',
                }}
              >
                <Box
                  component="input"
                  type="email"
                  placeholder="Enter your email address"
                  sx={{
                    flex: 1,
                    px: 2,
                    py: 1.5,
                    borderRadius: 2,
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    color: 'white',
                    '&::placeholder': {
                      color: '#94a3b8',
                    },
                    '&:focus': {
                      outline: 'none',
                      borderColor: '#9333ea',
                      boxShadow: '0 0 0 2px rgba(147, 51, 234, 0.2)',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  endIcon={<ArrowRight size={16} />}
                  sx={{
                    background: 'linear-gradient(45deg, #9333ea 30%, #ec4899 90%)',
                    color: 'white',
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Main Footer Content */}
      <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(6, 1fr)' }, gap: 4 }}>
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box sx={{ gridColumn: { lg: 'span 2' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                  Interview AI
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: '#cbd5e1',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Empowering job seekers with AI-powered interview practice,
                personalized feedback, and career roadmaps to land their dream jobs.
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                  <MapPin className="w-4 h-4 text-purple-400" />
                  <Typography variant="body2">Noida, Delhi, India</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                  <Phone className="w-4 h-4 text-purple-400" />
                  <Typography variant="body2">{contactNumbers[0]}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                  <Mail className="w-4 h-4 text-purple-400" />
                  <Typography variant="body2">contact@aithor.in</Typography>
                </Box>

                {/* Additional Contact Numbers */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ color: '#94a3b8', mb: 1, fontWeight: 500 }}>
                    Support Lines:
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {contactNumbers.slice(1, 4).map((number, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                        <Phone className="w-3 h-3 text-purple-400" />
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{number}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>
          </motion.div>

          {/* Product Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
              Product
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.product.map((link) => (
                <Box component="li" key={link.name}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#cbd5e1';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
              Company
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.company.map((link) => (
                <Box component="li" key={link.name}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#cbd5e1';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
              Resources
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.resources.map((link) => (
                <Box component="li" key={link.name}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#cbd5e1';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: 'white' }}>
              Legal
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {footerLinks.legal.map((link) => (
                <Box component="li" key={link.name}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.color = 'white';
                      (e.target as HTMLElement).style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.color = '#cbd5e1';
                      (e.target as HTMLElement).style.textDecoration = 'none';
                    }}
                  >
                    {link.name}
                  </Link>
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* Bottom Section */}
      <Box sx={{ borderTop: '1px solid #1e293b' }}>
        <Box sx={{ maxWidth: '1280px', mx: 'auto', px: { xs: 2, sm: 3, lg: 4 }, py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {/* Copyright */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                <Typography variant="body2">© 2025 Aithor. Made with</Typography>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
                <Typography variant="body2">for job seekers in India and beyond.</Typography>
              </Box>

              {/* Social Links */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      backgroundColor: '#1e293b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.2s ease',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#334155';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#1e293b';
                    }}
                  >
                    <social.icon
                      className="w-5 h-5 text-slate-400 transition-colors duration-200"
                      style={{ color: '#94a3b8' }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.color = '#94a3b8';
                      }}
                    />
                  </Link>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
}
