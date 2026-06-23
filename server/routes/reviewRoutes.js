import express from 'express';
import { addReview, getParkingReviews } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, addReview);
router.get('/parking/:parkingId', getParkingReviews);

export default router;
