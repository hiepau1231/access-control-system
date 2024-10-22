import axios from 'axios';

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

export const login = (username: string, password: string) =>
  api.post('/auth/login', { username, password });

export const register = (username: string, password: string, email: string) =>
  api.post('/auth/register', { username, password, email });

export const getUsers = () => api.get('/users');

export const getUser = (id: string) => api.get(`/users/${id}`);

export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);

export const deleteUser = (id: string) => api.delete(`/users/${id}`);

export const getRoles = () => api.get('/roles');

export const getRole = (id: string) => api.get(`/roles/${id}`);

export const createRole = (data: any) => api.post('/roles', data);

export const updateRole = (id: string, data: any) => api.put(`/roles/${id}`, data);

export const deleteRole = (id: string) => api.delete(`/roles/${id}`);

export const getPermissions = () => api.get('/permissions');

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

export default api;
