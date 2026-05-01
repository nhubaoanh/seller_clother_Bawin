/**
 * cartService.ts
 * Gọi Next.js API routes: /api/cart
 * (Cart gắn với session người dùng đang đăng nhập)
 */

import { localClient } from './apiClient';

export const cartService = {
  /** Lấy giỏ hàng hiện tại */
  get() {
    return localClient.get('/cart');
  },

  /** Thêm sản phẩm vào giỏ */
  addItem(productId: string, quantity: number, variantId?: string) {
    return localClient.post('/cart', { productId, quantity, variantId });
  },

  /** Cập nhật số lượng 1 item */
  updateItem(itemId: string, quantity: number) {
    return localClient.put('/cart', { id: itemId, quantity });
  },

  /** Xóa 1 item khỏi giỏ */
  removeItem(itemId: string) {
    return localClient.delete(`/cart?id=${itemId}`);
  },
};
