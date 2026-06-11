import { Router } from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import {
  dashboardSummary,
  pendingOrdersCount,
  recentOrders,
  salesByCategory,
  topSellingProducts,
} from '../controllers/dashboardController.js';

const router = Router();

router.use(protect, adminOnly);
router.get('/summary', dashboardSummary);
router.get('/pending-orders', pendingOrdersCount);
router.get('/sales-by-category', salesByCategory);
router.get('/recent-orders', recentOrders);
router.get('/top-products', topSellingProducts);

export default router;
