'use client';

import { useAuthStore, useUIStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { TemplateModal } from '@/components/settings/templates';

export default function SettingsPage() {
  const { user } = useAuthStore();
  const { theme, sidebarOpen, setTheme, setSidebarOpen } = useUIStore();

  return (
    <div className="container mx-auto py-6 space-y-8 px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Theme & Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Theme & Appearance</CardTitle>
            <CardDescription>Customize how AutoCRM looks and feels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sidebar Default State</Label>
                <p className="text-sm text-muted-foreground">Choose if sidebar should be open by default</p>
              </div>
              <Switch
                checked={sidebarOpen}
                onCheckedChange={setSidebarOpen}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Compact Mode</Label>
                <p className="text-sm text-muted-foreground">Use compact density for tables and lists</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for new tickets</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>In-app Notifications</Label>
                <p className="text-sm text-muted-foreground">Show notifications within the application</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notification Sounds</Label>
                <p className="text-sm text-muted-foreground">Play sounds for important notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={user?.user_metadata?.full_name || ""}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue={user?.email || ""}
                placeholder="your.email@example.com"
                disabled
              />
              <p className="text-sm text-muted-foreground">Email cannot be changed</p>
            </div>
          </CardContent>
        </Card>

        {/* Ticket Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Display Preferences</CardTitle>
            <CardDescription>Customize how tickets are displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultView">Default Ticket View</Label>
              <Select defaultValue="table">
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="table">Table View</SelectItem>
                  <SelectItem value="kanban">Kanban View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultSort">Default Sorting</Label>
              <Select defaultValue="newest">
                <SelectTrigger>
                  <SelectValue placeholder="Select sorting" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visible Columns</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Status</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Priority</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Assignee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch defaultChecked />
                  <Label>Due Date</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Macros Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Macros Settings</CardTitle>
            <CardDescription>Configure how macros behave and are displayed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultMacroCategory">Default Macro Category</Label>
              <Select defaultValue="tickets">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tickets">Ticket Macros</SelectItem>
                  <SelectItem value="customer">Customer Macros</SelectItem>
                  <SelectItem value="workflow">Workflow Macros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Quick Apply Macros</Label>
                <p className="text-sm text-muted-foreground">Show macro suggestions based on ticket context</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Macro Keyboard Shortcuts</Label>
                <p className="text-sm text-muted-foreground">Enable keyboard shortcuts for frequently used macros</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Macros</Label>
                <p className="text-sm text-muted-foreground">Allow team members to use your custom macros</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Macro History</Label>
                <p className="text-sm text-muted-foreground">Keep track of applied macros in ticket history</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Template Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Template Settings</CardTitle>
            <CardDescription>Configure your response templates preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="defaultTemplate">Default Template Category</Label>
              <Select defaultValue="support">
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="support">Support Responses</SelectItem>
                  <SelectItem value="sales">Sales Responses</SelectItem>
                  <SelectItem value="general">General Responses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-suggest Templates</Label>
                <p className="text-sm text-muted-foreground">Suggest relevant templates while typing responses</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Template Variables</Label>
                <p className="text-sm text-muted-foreground">Enable dynamic variables in templates (e.g., {`{customer_name}`})</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Share Templates</Label>
                <p className="text-sm text-muted-foreground">Allow team members to use your templates</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <TemplateModal />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
