import Booking from '../models/Booking.js';
import { checkinBooking, checkoutBooking } from './bookingFlowController.js';

// Camera API Key Middleware (Simple version)
const protectCamera = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.CAMERA_API_KEY) {
    return res.status(401).json({ success: false, message: 'Invalid Camera API Key' });
  }
  next();
};

export const handleCameraEntry = async (req, res) => {
  const { plate, parkingId } = req.body;

  // Find active reservation for this plate at this parking
  const booking = await Booking.findOne({
    plateNumber: plate,
    parking: parkingId,
    status: 'confirmed'
  });

  if (!booking) {
    // Handle vehicles without reservation (Direct Parking)
    // Here we could create a new 'guest' booking automatically
    return res.status(404).json({
      success: false,
      message: 'Aucune réservation trouvée. Accès refusé ou redirection vers ticket physique.'
    });
  }

  // Trigger checkin
  req.params.id = booking._id;
  return checkinBooking(req, res);
};

export const handleCameraExit = async (req, res) => {
  const { plate, parkingId } = req.body;

  const booking = await Booking.findOne({
    plateNumber: plate,
    parking: parkingId,
    status: 'in-progress'
  });

  if (!booking) {
    return res.status(404).json({ success: false, message: 'Véhicule non identifié à l\'intérieur.' });
  }

  req.params.id = booking._id;
  return checkoutBooking(req, res);
};
