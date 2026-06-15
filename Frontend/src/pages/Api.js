import axios from 'axios'

const Api = axios.create({
    baseURL: 'http://localhost:3000/',
})

// Add a request interceptor to include the JWT token
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api