
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
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Load server data
    const loadServers = async () => {
      setLoading(true);
      try {
        if (xmanageApi.hasApiKey()) {
          const fetchedServers = await xmanageApi.getServers();
          const convertedServers = fetchedServers.map(s => convertToServer(s, user?.id || '1'));
          setServers(convertedServers);
        } else {
          setServers([]);
          console.log('No XManage API key found. Please configure the API.');
          toast.error('API not configured. Please set up your XManage API in settings.', {
            action: {
              label: 'Configure',
              onClick: () => window.location.href = '/settings/api'
            }
          });
        }
      } catch (error) {
        console.error('Error loading servers:', error);
        setServers([]);
        toast.error('Failed to load servers. Please check your API configuration.');
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
        throw new Error('API not configured. Please set up your XManage API in settings.');
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
        throw new Error('API not configured. Please set up your XManage API in settings.');
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
        throw new Error('API not configured. Please set up your XManage API in settings.');
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
        throw new Error('API not configured. Please set up your XManage API in settings.');
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
        throw new Error('API not configured. Please set up your XManage API in settings.');
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
    if (!xmanageApi.hasApiKey()) return;
    
    setLoading(true);
    try {
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
