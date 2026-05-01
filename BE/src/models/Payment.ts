export interface Payment {
  paymentId: string;
  orderId?: string;
  paymentMethod?: number; // 0 = COD, 1 = BANK, 2 = MOMO
  paymentStatus: number; // 0 = PENDING, 1 = SUCCESS, 2 = FAILED
  amount?: number;
  transactionCode?: string;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}