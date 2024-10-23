import axios from 'axios';
import { handleError } from '../utils/errorHandler';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login page or refresh token
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    handleError(error);
    return Promise.reject(error);
  }
);

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, password: string, email: string) =>
  api.post('/auth/register', { username, password, email });

export const getUsers = async (page: number = 1, limit: number = 10, search: string = '') => {
  const response = await api.get(`/users?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getUser = (id: string) => api.get(`/users/${id}`);

export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const getRoles = async (page: number = 1, limit: number = 10, search: string = '') => {
  const response = await api.get(`/roles?page=${page}&limit=${limit}&search=${search}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getRole = (id: string) => api.get(`/roles/${id}`);

export const createRole = (data: any) => api.post('/roles', data);

export const updateRole = (id: string, data: any) => api.put(`/roles/${id}`, data);

export const deleteRole = (id: string) => api.delete(`/roles/${id}`);

export const getPermissions = async (page: number = 1, limit: number = 10, search: string = '') => {
  const response = await api.get(`/permissions?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getPermission = (id: string) => api.get(`/permissions/${id}`);

export const createPermission = (data: any) => api.post('/permissions', data);

export const updatePermission = (id: string, data: any) => api.put(`/permissions/${id}`, data);

export const deletePermission = (id: string) => api.delete(`/permissions/${id}`);

export const assignPermissionToRole = (roleId: string, permissionId: string) =>
  api.post('/permissions/assign', { roleId, permissionId });

export const removePermissionFromRole = (roleId: string, permissionId: string) =>
  api.post('/permissions/remove', { roleId, permissionId });

export const getPermissionsForRole = (roleId: string) =>
  api.get(`/permissions/role/${roleId}`);

export const assignPermissionsToRole = (roleId: string, permissionIds: string[]) =>
  api.post('/roles/assign-permissions', { roleId, permissionIds });

export const enable2FA = async (): Promise<{ qrCodeUrl: string }> => {
  const response = await api.post('/auth/enable-2fa');
  return response.data;
};

export const verify2FA = async (verificationCode: string): Promise<void> => {
  await api.post('/auth/verify-2fa', { verificationCode });
};

export const disable2FA = async (): Promise<void> => {
  await api.post('/auth/disable-2fa');
};

export const createUser = (data: any) => api.post('/users', data);

export default api;
