import Booking from '../models/Booking.js';
import Parking from '../models/Parking.js';
import mongoose from 'mongoose';

export const getOwnerStats = async (req, res) => {
  const ownerId = req.user._id;
  const parkings = await Parking.find({ owner: ownerId });
  const parkingIds = parkings.map(p => p._id);
  const revenueStats = await Booking.aggregate([
    { $match: { parking: { $in: parkingIds }, paymentStatus: 'paid' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        revenue: { $sum: '$totalPrice' },
        bookings: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 30 }
  ]);
  const totalBookings = await Booking.countDocuments({ parking: { $in: parkingIds } });
  const totalRevenue = await Booking.aggregate([
    { $match: { parking: { $in: parkingIds }, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  res.json({
    success: true,
    data: {
      revenueStats,
      totalParkings: parkings.length,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
    }
  });
};

export const getAdminStats = async (req, res) => {
  const totalBookings = await Booking.countDocuments();
  const totalUsers = await mongoose.model('User').countDocuments();
  const totalRevenue = await Booking.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  res.json({
    success: true,
    data: { totalBookings, totalUsers, totalRevenue: totalRevenue[0]?.total || 0 },
  });
};
