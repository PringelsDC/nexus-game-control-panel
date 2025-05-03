
// User API service
// This service handles communication with the MySQL database for user management

// Base URL for the user API - configurable via settings
let API_BASE_URL = localStorage.getItem('dbApiUrl') || 'https://db-api.example.com/users'; 

// Set Database API URL
export const setDbApiUrl = (url: string) => {
  API_BASE_URL = url;
  localStorage.setItem('dbApiUrl', url);
};

// Get current Database API URL
export const getDbApiUrl = (): string => {
  return API_BASE_URL;
};

// Check if DB API URL is configured to a custom value
export const hasCustomDbUrl = (): boolean => {
  return localStorage.getItem('dbApiUrl') !== null;
};

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  serverLimit: number;
  subscription: string | null;
  lastActive: string;
  servers: number;
}

// Get all users - using the configured API
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle cases where our API might return data in a different format
    // For example, if the API returns { users: [...] } instead of just the array
    const users = Array.isArray(data) ? data : (data.users || []);
    
    // Ensure the data matches our User interface
    return users.map((user: any) => ({
      id: user.id || String(user.userId || ''),
      username: user.username || user.name || '',
      email: user.email || '',
      role: (user.role === 'admin' || user.role === 'user') ? user.role : 'user',
      serverLimit: user.serverLimit || Number(user.server_limit || 0),
      subscription: user.subscription || user.plan || null,
      lastActive: user.lastActive || user.last_active || new Date().toISOString(),
      servers: user.servers || Number(user.server_count || 0)
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    // Instead of falling back to mock data, propagate the error
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    const userData = await response.json();
    
    // Ensure the data matches our User interface
    return {
      id: userData.id || String(userData.userId || ''),
      username: userData.username || userData.name || '',
      email: userData.email || '',
      role: (userData.role === 'admin' || userData.role === 'user') ? userData.role : 'user',
      serverLimit: userData.serverLimit || Number(userData.server_limit || 0),
      subscription: userData.subscription || userData.plan || null,
      lastActive: userData.lastActive || userData.last_active || new Date().toISOString(),
      servers: userData.servers || Number(userData.server_count || 0)
    };
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create user
export const createUser = async (userData: Omit<User, 'id' | 'lastActive' | 'servers'>): Promise<User> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`);
    }
    
    const newUser = await response.json();
    
    // Ensure the data matches our User interface
    return {
      id: newUser.id || String(newUser.userId || ''),
      username: newUser.username || newUser.name || '',
      email: newUser.email || '',
      role: (newUser.role === 'admin' || newUser.role === 'user') ? newUser.role : 'user',
      serverLimit: newUser.serverLimit || Number(newUser.server_limit || 0),
      subscription: newUser.subscription || newUser.plan || null,
      lastActive: newUser.lastActive || newUser.last_active || new Date().toISOString(),
      servers: newUser.servers || Number(newUser.server_count || 0)
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    
    const updatedUser = await response.json();
    
    // Ensure the data matches our User interface
    return {
      id: updatedUser.id || String(updatedUser.userId || ''),
      username: updatedUser.username || updatedUser.name || '',
      email: updatedUser.email || '',
      role: (updatedUser.role === 'admin' || updatedUser.role === 'user') ? updatedUser.role : 'user',
      serverLimit: updatedUser.serverLimit || Number(updatedUser.server_limit || 0),
      subscription: updatedUser.subscription || updatedUser.plan || null,
      lastActive: updatedUser.lastActive || updatedUser.last_active || new Date().toISOString(),
      servers: updatedUser.servers || Number(updatedUser.server_count || 0)
    };
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    throw error;
  }
};

export default {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  setDbApiUrl,
  getDbApiUrl,
  hasCustomDbUrl
};
