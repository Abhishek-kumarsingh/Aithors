"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography, List, ListItem, ListItemText, ListItemIcon, Chip } from "@mui/material";
import { Calendar, MessageSquare, Trophy, BookOpen, Clock } from "lucide-react";

const activities = [
  {
    id: 1,
    type: "interview",
    title: "Completed Frontend Developer Interview",
    description: "React, JavaScript, CSS",
    timestamp: "2 hours ago",
    score: 85,
    icon: MessageSquare
  },
  {
    id: 2,
    type: "practice",
    title: "Practiced Data Structures",
    description: "Arrays and Linked Lists",
    timestamp: "1 day ago",
    score: 92,
    icon: BookOpen
  },
  {
    id: 3,
    type: "achievement",
    title: "Earned 'Quick Learner' Badge",
    description: "Completed 5 interviews in a week",
    timestamp: "3 days ago",
    icon: Trophy
  },
  {
    id: 4,
    type: "interview",
    title: "Completed Backend Developer Interview",
    description: "Node.js, Express, MongoDB",
    timestamp: "5 days ago",
    score: 78,
    icon: MessageSquare
  },
  {
    id: 5,
    type: "practice",
    title: "Practiced System Design",
    description: "Scalable web applications",
    timestamp: "1 week ago",
    score: 88,
    icon: BookOpen
  }
];

export function ActivityHistory() {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "success";
    if (score >= 75) return "warning";
    return "error";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <List>
          {activities.map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <ListItem key={activity.id} divider={index < activities.length - 1}>
                <ListItemIcon>
                  <IconComponent className="w-5 h-5" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <div className="flex items-center justify-between">
                      <Typography variant="subtitle1" className="font-medium">
                        {activity.title}
                      </Typography>
                      <div className="flex items-center space-x-2">
                        {activity.score && (
                          <Chip
                            label={`${activity.score}%`}
                            size="small"
                            color={getScoreColor(activity.score)}
                            variant="outlined"
                          />
                        )}
                        <div className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          <Typography variant="body2">
                            {activity.timestamp}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  }
                  secondary={activity.description}
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
