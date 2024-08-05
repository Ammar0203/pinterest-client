import React, { createContext, useState, useEffect } from 'react';
import { addComment, changePassword, checkAuthStatus, like, login, logout, updateProfile } from '../apis';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const status = await checkAuthStatus();
        setIsAuthenticated(status.loggedIn);
        setUser(status.user);
      } catch (error) {
        console.error('Failed to check auth status', error);
      }
    };

    fetchAuthStatus();
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      // console.error('Login failed', error);
      throw error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleLike = async (pin_id, setLiked, setLikes) => {
    try {
      const {liked} = await like(pin_id)
      if(liked) {
        setLikes(prev => (prev + 1))
      }
      else {
        setLikes(prev => (prev - 1))
      }
      setLiked(liked)
      return liked
    }
    catch (err) {
      throw err
    }
  }

  const handleAddComment = async (pin_id, content, setComments) => {
    try {
      const { comment } = await addComment(pin_id, content)
      setComments(prev => [...prev, comment])
    }
    catch (err) {
      throw err
    }
  }

  const handleUpdateProfile = async (formData) => {
    try {
      const user = await updateProfile(formData)
      setUser(user)
      return user
    }
    catch (err) {
      throw err
    }
  }
  
  const handleChangePassword = async ({password, newPassword}) => {
    try {
      const response = await changePassword({password, newPassword})
      return response
    }
    catch (err) {
      throw err
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, handleLogin, handleLogout, handleLike, handleAddComment, handleUpdateProfile, handleChangePassword }}>
      {children}
    </AuthContext.Provider>
  );
};