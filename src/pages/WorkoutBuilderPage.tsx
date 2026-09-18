import React from 'react';
import { Link } from 'react-router-dom';
import { WorkoutBuilder } from '../components/WorkoutBuilder';
import { ExerciseItem } from '../types';
import {
  ChevronRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Dumbbell,
  ShieldCheck,
} from 'lucide-react';

interface WorkoutBuilderPageProps {
  incomingExercise?: ExerciseItem | null;
  onClearIncomingExercise?: () => void;
  onAskAi?: (prompt: string) => void;
}

export const WorkoutBuilderPage: React.FC<WorkoutBuilderPageProps> = ({
  incomingExercise,
  onClearIncomingExercise,
  onAskAi,
}) => {
  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Workout Builder</span>
        </nav>

        {/* Header & Rest Timer CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Personalized Routine Generator</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
              Workout <span className="text-emerald-400">Builder</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Generate a science-backed weekly workout split tailored to your goal and schedule, or build your own custom day-by-day training routine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/tools/rest-timer"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 hover:text-white transition-colors"
            >
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Open Rest Timer</span>
            </Link>

            <Link
              to="/exercises"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-neutral-200 hover:text-white transition-colors"
            >
              <Dumbbell className="w-4 h-4 text-emerald-400" />
              <span>Browse Exercises</span>
            </Link>
          </div>
        </div>

        {/* Main Workout Builder Component */}
        <WorkoutBuilder
          incomingExercise={incomingExercise}
          onClearIncomingExercise={onClearIncomingExercise}
          onAskAi={onAskAi}
        />
      </div>
    </div>
  );
};
