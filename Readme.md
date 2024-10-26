# Ứng dụng Web Quản lý Truy cập và Bảo mật Dữ liệu

## Tổng quan
Hệ thống web cung cấp kiểm soát truy cập dựa trên vai trò (RBAC) và quản lý bảo mật dữ liệu sử dụng phương pháp mã hóa với Khóa bí mật. Được thiết kế cho doanh nghiệp vừa và nhỏ (SMEs) để đảm bảo kiểm soát truy cập an toàn và bảo vệ dữ liệu.

## Tính năng
- 🔐 Xác thực & Phân quyền người dùng
- 👥 Quản lý người dùng
- 🎭 Kiểm soát truy cập dựa trên vai trò (RBAC)
- 🔑 Quản lý quyền hạn
- 🌓 Hỗ trợ giao diện Sáng/Tối
- 📱 Thiết kế tương thích đa thiết bị

## Công nghệ sử dụng
### Frontend
- React với TypeScript
- Ant Design (AntD)
- TailwindCSS
- React Router
- Axios

### Backend
- Node.js
- Express
- SQLite
- JWT Authentication
- bcrypt cho mã hóa mật khẩu

## Cấu trúc dự án
```
project-root/
├── frontend/                 # Ứng dụng React frontend
│   ├── public/              # File tĩnh
│   └── src/
│       ├── components/      # Components tái sử dụng
│       ├── contexts/        # React contexts
│       ├── pages/          # Components trang
│       ├── services/       # Dịch vụ API
│       └── utils/          # Hàm tiện ích
└── backend/                # Ứng dụng Node.js backend
    └── src/
        ├── config/         # File cấu hình
        ├── controllers/    # Xử lý request
        ├── middleware/     # Middleware Express
        ├── models/         # Mô hình dữ liệu
        └── routes/         # Định tuyến API
```

## Bắt đầu

### Yêu cầu
- Node.js (v14 trở lên)
- npm hoặc yarn

### Cài đặt

1. Clone repository:
```bash
git clone [repository-url]
cd project-root
```

2. Cài đặt dependencies cho backend:
```bash
cd backend
npm install
```

3. Cài đặt dependencies cho frontend:
```bash
cd frontend
npm install
```

### Chạy ứng dụng

1. Khởi động server backend:
```bash
cd backend
npm run dev
```

2. Khởi động server frontend:
```bash
cd frontend
npm start
```

Ứng dụng sẽ chạy tại:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

## Tài khoản mặc định
```
Tên đăng nhập: admin
Mật khẩu: admin123
```

## Trạng thái triển khai tính năng

### Đã hoàn thành ✅
- Xác thực người dùng
- Triển khai RBAC cơ bản
- Quản lý người dùng
- Quản lý vai trò
- Quản lý quyền hạn
- Giao diện Sáng/Tối
- Thiết kế tương thích

### Đang thực hiện 🔄
- Tính năng RBAC nâng cao
- Kiểm soát quyền chi tiết
- Quản lý phân cấp vai trò
- Ghi log hoạt động người dùng

### Kế hoạch ⏳
- Mã hóa dữ liệu
- Quản lý khóa bí mật
- Tối ưu hiệu suất
- Tăng cường tính năng bảo mật

## Tài liệu API

### Xác thực
- POST `/api/auth/login` - Đăng nhập
- POST `/api/auth/register` - Đăng ký

### Người dùng
- GET `/api/users` - Lấy danh sách người dùng
- GET `/api/users/:id` - Lấy thông tin người dùng theo ID
- PUT `/api/users/:id` - Cập nhật người dùng
- DELETE `/api/users/:id` - Xóa người dùng

### Vai trò
- GET `/api/roles` - Lấy danh sách vai trò
- GET `/api/roles/:id` - Lấy thông tin vai trò theo ID
- POST `/api/roles` - Tạo vai trò mới
- PUT `/api/roles/:id` - Cập nhật vai trò
- DELETE `/api/roles/:id` - Xóa vai trò

### Quyền hạn
- GET `/api/permissions` - Lấy danh sách quyền
- GET `/api/permissions/:id` - Lấy thông tin quyền theo ID
- POST `/api/permissions` - Tạo quyền mới
- PUT `/api/permissions/:id` - Cập nhật quyền
- DELETE `/api/permissions/:id` - Xóa quyền

## Đóng góp
1. Fork repository
2. Tạo nhánh tính năng (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên nhánh (`git push origin feature/TinhNangMoi`)
5. Tạo Pull Request

## Giấy phép
Dự án này được cấp phép theo giấy phép MIT - xem file LICENSE để biết thêm chi tiết.
