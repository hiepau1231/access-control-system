import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { message } from 'antd';
import { getStoredToken, removeStoredToken, setStoredToken } from '../utils/token';
import { verifyToken } from '../services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
}

interface AuthContextType {
  user: User | null;
  hasPermission: (permission: string) => boolean;
  login: (userData: { token: string; user: User }) => void;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = getStoredToken();
        if (token) {
          const userData = await verifyToken(token);
          setUser(userData);
        }
      } catch (error) {
        message.error('Session expired. Please login again.');
        removeStoredToken();
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const hasPermission = useCallback((permission: string) => {
    // Implement permission check logic here
    return !!user;
  }, [user]);

  const login = useCallback((data: { token: string; user: User }) => {
    setStoredToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeStoredToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, hasPermission, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}; 