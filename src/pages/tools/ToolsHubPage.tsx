import React from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Flame,
  Apple,
  Zap,
  Activity,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface ToolsHubPageProps {
  onAskAi?: (prompt: string) => void;
}

export const ToolsHubPage: React.FC<ToolsHubPageProps> = () => {
  const tools = [
    {
      id: 'bmi',
      name: 'BMI Calculator',
      path: '/tools/bmi',
      icon: Scale,
      color: 'emerald',
      tagline: 'Check weight category and general population benchmark',
      whatItDoes: 'Calculates Body Mass Index using your height and weight.',
      whoItIsFor: 'Anyone wanting a fast initial benchmark of weight relative to height.',
      whatYouNeed: 'Height & Body Weight',
      whatYouGet: 'BMI score, WHO classification, and healthy weight range estimate.',
    },
    {
      id: 'bmr-tdee',
      name: 'BMR & TDEE Calculator',
      path: '/tools/bmr-tdee',
      icon: Flame,
      color: 'amber',
      tagline: 'Daily energy expenditure at rest and in motion',
      whatItDoes: 'Estimates how many calories your body burns at rest (BMR) and with daily activity (TDEE).',
      whoItIsFor: 'Lifters, fat-loss seekers, and anyone planning daily calorie balance.',
      whatYouNeed: 'Age, Gender, Height, Weight & Daily Activity level',
      whatYouGet: 'Basal Metabolic Rate & Total Daily Energy Expenditure in kcal/day.',
    },
    {
      id: 'calories',
      name: 'Calorie & Macro Calculator',
      path: '/tools/calories',
      icon: Apple,
      color: 'lime',
      tagline: 'Custom calories, protein, carbs, and fat split',
      whatItDoes: 'Calculates target daily calories and recommended grams of protein, carbs, and fats based on your specific goal.',
      whoItIsFor: 'Anyone bulking, cutting, or maintaining athletic body composition.',
      whatYouNeed: 'Weight, Height, Age, Goal (Muscle Gain / Fat Loss / Maintain) & Diet Approach',
      whatYouGet: 'Daily calorie target, grams of protein, carbs, and healthy fats.',
    },
    {
      id: 'body-fat',
      name: 'Body Fat Calculator',
      path: '/tools/body-fat',
      icon: Zap,
      color: 'cyan',
      tagline: 'US Navy circumference body composition method',
      whatItDoes: 'Estimates body fat percentage, lean mass, and fat mass using tape measurements.',
      whoItIsFor: 'Athletes tracking real body composition changes beyond scale weight.',
      whatYouNeed: 'Height, Weight, Waist, Neck (and Hip for women)',
      whatYouGet: 'Estimated Body Fat %, Fat Mass in kg, and Lean Muscle Mass in kg.',
    },
    {
      id: 'one-rep-max',
      name: '1RM Strength Calculator',
      path: '/tools/one-rep-max',
      icon: Activity,
      color: 'orange',
      tagline: 'Estimate single repetition maximum for heavy lifts',
      whatItDoes: 'Calculates your theoretical 1-rep maximum lift and percentage loading matrix.',
      whoItIsFor: 'Strength lifters planning percentages for Bench Press, Squat, or Deadlift.',
      whatYouNeed: 'Weight lifted & Repetitions performed (1–12 reps)',
      whatYouGet: 'Estimated 1RM, plus 95% to 60% training load matrix.',
    },
    {
      id: 'rest-timer',
      name: 'Between-Set Rest Timer',
      path: '/tools/rest-timer',
      icon: Clock,
      color: 'emerald',
      tagline: 'Track rest intervals between sets for optimal recovery',
      whatItDoes: 'Keeps precise recovery time between sets with audio & visual prompts.',
      whoItIsFor: 'Lifters who want disciplined workouts without resting too long or too little.',
      whatYouNeed: 'Desired rest interval (30s, 60s, 90s, 120s, or custom)',
      whatYouGet: 'Live countdown ring, sound alerts, and interval guidance.',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Fitness Tools</span>
        </nav>

        {/* Page Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scientific Training Tools</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-4">
            Fitness <span className="text-emerald-400">Calculators</span>
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 leading-relaxed">
            Simple, scientific tools to understand your BMI, calorie needs, body composition, and training numbers. Choose a calculator below to get clear, actionable numbers for your fitness journey.
          </p>
        </div>

        {/* Tools Grid - Responsive Card System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className="bg-neutral-900/80 border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 group shadow-lg"
              >
                <div>
                  {/* Tool Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                      Free Tool
                    </span>
                  </div>

                  <h2 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium mb-5 leading-relaxed">
                    {tool.tagline}
                  </p>

                  {/* Information Breakdown */}
                  <div className="space-y-3 pt-4 border-t border-neutral-800/80 text-xs">
                    <div>
                      <span className="font-semibold text-neutral-300 block mb-0.5">What it does:</span>
                      <span className="text-neutral-400 leading-relaxed">{tool.whatItDoes}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-neutral-300 block mb-0.5">Who it is for:</span>
                      <span className="text-neutral-400 leading-relaxed">{tool.whoItIsFor}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Needs</span>
                        <span className="text-neutral-200 font-medium text-[11px] leading-tight block">{tool.whatYouNeed}</span>
                      </div>
                      <div className="bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
                        <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Gives</span>
                        <span className="text-neutral-200 font-medium text-[11px] leading-tight block">{tool.whatYouGet}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Open Button */}
                <div className="pt-6 mt-4 border-t border-neutral-800/80">
                  <Link
                    to={tool.path}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-98"
                  >
                    <span>Open Calculator</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust & Guidance Banner */}
        <div className="mt-14 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                Need Help Understanding Your Numbers?
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-xl leading-relaxed">
                Our AI Fitness Coach can explain your calculator results in plain English, and our trainers at Hulk's Work Zone in Dabra are always ready to help you implement them.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/ai-coach"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 transition-colors whitespace-nowrap"
            >
              <span>Ask AI Coach</span>
            </Link>
            <Link
              to="/start"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors whitespace-nowrap"
            >
              <span>Start Here Guide</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
