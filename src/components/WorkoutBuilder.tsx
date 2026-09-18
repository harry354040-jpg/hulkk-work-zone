import React, { useState, useEffect } from 'react';
import { WorkoutExerciseItem, WorkoutPlan, ExerciseItem } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  Flame,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  RotateCcw,
  Check,
  Dumbbell,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';

interface WorkoutBuilderProps {
  incomingExercise?: ExerciseItem | null;
  onClearIncomingExercise?: () => void;
  onAskAi: (prompt: string) => void;
}

const STORAGE_KEY = 'hwz_saved_workout_plan';

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  incomingExercise,
  onClearIncomingExercise,
  onAskAi,
}) => {
  const [workoutTitle, setWorkoutTitle] = useState<string>('My Heavy Push Day');
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>([
    {
      exerciseId: 'barbell-bench-press',
      name: 'Barbell Bench Press',
      category: 'Chest',
      sets: 4,
      reps: 8,
      weightKg: 70,
      restSeconds: 90,
    },
    {
      exerciseId: 'incline-dumbbell-press',
      name: 'Incline Dumbbell Press',
      category: 'Chest',
      sets: 3,
      reps: 10,
      weightKg: 24,
      restSeconds: 75,
    },
    {
      exerciseId: 'overhead-barbell-press',
      name: 'Overhead Barbell Military Press',
      category: 'Shoulders',
      sets: 3,
      reps: 8,
      weightKg: 45,
      restSeconds: 90,
    },
    {
      exerciseId: 'triceps-rope-pushdown',
      name: 'Cable Triceps Rope Pushdown',
      category: 'Triceps',
      sets: 3,
      reps: 12,
      weightKg: 30,
      restSeconds: 60,
    },
  ]);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [selectedToAdd, setSelectedToAdd] = useState<string>('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: WorkoutPlan = JSON.parse(stored);
        if (parsed.exercises && Array.isArray(parsed.exercises)) {
          setWorkoutTitle(parsed.title || 'Saved Workout');
          setExercises(parsed.exercises);
        }
      }
    } catch (e) {
      console.error('Error loading workout from localStorage:', e);
    }
  }, []);

  // Handle incoming exercise from library
  useEffect(() => {
    if (incomingExercise) {
      handleAddExercise(incomingExercise);
      if (onClearIncomingExercise) {
        onClearIncomingExercise();
      }
    }
  }, [incomingExercise]);

  const handleAddExercise = (exItem: ExerciseItem) => {
    const newItem: WorkoutExerciseItem = {
      exerciseId: exItem.id,
      name: exItem.name,
      category: exItem.category,
      sets: 3,
      reps: 10,
      weightKg: 40,
      restSeconds: 75,
    };
    setExercises((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof WorkoutExerciseItem, value: any) => {
    setExercises((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleRemove = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === exercises.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    setExercises((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  const handleSaveToLocal = () => {
    try {
      const plan: WorkoutPlan = {
        id: `plan_${Date.now()}`,
        title: workoutTitle,
        exercises,
        totalVolume: totalVolumeKg,
        updatedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Save failed:', e);
    }
  };

  const handleResetToSample = () => {
    setWorkoutTitle('Full Body Strength Routine');
    setExercises([
      {
        exerciseId: 'barbell-back-squat',
        name: 'Barbell Back Squat',
        category: 'Legs',
        sets: 4,
        reps: 6,
        weightKg: 80,
        restSeconds: 120,
      },
      {
        exerciseId: 'barbell-bench-press',
        name: 'Barbell Bench Press',
        category: 'Chest',
        sets: 4,
        reps: 8,
        weightKg: 70,
        restSeconds: 90,
      },
      {
        exerciseId: 'lat-pulldown',
        name: 'Wide-Grip Lat Pulldown',
        category: 'Back',
        sets: 3,
        reps: 10,
        weightKg: 55,
        restSeconds: 75,
      },
      {
        exerciseId: 'overhead-barbell-press',
        name: 'Overhead Barbell Military Press',
        category: 'Shoulders',
        sets: 3,
        reps: 8,
        weightKg: 40,
        restSeconds: 90,
      },
    ]);
  };

  // Summary stats
  const totalSets = exercises.reduce((acc, curr) => acc + (Number(curr.sets) || 0), 0);
  const totalVolumeKg = exercises.reduce(
    (acc, curr) => acc + (Number(curr.sets) || 0) * (Number(curr.reps) || 0) * (Number(curr.weightKg) || 0),
    0
  );

  return (
    <section id="workout-builder" className="py-16 sm:py-24 bg-neutral-900/30 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive Routine Designer</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Workout <span className="text-emerald-400">Builder</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Construct your daily gym routine, assign sets, reps, weight loads, and rest durations. Calculates total session volume in real-time.
          </p>
        </div>

        {/* Builder Container */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
          {/* Top Bar: Title & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
            <div className="flex-1 w-full sm:w-auto">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Routine Title
              </label>
              <input
                type="text"
                value={workoutTitle}
                onChange={(e) => setWorkoutTitle(e.target.value)}
                className="w-full sm:max-w-md bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-white font-heading font-bold text-lg sm:text-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={handleResetToSample}
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
                title="Reset to Full Body template"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>

              <button
                type="button"
                onClick={handleSaveToLocal}
                className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold transition-all shadow-md ${
                  savedSuccess
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
                }`}
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Saved to Device</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Routine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Routine Summary Metric Pills */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-neutral-900/70 border border-neutral-800/80 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase">Exercises</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-white mt-0.5 block">
                {exercises.length}
              </span>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase">Total Sets</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-emerald-400 mt-0.5 block">
                {totalSets}
              </span>
            </div>

            <div className="bg-neutral-900/70 border border-neutral-800/80 p-3 rounded-2xl text-center">
              <span className="text-[11px] font-bold text-neutral-400 block uppercase">Total Volume</span>
              <span className="font-heading text-xl sm:text-2xl font-black text-lime-400 mt-0.5 block">
                {totalVolumeKg.toLocaleString()} kg
              </span>
            </div>
          </div>

          {/* Exercise List */}
          <div className="space-y-3 mb-6">
            {exercises.map((item, idx) => {
              const itemVolume = (item.sets || 0) * (item.reps || 0) * (item.weightKg || 0);
              return (
                <div
                  key={idx}
                  className="bg-neutral-900 border border-neutral-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  {/* Left: Reorder & Name */}
                  <div className="flex items-center gap-3 w-full md:w-1/3">
                    {/* Move controls */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move exercise up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === exercises.length - 1}
                        className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Move exercise down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-400">#{idx + 1}</span>
                        <span className="px-2 py-0.5 rounded bg-neutral-800 text-emerald-400 text-[10px] font-bold uppercase">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-white text-sm sm:text-base mt-0.5">
                        {item.name}
                      </h4>
                      <span className="text-[11px] text-neutral-400 font-mono">
                        Vol: {itemVolume} kg
                      </span>
                    </div>
                  </div>

                  {/* Middle: Set/Rep/Weight/Rest Inputs */}
                  <div className="grid grid-cols-4 gap-2 w-full md:w-auto flex-1">
                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Sets
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={item.sets}
                        onChange={(e) => handleUpdateItem(idx, 'sets', Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2 text-center text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Reps
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={item.reps}
                        onChange={(e) => handleUpdateItem(idx, 'reps', Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2 text-center text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="500"
                        value={item.weightKg}
                        onChange={(e) => handleUpdateItem(idx, 'weightKg', Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2 text-center text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-400 uppercase mb-1">
                        Rest (sec)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="300"
                        step="15"
                        value={item.restSeconds}
                        onChange={(e) => handleUpdateItem(idx, 'restSeconds', Number(e.target.value) || 0)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg py-1.5 px-2 text-center text-sm font-bold text-neutral-300 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Right: Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    aria-label={`Remove ${item.name}`}
                    className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors shrink-0 self-end md:self-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Exercise Dropdown Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-neutral-800">
            <select
              value={selectedToAdd}
              onChange={(e) => setSelectedToAdd(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-neutral-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select an exercise from the library...</option>
              {EXERCISES_DATA.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({ex.category})
                </option>
              ))}
            </select>

            <button
              type="button"
              disabled={!selectedToAdd}
              onClick={() => {
                const target = EXERCISES_DATA.find((e) => e.id === selectedToAdd);
                if (target) {
                  handleAddExercise(target);
                  setSelectedToAdd('');
                }
              }}
              className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:bg-emerald-400 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exercise</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const summary = exercises.map((e) => `${e.name} (${e.sets}x${e.reps} @ ${e.weightKg}kg)`).join(', ');
                onAskAi(
                  `Mera custom workout plan: "${workoutTitle}"\nExercises: ${summary}\nTotal Volume: ${totalVolumeKg} kg, Total Sets: ${totalSets}.\nIs workout split ko review karo: Kya yeh hypertrophy aur recovery ke hisaab se balanced hai?`
                );
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-200 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Coach to Review Routine</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
