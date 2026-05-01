# JM Fashion E-Commerce Platform - Tổng quan dự án

## 🎯 Mục đích

Xây dựng một nền tảng thương mại điện tử hoàn chỉnh để bán quần áo nữ với tất cả các tính năng cần thiết cho một cửa hàng online chuyên nghiệp.

## ✨ Tính năng chính

### 1️⃣ Hệ thống Xác thực
- ✅ Đăng ký tài khoản mới
- ✅ Đăng nhập an toàn
- ✅ Quản lý hồ sơ người dùng
- ✅ JWT-based authentication với HTTP-only cookies

### 2️⃣ Quản lý Sản phẩm
- ✅ Danh sách sản phẩm với phân trang
- ✅ Chi tiết sản phẩm
- ✅ Hỗ trợ biến thể (size, màu sắc)
- ✅ Hệ thống danh mục sản phẩm

### 3️⃣ Hệ thống Tìm kiếm & Lọc
- ✅ Tìm kiếm theo tên/mô tả
- ✅ Lọc theo danh mục
- ✅ Lọc theo khoảng giá
- ✅ Sắp xếp (mới nhất, phổ biến, giá, đánh giá)

### 4️⃣ Giỏ hàng
- ✅ Thêm/xóa sản phẩm
- ✅ Cập nhật số lượng
- ✅ Tính toán tổng giá
- ✅ Tính thuế và vận chuyển

### 5️⃣ Hệ thống Thanh toán
- ✅ Tích hợp VNPay
- ✅ Thanh toán khi nhận hàng (COD)
- ✅ Xác minh chữ ký VNPay
- ✅ Cập nhật trạng thái đơn hàng

### 6️⃣ Quản lý Đơn hàng
- ✅ Tạo đơn hàng
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Lịch sử đơn hàng
- ✅ Hỗ trợ nhiều phương thức thanh toán

### 7️⃣ Đánh giá & Bình luận
- ✅ Đánh giá sản phẩm (1-5 sao)
- ✅ Bình luận chi tiết
- ✅ Hiển thị đánh giá trung bình
- ✅ Giới hạn một đánh giá per user per product

### 8️⃣ Danh sách Yêu thích
- ✅ Thêm/xóa khỏi danh sách yêu thích
- ✅ Xem tất cả sản phẩm yêu thích
- ✅ Thêm trực tiếp vào giỏ từ yêu thích

### 9️⃣ Mã Giảm giá & Khuyến mãi
- ✅ Tạo mã giảm giá
- ✅ Hỗ trợ giảm giá theo % hoặc số tiền cố định
- ✅ Đặt số lần sử dụng tối đa
- ✅ Đặt ngày hết hạn
- ✅ Đặt số tiền đơn hàng tối thiểu

## 🏗️ Kiến trúc Dự án

### Frontend (Next.js 15+)
```
- 📄 Pages: Home, Products, Cart, Checkout, Account, Orders, Wishlist
- 🧩 Components: Header, Footer, ProductCard, CartItem
- 🎨 Styling: Tailwind CSS + shadcn/ui components
- 📊 State: Zustand store for auth & cart
```

### Backend (Next.js API Routes)
```
- 🔐 /api/auth/* - Authentication endpoints
- 📦 /api/products/* - Product endpoints
- 🛒 /api/cart/* - Cart management
- 📝 /api/orders/* - Order management
- 💳 /api/payment/* - Payment processing
- ⭐ /api/reviews/* - Reviews
- ❤️ /api/wishlists/* - Wishlists
- 🎟️ /api/coupons/* - Coupon validation
```

### Database (MySQL + Prisma)
```
- users
- products
- categories
- variants (size/color options)
- cart_items
- orders
- order_items
- reviews
- wishlists
- coupons
```

## 🛠️ Tech Stack

| Lớp | Công nghệ |
|-----|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MySQL, Prisma ORM |
| **Auth** | JWT + HTTP-only Cookies, bcryptjs |
| **State** | Zustand, SWR |
| **Payment** | VNPay Integration |
| **Utilities** | crypto-js, axios, zod |

## 📁 Cấu trúc Thư mục

```
jm-fashion/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication
│   │   ├── products/          # Products
│   │   ├── cart/              # Cart
│   │   ├── orders/            # Orders
│   │   ├── payment/           # Payments
│   │   ├── reviews/           # Reviews
│   │   ├── wishlists/         # Wishlists
│   │   ├── coupons/           # Coupons
│   │   └── categories/        # Categories
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── login/                 # Login page
│   ├── register/              # Register page
│   ├── products/              # Products page
│   ├── product/[id]/          # Product detail
│   ├── cart/                  # Cart page
│   ├── checkout/[orderId]/    # Checkout page
│   ├── wishlist/              # Wishlist page
│   ├── orders/                # Orders list
│   ├── orders/[id]/           # Order detail
│   ├── account/               # Account settings
│   ├── about/                 # About page
│   ├── contact/               # Contact page
│   └── globals.css            # Global styles
├── components/
│   ├── Header.tsx             # Navigation header
│   └── Footer.tsx             # Footer
├── lib/
│   ├── db.ts                  # Prisma client
│   ├── auth.ts                # Auth utilities
│   ├── helpers.ts             # Helper functions
│   ├── types.ts               # TypeScript types
│   └── store.ts               # Zustand store
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
├── SETUP.md                   # Setup instructions
└── PROJECT_SUMMARY.md         # This file
```

## 🚀 Các bước triển khai

### Phase 1: Setup Ban đầu ✅
- [x] Cấu hình dự án Next.js
- [x] Cài đặt dependencies
- [x] Tạo Prisma schema
- [x] Cấu hình database

### Phase 2: Authentication ✅
- [x] API đăng ký
- [x] API đăng nhập
- [x] API đăng xuất
- [x] Lấy thông tin user
- [x] JWT token management

### Phase 3: Sản phẩm & Danh mục ✅
- [x] API danh sách sản phẩm
- [x] API chi tiết sản phẩm
- [x] Hỗ trợ lọc & tìm kiếm
- [x] API danh mục
- [x] Giao diện trang sản phẩm

### Phase 4: Giỏ hàng ✅
- [x] API thêm vào giỏ
- [x] API cập nhật giỏ
- [x] API xóa từ giỏ
- [x] Giao diện giỏ hàng
- [x] Tính toán tổng giá

### Phase 5: Thanh toán ✅
- [x] Tích hợp VNPay
- [x] Tạo đơn hàng
- [x] Xử lý callback VNPay
- [x] Cập nhật trạng thái thanh toán
- [x] Giao diện checkout

### Phase 6: Đánh giá & Yêu thích ✅
- [x] API đánh giá sản phẩm
- [x] API danh sách yêu thích
- [x] Thêm/xóa yêu thích
- [x] Hiển thị đánh giá

### Phase 7: Mã giảm giá ✅
- [x] API xác thực coupon
- [x] Tính toán giảm giá
- [x] Hỗ trợ % hoặc số tiền cố định

### Phase 8: Trang bổ sung ✅
- [x] Trang chủ
- [x] Trang giới thiệu
- [x] Trang liên hệ
- [x] Trang tài khoản
- [x] Trang đơn hàng

## 📝 Notes & Hướng dẫn sử dụng

### Để thêm sản phẩm vào database

Sử dụng Prisma Studio:
```bash
npx prisma studio
```

Hoặc tạo seed script trong `prisma/seed.ts`

### Cấu hình VNPay

1. Đăng ký tài khoản tại [VNPay](https://www.vnpay.vn)
2. Nhận Merchant ID và Secret Key
3. Thêm vào `.env.local`:
   ```env
   VNPAY_MERCHANT_ID=your_merchant_id
   VNPAY_MERCHANT_KEY=your_merchant_key
   VNPAY_RETURN_URL=http://localhost:3000/api/payment/vnpay/return
   ```

### Quản lý Admin (Cần thêm)

Để hoàn thiện nền tảng, bạn cần thêm:
- Role-based access control (User vs Admin)
- Admin panel để quản lý sản phẩm
- Quản lý đơn hàng từ phía admin
- Quản lý coupons
- Dashboard thống kê bán hàng

## 🎨 Ghi chú về Design

- **Màu sắc chính**: Rose (#e11d48), Pink (#ec4899)
- **Font**: Inter (sans), Geist Mono (code)
- **Responsive**: Mobile-first approach
- **Components**: Sử dụng Tailwind CSS utilities

## 🔒 Bảo mật

- ✅ Password hashing với bcryptjs
- ✅ JWT tokens với HTTP-only cookies
- ✅ CORS protection
- ✅ Input validation với Zod
- ✅ XSS protection
- ✅ SQL injection prevention (Prisma)
- ✅ VNPay signature verification

## ⚡ Performance

- ✅ Image optimization với Next.js Image
- ✅ Code splitting tự động
- ✅ Server-side rendering (SSR)
- ✅ Static generation nơi có thể
- ✅ Caching strategy cho API

## 🧪 Testing (Cần thêm)

- Unit tests cho utils
- Integration tests cho API
- E2E tests cho user flows
- Payment testing với VNPay sandbox

## 📚 Documentations

Xem `SETUP.md` để hướng dẫn chi tiết cài đặt

## 🎯 Kế tiếp

1. Triển khai lên production (Vercel, Render, etc)
2. Thêm admin panel
3. Thêm analytics & tracking
4. Tối ưu SEO
5. Thêm email notifications
6. Thêm social login
7. Thêm chatbot support
8. Thêm mobile app

---

**Dự án được xây dựng bằng Next.js 15, TypeScript, Tailwind CSS và MySQL.**
**Dùng cho JM Fashion - Thương hiệu thời trang nữ**
