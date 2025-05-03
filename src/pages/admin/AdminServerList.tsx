
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useServer } from '@/contexts/ServerContext';
import { RefreshCw, Search, Server } from 'lucide-react';
import { toast } from 'sonner';
import * as xmanageApi from '@/services/xmanageApi';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminServerList = () => {
  const { servers, loading, refreshServerData } = useServer();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServers, setFilteredServers] = useState(servers);
  const [isApiConnected, setIsApiConnected] = useState(xmanageApi.hasApiKey());
  const [apiKey, setApiKey] = useState('');
  
  useEffect(() => {
    setFilteredServers(servers);
    setIsApiConnected(xmanageApi.hasApiKey());
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

  const handleConfigureApi = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    try {
      xmanageApi.setApiKey(apiKey);
      setIsApiConnected(true);
      toast.success('XManage API configured successfully');
      refreshServerData();
    } catch (error) {
      console.error('Error configuring XManage API:', error);
      toast.error('Failed to configure XManage API');
    }
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
      
      {!isApiConnected && (
        <Card className="bg-amber-500/10 border-amber-500/20 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-amber-500">XManage API Not Configured</CardTitle>
            <CardDescription>
              Configure your XManage API to manage real servers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">API Key</label>
                <Input 
                  type="text" 
                  placeholder="Enter your XManage API key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
              </div>
              <Button onClick={handleConfigureApi}>
                Configure API
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              To get an API key, use the "xmanage api key generate" command.
            </p>
          </CardContent>
        </Card>
      )}
      
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
            Total servers: {filteredServers.length} {!isApiConnected && '(Demo Data)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Server Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>RAM</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServers.length > 0 ? filteredServers.map((server) => (
                <TableRow key={server.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Server className="h-4 w-4 mr-2 text-muted-foreground" />
                      {server.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full ${getStatusClass(server.status)} mr-2`}></div>
                      <span className="capitalize">{server.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span>{server.resources.ram.used} MB</span>
                        <span>{server.resources.ram.total} MB</span>
                      </div>
                      <div className="h-1.5 mt-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-game-primary rounded-full"
                          style={{ width: `${Math.round((server.resources.ram.used / server.resources.ram.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-xs">
                        <span>{server.resources.cpu.used.toFixed(1)}</span>
                        <span>{server.resources.cpu.total}</span>
                      </div>
                      <div className="h-1.5 mt-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-game-primary rounded-full"
                          style={{ width: `${Math.round((server.resources.cpu.used / server.resources.cpu.total) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {server.port}
                  </TableCell>
                  <TableCell>
                    <Link to={`/servers/${server.id}`}>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Server className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-medium mb-2">No servers found</h3>
                    <p className="text-muted-foreground">Try a different search term</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
                {Math.round((servers.filter(server => server.status === 'online').length / servers.length) * 100) || 0}% of total
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
