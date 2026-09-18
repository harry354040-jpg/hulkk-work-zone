import React from 'react';
import { Link } from 'react-router-dom';
import { GYM_INFO } from '../data/gymInfo';
import {
  MapPin,
  Phone,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Navigation,
  Send,
  Calendar,
} from 'lucide-react';

interface ContactPageProps {
  onOpenEnquiry: (plan?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onOpenEnquiry }) => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Contact & Location</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Hulk's Work Zone</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
            Location & <span className="text-emerald-400">Timings</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Conveniently situated in Dabra, Madhya Pradesh. Drop by during open shift hours to tour the equipment and meet our coaching team.
          </p>
        </div>

        {/* Contact Info & Timings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-stretch">
          {/* Details Column */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl space-y-6">
            <div>
              {/* Gym Brand Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-bold text-white">
                    {GYM_INFO.name}
                  </h2>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                    {GYM_INFO.city}, {GYM_INFO.state}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 mb-4">
                <span className="text-xs uppercase font-bold text-neutral-500 block mb-1">
                  Gym Address:
                </span>
                <p className="text-sm font-semibold text-neutral-200 leading-relaxed">
                  {GYM_INFO.address}
                </p>
              </div>

              {/* Hours Grid */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-3 mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 uppercase tracking-wider pb-2 border-b border-neutral-800">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Daily Shift Timings</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-neutral-800/80">
                  <span className="text-neutral-300 font-medium">Morning Shift</span>
                  <span className="font-bold text-emerald-400">5:30 AM – 10:30 AM</span>
                </div>

                <div className="flex justify-between text-xs py-1 border-b border-neutral-800/80">
                  <span className="text-neutral-300 font-medium">Evening Shift</span>
                  <span className="font-bold text-emerald-400">4:30 PM – 10:00 PM</span>
                </div>

                <div className="flex justify-between text-xs py-1">
                  <span className="text-neutral-300 font-medium">Sunday</span>
                  <span className="font-bold text-amber-400">Morning Open</span>
                </div>
              </div>

              {/* Direct Phone */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase font-bold text-neutral-500 block">Phone & WhatsApp</span>
                  <span className="text-base font-bold text-white">{GYM_INFO.phone}</span>
                </div>
                <a
                  href={`tel:${GYM_INFO.phoneRaw}`}
                  className="py-2.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => onOpenEnquiry('General Visit / Joining')}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Submit Membership Enquiry</span>
              </button>

              <a
                href={GYM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Get Driving Directions</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Column */}
          <div className="lg:col-span-6 bg-neutral-900 border border-neutral-800 rounded-3xl p-3 flex flex-col justify-between shadow-2xl overflow-hidden min-h-[420px]">
            <iframe
              title="Hulk's Work Zone Location Map"
              src={GYM_INFO.googleMapsEmbedUrl}
              className="w-full h-full min-h-[380px] rounded-2xl border border-neutral-800 filter grayscale contrast-125 opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-3 text-center">
              <a
                href={GYM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-neutral-400 hover:text-emerald-400 inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Open in Google Maps Application</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Facility Tour Notice */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Walk-In Facility Tours Welcome
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                You do not need an appointment to inspect our facilities. Feel free to visit during morning or evening shift hours to tour the barbell racks, dumbbells, cardio equipment, and meet our coaching staff.
              </p>
            </div>
          </div>

          <Link
            to="/membership"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors whitespace-nowrap"
          >
            <span>View Membership Pricing</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
