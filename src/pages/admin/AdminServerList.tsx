
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useServer } from '@/contexts/ServerContext';
import { RefreshCw, Search, Server } from 'lucide-react';
import { toast } from 'sonner';

const AdminServerList = () => {
  const { servers, loading, refreshServerData } = useServer();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServers, setFilteredServers] = useState(servers);

  useEffect(() => {
    setFilteredServers(servers);
  }, [servers]);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredServers(servers);
      return;
    }
    
    const filtered = servers.filter(server => 
      server.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredServers(filtered);
  };

  const handleRefresh = () => {
    refreshServerData();
    toast.success('Server list refreshed');
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'starting':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Server Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all game servers
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search servers by name..."
            className="pl-8 bg-muted"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Servers</CardTitle>
          <CardDescription>
            Total servers: {filteredServers.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-muted/50 py-2 px-4">
              <div className="col-span-3 font-medium text-sm">Server Name</div>
              <div className="col-span-2 font-medium text-sm">Status</div>
              <div className="col-span-2 font-medium text-sm">RAM</div>
              <div className="col-span-2 font-medium text-sm">CPU</div>
              <div className="col-span-1 font-medium text-sm">Port</div>
              <div className="col-span-2 font-medium text-sm">Actions</div>
            </div>
            
            <div className="divide-y">
              {filteredServers.length > 0 ? filteredServers.map((server) => (
                <div key={server.id} className="grid grid-cols-12 py-3 px-4">
                  <div className="col-span-3 flex items-center">
                    <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{server.name}</span>
                  </div>
                  
                  <div className="col-span-2 text-sm flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusClass(server.status)} mr-2`}></div>
                    <span className="capitalize">{server.status}</span>
                  </div>
                  
                  <div className="col-span-2 text-sm flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span>{server.resources.ram.used} MB</span>
                        <span>{server.resources.ram.total} MB</span>
                      </div>
                      <div className="resource-bar h-1.5 mt-1">
                        <div
                          className="resource-bar-fill"
                          style={{ width: `${Math.round((server.resources.ram.used / server.resources.ram.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 text-sm flex items-center">
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span>{server.resources.cpu.used.toFixed(1)}</span>
                        <span>{server.resources.cpu.total}</span>
                      </div>
                      <div className="resource-bar h-1.5 mt-1">
                        <div
                          className="resource-bar-fill"
                          style={{ width: `${Math.round((server.resources.cpu.used / server.resources.cpu.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-1 text-sm flex items-center">
                    {server.port}
                  </div>
                  
                  <div className="col-span-2 flex items-center space-x-2">
                    <Link to={`/servers/${server.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </div>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No servers found</h3>
                  <p className="text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Server Statistics</CardTitle>
          <CardDescription>Overview of system resources</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Online Servers</div>
              <div className="text-3xl font-bold mt-1">
                {servers.filter(server => server.status === 'online').length}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.round((servers.filter(server => server.status === 'online').length / servers.length) * 100)}% of total
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Total RAM Allocated</div>
              <div className="text-3xl font-bold mt-1">
                {servers.reduce((total, server) => total + server.resources.ram.total, 0)} MB
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {(servers.reduce((total, server) => total + server.resources.ram.total, 0) / 1024).toFixed(1)} GB total
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-md p-4">
              <div className="text-sm text-muted-foreground">Total CPU Allocated</div>
              <div className="text-3xl font-bold mt-1">
                {servers.reduce((total, server) => total + server.resources.cpu.total, 0)} vCores
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Across {servers.length} servers
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminServerList;
