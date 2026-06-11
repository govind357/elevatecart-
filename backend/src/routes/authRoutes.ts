import { Router } from 'express';
import {authLimiter} from '../middleware/rateLimitMiddleware.js';
import { login, logout, register,verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register',authLimiter, register);
router.post('/login',authLimiter, login);
router.post('/verify-otp', authLimiter, verifyOtp);
router.post('/logout', logout);

export default router;
