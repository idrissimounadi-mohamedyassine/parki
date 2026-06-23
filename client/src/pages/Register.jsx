import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { UserPlus, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: searchParams.get('role') || 'driver',
  });

  const [phoneSuffix, setPhoneSuffix] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    setFormData(prev => ({ ...prev, phone: `+212${phoneSuffix}` }));
  }, [phoneSuffix]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 9) setPhoneSuffix(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneSuffix.length !== 9) {
      toast.error('Numéro invalide (9 chiffres requis après +212)');
      return;
    }
    const result = await register(formData);
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
              Rejoignez le futur du <br /> stationnement.
            </h2>
            <p className="text-muted text-[14px] font-medium max-w-xs">
              Devenez membre de la communauté Parki et profitez d'une expérience fluide.
            </p>
          </div>
          <div className="space-y-6">
            <Feature text="Accès à 500+ emplacements" />
            <Feature text="Gestion simple des revenus" />
            <Feature text="Paiement automatique" />
          </div>
        </div>

        <div className="text-[11px] text-muted font-bold uppercase tracking-widest relative z-10">© 2026 Parki Technologies</div>
      </div>

      {/* Right Column */}
      <div className="flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-display font-[800] text-text tracking-tight">Créer un compte</h1>
            <p className="text-muted text-[14px] font-medium italic">Commencez votre voyage avec Parki aujourd'hui.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase text-muted tracking-widest ml-1">Nom complet</label>
                <input type="text" name="name" required className="w-full px-4 py-3 bg-[#f9fafb] border border-border focus:border-primary focus:bg-[#faf9ff] rounded-[10px] outline-none font-semibold text-text" placeholder="Ahmed Alaoui" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase text-muted tracking-widest ml-1">Je suis un :</label>
                <select name="role" className="w-full px-4 py-3 bg-[#f9fafb] border border-border focus:border-primary rounded-[10px] outline-none font-semibold text-text appearance-none cursor-pointer" value={formData.role} onChange={handleChange}>
                  <option value="driver">Conducteur</option>
                  <option value="owner">Propriétaire</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase text-muted tracking-widest ml-1">Email</label>
              <input type="email" name="email" required className="w-full px-4 py-3 bg-[#f9fafb] border border-border focus:border-primary focus:bg-[#faf9ff] rounded-[10px] outline-none font-semibold text-text" placeholder="votre@email.com" value={formData.email} onChange={handleChange} />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase text-muted tracking-widest ml-1">Téléphone (Maroc)</label>
              <div className="flex group overflow-hidden border border-border rounded-[10px]">
                <div className="flex items-center bg-gray-100 px-4 text-gray-500 font-bold text-sm border-r border-border">+212</div>
                <input type="tel" required className="flex-1 px-4 py-3 bg-[#f9fafb] focus:bg-[#faf9ff] outline-none font-semibold text-text" placeholder="600000000" value={phoneSuffix} onChange={handlePhoneChange} />
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="block text-[10px] font-bold uppercase text-muted tracking-widest ml-1">Mot de passe</label>
              <input type={showPassword ? "text" : "password"} name="password" required className="w-full px-4 py-3 bg-[#f9fafb] border border-border focus:border-primary focus:bg-[#faf9ff] rounded-[10px] outline-none font-semibold text-text" placeholder="••••••••" value={formData.password} onChange={handleChange} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[36px] text-muted">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-primary to-[#7c3aed] text-white font-bold rounded-[10px] shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50">
              {isLoading ? 'Création...' : "S'inscrire sur Parki"}
            </button>
          </form>

          <p className="text-center text-[13px] text-muted font-medium">
            Déjà un compte ? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
