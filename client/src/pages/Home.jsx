import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, Zap, Clock, Star, ArrowRight, Play, Car } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?city=${city}&datetime=${dateTime}`);
  };

  const popularCities = [
    { name: 'Casablanca', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Casablanca_Hassan_II_mosque.jpg/1280px-Casablanca_Hassan_II_mosque.jpg', count: 124, color: 'from-violet-500/20' },
    { name: 'Rabat', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rabat_Hassan_Tower.jpg/1280px-Rabat_Hassan_Tower.jpg', count: 86, color: 'from-pink-500/20' },
    { name: 'Marrakech', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marrakesch_Djemaa_el_Fna_Markt_1.jpg/1280px-Marrakesch_Djemaa_el_Fna_Markt_1.jpg', count: 95, color: 'from-blue-500/20' },
    { name: 'Tanger', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tangiers_harbour_1.jpg/1280px-Tangiers_harbour_1.jpg', count: 54, color: 'from-indigo-500/20' },
  ];

  return (
    <div className="pt-20 space-y-32 pb-32 overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6">
        <div className="blob blob-violet w-[500px] h-[500px] -top-20 -left-20 opacity-40"></div>
        <div className="blob blob-rose w-[400px] h-[400px] top-40 -right-20 opacity-30"></div>
        <div className="blob blob-indigo w-[300px] h-[300px] -bottom-20 left-1/3 opacity-20"></div>

        <div className="relative z-10 w-full max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f0ff] text-primary border border-[#d4d2ff] font-bold text-[13px] mb-8">
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-md mr-1">Nouveau</span> Paiement à la sortie
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-[84px] font-display font-[900] text-text leading-[0.95] tracking-[-0.05em] mb-10">
            Garez-vous <br />
            <span className="text-gradient">sans stress</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted text-lg md:text-xl max-w-lg mx-auto mb-12 font-medium leading-relaxed">
            La plateforme de stationnement la plus intelligente du Maroc. Réservez, entrez, payez à la sortie.
          </motion.p>

          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} onSubmit={handleSearch} className="bg-[#f8f9fa] p-2 rounded-[20px] border border-border shadow-card flex flex-col md:flex-row items-center gap-2 max-w-3xl mx-auto mb-10">
            <div className="flex-1 flex items-center gap-3 px-5 w-full">
              <MapPin className="text-muted" size={20} />
              <input type="text" placeholder="Quelle ville ?" className="w-full py-4 text-base font-semibold text-text placeholder-gray-400 bg-transparent outline-none" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="h-8 w-[1px] bg-border hidden md:block"></div>
            <div className="flex-1 flex items-center gap-3 px-5 w-full">
              <Clock className="text-muted" size={20} />
              <input type="datetime-local" className="w-full py-4 text-[14px] font-semibold text-text bg-transparent outline-none cursor-pointer" value={dateTime} onChange={e => setDateTime(e.target.value)} />
            </div>
            <Button type="submit" size="lg" className="rounded-[12px] w-full md:w-auto px-10 bg-primary text-white hover:bg-primary-hover shadow-md font-bold">
              Chercher
            </Button>
          </motion.form>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-muted text-[13px] font-semibold tracking-tight">
            500+ parkings vérifiés · 12k+ conducteurs · 4.9★ · 5 villes
          </motion.div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-display font-[800] text-text">Villes populaires</h2>
            <p className="text-muted font-medium text-lg">Explorez les meilleurs parkings du Royaume</p>
          </div>
          <button onClick={() => navigate('/search')} className="group flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
            Voir tout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCities.map((city) => (
            <motion.div
              key={city.name}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/search?city=${city.name}`)}
              className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-border bg-white shadow-card hover:shadow-hover transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${city.color} to-transparent opacity-60`}></div>
              <img
                src={city.img}
                alt={city.name}
                onError={(e) => { e.target.style.display='none'; }}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-8">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-[800] text-text">{city.name}</h3>
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">MAROC</span>
                </div>
                <p className="text-muted font-bold text-sm mb-6">{city.count} places disponibles</p>
                <div className="flex items-center gap-1 text-text font-extrabold">
                  <span className="text-xs text-muted font-bold">À partir de</span> 10 MAD<span className="text-[10px] text-muted">/h</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works - Light Theme */}
      <section id="how-it-works" className="bg-[#faf9ff] py-32 rounded-[60px] mx-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-display font-[800] text-text tracking-tighter mb-20">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '01', title: 'Cherchez', desc: 'Trouvez le parking idéal parmi des centaines d\'options.', icon: Search },
              { step: '02', title: 'Réservez', desc: 'Réservez votre place en 2 clics avec paiement sécurisé.', icon: Clock },
              { step: '03', title: 'Garez-vous', desc: 'Entrez avec votre plaque et profitez de votre temps.', icon: Zap },
            ].map((item, i) => (
              <div key={i} className="relative bg-white p-10 rounded-[32px] border border-border shadow-sm group hover:border-primary/20 transition-all">
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-text opacity-[0.03] select-none">{item.step}</span>
                <div className="w-16 h-16 bg-[#f0f0ff] text-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-text mb-4">{item.title}</h3>
                <p className="text-muted font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white border border-border rounded-[48px] p-12 md:p-24 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-card">
          <div className="blob blob-violet w-[400px] h-[400px] -right-40 -top-20 opacity-20"></div>
          <div className="flex-1 space-y-8 relative z-10">
            <h2 className="text-5xl md:text-6xl font-display font-[900] text-text tracking-tighter leading-[0.95]">
              Rentabilisez votre <br /> place de parking.
            </h2>
            <p className="text-lg text-muted font-medium max-w-md">
              Rejoignez des centaines de propriétaires au Maroc et générez des revenus passifs chaque mois.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={() => navigate('/register?role=owner')} className="bg-primary text-white rounded-[10px] px-8 py-4 shadow-lg hover:bg-primary-hover font-bold">Devenir Propriétaire</Button>
              <Button variant="ghost" size="lg" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="text-text font-bold px-8">En savoir plus</Button>
            </div>
          </div>
          <div className="flex-1 relative hidden lg:block">
             {/* Replace with a clean Illustration */}
             <div className="w-full aspect-square bg-surface rounded-[40px] border-2 border-dashed border-border flex items-center justify-center">
                <Car size={120} className="text-muted opacity-20" />
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
