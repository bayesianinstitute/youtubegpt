// src/api/axiosInstance.js

import axios from 'axios';

// Create an Axios instance with a base URL and custom headers
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Use the base URL from environment variables
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Include this if you need to send cookies or authentication headers
});

export default instance;
