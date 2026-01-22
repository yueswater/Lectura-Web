import api from './api';
import { UserProfile } from '@/types';

interface AuthResponse {
    access: string;
    refresh: string;
}

const login = async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('accounts/login/', {
        username,
        password,
    });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
};

const register = async (userData: any): Promise<void> => {
    const lang = localStorage.getItem('i18nextLng') || 'en-us';
    await api.post(`accounts/register/?lang=${lang}`, userData);
};

const verifyEmail = async (token: string): Promise<any> => {
    return await api.post('accounts/verify-email/', { token });
};

const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
};

const getToken = (): string | null => {
    return localStorage.getItem('access_token');
};

const isAuthenticated = (): boolean => {
    const token = localStorage.getItem('access_token');
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
};

const getCurrentUser = async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('accounts/me/');
    return response.data;
};

const updateProfile = async (data: FormData): Promise<UserProfile> => {
    const response = await api.patch<UserProfile>('accounts/me/', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

const requestPasswordReset = async (email: string): Promise<void> => {
    const lang = localStorage.getItem('i18nextLng') || 'zh-TW';
    await api.post(`accounts/password-reset-request/?lang=${lang}`, { email });
};

const confirmPasswordReset = async (
    token: string,
    otp: string,
    newPassword: string
): Promise<void> => {
    await api.post('accounts/password-reset-confirm/', {
        token,
        otp,
        new_password: newPassword
    });
};

const authService = {
    login,
    register,
    verifyEmail,
    logout,
    getToken,
    isAuthenticated,
    getCurrentUser,
    updateProfile,
    requestPasswordReset,
    confirmPasswordReset,
};

export default authService;