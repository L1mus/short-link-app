import api from '../../../service/api.js';

/**
 * Login dengan email & password
 * @param {{ email: string, password: string }} credentials
 */
export const loginApi = (credentials) =>
    api.post('/auth/', credentials);

/**
 * Register akun baru
 * @param {{ email: string, password: string, confirmPassword: string }} data
 */
export const registerApi = (data) =>
    api.post('/auth/register', data);

/**
 * Google OAuth login
 * @param {{ token: string }} data - Google ID token dari Google SDK
 */
export const googleAuthApi = (data) =>
    api.post('/auth/google', data);

/**
 * Logout - invalidate token di server (jika backend mendukung)
 */
export const logoutApi = () =>
    api.post('/auth/logout');

/**
 * Request reset password (kirim email)
 * @param {{ email: string }} data
 */
export const forgotPasswordApi = (data) =>
    api.post('/auth/forgot-password', data);

/**
 * Reset password dengan token dari email
 * @param {{ token: string, password: string }} data
 */
export const resetPasswordApi = (data) =>
    api.post('/auth/reset-password', data);

/**
 * Ambil data user yang sedang login (dari token)
 */
export const getMeApi = () =>
    api.get('/auth/me');
