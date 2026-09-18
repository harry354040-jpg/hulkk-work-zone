import React from 'react';
import { MEMBERSHIP_PLANS } from '../data/membershipData';
import { Check, Compass, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface MembershipPlansProps {
  onSelectPlan: (planName: string) => void;
}

export const MembershipPlans: React.FC<MembershipPlansProps> = ({ onSelectPlan }) => {
  return (
    <section id="membership" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Transparent Memberships</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Gym Membership <span className="text-emerald-400">Plans</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Invest in your strength and athletic longevity. Access professional equipment, structured conditioning, and personal guidance at Hulk's Work Zone in Dabra.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isPopular = plan.isPopular;
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  isPopular
                    ? 'bg-neutral-900 border-2 border-emerald-400/80 shadow-2xl shadow-emerald-500/10 -translate-y-1'
                    : 'bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Popular Pill */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-400 text-neutral-950 shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="font-heading text-xl font-bold text-white mb-1">
                      {plan.name}
                    </h3>
                    <span className="text-xs text-neutral-400 font-medium block">
                      {plan.duration}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-6 pb-6 border-b border-neutral-800">
                    <span className="font-heading text-3xl sm:text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-neutral-400">/ term</span>
                  </div>

                  <ul className="space-y-3 mb-8 text-xs sm:text-sm text-neutral-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectPlan(plan.name)}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95 ${
                    isPopular
                      ? 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
                      : 'bg-neutral-800 hover:bg-neutral-750 text-white border border-neutral-700'
                  }`}
                >
                  <span>Enquire / Join Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-12 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-white">First Time at Hulk's Work Zone?</h4>
              <p className="text-xs text-neutral-400">
                Walk in for a trial workout session, inspect our equipment, and talk to our coaches.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectPlan('Trial Session')}
            className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-white font-bold text-xs whitespace-nowrap transition-colors"
          >
            Request Free Trial Walk-in
          </button>
        </div>
      </div>
    </section>
  );
};
