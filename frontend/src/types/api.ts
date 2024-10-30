export interface Permission {
  id: string;
  name: string;
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions?: Permission[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  roleId: string;
  role?: Role;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
} 