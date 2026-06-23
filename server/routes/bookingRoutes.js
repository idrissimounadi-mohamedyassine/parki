import express from 'express';
import { createBooking, getMyBookings, getOwnerBookings, cancelBooking } from '../controllers/bookingController.js';
import { checkinBooking, checkoutBooking } from '../controllers/bookingFlowController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createBooking);
router.get('/my', getMyBookings);
router.get('/owner', authorize('owner', 'admin'), getOwnerBookings);
router.patch('/:id/cancel', cancelBooking);

// Manual or Admin trigger for check-in/out
router.post('/:id/checkin', authorize('owner', 'admin'), checkinBooking);
router.post('/:id/checkout', authorize('owner', 'admin'), checkoutBooking);

export default router;
