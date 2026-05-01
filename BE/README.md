# 🛍️ Clothing Shop Backend API

## 📋 Mô tả dự án
Backend API cho hệ thống quản lý cửa hàng quần áo, được xây dựng với Node.js, TypeScript, Express và MySQL.

## 🏗️ Kiến trúc hệ thống

### 📁 Cấu trúc thư mục
```
BE/
├── src/
│   ├── config/           # Cấu hình database, JWT, email
│   ├── controllers/      # Controllers xử lý HTTP requests
│   ├── models/          # TypeScript interfaces cho database
│   ├── repositories/    # Data access layer với stored procedures
│   ├── routes/          # API routes definition
│   ├── services/        # Business logic layer
│   ├── middlewares/     # Auth, validation, rate limiting
│   ├── validators/      # Request validation rules
│   └── utils/           # Utility functions
├── uploads/             # File upload storage
├── package.json
├── tsconfig.json
└── nodemon.json
```

### 🔄 Luồng xử lý request
```
Client Request
    ↓
1. CORS & Security Headers
2. Rate Limiting
3. Body Parser
4. Authentication (nếu cần)
5. Validation
6. Controller
7. Service (Business Logic)
8. Repository (Database)
9. Stored Procedure
    ↓
Response to Client
```

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 18.0.0
- MySQL >= 8.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
cd BE
npm install
```

### Cấu hình môi trường
Tạo file `.env`:
```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=clothingShopDB
DB_PORT=3306

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key

# Email (cho reset password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Chạy ứng dụng
```bash
# Development (auto-reload)
npm run dev

# Build production
npm run build

# Run production
npm run start
```

## 📊 Database Schema

### Các bảng chính:
- **users**: Quản lý người dùng (khách hàng, nhân viên)
- **categories**: Danh mục sản phẩm
- **products**: Thông tin sản phẩm
- **productVariants**: Biến thể sản phẩm (size, màu, giá, tồn kho)
- **productImages**: Hình ảnh sản phẩm
- **orders**: Đơn hàng
- **orderDetails**: Chi tiết đơn hàng
- **payments**: Thanh toán
- **paymentHistory**: Lịch sử thanh toán
- **auditLogs**: Nhật ký hệ thống

## 🔌 API Endpoints

### 🏠 Health Check
```http
GET /health
GET /
```

### 👥 User Management
```http
# Public routes
POST /api/users/login
POST /api/users/signup
POST /api/users/refresh-token
POST /api/users/reset-password
POST /api/users/checkuser
GET  /api/users/authorize/:token

# Protected routes (Admin only)
POST /api/users/search
POST /api/users/insert-user
POST /api/users/update-user
POST /api/users/delete

# Protected routes (User)
POST /api/users/update-user-profile
```

### 🛍️ Product Management
```http
# Public routes (Khách hàng xem sản phẩm)
GET  /api/products                    # Lấy tất cả sản phẩm
POST /api/products/search             # Tìm kiếm sản phẩm
GET  /api/products/:productId         # Chi tiết sản phẩm
GET  /api/products/:productId/variants # Biến thể sản phẩm
GET  /api/products/category/:categoryId # Sản phẩm theo danh mục

# Protected routes (Admin only)
POST /api/products                    # Tạo sản phẩm mới
PUT  /api/products                    # Cập nhật sản phẩm
DELETE /api/products                  # Xóa sản phẩm
```

### 📦 Order Management
```http
GET  /api/orders                      # Lấy tất cả đơn hàng
GET  /api/orders/:orderId             # Chi tiết đơn hàng
GET  /api/orders/user/:userId         # Đơn hàng của user
GET  /api/orders/status/:status       # Đơn hàng theo trạng thái
POST /api/orders                      # Tạo đơn hàng mới
PUT  /api/orders/status               # Cập nhật trạng thái
```

## 📝 Request/Response Examples

### Lấy danh sách sản phẩm
```http
GET /api/products?pageIndex=1&pageSize=10

Response:
{
  "success": true,
  "totalItems": 50,
  "page": 1,
  "pageSize": 10,
  "pageCount": 5,
  "data": [
    {
      "productId": "uuid",
      "productName": "Áo thun nam",
      "categoryId": "uuid",
      "description": "Mô tả sản phẩm",
      "thumbnail": "image_url",
      "basePrice": 299000,
      "activeFlag": 1,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "message": "Lấy danh sách sản phẩm thành công"
}
```

### Tìm kiếm sản phẩm
```http
POST /api/products/search
Content-Type: application/json

{
  "pageIndex": 1,
  "pageSize": 10,
  "search_content": "áo thun",
  "categoryId": "optional_category_id"
}
```

### Tạo sản phẩm mới
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "productName": "Áo sơ mi nam",
  "categoryId": "category_uuid",
  "description": "Áo sơ mi nam công sở",
  "thumbnail": "image_url",
  "basePrice": 450000,
  "userCreateId": "user_uuid"
}
```

## 🔒 Bảo mật

### Authentication & Authorization
- **JWT Token**: Access token (1 giờ) + Refresh token (7 ngày)
- **Role-based**: Admin, Staff, Customer
- **Protected Routes**: Middleware `authenticate` và `adminOnly`

### Rate Limiting
- **Login**: 5 lần/15 phút (chống brute force)
- **Register**: 3 tài khoản/giờ (chống spam)
- **Sensitive Operations**: 5 lần/giờ (xóa, reset password)
- **General API**: 100 requests/15 phút

### Data Validation
- **Input Sanitization**: Làm sạch dữ liệu đầu vào
- **SQL Injection Protection**: Sử dụng stored procedures
- **XSS Protection**: Helmet middleware
- **CORS**: Cấu hình origin cho phép

## 🛠️ Công nghệ sử dụng

### Core Technologies
- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express.js**: Web framework
- **MySQL**: Relational database

### Dependencies
- **tsyringe**: Dependency injection
- **mysql2**: MySQL driver
- **cors**: Cross-origin resource sharing
- **nodemailer**: Email service
- **uuid**: UUID generation
- **md5**: Password hashing
- **reflect-metadata**: Metadata reflection

### Development Tools
- **nodemon**: Auto-reload development
- **tsx**: TypeScript execution
- **@types/***: TypeScript definitions

## 📈 Performance & Monitoring

### Database Optimization
- **Stored Procedures**: Tối ưu hóa truy vấn
- **Indexing**: Index trên các trường tìm kiếm
- **Pagination**: Phân trang cho danh sách lớn
- **Connection Pooling**: Quản lý kết nối database

### Logging & Monitoring
- **Console Logging**: Development debugging
- **Error Handling**: Centralized error management
- **Audit Logs**: Theo dõi thao tác quan trọng

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables
Đảm bảo set đúng các biến môi trường production:
- `NODE_ENV=production`
- Database credentials
- JWT secrets
- Email configuration

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push branch: `git push origin feature/new-feature`
5. Submit Pull Request

## 📄 License

ISC License - xem file LICENSE để biết thêm chi tiết.

## 📞 Liên hệ

- **Developer**: Your Name
- **Email**: your.email@example.com
- **GitHub**: https://github.com/yourusername

---

**Happy Coding! 🎉**