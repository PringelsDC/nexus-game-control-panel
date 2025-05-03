
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useServer } from '../contexts/ServerContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Square, 
  RefreshCw, 
  Terminal, 
  Folder, 
  Network, 
  BarChart, 
  ArrowLeft,
  Trash,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const ServerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { getServer, startServer, stopServer, restartServer, deleteServer, refreshServerData, loading } = useServer();
  const [server, setServer] = useState<any>(null);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [consoleInput, setConsoleInput] = useState('');
  const [files, setFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState('/');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const serverData = getServer(id);
      if (serverData) {
        setServer(serverData);
        
        // Generate mock console output
        const serverStatus = serverData.status;
        if (serverStatus === 'online') {
          setConsoleOutput([
            '[INFO] Server starting...',
            '[INFO] Loading server properties...',
            '[INFO] Starting the server on port ' + serverData.port,
            '[INFO] Preparing spawn area...',
            '[INFO] Done! Server started successfully',
            '[INFO] Type "help" for a list of commands'
          ]);
        } else if (serverStatus === 'offline') {
          setConsoleOutput([
            '[INFO] Server is currently offline',
            '[INFO] Use the start button to begin'
          ]);
        } else {
          setConsoleOutput([
            '[INFO] Server is starting up...',
            '[INFO] Loading server properties...'
          ]);
        }
        
        // Generate mock file structure
        setFiles([
          { name: 'server.jar', type: 'file', size: '12.5 MB' },
          { name: 'server.properties', type: 'file', size: '2 KB' },
          { name: 'logs', type: 'directory' },
          { name: 'world', type: 'directory' },
          { name: 'plugins', type: 'directory' },
          { name: 'backups', type: 'directory' },
        ]);
      }
    }
    
    const interval = setInterval(() => {
      if (id) {
        refreshServerData();
        const updatedServer = getServer(id);
        if (updatedServer) {
          setServer(updatedServer);
          
          // Add simulated log entries for online servers
          if (updatedServer.status === 'online') {
            const randomMessages = [
              '[INFO] Player connection from 192.168.1.' + Math.floor(Math.random() * 255),
              '[INFO] World chunks loaded: ' + Math.floor(Math.random() * 100) + '%',
              '[INFO] Memory usage: ' + Math.floor(Math.random() * updatedServer.resources.ram.used) + 'MB',
              '[INFO] Autosaving world data...',
              '[INFO] Optimizing server performance'
            ];
            
            if (Math.random() > 0.7) {
              setConsoleOutput(prev => [
                ...prev, 
                randomMessages[Math.floor(Math.random() * randomMessages.length)]
              ]);
            }
          }
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id, getServer, refreshServerData]);
  
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [consoleOutput]);

  const handleStartServer = async () => {
    if (!id) return;
    
    try {
      toast.promise(startServer(id), {
        loading: 'Starting server...',
        success: 'Server started successfully',
        error: 'Failed to start server',
      });
      
      setConsoleOutput([
        ...consoleOutput,
        '[INFO] Starting server...',
        '[INFO] Loading server properties...',
        '[INFO] Initializing world data...'
      ]);
    } catch (error) {
      console.error('Error starting server:', error);
    }
  };

  const handleStopServer = async () => {
    if (!id) return;
    
    try {
      toast.promise(stopServer(id), {
        loading: 'Stopping server...',
        success: 'Server stopped successfully',
        error: 'Failed to stop server',
      });
      
      setConsoleOutput([
        ...consoleOutput,
        '[INFO] Stopping server...',
        '[INFO] Saving world data...',
        '[INFO] Server stopped'
      ]);
    } catch (error) {
      console.error('Error stopping server:', error);
    }
  };

  const handleRestartServer = async () => {
    if (!id) return;
    
    try {
      toast.promise(restartServer(id), {
        loading: 'Restarting server...',
        success: 'Server restarted successfully',
        error: 'Failed to restart server',
      });
      
      setConsoleOutput([
        ...consoleOutput,
        '[INFO] Restarting server...',
        '[INFO] Stopping server...',
        '[INFO] Saving world data...',
        '[INFO] Server stopped',
        '[INFO] Starting server...',
        '[INFO] Loading server properties...',
        '[INFO] Server started successfully'
      ]);
    } catch (error) {
      console.error('Error restarting server:', error);
    }
  };

  const handleSendCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    
    setConsoleOutput([
      ...consoleOutput,
      `> ${consoleInput}`,
      `[INFO] Executing command: ${consoleInput}`,
      `[INFO] Command executed successfully`
    ]);
    setConsoleInput('');
  };
  
  const handleBrowseDirectory = (dirName: string) => {
    setCurrentPath(prev => {
      if (dirName === '..') {
        const pathParts = prev.split('/').filter(Boolean);
        pathParts.pop();
        return pathParts.length === 0 ? '/' : ('/' + pathParts.join('/') + '/');
      } else {
        return prev === '/' ? `/${dirName}/` : `${prev}${dirName}/`;
      }
    });
    
    // Generate mock files for the new directory
    const mockSubdirectoryFiles = [
      { name: 'config.json', type: 'file', size: '4.2 KB' },
      { name: 'data', type: 'directory' },
      { name: 'backup-2023-05-01.zip', type: 'file', size: '45.8 MB' },
    ];
    setFiles(mockSubdirectoryFiles);
  };
  
  const handleDeleteServer = async () => {
    if (!id) return;
    
    try {
      await deleteServer(id);
      toast.success('Server deleted successfully');
      navigate('/servers');
    } catch (error) {
      console.error('Error deleting server:', error);
      toast.error('Failed to delete server');
    }
    
    setIsDeleteDialogOpen(false);
  };

  if (!server) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-game-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-medium">Loading server details...</h2>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
          <div>
            <div className="flex items-center">
              <div className={getStatusClass(server.status)}></div>
              <h1 className="text-3xl font-bold">{server.name}</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Port: {server.port} • Status: {server.status.charAt(0).toUpperCase() + server.status.slice(1)}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => refreshServerData()}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          {server.status === 'offline' && (
            <Button 
              variant="default" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleStartServer}
              disabled={loading}
            >
              <Play className="h-4 w-4 mr-2" /> Start
            </Button>
          )}
          
          {server.status === 'online' && (
            <>
              <Button 
                variant="default" 
                className="bg-amber-600 hover:bg-amber-700"
                onClick={handleRestartServer}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Restart
              </Button>
              
              <Button 
                variant="default" 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleStopServer}
                disabled={loading}
              >
                <Square className="h-4 w-4 mr-2" /> Stop
              </Button>
            </>
          )}
          
          {server.status === 'starting' && (
            <Button disabled>
              <Loader className="h-4 w-4 mr-2 animate-spin" /> Starting...
            </Button>
          )}
          
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Server</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this server? This action cannot be undone and all data will be permanently lost.
                </DialogDescription>
              </DialogHeader>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4 flex items-start space-x-3 mb-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-500">Warning</h4>
                  <p className="text-sm text-muted-foreground">
                    Deleting this server will immediately remove all files, configurations, and game data associated with it.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteServer}>
                  Delete Server
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Tabs defaultValue="console" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="console">
                <Terminal className="h-4 w-4 mr-2" /> Console
              </TabsTrigger>
              <TabsTrigger value="files">
                <Folder className="h-4 w-4 mr-2" /> File Manager
              </TabsTrigger>
              <TabsTrigger value="network">
                <Network className="h-4 w-4 mr-2" /> Network
              </TabsTrigger>
              <TabsTrigger value="stats">
                <BarChart className="h-4 w-4 mr-2" /> Resources
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="console">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Server Console</CardTitle>
                  <CardDescription>
                    View logs and send commands to your server
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="console-output">
                    {consoleOutput.map((line, index) => (
                      <div key={index} className={line.startsWith('>')
                        ? 'text-green-400'
                        : line.includes('ERROR')
                          ? 'text-red-400'
                          : line.includes('WARNING')
                            ? 'text-yellow-400'
                            : ''
                      }>
                        {line}
                      </div>
                    ))}
                    <div ref={consoleEndRef}></div>
                  </div>
                  
                  <form onSubmit={handleSendCommand} className="mt-2 flex">
                    <input
                      type="text"
                      className="console-input flex-1"
                      placeholder="Type a command..."
                      value={consoleInput}
                      onChange={(e) => setConsoleInput(e.target.value)}
                      disabled={server.status !== 'online'}
                    />
                    <Button 
                      type="submit" 
                      className="bg-game-primary hover:bg-game-secondary"
                      disabled={server.status !== 'online' || !consoleInput.trim()}
                    >
                      Send
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="files">
              <Card className="file-manager">
                <CardHeader className="pb-2">
                  <CardTitle>File Manager</CardTitle>
                  <CardDescription>
                    Browse and manage server files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-md px-3 py-2 mb-4 flex items-center">
                    <span className="text-sm font-mono">Path: {currentPath}</span>
                  </div>
                  
                  <div className="border rounded-md">
                    <div className="grid grid-cols-12 bg-muted/50 py-2 px-4">
                      <div className="col-span-6 font-medium text-sm">Name</div>
                      <div className="col-span-3 font-medium text-sm">Type</div>
                      <div className="col-span-3 font-medium text-sm">Size</div>
                    </div>
                    
                    <ScrollArea className="h-64">
                      <div className="divide-y">
                        {currentPath !== '/' && (
                          <div 
                            className="grid grid-cols-12 py-2 px-4 hover:bg-muted/25 cursor-pointer"
                            onClick={() => handleBrowseDirectory('..')}
                          >
                            <div className="col-span-6 flex items-center">
                              <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span>..</span>
                            </div>
                            <div className="col-span-3 text-sm text-muted-foreground">Directory</div>
                            <div className="col-span-3 text-sm text-muted-foreground">-</div>
                          </div>
                        )}
                        
                        {files.map((file, index) => (
                          <div 
                            key={index}
                            className="grid grid-cols-12 py-2 px-4 hover:bg-muted/25 cursor-pointer"
                            onClick={() => file.type === 'directory' && handleBrowseDirectory(file.name)}
                          >
                            <div className="col-span-6 flex items-center">
                              {file.type === 'directory' ? (
                                <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
                              ) : (
                                <div className="w-4 h-4 mr-2 flex items-center justify-center text-xs text-muted-foreground">
                                  📄
                                </div>
                              )}
                              <span>{file.name}</span>
                            </div>
                            <div className="col-span-3 text-sm text-muted-foreground capitalize">{file.type}</div>
                            <div className="col-span-3 text-sm text-muted-foreground">
                              {file.type === 'directory' ? '-' : file.size}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="network">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Network</CardTitle>
                  <CardDescription>
                    Server connection details and network status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Connection Information</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">IP Address:</span>
                            <span className="font-mono">127.0.0.1</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Port:</span>
                            <span className="font-mono">{server.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Status:</span>
                            <span className="font-mono capitalize">{server.status}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Protocol:</span>
                            <span className="font-mono">TCP/UDP</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="font-medium mb-1">Connection String</div>
                        <div className="font-mono text-xs bg-background p-2 rounded-sm">
                          127.0.0.1:{server.port}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium mb-2">Network Statistics</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Upload:</span>
                            <span className="font-mono">{server.status === 'online' ? '2.4 MB/s' : '0 B/s'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Download:</span>
                            <span className="font-mono">{server.status === 'online' ? '1.8 MB/s' : '0 B/s'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Active Connections:</span>
                            <span className="font-mono">{server.status === 'online' ? Math.floor(Math.random() * 10) : 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Latency:</span>
                            <span className="font-mono">{server.status === 'online' ? Math.floor(Math.random() * 100) + 'ms' : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded-md">
                        <div className="font-medium mb-1">Total Data Transferred</div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Received:</span>
                          <span className="font-mono">{server.status === 'online' ? '128.5 MB' : '0 B'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Sent:</span>
                          <span className="font-mono">{server.status === 'online' ? '256.2 MB' : '0 B'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-3">Firewall Status</h4>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <div>
                          <div className="font-medium">Port {server.port} is open</div>
                          <div className="text-xs text-muted-foreground">TCP/UDP traffic allowed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Resource Usage</CardTitle>
                  <CardDescription>
                    Monitor your server's performance and resource consumption
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">CPU Usage</h3>
                        <div className="text-lg font-bold">
                          {(server.resources.cpu.used * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="h-4 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${
                            getResourcePercentage(server.resources.cpu.used, server.resources.cpu.total) > 90
                              ? 'bg-red-500'
                              : getResourcePercentage(server.resources.cpu.used, server.resources.cpu.total) > 70
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${getResourcePercentage(server.resources.cpu.used, server.resources.cpu.total)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{server.resources.cpu.used.toFixed(1)} vCores</span>
                        <span>of {server.resources.cpu.total} vCores</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Memory Usage</h3>
                        <div className="text-lg font-bold">
                          {getResourcePercentage(server.resources.ram.used, server.resources.ram.total)}%
                        </div>
                      </div>
                      <div className="h-4 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${
                            getResourcePercentage(server.resources.ram.used, server.resources.ram.total) > 90
                              ? 'bg-red-500'
                              : getResourcePercentage(server.resources.ram.used, server.resources.ram.total) > 70
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${getResourcePercentage(server.resources.ram.used, server.resources.ram.total)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{server.resources.ram.used} MB</span>
                        <span>of {server.resources.ram.total} MB</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Disk Usage</h3>
                        <div className="text-lg font-bold">
                          {getResourcePercentage(server.resources.disk.used, server.resources.disk.total)}%
                        </div>
                      </div>
                      <div className="h-4 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full ${
                            getResourcePercentage(server.resources.disk.used, server.resources.disk.total) > 90
                              ? 'bg-red-500'
                              : getResourcePercentage(server.resources.disk.used, server.resources.disk.total) > 70
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${getResourcePercentage(server.resources.disk.used, server.resources.disk.total)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{(server.resources.disk.used / 1024).toFixed(1)} GB</span>
                        <span>of {(server.resources.disk.total / 1024).toFixed(1)} GB</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-muted/30">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">System Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Operating System:</span>
                          <span>Ubuntu 22.04 LTS</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Node Version:</span>
                          <span>v18.12.1</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Kernel:</span>
                          <span>5.15.0-48-generic</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">CPU Architecture:</span>
                          <span>x86_64</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Game Server Version:</span>
                          <span>1.19.2</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/30">
                      <CardHeader className="py-3">
                        <CardTitle className="text-base">Resource Allocation</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total RAM:</span>
                          <span>{server.resources.ram.total} MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total CPU:</span>
                          <span>{server.resources.cpu.total} vCores</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Disk:</span>
                          <span>{(server.resources.disk.total / 1024).toFixed(1)} GB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Swap:</span>
                          <span>512 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">I/O Priority:</span>
                          <span>Normal</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Server Status</CardTitle>
              <CardDescription>Current server status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className={getStatusClass(server.status)}></div>
                <span className="font-medium capitalize">{server.status}</span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
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
                  <div className="flex justify-between text-xs mb-1">
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
                  <div className="flex justify-between text-xs mb-1">
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
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Server Information</CardTitle>
              <CardDescription>Settings and details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium">Startup Command</div>
                <div className="bg-muted p-2 rounded-md mt-1">
                  <code className="text-xs">{server.startupCommand}</code>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Server ID:</span>
                  <span className="font-mono">{server.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Port:</span>
                  <span>{server.port}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>May 3, 2025</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Last Online:</span>
                  <span>{server.status === 'online' ? 'Now' : 'Yesterday'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/plans')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                Upgrade Resources
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={server.status !== 'online'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                </svg>
                Edit Configuration
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                </svg>
                Backup Server
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Server
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServerDetails;
