
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

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

// Mock data for servers
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

export const ServerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate loading server data
    const loadServers = async () => {
      setLoading(true);
      try {
        // In a real implementation, you'd fetch from your API
        setTimeout(() => {
          setServers(mockServers);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading servers:', error);
        setLoading(false);
      }
    };

    loadServers();
  }, []);

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

      // Create new server (mock implementation)
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
      
      // In real implementation, call your API to create the server
      
    } catch (error) {
      console.error('Error creating server:', error);
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
      // In a real implementation, call your API
      setServers(prev => prev.map(server => 
        server.id === id 
          ? { ...server, status: "starting" } 
          : server
      ));
      
      // Simulate server starting
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
      }, 3000);
      
    } catch (error) {
      console.error('Error starting server:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stopServer = async (id: string) => {
    setLoading(true);
    try {
      // In a real implementation, call your API
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
      
    } catch (error) {
      console.error('Error stopping server:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restartServer = async (id: string) => {
    try {
      await stopServer(id);
      await startServer(id);
    } catch (error) {
      console.error('Error restarting server:', error);
      throw error;
    }
  };

  const deleteServer = async (id: string) => {
    setLoading(true);
    try {
      // In a real implementation, call your API
      setServers(prev => prev.filter(server => server.id !== id));
    } catch (error) {
      console.error('Error deleting server:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshServerData = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd fetch from your API
      // Here we'll just simulate updating resource usage
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
    } catch (error) {
      console.error('Error refreshing server data:', error);
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
