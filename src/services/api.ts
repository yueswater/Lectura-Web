import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response && error.response.status === 401) {
            const isLoginPage = window.location.pathname.includes('/login');
            const isRegisterPage = window.location.pathname.includes('/register');
            const isVerifyPage = window.location.pathname.includes('/verify-email');

            if (!isLoginPage && !isRegisterPage && !isVerifyPage) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;