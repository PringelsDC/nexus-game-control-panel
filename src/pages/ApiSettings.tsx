
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import * as xmanageApi from '../services/xmanageApi';

const ApiSettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const hasApiKey = xmanageApi.hasApiKey();
    setIsConnected(hasApiKey);
    if (hasApiKey) {
      // Don't show the actual API key for security, just indicate it's configured
      setApiKey('••••••••••••••••••••••••••••••');
    }
  }, []);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }

    try {
      xmanageApi.setApiKey(apiKey);
      setIsConnected(true);
      toast.success('XManage API key configured successfully');
      
      // Test the connection
      await xmanageApi.getServers();
    } catch (error) {
      console.error('Error configuring XManage API:', error);
      toast.error('Failed to connect to XManage API. Please check your API key.');
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your connection to the XManage API
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>XManage API Configuration</CardTitle>
          <CardDescription>
            Enter your XManage API key to connect to your server infrastructure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
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
                  Save Key
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
    </div>
  );
};

export default ApiSettings;
