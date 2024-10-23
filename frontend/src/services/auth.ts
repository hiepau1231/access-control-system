import api from './api';

export const logout = () => {
  localStorage.removeItem('token');
  // Redirect to login page
  window.location.href = '/login';
};

export const forgotPassword = (email: string) => api.post('/auth/forgot-password', { email });

export const resetPassword = (token: string, newPassword: string) => 
  api.post('/auth/reset-password', { token, newPassword });

interface Enable2FAResponse {
  qrCodeDataUrl: string;
  secret: string;
}

export const enable2FA = () => api.post<Enable2FAResponse>('/auth/enable-2fa');
export const verify2FA = (token: string) => api.post('/auth/verify-2fa', { token });
export const disable2FA = () => api.post('/auth/disable-2fa');
