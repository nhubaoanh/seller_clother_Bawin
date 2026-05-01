// Filter type cho dashboard
export type DashboardFilterType = '1M' | '3M' | '6M' | '1Y' | 'ALL' | 'CUSTOM';

// Interface cho params gọi API
export interface IDashboardParams {
  filter_type: DashboardFilterType;
  from_date?: string; // YYYY-MM-DD
  to_date?: string;   // YYYY-MM-DD
}

// Interface cho thống kê tổng quan
export interface IDashboardSummary {
  total_sale_orders: number;
  total_sale_revenue: number;
  today_orders: number;
  today_revenue: number;
  total_import_orders: number;
  total_import_cost: number;
  profit: number;
  total_products: number;
  total_customers: number;
  pending_orders: number;
  completed_orders: number;
  cancelled_orders: number;
  filter_from_date: string;
  filter_to_date: string;
}

// Interface cho doanh thu theo tháng
export interface IRevenueByMonth {
  month: string;
  month_label: string;
  order_count: number;
  revenue: number;
}

// Interface cho chi phí nhập theo tháng
export interface IImportCostByMonth {
  month: string;
  month_label: string;
  import_count: number;
  import_cost: number;
}

// Interface cho thống kê theo trạng thái
export interface IOrderByStatus {
  status_label: string;
  status_code: string;
  count: number;
  amount: number;
}

// Interface cho top sản phẩm
export interface ITopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

// Interface cho đơn hàng gần đây
export interface IRecentOrder {
  invoice_id: string;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  status: string;
  payment_method: string;
  created_date: string;
}

// Interface cho response từ API
export interface IDashboardResponse {
  summary: IDashboardSummary;
  revenueByMonth: IRevenueByMonth[];
  importCostByMonth: IImportCostByMonth[];
  orderByStatus: IOrderByStatus[];
  topProducts: ITopProduct[];
  recentOrders: IRecentOrder[];
}
