import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Shield, Zap, Clock, Star, ArrowRight, Play, Car, User, Users } from 'lucide-react';
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
    { name: 'Casablanca', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Casablanca_Hassan_II_mosque.jpg/1280px-Casablanca_Hassan_II_mosque.jpg', count: 124, rating: 4.9 },
    { name: 'Rabat', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Rabat_Hassan_Tower.jpg/1280px-Rabat_Hassan_Tower.jpg', count: 86, rating: 4.8 },
    { name: 'Marrakech', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marrakesch_Djemaa_el_Fna_Markt_1.jpg/1280px-Marrakesch_Djemaa_el_Fna_Markt_1.jpg', count: 95, rating: 4.9 },
    { name: 'Tanger', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Tangiers_harbour_1.jpg/1280px-Tangiers_harbour_1.jpg', count: 54, rating: 4.7 },
    { name: 'Fès', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Fes_el_Bali.jpg/1280px-Fes_el_Bali.jpg', count: 72, rating: 4.8, minPrice: 9 },
  ];

  return (
    <div className="pt-24 space-y-32 pb-32 overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6 bg-gradient-to-b from-[#f5f4ff] to-white">
        <div className="relative z-10 w-full max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f0ff] text-primary border border-[#d4d2ff] font-bold text-[13px] mb-8">
            <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-md mr-1">Nouveau</span> Paiement à la sortie
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-6xl md:text-7xl font-display font-[900] text-text leading-[1.1] tracking-[-0.02em] mb-10">
            Garez-vous <br />
            <span className="text-gradient">sans stress</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            La plateforme de stationnement la plus intelligente du Maroc. Réservez, entrez, payez à la sortie.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="max-w-3xl mx-auto mb-10">
            <form onSubmit={handleSearch} className="bg-white p-2 rounded-2xl border border-[#E5E7EB] shadow-lg flex flex-col md:flex-row items-center gap-2 mb-4">
              <div className="flex-1 flex items-center gap-3 px-5 w-full">
                <MapPin className="text-muted" size={20} />
                <input type="text" placeholder="Quelle ville ?" className="w-full py-4 text-base font-semibold text-text placeholder-gray-400 bg-transparent outline-none" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div className="h-10 w-[1px] bg-[#E5E7EB] hidden md:block mx-2"></div>
              <div className="flex-1 flex items-center gap-3 px-5 w-full">
                <Clock className="text-muted" size={20} />
                <input type="datetime-local" className="w-full py-4 text-[14px] font-semibold text-text bg-transparent outline-none cursor-pointer" value={dateTime} onChange={e => setDateTime(e.target.value)} />
              </div>
              <Button type="submit" size="lg" className="rounded-xl w-full md:w-auto px-10 bg-primary text-white hover:bg-primary-hover shadow-md font-bold">
                Chercher
              </Button>
            </form>

            <div className="flex flex-wrap items-center justify-center gap-3 text-sm font-medium">
              <span className="text-muted">Villes populaires :</span>
              {['Casablanca', 'Rabat', 'Marrakech', 'Fès'].map((c) => (
                <button key={c} onClick={() => { setCity(c); navigate(`/search?city=${c}`); }} className="px-3 py-1 bg-white border border-border rounded-full text-text hover:border-primary hover:text-primary transition-all">
                  {c}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-wrap items-center justify-center gap-4">
            {[
              "500+ parkings vérifiés",
              "12k+ conducteurs",
              "4.9★",
              "5 villes"
            ].map((stat, i) => (
              <span key={i} className="bg-surface px-4 py-1.5 rounded-full text-muted text-[13px] font-semibold tracking-tight border border-border/50">
                {stat}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl font-display font-[800] text-text">Villes populaires</h2>
            <p className="text-muted font-medium text-lg">Réservez en quelques clics dans les principales villes du Maroc</p>
          </div>
          <button onClick={() => navigate('/search')} className="group flex items-center gap-2 font-bold text-primary hover:text-primary-hover transition-colors">
            Voir tout <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {popularCities.map((city) => (
            <motion.div
              key={city.name}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/search?city=${city.name}`)}
              className="group relative h-[420px] rounded-3xl overflow-hidden cursor-pointer shadow-lg transition-all"
            >
              <img
                src={city.img}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              <div className="absolute top-4 left-4">
                <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[#D4AF37] font-bold text-xs shadow-sm">
                  <Star size={12} fill="currentColor" /> {city.rating}
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">MAROC</span>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-[800] text-white">{city.name}</h3>
                  <p className="text-white/80 font-medium text-sm">{city.count} places disponibles</p>
                </div>

                <div className="flex items-center gap-1 text-white font-bold">
                  <span className="text-xs text-white/70 font-medium">À partir de</span> {city.minPrice || 10} MAD<span className="text-[10px] text-white/70">/h</span>
                </div>

                <button className="w-full py-3 bg-white text-text rounded-full font-bold text-sm transition-all group-hover:bg-primary group-hover:text-white">
                  Voir les parkings
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Notre Mission */}
      <section className="bg-[#faf9ff] py-32 rounded-[60px] mx-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary text-sm font-bold uppercase tracking-[0.2em] mb-4 block">Notre mission</span>
              <h2 className="text-4xl md:text-5xl font-[800] text-text leading-[1.1] mb-8">
                Parki résout un problème simple mais frustrant
              </h2>
              <p className="text-muted text-lg font-medium leading-relaxed mb-8">
                Chercher une place de parking ne devrait jamais faire perdre plus de temps qu'une réunion importante. Avec Parki, conducteurs et propriétaires gagnent ensemble.
              </p>

              <ul className="space-y-4">
                {[
                  { title: "Transparent", desc: "prix affichés sans surprise" },
                  { title: "Sécurisé", desc: "paiement protégé et données chiffrées" },
                  { title: "Innovant", desc: "entrez avec votre plaque, payez à la sortie" }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      <Zap size={12} fill="currentColor" />
                    </div>
                    <div>
                      <span className="font-bold text-text">✓ {item.title}</span> — <span className="text-muted font-medium">{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              {[
                { label: "500+", sub: "Parkings vérifiés au Maroc", icon: Shield },
                { label: "12 000+", sub: "Conducteurs font confiance à Parki", icon: Users },
                { label: "4.9/5", sub: "Note moyenne · 2 000+ avis", icon: Star }
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-border rounded-2xl p-6 shadow-sm flex items-center gap-6"
                >
                  <div className="w-12 h-12 bg-[#f0f0ff] rounded-xl flex items-center justify-center text-primary">
                    <card.icon size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-[800] text-text">{card.label}</div>
                    <div className="text-muted font-medium text-sm">{card.sub}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Light Theme */}
      <section id="how-it-works" className="py-32">
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
