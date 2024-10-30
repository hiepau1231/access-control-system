import { authApi, authService, AuthResponse, LoginCredentials, RegisterData } from './auth';
import { AxiosResponse } from 'axios';

// Types
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
  category: string;  // Added category field
}

export interface RoleHierarchy {
  id: string;
  parentRoleId: string;
  childRoleId: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  total: number;
}

// Re-export auth types and functions
export type { AuthResponse, LoginCredentials, RegisterData };
export const login = (credentials: LoginCredentials) => authService.login(credentials);
export const register = (data: RegisterData) => authService.register(data);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();

// Helper function to extract data from axios response
const extractData = <T>(response: AxiosResponse<T>): T => response.data;

// User API
export const userService = {
  getAll: () => authApi.get<User[]>('/users').then(extractData),
  getById: (id: string) => authApi.get<User>(`/users/${id}`).then(extractData),
  create: (data: Partial<User>) => authApi.post<User>('/users', data).then(extractData),
  update: (id: string, data: Partial<User>) => authApi.put<User>(`/users/${id}`, data).then(extractData),
  delete: (id: string) => authApi.delete(`/users/${id}`).then(extractData)
};

// Role API
export const roleService = {
  getAll: () => authApi.get<Role[]>('/roles').then(extractData),
  getById: (id: string) => authApi.get<Role>(`/roles/${id}`).then(extractData),
  create: (data: Partial<Role>) => authApi.post<Role>('/roles', data).then(extractData),
  update: (id: string, data: Partial<Role>) => authApi.put<Role>(`/roles/${id}`, data).then(extractData),
  delete: (id: string) => authApi.delete(`/roles/${id}`).then(extractData),
  getPermissions: (roleId: string) => authApi.get<Permission[]>(`/roles/${roleId}/permissions`).then(extractData),
  assignPermission: (roleId: string, permissionId: string) => 
    authApi.post(`/roles/${roleId}/permissions/${permissionId}`).then(extractData),
  removePermission: (roleId: string, permissionId: string) =>
    authApi.delete(`/roles/${roleId}/permissions/${permissionId}`).then(extractData)
};

// Permission API
export const permissionService = {
  getAll: () => authApi.get<Permission[]>('/permissions').then(extractData),
  getById: (id: string) => authApi.get<Permission>(`/permissions/${id}`).then(extractData),
  create: (data: Partial<Permission>) => authApi.post<Permission>('/permissions', data).then(extractData),
  update: (id: string, data: Partial<Permission>) => authApi.put<Permission>(`/permissions/${id}`, data).then(extractData),
  delete: (id: string) => authApi.delete(`/permissions/${id}`).then(extractData)
};

// Role Hierarchy API
export const roleHierarchyService = {
  getAll: () => authApi.get<RoleHierarchy[]>('/role-hierarchy').then(extractData),
  add: (parentRoleId: string, childRoleId: string) => 
    authApi.post('/role-hierarchy', { parentRoleId, childRoleId }).then(extractData),
  remove: (parentRoleId: string, childRoleId: string) =>
    authApi.delete(`/role-hierarchy/${parentRoleId}/${childRoleId}`).then(extractData)
};

// Export convenience functions
export const getUsers = () => userService.getAll();
export const createUser = (data: Partial<User>) => userService.create(data);
export const updateUser = (id: string, data: Partial<User>) => userService.update(id, data);
export const deleteUser = (id: string) => userService.delete(id);

export const getRoles = () => roleService.getAll();
export const createRole = (data: Partial<Role>) => roleService.create(data);
export const updateRole = (id: string, data: Partial<Role>) => roleService.update(id, data);
export const deleteRole = (id: string) => roleService.delete(id);
export const getRolePermissions = (roleId: string) => roleService.getPermissions(roleId);
export const assignPermissionToRole = (roleId: string, permissionId: string) => 
  roleService.assignPermission(roleId, permissionId);

export const getPermissions = () => permissionService.getAll();
export const createPermission = (data: Partial<Permission>) => permissionService.create(data);
export const updatePermission = (id: string, data: Partial<Permission>) => permissionService.update(id, data);
export const deletePermission = (id: string) => permissionService.delete(id);

export const getRoleHierarchy = () => roleHierarchyService.getAll();
export const addRoleHierarchy = (parentRoleId: string, childRoleId: string) =>
  roleHierarchyService.add(parentRoleId, childRoleId);
export const removeRoleHierarchy = (parentRoleId: string, childRoleId: string) =>
  roleHierarchyService.remove(parentRoleId, childRoleId);