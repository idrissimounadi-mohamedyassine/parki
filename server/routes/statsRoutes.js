import express from 'express';
import { getOwnerStats, getAdminStats } from '../controllers/statsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/owner', authorize('owner', 'admin'), getOwnerStats);
router.get('/admin', authorize('admin'), getAdminStats);

export default router;
