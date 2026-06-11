import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import { createRazorpayOrder, verifyRazorpayPayment, demoRazorpay } from '../controllers/paymentController.js';

const router = Router();

router.post('/razorpay/order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);
// Public demo endpoint to inspect expected Razorpay payloads during development
router.get('/razorpay/demo', demoRazorpay);

export default router;
