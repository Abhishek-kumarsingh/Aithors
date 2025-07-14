"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TextField, Switch, FormControlLabel, Typography, Divider } from "@mui/material";
import { Save, Trash2 } from "lucide-react";

export function AccountSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            defaultValue="user@example.com"
            disabled
            helperText="Contact support to change your email address"
          />
          
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            placeholder="Enter current password"
          />
          
          <TextField
            fullWidth
            label="New Password"
            type="password"
            placeholder="Enter new password"
          />
          
          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
          />
          
          <Button className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Update Password
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Make profile public"
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label="Allow others to see my interview history"
          />
          <FormControlLabel
            control={<Switch />}
            label="Receive marketing emails"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </Typography>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
