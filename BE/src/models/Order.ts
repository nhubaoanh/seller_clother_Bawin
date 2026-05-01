export interface Order {
  orderId: string;
  userId?: string;
  totalPrice?: number;
  orderStatus: number; // 0 = PENDING, 1 = CONFIRMED, 2 = SHIPPING, 3 = COMPLETED, 4 = CANCELLED
  shippingAddress?: string;
  phone?: string;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}