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
   - TwoFactorSetup.tsx: Thiết lập xác thực 2 yếu tố

2. Common
   - Button.tsx: Component button tái sử dụng
   - LoadingIndicator.tsx: Component loading
   - Navigation.tsx: Thanh điều hướng
   - VirtualTable.tsx: Bảng dữ liệu với virtual scrolling

3. Layout
   - MainLayout.tsx: Layout chính với sidebar và header, dark/light mode
   - ErrorBoundary.tsx: Xử lý lỗi component

4. Role & Permission
   - RoleManagement.tsx: Quản lý vai trò
   - RoleHierarchyManagement.tsx: Quản lý phân cấp vai trò
   - PermissionManagement.tsx: Quản lý quyền
   - RoleHierarchyErrorBoundary.tsx: Xử lý lỗi cho hierarchy

5. User
   - UserManagement.tsx: Quản lý người dùng
   - AccessManagement.tsx: Quản lý quyền truy cập

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
   - Role CRUD với permission validation
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
   - RBAC authorization với format action:resource
   - Permission validation
   - Role hierarchy checks
   - Support cho multiple permissions
   - Automatic admin role detection

### Config
1. database.ts
   - Database initialization
   - Schema management
   - Default data seeding

2. permissions.ts
   - Permission management
   - Automatic permission creation
   - Admin role permission assignment

### Types
1. express/index.d.ts
   - Custom type definitions
   - Request user augmentation

## Tính năng đã hoàn thành
1. Authentication với JWT
2. RBAC với role hierarchy
3. User Management với permission checks
4. Role Management với circular dependency prevention
5. Permission Management với format action:resource
6. Dark/Light mode
7. Error handling và validation
8. Role Hierarchy visualization
9. Error boundaries
10. Loading states

## Đang phát triển
1. Data encryption
2. Performance optimization
3. Security enhancements
4. Caching implementation

## Kế hoạch phát triển
1. Data encryption với Secret Key
2. Audit logging
3. Caching và performance optimization
4. Security hardening
5. Rate limiting