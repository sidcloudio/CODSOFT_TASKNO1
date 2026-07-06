import express from 'express';
import {
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts);
router.route('/:id').get(getProductById);
router.route('/:id/reviews').post(protect, createProductReview);

// Admin-specific endpoints
router.route('/admin/manage').post(protect, admin, createProduct);
router.route('/admin/manage/:id').put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

export default router;
