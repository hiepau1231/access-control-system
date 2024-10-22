# Hướng dẫn Test Ứng dụng

Để đảm bảo ứng dụng hoạt động đúng như mong đợi, chúng ta cần thực hiện các bước test sau đây:

## 1. Chuẩn bị môi trường

1. Đảm bảo bạn đã cài đặt Node.js và npm trên máy tính.
2. Mở hai terminal: một cho backend và một cho frontend.

## 2. Khởi động Backend

1. Trong terminal dành cho backend, di chuyển đến thư mục backend:
   ```
   cd backend
   ```
2. Cài đặt các dependencies:
   ```
   npm install
   ```
3. Khởi động server:
   ```
   npm run dev
   ```

## 3. Khởi động Frontend

1. Trong terminal dành cho frontend, di chuyển đến thư mục frontend:
   ```
   cd frontend
   ```
2. Cài đặt các dependencies:
   ```
   npm install
   ```
3. Khởi động ứng dụng React:
   ```
   npm start
   ```

## 4. Test các chức năng

### 4.1 Đăng ký và Đăng nhập

1. Mở trình duyệt và truy cập `http://localhost:3000/register`
2. Tạo một tài khoản mới với username, email, và password
3. Sau khi đăng ký thành công, chuyển đến trang đăng nhập `http://localhost:3000/login`
4. Đăng nhập bằng tài khoản vừa tạo

### 4.2 Quản lý Người dùng

1. Sau khi đăng nhập, truy cập trang quản lý người dùng
2. Thử các chức năng:
   - Xem danh sách người dùng
   - Thêm người dùng mới
   - Chỉnh sửa thông tin người dùng
   - Xóa người dùng

### 4.3 Quản lý Vai trò (Roles)

1. Truy cập trang quản lý vai trò
2. Thử các chức năng:
   - Xem danh sách vai trò
   - Tạo vai trò mới
   - Chỉnh sửa vai trò
   - Xóa vai trò

### 4.4 Quản lý Quyền (Permissions)

1. Truy cập trang quản lý quyền
2. Thử các chức năng:
   - Xem danh sách quyền
   - Tạo quyền mới
   - Chỉnh sửa quyền
   - Xóa quyền
   - Gán quyền cho vai trò

### 4.5 Kiểm tra RBAC

1. Tạo các vai trò khác nhau với các quyền khác nhau
2. Tạo người dùng và gán cho họ các vai trò khác nhau
3. Đăng nhập với các tài khoản khác nhau và kiểm tra xem họ có thể truy cập các chức năng phù hợp với quyền của họ không

### 4.6 Kiểm tra Mã hóa Dữ liệu

1. Thêm một người dùng mới với email
2. Kiểm tra trong cơ sở dữ liệu để đảm bảo email đã được mã hóa
3. Lấy thông tin người dùng từ API và kiểm tra xem email đã được giải mã đúng chưa

## 5. Kiểm tra Xử lý Lỗi

1. Thử các tình huống lỗi như:
   - Đăng nhập với thông tin không chính xác
   - Tạo người dùng với username đã tồn tại
   - Truy cập các trang yêu cầu xác thực khi chưa đăng nhập
2. Kiểm tra xem ứng dụng có hiển thị thông báo lỗi phù hợp không

## 6. Kiểm tra Hiệu suất

1. Tạo một số lượng lớn dữ liệu (người dùng, vai trò, quyền)
2. Kiểm tra xem ứng dụng có phản hồi nhanh và mượt mà không
3. Kiểm tra tính năng phân trang và tìm kiếm (nếu có)

## 7. Kiểm tra Tương thích Trình duyệt

Thử nghiệm ứng dụng trên các trình duyệt khác nhau (Chrome, Firefox, Safari, Edge) để đảm bảo tính tương thích.

## 8. Kiểm tra Bảo mật

1. Thử truy cập các API endpoint mà không có token xác thực
2. Kiểm tra xem mật khẩu có được lưu dưới dạng băm trong cơ sở dữ liệu không
3. Thử các cuộc tấn công cơ bản như SQL injection hoặc XSS

Sau khi hoàn thành các bước test trên, bạn sẽ có cái nhìn tổng quan về tính năng và hiệu suất của ứng dụng. Hãy ghi chú lại bất kỳ vấn đề hoặc cải tiến nào bạn phát hiện trong quá trình test.
