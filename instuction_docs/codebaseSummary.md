# Tổng quan về Codebase

## Frontend (React + TypeScript)

### Components
1. Auth
   - LoginForm.tsx: Form đăng nhập
   - RegisterForm.tsx: Form đăng ký

2. Common
   - Button.tsx: Component button tái sử dụng
   - LoadingIndicator.tsx: Component loading

3. Layout
   - MainLayout.tsx: Layout chính với sidebar và header

4. Role & Permission
   - RoleManagement.tsx: Quản lý vai trò
   - RoleHierarchyManagement.tsx: Quản lý phân cấp vai trò
   - PermissionManagement.tsx: Quản lý quyền

5. User
   - UserManagement.tsx: Quản lý người dùng

### Services
- api.ts: Tất cả API calls với TypeScript interfaces
- auth.ts: Xử lý authentication

### Context
- ThemeContext.tsx: Quản lý dark/light mode

## Backend (Node.js + TypeScript)

### Database (SQLite)
1. Tables
   - users: Lưu thông tin người dùng
   - roles: Lưu thông tin vai trò
   - permissions: Lưu thông tin quyền
   - role_permissions: Liên kết vai trò-quyền
   - role_hierarchy: Quản lý phân cấp vai trò

2. Relationships
   - User -> Role (Many-to-One)
   - Role -> Permission (Many-to-Many)
   - Role -> Role (Hierarchy)

### Controllers
1. AuthController
   - Login
   - Register
   - Token management

2. UserController
   - CRUD operations
   - User management

3. RoleController
   - Role CRUD
   - Role hierarchy management
   - Permission assignment

4. PermissionController
   - Permission CRUD
   - Permission checks

### Middleware
1. authMiddleware
   - JWT verification
   - User authentication

2. checkPermission
   - RBAC authorization
   - Permission validation
   - Role hierarchy checks

### Models
1. User
   - User operations
   - Password hashing
   - Role assignment

2. Role
   - Role operations
   - Hierarchy management
   - Permission management

3. Permission
   - Permission operations
   - Role assignment

## Tính năng đã hoàn thành
1. Authentication với JWT
2. RBAC cơ bản
3. User Management
4. Role Management
5. Permission Management
6. Role Hierarchy (basic)
7. Dark/Light mode

## Đang phát triển
1. Role Hierarchy validation
2. Error handling nâng cao
3. Unit testing
4. Loading states
5. Error boundaries

## Kế hoạch phát triển
1. Data encryption
2. Audit logging
3. Advanced role hierarchy visualization
4. Performance optimization
5. Security enhancements
