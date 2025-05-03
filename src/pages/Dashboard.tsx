
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useServer } from '../contexts/ServerContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Server, Plus, CreditCard, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { userServers, loading, refreshServerData } = useServer();
  
  useEffect(() => {
    const interval = setInterval(() => {
      refreshServerData();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refreshServerData]);
  
  if (!user) return null;
  
  const getResourcePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'server-status-online';
      case 'offline':
        return 'server-status-offline';
      case 'starting':
        return 'server-status-starting';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.username}</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your game servers from this dashboard
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {user.subscription ? (
            <div className="flex items-center bg-muted px-4 py-2 rounded-md">
              <CreditCard className="h-5 w-5 text-game-primary mr-2" />
              <span className="text-sm">
                <span className="font-medium capitalize">{user.subscription}</span> Plan
              </span>
            </div>
          ) : (
            <Link to="/plans">
              <Button variant="outline" className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Upgrade Plan
              </Button>
            </Link>
          )}
          
          <Link to="/servers/new">
            <Button className="bg-game-primary hover:bg-game-secondary">
              <Plus className="h-5 w-5 mr-2" /> New Server
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Server Quota</CardTitle>
            <CardDescription>Your server allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{userServers.length} / {user.serverLimit}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              {userServers.length < user.serverLimit 
                ? `You can create ${user.serverLimit - userServers.length} more servers`
                : "You've reached your server limit"}
            </div>
            {userServers.length >= user.serverLimit && (
              <Link to="/plans" className="mt-4 inline-block">
                <Button variant="outline" size="sm" className="text-xs">
                  <CreditCard className="h-4 w-4 mr-1" /> Upgrade Plan
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Servers</CardTitle>
            <CardDescription>Currently running servers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {userServers.filter(server => server.status === 'online').length}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {userServers.filter(server => server.status === 'online').length > 0
                ? "Servers currently consuming resources"
                : "No active servers"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {user.subscription || "Free Tier"}
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {user.subscription 
                ? "Active subscription" 
                : "Limited features and resources"}
            </div>
            
            {!user.subscription && (
              <Link to="/plans" className="mt-4 inline-block">
                <Button size="sm" className="bg-game-primary hover:bg-game-secondary text-xs">
                  <CreditCard className="h-4 w-4 mr-1" /> View Plans
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Your Servers</h2>
          <Link to="/servers">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-game-primary"></div>
          </div>
        ) : userServers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userServers.slice(0, 3).map((server) => (
              <Link to={`/servers/${server.id}`} key={server.id} className="block">
                <div className="server-card">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className={getStatusClass(server.status)}></div>
                      <h3 className="font-medium">{server.name}</h3>
                    </div>
                    <Server className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>RAM</span>
                        <span>{server.resources.ram.used}MB / {server.resources.ram.total}MB</span>
                      </div>
                      <div className="resource-bar">
                        <div
                          className="resource-bar-fill"
                          style={{ width: `${getResourcePercentage(server.resources.ram.used, server.resources.ram.total)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU</span>
                        <span>{server.resources.cpu.used.toFixed(1)} / {server.resources.cpu.total} vCores</span>
                      </div>
                      <div className="resource-bar">
                        <div
                          className="resource-bar-fill"
                          style={{ width: `${getResourcePercentage(server.resources.cpu.used, server.resources.cpu.total)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Disk</span>
                        <span>{(server.resources.disk.used / 1024).toFixed(1)}GB / {(server.resources.disk.total / 1024).toFixed(1)}GB</span>
                      </div>
                      <div className="resource-bar">
                        <div
                          className="resource-bar-fill"
                          style={{ width: `${getResourcePercentage(server.resources.disk.used, server.resources.disk.total)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Port: {server.port}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="bg-muted/50 border border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Server className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No servers yet</h3>
              <p className="text-muted-foreground text-sm mb-4">Create your first game server to get started</p>
              <Link to="/servers/new">
                <Button className="bg-game-primary hover:bg-game-secondary">
                  <Plus className="h-5 w-5 mr-2" /> Create Server
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      
      {!user.subscription && (
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="flex items-center p-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3" />
            <div>
              <h4 className="font-medium mb-1">Limited Access</h4>
              <p className="text-sm text-muted-foreground">
                You're on the free tier with limited resources. 
                <Link to="/plans" className="text-game-primary ml-1 hover:underline">
                  Upgrade your plan
                </Link> to unlock more features and resources.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
