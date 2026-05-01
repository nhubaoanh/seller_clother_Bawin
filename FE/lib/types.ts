// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// User Types
export interface UserRegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface UserLoginInput {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  search?: string;
  sortBy?: 'newest' | 'popular' | 'price-asc' | 'price-desc' | 'rating';
  page?: number;
  limit?: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  sold: number;
  rating: number;
  ratingCount: number;
  categoryId: string;
  variants: ProductVariant[];
}

// Cart Types
export interface CartItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface CartItemDetail {
  id: string;
  product: ProductDetail;
  variant?: ProductVariant;
  quantity: number;
}

export interface CartSummary {
  items: CartItemDetail[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// Order Types
export interface CreateOrderInput {
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: 'VNPAY' | 'COD';
  couponCode?: string;
  notes?: string;
}

export interface OrderDetail {
  id: string;
  orderNumber: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingAddress: string;
  shippingPhone: string;
  items: OrderItemDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItemDetail {
  id: string;
  product: {
    id: string;
    name: string;
    image: string;
    price: number;
  };
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

// Review Types
export interface CreateReviewInput {
  rating: number;
  comment: string;
}

export interface ReviewDetail {
  id: string;
  product: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: Date;
}

// Coupon Types
export interface CouponDetail {
  id: string;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  minOrderAmount: number;
  expiryDate: Date;
}

// VNPay Payment Types
export interface VNPayCreateUrlParams {
  amount: number;
  orderId: string;
  orderDescription: string;
  orderType?: string;
  language?: string;
}

export interface VNPayIPN {
  vnp_Amount: string;
  vnp_BankCode: string;
  vnp_BankTranNo: string;
  vnp_CardType: string;
  vnp_OrderInfo: string;
  vnp_PayDate: string;
  vnp_ResponseCode: string;
  vnp_TmnCode: string;
  vnp_TransactionNo: string;
  vnp_TransactionStatus: string;
  vnp_TxnRef: string;
  vnp_SecureHash: string;
  vnp_SecureHashType?: string;
}
