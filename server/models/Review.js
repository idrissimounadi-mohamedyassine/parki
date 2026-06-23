import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ parking: 1, user: 1 }, { unique: true });

reviewSchema.statics.getAverageRating = async function (parkingId) {
  const obj = await this.aggregate([
    { $match: { parking: parkingId } },
    {
      $group: {
        _id: '$parking',
        averageRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);
  try {
    if (obj[0]) {
      await mongoose.model('Parking').findByIdAndUpdate(parkingId, {
        averageRating: Math.round(obj[0].averageRating * 10) / 10,
        numReviews: obj[0].numReviews,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

reviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.parking);
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;
