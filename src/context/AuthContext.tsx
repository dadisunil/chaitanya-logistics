import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

// Define types
type User = {
  id: string;
  name: string;
  email: string;
  user_type: 'client' | 'agent' | 'admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user and token on initial load
    const storedUser = localStorage.getItem('logitrack_user');
    const storedToken = localStorage.getItem('logitrack_token');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Axios interceptor to add Authorization header
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const accessToken = token || localStorage.getItem('logitrack_token');
      if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    });
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, { email, password });
      // Expecting response.data to have { user, access }
      const { user, access } = response.data;
      setUser(user);
      setToken(access);
      localStorage.setItem('logitrack_user', JSON.stringify(user));
      localStorage.setItem('logitrack_token', access);
    } catch (error) {
      throw new Error('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/register`, { name, email, password });
    } catch (error) {
      throw new Error('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('logitrack_user');
    localStorage.removeItem('logitrack_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.user_type === 'admin',
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};