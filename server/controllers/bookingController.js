import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';
import sendEmail from '../utils/email.js';

export const createBooking = async (req, res) => {
  const { parkingId, startTime, endTime, plateNumber } = req.body;
  const parking = await Parking.findById(parkingId);
  if (!parking) {
    res.status(404);
    throw new Error('Parking non trouvé');
  }
  const conflicts = await Booking.findOne({
    parking: parkingId,
    status: 'confirmed',
    $or: [{ startTime: { $lt: endTime }, endTime: { $gt: startTime } }],
  });
  if (conflicts) {
    res.status(400);
    throw new Error('Ce créneau est déjà réservé');
  }
  const durationHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60);
  const totalPrice = Math.ceil(durationHours * parking.pricePerHour);
  const booking = await Booking.create({
    user: req.user._id,
    parking: parkingId,
    plateNumber,
    startTime,
    endTime,
    totalPrice,
  });

  try {
    await sendEmail({
      email: req.user.email,
      subject: 'Votre réservation Parki est en attente',
      message: `Votre réservation pour ${parking.title} est créée. Veuillez procéder au paiement pour la confirmer.`,
    });
  } catch (error) {
    console.error('Email error:', error);
  }

  res.status(201).json({ success: true, data: booking });
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id }).populate('parking').sort('-createdAt');
  res.json({ success: true, data: bookings });
};

// @desc    Get bookings for owner's parkings
// @route   GET /api/bookings/owner
export const getOwnerBookings = async (req, res) => {
  const parkings = await Parking.find({ owner: req.user._id });
  const parkingIds = parkings.map(p => p._id);
  const bookings = await Booking.find({ parking: { $in: parkingIds } })
    .populate('user', 'name email')
    .populate('parking', 'title city')
    .sort('-createdAt');

  res.json({ success: true, data: bookings });
};

export const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Réservation non trouvée');
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Non autorisé');
  }
  const hoursToStart = (new Date(booking.startTime) - new Date()) / (1000 * 60 * 60);
  let refundAmount = 0;
  if (hoursToStart > 24) refundAmount = booking.totalPrice;
  else if (hoursToStart > 2) refundAmount = booking.totalPrice * 0.5;
  booking.status = 'cancelled';
  await booking.save();
  res.json({
    success: true,
    message: `Réservation annulée. Remboursement estimé: ${refundAmount} MAD`,
    data: booking,
  });
};
