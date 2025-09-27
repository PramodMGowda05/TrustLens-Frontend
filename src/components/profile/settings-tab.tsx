"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";
import { Apple, Bot, Facebook, FileDown, Trash2 } from "lucide-react";

export function SettingsTab() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="current-password">Change Password</Label>
            <Input id="current-password" type="password" placeholder="Current Password" />
            <Input id="new-password" type="password" placeholder="New Password" />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates and alerts via email.</p>
            </div>
            <Switch id="email-notifications" />
          </div>
        </CardContent>
      </Card>
      
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
             <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger id="theme">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System Default</SelectItem>
                </SelectContent>
              </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select defaultValue="en">
              <SelectTrigger id="language">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="bn">Bengali</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage third-party accounts connected to TrustLens.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-red-500 text-white p-2 rounded-md"><Bot/></div>
               <span className="font-medium">Google</span>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="bg-blue-600 text-white p-2 rounded-md"><Facebook/></div>
               <span className="font-medium">Facebook</span>
            </div>
            <Button variant="destructive">Disconnect</Button>
          </div>
           <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-md"><Apple/></div>
               <span className="font-medium">Apple</span>
            </div>
            <Button variant="outline">Connect</Button>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy</CardTitle>
          <CardDescription>Control your personal data and account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <FileDown /> Download Account Data
          </Button>
          <Button variant="destructive" className="w-full justify-start gap-2">
            <Trash2 /> Delete Account
          </Button>
        </CardContent>
         <CardFooter className="border-t pt-6">
            <p className="text-xs text-muted-foreground">
                Deleting your account is a permanent action and cannot be undone.
            </p>
        </CardFooter>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </div>
    </div>
  );
}
