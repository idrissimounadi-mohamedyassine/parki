import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parking',
      required: true,
    },
    plateNumber: {
      type: String,
      required: [true, 'Veuillez entrer le numéro de plaque d\'immatriculation'],
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    checkinTime: Date,
    checkoutTime: Date,
    totalPrice: {
      type: Number,
      required: true,
    },
    actualPrice: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'in-progress'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentIntentId: String,
    qrCode: String,
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
