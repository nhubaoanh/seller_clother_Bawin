import crypto from 'crypto';
import CryptoJS from 'crypto-js';

// Format currency to VNĐ
export const formatCurrency = (amount: number): string => {
  if (amount === undefined || amount === null) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VNĐ';
};

// Format date
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

// Generate order number
export const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Slug generation
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// VNPay Signature Functions
export const sortObject = (obj: Record<string, any>): Record<string, any> => {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  
  for (const key of keys) {
    if (obj[key]) {
      sorted[key] = obj[key];
    }
  }
  
  return sorted;
};

export const generateVNPaySignature = (data: Record<string, any>, secretKey: string): string => {
  const sortedData = sortObject(data);
  const signData = new URLSearchParams(sortedData).toString();
  return CryptoJS.HmacSHA512(signData, secretKey).toString();
};

export const verifyVNPaySignature = (
  data: Record<string, any>,
  secretKey: string,
  signature: string
): boolean => {
  const sortedData = sortObject(data);
  const signData = new URLSearchParams(sortedData).toString();
  const computedSignature = CryptoJS.HmacSHA512(signData, secretKey).toString();
  return computedSignature === signature;
};

// Build VNPay URL
export const buildVNPayUrl = (
  params: Record<string, any>,
  merchantKey: string,
  returnUrl: string,
  tmnCode: string
): string => {
  const baseUrl = 'https://sandbox.vnpayment.vn/paygate';
  
  const data: Record<string, any> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: 'vn',
    vnp_CurrCode: 'VND',
    vnp_TxnRef: params.vnp_TxnRef,
    vnp_OrderInfo: params.vnp_OrderInfo,
    vnp_OrderType: params.vnp_OrderType || 'other',
    vnp_Amount: params.vnp_Amount,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: params.vnp_IpAddr || '127.0.0.1',
    vnp_CreateDate: params.vnp_CreateDate,
  };

  const sortedData = sortObject(data);
  const signData = new URLSearchParams(sortedData).toString();
  const vnp_SecureHash = CryptoJS.HmacSHA512(signData, merchantKey).toString();

  return `${baseUrl}?${signData}&vnp_SecureHash=${vnp_SecureHash}`;
};

// Calculate discount
export const calculateDiscount = (
  originalPrice: number,
  discountType: 'PERCENT' | 'FIXED',
  discountValue: number
): number => {
  if (discountType === 'PERCENT') {
    return (originalPrice * discountValue) / 100;
  }
  return discountValue;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (Vietnam)
export const isValidPhoneVN = (phone: string): boolean => {
  const phoneRegex = /^(0|84)[0-9]{9,10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Parse JSON safely
export const parseJSON = <T = any>(json: string, defaultValue?: T): T => {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue as T;
  }
};

// Stringify JSON safely
export const stringifyJSON = (data: any): string => {
  try {
    return JSON.stringify(data);
  } catch {
    return '[]';
  }
};

// Get image URLs from JSON string
export const parseImageUrls = (imagesJson: string): string[] => {
  try {
    const parsed = JSON.parse(imagesJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Calculate average rating
export const calculateAverageRating = (ratings: number[]): number => {
  if (ratings.length === 0) return 0;
  const sum = ratings.reduce((a, b) => a + b, 0);
  return Math.round((sum / ratings.length) * 10) / 10;
};

// Pagination helper
export const calculatePagination = (
  page: number = 1,
  limit: number = 10
): { skip: number; take: number } => {
  const skip = Math.max(0, (page - 1) * limit);
  return { skip, take: limit };
};

// Stock checking
export const checkProductStock = (stock: number, quantity: number): boolean => {
  return stock >= quantity;
};

// Filter price helper
export const filterByPriceRange = (
  minPrice?: number,
  maxPrice?: number
): { gte?: number; lte?: number } => {
  const filter: { gte?: number; lte?: number } = {};
  if (minPrice !== undefined) filter.gte = minPrice;
  if (maxPrice !== undefined) filter.lte = maxPrice;
  return Object.keys(filter).length > 0 ? filter : undefined as any;
};

// Get full image URL
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (path.startsWith('http')) return path;
  
  // Chuẩn hóa đường dẫn: Loại bỏ dấu / ở đầu và chữ uploads/ nếu có
  let cleanPath = path.trim();
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.slice(8);
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
  
  const baseUrl = 'http://localhost:3000';
  return `${baseUrl}/uploads/${cleanPath}`;
};
