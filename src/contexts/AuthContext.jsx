import React, { createContext, useState, useEffect, useRef } from 'react';
import Auth from '../Auth';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const initRef = useRef(Auth.init())

  const [isAuthenticated, setIsAuthenticated] = useState(Auth.auth());
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await api.get('/api/auth/status');
        const user = response.data.user;
        setIsAuthenticated(true);
        setUser(user);
      } catch (error) {
        // console.error(error);
        Auth.logout()
        setIsAuthenticated(false)
        setUser(null)
      }
    };

    fetchAuthStatus();
  }, []);

  const handleLogin = async ({email, password}) => {
    try {
      const response = await api.post('/api/auth/login', {email, password})
      const user = response.data.user
      setIsAuthenticated(true);
      setUser(user);
      Auth.login(user.token)
    } catch (error) {
      throw error
    }
  };

  const handleSignUp = async ({name, email, password}) => {
    try {
      const response = await api.post('/api/auth/signup', {name, email, password})
      const user = response.data.user
      setIsAuthenticated(true);
      setUser(user);
      Auth.login(user.token)
    } catch (error) {
      throw error
    }
  }

  const handleLogout = async () => {
    try {
      Auth.logout()
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleUpdateUser = async (formData) => {
    try {
      const response = await api.post('/api/user/update', formData)
      const user = response.data.user
      setUser(user)
    }
    catch (err) {
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleSignUp, handleLogout, handleUpdateUser }}>
      {children}
    </AuthContext.Provider>
  );
};