import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { GYM_INFO } from '../data/gymInfo';
import {
  Dumbbell,
  Menu,
  X,
  Phone,
  Calculator,
  Compass,
  MapPin,
  TrendingUp,
  CreditCard,
  Star,
  Layers,
  Bot,
  HelpCircle,
} from 'lucide-react';

interface NavbarProps {
  onOpenEnquiry: (plan?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Start Here', to: '/start', icon: Compass, highlight: true },
    { label: 'Calculators', to: '/tools', icon: Calculator },
    { label: 'Exercises', to: '/exercises', icon: Dumbbell },
    { label: 'Workout Builder', to: '/workout-builder', icon: Layers },
    { label: 'Progress', to: '/progress', icon: TrendingUp },
    { label: 'AI Coach', to: '/ai-coach', icon: Bot },
    { label: 'Membership', to: '/membership', icon: CreditCard },
    { label: 'Contact', to: '/contact', icon: MapPin },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-neutral-950/92 backdrop-blur-md border-b border-neutral-800/80 shadow-xl'
          : 'bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800/40'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-950 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-2xl font-black tracking-tight text-white uppercase group-hover:text-emerald-400 transition-colors">
                Hulk&apos;s <span className="text-emerald-400">Work Zone</span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-400 uppercase tracking-widest -mt-1">
                Dabra • Fitness Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                      isActive
                        ? 'bg-emerald-400 text-neutral-950 font-bold'
                        : link.highlight
                        ? 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Medium screen Nav (abbreviated) */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1" aria-label="Abbreviated Navigation">
            <NavLink
              to="/start"
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-bold rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-400 text-neutral-950' : 'text-emerald-400 hover:bg-emerald-500/10'
                }`
              }
            >
              Start
            </NavLink>
            <NavLink
              to="/tools"
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`
              }
            >
              Tools
            </NavLink>
            <NavLink
              to="/exercises"
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`
              }
            >
              Exercises
            </NavLink>
            <NavLink
              to="/workout-builder"
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`
              }
            >
              Builder
            </NavLink>
            <NavLink
              to="/ai-coach"
              className={({ isActive }) =>
                `px-2.5 py-1.5 text-xs font-medium rounded-xl transition-colors ${
                  isActive ? 'bg-emerald-400 text-neutral-950' : 'text-neutral-300 hover:text-white'
                }`
              }
            >
              AI Coach
            </NavLink>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-200 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:text-white transition-all shadow-sm"
              title="Call Hulk's Work Zone"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{GYM_INFO.phone}</span>
            </a>

            <button
              type="button"
              id="nav-join-enquire-btn"
              onClick={() => onOpenEnquiry('General Visitor')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              Join / Enquire
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              aria-label="Call gym"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-emerald-400 hover:text-emerald-300 sm:hidden"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              id="mobile-menu-toggle-btn"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/98 border-b border-neutral-800 px-4 pt-3 pb-6 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 transition-colors"
                >
                  <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </Link>
              );
            })}

            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>FAQs</span>
            </Link>

            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-800/60 transition-colors"
            >
              <Star className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Reviews</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-neutral-800 flex flex-col sm:flex-row gap-2.5">
            <a
              href={`tel:${GYM_INFO.phoneRaw}`}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-neutral-900 border border-neutral-800 hover:bg-neutral-850"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call {GYM_INFO.phone}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry('Mobile Nav Enquiry');
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 text-center shadow-md shadow-emerald-500/20"
            >
              Join / Enquire Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
