import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { Search as SearchIcon, MapPin, Navigation, Inbox, Map as MapIcon, List as ListIcon, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ParkingCard from '../components/ParkingCard';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarker = (status) => {
  const color = status === 'available' ? '#10b981' : status === 'limited' ? '#f59e0b' : '#ef4444';
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
};

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

const Search = () => {
  const [searchParams] = useSearchParams();
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [mapCenter, setMapCenter] = useState([33.5731, -7.5898]);
  const [highlightedId, setHighlightedId] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const fetchParkings = async (searchCity = '') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/parkings`, { params: { city: searchCity } });
      console.log('[DEBUG] Search API Response:', response.data);

      const data = response.data.data || response.data; // Handle both structures
      setParkings(Array.isArray(data) ? data : []);

      if (data.length > 0) {
        const first = data[0];
        if (first.location?.coordinates) {
          setMapCenter([first.location.coordinates[1], first.location.coordinates[0]]);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchParkings(city);
    if (window.innerWidth < 1024) setViewMode('list');
  };

  const locateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setLoading(true);
        try {
          const response = await axios.get(`${API_URL}/parkings/nearby`, { params: { lat: latitude, lng: longitude } });
          const data = response.data.data || response.data;
          setParkings(Array.isArray(data) ? data : []);
          setViewMode('map');
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden relative font-inter">
      {/* Sidebar */}
      <div className={`w-full lg:w-[450px] flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-gray-50">
          <form onSubmit={handleSearch} className="relative mb-6">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Chercher une ville..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-gray-900 rounded-[20px] outline-none font-black text-gray-900 transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </form>
          <button onClick={locateMe} className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gray-900 text-white rounded-2xl text-sm font-black active:scale-95 transition-transform">
            <Navigation size={16} /> Me localiser
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {error ? (
            <div className="p-6 bg-red-50 rounded-3xl flex flex-col items-center text-center gap-3">
              <AlertCircle className="text-red-500" size={32} />
              <p className="text-red-700 font-black">{error}</p>
              <button onClick={() => fetchParkings(city)} className="text-red-500 underline font-bold">Réessayer</button>
            </div>
          ) : loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="space-y-3"><Skeleton className="h-56 w-full rounded-[32px]" /><Skeleton className="h-4 w-3/4" /></div>)
          ) : parkings.length > 0 ? (
            <>
              <h2 className="text-xl font-black text-gray-900 tracking-tighter">{parkings.length} parkings disponibles</h2>
              {parkings.map((p) => (
                <div key={p._id} onMouseEnter={() => setHighlightedId(p._id)} onMouseLeave={() => setHighlightedId(null)}>
                  <ParkingCard parking={p} isHighlighted={highlightedId === p._id} />
                </div>
              ))}
            </>
          ) : (
            <EmptyState
              title="Aucun parking trouvé"
              description="Essayez une autre ville ou retirez les filtres."
              icon={Inbox}
              actionLabel="Voir tous les parkings"
              onAction={() => { setCity(''); fetchParkings(''); }}
            />
          )}
        </div>
      </div>

      {/* Map */}
      <div className={`flex-1 relative bg-gray-100 z-10 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
        <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ChangeView center={mapCenter} />
          {parkings.map((p) => (
            <Marker key={p._id} position={[p.location.coordinates[1], p.location.coordinates[0]]} icon={customMarker(p.status)}>
              <Popup>
                <div className="w-56 overflow-hidden rounded-[20px] shadow-2xl">
                  <img src={p.images[0]} alt="" className="w-full h-32 object-cover" />
                  <div className="p-4 bg-white">
                    <h4 className="font-black text-gray-900 truncate mb-1">{p.title}</h4>
                    <p className="text-primary font-black text-lg">{p.pricePerHour} MAD<span className="text-[10px] text-gray-400 font-bold tracking-normal uppercase ml-1">/h</span></p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Mobile view toggle */}
      <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000]">
        <button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="bg-gray-900 text-white px-8 py-4 rounded-full font-black shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center gap-3 active:scale-95 transition-transform"
        >
          {viewMode === 'list' ? <><MapIcon size={20} /> Carte</> : <><ListIcon size={20} /> Liste</>}
        </button>
      </div>
    </div>
  );
};

export default Search;
