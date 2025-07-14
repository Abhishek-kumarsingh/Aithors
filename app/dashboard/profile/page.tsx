"use client";

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit,
  Settings,
  Security,
  Notifications,
  Download,
  Share,
  MoreVert,
  School,
  Work,
  Code,
  TrendingUp,
  Star,
  EmojiEvents
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

// Import components
import { TopNavigation } from '@/components/user-dashboard/TopNavigation';
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { ProfileEdit } from '@/components/profile/ProfileEdit';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { SecuritySettings } from '@/components/profile/SecuritySettings';
import { NotificationSettings } from '@/components/profile/NotificationSettings';
import { ActivityHistory } from '@/components/profile/ActivityHistory';
import { AchievementsBadges } from '@/components/profile/AchievementsBadges';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  skills: string[];
  experience: string;
  education: string;
  currentRole?: string;
  company?: string;
  interests: string[];
  goals: string[];
  timezone: string;
  language: string;
  isPublic: boolean;
  joinedAt: string;
  lastActive: string;
  stats: {
    totalInterviews: number;
    totalPractice: number;
    averageScore: number;
    streakDays: number;
    totalTimeSpent: number;
    questionsCompleted: number;
    rank: number;
    level: number;
    xp: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }>;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
      achievements: boolean;
      weeklyReport: boolean;
    };
    privacy: {
      profileVisibility: 'public' | 'private' | 'friends';
      showStats: boolean;
      showActivity: boolean;
      showAchievements: boolean;
    };
    dashboard: {
      defaultSection: string;
      showTips: boolean;
      compactMode: boolean;
    };
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [currentSection] = useState(5); // Profile section
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const tabs = [
    { label: 'Overview', icon: <School /> },
    { label: 'Edit Profile', icon: <Edit /> },
    { label: 'Account', icon: <Settings /> },
    { label: 'Security', icon: <Security /> },
    { label: 'Notifications', icon: <Notifications /> },
    { label: 'Activity', icon: <TrendingUp /> },
    { label: 'Achievements', icon: <EmojiEvents /> }
  ];

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile');
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.profile);

    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.profile);
      setEditMode(false);

    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  // Export profile data
  const exportProfile = async () => {
    try {
      const response = await fetch('/api/user/profile/export');
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile-${profile?.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting profile:', error);
    }
  };

  // Share profile
  const shareProfile = async () => {
    if (navigator.share && profile) {
      try {
        await navigator.share({
          title: `${profile.name}'s Profile - InterviewAI`,
          text: `Check out ${profile.name}'s coding interview progress!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing profile:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    window.location.href = '/auth/login';
    return null;
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Profile not found'}
        </Alert>
      </Container>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <ProfileOverview user={profile} onEdit={() => setActiveTab(1)} />;
      case 1:
        return <ProfileEdit user={profile} onSave={updateProfile} onCancel={() => setActiveTab(0)} />;
      case 2:
        return <AccountSettings />;
      case 3:
        return <SecuritySettings />;
      case 4:
        return <NotificationSettings />;
      case 5:
        return <ActivityHistory />;
      case 6:
        return <AchievementsBadges />;
      default:
        return <ProfileOverview user={profile} onEdit={() => setActiveTab(1)} />;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top Navigation */}
      <TopNavigation
        currentSection={currentSection}
        onSectionChange={() => {}}
        user={session?.user}
      />

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={profile.avatar}
                      sx={{ width: 80, height: 80 }}
                    >
                      {profile.name.charAt(0).toUpperCase()}
                    </Avatar>
                    
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {profile.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip
                          icon={<Star />}
                          label={`Level ${profile.stats.level}`}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          icon={<TrendingUp />}
                          label={`Rank #${profile.stats.rank}`}
                          color="secondary"
                          size="small"
                        />
                        <Chip
                          icon={<EmojiEvents />}
                          label={`${profile.stats.xp} XP`}
                          color="warning"
                          size="small"
                        />
                        {profile.currentRole && (
                          <Chip
                            icon={<Work />}
                            label={profile.currentRole}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                      
                      {profile.bio && (
                        <Typography variant="body1" color="text.secondary">
                          {profile.bio}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      onClick={() => setActiveTab(1)}
                    >
                      Edit Profile
                    </Button>
                    
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={shareProfile}
                    >
                      Share
                    </Button>
                    
                    <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card sx={{ mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            >
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              ))}
            </Tabs>
          </Card>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Container>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { exportProfile(); setMenuAnchor(null); }}>
          <Download sx={{ mr: 1 }} />
          Export Profile Data
        </MenuItem>
        <MenuItem onClick={() => { setActiveTab(3); setMenuAnchor(null); }}>
          <Security sx={{ mr: 1 }} />
          Privacy Settings
        </MenuItem>
        <MenuItem onClick={() => { setActiveTab(2); setMenuAnchor(null); }}>
          <Settings sx={{ mr: 1 }} />
          Account Settings
        </MenuItem>
      </Menu>
    </Box>
  );
}
