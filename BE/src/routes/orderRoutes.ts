import { Router } from 'express';
import { OrderController } from '../controllers/OrderController.js';
import { Database } from '../config/database.js';

const router = Router();
const db = new Database();
const orderController = new OrderController(db);

router.post('/create', orderController.createOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.post('/payment-status', orderController.updatePaymentStatus);

// Admin routes
router.get('/admin/all', orderController.getAllOrdersAdmin);
router.post('/admin/update-status', orderController.updateOrderStatusAdmin);

export default router;
