export interface IInvoice {
  orderId: string;
  userId: string;
  fullName: string;
  email: string;
  totalPrice: number | string;
  orderStatus: number;
  shippingAddress: string;
  phone: string;
  paymentMethod?: string;
  paymentStatus?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  // Các trường cũ để tránh lỗi compile nếu chưa sửa hết
  invoice_id?: string;
  invoice_code?: string;
}

export interface IInvoiceSearch {
  search_content?: string;
  pageIndex: number;
  pageSize: number;
}