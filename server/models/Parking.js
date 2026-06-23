import mongoose from 'mongoose';

const parkingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Veuillez entrer un titre'],
    },
    description: {
      type: String,
      required: [true, 'Veuillez entrer une description'],
    },
    address: {
      type: String,
      required: [true, "Veuillez entrer l'adresse"],
    },
    city: {
      type: String,
      required: [true, 'Veuillez choisir une ville'],
      enum: ['Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Tanger'],
    },
    type: {
      type: String,
      required: [true, 'Veuillez choisir le type de parking'],
      enum: ['rue', 'garage', 'sous-sol'],
    },
    pricePerHour: {
      type: Number,
      required: [true, 'Veuillez entrer le prix par heure (MAD)'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    images: [String],
    features: [
      {
        type: String,
        enum: ['camera', 'electric', 'covered', 'guarded', '24/7'],
      },
    ],
    status: {
      type: String,
      enum: ['available', 'limited', 'full'],
      default: 'available',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

parkingSchema.index({ location: '2dsphere' });

const Parking = mongoose.model('Parking', parkingSchema);

export default Parking;
