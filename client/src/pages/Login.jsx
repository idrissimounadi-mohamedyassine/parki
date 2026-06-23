import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { LogIn, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.success) {
      toast.success(result.message);
      navigate('/');
    } else {
      toast.error(result.message);
    }
  };

  const Feature = ({ text }) => (
    <div className="flex items-center gap-3 text-[#374151] font-semibold text-[14px]">
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <CheckCircle2 size={12} className="text-white" />
      </div>
      {text}
    </div>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white font-inter overflow-hidden">
      {/* Left Column */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-[#faf9ff] relative overflow-hidden border-r border-border">
        <div className="blob blob-violet w-[300px] h-[300px] -top-10 -right-10 opacity-30"></div>
        <div className="blob blob-rose w-[200px] h-[200px] -bottom-10 -left-10 opacity-20"></div>

        <Link to="/" className="text-2xl font-[900] tracking-tight font-display relative z-10">
          Park<span className="text-primary">i</span>
        </Link>

        <div className="space-y-12 relative z-10">
          <div className="space-y-4">
            <h2 className="text-[32px] font-display font-[800] text-text leading-tight tracking-tight">
              La façon la plus simple <br /> de se garer.
            </h2>
            <p className="text-muted text-[14px] font-medium max-w-xs">
              Évitez les amendes et les tracas de stationnement partout au Maroc.
            </p>
          </div>

          <div className="space-y-6">
            <Feature text="500+ parkings vérifiés" />
            <Feature text="Paiement 100% sécurisé" />
            <Feature text="Entrée sans ticket papier" />
          </div>
        </div>

        <div className="text-[11px] text-muted font-bold uppercase tracking-widest relative z-10">
          © 2026 Parki Technologies
        </div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-white">
        <div className="w-full max-w-sm space-y-10">
          <div className="md:hidden mb-12">
             <Link to="/" className="text-2xl font-black font-display">Park<span className="text-primary">i</span></Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-display font-[800] text-text tracking-tight">Bon retour !</h1>
            <p className="text-muted text-[14px] font-medium">Entrez vos identifiants pour continuer.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase text-muted tracking-[0.08em] ml-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3.5 bg-[#f9fafb] border border-border focus:border-primary focus:bg-[#faf9ff] rounded-[10px] outline-none font-semibold text-text transition-all"
                placeholder="votre@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2 relative">
              <label className="block text-[10px] font-bold uppercase text-muted tracking-[0.08em] ml-1">Mot de passe</label>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3.5 bg-[#f9fafb] border border-border focus:border-primary focus:bg-[#faf9ff] rounded-[10px] outline-none font-semibold text-text transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[38px] text-muted hover:text-text transition-colors">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-primary to-[#7c3aed] text-white font-bold rounded-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center text-[13px] text-muted font-medium">
            Pas encore de compte ? <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4">Créer un compte</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
