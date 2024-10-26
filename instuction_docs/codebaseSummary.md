## Project File Structure

project-root/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── RegisterForm.tsx
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── LoadingIndicator.tsx
│   │   │   ├── layout/
│   │   │   │   └── MainLayout.tsx
│   │   │   ├── permission/
│   │   │   │   └── PermissionManagement.tsx
│   │   │   ├── role/
│   │   │   │   └── RoleManagement.tsx
│   │   │   └── user/
│   │   │       └── UserManagement.tsx
│   │   ├── contexts/
│   │   │   └── ThemeContext.tsx
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   │   └── LoginPage.tsx
│   │   │   └── register/
│   │   │       └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── styles/
│   │   │   └── animations.css
│   │   ├── utils/
│   │   │   ├── debounce.ts
│   │   │   └── errorHandler.ts
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   ├── PermissionController.ts
│   │   │   ├── RoleController.ts
│   │   │   └── UserController.ts
│   │   ├── middleware/
│   │   │   ├── authMiddleware.ts
│   │   │   └── checkPermission.ts
│   │   ├── models/
│   │   │   ├── Permission.ts
│   │   │   ├── Role.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── permissionRoutes.ts
│   │   │   ├── roleRoutes.ts
│   │   │   └── userRoutes.ts
│   │   └── app.ts
│   ├── .env
│   └── package.json
├── cline_docs/
│   ├── projectRoadmap.md
│   ├── currentTask.md
│   ├── techStack.md
│   └── codebaseSummary.md
├── instruction.md
└── README.md
