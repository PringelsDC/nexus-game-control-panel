
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import * as xmanageApi from '../services/xmanageApi';
import { toast } from 'sonner';

export interface ServerResource {
  ram: { used: number; total: number };
  cpu: { used: number; total: number };
  disk: { used: number; total: number };
}

export interface Server {
  id: string;
  name: string;
  status: "online" | "offline" | "starting";
  owner: string;
  resources: ServerResource;
  port: number;
  startupCommand: string;
}

interface ServerContextType {
  servers: Server[];
  userServers: Server[];
  loading: boolean;
  createServer: (name: string, ram: number, cpu: number, disk: number, startupCommand: string) => Promise<void>;
  getServer: (id: string) => Server | undefined;
  startServer: (id: string) => Promise<void>;
  stopServer: (id: string) => Promise<void>;
  restartServer: (id: string) => Promise<void>;
  deleteServer: (id: string) => Promise<void>;
  refreshServerData: () => Promise<void>;
}

const ServerContext = createContext<ServerContextType | null>(null);

export const useServer = () => {
  const context = useContext(ServerContext);
  if (!context) {
    throw new Error('useServer must be used within a ServerProvider');
  }
  return context;
};

// Mock data for servers to use as fallback
const mockServers: Server[] = [
  {
    id: '1',
    name: 'Minecraft Server',
    status: "online",
    owner: '1', // Admin's ID
    resources: {
      ram: { used: 512, total: 1024 },
      cpu: { used: 0.5, total: 1 },
      disk: { used: 3072, total: 5120 },
    },
    port: 25565,
    startupCommand: 'java -Xms512M -Xmx1024M -jar server.jar',
  },
  {
    id: '2',
    name: 'CS:GO Server',
    status: "offline",
    owner: '2', // User's ID
    resources: {
      ram: { used: 0, total: 768 },
      cpu: { used: 0, total: 1 },
      disk: { used: 2048, total: 4096 },
    },
    port: 27015,
    startupCommand: './srcds_run -game csgo -console -usercon +game_type 0',
  },
  {
    id: '3',
    name: 'Valheim Server',
    status: "starting",
    owner: '2', // User's ID
    resources: {
      ram: { used: 384, total: 768 },
      cpu: { used: 0.8, total: 1 },
      disk: { used: 1024, total: 3072 },
    },
    port: 2456,
    startupCommand: './valheim_server.x86_64 -name "My Server" -port 2456',
  }
];

// Convert XManageServer to our Server interface
const convertToServer = (xServer: xmanageApi.XManageServer, ownerId: string): Server => {
  // Parse port number from ports string
  const portMatch = xServer.ports.match(/(\d+)/);
  const port = portMatch ? parseInt(portMatch[1], 10) : Math.floor(Math.random() * (30000 - 20000) + 20000);
  
  return {
    id: xServer.id,
    name: xServer.server_name,
    status: (xServer.status as "online" | "offline" | "starting") || "offline",
    owner: ownerId,
    resources: xServer.resources || {
      ram: { used: 0, total: 0 },
      cpu: { used: 0, total: 0 },
      disk: { used: 0, total: 0 }
    },
    port: port,
    startupCommand: xServer.startup
  };
};

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading server data
    const loadServers = async () => {
      setLoading(true);
      try {
        if (xmanageApi.hasApiKey()) {
          const fetchedServers = await xmanageApi.getServers();
          if (fetchedServers && fetchedServers.length > 0) {
            const convertedServers = fetchedServers.map(s => convertToServer(s, user?.id || '1'));
            setServers(convertedServers);
          } else {
            // Fallback to mock data if API returns empty
            setServers(mockServers);
          }
        } else {
          // No API key, use mock data
          setServers(mockServers);
          console.log('No XManage API key found. Using mock data.');
        }
      } catch (error) {
        console.error('Error loading servers:', error);
        // Fallback to mock data on error
        setServers(mockServers);
        toast.error('Failed to load servers. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    loadServers();
    
    // Set up periodic refresh
    const intervalId = setInterval(() => {
      refreshServerData();
    }, 30000); // every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [user]);

  const userServers = user ? servers.filter(server => server.owner === user.id) : [];

  const createServer = async (name: string, ram: number, cpu: number, disk: number, startupCommand: string) => {
    setLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');
      
      // Validate server limits
      if (ram > 1024) throw new Error('RAM limit exceeded (max 1GB)');
      if (cpu > 1) throw new Error('CPU limit exceeded (max 1 vCore)');
      if (disk > 10240) throw new Error('Disk limit exceeded (max 10GB)');
      
      // Check user server limit
      if (userServers.length >= (user.serverLimit || 1)) {
        throw new Error(`Server limit reached (max ${user.serverLimit})`);
      }
      
      if (xmanageApi.hasApiKey()) {
        // Format values for XManage API
        const serverData: xmanageApi.ServerCreateRequest = {
          server_name: name,
          cpu_limit: `${Math.round(cpu * 100)}%`,
          ram_limit: `${ram}M`,
          swap_limit: `${Math.round(ram * 0.5)}M`, // 50% of RAM
          disk_limit: `${Math.round(disk / 1024)}G`, // Convert MB to GB
          io_weight: 500,
          ports: Math.floor(Math.random() * (30000 - 20000) + 20000).toString(), // Random port
          startup: startupCommand,
        };
        
        // Call XManage API to create server
        const createdServer = await xmanageApi.createServer(serverData);
        
        // Add the new server to our state
        const newServer = convertToServer(createdServer, user.id);
        setServers(prev => [...prev, newServer]);
        
        toast.success('Server created successfully');
      } else {
        // Create mock server if no API key
        const newServer: Server = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          status: "offline",
          owner: user.id,
          resources: {
            ram: { used: 0, total: ram },
            cpu: { used: 0, total: cpu },
            disk: { used: 0, total: disk },
          },
          port: Math.floor(Math.random() * (30000 - 20000) + 20000),
          startupCommand,
        };

        setServers(prev => [...prev, newServer]);
        toast.success('Server created (Demo Mode)');
      }
    } catch (error) {
      console.error('Error creating server:', error);
      toast.error(`Failed to create server: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getServer = (id: string) => {
    return servers.find(server => server.id === id);
  };

  const startServer = async (id: string) => {
    setLoading(true);
    try {
      if (xmanageApi.hasApiKey()) {
        await xmanageApi.startServer(id);
        
        // Update server status
        setServers(prev => prev.map(server => 
          server.id === id 
            ? { ...server, status: "starting" } 
            : server
        ));
        
        // Poll for status change
        setTimeout(async () => {
          try {
            const statusResult = await xmanageApi.getServerStatus(id);
            setServers(prev => prev.map(server => 
              server.id === id 
                ? { 
                    ...server, 
                    status: statusResult.status as "online" | "offline" | "starting",
                    resources: {
                      ...server.resources,
                      ram: { ...server.resources.ram, used: Math.floor(server.resources.ram.total * 0.6) },
                      cpu: { ...server.resources.cpu, used: Math.random() * 0.8 },
                    }
                  } 
                : server
            ));
          } catch (error) {
            console.error('Error polling server status:', error);
          }
        }, 3000);
        
        toast.success('Server starting');
      } else {
        // Mock implementation
        setServers(prev => prev.map(server => 
          server.id === id 
            ? { ...server, status: "starting" } 
            : server
        ));
        
        setTimeout(() => {
          setServers(prev => prev.map(server => 
            server.id === id 
              ? { 
                  ...server, 
                  status: "online", 
                  resources: {
                    ...server.resources,
                    ram: { ...server.resources.ram, used: Math.floor(server.resources.ram.total * 0.6) },
                    cpu: { ...server.resources.cpu, used: Math.random() * 0.8 },
                    disk: { ...server.resources.disk, used: Math.floor(server.resources.disk.used * 1.1) },
                  }
                } 
              : server
          ));
          
          toast.success('Server started (Demo Mode)');
        }, 3000);
      }
    } catch (error) {
      console.error('Error starting server:', error);
      toast.error('Failed to start server');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stopServer = async (id: string) => {
    setLoading(true);
    try {
      if (xmanageApi.hasApiKey()) {
        await xmanageApi.stopServer(id);
        
        // Update server status
        setServers(prev => prev.map(server => 
          server.id === id 
            ? { 
                ...server, 
                status: "offline",
                resources: {
                  ...server.resources,
                  ram: { ...server.resources.ram, used: 0 },
                  cpu: { ...server.resources.cpu, used: 0 },
                }
              } 
            : server
        ));
        
        toast.success('Server stopped');
      } else {
        // Mock implementation
        setServers(prev => prev.map(server => 
          server.id === id 
            ? { 
                ...server, 
                status: "offline",
                resources: {
                  ...server.resources,
                  ram: { ...server.resources.ram, used: 0 },
                  cpu: { ...server.resources.cpu, used: 0 },
                }
              } 
            : server
        ));
        
        toast.success('Server stopped (Demo Mode)');
      }
    } catch (error) {
      console.error('Error stopping server:', error);
      toast.error('Failed to stop server');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restartServer = async (id: string) => {
    try {
      if (xmanageApi.hasApiKey()) {
        await xmanageApi.restartServer(id);
        toast.success('Server restarting');
        
        // Update server status
        setServers(prev => prev.map(server => 
          server.id === id 
            ? { ...server, status: "starting" } 
            : server
        ));
        
        // Poll for status change
        setTimeout(async () => {
          try {
            const statusResult = await xmanageApi.getServerStatus(id);
            setServers(prev => prev.map(server => 
              server.id === id 
                ? { 
                    ...server, 
                    status: statusResult.status as "online" | "offline" | "starting"
                  } 
                : server
            ));
          } catch (error) {
            console.error('Error polling server status:', error);
          }
        }, 5000);
      } else {
        // Mock implementation
        await stopServer(id);
        await startServer(id);
      }
    } catch (error) {
      console.error('Error restarting server:', error);
      toast.error('Failed to restart server');
      throw error;
    }
  };

  const deleteServer = async (id: string) => {
    setLoading(true);
    try {
      if (xmanageApi.hasApiKey()) {
        await xmanageApi.deleteServer(id);
        setServers(prev => prev.filter(server => server.id !== id));
        toast.success('Server deleted');
      } else {
        // Mock implementation
        setServers(prev => prev.filter(server => server.id !== id));
        toast.success('Server deleted (Demo Mode)');
      }
    } catch (error) {
      console.error('Error deleting server:', error);
      toast.error('Failed to delete server');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshServerData = async () => {
    setLoading(true);
    try {
      if (xmanageApi.hasApiKey()) {
        const fetchedServers = await xmanageApi.getServers();
        
        // Update server statuses
        const updatedServers = await Promise.all(fetchedServers.map(async (server) => {
          try {
            const statusResult = await xmanageApi.getServerStatus(server.id);
            server.status = statusResult.status;
          } catch (error) {
            console.error(`Error fetching status for server ${server.id}:`, error);
          }
          return server;
        }));
        
        if (updatedServers && updatedServers.length > 0) {
          const convertedServers = updatedServers.map(s => convertToServer(s, user?.id || '1'));
          setServers(convertedServers);
        }
      } else {
        // Mock implementation - just simulate updating resource usage
        setServers(prev => prev.map(server => {
          if (server.status === "online") {
            return {
              ...server,
              resources: {
                ...server.resources,
                ram: { 
                  ...server.resources.ram, 
                  used: Math.min(
                    Math.max(300, Math.floor(server.resources.ram.used * (0.9 + Math.random() * 0.2))), 
                    server.resources.ram.total
                  ) 
                },
                cpu: { 
                  ...server.resources.cpu, 
                  used: Math.min(Math.random() * 0.9, server.resources.cpu.total) 
                },
              }
            };
          }
          return server;
        }));
      }
    } catch (error) {
      console.error('Error refreshing server data:', error);
      toast.error('Failed to refresh server data');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    servers,
    userServers,
    loading,
    createServer,
    getServer,
    startServer,
    stopServer,
    restartServer,
    deleteServer,
    refreshServerData
  };

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>;
};
