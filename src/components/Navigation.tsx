import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Sparkles, SlidersHorizontal } from 'lucide-react';

interface NavigationProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'OVERVIEW' },
    { id: 'explorer', label: '3D EXPLORER' },
    { id: 'features', label: 'FEATURES' },
    { id: 'specifications', label: 'SPECIFICATIONS' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#06080d]/80 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-black/80 via-black/30 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400/20 via-cyan-500/10 to-transparent border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all duration-300">
            <span className="font-display font-black text-sm tracking-widest text-cyan-400">VX</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-base tracking-[0.25em] text-white flex items-center gap-2">
              VELOX <span className="text-cyan-400 font-normal text-xs tracking-widest px-1.5 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">SUV-X</span>
            </span>
            <span className="text-[10px] tracking-[0.3em] text-slate-400 uppercase font-mono">
              Next-Gen PBR Showroom
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`text-xs font-medium tracking-[0.2em] transition-all duration-300 relative py-1 focus:outline-none ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Build Your SUV Action Button */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => handleLinkClick('configurator')}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider text-white overflow-hidden bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/40 hover:border-cyan-400 hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all duration-300"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
            <span>BUILD YOUR SUV</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070a12]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-6 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLinkClick(item.id)}
              className="block w-full text-left py-2 text-sm tracking-widest text-slate-300 hover:text-cyan-400 font-medium"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleLinkClick('configurator')}
            className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 text-black font-semibold text-xs tracking-widest hover:bg-cyan-400 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            BUILD YOUR SUV
          </button>
        </div>
      )}
    </header>
  );
};
