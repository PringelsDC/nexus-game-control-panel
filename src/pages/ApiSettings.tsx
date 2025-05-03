
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Database, Server } from 'lucide-react';
import { toast } from 'sonner';
import * as xmanageApi from '../services/xmanageApi';
import * as userApi from '../services/userApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiSettings = () => {
  // XManage API settings
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  
  // Database API settings
  const [dbApiUrl, setDbApiUrl] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);

  useEffect(() => {
    // Load XManage API settings
    const hasApiKey = xmanageApi.hasApiKey();
    setIsConnected(hasApiKey);
    if (hasApiKey) {
      // Don't show the actual API key for security, just indicate it's configured
      setApiKey('••••••••••••••••••••••••••••••');
      // Show the current API URL
      setApiUrl(xmanageApi.getApiUrl());
    } else {
      setApiUrl(xmanageApi.getApiUrl() || 'https://xmanage-api.tirito.de');
    }
    
    // Load Database API settings
    const hasCustomDbUrl = userApi.hasCustomDbUrl();
    setIsDbConnected(hasCustomDbUrl);
    setDbApiUrl(userApi.getDbApiUrl() || '/api/users');
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      // Save API URL first
      if (apiUrl.trim()) {
        xmanageApi.setApiUrl(apiUrl.trim());
      }
      
      // Then save the API key
      xmanageApi.setApiKey(apiKey);
      setIsConnected(true);
      toast.success('XManage API configured successfully');
      
      // Test the connection
      await xmanageApi.getServers();
    } catch (error) {
      console.error('Error configuring XManage API:', error);
      toast.error('Failed to connect to XManage API. Please check your API key and URL.');
      xmanageApi.clearApiKey();
      setIsConnected(false);
    }
  };

  const handleClearApiKey = () => {
    xmanageApi.clearApiKey();
    setApiKey('');
    setIsConnected(false);
    toast.success('XManage API key cleared');
  };
  
  const handleSaveDbApiUrl = async () => {
    if (!dbApiUrl.trim()) {
      toast.error('Please enter a valid database API URL');
      return;
    }

    try {
      // Save the database API URL
      userApi.setDbApiUrl(dbApiUrl.trim());
      setIsDbConnected(true);
      toast.success('Database API URL configured successfully');
      
      // Test the connection
      await userApi.getAllUsers();
    } catch (error) {
      console.error('Error configuring Database API:', error);
      toast.error('Failed to connect to Database API. Please check the URL.');
      setIsDbConnected(false);
    }
  };

  const handleResetDbApiUrl = () => {
    localStorage.removeItem('dbApiUrl');
    setDbApiUrl('/api/users');
    setIsDbConnected(false);
    toast.success('Database API URL reset to default');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your connection to the XManage API and database
        </p>
      </div>

      <Tabs defaultValue="xmanage" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="xmanage" className="flex items-center gap-2">
            <Server className="h-4 w-4" /> XManage API
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" /> Database API
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="xmanage">
          <Card>
            <CardHeader>
              <CardTitle>XManage API Configuration</CardTitle>
              <CardDescription>
                Enter your XManage API key and URL to connect to your server infrastructure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">API URL</label>
                  <Input
                    type="url"
                    placeholder="Enter the XManage API URL"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="mb-4"
                  />
                  <label className="text-sm font-medium mb-2 block">API Key</label>
                  <div className="flex gap-4">
                    <Input
                      type="password"
                      placeholder="Enter your XManage API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveApiKey}>
                      Save Settings
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Generate an API key using the <code>xmanage api key generate</code> command.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Connection Status:</p>
                    <div className="flex items-center">
                      {isConnected ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-green-500">Connected</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500 mr-1" />
                          <span className="text-red-500">Not Connected</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isConnected && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleClearApiKey}
                      className="mt-4"
                    >
                      Clear API Key
                    </Button>
                  )}
                </div>

                {!isConnected && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4">
                    <p className="text-sm">
                      <span className="font-semibold text-amber-500">Demo Mode Active:</span> Without a valid XManage API key, the panel will use demo data and simulated server management.
                    </p>
                  </div>
                )}

                {isConnected && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4">
                    <p className="text-sm">
                      <span className="font-semibold text-green-500">Live Mode Active:</span> Your panel is now connected to the XManage API and will display real server data.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Database API Configuration</CardTitle>
              <CardDescription>
                Configure the connection to your MySQL database API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Database API URL</label>
                  <div className="flex gap-4">
                    <Input
                      type="url"
                      placeholder="Enter the database API URL"
                      value={dbApiUrl}
                      onChange={(e) => setDbApiUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={handleSaveDbApiUrl}>
                      Save URL
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This should be the endpoint that provides access to your user database.
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Connection Status:</p>
                    <div className="flex items-center">
                      {isDbConnected ? (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                          <span className="text-green-500">Custom DB URL Configured</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-5 w-5 text-red-500 mr-1" />
                          <span className="text-red-500">Using Default URL</span>
                        </>
                      )}
                    </div>
                  </div>
                  {isDbConnected && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleResetDbApiUrl}
                      className="mt-4"
                    >
                      Reset to Default
                    </Button>
                  )}
                </div>

                {!isDbConnected && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4">
                    <p className="text-sm">
                      <span className="font-semibold text-amber-500">Using Mock Data:</span> Without a custom database API URL, the panel will use mock user data.
                    </p>
                  </div>
                )}

                {isDbConnected && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4">
                    <p className="text-sm">
                      <span className="font-semibold text-green-500">Live Database:</span> Your panel is now connected to a real database API and will display real user data.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiSettings;
