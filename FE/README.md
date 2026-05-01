# 🛍️ JM Fashion - E-Commerce Platform

Một nền tảng thương mại điện tử hoàn chỉnh để bán quần áo nữ, được xây dựng bằng **Next.js 15**, **TypeScript**, **MySQL**, và **VNPay**.

![Next.js](https://img.shields.io/badge/Next.js-15+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-38B2AC)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Tính năng chính

### 👤 Quản lý Người dùng
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập/Đăng xuất
- ✅ Quản lý thông tin cá nhân
- ✅ Lịch sử đơn hàng

### 🛍️ Sản phẩm
- ✅ Danh sách sản phẩm với phân trang
- ✅ Chi tiết sản phẩm đầy đủ
- ✅ Biến thể sản phẩm (size, màu sắc)
- ✅ Hình ảnh sản phẩm
- ✅ Đánh giá & bình luận

### 🔍 Tìm kiếm & Lọc
- ✅ Tìm kiếm theo tên sản phẩm
- ✅ Lọc theo danh mục
- ✅ Lọc theo khoảng giá
- ✅ Sắp xếp (mới nhất, phổ biến, giá, đánh giá)

### 🛒 Giỏ hàng & Thanh toán
- ✅ Thêm/xóa sản phẩm vào giỏ
- ✅ Cập nhật số lượng
- ✅ Tính toán tổng giá
- ✅ Tích hợp VNPay
- ✅ Thanh toán khi nhận hàng (COD)

### ❤️ Danh sách yêu thích
- ✅ Thêm sản phẩm yêu thích
- ✅ Xem danh sách yêu thích
- ✅ Thêm trực tiếp từ yêu thích vào giỏ

### 🎟️ Mã Giảm giá
- ✅ Áp dụng mã giảm giá
- ✅ Hỗ trợ giảm theo % hoặc số tiền
- ✅ Kiểm tra điều kiện sử dụng

### 📦 Quản lý Đơn hàng
- ✅ Tạo đơn hàng
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Xem lịch sử đơn hàng
- ✅ Quản lý địa chỉ giao hàng

## 🚀 Bắt đầu nhanh

### Yêu cầu
- Node.js 18+
- MySQL 8.0+
- npm/pnpm/yarn

### Cài đặt

1. **Clone dự án**
```bash
git clone <repository-url>
cd jm-fashion
```

2. **Cài đặt dependencies**
```bash
pnpm install
```

3. **Cấu hình environment**
```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local` với thông tin của bạn:
```env
DATABASE_URL="mysql://user:password@localhost:3306/jm_fashion"
JWT_SECRET="your-secret-key"
VNPAY_MERCHANT_ID="your-merchant-id"
VNPAY_MERCHANT_KEY="your-merchant-key"
VNPAY_RETURN_URL="http://localhost:3000/api/payment/vnpay/return"
```

4. **Tạo cơ sở dữ liệu**
```bash
mysql -u root -p
CREATE DATABASE jm_fashion;
EXIT;
```

5. **Chạy migrations**
```bash
npx prisma migrate dev --name init
```

6. **Khởi động ứng dụng**
```bash
pnpm dev
```

Truy cập: **http://localhost:3000**

## 📁 Cấu trúc Dự án

```
jm-fashion/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Xác thực
│   │   ├── products/          # Sản phẩm
│   │   ├── cart/              # Giỏ hàng
│   │   ├── orders/            # Đơn hàng
│   │   ├── payment/           # Thanh toán
│   │   ├── reviews/           # Đánh giá
│   │   ├── wishlists/         # Danh sách yêu thích
│   │   └── coupons/           # Mã giảm giá
│   ├── (pages)                # Các trang chính
│   │   ├── page.tsx           # Trang chủ
│   │   ├── login/             # Đăng nhập
│   │   ├── register/          # Đăng ký
│   │   ├── products/          # Danh sách sản phẩm
│   │   ├── cart/              # Giỏ hàng
│   │   ├── checkout/          # Thanh toán
│   │   ├── wishlist/          # Danh sách yêu thích
│   │   ├── orders/            # Đơn hàng
│   │   ├── account/           # Tài khoản
│   │   ├── about/             # Giới thiệu
│   │   └── contact/           # Liên hệ
│   └── layout.tsx             # Root layout
├── components/
│   ├── Header.tsx             # Thanh điều hướng
│   └── Footer.tsx             # Chân trang
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── auth.ts                # Xác thực
│   ├── helpers.ts             # Hàm tiện ích
│   ├── types.ts               # TypeScript types
│   └── store.ts               # Zustand store
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static files
├── QUICK_START.md             # Hướng dẫn nhanh
├── SETUP.md                   # Hướng dẫn cài đặt chi tiết
├── PROJECT_SUMMARY.md         # Tổng quan dự án
└── README.md                  # File này
```

## 🛠️ Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MySQL, Prisma ORM |
| **Authentication** | JWT, bcryptjs, HTTP-only Cookies |
| **State Management** | Zustand, SWR |
| **Payment** | VNPay |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Utilities** | crypto-js, axios, zod |

## 📋 API Endpoints

### Auth (Xác thực)
```
POST   /api/auth/register       # Đăng ký
POST   /api/auth/login          # Đăng nhập
POST   /api/auth/logout         # Đăng xuất
GET    /api/auth/me             # Lấy thông tin user
```

### Products (Sản phẩm)
```
GET    /api/products            # Danh sách sản phẩm (hỗ trợ lọc)
GET    /api/products/[id]       # Chi tiết sản phẩm
GET    /api/categories          # Danh sách danh mục
```

### Cart (Giỏ hàng)
```
GET    /api/cart                # Lấy giỏ hàng
POST   /api/cart                # Thêm vào giỏ
PUT    /api/cart/[id]           # Cập nhật số lượng
DELETE /api/cart/[id]           # Xóa khỏi giỏ
```

### Orders (Đơn hàng)
```
POST   /api/orders/create       # Tạo đơn hàng
```

### Payment (Thanh toán)
```
POST   /api/payment/vnpay/create-url    # Tạo URL thanh toán
GET    /api/payment/vnpay/return        # Callback
```

### Reviews (Đánh giá)
```
GET    /api/reviews             # Danh sách đánh giá
POST   /api/reviews             # Thêm đánh giá mới
```

### Wishlists (Danh sách yêu thích)
```
GET    /api/wishlists           # Danh sách yêu thích
POST   /api/wishlists           # Thêm vào danh sách yêu thích
DELETE /api/wishlists/[id]      # Xóa khỏi danh sách
```

### Coupons (Mã giảm giá)
```
POST   /api/coupons/validate    # Xác thực mã giảm giá
```

## 🔐 Bảo mật

- ✅ Password hashing với bcryptjs
- ✅ JWT tokens với HTTP-only cookies
- ✅ Input validation với Zod
- ✅ CORS protection
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ VNPay signature verification

## 📊 Database Schema

Dự án sử dụng 10+ bảng dữ liệu:
- `users` - Thông tin người dùng
- `products` - Sản phẩm
- `categories` - Danh mục
- `variants` - Biến thể (size, màu)
- `cart_items` - Mục giỏ hàng
- `orders` - Đơn hàng
- `order_items` - Mục đơn hàng
- `reviews` - Đánh giá sản phẩm
- `wishlists` - Danh sách yêu thích
- `coupons` - Mã giảm giá

Xem `prisma/schema.prisma` để chi tiết.

## 🧪 Testing

```bash
# Chạy unit tests
pnpm test

# Chạy e2e tests
pnpm test:e2e

# Chạy Prisma Studio (GUI)
npx prisma studio
```

## 📦 Build & Deploy

### Build
```bash
pnpm build
```

### Production Start
```bash
pnpm start
```

### Deploy to Vercel
```bash
vercel deploy
```

### Deploy to Render, Netlify, etc.
Tham khảo tài liệu của từng nền tảng.

## 📖 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn bắt đầu nhanh
- **[SETUP.md](./SETUP.md)** - Hướng dẫn cài đặt chi tiết
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - Tổng quan dự án

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
pnpm dev -p 3001
```

### Database connection error
- Kiểm tra MySQL server đang chạy
- Kiểm tra DATABASE_URL chính xác
- Kiểm tra user/password

### Prisma migration error
```bash
npx prisma migrate reset
```

## 🤝 Đóng góp

Chúng tôi chào đón các pull request! Vui lòng:

1. Fork dự án
2. Tạo branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được cấp phép dưới MIT License. Xem [LICENSE](./LICENSE) để chi tiết.

## 📧 Support

- **Email**: info@jmfashion.vn
- **Hotline**: 0123 456 789
- **Website**: https://jmfashion.vn

## 🙏 Cảm ơn

Cảm ơn bạn đã sử dụng JM Fashion Platform! Nếu có yêu cầu hoặc đề xuất, vui lòng liên hệ.

---

**Made with ❤️ by JM Fashion Team**

⭐ Nếu bạn thích dự án này, vui lòng cho chúng tôi một sao!
