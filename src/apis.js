import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  } catch (error) {
    // throw new Error('Login failed');
    throw error
  }
};

export const logout = async () => {
  try {
    const response = await api.get('/api/auth/logout');
    return response.data;
  } catch (error) {
    // throw new Error('Logout failed');
    throw error
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/api/auth/status');
    return response.data;
  } catch (error) {
    // throw new Error('Could not check auth status');
    throw error
  }
};

export const like = async (pin_id) => {
  try {
    const response = await api.post('/api/like', {pin_id})
    return response.data
  }
  catch (err) {
    throw err
  }
}

export const addComment = async (pin_id, content) => {
  try {
    const response = await api.post('/api/comment/create', {pin_id, content})
    return response.data
  }
  catch (err) {
    throw err
  }
}

export const updateProfile = async (formData) => {
  try {
    const response = await api.post('/api/user/update', formData)
    return response.data
  }
  catch(err) {
    throw err
  }
}

export const changePassword = async ({password, newPassword}) => {
  try {
    const response = await api.post('/api/user/password', {password, newPassword})
    return response.data
  }
  catch(err) {
    throw err
  }
}