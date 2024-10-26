# Website Application for Access Control and Data Security Management

## Giới thiệu
Hệ thống quản lý phân quyền và bảo mật dữ liệu cho doanh nghiệp vừa và nhỏ, sử dụng Role-Based Access Control (RBAC) và mã hóa dữ liệu với Secret Key.

## Tính năng chính
- 🔐 Xác thực và phân quyền người dùng (RBAC)
- 👥 Quản lý người dùng
- 🎭 Quản lý vai trò (roles)
- ⚡ Quản lý quyền hạn (permissions)
- 🌳 Phân cấp vai trò (role hierarchy)
- 🎨 Giao diện thân thiện với dark/light mode
- 🔒 Mã hóa dữ liệu nhạy cảm (đang phát triển)

## Công nghệ sử dụng
### Frontend
- React (TypeScript)
- Ant Design (UI Components)
- TailwindCSS (Styling)
- Axios (API Client)

### Backend
- Node.js
- Express
- SQLite
- JWT Authentication

## Cài đặt và Chạy

### Yêu cầu
- Node.js (v14+)
- npm hoặc yarn

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Tài khoản mặc định
- Username: admin
- Password: admin123

## Cấu trúc dự án

### Frontend
```
frontend/
├── src/
│   ├── components/     # React components
│   ├── services/      # API services
│   ├── contexts/      # React contexts
│   ├── pages/         # Page components
│   └── styles/        # CSS styles
```

### Backend
```
backend/
├── src/
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Express middleware
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── config/        # Configuration files
```

## API Documentation

### Authentication
- POST /api/auth/login
- POST /api/auth/register

### Users
- GET /api/users
- POST /api/users
- PUT /api/users/:id
- DELETE /api/users/:id

### Roles
- GET /api/roles
- POST /api/roles
- GET /api/roles/:id/permissions
- GET /api/roles/hierarchy
- POST /api/roles/hierarchy

### Permissions
- GET /api/permissions
- POST /api/permissions
- PUT /api/permissions/:id
- DELETE /api/permissions/:id

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
MIT License - see the [LICENSE](LICENSE) file for details
