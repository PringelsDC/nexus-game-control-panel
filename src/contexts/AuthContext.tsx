
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

export interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "user";
  serverLimit: number;
  subscription: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in on page load
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('gamePanel_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock login - in real implementation, call your API
      if (email === "admin@example.com" && password === "password") {
        const adminUser: User = {
          id: "1",
          email: "admin@example.com",
          username: "Admin",
          role: "admin",
          serverLimit: 10,
          subscription: "premium"
        };
        setUser(adminUser);
        localStorage.setItem('gamePanel_user', JSON.stringify(adminUser));
        toast.success("Logged in as Admin");
        navigate('/dashboard');
        return;
      }
      
      if (email === "user@example.com" && password === "password") {
        const regularUser: User = {
          id: "2",
          email: "user@example.com",
          username: "User",
          role: "user",
          serverLimit: 3,
          subscription: "basic"
        };
        setUser(regularUser);
        localStorage.setItem('gamePanel_user', JSON.stringify(regularUser));
        toast.success("Logged in successfully");
        navigate('/dashboard');
        return;
      }
      
      toast.error("Invalid credentials");
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock registration - in real implementation, call your API
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        username,
        role: "user",
        serverLimit: 1,
        subscription: null
      };
      
      setUser(newUser);
      localStorage.setItem('gamePanel_user', JSON.stringify(newUser));
      toast.success("Registration successful");
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gamePanel_user');
    toast.info("Logged out successfully");
    navigate('/login');
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
