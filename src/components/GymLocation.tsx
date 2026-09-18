import React, { useState } from 'react';
import { GYM_INFO } from '../data/gymInfo';
import { FAQ_DATA } from '../data/faqData';
import {
  MapPin,
  Phone,
  Clock,
  Instagram,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Star,
  Compass,
} from 'lucide-react';

interface GymLocationProps {
  onOpenEnquiry: () => void;
}

export const GymLocation: React.FC<GymLocationProps> = ({ onOpenEnquiry }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="location" className="py-16 sm:py-24 bg-neutral-900/40 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit The Zone</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Location & <span className="text-emerald-400">Hours</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Conveniently situated in Dabra, Madhya Pradesh. Drop by during workout hours or contact us directly.
          </p>
        </div>

        {/* Location & Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          {/* Left Column: Contact & Timings */}
          <div className="lg:col-span-6 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    {GYM_INFO.name}
                  </h3>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    {GYM_INFO.city}, {GYM_INFO.state}
                  </span>
                </div>
              </div>

              {/* Address card */}
              <div className="bg-neutral-900/80 rounded-2xl p-4 border border-neutral-800 mb-6">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                  Full Gym Address
                </span>
                <p className="text-sm font-medium text-neutral-200 leading-relaxed">
                  {GYM_INFO.address}
                </p>
              </div>

              {/* Hours Grid */}
              <div className="bg-neutral-900/80 rounded-2xl p-4 border border-neutral-800 mb-6">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Training Hours
                </span>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                    <span className="text-neutral-400">Morning Shift:</span>
                    <span className="font-bold text-white">{GYM_INFO.hours.morning}</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-850">
                    <span className="text-neutral-400">Evening Shift:</span>
                    <span className="font-bold text-white">{GYM_INFO.hours.evening}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Sunday Schedule:</span>
                    <span className="font-bold text-amber-400">{GYM_INFO.hours.sunday}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800">
              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Call {GYM_INFO.phone}</span>
              </a>

              <a
                href={GYM_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>@hulks_work_zone</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Map Hub & Google Reviews Trust */}
          <div className="lg:col-span-6 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div>
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Directions & Reviews
              </span>
              <h3 className="font-heading text-2xl font-bold text-white mb-3">
                Find Us on Google Maps
              </h3>
              <p className="text-sm text-neutral-300 mb-6 leading-relaxed">
                Click below to launch real-time GPS navigation or read verified local reviews directly on Google.
              </p>

              {/* Map Preview Visual Card */}
              <div className="w-full h-48 bg-neutral-900 rounded-2xl border border-neutral-800 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden mb-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-2">
                  <Compass className="w-6 h-6 animate-spin [animation-duration:12s]" />
                </div>
                <span className="text-sm font-bold text-white">Hulk's Work Zone</span>
                <span className="text-xs text-neutral-400 mt-0.5">Dabra, Madhya Pradesh</span>
                <span className="text-[11px] text-emerald-400 font-semibold mt-2">
                  Tap below to open Google Maps navigation
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={GYM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-4 h-4 text-emerald-400" />
              </a>

              <a
                href={GYM_INFO.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-500/20"
              >
                <Star className="w-4 h-4 fill-neutral-950" />
                <span>View Google Reviews</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-bold text-neutral-300 mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Got Questions?</span>
            </div>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              Frequently Asked <span className="text-emerald-400">Questions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {FAQ_DATA.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-bold text-sm sm:text-base text-white">
                      {faq.question}
                    </span>
                    <span className="p-1 rounded-lg bg-neutral-900 text-neutral-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-900 pt-3 animate-in fade-in duration-150">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
