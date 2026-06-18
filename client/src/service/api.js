import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — inject Bearer token from persisted Redux state
api.interceptors.request.use(
    (config) => {
        try {
            const state = JSON.parse(localStorage.getItem('persist:shortstorage') || '{}');
            const token = JSON.parse(state.token || 'null');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle 401 (token expired/invalid)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('persist:shortstorage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;