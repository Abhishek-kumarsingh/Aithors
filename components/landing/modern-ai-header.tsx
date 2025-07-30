"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  MenuItem,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useTheme,
  useMediaQuery,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  Brain,
  ChevronDown,
  Sparkles,
  BookOpen,
  MessageSquare,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const navigationItems = [
  {
    label: "Features",
    href: "#features",
    description: "Discover our AI-powered features"
  },
  {
    label: "How it Works",
    href: "#how-it-works",
    description: "Learn about our process"
  },
  {
    label: "Demo",
    href: "#demo",
    description: "Try our AI interviewer"
  }
];

const productDropdownItems = [
  {
    key: "ai-interviews",
    label: "AI Interviews",
    description: "Practice with our AI interviewer",
    icon: Brain,
    href: "/interviews"
  },
  {
    key: "question-bank",
    label: "Question Bank",
    description: "Access thousands of questions",
    icon: BookOpen,
    href: "/questions"
  },
  {
    key: "roadmaps",
    label: "Learning Roadmaps",
    description: "Personalized career paths",
    icon: BarChart3,
    href: "/roadmaps"
  },
  {
    key: "ai-assistant",
    label: "AI Assistant",
    description: "Get help anytime",
    icon: MessageSquare,
    href: "/assistant"
  }
];

export function ModernAIHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productMenuAnchor, setProductMenuAnchor] = useState<null | HTMLElement>(null);
  const { data: session } = useSession();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProductMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProductMenuAnchor(event.currentTarget);
  };

  const handleProductMenuClose = () => {
    setProductMenuAnchor(null);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(147, 51, 234, 0.1)'
            : '1px solid rgba(255, 255, 255, 0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '60px',
          boxShadow: scrolled
            ? '0 8px 32px rgba(147, 51, 234, 0.15)'
            : '0 4px 20px rgba(0, 0, 0, 0.1)',
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Toolbar sx={{ height: '60px', justifyContent: 'space-between', px: 0 }}>
            {/* Mobile Menu Toggle */}
            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
              <IconButton
                color="inherit"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                sx={{ color: scrolled ? '#1e293b' : 'white' }}
              >
                {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>

            {/* Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 20px rgba(147, 51, 234, 0.4)',
                    },
                  }}
                >
                  <Brain size={26} color="white" />
                </Box>
                <Typography
                  variant="h5"
                  component="span"
                  sx={{
                    fontWeight: 700,
                    fontSize: '1.5rem',
                    background: scrolled
                      ? 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                >
                  Interview AI
                </Typography>
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
              {/* Product Dropdown */}
              <Button
                onClick={handleProductMenuOpen}
                endIcon={<ChevronDown size={16} />}
                sx={{
                  color: scrolled ? '#1e293b' : 'white',
                  fontWeight: 500,
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#9333ea',
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                Product
              </Button>
              <Popper
                open={Boolean(productMenuAnchor)}
                anchorEl={productMenuAnchor}
                role={undefined}
                placement="bottom-start"
                transition
                disablePortal
                sx={{ zIndex: 1300 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper sx={{ width: 320, mt: 1 }}>
                      <ClickAwayListener onClickAway={handleProductMenuClose}>
                        <MenuList>
                          {productDropdownItems.map((item) => (
                            <MenuItem
                              key={item.key}
                              onClick={handleProductMenuClose}
                              component={Link}
                              href={item.href}
                              sx={{ py: 2, px: 2 }}
                            >
                              <ListItemIcon>
                                <item.icon size={20} color="#9333ea" />
                              </ListItemIcon>
                              <Box>
                                <Typography variant="body2" fontWeight={500}>
                                  {item.label}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.description}
                                </Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>

              {/* Regular Navigation Items */}
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  component={Link}
                  href={item.href}
                  sx={{
                    color: scrolled ? '#1e293b' : 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: scrolled
                        ? 'rgba(147, 51, 234, 0.08)'
                        : 'rgba(255, 255, 255, 0.1)',
                      color: '#9333ea',
                      transform: 'translateY(-1px)',
                    },
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      width: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, #9333ea, #ec4899)',
                      transition: 'all 0.3s ease',
                      transform: 'translateX(-50%)',
                    },
                    '&:hover:before': {
                      width: '80%',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {session ? (
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="contained"
                  startIcon={<BarChart3 size={16} />}
                  sx={{
                    background: 'linear-gradient(45deg, #9333ea 30%, #ec4899 90%)',
                    fontWeight: 600,
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
                    },
                  }}
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/auth/login"
                    sx={{
                      color: scrolled ? '#1e293b' : 'white',
                      fontWeight: 500,
                      textTransform: 'none',
                      display: { xs: 'none', lg: 'flex' },
                      px: 3,
                      py: 1,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: scrolled
                          ? 'rgba(147, 51, 234, 0.08)'
                          : 'rgba(255, 255, 255, 0.1)',
                        color: '#9333ea',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    href="/auth/register"
                    variant="contained"
                    startIcon={<Sparkles size={16} />}
                    sx={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
                      fontWeight: 600,
                      textTransform: 'none',
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: '0 4px 14px rgba(147, 51, 234, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(147, 51, 234, 0.4)',
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu */}
      <Drawer
        anchor="top"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            top: '60px',
            backgroundColor: 'background.paper',
            pt: 3,
          },
        }}
      >
        <Container maxWidth="xl">
          {/* Product Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1.5,
                px: 1,
                display: 'block',
              }}
            >
              PRODUCT
            </Typography>
            <List>
              {productDropdownItems.map((item) => (
                <ListItem
                  key={item.key}
                  component={Link}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  sx={{
                    py: 1.5,
                    px: 1,
                    '&:hover': {
                      color: '#9333ea',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  <ListItemIcon>
                    <item.icon size={20} />
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      {item.label}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.description}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Navigation Section */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1.5,
                px: 1,
                display: 'block',
              }}
            >
              NAVIGATION
            </Typography>
            <List>
              {navigationItems.map((item) => (
                <ListItem
                  key={item.label}
                  component={Link}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  sx={{
                    py: 1.5,
                    px: 1,
                    '&:hover': {
                      color: '#9333ea',
                    },
                    transition: 'color 0.2s ease',
                  }}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Auth Section */}
          {!session && (
            <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 3, pb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  component={Link}
                  href="/auth/login"
                  variant="outlined"
                  fullWidth
                  onClick={() => setIsMenuOpen(false)}
                  sx={{ textTransform: 'none' }}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  href="/auth/register"
                  variant="contained"
                  fullWidth
                  startIcon={<Sparkles size={16} />}
                  onClick={() => setIsMenuOpen(false)}
                  sx={{
                    background: 'linear-gradient(45deg, #9333ea 30%, #ec4899 90%)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #7c3aed 30%, #db2777 90%)',
                    },
                  }}
                >
                  Get Started
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </Drawer>
    </motion.div>
  );
}
