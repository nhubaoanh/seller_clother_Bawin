/**
 * couponService.ts
 * Gọi Next.js API routes: /api/coupons
 */

import { localClient } from './apiClient';

export const couponService = {
  /** Kiểm tra mã giảm giá có hợp lệ không */
  validate(code: string, orderAmount: number) {
    return localClient.post('/coupons/validate', { code, orderAmount });
  },
};
