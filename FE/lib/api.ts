/**
 * api.ts - Barrel export tổng
 *
 * Dùng tại các trang chỉ cần import một chỗ:
 *   import { productService, cartService } from '@/lib/api'
 *
 * Hoặc import trực tiếp từ service cụ thể:
 *   import { productService } from '@/lib/services/productService'
 */

export { productService } from './services/productService';
export { authService }    from './services/authService';
export { cartService }    from './services/cartService';
export { orderService }   from './services/orderService';
export { couponService }  from './services/couponService';

// Re-export http helpers nếu cần custom fetch
export { beGet, nextApi, BE_BASE_URL } from './services/http';
export type { ApiResult } from './services/http';
