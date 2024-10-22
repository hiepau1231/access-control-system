# Building a Website Application for Access Control and Data Security Management for Small and Medium Enterprises

## Project Overview
This project aims to design and implement a web-based system that provides role-based access control (RBAC) and data security management using encryption methods with Secret Keys. The application will cater to small and medium-sized enterprises (SMEs), ensuring secure access control and data protection within the system.

## Technologies Used
- **Frontend**: React (TypeScript), Ant Design (AntD), TailwindCSS
- **Backend**: Node.js
- **Database**: (Specify database technology here, such as MongoDB, MySQL, etc.)
- **Encryption**: Secret Key-based encryption methods for sensitive data protection

## Work Breakdown Structure

### Task 1: Build Web Interface (HIGH PRIORITY)
- **Objective**: Develop the web interface and create the frontend foundation.
  - **User interface design**: Design and implement the web interface using AntD and TailwindCSS.
  - **Page creation**: Develop all required pages, including:
    - User login and registration
    - User dashboard
    - Role management interface
    - Access control configuration
    - System settings
  - **Component development**: Create reusable components for:
    - Authentication forms
    - Permission management
    - User management
    - Role assignment
  - **Frontend testing**: Implement comprehensive testing of UI components and user flows.

### Task 2: Research on RBAC and Data Encryption with Secret Key
- **Objective**: Understand and study Role-Based Access Control (RBAC) and encryption techniques.
  - **Study RBAC model**: Focus on how users, roles, and permissions interact within the system.
  - **Understand RBAC components**: Users, Roles, Permissions, and Role hierarchies.
  - **Research data encryption**: Explore the use of Secret Keys for encryption and decryption.
  - **Study encryption algorithms**: Identify suitable encryption algorithms for data protection.

### Task 3: Database Design and Role-Based Access Control System
- **Objective**: Design a database schema that supports RBAC and encryption.
  - **Database schema**: Create tables for Users, Roles, Permissions, and other relevant entities.
  - **Establish relationships**: Define relationships between Users, Roles, and Permissions.
  - **Role management**: Plan how users will be assigned roles and permissions within the system.

### Task 4: Implement Access Control Based on RBAC
- **Objective**: Implement core functionality for user authentication and access control.
  - **User authentication**: Develop user login functionality with authentication checks.
  - **Middleware for access control**: Create middleware to control access based on user roles.
  - **Permission checking**: Implement functions that check user permissions based on assigned roles.

### Task 5: Data Encryption Implementation with Secret Key
- **Objective**: Secure sensitive data through encryption.
  - **Encryption algorithms**: Implement encryption techniques to protect sensitive information.
  - **Encrypt/Decrypt functionality**: Build functions for encrypting and decrypting sensitive data.
  - **Secret Key management**: Set up secure storage and retrieval methods for Secret Keys.

### Task 6: Finalization and Project Report
- **Objective**: Polish the application and document the project.
  - **Bug fixing**: Identify and fix any remaining bugs within the application.
  - **Performance optimization**: Refine the code and improve performance.
  - **Documentation**: Write a detailed report covering the development process and final outcomes.

## Deliverables
1. Fully functional web application with RBAC and data encryption.
2. Frontend built with React, TypeScript, Ant Design, and TailwindCSS.
3. Backend implemented in Node.js.
4. A comprehensive project report detailing the system architecture, development steps, and testing results.

## Project File Structure

```
project-root/
├── frontend/
│ ├── public/
│ │ └── index.html
│ ├── src/
│ │ ├── components/
│ │ │ ├── auth/
│ │ │ │ ├── LoginForm.tsx
│ │ │ │ └── RegisterForm.tsx
│ │ │ ├── user/
│ │ │ │ └── UserManagement.tsx
│ │ │ ├── role/
│ │ │ │ └── RoleManagement.tsx
│ │ │ └── permission/
│ │ │ └── PermissionManagement.tsx
│ │ ├── pages/
│ │ │ ├── dashboard/
│ │ │ │ └── DashboardPage.tsx
│ │ │ ├── login/
│ │ │ │ └── LoginPage.tsx
│ │ │ ├── register/
│ │ │ │ └── RegisterPage.tsx
│ │ │ ├── user/
│ │ │ │ └── UserManagementPage.tsx
│ │ │ ├── role/
│ │ │ │ └── RoleManagementPage.tsx
│ │ │ ├── permission/
│ │ │ │ └── PermissionManagementPage.tsx
│ │ │ └── settings/
│ │ │ └── SettingsPage.tsx
│ │ ├── services/
│ │ │ └── api.ts
│ │ └── App.tsx
│ ├── package.json
│ └── tsconfig.json
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── database.ts
│ │ ├── controllers/
│ │ │ ├── AuthController.ts
│ │ │ ├── UserController.ts
│ │ │ ├── RoleController.ts
│ │ │ └── PermissionController.ts
│ │ ├── middleware/
│ │ │ └── authMiddleware.ts
│ │ ├── models/
│ │ │ ├── User.ts
│ │ │ ├── Role.ts
│ │ │ └── Permission.ts
│ │ ├── routes/
│ │ │ ├── authRoutes.ts
│ │ │ ├── userRoutes.ts
│ │ │ ├── roleRoutes.ts
│ │ │ └── permissionRoutes.ts
│ │ ├── utils/
│ │ │ ├── encryption.ts
│ │ │ └── cache.ts
│ │ └── app.ts
│ ├── package.json
│ └── tsconfig.json
├── package.json
├── README.md
├── instruction.md
├── currenttask.md
└── test.md

## Data Type Definitions

### User
- `id`: UUID, Primary Key
- `username`: string, unique
- `password`: string, hashed
- `email`: string, unique
- `roleId`: UUID, Foreign Key referencing Role

### Role
- `id`: UUID, Primary Key
- `name`: string, unique
- `description`: string

### Permission
- `id`: UUID, Primary Key
- `name`: string, unique
- `description`: string

## API Schema

### Authentication

#### POST /api/auth/login
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string"
}
```

### Users

#### GET /api/users
**Response:**
```json
[
  {
    "id": "UUID",
    "username": "string",
    "email": "string",
    "roleId": "UUID"
  }
]
```

#### POST /api/users
**Request Body:**
```json
{
  "username": "string",
  "password": "string",
  "email": "string",
  "roleId": "UUID"
}
```

**Response:**
```json
{
  "id": "UUID",
  "username": "string",
  "email": "string",
  "roleId": "UUID"
}
```

