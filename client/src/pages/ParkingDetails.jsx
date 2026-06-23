import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Shield, Star, Camera, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Skeleton from '../components/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ParkingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [plateNumber, setPlateNumber] = useState('');
  const [bookingData, setBookingData] = useState({ date: new Date().toISOString().split('T')[0], startTime: '09:00', duration: 1 });

  useEffect(() => {
    const fetchParking = async () => {
      try {
        const response = await axios.get(`${API_URL}/parkings/${id}`);
        setParking(response.data.data);
      } catch (error) {
        toast.error('Parking non trouvé');
        navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchParking();
  }, [id, navigate]);

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour réserver');
      navigate('/login');
      return;
    }
    if (!plateNumber) {
      toast.error('Veuillez entrer votre numéro de plaque');
      return;
    }
    setBookingLoading(true);
    try {
      const start = new Date(`${bookingData.date}T${bookingData.startTime}`);
      const end = new Date(start.getTime() + bookingData.duration * 60 * 60 * 1000);
      const response = await axios.post(`${API_URL}/bookings`, {
        parkingId: id,
        startTime: start,
        endTime: end,
        plateNumber
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Réservation créée !');
      navigate(`/checkout/${response.data.data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton className="h-96 w-full rounded-2xl" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-gray-900 mb-8">{parking.title}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="aspect-video rounded-[40px] overflow-hidden shadow-xl mb-10">
            <img src={parking.images?.[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80'} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-4">Description</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-10">{parking.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {parking.features?.map(f => (
              <div key={f} className="p-4 bg-white border border-gray-100 rounded-2xl flex flex-col items-center gap-2 shadow-sm">
                <Zap size={20} className="text-primary" />
                <span className="text-xs font-black uppercase text-gray-400">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-100 shadow-2xl rounded-[40px] p-8 space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-3xl font-black text-primary">{parking.pricePerHour} MAD</span>
              <span className="text-gray-400 font-bold mb-1">/ heure</span>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-gray-400 ml-1">Plaque d'immatriculation</label>
                <input
                  type="text"
                  placeholder="Ex: 12345-A-1"
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-primary focus:bg-white outline-none font-bold transition-all"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Date</label>
                  <input type="date" className="w-full p-4 bg-gray-50 rounded-2xl font-bold" value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-gray-400 ml-1">Durée</label>
                  <select className="w-full p-4 bg-gray-50 rounded-2xl font-bold" value={bookingData.duration} onChange={e => setBookingData({...bookingData, duration: Number(e.target.value)})}>
                    {[1, 2, 3, 4, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h}h</option>)}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className="w-full py-5 bg-primary text-white font-black text-lg rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95 disabled:opacity-50"
            >
              {bookingLoading ? 'Réservation...' : 'Réserver'}
            </button>

            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Annulation gratuite jusqu'à 24h avant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingDetails;
