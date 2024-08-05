// src/api.js
import axios from 'axios';
import URLs from './url';

const api = axios.create({
  baseURL: URLs,
  withCredentials: true // Allow credentials (cookies) to be sent
});

export default api;