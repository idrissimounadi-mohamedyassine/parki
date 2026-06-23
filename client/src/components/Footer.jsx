import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';

const Footer = () => {
  const footerLinks = [
    {
      title: 'Produit',
      links: [
        { name: 'Chercher un parking', path: '/search' },
        { name: 'À propos', path: '#' },
        { name: 'Comment ça marche', path: '/#how-it-works' },
        { name: 'Tarifs', path: '#' },
      ],
    },
    {
      title: 'Entreprise',
      links: [
        { name: 'À propos de nous', path: '#' },
        { name: 'Blog', path: '#' },
        { name: 'Carrières', path: '#' },
        { name: 'Presse', path: '#' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { name: "Conditions d'utilisation", path: '#' },
        { name: 'Politique de confidentialité', path: '#' },
        { name: 'Politique de cookies', path: '#' },
        { name: 'Mentions légales', path: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { name: "Centre d'aide", path: '#' },
        { name: 'Nous contacter', path: '#' },
        { name: 'Status du service', path: '#' },
        { name: 'FAQ', path: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-[#0A0014] text-gray-400 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-6">
              <span className="text-2xl font-[900] tracking-[-0.04em] text-white font-display">
                Park<span className="text-primary">i</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-8 max-w-xs">
              La plateforme de stationnement la plus intelligente du Maroc.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, i) => (
            <div key={i}>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">
                {column.title}
              </h3>
              <ul className="space-y-4">
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link
                      to={link.path}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>© 2026 Parki. Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            Fait avec <Heart size={14} className="text-red-500 fill-current" /> au Maroc 🇲🇦
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
