import React from 'react';
import { Link } from 'react-router-dom';
import { MembershipPlans } from '../components/MembershipPlans';
import {
  CreditCard,
  ChevronRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  MapPin,
  Phone,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymInfo';

interface MembershipPageProps {
  onSelectPlan: (planName: string) => void;
}

export const MembershipPage: React.FC<MembershipPageProps> = ({ onSelectPlan }) => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Membership Plans</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Transparent Pricing & Value</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
            Gym <span className="text-emerald-400">Memberships</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Transparent pricing with zero hidden charges. Every membership includes full equipment access, locker facilities, and trainer floor guidance.
          </p>
        </div>

        {/* Membership Plans Component */}
        <MembershipPlans onSelectPlan={onSelectPlan} />

        {/* What Every Membership Includes */}
        <div className="mt-14 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10">
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>What Every Membership Includes</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm block">Full Iron & Cardio Access</span>
              <p className="text-neutral-400 leading-relaxed">
                Unlimited access to heavy Olympic barbells, calibrated dumbbell racks up to 40+ kg, plate-loaded leg presses, and cable stations.
              </p>
            </div>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm block">On-Floor Trainer Guidance</span>
              <p className="text-neutral-400 leading-relaxed">
                Certified gym coaches present during all morning and evening shifts to correct form, offer spotting, and ensure safe lifting.
              </p>
            </div>

            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm block">Lockers & Clean Amenities</span>
              <p className="text-neutral-400 leading-relaxed">
                Dedicated changing facilities, clean drinking water stations, and secure personal storage lockers.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <span className="text-white font-bold block">Gym Shifts:</span>
                <span className="text-neutral-400">Morning: 5:30 AM – 10:30 AM | Evening: 4:30 PM – 10:00 PM</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectPlan('General Membership Consultation')}
              className="px-6 py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-98"
            >
              Enquire About Joining Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
