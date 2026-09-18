import React from 'react';
import { Calculator, Dumbbell, Flame, MapPin, ArrowRight, ShieldCheck, Award, Users, CheckCircle } from 'lucide-react';

interface StartGuideProps {
  onOpenEnquiry: () => void;
}

export const StartGuide: React.FC<StartGuideProps> = ({ onOpenEnquiry }) => {
  return (
    <section id="about-gym" className="py-16 sm:py-20 bg-neutral-900/40 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First-time Visitor Pathway */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
              New Visitor Roadmap
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white uppercase tracking-tight">
              Start Here: 4 Simple Steps
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-2">
              Whether you are working out at home, lifting in a gym, or planning to visit our facility in Dabra:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1 */}
            <a
              href="#calculators"
              className="bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">
                  01
                </div>
                <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-1">
                  Calculate Your Numbers
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Find your BMI, BMR, daily maintenance calories, and optimal protein intake in seconds.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center text-xs font-semibold text-emerald-400">
                <span>Go to Calculators</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>

            {/* Step 2 */}
            <a
              href="#exercises"
              className="bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">
                  02
                </div>
                <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-1">
                  Learn Exercise Form
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Browse clear English instructions, target muscles, and safety cues for safe lifting.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center text-xs font-semibold text-emerald-400">
                <span>Explore Exercises</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>

            {/* Step 3 */}
            <a
              href="#workout-builder"
              className="bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">
                  03
                </div>
                <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-1">
                  Build Your Routine
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Generate a structured 2–6 day split matching your experience and equipment.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center text-xs font-semibold text-emerald-400">
                <span>Open Workout Planner</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </a>

            {/* Step 4 */}
            <button
              type="button"
              onClick={onOpenEnquiry}
              className="bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between transition-all group text-left"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-black text-sm mb-3">
                  04
                </div>
                <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-1">
                  Train at Hulk's Work Zone
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Visit our authentic gym facility in Dabra, MP. Join memberships or ask our team questions.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center text-xs font-semibold text-emerald-400">
                <span>Join / Enquire</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Why Train at Hulk's Work Zone Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Authentic Strength Facility
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mb-4">
                Why Train at Hulk's Work Zone?
              </h2>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6">
                Unlike commercial gyms that focus on gimmicks, Hulk's Work Zone in Dabra is built on progressive resistance training, heavy iron, and real member coaching. Whether you are squatting your first 40 kg or working toward a 150 kg deadlift, you'll find the right equipment and an ego-free environment.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Heavy dumbbells, olympic barbells, and squat cages</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Dedicated morning and evening training shifts</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Honest guidance on form, nutrition, and recovery</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-200">Convenient central location in Dabra, MP</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-neutral-900 rounded-2xl p-6 border border-neutral-800 flex flex-col justify-between">
              <div>
                <h3 className="font-heading text-lg font-bold text-white mb-2">
                  Visit The Facility
                </h3>
                <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
                  Drop by during open hours to tour the equipment, meet the trainers, and consult on membership options.
                </p>

                <div className="space-y-2 text-xs mb-6">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Morning Shift</span>
                    <span className="font-bold text-white">5:30 AM – 10:30 AM</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                    <span className="text-neutral-400">Evening Shift</span>
                    <span className="font-bold text-white">4:30 PM – 10:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Sunday</span>
                    <span className="font-bold text-amber-400">Morning Open</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href="#location"
                  className="flex-1 py-2.5 px-3 rounded-xl text-center text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition-colors"
                >
                  View Location & Map
                </a>
                <button
                  type="button"
                  onClick={onOpenEnquiry}
                  className="flex-1 py-2.5 px-3 rounded-xl text-center text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
