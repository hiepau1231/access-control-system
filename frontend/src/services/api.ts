import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Define interfaces for API responses
interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  total: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roleId: string;
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', { username, password });
  return response.data;
};

export const register = async (username: string, email: string, password: string): Promise<User> => {
  const response = await api.post<User>('/auth/register', { username, email, password });
  return response.data;
};

// User APIs
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getAllUsers = () => getUsers();

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (data: Partial<User>): Promise<User> => {
  const response = await api.post<User>('/users', data);
  return response.data;
};

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Role APIs
export const getRoles = async (): Promise<Role[]> => {
  const response = await api.get<Role[]>('/roles');
  return response.data;
};

export const getAllRoles = () => getRoles();

export const getRoleById = async (id: string): Promise<Role> => {
  const response = await api.get<Role>(`/roles/${id}`);
  return response.data;
};

export const createRole = async (data: Partial<Role>): Promise<Role> => {
  const response = await api.post<Role>('/roles', data);
  return response.data;
};

export const updateRole = async (id: string, data: Partial<Role>): Promise<Role> => {
  const response = await api.put<Role>(`/roles/${id}`, data);
  return response.data;
};

export const deleteRole = async (id: string): Promise<void> => {
  await api.delete(`/roles/${id}`);
};

export const getRolePermissions = async (id: string): Promise<Permission[]> => {
  const response = await api.get<Permission[]>(`/roles/${id}/permissions`);
  return response.data;
};

// Permission APIs
export const getPermissions = async (page?: number, limit?: number, search?: string): Promise<PaginatedResponse<Permission>> => {
  const response = await api.get<PaginatedResponse<Permission>>('/permissions', {
    params: { page, limit, search }
  });
  return response.data;
};

export const getAllPermissions = async (): Promise<Permission[]> => {
  const response = await api.get<Permission[]>('/permissions');
  return response.data;
};

export const getPermissionById = async (id: string): Promise<Permission> => {
  const response = await api.get<Permission>(`/permissions/${id}`);
  return response.data;
};

export const createPermission = async (data: Partial<Permission>): Promise<Permission> => {
  const response = await api.post<Permission>('/permissions', data);
  return response.data;
};

export const updatePermission = async (id: string, data: Partial<Permission>): Promise<Permission> => {
  const response = await api.put<Permission>(`/permissions/${id}`, data);
  return response.data;
};

export const deletePermission = async (id: string): Promise<void> => {
  await api.delete(`/permissions/${id}`);
};

export const assignPermissionToRole = async (roleId: string, permissionId: string): Promise<void> => {
  await api.post('/permissions/assign', { roleId, permissionId });
};

export default api;
