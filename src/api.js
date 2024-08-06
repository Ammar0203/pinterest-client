// src/api.js
import axios from 'axios';
import API_URL from './url';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default api;