import express from 'express';
import { getDashboardMetrics, getUsers, deleteUser } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/dashboard').get(protect, admin, getDashboardMetrics);
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id').delete(protect, admin, deleteUser);

export default router;
