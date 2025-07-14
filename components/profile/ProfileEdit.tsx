"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField, Box, Typography, Chip, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Save, X } from "lucide-react";

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
  };
}

interface ProfileEditProps {
  user: User;
  onSave: (updatedProfile: any) => void;
  onCancel: () => void;
}

const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const availableDomains = [
  'Frontend Development',
  'Backend Development',
  'Full Stack Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'UI/UX Design'
];

export function ProfileEdit({ user, onSave, onCancel }: ProfileEditProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.profile?.bio || '',
    location: user.profile?.location || '',
    experienceLevel: user.profile?.experienceLevel || '',
    preferredDomains: user.profile?.preferredDomains || []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDomainToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDomains: prev.preferredDomains.includes(domain)
        ? prev.preferredDomains.filter(d => d !== domain)
        : [...prev.preferredDomains, domain]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />

          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
          />

          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="City, Country"
          />

          <FormControl fullWidth>
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={formData.experienceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
              label="Experience Level"
            >
              {experienceLevels.map(level => (
                <MenuItem key={level} value={level}>{level}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <div>
            <Typography variant="subtitle2" className="font-medium mb-2">
              Preferred Domains
            </Typography>
            <div className="flex flex-wrap gap-2">
              {availableDomains.map(domain => (
                <Chip
                  key={domain}
                  label={domain}
                  onClick={() => handleDomainToggle(domain)}
                  color={formData.preferredDomains.includes(domain) ? "primary" : "default"}
                  variant={formData.preferredDomains.includes(domain) ? "filled" : "outlined"}
                  clickable
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
