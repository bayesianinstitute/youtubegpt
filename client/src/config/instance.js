import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8090',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,  // Only use this if you need to send cookies or authentication headers
});

export default instance;
