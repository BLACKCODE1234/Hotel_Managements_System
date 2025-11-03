import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = 'http://localhost:5000';

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/me');
      if (response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, loginType = 'login') => {
    try {
      const response = await axios.post(`/${loginType}`, credentials);
      if (response.data.user) {
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post('/signup', userData);
      if (response.data.user) {
        setUser(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Signup failed' 
      };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/logout');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
