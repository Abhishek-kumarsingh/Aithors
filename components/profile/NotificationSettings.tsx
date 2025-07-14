"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch, FormControlLabel, Typography, Divider } from "@mui/material";

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Interview reminders"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Get notified about upcoming interviews
          </Typography>
          
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Performance updates"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Receive updates about your interview performance
          </Typography>
          
          <FormControlLabel
            control={<Switch />}
            label="Weekly summary"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Get a weekly summary of your progress
          </Typography>
          
          <FormControlLabel
            control={<Switch />}
            label="Product updates"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Stay informed about new features and improvements
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Browser notifications"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Receive notifications in your browser
          </Typography>
          
          <FormControlLabel
            control={<Switch />}
            label="Mobile notifications"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Get notifications on your mobile device
          </Typography>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="AI feedback notifications"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Get notified when AI provides feedback on your interviews
          </Typography>
          
          <FormControlLabel
            control={<Switch />}
            label="Community updates"
          />
          <Typography variant="body2" className="text-gray-600 ml-8">
            Receive updates from the Interview AI community
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
