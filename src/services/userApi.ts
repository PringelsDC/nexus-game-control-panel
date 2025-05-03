
// User API service
// This service handles communication with the MySQL database for user management

// Base URL for the user API
const API_BASE_URL = '/api/users'; // Replace with your actual API endpoint

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

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll return mock data
    const mockUsers = [
      {
        id: '1',
        username: 'Admin',
        email: 'admin@example.com',
        role: 'admin' as const,
        serverLimit: 10,
        subscription: 'premium',
        lastActive: '2025-05-03T10:30:00Z',
        servers: 1
      },
      {
        id: '2',
        username: 'User',
        email: 'user@example.com',
        role: 'user' as const,
        serverLimit: 3,
        subscription: 'basic',
        lastActive: '2025-05-02T15:45:00Z',
        servers: 2
      },
      {
        id: '3',
        username: 'GameMaster',
        email: 'gamemaster@example.com',
        role: 'user' as const,
        serverLimit: 5,
        subscription: 'premium',
        lastActive: '2025-05-01T09:15:00Z',
        servers: 3
      },
      {
        id: '4',
        username: 'FreeUser',
        email: 'free@example.com',
        role: 'user' as const,
        serverLimit: 1,
        subscription: null,
        lastActive: '2025-04-28T14:20:00Z',
        servers: 1
      },
      {
        id: '5',
        username: 'ProGamer',
        email: 'progamer@example.com',
        role: 'user' as const,
        serverLimit: 5,
        subscription: 'premium',
        lastActive: '2025-05-03T08:10:00Z',
        servers: 0
      }
    ];
    
    return mockUsers;
    
    // Uncomment this code when your backend is ready:
    /*
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User> => {
  try {
    // Simulate API call
    const mockUsers = await getAllUsers();
    const user = mockUsers.find(u => u.id === userId);
    
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    return user;
    
    // Uncomment this code when your backend is ready:
    /*
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error);
    throw error;
  }
};

// Create user
export const createUser = async (userData: Omit<User, 'id' | 'lastActive' | 'servers'>): Promise<User> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful creation
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 11),
      ...userData,
      lastActive: new Date().toISOString(),
      servers: 0
    };
    
    return newUser;
    
    // Uncomment this code when your backend is ready:
    /*
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create user: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Update user
export const updateUser = async (userId: string, userData: Partial<Omit<User, 'id'>>): Promise<User> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful update
    const mockUsers = await getAllUsers();
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error(`User with ID ${userId} not found`);
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...userData
    };
    
    return updatedUser;
    
    // Uncomment this code when your backend is ready:
    /*
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers as needed
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update user: ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error);
    throw error;
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful deletion
    
    // Uncomment this code when your backend is ready:
    /*
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        // Add authentication headers as needed
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete user: ${response.status}`);
    }
    */
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
  deleteUser
};
