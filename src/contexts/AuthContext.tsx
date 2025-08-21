import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User } from '../types/auth';
import { authAPI } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token with backend
          const response = await authAPI.getCurrentUser();
          setUser(response.user);
          setAccessToken(response.accessToken);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('accessToken', response.accessToken);
        } catch (err) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          setAccessToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.login({ email, password });
      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.accessToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authAPI.signup({ email, username, password, confirmPassword: password });
      
      setUser(response.user);
      setAccessToken(response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('accessToken', response.accessToken);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    
    // Call logout API (optional, for server-side cleanup)
    authAPI.logout().catch(() => {
      // Ignore errors on logout
    });
  };

  const value: AuthContextType = {
    user,
    accessToken,
    login,
    signup,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
