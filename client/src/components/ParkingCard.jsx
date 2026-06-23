import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, Zap, Camera, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const ParkingCard = ({ parking, isHighlighted }) => {
  const { _id, title, address, pricePerHour, images, averageRating, status, city } = parking;

  const isAvailable = status === 'available';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className={cn(
        "group bg-white rounded-2xl border border-border overflow-hidden transition-all duration-300 shadow-card hover:shadow-hover",
        isHighlighted && "border-primary ring-1 ring-primary"
      )}
    >
      <div className="relative h-48 overflow-hidden bg-surface">
        <div className={cn(
          "absolute inset-0 opacity-10 bg-gradient-to-br",
          isAvailable ? "from-violet-500" : "from-pink-500"
        )}></div>
        <div className="blob blob-violet w-32 h-32 -top-10 -left-10 opacity-20"></div>

        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80'}
          alt={title}
          className="w-full h-full object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-4 left-4">
           <span className="bg-primary/90 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
             {city}
           </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-display font-[700] text-text text-lg leading-tight tracking-tight line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star size={12} className="text-primary fill-primary" />
              <span className="text-xs font-bold">{averageRating || '5.0'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-muted text-sm">
            <MapPin size={14} />
            <span className="truncate font-medium">{address}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
           <div className={cn(
             "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
             isAvailable ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
           )}>
             {isAvailable ? 'Disponible' : 'Limité'}
           </div>
           <div className="text-text font-[800] text-lg tracking-tight">
             {pricePerHour} MAD<span className="text-[10px] text-muted font-bold ml-1">/H</span>
           </div>
        </div>

        <Link
          to={`/parking/${_id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-[10px] hover:bg-primary-hover transition-all group-hover:shadow-md active:scale-[0.98]"
        >
          Réserver <ArrowRight size={16} />
        </Link>
      </div>
    </motion.div>
  );
};

export default ParkingCard;
