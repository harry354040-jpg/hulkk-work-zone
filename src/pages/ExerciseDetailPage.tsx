import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  ChevronRight,
  ArrowLeft,
  Dumbbell,
  CheckCircle,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Plus,
  Check,
  RotateCcw,
} from 'lucide-react';

interface ExerciseDetailPageProps {
  onAskAi?: (prompt: string) => void;
}

export const ExerciseDetailPage: React.FC<ExerciseDetailPageProps> = ({ onAskAi }) => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const exercise = EXERCISES_DATA.find((ex) => ex.id === exerciseId);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-neutral-950 pt-28 pb-16 text-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-3xl">
          <Dumbbell className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
          <h2 className="font-heading text-xl font-bold text-white mb-2">Exercise Not Found</h2>
          <p className="text-xs text-neutral-400 mb-6">
            The exercise you requested could not be located in our library.
          </p>
          <Link
            to="/exercises"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-400 text-neutral-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Exercise Library</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToWorkout = () => {
    try {
      const saved = localStorage.getItem('hwz_custom_workout');
      let currentWorkout = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(currentWorkout)) currentWorkout = [];

      currentWorkout.push({
        id: `${exercise.id}-${Date.now()}`,
        name: exercise.name,
        category: exercise.category,
        sets: 3,
        reps: '8-12',
        weight: '',
        restSec: 90,
        targetMuscles: exercise.primaryMuscles.join(', '),
      });

      localStorage.setItem('hwz_custom_workout', JSON.stringify(currentWorkout));
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2500);
    } catch (err) {
      console.warn('Failed to save exercise to workout:', err);
    }
  };

  const handleAskCoach = () => {
    const prompt = `Sir, could you guide me on the most important form cues, setup steps, and elbow/joint angles for ${exercise.name}?`;
    if (onAskAi) {
      onAskAi(prompt);
    }
    navigate('/ai-coach', { state: { initialPrompt: prompt } });
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link to="/exercises" className="hover:text-white transition-colors">Exercise Library</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">{exercise.name}</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/exercises"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Exercise Library</span>
        </Link>

        {/* Header Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg">
              {exercise.category}
            </span>
            <span className="text-xs font-semibold text-neutral-300 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
              {exercise.equipment}
            </span>
            <span className="text-xs font-semibold text-neutral-300 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
              {exercise.difficulty} Level
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-4">
            {exercise.name}
          </h1>

          {/* Muscle Tagging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800 text-xs">
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="text-neutral-500 font-bold uppercase block mb-1">Primary Muscle Target</span>
              <span className="font-bold text-emerald-400 text-sm">{exercise.primaryMuscles.join(', ')}</span>
            </div>

            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 font-bold uppercase block mb-1">Secondary Stabilizers</span>
                <span className="font-semibold text-neutral-300 text-sm">{exercise.secondaryMuscles.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-6 mt-6 border-t border-neutral-800 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAddToWorkout}
              className={`inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-98 ${
                isAdded
                  ? 'bg-emerald-500 text-neutral-950'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Workout Plan!</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to Workout Plan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAskCoach}
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Coach About Technique</span>
            </button>

            <Link
              to="/workout-builder"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold border border-neutral-800 transition-colors"
            >
              <span>View Current Routine</span>
            </Link>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-lg mb-8 space-y-4">
          <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <span>How to Perform (Step-by-Step)</span>
          </h2>

          <ol className="space-y-3 pt-2 text-xs sm:text-sm text-neutral-300">
            {exercise.instructions.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                <span className="w-6 h-6 rounded-full bg-neutral-800 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Common Mistakes & Safety Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Common Mistakes */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 text-amber-400">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Common Form Mistakes</span>
            </h3>
            <ul className="space-y-2 pt-2 text-xs text-neutral-300">
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
                  <span className="text-amber-400 font-bold">•</span>
                  <span className="leading-relaxed">{mistake}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety & Beginner Tips */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-7 space-y-3">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2 text-rose-400">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>Safety & Beginner Notes</span>
            </h3>
            <div className="space-y-3 pt-2 text-xs text-neutral-300">
              {exercise.beginnerNotes && (
                <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                  <span className="font-bold text-emerald-400 block mb-1">Beginner Tip</span>
                  <p className="leading-relaxed text-neutral-300">{exercise.beginnerNotes}</p>
                </div>
              )}
              {exercise.safetyNotes && (
                <div className="bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800">
                  <span className="font-bold text-rose-400 block mb-1">Safety Warning</span>
                  <p className="leading-relaxed text-neutral-300">{exercise.safetyNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Alternative Exercises */}
        {exercise.alternatives && exercise.alternatives.length > 0 && (
          <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-emerald-400" />
              <span>Alternative Exercises for {exercise.name}</span>
            </h3>
            <p className="text-xs text-neutral-400">
              If equipment is occupied or you need a progression, try these alternatives:
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {exercise.alternatives.map((alt) => (
                <span
                  key={alt}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-200"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
