import Review from '../models/Review.js';
import Booking from '../models/Booking.js';

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  const { parkingId, rating, comment } = req.body;

  // Only users who booked this parking can review
  const booking = await Booking.findOne({
    user: req.user._id,
    parking: parkingId,
    status: 'completed', // Or 'confirmed' if we want to be more flexible
  });

  if (!booking && process.env.NODE_ENV !== 'development') {
    res.status(400);
    throw new Error('Vous devez avoir réservé ce parking pour laisser un avis');
  }

  const review = await Review.create({
    user: req.user._id,
    parking: parkingId,
    rating,
    comment,
  });

  res.status(201).json({
    success: true,
    data: review,
    message: 'Avis ajouté avec succès',
  });
};

// @desc    Get parking reviews
// @route   GET /api/reviews/parking/:parkingId
// @access  Public
export const getParkingReviews = async (req, res) => {
  const reviews = await Review.find({ parking: req.params.parkingId })
    .populate('user', 'name avatar')
    .sort('-createdAt');

  res.json({
    success: true,
    data: reviews,
  });
};
