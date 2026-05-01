import { injectable } from "tsyringe";
import { Order } from "../models/Order.js";
import { Database } from "../config/database.js";

@injectable()
export class OrderRepository {
  constructor(private db: Database) {}

  async getAllOrders(pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL GetAllOrders(?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [pageIndex, pageSize]);
      
      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getAllOrders] Error:", error.message);
      return [];
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const sql = "CALL GetOrderById(?, @err_code, @err_msg)";
      const [results] = await this.db.query(sql, [orderId]);
      
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error: any) {
      console.error("❌ [getOrderById] Error:", error.message);
      return null;
    }
  }

  async getOrdersByUserId(userId: string, pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL GetOrdersByUserId(?, ?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [userId, pageIndex, pageSize]);
      
      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getOrdersByUserId] Error:", error.message);
      return [];
    }
  }

  async createOrder(order: Order): Promise<boolean> {
    try {
      const sql = "CALL CreateOrder(?,?,?,?,?,?, @err_code, @err_msg)";
      await this.db.query(sql, [
        order.orderId,
        order.userId || null,
        order.totalPrice || 0,
        order.shippingAddress || null,
        order.phone || null,
        order.userCreateId || null
      ]);

      // Check error code
      const [result] = await this.db.query("SELECT @err_code as error_code, @err_msg as error_message");
      const errorInfo = Array.isArray(result) ? result[0] : result;

      if (errorInfo.error_code !== 0) {
        throw new Error(errorInfo.error_message || "Tạo đơn hàng thất bại");
      }

      return true;
    } catch (error: any) {
      console.error("❌ [createOrder] Error:", error.message);
      throw new Error(error.message || "Tạo đơn hàng thất bại");
    }
  }

  async updateOrderStatus(orderId: string, orderStatus: number, updatedBy: string): Promise<boolean> {
    try {
      const sql = "CALL UpdateOrderStatus(?, ?, ?, @err_code, @err_msg)";
      await this.db.query(sql, [orderId, orderStatus, updatedBy]);
      return true;
    } catch (error: any) {
      console.error("❌ [updateOrderStatus] Error:", error.message);
      throw new Error(error.message || "Cập nhật trạng thái đơn hàng thất bại");
    }
  }

  async getOrderDetails(orderId: string): Promise<any[]> {
    try {
      const sql = "CALL GetOrderDetails(?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [orderId]);
      
      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getOrderDetails] Error:", error.message);
      return [];
    }
  }

  async addOrderDetail(orderDetailData: any): Promise<boolean> {
    try {
      const sql = "CALL AddOrderDetail(?,?,?,?,?, @err_code, @err_msg)";
      await this.db.query(sql, [
        orderDetailData.orderDetailId,
        orderDetailData.orderId,
        orderDetailData.variantId,
        orderDetailData.price,
        orderDetailData.quantity
      ]);
      return true;
    } catch (error: any) {
      console.error("❌ [addOrderDetail] Error:", error.message);
      throw new Error(error.message || "Thêm chi tiết đơn hàng thất bại");
    }
  }

  async getOrdersByStatus(orderStatus: number, pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL GetOrdersByStatus(?, ?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [orderStatus, pageIndex, pageSize]);
      
      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
      
    } catch (error: any) {
      console.error("❌ [getOrdersByStatus] Error:", error.message);
      return [];
    }
  }

  
}