import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Define interfaces for API responses
export interface PaginatedResponse<T> {
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

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    roleId: string;
  };
}

export interface RoleHierarchy {
  parent_role: string;
  child_role: string;
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

// Sửa lại interceptor response để trả về đúng kiểu dữ liệu
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => Promise.reject(error)
);

// Auth APIs
export const login = async (username: string, password: string): Promise<LoginResponse> => 
  api.post('/auth/login', { username, password });

export const register = (username: string, email: string, password: string) => 
  api.post<User>('/auth/register', { username, email, password });

// User APIs
export const getUsers = async (): Promise<User[]> => 
  api.get('/users');

export const getAllUsers = async (): Promise<User[]> => 
  api.get('/users');

export const getUserById = async (id: string): Promise<User> => 
  api.get(`/users/${id}`);

export const createUser = async (data: Partial<User>): Promise<User> => 
  api.post('/users', data);

export const updateUser = async (id: string, data: Partial<User>): Promise<User> => 
  api.put(`/users/${id}`, data);

export const deleteUser = async (id: string): Promise<void> => 
  api.delete(`/users/${id}`);

// Role APIs
export const getRoles = async (): Promise<Role[]> => 
  api.get('/roles');

export const getAllRoles = async (): Promise<Role[]> => 
  api.get('/roles');

export const getRoleById = async (id: string): Promise<Role> => 
  api.get(`/roles/${id}`);

export const createRole = async (data: Partial<Role>): Promise<Role> => 
  api.post('/roles', data);

export const updateRole = async (id: string, data: Partial<Role>): Promise<Role> => 
  api.put(`/roles/${id}`, data);

export const deleteRole = async (id: string): Promise<void> => 
  api.delete(`/roles/${id}`);

export const getRolePermissions = async (id: string): Promise<Permission[]> => 
  api.get(`/roles/${id}/permissions`);

export const getRoleHierarchy = async (): Promise<RoleHierarchy[]> => 
  api.get('/roles/hierarchy');

export const addRoleHierarchy = async (parentRoleId: string, childRoleId: string): Promise<void> => 
  api.post('/roles/hierarchy', { parentRoleId, childRoleId });

// Permission APIs
export const getPermissions = async (
  page?: number, 
  limit?: number, 
  search?: string
): Promise<PaginatedResponse<Permission>> => 
  api.get('/permissions', {
    params: { page, limit, search }
  });

export const getAllPermissions = async (): Promise<Permission[]> => 
  api.get('/permissions');

export const getPermissionById = async (id: string): Promise<Permission> => 
  api.get(`/permissions/${id}`);

export const createPermission = async (data: Partial<Permission>): Promise<Permission> => 
  api.post('/permissions', data);

export const updatePermission = async (id: string, data: Partial<Permission>): Promise<Permission> => 
  api.put(`/permissions/${id}`, data);

export const deletePermission = async (id: string): Promise<void> => 
  api.delete(`/permissions/${id}`);

export const assignPermissionToRole = async (roleId: string, permissionId: string): Promise<void> => 
  api.post('/permissions/assign', { roleId, permissionId });

export default api;
