import React from 'react';
import { Link } from 'react-router-dom';
import { GYM_INFO } from '../data/gymInfo';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  Compass,
  Dumbbell,
  Calculator,
  Layers,
  TrendingUp,
  Bot,
  CreditCard,
  Star,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Flame,
  Scale,
  Clock,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface HomePageProps {
  onOpenEnquiry: (plan?: string) => void;
  onOpenReviewModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenEnquiry, onOpenReviewModal }) => {
  const featuredExercises = EXERCISES_DATA.slice(0, 3);

  const directActions = [
    {
      title: "I'm New to Fitness",
      desc: 'Follow a 3-step beginner roadmap and gym checklist.',
      path: '/start',
      icon: Compass,
      color: 'text-emerald-400',
      badge: 'Start Here',
    },
    {
      title: 'Calculate My Nutrition',
      desc: 'Discover your exact daily calories and grams of protein.',
      path: '/tools/calories',
      icon: Flame,
      color: 'text-amber-400',
      badge: 'Calculator',
    },
    {
      title: 'Explore Exercise Form',
      desc: 'Browse step-by-step lifting guides and mistake alerts.',
      path: '/exercises',
      icon: Dumbbell,
      color: 'text-sky-400',
      badge: 'Library',
    },
    {
      title: 'Build a Workout Plan',
      desc: 'Generate a weekly routine tailored to your goal.',
      path: '/workout-builder',
      icon: Layers,
      color: 'text-indigo-400',
      badge: 'Generator',
    },
    {
      title: 'Track My Progress',
      desc: 'Log personal records (PRs) and bodyweight over time.',
      path: '/progress',
      icon: TrendingUp,
      color: 'text-emerald-400',
      badge: 'Tracker',
    },
    {
      title: 'Ask AI Fitness Coach',
      desc: 'Get science-backed answers to your fitness questions.',
      path: '/ai-coach',
      icon: Bot,
      color: 'text-purple-400',
      badge: 'Coach Hulk',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-28 sm:pb-16">
      {/* 1. Hero Introduction */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 border-b border-neutral-900 overflow-hidden">
        {/* Background athletic accent glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-lime-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column: Clear Value Proposition */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-neutral-300 mb-5 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dabra, Madhya Pradesh</span>
                <span className="text-neutral-500">•</span>
                <span className="text-emerald-400">Strength Training Facility</span>
              </div>

              {/* High-Contrast Headline */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08] mb-5">
                Train smarter.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-lime-300 to-emerald-400">
                  Get stronger.
                </span>{' '}
                Track your progress.
              </h1>

              {/* Subtitle */}
              <p className="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl">
                Welcome to <strong>{GYM_INFO.name}</strong>—Dabra&apos;s premier strength and fitness destination.
                Explore precision fitness calculators, technique guides, workout planners, and training guidance.
              </p>

              {/* Primary Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link
                  to="/start"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-extrabold text-sm uppercase tracking-wide transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-98"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Here (New Visitor)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => onOpenEnquiry('General Enquiries')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-emerald-500/40 text-neutral-100 font-bold text-sm transition-all duration-200 active:scale-98"
                >
                  <span>Enquire for Gym Joining</span>
                </button>
              </div>

              {/* Verification & Shift Timings Pills */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-6 border-t border-neutral-800/80 w-full">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Shifts: 5:30–10:30 AM & 4:30–10:00 PM</span>
                </div>
                <div className="hidden sm:block text-neutral-700">•</div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-neutral-200 font-semibold">{GYM_INFO.rating} Rating</span>
                  <span>({GYM_INFO.reviewsCount}+ local lifters)</span>
                </div>
              </div>
            </div>

            {/* Right Column: Key Feature Overview Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-white text-base">Hulk&apos;s Work Zone</h2>
                      <span className="text-xs text-neutral-400">Dabra, Madhya Pradesh</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
                    Open Daily
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <span className="text-neutral-400">Free Scientific Tools:</span>
                    <span className="font-bold text-white">BMI, Calories, 1RM, Timer</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <span className="text-neutral-400">Exercise Technique:</span>
                    <span className="font-bold text-white">12+ Major Muscle Guides</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <span className="text-neutral-400">Virtual AI Coach:</span>
                    <span className="font-bold text-emerald-400">Available 24/7 (Respectful)</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between">
                    <span className="text-neutral-400">Walk-in Visits:</span>
                    <span className="font-bold text-white">Welcome During Shifts</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={`tel:${GYM_INFO.phoneRaw}`}
                    className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-neutral-700"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    <span>Call Gym Desk: {GYM_INFO.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Direct Action Chooser ("What do you want to do today?") */}
      <section className="py-16 sm:py-20 border-b border-neutral-900 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Direct Navigation</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
              What Do You Want to Do <span className="text-emerald-400">Today?</span>
            </h2>
            <p className="text-neutral-400 text-sm mt-2">
              Select your immediate goal to jump directly into the dedicated tool or section.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {directActions.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.path}
                  to={act.path}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 group shadow-md hover:shadow-emerald-500/5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center group-hover:border-emerald-500/40 transition-colors">
                        <Icon className={`w-6 h-6 ${act.color}`} />
                      </div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800">
                        {act.badge}
                      </span>
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1.5">
                      {act.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {act.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-neutral-800/80 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>Open {act.title}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Scientific Tools Suite Preview */}
      <section className="py-16 sm:py-20 border-b border-neutral-900 bg-neutral-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Calculator className="w-3.5 h-3.5" />
                <span>Precision Fitness Calculators</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                6 Dedicated <span className="text-emerald-400">Calculators</span>
              </h2>
              <p className="text-neutral-400 text-sm mt-2 max-w-xl">
                Each calculator runs on its own dedicated URL with formula breakdowns, health categories, and direct advice cues.
              </p>
            </div>

            <Link
              to="/tools"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <span>View All Calculators</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Calories & Macro Split',
                desc: 'Find exact calories and gram targets for protein, carbs, and fats.',
                path: '/tools/calories',
                badge: 'Nutrition',
              },
              {
                title: 'BMI Calculator',
                desc: 'Calculate Body Mass Index and examine official WHO categories.',
                path: '/tools/bmi',
                badge: 'Body Metric',
              },
              {
                title: 'BMR & TDEE Calculator',
                desc: 'Calculate basal metabolic rate and total daily energy expenditure.',
                path: '/tools/bmr-tdee',
                badge: 'Metabolism',
              },
              {
                title: 'Body Fat % (US Navy)',
                desc: 'Estimate body fat percentage using circumference measurements.',
                path: '/tools/body-fat',
                badge: 'Composition',
              },
              {
                title: 'One-Rep Max (1RM)',
                desc: 'Estimate maximum single-rep strength and percentage training loads.',
                path: '/tools/one-rep-max',
                badge: 'Strength',
              },
              {
                title: 'Interval Rest Timer',
                desc: 'Full-screen rest countdown timer with audio alerts between heavy sets.',
                path: '/tools/rest-timer',
                badge: 'Workout Utility',
              },
            ].map((tool) => (
              <Link
                key={tool.path}
                to={tool.path}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-400 block mb-1">
                    {tool.badge}
                  </span>
                  <h3 className="font-heading font-bold text-white text-base group-hover:text-emerald-400 transition-colors mb-1">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-300 group-hover:text-emerald-400">
                  <span>Calculate Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Exercise Technique Guides Preview */}
      <section className="py-16 sm:py-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Form & Safety Guides</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Master Exercise <span className="text-sky-400">Technique</span>
              </h2>
              <p className="text-neutral-400 text-sm mt-2 max-w-xl">
                Avoid injury and build muscle efficiently. Read setup cues and common mistakes for compound movements.
              </p>
            </div>

            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Explore All Exercises</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredExercises.map((ex) => (
              <div
                key={ex.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-sky-500/40 rounded-3xl p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md">
                      {ex.category}
                    </span>
                    <span className="text-xs text-neutral-400">{ex.difficulty}</span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {ex.name}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                    {ex.beginnerNotes || ex.instructions[0]}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-500">Target: {ex.primaryMuscles.join(', ')}</span>
                  <Link
                    to={`/exercises/${ex.id}`}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 inline-flex items-center gap-1"
                  >
                    <span>View Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Gym Facility Highlights & Location Preview */}
      <section className="py-16 sm:py-20 border-b border-neutral-900 bg-neutral-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The Dabra Iron Atmosphere</span>
              </div>

              <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
                Built for Lifters Who Want <span className="text-emerald-400">Real Results</span>
              </h2>

              <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                At Hulk&apos;s Work Zone, we prioritize what actually builds strength: heavy calibrated dumbbells up to 40+ kg, Olympic barbells, sturdy squat cages, and certified coaches who correct your form on the floor.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white block">Morning Shift</span>
                  <span className="text-emerald-400 font-semibold">5:30 AM – 10:30 AM</span>
                  <p className="text-neutral-400 text-[11px]">Spacious and energized start to your day.</p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1">
                  <span className="font-bold text-white block">Evening Shift</span>
                  <span className="text-emerald-400 font-semibold">4:30 PM – 10:00 PM</span>
                  <p className="text-neutral-400 text-[11px]">High-energy post-work & college sessions.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="py-3 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <MapPin className="w-4 h-4" />
                  <span>View Location & Directions</span>
                </Link>

                <Link
                  to="/membership"
                  className="py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 hover:text-white font-semibold text-xs transition-colors"
                >
                  <span>Membership Pricing</span>
                </Link>
              </div>
            </div>

            {/* Compact Google Reviews Trust Card */}
            <div className="lg:col-span-6 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800/80">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-heading font-black text-white text-xs sm:text-sm uppercase tracking-wider">
                    GOOGLE REVIEWS
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                  Verified Gym
                </span>
              </div>

              <div className="space-y-2">
                <blockquote className="font-heading text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  &quot;Trained at Hulk&apos;s Work Zone? Share your genuine experience.&quot;
                </blockquote>
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
                  Help fellow lifters and beginners in Dabra find an authentic, disciplined training ground with real weights and supportive guidance.
                </p>
                <div className="flex items-center gap-2 text-xs text-neutral-400 pt-1">
                  <span className="font-bold text-amber-400">4.8 / 5.0</span>
                  <span>•</span>
                  <span>120+ verified Google community reviews</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  type="button"
                  id="homepage-write-google-review-btn"
                  onClick={onOpenReviewModal}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-98"
                >
                  <Star className="w-4 h-4 fill-neutral-950" />
                  <span>Write a Google Review</span>
                </button>

                <button
                  type="button"
                  id="homepage-draft-assistant-btn"
                  onClick={onOpenReviewModal}
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-amber-500/30 text-amber-400 hover:text-amber-300 text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft Assistant ↓</span>
                </button>

                <a
                  href={GYM_INFO.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  <span>View Google Reviews</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              </div>

              <div className="pt-1 text-center sm:text-left">
                <Link
                  to="/reviews"
                  className="text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>About our Google review process →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner / Gym Enquiry */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ready to Start Training?</span>
            </div>

            <h2 className="font-heading text-2xl sm:text-4xl font-black uppercase text-white tracking-tight mb-4">
              Visit Hulk&apos;s Work Zone in <span className="text-emerald-400">Dabra, MP</span>
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
              Whether you want to inspect the gym equipment, discuss membership fees, or get customized advice from our coaching staff, we are here to support your goals.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenEnquiry('General Visitor Joining')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-black text-sm uppercase tracking-wide transition-all shadow-lg shadow-emerald-500/20 active:scale-98"
              >
                Submit Membership Enquiry
              </button>

              <a
                href={`tel:${GYM_INFO.phoneRaw}`}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-neutral-950 hover:bg-neutral-850 border border-neutral-800 text-white font-bold text-sm transition-colors"
              >
                Call {GYM_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
