import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireSession from '../middleware/sessionMiddleware.js';
import {
  addToCart,
  clearCart,
  checkoutCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from '../controllers/cartController.js';

const router = Router();

router.use(requireSession, protect);
router.get('/', getCart);
router.post('/items', addToCart);
router.put('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);
router.delete('/', clearCart);
router.post('/checkout', checkoutCart);

export default router;
