import axios, { AxiosError } from 'axios';
import { getToken, setToken, removeToken } from '../utils/token';

// Get API URL from environment variables with fallback
const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

// Types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  email: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roleId: string;
  };
}

// Create authenticated axios instance
export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth header interceptor
authApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
authApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
);

// Auth service
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('Attempting login with credentials:', credentials);
      const response = await authApi.post('/api/auth/login', credentials);
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      setToken(token);
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.error('Login failed: Invalid credentials');
          throw new Error('Invalid username or password');
        } else {
          console.error('Login failed:', error.response?.data || error.message);
        }
      } else {
        console.error('An unexpected error occurred during login:', error);
      }
      throw error;
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await authApi.post('/api/auth/register', data);
      const { token, user } = response.data;
      setToken(token);
      return { token, user };
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    removeToken();
  },

  async getCurrentUser() {
    try {
      const response = await authApi.get('/api/auth/me');
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }
};

// Export individual functions
export const forgotPassword = async (email: string): Promise<void> => {
  await authApi.post('/api/auth/forgot-password', { email });
};

export const enable2FA = async (): Promise<{ qrCode: string; secret: string }> => {
  const response = await authApi.post('/api/auth/2fa/enable');
  return response.data;
};

export const verify2FA = async (code: string): Promise<void> => {
  await authApi.post('/api/auth/2fa/verify', { code });
};
