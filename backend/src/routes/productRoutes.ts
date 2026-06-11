import { Router } from 'express';
import protect, { adminOnly } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';
import {
  addReview,
  createProduct,
  deleteProduct,
  getProductById,
  getProductReviews,
  getProducts,
  updateProduct,
  uploadProductImages,
} from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.get('/:productId', getProductById);
router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', protect, addReview);
router.post('/:productId/images', protect, adminOnly, upload.array('images', 8), uploadProductImages);
router.post('/', protect, adminOnly, createProduct);
router.put('/:productId', protect, adminOnly, updateProduct);
router.delete('/:productId', protect, adminOnly, deleteProduct);

export default router;
