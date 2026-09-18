import React from 'react';
import { GYM_INFO } from '../data/gymInfo';
import {
  Star,
  Sparkles,
  Phone,
  Calculator,
  Flame,
  ArrowRight,
  ExternalLink,
  MapPin,
  ShieldCheck,
} from 'lucide-react';

interface HeroProps {
  onOpenEnquiry: () => void;
  onExploreTools: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEnquiry, onExploreTools }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center overflow-hidden"
    >
      {/* Background athletic lighting accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute -top-12 -right-12 w-96 h-96 bg-lime-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Mobile Google Review Trust Card (Guaranteed top placement on mobile) */}
        <div className="block lg:hidden mb-6">
          <div className="bg-neutral-900/90 border border-amber-500/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white tracking-wider uppercase">
                  Google Reviews
                </span>
              </div>
              <span className="text-[11px] text-neutral-400">Verified Gym</span>
            </div>
            <p className="text-xs text-neutral-300 mt-1.5 mb-3">
              Trained at Hulk's Work Zone? Share your genuine experience!
            </p>
            <div className="flex items-center gap-2">
              <a
                href={GYM_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-sm"
              >
                <span>Write a Google Review</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="#reviews"
                className="py-2.5 px-3 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700/60 transition-colors whitespace-nowrap"
              >
                Draft Assistant ↓
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Powerful Athletic Headline & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Location & Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 mb-6 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dabra, Madhya Pradesh</span>
              <span className="text-neutral-500">•</span>
              <span className="text-emerald-400">Open for Training</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black uppercase tracking-tight text-white leading-[1.05] mb-6">
              TRAIN WITH PASSION.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-400">
                DOMINATE
              </span>{' '}
              YOUR LIMITS.
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mb-8 leading-relaxed">
              Welcome to <strong className="text-white">Hulk's Work Zone</strong> — Dabra's home for serious iron, athletic transformations, and progressive fitness. Powered by our free scientific workout calculators, exercise directory, and bilingual AI Fitness Assistant.
            </p>

            {/* CTAs */}
            <div className="w-full sm:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-8">
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 to-lime-400 hover:from-emerald-300 hover:to-lime-300 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-base"
              >
                <span>Join / Enquire Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreTools}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-neutral-200 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-all text-base"
              >
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Explore Fitness Tools</span>
              </button>

              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-neutral-300 bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:text-white transition-all text-sm"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Call: {GYM_INFO.phone}</span>
              </a>
            </div>

            {/* Quick feature highlights pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 pt-2 border-t border-neutral-900 w-full">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authentic Strength Equipment</span>
              </div>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-lime-400" />
                <span>Hindi + Hinglish AI Coach</span>
              </div>
              <span className="text-neutral-700">•</span>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>12+ Free Fitness Calculators</span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Visual Hub & Desktop Google Reviews Card */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Desktop Google Reviews Trust Card */}
            <div className="hidden lg:block bg-gradient-to-br from-neutral-900/90 to-neutral-950 border border-amber-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                    ))}
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 uppercase tracking-wider">
                  Verified Reviews
                </span>
              </div>

              <h2 className="font-heading text-xl font-bold text-white mb-1.5">
                GOOGLE REVIEWS
              </h2>
              <p className="text-sm text-neutral-300 mb-5 leading-relaxed">
                Trained at Hulk's Work Zone? Share your genuine feedback and support our local fitness community in Dabra.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <a
                  href={GYM_INFO.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <span>WRITE A GOOGLE REVIEW</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <a
                  href="#reviews"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl text-sm font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition-colors whitespace-nowrap"
                >
                  <span>Review Assistant ↓</span>
                </a>
              </div>
            </div>

            {/* Athletic Visual Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 relative overflow-hidden shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Gym Identity
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white mt-1">
                    {GYM_INFO.name}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-lg">
                  HWZ
                </div>
              </div>

              <p className="text-sm text-neutral-300 mb-4 leading-relaxed">
                Dedicated training atmosphere built with standard barbells, dumbbells, squat stations, and functional conditioning gear.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-800/80">
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/50">
                  <span className="text-[11px] text-neutral-400 block font-medium">Location</span>
                  <span className="text-sm font-bold text-white">Dabra, MP</span>
                </div>
                <div className="bg-neutral-950/60 rounded-xl p-3 border border-neutral-800/50">
                  <span className="text-[11px] text-neutral-400 block font-medium">Direct Line</span>
                  <a href={`tel:${GYM_INFO.phoneRaw}`} className="text-sm font-bold text-emerald-400 hover:underline">
                    {GYM_INFO.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
