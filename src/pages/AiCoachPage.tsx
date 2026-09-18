import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { AiAssistant } from '../components/AiAssistant';
import {
  Bot,
  ChevronRight,
  Sparkles,
  Dumbbell,
  Scale,
  Flame,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { GYM_INFO } from '../data/gymInfo';

export const AiCoachPage: React.FC = () => {
  const location = useLocation();
  const [initialPrompt, setInitialPrompt] = useState<string | undefined>(
    (location.state as any)?.initialPrompt
  );

  useEffect(() => {
    if ((location.state as any)?.initialPrompt) {
      setInitialPrompt((location.state as any).initialPrompt);
    }
  }, [location.state]);

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">AI Fitness Coach</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Bot className="w-3.5 h-3.5" />
            <span>24/7 Virtual Fitness Advisor</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
            AI <span className="text-emerald-400">Fitness Coach</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Get instant, science-backed guidance on workout programming, exercise technique cues, nutrition targets, and gym principles.
          </p>
        </div>

        {/* AI Assistant Component */}
        <div className="mb-12">
          <AiAssistant
            externalPrompt={initialPrompt}
            onClearExternalPrompt={() => setInitialPrompt(undefined)}
          />
        </div>

        {/* Quick Tools & Gym Contact Footnote */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div>
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Need Exact Calculations?</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed mb-4">
              Use our standalone scientific calculators for instant answers without waiting for a reply.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/tools/calories"
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white transition-colors"
              >
                Calories & Macros
              </Link>
              <Link
                to="/tools/bmi"
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white transition-colors"
              >
                BMI Calculator
              </Link>
              <Link
                to="/workout-builder"
                className="px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white transition-colors"
              >
                Workout Builder
              </Link>
            </div>
          </div>

          <div className="border-t md:border-t-0 md:border-l border-neutral-800 pt-6 md:pt-0 md:pl-6">
            <h3 className="font-heading text-base font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Train in Person at Hulk's Work Zone</span>
            </h3>
            <p className="text-neutral-400 leading-relaxed mb-3">
              Located in Dabra, Madhya Pradesh. Speak with certified strength coaches on the gym floor.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {GYM_INFO.phone}</span>
              </a>
              <Link
                to="/contact"
                className="px-3.5 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-medium text-xs transition-colors"
              >
                Facility Location & Hours
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
