import { Router } from 'express';
import { loginLimiter, registerLimiter, otpLimiter } from '../middleware/rateLimitMiddleware.js';
import { login, logout, register, verifyOtp } from '../controllers/authController.js';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/verify-otp', otpLimiter, verifyOtp);
router.post('/logout', logout);

export default router;
