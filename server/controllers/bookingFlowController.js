import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// @desc    Check-in vehicle (Entry)
// @route   POST /api/bookings/:id/checkin
export const checkinBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Réservation non trouvée');
  }

  booking.checkinTime = new Date();
  booking.status = 'in-progress';
  await booking.save();

  res.json({ success: true, message: 'Check-in réussi', data: booking });
};

// @desc    Check-out vehicle & Create Payment (Exit)
// @route   POST /api/bookings/:id/checkout
export const checkoutBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('parking');
  if (!booking) {
    res.status(404);
    throw new Error('Réservation non trouvée');
  }

  const checkoutTime = new Date();
  booking.checkoutTime = checkoutTime;

  // Calculate actual duration in hours
  const durationMs = checkoutTime - booking.checkinTime;
  const durationHours = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));
  const finalPrice = durationHours * booking.parking.pricePerHour;

  booking.actualPrice = finalPrice;
  booking.status = 'completed';

  // Create Stripe PaymentIntent for the actual price
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalPrice * 100,
    currency: 'mad',
    metadata: { bookingId: booking._id.toString() },
  });

  await booking.save();

  res.json({
    success: true,
    clientSecret: paymentIntent.client_secret,
    actualPrice: finalPrice,
    durationHours
  });
};
