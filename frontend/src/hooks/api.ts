// src/api.ts
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 100000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
