import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireSession from '../middleware/sessionMiddleware.js';
import {
  changePassword,
  getMyOrders,
  getAddresses,
  getProfile,
  updateAddress,
  updateProfile,
  addAddress,
  deleteAddress,
} from '../controllers/userController.js';

const router = Router();

router.use(requireSession, protect);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/orders', getMyOrders);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.put('/addresses/:addressId', updateAddress);
router.delete('/addresses/:addressId', deleteAddress);

export default router;
