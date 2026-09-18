import React from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  Dumbbell,
  Phone,
  Instagram,
  Star,
  MapPin,
  Heart,
  ShieldCheck,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-800/80 pt-16 pb-12 text-neutral-400 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 flex items-center justify-center text-neutral-950 shadow-md shadow-emerald-500/20">
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-heading text-xl font-black text-white uppercase tracking-tight">
                Hulk's <span className="text-emerald-400">Work Zone</span>
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Dabra's dedicated fitness center and athletic training hub. Empowering people of all fitness levels with authentic strength equipment, community support, and science-backed training tools.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={GYM_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Profile"
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-pink-400 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href={GYM_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Reviews"
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-amber-400 transition-colors"
              >
                <Star className="w-4 h-4" />
              </a>

              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                aria-label="Call Gym"
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 flex items-center justify-center text-neutral-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Fitness Tools Nav */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-heading text-sm font-bold text-white uppercase tracking-wider block">
              Free Fitness Tools
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#calculators" className="hover:text-emerald-400 transition-colors">
                  BMI & Body Fat Calculator
                </a>
              </li>
              <li>
                <a href="#calculators" className="hover:text-emerald-400 transition-colors">
                  BMR & Daily TDEE Estimator
                </a>
              </li>
              <li>
                <a href="#calculators" className="hover:text-emerald-400 transition-colors">
                  Macro & Protein Calculator
                </a>
              </li>
              <li>
                <a href="#calculators" className="hover:text-emerald-400 transition-colors">
                  One-Rep Max (1RM) Estimator
                </a>
              </li>
              <li>
                <a href="#exercises" className="hover:text-emerald-400 transition-colors">
                  Complete Exercise Directory
                </a>
              </li>
              <li>
                <a href="#workout-builder" className="hover:text-emerald-400 transition-colors">
                  Custom Workout Routine Builder
                </a>
              </li>
              <li>
                <a href="#timer" className="hover:text-emerald-400 transition-colors">
                  Interval Rest Timer
                </a>
              </li>
              <li>
                <a href="#progress" className="hover:text-emerald-400 transition-colors">
                  Personal Record & Weight Log
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links & Community */}
          <div className="lg:col-span-2 space-y-3">
            <span className="font-heading text-sm font-bold text-white uppercase tracking-wider block">
              Gym Community
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#reviews" className="hover:text-emerald-400 transition-colors">
                  Review Writing Assistant
                </a>
              </li>
              <li>
                <a href="#ai-coach" className="hover:text-emerald-400 transition-colors">
                  Coach Hulk AI Assistant
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-emerald-400 transition-colors">
                  Membership Plans & Fees
                </a>
              </li>
              <li>
                <a href="#location" className="hover:text-emerald-400 transition-colors">
                  Location & Timing
                </a>
              </li>
              <li>
                <a
                  href={GYM_INFO.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1"
                >
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span>Google Reviews</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3 space-y-3">
            <span className="font-heading text-sm font-bold text-white uppercase tracking-wider block">
              Visit or Contact
            </span>
            <div className="space-y-2 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{GYM_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${GYM_INFO.phoneRaw}`} className="text-white hover:text-emerald-400 font-bold">
                  {GYM_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-400 shrink-0" />
                <a
                  href={GYM_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-emerald-400 font-bold"
                >
                  @hulks_work_zone
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p className="max-w-2xl leading-relaxed text-center md:text-left">
            <strong>Educational Disclaimer:</strong> The calculations, workout routines, and AI advice provided on this platform are for fitness education and informational purposes only. Consult a physician or medical professional before commencing any new rigorous exercise regime.
          </p>

          <p className="text-center md:text-right shrink-0">
            © {new Date().getFullYear()} {GYM_INFO.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
