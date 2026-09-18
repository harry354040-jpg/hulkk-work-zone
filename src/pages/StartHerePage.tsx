import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GYM_INFO } from '../data/gymInfo';
import {
  Compass,
  ArrowRight,
  Dumbbell,
  Scale,
  Flame,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Phone,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface StartHerePageProps {
  onOpenEnquiry?: (plan?: string) => void;
  onAskAi?: (prompt: string) => void;
}

export const StartHerePage: React.FC<StartHerePageProps> = ({ onOpenEnquiry, onAskAi }) => {
  const navigate = useNavigate();

  const [step1Goal, setStep1Goal] = useState<'muscle' | 'fatloss' | 'strength' | 'beginner'>('beginner');
  const [step2Exp, setStep2Exp] = useState<'novice' | 'some' | 'experienced'>('novice');
  const [step3Need, setStep3Need] = useState<'exercise' | 'workout' | 'calories' | 'gym'>('workout');

  const handleAskCoachCustom = () => {
    const goalText =
      step1Goal === 'muscle'
        ? 'building muscle'
        : step1Goal === 'fatloss'
        ? 'losing fat'
        : step1Goal === 'strength'
        ? 'building strength'
        : 'starting my fitness journey from scratch';

    const expText =
      step2Exp === 'novice'
        ? 'a complete beginner'
        : step2Exp === 'some'
        ? 'having several months of gym experience'
        : 'an experienced lifter';

    const prompt = `Sir, I am ${expText} focused on ${goalText}. What are the 3 most important fundamentals I should master during my first month at the gym?`;

    if (onAskAi) {
      onAskAi(prompt);
    }
    navigate('/ai-coach', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>New Visitor Guide</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Start Here: <span className="text-emerald-400">Your Fitness Roadmap</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Whether you are stepping into a gym for the very first time or refining an existing routine, this quick 3-step guide gives you an immediate roadmap.
          </p>
        </div>

        {/* Interactive 3-Step Questionnaire */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 mb-12">
          {/* Step 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center">
                1
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                What is your primary goal right now?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'beginner', title: 'Complete Beginner', desc: 'Learn proper form and build gym confidence' },
                { id: 'muscle', title: 'Build Muscle', desc: 'Add size, shape, and lean tissue' },
                { id: 'fatloss', title: 'Lose Body Fat', desc: 'Burn fat while preserving lean muscle' },
                { id: 'strength', title: 'Increase Strength', desc: 'Lift heavier weights safely' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep1Goal(item.id as any)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    step1Goal === item.id
                      ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-200 mb-1">{item.title}</span>
                  <span className="text-xs text-neutral-400 leading-tight block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center">
                2
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                What is your gym lifting background?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'novice', title: 'New to Weight Lifting', desc: '0 – 6 months or starting again after a long break' },
                { id: 'some', title: 'Consistent Lifter', desc: '6 – 24 months of regular training' },
                { id: 'experienced', title: 'Advanced Lifter', desc: '2+ years of structured strength training' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep2Exp(item.id as any)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    step2Exp === item.id
                      ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-200 mb-1">{item.title}</span>
                  <span className="text-xs text-neutral-400 leading-tight block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-7 h-7 rounded-full bg-emerald-400 text-neutral-950 font-black text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
                What would you like assistance with first?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'workout', title: 'Workout Routine', desc: 'Get an organized weekly plan' },
                { id: 'exercise', title: 'Exercise Technique', desc: 'Learn form and mistakes to avoid' },
                { id: 'calories', title: 'Nutrition & Calories', desc: 'Calculate daily calories and protein' },
                { id: 'gym', title: 'Join Hulk\'s Work Zone', desc: 'Gym membership in Dabra, MP' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep3Need(item.id as any)}
                  className={`p-4 rounded-2xl text-left border transition-all ${
                    step3Need === item.id
                      ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="font-bold text-sm block text-neutral-200 mb-1">{item.title}</span>
                  <span className="text-xs text-neutral-400 leading-tight block">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Personalized Recommendations Output */}
          <div className="border-t border-neutral-800 pt-8">
            <div className="bg-neutral-950 rounded-2xl p-6 border border-emerald-500/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Your Personalized Recommended Action Plan</span>
              </div>

              <h3 className="font-heading text-xl font-bold text-white">
                {step1Goal === 'beginner' && 'Start with 3 Full-Body Sessions & Foundational Movements'}
                {step1Goal === 'muscle' && 'Hypertrophy Focus: 4-Day Split with Progressive Overload'}
                {step1Goal === 'fatloss' && 'Fat Loss Focus: Strength Training + Moderate Caloric Deficit'}
                {step1Goal === 'strength' && 'Strength Focus: Compound Lifts & Percentage Loading'}
              </h3>

              <p className="text-sm text-neutral-300 leading-relaxed">
                Based on your answers, here are the most effective steps you can take right now on this platform and in the gym:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <Link
                  to="/workout-builder"
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Step 1</span>
                    <span className="font-bold text-sm text-white block mb-1">Create Your Routine</span>
                    <p className="text-xs text-neutral-400">Generate a 3 or 4 day routine matching your available equipment.</p>
                  </div>
                  <div className="mt-4 text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                    <span>Open Workout Builder</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                <Link
                  to="/tools/calories"
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Step 2</span>
                    <span className="font-bold text-sm text-white block mb-1">Set Daily Nutrition</span>
                    <p className="text-xs text-neutral-400">Find your exact daily calorie target and grams of protein.</p>
                  </div>
                  <div className="mt-4 text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                    <span>Calculate Macros</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>

                <Link
                  to="/exercises"
                  className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-emerald-400/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Step 3</span>
                    <span className="font-bold text-sm text-white block mb-1">Master Form</span>
                    <p className="text-xs text-neutral-400">Review step-by-step instructions and common technique mistakes.</p>
                  </div>
                  <div className="mt-4 text-xs font-bold text-emerald-400 inline-flex items-center gap-1">
                    <span>Browse Exercises</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleAskCoachCustom}
                  className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 active:scale-98"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI Coach for Advice</span>
                </button>

                {onOpenEnquiry && (
                  <button
                    type="button"
                    onClick={() => onOpenEnquiry('Beginner Consultation')}
                    className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white font-bold text-xs border border-neutral-700 transition-colors"
                  >
                    <span>Enquire About Gym Joining in Dabra</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* First Day at the Gym Checklist */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>First Day Checklist: Visiting Hulk's Work Zone</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm block">What to Bring</span>
              <ul className="space-y-1.5 text-neutral-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Clean indoor training shoes (no slippers / sandals)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Small sweat towel for hygiene</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Water bottle for hydration between sets</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
              <span className="font-bold text-white text-sm block">Facility Shift Timings</span>
              <div className="space-y-1.5 text-neutral-300">
                <div className="flex justify-between pb-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Morning Shift:</span>
                  <span className="font-bold text-white">5:30 AM – 10:30 AM</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-neutral-800">
                  <span className="text-neutral-400">Evening Shift:</span>
                  <span className="font-bold text-white">4:30 PM – 10:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Sunday:</span>
                  <span className="font-bold text-amber-400">Morning Open</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
