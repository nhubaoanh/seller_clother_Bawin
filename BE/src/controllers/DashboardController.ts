import { Request, Response } from "express";
import { Database } from "../config/database.js";

export class DashboardController {
  constructor(private db: Database) {}

  getStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      // Execute the upgraded dashboard stats procedure
      const results = await this.db.query('CALL Proc_Admin_GetDashboardStats()');
      
      const summary = results[0][0];
      const orderStatus = results[1];
      const topProducts = results[2];
      const revenueByMonth = results[3];
      const recentOrders = results[4];

      const statusLabels: Record<number, string> = {
        0: 'Chờ xác nhận',
        1: 'Đã xác nhận',
        2: 'Đang giao',
        3: 'Hoàn thành',
        4: 'Đã hủy'
      };

      const orderByStatus = orderStatus.map((s: any) => ({
        status: s.orderStatus,
        status_label: statusLabels[s.orderStatus] || `Trạng thái ${s.orderStatus}`,
        count: s.count
      }));

      res.json({
        success: true,
        data: {
          summary: {
            total_sale_revenue: summary.totalRevenue,
            total_import_cost: summary.totalImportCost,
            total_sale_orders: summary.totalOrders,
            total_customers: summary.totalCustomers,
            profit: summary.totalRevenue - summary.totalImportCost,
            pending_orders: orderByStatus.find((s: any) => s.status === 0)?.count || 0,
            completed_orders: orderByStatus.find((s: any) => s.status === 3)?.count || 0,
            cancelled_orders: orderByStatus.find((s: any) => s.status === 4)?.count || 0,
          },
          orderByStatus,
          topProducts: topProducts.map((p: any) => ({
            product_name: p.productName,
            total_sold: p.totalSold,
            total_revenue: p.revenue
          })),
          revenueByMonth: revenueByMonth.map((m: any) => ({
            month_label: m.month_label,
            revenue: m.revenue
          })),
          recentOrders: recentOrders.map((o: any) => ({
            order_id: o.orderId,
            customer_name: o.customer_name || 'Khách vãng lai',
            total_price: o.totalPrice,
            status: statusLabels[o.orderStatus] || 'N/A',
            created_at: o.createdAt
          }))
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
