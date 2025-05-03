
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    displayName: user?.username || '',
    bio: 'I love hosting game servers!'
  });
  
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailUpdates: true,
    serverAlerts: true,
    marketingEmails: false,
    loginAlerts: true
  });
  
  const [loading, setLoading] = useState({
    profile: false,
    security: false,
    notification: false,
    danger: false
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    
    // Simulate API call
    setTimeout(() => {
      setLoading({ ...loading, profile: false });
      toast.success('Profile updated successfully');
    }, 1000);
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (securityForm.newPassword && securityForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    setLoading({ ...loading, security: true });
    
    // Simulate API call
    setTimeout(() => {
      setLoading({ ...loading, security: false });
      toast.success('Password updated successfully');
      setSecurityForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, notification: true });
    
    // Simulate API call
    setTimeout(() => {
      setLoading({ ...loading, notification: false });
      toast.success('Notification preferences updated');
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setLoading({ ...loading, danger: true });
    
    // Simulate API call
    setTimeout(() => {
      setLoading({ ...loading, danger: false });
      toast.success('Account deleted successfully');
      logout();
    }, 1500);
  };

  if (!user) return null;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and settings
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger Zone</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and public profile
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <Input
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is your unique username for login.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Display Name</label>
                    <Input
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">
                      This is how your name will appear in the app.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      className="w-full rounded-md border bg-muted p-3 text-sm"
                      rows={4}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-game-primary hover:bg-game-secondary"
                    disabled={loading.profile}
                  >
                    {loading.profile ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Saving...
                      </span>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Avatar</CardTitle>
                  <CardDescription>
                    Upload a profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl bg-game-primary text-white">
                        {profileForm.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <Button variant="outline" className="w-full">
                      Upload New Image
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, GIF or PNG. Max size 1MB.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Subscription</div>
                      <div className="text-sm text-muted-foreground">
                        {user.subscription ? (
                          <span className="capitalize">{user.subscription} Plan</span>
                        ) : (
                          "Free Tier"
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/plans">Manage</a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Role</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Server Limit</div>
                      <div className="text-sm text-muted-foreground">
                        {user.serverLimit} servers
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="md:col-span-2">
              <form onSubmit={handleSecuritySubmit}>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your password to ensure your account is secure
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <Input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <Input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <Input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className="bg-muted"
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="bg-game-primary hover:bg-game-secondary"
                    disabled={loading.security || !securityForm.currentPassword || !securityForm.newPassword || !securityForm.confirmPassword}
                  >
                    {loading.security ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Updating...
                      </span>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Two-Factor Authentication</div>
                      <div className="text-sm text-muted-foreground">
                        Not enabled
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Last Password Change</div>
                      <div className="text-sm text-muted-foreground">
                        Never
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Login History</div>
                      <div className="text-sm text-muted-foreground">
                        View recent logins
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>• Use a strong, unique password</p>
                  <p>• Enable two-factor authentication</p>
                  <p>• Never share your login credentials</p>
                  <p>• Update your password regularly</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleNotificationSubmit}>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Email Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Receive important updates about your account
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailUpdates} 
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, emailUpdates: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Server Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when your servers have issues or high resource usage
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.serverAlerts} 
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, serverAlerts: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Login Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Receive an email when there's a new login to your account
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.loginAlerts} 
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, loginAlerts: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium">Marketing Emails</div>
                      <div className="text-sm text-muted-foreground">
                        Receive news, offers, and updates about our services
                      </div>
                    </div>
                    <Switch 
                      checked={notificationSettings.marketingEmails} 
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({ ...prev, marketingEmails: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="bg-game-primary hover:bg-game-secondary"
                  disabled={loading.notification}
                >
                  {loading.notification ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2">⏳</span> Saving...
                    </span>
                  ) : (
                    "Save Preferences"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="danger">
          <Card className="border-red-500/20">
            <CardHeader>
              <CardTitle className="text-red-500">Danger Zone</CardTitle>
              <CardDescription>
                Actions here can't be undone
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-500">Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    The following actions are permanent and cannot be reversed. Please proceed with caution.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Delete All Servers</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete all of your game servers and related data
                      </p>
                    </div>
                    <Button variant="destructive">
                      Delete All Servers
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Reset Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reset your account to default settings, including all preferences and configurations
                      </p>
                    </div>
                    <Button variant="destructive">
                      Reset Account
                    </Button>
                  </div>
                </div>
                
                <div className="border border-red-500/50 rounded-md p-4 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-red-500">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                    </div>
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading.danger}
                    >
                      {loading.danger ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2">⏳</span> Deleting...
                        </span>
                      ) : (
                        "Delete Account"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
