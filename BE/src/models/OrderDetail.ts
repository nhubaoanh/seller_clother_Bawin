export interface OrderDetail {
  orderDetailId: string;
  orderId?: string;
  variantId?: string;
  price?: number;
  quantity?: number;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}