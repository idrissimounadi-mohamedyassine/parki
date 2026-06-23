import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import sendEmail from '../utils/email.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export const createCheckoutSession = async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId).populate('parking');
  if (!booking) {
    res.status(404);
    throw new Error('Réservation non trouvée');
  }
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'mad',
          product_data: {
            name: `Parking: ${booking.parking.title}`,
            description: `Du ${new Date(booking.startTime).toLocaleString()} au ${new Date(booking.endTime).toLocaleString()}`,
          },
          unit_amount: booking.totalPrice * 100,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard?success=true`,
    cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/parking/${booking.parking._id}?cancelled=true`,
    metadata: { bookingId: booking._id.toString() },
  });
  res.json({ success: true, url: session.url });
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;
    const booking = await Booking.findByIdAndUpdate(bookingId, {
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentIntentId: session.payment_intent,
      qrCode: `PARKI-${bookingId}-${Math.random().toString(36).substring(7).toUpperCase()}`,
    }).populate('user parking');

    if (booking) {
      try {
        await sendEmail({
          email: booking.user.email,
          subject: 'Réservation Confirmée - Parki',
          message: `Votre paiement a été reçu. Voici votre accès pour ${booking.parking.title}. QR Code: ${booking.qrCode}`,
        });
      } catch (error) {
        console.error('Webhook Email Error:', error);
      }
    }
  }
  res.json({ received: true });
};
