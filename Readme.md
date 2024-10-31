# Hệ thống Quản lý Phân quyền và Bảo mật cho Doanh nghiệp

## Tổng quan
Dự án "Hệ thống Quản lý Phân quyền và Bảo mật" là một ứng dụng web được phát triển nhằm cung cấp giải pháp quản lý quyền truy cập và bảo mật thông tin cho các doanh nghiệp vừa và nhỏ. Hệ thống tập trung vào việc triển khai mô hình Role-Based Access Control (RBAC) với các tính năng bảo mật nâng cao.

## Mục tiêu
- Xây dựng hệ thống quản lý người dùng và phân quyền linh hoạt
- Triển khai mô hình RBAC với khả năng phân cấp vai trò
- Đảm bảo tính bảo mật và an toàn thông tin
- Tạo giao diện người dùng thân thiện và dễ sử dụng

## Tính năng chính
- 🔐 Hệ thống xác thực và phân quyền:
  - Đăng ký và đăng nhập
  - JWT Authentication
  - Protected routes
  - Role-based access control
- 👥 Quản lý người dùng:
  - CRUD operations
  - Phân配 vai trò
  - Quản lý thông tin cá nhân
- 🎭 Quản lý vai trò:
  - Tạo và quản lý vai trò
  - Thiết lập phân cấp vai trò
  - Gán quyền cho vai trò
- ⚡ Quản lý quyền hạn:
  - Tạo và quản lý quyền hệ thống
  - Phân loại quyền theo nhóm
  - Kiểm soát truy cập tài nguyên
- 🌳 Phân cấp vai trò (Role Hierarchy)
- 🎨 Giao diện thân thiện với dark/light mode
- 🔒 Bảo mật nâng cao:
  - Mã hóa dữ liệu nhạy cảm
  - Bảo vệ khỏi tấn công XSS và CSRF
  - Logging và audit trail

## Kiến trúc hệ thống

### Frontend
- React 18 với TypeScript
- Ant Design và TailwindCSS
- Context API cho state management
- React Router cho routing

### Backend
- Node.js với Express
- TypeORM cho database access
- JWT cho authentication
- SQLite làm database

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

## Cấu trúc dự án

### Frontend
```
frontend/
├── src/
│   ├── components/     # React components
│   │   ├── auth/      # Authentication components
│   │   ├── role/      # Role management components
│   │   ├── user/      # User management components
│   │   └── common/    # Shared components
│   ├── services/      # API services
│   ├── contexts/      # React contexts
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── utils/         # Utility functions
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
│   ├── config/        # Configuration files
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript types
```

## API Documentation

### Authentication
- POST /api/auth/login - Đăng nhập
- POST /api/auth/register - Đăng ký
- POST /api/auth/logout - Đăng xuất

### Users
- GET /api/users - Lấy danh sách người dùng
- POST /api/users - Tạo người dùng mới
- PUT /api/users/:id - Cập nhật thông tin người dùng
- DELETE /api/users/:id - Xóa người dùng

### Roles
- GET /api/roles - Lấy danh sách vai trò
- POST /api/roles - Tạo vai trò mới
- PUT /api/roles/:id - Cập nhật vai trò
- DELETE /api/roles/:id - Xóa vai trò
- GET /api/roles/:id/permissions - Lấy quyền của vai trò
- GET /api/roles/hierarchy - Lấy cấu trúc phân cấp vai trò
- POST /api/roles/hierarchy - Cập nhật cấu trúc phân cấp

### Permissions
- GET /api/permissions - Lấy danh sách quyền
- POST /api/permissions - Tạo quyền mới
- PUT /api/permissions/:id - Cập nhật quyền
- DELETE /api/permissions/:id - Xóa quyền

## Kết quả đạt được
- Hệ thống hoạt động ổn định
- Giao diện thân thiện với người dùng
- Bảo mật tốt với nhiều lớp bảo vệ
- Dễ dàng mở rộng và tùy chỉnh
- Tài liệu đầy đủ và chi tiết

## Tài khoản mặc định
- Username: admin
- Password: admin123

## Contributing
1. Fork repository
2. Tạo branch cho tính năng mới (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## License
MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết