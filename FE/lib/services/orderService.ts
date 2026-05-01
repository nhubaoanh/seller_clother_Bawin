import { beClient, localClient } from './apiClient';

export interface CreateOrderPayload {
  userId: string;
  items: any[];
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
}

export const orderService = {
  create: (payload: CreateOrderPayload) => {
    // Gọi qua Local Proxy (/api/orders/create) để xử lý Cookies
    return localClient.post('/orders/create', payload);
  },
  
  getMyOrders: () => {
    // Gọi qua Local Proxy (/api/orders/my-orders) để tự lấy userId từ cookie
    return localClient.get('/orders/my-orders');
  },

  getById: (id: string) => {
    return localClient.get(`/orders/${id}`);
  },

  updatePaymentStatus: (orderId: string, status: number) => {
    return beClient.post('/orders/payment-status', { orderId, status });
  }
};
