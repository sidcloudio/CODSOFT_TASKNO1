import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

// Admin-specific endpoints
router.route('/admin/all').get(protect, admin, getOrders);
router.route('/admin/:id/status').put(protect, admin, updateOrderStatus);

export default router;
