import React, { useState, useEffect } from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  Dumbbell,
  Menu,
  X,
  Phone,
  Sparkles,
  Calculator,
  Flame,
  MessageSquare,
  Clock,
  Compass,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: 'Reviews', href: '#reviews', icon: MessageSquare },
    { label: 'AI Coach', href: '#ai-coach', icon: Sparkles },
    { label: 'Calculators', href: '#calculators', icon: Calculator },
    { label: 'Exercises', href: '#exercises', icon: Dumbbell },
    { label: 'Workout Builder', href: '#workout-builder', icon: Flame },
    { label: 'Rest Timer', href: '#timer', icon: Clock },
    { label: 'Progress', href: '#progress', icon: TrendingUp },
    { label: 'Membership', href: '#membership', icon: Compass },
    { label: 'Location', href: '#location', icon: MapPin },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80 shadow-xl'
          : 'bg-gradient-to-b from-neutral-950/90 via-neutral-950/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-6 h-6 text-neutral-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white uppercase group-hover:text-emerald-400 transition-colors">
                Hulk's <span className="text-emerald-400">Work Zone</span>
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest -mt-1">
                Dabra • Fitness Platform
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900/80 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all shadow-sm"
              title="Call Hulk's Work Zone"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>{GYM_INFO.phone}</span>
            </a>

            <button
              onClick={onOpenEnquiry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Join / Enquire
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              aria-label="Call gym"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 hover:text-emerald-300 sm:hidden"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row gap-2.5">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-850"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call {GYM_INFO.phone}</span>
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 text-center shadow-md shadow-emerald-500/20"
            >
              Join / Enquire Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
