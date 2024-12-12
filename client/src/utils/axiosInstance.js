import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
});

// Add interceptor to include JWT in requests
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization Header:', config.headers.Authorization); // Debug log
    }
    return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
