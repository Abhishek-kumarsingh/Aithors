"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, Box, Typography, Chip } from "@mui/material";
import { Edit, Mail, Calendar, MapPin } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  profile?: {
    preferredDomains?: string[];
    experienceLevel?: string;
    bio?: string;
    location?: string;
    joinedDate?: string;
  };
}

interface ProfileOverviewProps {
  user: User;
  onEdit: () => void;
}

export function ProfileOverview({ user, onEdit }: ProfileOverviewProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Profile Overview</CardTitle>
            <Button onClick={onEdit} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar
              src={user.image}
              sx={{ width: 80, height: 80 }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex-1">
              <Typography variant="h5" className="font-semibold mb-2">
                {user.name}
              </Typography>
              <div className="space-y-2">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </div>
                {user.profile?.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user.profile.location}
                  </div>
                )}
                {user.profile?.joinedDate && (
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(user.profile.joinedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {user.profile?.bio && (
            <div className="mt-4">
              <Typography variant="body1" className="text-gray-700">
                {user.profile.bio}
              </Typography>
            </div>
          )}

          <div className="mt-4">
            <Typography variant="subtitle2" className="font-medium mb-2">
              Experience Level
            </Typography>
            <Chip 
              label={user.profile?.experienceLevel || 'Not specified'} 
              color="primary" 
              variant="outlined" 
            />
          </div>

          {user.profile?.preferredDomains && user.profile.preferredDomains.length > 0 && (
            <div className="mt-4">
              <Typography variant="subtitle2" className="font-medium mb-2">
                Preferred Domains
              </Typography>
              <div className="flex flex-wrap gap-2">
                {user.profile.preferredDomains.map((domain, index) => (
                  <Chip 
                    key={index} 
                    label={domain} 
                    size="small" 
                    variant="outlined" 
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
