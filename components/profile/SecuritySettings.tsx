"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch, FormControlLabel, Typography, List, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { Shield, Smartphone, Key, Clock } from "lucide-react";

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormControlLabel
            control={<Switch />}
            label="Enable Two-Factor Authentication"
          />
          <Typography variant="body2" className="text-gray-600">
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </Typography>
          <Button variant="outline">
            <Smartphone className="w-4 h-4 mr-2" />
            Setup Authenticator App
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body2" className="text-gray-600 mb-4">
            These are the devices that are currently logged into your account.
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Shield className="w-5 h-5" />
              </ListItemIcon>
              <ListItemText
                primary="Current Session"
                secondary="Windows • Chrome • Last active now"
              />
              <Typography variant="body2" className="text-green-600">
                Current
              </Typography>
            </ListItem>
          </List>
          <Button variant="outline" className="mt-4">
            Sign out all other sessions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body2" className="text-gray-600 mb-4">
            Manage your API keys for third-party integrations.
          </Typography>
          <Button variant="outline">
            <Key className="w-4 h-4 mr-2" />
            Generate New API Key
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
