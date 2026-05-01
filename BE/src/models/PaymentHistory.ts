export interface PaymentHistory {
  historyId: string;
  paymentId?: string;
  oldStatus?: number;
  newStatus?: number;
  note?: string;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
}