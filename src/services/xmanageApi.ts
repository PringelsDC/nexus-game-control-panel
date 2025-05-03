// XManage API service
// Documentation: https://xmanage-docs.tirito.de/guides/using_api

// API Base URL - configurable via settings
let API_BASE_URL = localStorage.getItem('xmanageApiUrl') || 'https://xmanage-api.example.com'; // Default URL

// API Key - in a real implementation, this would be retrieved from a secure storage
let apiKey: string | null = localStorage.getItem('xmanageApiKey');

// Headers for API calls
const getHeaders = () => {
  if (!apiKey) {
    throw new Error('API Key not found. Please configure your API key.');
  }
  
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
};

// Set API Key
export const setApiKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('xmanageApiKey', key);
};

// Set API URL
export const setApiUrl = (url: string) => {
  API_BASE_URL = url;
  localStorage.setItem('xmanageApiUrl', url);
};

// Get current API URL
export const getApiUrl = (): string => {
  return API_BASE_URL;
};

// Clear API Key
export const clearApiKey = () => {
  apiKey = null;
  localStorage.removeItem('xmanageApiKey');
};

// Check if API Key is set
export const hasApiKey = (): boolean => {
  return apiKey !== null;
};

// Server interfaces
export interface XManageServer {
  id: string;
  server_name: string;
  cpu_limit: string;
  ram_limit: string;
  swap_limit: string;
  disk_limit: string;
  io_weight: number;
  ports: string;
  startup: string;
  status?: string;
  resources?: {
    ram: { used: number; total: number };
    cpu: { used: number; total: number };
    disk: { used: number; total: number };
  };
}

export interface ServerCreateRequest {
  server_name: string;
  cpu_limit: string;
  ram_limit: string;
  swap_limit: string;
  disk_limit: string;
  io_weight: number;
  ports: string;
  startup: string;
}

export interface Backup {
  name: string;
  size: number;
  created_at: string;
}

export interface FileEntry {
  name: string;
  type: 'file' | 'directory';
  size?: number;
  last_modified?: string;
}

// Server API calls
export const getServers = async (): Promise<XManageServer[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch servers: ${response.status}`);
    }
    
    const servers = await response.json();
    
    // Process and enhance the server data
    return servers.map((server: XManageServer) => {
      // Parse numeric values from strings and add calculated resource info
      const ramMatch = server.ram_limit.match(/(\d+)M/i);
      const diskMatch = server.disk_limit.match(/(\d+)G/i);
      const cpuMatch = server.cpu_limit.match(/(\d+)%/i);
      
      const ramMB = ramMatch ? parseInt(ramMatch[1], 10) : 0;
      const diskMB = diskMatch ? parseInt(diskMatch[1], 10) * 1024 : 0;
      const cpuPercent = cpuMatch ? parseInt(cpuMatch[1], 10) / 100 : 0;
      
      return {
        ...server,
        resources: {
          ram: { used: 0, total: ramMB },
          cpu: { used: 0, total: cpuPercent },
          disk: { used: 0, total: diskMB },
        }
      };
    });
  } catch (error) {
    console.error('Error fetching servers:', error);
    throw error;
  }
};

export const getServer = async (serverId: string): Promise<XManageServer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch server: ${response.status}`);
    }
    
    const server = await response.json();
    
    // Process and enhance the server data as above
    const ramMatch = server.ram_limit.match(/(\d+)M/i);
    const diskMatch = server.disk_limit.match(/(\d+)G/i);
    const cpuMatch = server.cpu_limit.match(/(\d+)%/i);
    
    const ramMB = ramMatch ? parseInt(ramMatch[1], 10) : 0;
    const diskMB = diskMatch ? parseInt(diskMatch[1], 10) * 1024 : 0;
    const cpuPercent = cpuMatch ? parseInt(cpuMatch[1], 10) / 100 : 0;
    
    return {
      ...server,
      resources: {
        ram: { used: 0, total: ramMB },
        cpu: { used: 0, total: cpuPercent },
        disk: { used: 0, total: diskMB },
      }
    };
  } catch (error) {
    console.error(`Error fetching server ${serverId}:`, error);
    throw error;
  }
};

export const createServer = async (serverData: ServerCreateRequest): Promise<XManageServer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(serverData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create server: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating server:', error);
    throw error;
  }
};

export const updateServer = async (serverId: string, serverData: Partial<ServerCreateRequest>): Promise<XManageServer> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(serverData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update server: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating server ${serverId}:`, error);
    throw error;
  }
};

export const deleteServer = async (serverId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete server: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting server ${serverId}:`, error);
    throw error;
  }
};

export const getServerStatus = async (serverId: string): Promise<{ status: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/status`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get server status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting status for server ${serverId}:`, error);
    throw error;
  }
};

export const startServer = async (serverId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/start`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start server: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error starting server ${serverId}:`, error);
    throw error;
  }
};

export const stopServer = async (serverId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/stop`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to stop server: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error stopping server ${serverId}:`, error);
    throw error;
  }
};

export const restartServer = async (serverId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/restart`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to restart server: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error restarting server ${serverId}:`, error);
    throw error;
  }
};

export const getServerBackups = async (serverId: string): Promise<Backup[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/backups`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get server backups: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting backups for server ${serverId}:`, error);
    throw error;
  }
};

export const createBackup = async (serverId: string): Promise<Backup> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/backups`, {
      method: 'POST',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create backup: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error creating backup for server ${serverId}:`, error);
    throw error;
  }
};

export const restoreBackup = async (serverId: string, backupName: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/backups/${backupName}`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to restore backup: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error restoring backup ${backupName} for server ${serverId}:`, error);
    throw error;
  }
};

export const deleteBackup = async (serverId: string, backupName: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/backups/${backupName}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete backup: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting backup ${backupName} for server ${serverId}:`, error);
    throw error;
  }
};

export const getServerFiles = async (serverId: string, path: string = ''): Promise<FileEntry[]> => {
  try {
    const queryParams = path ? `?path=${encodeURIComponent(path)}` : '';
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/files${queryParams}`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get server files: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting files for server ${serverId}:`, error);
    throw error;
  }
};

export const getServerLogs = async (serverId: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/servers/${serverId}/logs`, {
      headers: getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get server logs: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting logs for server ${serverId}:`, error);
    throw error;
  }
};

export default {
  getServers,
  getServer,
  createServer,
  updateServer,
  deleteServer,
  getServerStatus,
  startServer,
  stopServer,
  restartServer,
  getServerBackups,
  createBackup,
  restoreBackup,
  deleteBackup,
  getServerFiles,
  getServerLogs,
  setApiKey,
  clearApiKey,
  hasApiKey,
  setApiUrl,
  getApiUrl,
};
