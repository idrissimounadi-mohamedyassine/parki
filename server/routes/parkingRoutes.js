import express from 'express';
import { getParkings, getNearbyParkings, getParkingById, createParking, seedParkings } from '../controllers/parkingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getParkings)
  .post(protect, authorize('owner', 'admin'), createParking);

router.post('/seed', seedParkings);
router.get('/nearby', getNearbyParkings);
router.get('/:id', getParkingById);

export default router;
