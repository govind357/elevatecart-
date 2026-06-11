import { Router } from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import requireSession from '../middleware/sessionMiddleware.js';
import {
  createOrder,
  getOrderById,
  getOrderInvoice,
  getOrders,
  updateOrderPaymentStatus,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

router.use(requireSession, protect);
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.get('/:orderId/invoice', getOrderInvoice);
router.put('/:orderId/status', adminOnly, updateOrderStatus);
router.put('/:orderId/payment', adminOnly, updateOrderPaymentStatus);

export default router;
