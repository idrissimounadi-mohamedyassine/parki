import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, LayoutDashboard, Car, MapPin, Wallet, History, Settings, Clock, Calendar } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = {
    driver: [
      { name: 'Explorer', path: '/search' },
      { name: 'Mes Réservations', path: '/dashboard' },
    ],
    owner: [
      { name: 'Mon Parking', path: '/dashboard' },
      { name: 'Revenus', path: '/dashboard' },
    ],
    admin: [
      { name: 'Administration', path: '/dashboard' },
    ]
  };

  const currentLinks = user ? navLinks[user.role] : [{ name: 'Explorer', path: '/search' }];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1001] transition-all duration-300 border-b ${
      isScrolled ? 'bg-white/80 backdrop-blur-lg border-border shadow-sm py-3' : 'bg-white border-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-[900] tracking-[-0.04em] text-text font-display">
            Park<span className="text-primary">i</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {currentLinks.map((link, i) => (
              <Link key={i} to={link.path} className="font-semibold text-[#374151] hover:text-primary transition-colors text-[14px]">
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <img src={user?.avatar} alt="" className="w-8 h-8 rounded-full border border-border" />
                <button onClick={handleLogout} className="p-2 text-muted hover:text-text transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 font-semibold text-[#374151] border border-border rounded-[10px] text-[14px] hover:bg-surface transition-all">
                  Connexion
                </Link>
                <Link to="/register" className="bg-primary text-white font-semibold px-5 py-2 rounded-[10px] text-[14px] hover:bg-primary-hover transition-all shadow-sm active:scale-95">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-text">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-border p-6 shadow-xl space-y-4"
          >
            {currentLinks.map((link, i) => (
              <Link key={i} to={link.path} className="block font-semibold text-text text-lg" onClick={() => setIsOpen(false)}>
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full text-left font-semibold text-red-500 py-2">Déconnexion</button>
              ) : (
                <>
                  <Link to="/login" className="w-full text-center py-3 font-semibold text-text bg-surface rounded-[10px]" onClick={() => setIsOpen(false)}>Connexion</Link>
                  <Link to="/register" className="w-full text-center py-3 font-semibold text-white bg-primary rounded-[10px]" onClick={() => setIsOpen(false)}>S'inscrire</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
