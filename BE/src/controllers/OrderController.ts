import { Request, Response } from 'express';
import { Database } from '../config/database.js';

export class OrderController {
  constructor(private db: Database) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      let { userId, items, shippingAddress, phone, paymentMethod } = req.body;

      console.log('📦 [Backend Received Body]:', JSON.stringify(req.body, null, 2));

      if (!userId) {
        // Fallback: Tìm user mới nhất nếu thiếu ID (chỉ dùng khi test hoặc lỗi session)
        const latestUser = await this.db.query('SELECT userId FROM users ORDER BY createdAt DESC LIMIT 1');
        if (latestUser && latestUser.length > 0) {
          userId = latestUser[0].userId;
          console.log('⚠️ Warning: Using fallback userId:', userId);
        } else {
          res.status(400).json({ success: false, error: 'Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.' });
          return;
        }
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        console.log('❌ Error: Empty items array received');
        res.status(400).json({ success: false, error: 'Giỏ hàng của bạn đang trống hoặc dữ liệu không hợp lệ.' });
        return;
      }

      console.log('🛒 Order Items Detail:', items.map(i => ({ pid: i.productId || i.id, q: i.quantity })));

      let totalPrice = 0;
      for (const item of items) {
        const price = Number(item.price || 0);
        const quantity = Number(item.quantity || 0);
        totalPrice += price * quantity;
      }
      
      const tax = Math.round(totalPrice * 0.1);
      const shipping = totalPrice >= 500000 ? 0 : 30000;
      const finalTotal = totalPrice + tax + shipping;

      const orderId = `ORD${Date.now()}`;
      
      await this.db.query(
        'CALL Proc_CreateOrderHeader(?, ?, ?, ?, ?)',
        [orderId, userId, finalTotal, shippingAddress, phone]
      );

      for (const item of items) {
        const orderDetailId = `OD${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const pId = item.productId || item.id || 'PROD_UNKNOWN';
        await this.db.query(
          'CALL Proc_CreateOrderDetail(?, ?, ?, ?, ?, ?)',
          [orderDetailId, orderId, item.variantId || 'VAR001', item.price, item.quantity, userId]
        );
      }

      const paymentId = `PAY${Date.now()}`;
      // 0: COD, 1: BANK, 2: VNPAY/MOMO
      const method = paymentMethod === 'BANK' || paymentMethod === 'VNPAY' ? 2 : 0; 
      await this.db.query(
        'CALL Proc_CreatePayment(?, ?, ?, ?, ?)',
        [paymentId, orderId, method, finalTotal, userId]
      );

      res.json({
        success: true,
        data: {
          orderId,
          paymentId,
          totalPrice: finalTotal
        },
        message: 'Order created successfully'
      });
    } catch (error) {
      console.error('Create order error:', error);
      res.status(500).json({ success: false, error: 'Failed to create order' });
    }
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.query;
      if (!userId) {
         res.status(400).json({ success: false, error: 'UserId required' });
         return;
      }

      const results = await this.db.query('CALL Proc_GetMyOrders(?)', [userId]);
      const orders = results && results.length > 0 ? results[0] : [];
      res.json({ success: true, data: orders });
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ success: false, error: 'Failed to get orders' });
    }
  };
  
  updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, status } = req.body;
      await this.db.query('CALL Proc_UpdatePaymentStatus(?, ?)', [orderId, status]);
      res.json({ success: true, message: 'Payment status updated' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update payment status' });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const headerResults = await this.db.query('CALL Proc_GetMyOrders_Single(?)', [id]);
      const itemResults = await this.db.query('CALL Proc_GetOrderDetails(?)', [id]);

      const orderHeader = headerResults[0] && headerResults[0][0];
      const orderItems = itemResults[0] || [];

      if (!orderHeader) {
        res.status(404).json({ success: false, error: 'Không tìm thấy đơn hàng' });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          ...orderHeader,
          items: orderItems
        }
      });
    } catch (error) {
      console.error('Get order by id error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  getAllOrdersAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const results = await this.db.query('CALL Proc_Admin_GetAllOrders()');
      const orders = results && results.length > 0 ? results[0] : [];
      res.json({ success: true, data: orders });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch admin orders' });
    }
  };

  updateOrderStatusAdmin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderId, status, adminId } = req.body;
      await this.db.query('CALL Proc_Admin_UpdateOrderStatus(?, ?, ?)', [orderId, status, adminId]);
      res.json({ success: true, message: 'Order status updated by admin' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update order status' });
    }
  };
}
