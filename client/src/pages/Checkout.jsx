import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { CreditCard, ShieldCheck, Clock, MapPin, ChevronLeft } from 'lucide-react';
import Skeleton from '../components/Skeleton';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`${API_URL}/bookings/my`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const current = response.data.data.find(b => b._id === id);
        if (!current) throw new Error('Réservation non trouvée');
        setBooking(current);
      } catch (error) {
        toast.error('Une erreur est survenue');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    if (user?.token) fetchBooking();
  }, [id, navigate, user?.token]);

  const handlePayment = async () => {
    setPaying(true);
    try {
      const response = await axios.post(`${API_URL}/payments/create-checkout-session`,
        { bookingId: id },
        { headers: { Authorization: `Bearer ${user.token}` }}
      );
      window.location.href = response.data.url;
    } catch (error) {
      toast.error('Erreur lors du paiement');
      setPaying(false);
    }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12"><Skeleton className="h-96 w-full rounded-2xl" /></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-900 mb-8 transition-colors">
        <ChevronLeft size={20} /> Retour
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-8">
          <h1 className="text-4xl font-black text-gray-900 leading-tight">Vérifier et payer</h1>
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            <div className="flex gap-6 pb-6 border-b border-gray-100">
              <img src={booking.parking.images?.[0] || 'https://via.placeholder.com/150'} alt="" className="w-32 h-24 object-cover rounded-2xl shadow-sm" />
              <div>
                <h2 className="font-bold text-lg text-gray-900 mb-1">{booking.parking.title}</h2>
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <MapPin size={14} /> <span>{booking.parking.city}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 text-white p-10 rounded-[40px] shadow-2xl space-y-8">
          <h3 className="text-2xl font-bold">Détails du prix</h3>
          <div className="pt-8 border-t border-gray-800">
            <div className="flex justify-between items-end mb-10">
              <span className="text-lg font-bold">Total (MAD)</span>
              <span className="text-4xl font-black text-primary">{booking.totalPrice} MAD</span>
            </div>
            <button onClick={handlePayment} disabled={paying} className="w-full py-5 bg-white text-gray-900 font-black text-xl rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
              <CreditCard /> {paying ? 'Traitement...' : 'Payer maintenant'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
