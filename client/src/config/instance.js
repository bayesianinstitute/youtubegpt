// src/api/axiosInstance.js

import axios from 'axios';

// Get token from the environment variable
const token = process.env.REACT_APP_BEARER_TOKEN;


// Create an Axios instance with a base URL and custom headers
const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Use the base URL from environment variables
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Use the token from env
  },
  withCredentials: true,  // Include this if you need to send cookies or authentication headers
});

export default instance;
