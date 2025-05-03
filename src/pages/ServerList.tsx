
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useServer } from '../contexts/ServerContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Server, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as xmanageApi from '../services/xmanageApi';
import { toast } from 'sonner';

const ServerList = () => {
  const { userServers, loading, refreshServerData } = useServer();
  const { user } = useAuth();
  const isApiConnected = xmanageApi.hasApiKey();

  useEffect(() => {
    refreshServerData();
    
    const intervalId = setInterval(() => {
      refreshServerData();
    }, 10000);
    
    return () => clearInterval(intervalId);
  }, [refreshServerData]);
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'w-2 h-2 rounded-full bg-green-500';
      case 'offline':
        return 'w-2 h-2 rounded-full bg-red-500';
      case 'starting':
        return 'w-2 h-2 rounded-full bg-yellow-500';
      default:
        return 'w-2 h-2 rounded-full bg-gray-500';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'starting':
        return 'Starting';
      default:
        return 'Unknown';
    }
  };

  const onlineServers = userServers.filter(server => server.status === 'online');
  const offlineServers = userServers.filter(server => server.status === 'offline');
  const startingServers = userServers.filter(server => server.status === 'starting');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Servers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor all your game servers
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={refreshServerData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {userServers.length < (user?.serverLimit || 0) && (
            <Link to="/servers/new">
              <Button className="bg-game-primary hover:bg-game-secondary">
                <Plus className="h-4 w-4 mr-2" /> New Server
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {!isApiConnected && (
        <Card className="bg-blue-500/10 border-blue-500/20 mb-6">
          <CardContent className="p-4 text-sm">
            You're viewing demo servers. Configure the XManage API in the admin panel for real server management.
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            All ({userServers.length})
          </TabsTrigger>
          <TabsTrigger value="online">
            Online ({onlineServers.length})
          </TabsTrigger>
          <TabsTrigger value="offline">
            Offline ({offlineServers.length})
          </TabsTrigger>
          <TabsTrigger value="starting">
            Starting ({startingServers.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {renderServerGrid(userServers, loading, getStatusClass, getStatusLabel)}
        </TabsContent>
        
        <TabsContent value="online">
          {renderServerGrid(onlineServers, loading, getStatusClass, getStatusLabel)}
        </TabsContent>
        
        <TabsContent value="offline">
          {renderServerGrid(offlineServers, loading, getStatusClass, getStatusLabel)}
        </TabsContent>
        
        <TabsContent value="starting">
          {renderServerGrid(startingServers, loading, getStatusClass, getStatusLabel)}
        </TabsContent>
      </Tabs>
      
      {userServers.length >= (user?.serverLimit || 0) && (
        <Card className="bg-muted/50 border border-dashed">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="font-medium mb-1">Server Limit Reached</h3>
              <p className="text-sm text-muted-foreground">
                You've reached your server limit ({user?.serverLimit || 0}). 
              </p>
            </div>
            <Link to="/plans">
              <Button className="bg-game-primary hover:bg-game-secondary">
                Upgrade Plan
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const renderServerGrid = (servers: any[], loading: boolean, getStatusClass: Function, getStatusLabel: Function) => {
  if (loading && servers.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary"></div>
      </div>
    );
  }
  
  if (servers.length === 0) {
    return (
      <div className="text-center py-12">
        <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No servers found</h3>
        <p className="text-muted-foreground mb-6">No servers matching the selected filter</p>
        <Link to="/servers/new">
          <Button className="bg-game-primary hover:bg-game-secondary">
            <Plus className="h-4 w-4 mr-2" /> Create Server
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servers.map((server) => (
        <Link to={`/servers/${server.id}`} key={server.id} className="block">
          <Card className="h-full hover:border-game-primary/50 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`${getStatusClass(server.status)} mr-2`}></div>
                  <h3 className="font-medium">{server.name}</h3>
                </div>
                <div className="text-xs px-2 py-1 rounded-full bg-muted">
                  {getStatusLabel(server.status)}
                </div>
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>RAM</span>
                    <span>{server.resources.ram.used}MB / {server.resources.ram.total}MB</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-game-primary rounded-full"
                      style={{ width: `${(server.resources.ram.used / server.resources.ram.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>CPU</span>
                    <span>{server.resources.cpu.used.toFixed(1)} / {server.resources.cpu.total} vCores</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-game-primary rounded-full"
                      style={{ width: `${(server.resources.cpu.used / server.resources.cpu.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Disk</span>
                    <span>{(server.resources.disk.used / 1024).toFixed(1)}GB / {(server.resources.disk.total / 1024).toFixed(1)}GB</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-game-primary rounded-full"
                      style={{ width: `${(server.resources.disk.used / server.resources.disk.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Port: {server.port}</span>
                <span>View Details →</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default ServerList;
