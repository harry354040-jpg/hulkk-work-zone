import React from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  Star,
  Phone,
  Calculator,
  ArrowRight,
  MapPin,
  ShieldCheck,
  Dumbbell,
  Clock,
  Sparkles,
} from 'lucide-react';

interface HeroProps {
  onOpenEnquiry: () => void;
  onExploreTools: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onExploreTools }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[85vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden"
    >
      {/* Background athletic lighting accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-lime-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Location & Verified Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 mb-5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dabra, Madhya Pradesh</span>
              <span className="text-neutral-500">•</span>
              <span className="text-emerald-400">Strength Training Facility</span>
            </div>

            {/* Clear, High-Contrast Headline */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] mb-5">
              Train smarter.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-400">
                Get stronger.
              </span>{' '}
              Track your progress.
            </h1>

            {/* Direct, Honest Supporting Copy */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mb-8 leading-relaxed">
              <strong className="text-white">Hulk's Work Zone</strong> is Dabra's fitness platform for progressive strength training, scientific workout tools, exercise form guidance, and real gym support.
            </p>

            {/* CTAs */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <button
                type="button"
                id="hero-join-enquire-btn"
                onClick={onOpenEnquiry}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 to-lime-400 hover:from-emerald-300 hover:to-lime-300 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-sm sm:text-base"
              >
                <span>JOIN / ENQUIRE NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="hero-explore-tools-btn"
                onClick={onExploreTools}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-neutral-200 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all text-sm sm:text-base"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>EXPLORE FREE TOOLS</span>
              </button>

              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-neutral-300 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:text-white transition-all text-xs sm:text-sm"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call {GYM_INFO.phone}</span>
              </a>
            </div>

            {/* Quick feature highlights pills */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-2 border-t border-neutral-900 w-full">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Free Scientific Calculators</span>
              </div>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-400" />
                <span>Exercise Directory</span>
              </div>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Fitness Assistant</span>
              </div>
            </div>
          </div>

          {/* Right Column: Gym Snapshot Card */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                <div>
                  <h2 className="font-heading text-lg font-bold text-white">
                    Hulk's Work Zone
                  </h2>
                  <span className="text-xs text-neutral-400">
                    Dabra, Madhya Pradesh
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-amber-400">4.9</span>
                  <span className="text-[10px] text-neutral-400">(120+)</span>
                </div>
              </div>

              {/* Gym Details Overview */}
              <div className="space-y-3 text-xs mb-6">
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-400">Facility Type:</span>
                  <span className="font-semibold text-white">Strength & Conditioning Gym</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-400">Morning Timings:</span>
                  <span className="font-semibold text-white">{GYM_INFO.hours.morning}</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-850">
                  <span className="text-neutral-400">Evening Timings:</span>
                  <span className="font-semibold text-white">{GYM_INFO.hours.evening}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-neutral-400">Platform Features:</span>
                  <span className="font-semibold text-emerald-400">100% Free Calculators & Tools</span>
                </div>
              </div>

              {/* Direct Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href="#calculators"
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-center text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Calculators Hub
                </a>
                <a
                  href="#exercises"
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-center text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Exercise Library
                </a>
                <a
                  href="#workout-builder"
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-center text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Workout Planner
                </a>
                <a
                  href="#reviews"
                  className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-center text-xs font-semibold text-neutral-300 hover:text-white transition-colors"
                >
                  Member Reviews
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
