import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressTracker } from '../components/ProgressTracker';
import {
  TrendingUp,
  ChevronRight,
  Info,
  Dumbbell,
  ArrowRight,
  Scale,
  Sparkles,
} from 'lucide-react';

export const ProgressPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Progress Tracker</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Track Lifts & Bodyweight</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
              Progress <span className="text-emerald-400">Tracker</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Log your bodyweight and key gym lifts over time. What gets measured gets managed.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tools/one-rep-max"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 hover:text-white transition-colors"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>1RM Calculator</span>
            </Link>

            <Link
              to="/tools/bmi"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 hover:text-white transition-colors"
            >
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>BMI Calculator</span>
            </Link>
          </div>
        </div>

        {/* PR Definition Box */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 flex items-start gap-3">
          <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-neutral-300">
            <strong className="text-white font-semibold">What is a "PR"?</strong>{' '}
            In strength training, <strong>PR stands for Personal Record</strong>—the maximum weight you have successfully lifted for a given exercise. Tracking your PRs across Bench Press, Squat, and Deadlift ensures you are consistently applying <em>progressive overload</em> to build real muscle and strength.
          </div>
        </div>

        {/* Progress Tracker Core Component */}
        <ProgressTracker />
      </div>
    </div>
  );
};
