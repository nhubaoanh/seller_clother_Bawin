# JM Fashion E-Commerce Platform - Setup Guide

Đây là hướng dẫn chi tiết để thiết lập và chạy nền tảng thương mại điện tử JM Fashion.

## 📋 Yêu cầu

- Node.js 18+
- MySQL Server
- npm hoặc pnpm

## 🚀 Cài đặt

### 1. Cơ sở dữ liệu MySQL

Tạo một cơ sở dữ liệu mới:

```sql
CREATE DATABASE jm_fashion;
```

### 2. Biến môi trường

Tạo tệp `.env.local` trong thư mục gốc dự án:

```env
# Database
DATABASE_URL="mysql://username:password@localhost:3306/jm_fashion"

# JWT
JWT_SECRET="your-secret-key-change-this"

# VNPay (Bạn cần thay đổi các giá trị này)
VNPAY_MERCHANT_ID="your-merchant-id"
VNPAY_MERCHANT_KEY="your-merchant-key"
VNPAY_RETURN_URL="http://localhost:3000/api/payment/vnpay/return"

# Node Environment
NODE_ENV="development"
```

### 3. Cài đặt dependencies

```bash
pnpm install
```

### 4. Tạo bảng cơ sở dữ liệu

```bash
npx prisma migrate dev --name init
```

Lệnh này sẽ tạo tất cả các bảng dữ liệu cần thiết.

### 5. Seed dữ liệu (Tùy chọn)

Tạo tệp `prisma/seed.ts` để thêm dữ liệu mẫu:

```typescript
import { prisma } from "@/lib/db";
import { generateSlug } from "@/lib/helpers";

async function main() {
  // Tạo danh mục
  const categories = await prisma.category.createMany({
    data: [
      { name: "Áo thun", slug: generateSlug("Áo thun") },
      { name: "Áo sơ mi", slug: generateSlug("Áo sơ mi") },
      { name: "Áo khoác", slug: generateSlug("Áo khoác") },
      { name: "Quần jean", slug: generateSlug("Quần jean") },
      { name: "Quần dài", slug: generateSlug("Quần dài") },
      { name: "Chân váy", slug: generateSlug("Chân váy") },
    ],
  });

  console.log("Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Chạy:
```bash
npx prisma db seed
```

### 6. Chạy ứng dụng

```bash
pnpm dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 📝 API Endpoints

### Authentication (Xác thực)
- `POST /api/auth/register` - Đăng ký tài khoản mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại

### Products (Sản phẩm)
- `GET /api/products` - Lấy danh sách sản phẩm (hỗ trợ bộ lọc)
- `GET /api/products/[id]` - Lấy chi tiết sản phẩm
- `GET /api/categories` - Lấy danh sách danh mục

### Cart (Giỏ hàng)
- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm sản phẩm vào giỏ
- `PUT /api/cart/[id]` - Cập nhật số lượng
- `DELETE /api/cart/[id]` - Xóa sản phẩm khỏi giỏ

### Orders (Đơn hàng)
- `POST /api/orders/create` - Tạo đơn hàng mới

### Payment (Thanh toán)
- `POST /api/payment/vnpay/create-url` - Tạo URL thanh toán VNPay
- `GET /api/payment/vnpay/return` - Callback từ VNPay

### Reviews (Đánh giá)
- `GET /api/reviews?productId=...` - Lấy đánh giá sản phẩm
- `POST /api/reviews` - Thêm đánh giá mới

### Wishlist (Danh sách yêu thích)
- `GET /api/wishlists` - Lấy danh sách yêu thích
- `POST /api/wishlists` - Thêm vào danh sách yêu thích
- `DELETE /api/wishlists/[id]` - Xóa khỏi danh sách yêu thích

### Coupons (Mã giảm giá)
- `POST /api/coupons/validate` - Xác thực mã giảm giá

## 🔧 Tính năng chính

✅ **Xác thực người dùng** - Đăng ký, đăng nhập, quản lý tài khoản
✅ **Danh mục sản phẩm** - Quản lý nhiều danh mục
✅ **Tìm kiếm và lọc** - Lọc theo giá, kích cỡ, màu sắc
✅ **Giỏ hàng** - Thêm/xóa/cập nhật sản phẩm
✅ **Thanh toán VNPay** - Tích hợp cổng thanh toán VNPay
✅ **Đơn hàng** - Tạo và quản lý đơn hàng
✅ **Đánh giá sản phẩm** - Khách hàng có thể đánh giá sản phẩm
✅ **Danh sách yêu thích** - Lưu sản phẩm yêu thích
✅ **Mã giảm giá** - Hỗ trợ mã giảm giá/khuyến mãi

## 🛠️ Cấu trúc dự án

```
jm-fashion/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── products/       # Trang sản phẩm
│   ├── cart/           # Trang giỏ hàng
│   ├── checkout/       # Trang thanh toán
│   └── ...
├── components/         # React components
├── lib/               # Utility functions
│   ├── db.ts          # Prisma client
│   ├── auth.ts        # Authentication utilities
│   ├── helpers.ts     # Helper functions
│   ├── types.ts       # TypeScript types
│   └── store.ts       # Zustand store
├── prisma/
│   └── schema.prisma  # Database schema
└── public/            # Static files
```

## 📦 Công nghệ sử dụng

- **Frontend**: Next.js 15+, React 19+, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL, Prisma ORM
- **State Management**: Zustand
- **Data Fetching**: SWR, Fetch API
- **Authentication**: JWT Tokens, HTTP-only Cookies
- **Payment**: VNPay Integration

## ⚠️ Lưu ý quan trọng

1. **Thay đổi JWT_SECRET**: Hãy thay đổi `JWT_SECRET` thành một giá trị an toàn
2. **Cấu hình VNPay**: Bạn cần đăng ký tài khoản VNPay và nhận Merchant ID & Key
3. **HTTPS trong Production**: Luôn sử dụng HTTPS khi triển khai vào production
4. **Bảo mật cơ sở dữ liệu**: Không để lộ thông tin kết nối cơ sở dữ liệu
5. **Xác thực role**: Để quản lý admin, bạn cần thêm role check vào các API

## 🚀 Triển khai

### Vercel
```bash
# Login to Vercel
vercel login

# Deploy
vercel
```

### Render, Netlify, hoặc dịch vụ khác
Tham khảo tài liệu của từng dịch vụ để triển khai Next.js.

## 📧 Hỗ trợ

Nếu có bất kỳ câu hỏi nào, vui lòng liên hệ:
- Email: info@jmfashion.vn
- Hotline: 0123 456 789

---

Chúc mừng bạn đã thiết lập thành công nền tảng JM Fashion! 🎉
