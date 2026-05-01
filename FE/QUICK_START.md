# JM Fashion - Hướng dẫn Bắt đầu Nhanh

## ⚡ 5 Bước cài đặt trong 10 phút

### Step 1: Clone hoặc Download dự án
```bash
git clone <your-repo-url>
cd jm-fashion
```

### Step 2: Cài đặt Dependencies
```bash
pnpm install
# hoặc: npm install
```

### Step 3: Tạo Database
Tạo cơ sở dữ liệu MySQL:
```bash
mysql -u root -p
CREATE DATABASE jm_fashion;
EXIT;
```

### Step 4: Cấu hình Environment
Sao chép `.env.example` thành `.env.local` và điền thông tin:
```bash
cp .env.example .env.local
```

Chỉnh sửa `.env.local`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/jm_fashion"
JWT_SECRET="thay-doi-thanh-mot-chuoi-bi-mat-an-toan"
VNPAY_MERCHANT_ID="..."
VNPAY_MERCHANT_KEY="..."
VNPAY_RETURN_URL="http://localhost:3000/api/payment/vnpay/return"
```

### Step 5: Tạo bảng cơ sở dữ liệu
```bash
npx prisma migrate dev --name init
```

## 🚀 Chạy ứng dụng

```bash
pnpm dev
```

Mở trình duyệt và truy cập: **http://localhost:3000**

## ✅ Checklist Ban đầu

- [ ] Database MySQL được tạo
- [ ] `.env.local` được cấu hình
- [ ] `pnpm install` đã chạy
- [ ] `npx prisma migrate dev` đã chạy
- [ ] `pnpm dev` chạy thành công
- [ ] Có thể truy cập trang chủ

## 🧪 Kiểm tra các tính năng

### Đăng ký tài khoản
1. Nhấp vào "Đăng ký" ở góc trên phải
2. Điền thông tin: Tên, Email, Mật khẩu
3. Nhấp "Đăng ký"

### Duyệt sản phẩm
1. Nhấp vào "Sản phẩm"
2. Xem danh sách sản phẩm
3. Thử bộ lọc: Danh mục, Giá, Sắp xếp

### Thêm vào giỏ hàng
1. Từ trang sản phẩm, nhấp "Thêm"
2. Chuyển tới trang Giỏ hàng
3. Xem tổng giá

### Tạo đơn hàng
1. Từ giỏ hàng, nhấp "Thanh toán"
2. Điền địa chỉ giao hàng
3. Chọn phương thức thanh toán
4. Nhấp "Hoàn tất thanh toán"

## 📋 Thêm sản phẩm mẫu (Tùy chọn)

Mở Prisma Studio để thêm sản phẩm dễ dàng:

```bash
npx prisma studio
```

1. Nhấp vào `categories` → "Add record"
2. Thêm danh mục (VD: "Áo thun")
3. Nhấp vào `products` → "Add record"
4. Thêm sản phẩm

## 🔗 Links quan trọng

- **Trang chủ**: http://localhost:3000
- **Sản phẩm**: http://localhost:3000/products
- **Giỏ hàng**: http://localhost:3000/cart
- **Đăng nhập**: http://localhost:3000/login
- **Tài khoản**: http://localhost:3000/account
- **Prisma Studio**: `npx prisma studio`

## ⚙️ Cấu hình VNPay (Tùy chọn)

Nếu muốn test thanh toán VNPay:

1. Đăng ký tài khoản tại https://www.vnpay.vn
2. Nhận Merchant ID và Secret Key
3. Cập nhật trong `.env.local`:
   ```env
   VNPAY_MERCHANT_ID=your_id
   VNPAY_MERCHANT_KEY=your_key
   ```

## 🐛 Troubleshooting

### Lỗi: "Cannot find module 'mysql2'"
```bash
pnpm add mysql2
```

### Lỗi: "Port 3000 is already in use"
```bash
pnpm dev -p 3001
```

### Lỗi: Database connection failed
- Kiểm tra MySQL server đang chạy
- Kiểm tra DATABASE_URL trong `.env.local`
- Kiểm tra user/password chính xác

### Lỗi: Prisma migrations failed
```bash
npx prisma migrate reset
```

## 📚 Tài liệu thêm

- **SETUP.md** - Hướng dẫn cài đặt chi tiết
- **PROJECT_SUMMARY.md** - Tổng quan dự án
- **API Endpoints** - Xem trong SETUP.md

## 🎯 Các bước tiếp theo

1. **Thêm sản phẩm**: Sử dụng Prisma Studio hoặc API
2. **Cấu hình VNPay**: Để test thanh toán thực tế
3. **Tùy chỉnh design**: Chỉnh sửa màu sắc trong `globals.css`
4. **Triển khai**: Deploy lên Vercel, Render, hay dịch vụ khác
5. **Thêm tính năng**: Admin panel, email notifications, etc.

## 💡 Tips

- Sử dụng `pnpm dev` để chạy với hot reload
- Sử dụng `npx prisma studio` để quản lý database graphically
- Kiểm tra console trình duyệt (F12) để debug
- API routes có logging tự động

---

**Chúc mừng! Bạn đã sẵn sàng bắt đầu!** 🎉

Nếu có câu hỏi, tham khảo SETUP.md hoặc PROJECT_SUMMARY.md
