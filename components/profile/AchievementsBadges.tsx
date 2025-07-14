"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography, Box } from "@mui/material";
import { Trophy, Star, Target, Zap, Award, Crown } from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Interview",
    description: "Complete your first AI interview",
    icon: Star,
    earned: true,
    earnedDate: "2024-01-15",
    color: "#fbbf24"
  },
  {
    id: 2,
    title: "Quick Learner",
    description: "Complete 5 interviews in a week",
    icon: Zap,
    earned: true,
    earnedDate: "2024-01-20",
    color: "#3b82f6"
  },
  {
    id: 3,
    title: "High Performer",
    description: "Score 90% or higher in an interview",
    icon: Trophy,
    earned: true,
    earnedDate: "2024-01-18",
    color: "#10b981"
  },
  {
    id: 4,
    title: "Consistent",
    description: "Complete interviews for 7 consecutive days",
    icon: Target,
    earned: false,
    color: "#8b5cf6"
  },
  {
    id: 5,
    title: "Expert Level",
    description: "Achieve expert level in any domain",
    icon: Award,
    earned: false,
    color: "#f59e0b"
  },
  {
    id: 6,
    title: "Interview Master",
    description: "Complete 100 interviews",
    icon: Crown,
    earned: false,
    color: "#ef4444"
  }
];

export function AchievementsBadges() {
  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Achievements & Badges</CardTitle>
          <Typography variant="body2" className="text-gray-600">
            {earnedCount} of {totalCount} achievements unlocked
          </Typography>
        </CardHeader>
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <Box
                  key={achievement.id}
                    sx={{
                      p: 3,
                      border: 1,
                      borderColor: achievement.earned ? achievement.color : 'grey.300',
                      borderRadius: 2,
                      textAlign: 'center',
                      opacity: achievement.earned ? 1 : 0.6,
                      backgroundColor: achievement.earned ? `${achievement.color}10` : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: achievement.earned ? 'translateY(-2px)' : 'none',
                        boxShadow: achievement.earned ? 2 : 0
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        backgroundColor: achievement.earned ? achievement.color : 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      <IconComponent 
                        size={30} 
                        color="white"
                      />
                    </Box>
                    <Typography variant="h6" className="font-semibold mb-1">
                      {achievement.title}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {achievement.description}
                    </Typography>
                    {achievement.earned && achievement.earnedDate && (
                      <Typography variant="caption" className="text-gray-500">
                        Earned on {new Date(achievement.earnedDate).toLocaleDateString()}
                      </Typography>
                    )}
                    {!achievement.earned && (
                      <Typography variant="caption" className="text-gray-400">
                        Not yet earned
                      </Typography>
                    )}
                  </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
