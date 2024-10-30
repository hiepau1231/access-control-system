# Tổng quan về Codebase

## Cấu trúc thư mục

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── role/
│   │   │   │   ├── RoleManagement.tsx
│   │   │   │   └── RoleHierarchyManagement.tsx
│   │   │   ├── permission/
│   │   │   │   └── PermissionManagement.tsx
│   │   │   ├── user/
│   │   │   │   └── UserManagement.tsx
│   │   │   └── layout/
│   │   │       └── MainLayout.tsx
│   │   ├── pages/
│   │   │   └── register/
│   │   │       └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── auth.ts
│   │   └── index.tsx
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── PermissionController.ts
│   │   ├── middleware/
│   │   │   └── checkPermission.ts
│   │   └── routes/
│   │       └── authRoutes.ts
│   ├── package.json
│   └── package-lock.json
│
└── instruction_docs/
    ├── instruction.md
    ├── currenttask.md
    └── codebaseSummary.md
```

## Frontend (React + TypeScript)

### Components
1. Auth
   - LoginForm.tsx: Form đăng nhập
   - RegisterForm.tsx: Form đăng ký

2. Common
   - Button.tsx: Component button tái sử dụng
   - LoadingIndicator.tsx: Component loading

3. Layout
   - MainLayout.tsx: Layout chính với sidebar và header, dark/light mode

4. Role & Permission
   - RoleManagement.tsx: Quản lý vai trò
   - RoleHierarchyManagement.tsx: Quản lý phân cấp vai trò
   - PermissionManagement.tsx: Quản lý quyền

5. User
   - UserManagement.tsx: Quản lý người dùng

### Services
- api.ts: API calls với TypeScript interfaces và error handling
- auth.ts: Authentication và token management

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
   - Role -> Role (Hierarchy with circular dependency check)

### Controllers
1. AuthController
   - Login với JWT
   - Register với role mặc định
   - Token và role management

2. UserController
   - CRUD operations với permission check
   - User management theo role

3. RoleController
   - Role CRUD
   - Role hierarchy management
   - Permission assignment
   - Circular dependency prevention

4. PermissionController
   - Permission CRUD
   - Permission checks
   - Role-based permission management

### Middleware
1. authMiddleware
   - JWT verification
   - User authentication
   - Token validation

2. checkPermission
   - RBAC authorization
   - Permission validation
   - Role hierarchy checks
   - Support cho multiple permissions

### Models
1. User
   - User CRUD operations
   - Password hashing với bcrypt
   - Role assignment
   - Error handling

2. Role
   - Role operations
   - Hierarchy management
   - Permission management
   - Circular dependency checks

3. Permission
   - Permission operations
   - Role assignment
   - Permission validation

## Tính năng đã hoàn thành
1. Authentication với JWT
2. RBAC với role hierarchy
3. User Management với permission checks
4. Role Management với circular dependency prevention
5. Permission Management
6. Dark/Light mode
7. Error handling và validation

## Đang phát triển
1. Role Hierarchy visualization
2. Error boundaries
3. Loading states
4. Performance optimization
5. Security enhancements

## Kế hoạch phát triển
1. Data encryption
2. Audit logging
3. Advanced role hierarchy visualization
4. Caching và performance optimization
5. Security hardening
