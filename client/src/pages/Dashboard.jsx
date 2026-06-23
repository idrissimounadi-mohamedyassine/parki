import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell
} from 'recharts';
import {
  LayoutDashboard, Wallet, Calendar, Car, ArrowUpRight, TrendingUp, User, MapPin, Clock, History, CreditCard
} from 'lucide-react';
import useAuthStore from '../store/authStore';
import Skeleton from '../components/Skeleton';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.token) return;
        const config = { headers: { Authorization: `Bearer ${user.token}` } };

        const [statsRes, bookingsRes] = await Promise.all([
          user.role === 'owner' ? axios.get(`${API_URL}/stats/owner`, config) : Promise.resolve({ data: { data: null } }),
          user.role === 'owner' ? axios.get(`${API_URL}/bookings/owner`, config) : axios.get(`${API_URL}/bookings/my`, config)
        ]);

        setStats(statsRes.data.data);
        setBookings(bookingsRes.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.token, user?.role]);

  if (loading) return <div className="p-8"><Skeleton className="h-[600px] w-full rounded-3xl" /></div>;

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-lg">
            <ArrowUpRight size={14} /> {trend}%
          </div>
        )}
      </div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-900">{value}</h3>
    </div>
  );

  const StatusBadge = ({ status }) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      cancelled: 'bg-red-100 text-red-700',
      completed: 'bg-blue-100 text-blue-700',
      'in-progress': 'bg-purple-100 text-purple-700',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  // --- RENDER OWNER VIEW ---
  if (user?.role === 'owner') {
    const bookingsPerParking = bookings.reduce((acc, curr) => {
      const name = curr.parking.title;
      const existing = acc.find(item => item.name === name);
      if (existing) existing.count += 1; else acc.push({ name, count: 1 });
      return acc;
    }, []).slice(0, 5);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Espace Propriétaire</h1>
          <p className="text-gray-500 font-medium tracking-tight text-lg">Bienvenue, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Revenu Total" value={`${stats?.totalRevenue || 0} MAD`} icon={Wallet} color="bg-blue-500" trend={12} />
          <StatCard title="Réservations" value={stats?.totalBookings || 0} icon={Calendar} color="bg-purple-500" trend={8} />
          <StatCard title="Mes Parkings" value={stats?.totalParkings || 0} icon={Car} color="bg-orange-500" />
          <StatCard title="Taux d'occupation" value="78%" icon={TrendingUp} color="bg-green-500" trend={5} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">Analyse des revenus</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.revenueStats || []}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1A56DB" stopOpacity={0.1}/><stop offset="95%" stopColor="#1A56DB" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                  <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                  <Area type="monotone" dataKey="revenue" stroke="#1A56DB" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-8">Par parking</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsPerParking} layout="vertical">
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} tick={{fontSize: 10, fontWeight: 'bold'}} />
                  <Bar dataKey="count" fill="#1A56DB" radius={[0, 10, 10, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Dernières réservations reçues</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="bg-gray-50/50"><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Parking</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Statut</th></tr></thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.slice(0, 10).map(b => (
                  <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5 font-bold text-sm text-gray-900">{b.user?.name || 'Client Parki'}</td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-bold">{b.parking?.title}</td>
                    <td className="px-8 py-5 text-sm text-gray-500">{new Date(b.startTime).toLocaleDateString('fr-FR')}</td>
                    <td className="px-8 py-5 text-right"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER DRIVER VIEW ---
  const activeBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');
  const totalSpent = bookings.reduce((acc, b) => acc + (b.actualPrice || b.totalPrice), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Mes Réservations</h1>
        <p className="text-gray-500 font-medium tracking-tight text-lg">Gérez vos stationnements au Maroc.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard title="Total Dépensé" value={`${totalSpent} MAD`} icon={Wallet} color="bg-blue-500" />
        <StatCard title="Toutes Réservations" value={bookings.length} icon={History} color="bg-purple-500" />
        <StatCard title="En cours" value={activeBookings.length} icon={Clock} color="bg-green-500" />
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <Car className="text-primary" /> Réservations actives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeBookings.length > 0 ? activeBookings.map(b => (
            <div key={b._id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                <img src={b.parking.images?.[0] || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-black text-gray-900 truncate">{b.parking.title}</h3>
                  <StatusBadge status={b.status} />
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-4"><MapPin size={12}/> {b.parking.address}</div>
                <div className="flex justify-between items-end">
                  <div className="text-xs font-bold text-gray-400">
                    {new Date(b.startTime).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button className="text-red-500 font-black text-xs hover:underline">Annuler</button>
                </div>
              </div>
            </div>
          )) : (
            <div className="md:col-span-2 py-12 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">Aucune réservation en cours.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center gap-3">
          <History className="text-gray-400" />
          <h3 className="text-xl font-black text-gray-900">Historique des stationnements</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead><tr className="bg-gray-50/50"><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Parking</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Durée</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Payé</th><th className="px-8 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Statut</th></tr></thead>
            <tbody className="divide-y divide-gray-50">
              {pastBookings.map(b => (
                <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-bold text-sm text-gray-900">{b.parking.title}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{b.parking.city}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                    {new Date(b.startTime).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-8 py-5 font-black text-sm text-gray-900">{b.actualPrice || b.totalPrice} MAD</td>
                  <td className="px-8 py-5 text-right"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
