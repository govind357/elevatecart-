import { Router } from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import requireSession from '../middleware/sessionMiddleware.js';
import {
  approveReview,
  createCategory,
  createUser,
  deleteCategory,
  getAllUsers,
  getPendingReviews,
  rejectReview,
  toggleUserBlock,
  updateUserRole,
} from '../controllers/adminController.js';

const router = Router();

router.use(requireSession, protect, adminOnly);
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId/block', toggleUserBlock);
router.get('/reviews/pending', getPendingReviews);
router.put('/reviews/:reviewId/approve', approveReview);
router.put('/reviews/:reviewId/reject', rejectReview);
router.post('/categories', createCategory);
router.delete('/categories/:categoryId', deleteCategory);

export default router;
