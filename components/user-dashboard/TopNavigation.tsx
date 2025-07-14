"use client";

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Button,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Home,
  Assessment,
  SmartToy,
  QuestionAnswer,
  School,
  Feedback,
  Notifications,
  Settings,
  Logout,
  AccountCircle,
  DarkMode,
  LightMode,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

interface TopNavigationProps {
  currentSection: number;
  onSectionChange: (section: number) => void;
  user?: {
    name: string;
    email: string;
    image?: string;
  };
  notifications?: number;
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home />,
    path: '/dashboard/home',
    color: '#3b82f6'
  },
  {
    id: 'interview',
    label: 'Interview',
    icon: <QuestionAnswer />,
    path: '/dashboard/interview',
    color: '#f59e0b'
  },
  {
    id: 'practice',
    label: 'Practice',
    icon: <School />,
    path: '/dashboard/practice',
    color: '#ef4444'
  },
  {
    id: 'ai-assistant',
    label: 'AI Assistant',
    icon: <SmartToy />,
    path: '/dashboard/ai-assistant',
    color: '#10b981'
  },
  {
    id: 'feedback',
    label: 'Feedback',
    icon: <Feedback />,
    path: '/dashboard/feedback',
    color: '#06b6d4'
  }
];

export const TopNavigation: React.FC<TopNavigationProps> = ({
  currentSection,
  onSectionChange,
  user,
  notifications = 0,
  darkMode = false,
  onDarkModeToggle
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/auth/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleProfileMenuClose();
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedItem = navigationItems[newValue];
    if (selectedItem) {
      router.push(selectedItem.path);
      onSectionChange(newValue);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {/* Logo/Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  cursor: 'pointer'
                }}
                onClick={() => router.push('/dashboard')}
              >
                <SmartToy sx={{ color: 'white', fontSize: 24 }} />
              </Box>
            </motion.div>
            
            {!isMobile && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  InterviewAI
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Dashboard
                </Typography>
              </Box>
            )}
          </Box>

          {/* Navigation Tabs */}
          {!isMobile ? (
            <Box sx={{ flex: 1 }}>
              <Tabs
                value={currentSection}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 48,
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    '&.Mui-selected': {
                      fontWeight: 600
                    }
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: '3px 3px 0 0'
                  }
                }}
              >
                {navigationItems.map((item, index) => (
                  <Tab
                    key={item.id}
                    icon={item.icon as React.ReactElement}
                    label={item.label}
                    iconPosition="start"
                    sx={{
                      color: currentSection === index ? item.color : 'text.secondary',
                      '&.Mui-selected': {
                        color: item.color
                      }
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          ) : (
            <Box sx={{ flex: 1 }}>
              <IconButton
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{ color: 'text.primary' }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          {/* Right Side Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton sx={{ color: 'text.primary' }}>
                <Badge badgeContent={notifications} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Dark Mode Toggle */}
            {onDarkModeToggle && (
              <Tooltip title={darkMode ? 'Light Mode' : 'Dark Mode'}>
                <IconButton onClick={onDarkModeToggle} sx={{ color: 'text.primary' }}>
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            )}

            {/* User Profile */}
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {!isMobile && (
                  <Box sx={{ textAlign: 'right', mr: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.2 }}>
                      {user.email}
                    </Typography>
                  </Box>
                )}
                
                <Tooltip title="Account">
                  <IconButton onClick={handleProfileMenuOpen}>
                    <Avatar
                      src={user.image}
                      sx={{ width: 36, height: 36 }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>
        </Toolbar>

        {/* Mobile Navigation */}
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Box sx={{ px: 2, pb: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {navigationItems.map((item, index) => (
                  <Button
                    key={item.id}
                    startIcon={item.icon}
                    onClick={() => {
                      onSectionChange(index);
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      color: currentSection === index ? item.color : 'text.secondary',
                      bgcolor: currentSection === index ? `${item.color}15` : 'transparent',
                      '&:hover': {
                        bgcolor: `${item.color}10`
                      }
                    }}
                  >
                    {item.label}
                    {item.id === 'ai-assistant' && notifications > 0 && (
                      <Chip
                        size="small"
                        label={notifications}
                        color="error"
                        sx={{ ml: 'auto', height: 20, fontSize: '0.75rem' }}
                      />
                    )}
                  </Button>
                ))}
              </Box>
            </Box>
          </motion.div>
        )}
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { mt: 1, minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => { router.push('/dashboard/profile'); handleProfileMenuClose(); }}>
          <AccountCircle sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <MenuItem onClick={() => { router.push('/dashboard/settings'); handleProfileMenuClose(); }}>
          <Settings sx={{ mr: 2 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <Logout sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
