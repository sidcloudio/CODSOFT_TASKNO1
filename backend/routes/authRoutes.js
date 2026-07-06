import express from 'express';
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/addresses').get(protect, getUserAddresses).post(protect, addUserAddress);
router.route('/addresses/:id').put(protect, updateUserAddress).delete(protect, deleteUserAddress);

export default router;
