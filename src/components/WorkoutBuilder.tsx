import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExerciseItem, WorkoutDay, WorkoutExerciseItem, WorkoutPlan } from '../types';
import { EXERCISES_DATA } from '../data/exercisesData';
import {
  Flame,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Save,
  Check,
  Dumbbell,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  Copy,
  Edit2,
  Sliders,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'hwz_saved_workout_plan';
const SAVED_LIST_KEY = 'hwz_all_saved_plans';

interface WorkoutBuilderProps {
  initialExercise?: ExerciseItem | null;
  incomingExercise?: ExerciseItem | null;
  onClearInitialExercise?: () => void;
  onClearIncomingExercise?: () => void;
  onAskAi?: (prompt: string) => void;
}

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  initialExercise,
  incomingExercise,
  onClearInitialExercise,
  onClearIncomingExercise,
  onAskAi,
}) => {
  const activeIncoming = initialExercise || incomingExercise;
  const clearIncoming = onClearInitialExercise || onClearIncomingExercise;
  // Wizard Generation Form State
  const [goal, setGoal] = useState<'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness'>('muscle_gain');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(3);
  const [equipment, setEquipment] = useState<string>('Full Gym');

  // Active Plan State
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [renameValue, setRenameValue] = useState<string>('');
  const [showAddExerciseModal, setShowAddExerciseModal] = useState<boolean>(false);
  const [selectedExerciseToAdd, setSelectedExerciseToAdd] = useState<string>('');

  // 1. Load persisted plan from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: WorkoutPlan = JSON.parse(stored);
        if (parsed && parsed.days && parsed.days.length > 0) {
          setActivePlan(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Failed to parse stored workout plan:', e);
    }

    // Default template if no stored plan
    generateDefaultWorkout('muscle_gain', 'beginner', 3, 'Full Gym');
  }, []);

  // 2. Handle external exercise passed from Exercise Library
  useEffect(() => {
    if (activeIncoming && activePlan) {
      const targetDayIdx = activeDayIndex < activePlan.days.length ? activeDayIndex : 0;
      const newItem: WorkoutExerciseItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        exerciseId: activeIncoming.id,
        name: activeIncoming.name,
        category: activeIncoming.category,
        sets: 3,
        reps: 10,
        weightKg: 20,
        restSeconds: 90,
        notes: activeIncoming.beginnerNotes || 'Focus on smooth controlled tempo.',
      };

      const updatedDays = [...activePlan.days];
      updatedDays[targetDayIdx] = {
        ...updatedDays[targetDayIdx],
        exercises: [...updatedDays[targetDayIdx].exercises, newItem],
      };

      const updatedPlan = {
        ...activePlan,
        days: updatedDays,
        updatedAt: Date.now(),
      };

      setActivePlan(updatedPlan);
      persistPlan(updatedPlan);
      setSaveMessage(`Added ${activeIncoming.name} to ${updatedDays[targetDayIdx].dayName}!`);
      setTimeout(() => setSaveMessage(null), 3000);

      if (clearIncoming) {
        clearIncoming();
      }
    }
  }, [activeIncoming]);

  const persistPlan = (plan: WorkoutPlan) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
    } catch (e) {
      console.error('Failed to persist workout plan:', e);
    }
  };

  // Helper generator function
  const generateDefaultWorkout = (
    selGoal: 'muscle_gain' | 'fat_loss' | 'strength' | 'general_fitness',
    selExp: 'beginner' | 'intermediate' | 'advanced',
    selDays: number,
    selEquip: string
  ) => {
    let days: WorkoutDay[] = [];

    // Filter exercises based on selected equipment
    const isBodyweightOnly = selEquip === 'Bodyweight';
    const isDumbbellsOnly = selEquip === 'Dumbbells Only';

    const getMatchingExercise = (category: string, preferredId?: string) => {
      let pool = EXERCISES_DATA.filter((e) => e.category === category || category === 'Any');
      if (isBodyweightOnly) {
        pool = pool.filter((e) => e.equipment === 'Bodyweight');
      } else if (isDumbbellsOnly) {
        pool = pool.filter((e) => e.equipment === 'Dumbbell' || e.equipment === 'Bodyweight');
      }

      if (pool.length === 0) {
        pool = EXERCISES_DATA;
      }

      const match = preferredId ? pool.find((e) => e.id === preferredId) : null;
      const chosen = match || pool[0] || EXERCISES_DATA[0];

      return {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        exerciseId: chosen.id,
        name: chosen.name,
        category: chosen.category,
        sets: selGoal === 'strength' ? 4 : 3,
        reps: selGoal === 'strength' ? 5 : selGoal === 'muscle_gain' ? 10 : 12,
        weightKg: selExp === 'beginner' ? 20 : selExp === 'intermediate' ? 45 : 70,
        restSeconds: selGoal === 'strength' ? 120 : 90,
        notes: chosen.beginnerNotes || 'Maintain steady breathing and core bracing.',
      };
    };

    if (selDays === 2) {
      // 2-day Full Body Split
      days = [
        {
          id: 'day-1',
          dayName: 'Day 1: Full Body Workout A',
          focus: 'Compound Squat & Push Focus',
          exercises: [
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Chest', 'barbell-bench-press'),
            getMatchingExercise('Back', 'lat-pulldown'),
            getMatchingExercise('Core', 'plank'),
          ],
        },
        {
          id: 'day-2',
          dayName: 'Day 2: Full Body Workout B',
          focus: 'Hinge & Pull Focus',
          exercises: [
            getMatchingExercise('Legs', 'romanian-deadlift'),
            getMatchingExercise('Back', 'bent-over-barbell-row'),
            getMatchingExercise('Shoulders', 'overhead-barbell-press'),
            getMatchingExercise('Biceps', 'barbell-bicep-curl'),
          ],
        },
      ];
    } else if (selDays === 3) {
      // 3-day Push / Pull / Legs or Full Body
      days = [
        {
          id: 'day-1',
          dayName: 'Day 1: Push (Chest, Shoulders, Triceps)',
          focus: 'Pressing strength & upper body anterior chain',
          exercises: [
            getMatchingExercise('Chest', 'barbell-bench-press'),
            getMatchingExercise('Chest', 'incline-dumbbell-press'),
            getMatchingExercise('Shoulders', 'overhead-barbell-press'),
            getMatchingExercise('Triceps', 'triceps-rope-pushdown'),
          ],
        },
        {
          id: 'day-2',
          dayName: 'Day 2: Pull (Back, Biceps, Rear Delts)',
          focus: 'Posterior chain, upper back width & arm hypertrophy',
          exercises: [
            getMatchingExercise('Back', 'lat-pulldown'),
            getMatchingExercise('Back', 'bent-over-barbell-row'),
            getMatchingExercise('Shoulders', 'face-pulls'),
            getMatchingExercise('Biceps', 'barbell-bicep-curl'),
          ],
        },
        {
          id: 'day-3',
          dayName: 'Day 3: Legs & Core',
          focus: 'Quadriceps, hamstrings, glutes and core bracing',
          exercises: [
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Legs', 'romanian-deadlift'),
            getMatchingExercise('Glutes', 'glute-hip-thrust'),
            getMatchingExercise('Core', 'hanging-leg-raise'),
          ],
        },
      ];
    } else if (selDays === 4) {
      // 4-day Upper / Lower
      days = [
        {
          id: 'day-1',
          dayName: 'Day 1: Upper Body Strength',
          focus: 'Heavy compound chest and back development',
          exercises: [
            getMatchingExercise('Chest', 'barbell-bench-press'),
            getMatchingExercise('Back', 'bent-over-barbell-row'),
            getMatchingExercise('Shoulders', 'overhead-barbell-press'),
            getMatchingExercise('Triceps', 'triceps-rope-pushdown'),
          ],
        },
        {
          id: 'day-2',
          dayName: 'Day 2: Lower Body Strength',
          focus: 'Quad and hamstring progressive overload',
          exercises: [
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Legs', 'romanian-deadlift'),
            getMatchingExercise('Legs', 'leg-press'),
            getMatchingExercise('Core', 'plank'),
          ],
        },
        {
          id: 'day-3',
          dayName: 'Day 3: Upper Body Hypertrophy',
          focus: 'High volume muscle growth and isolation',
          exercises: [
            getMatchingExercise('Chest', 'incline-dumbbell-press'),
            getMatchingExercise('Back', 'lat-pulldown'),
            getMatchingExercise('Shoulders', 'dumbbell-lateral-raise'),
            getMatchingExercise('Biceps', 'incline-dumbbell-curl'),
          ],
        },
        {
          id: 'day-4',
          dayName: 'Day 4: Lower Body & Posterior Chain',
          focus: 'Glutes, hamstrings and athletic core stability',
          exercises: [
            getMatchingExercise('Full Body', 'barbell-deadlift'),
            getMatchingExercise('Glutes', 'glute-hip-thrust'),
            getMatchingExercise('Legs', 'leg-press'),
            getMatchingExercise('Core', 'hanging-leg-raise'),
          ],
        },
      ];
    } else if (selDays === 5) {
      // 5-day Upper / Lower / PPL Hybrid
      days = [
        {
          id: 'day-1',
          dayName: 'Day 1: Chest & Triceps',
          focus: 'Pectoral dominance and tricep extension',
          exercises: [
            getMatchingExercise('Chest', 'barbell-bench-press'),
            getMatchingExercise('Chest', 'incline-dumbbell-press'),
            getMatchingExercise('Chest', 'cable-chest-fly'),
            getMatchingExercise('Triceps', 'triceps-rope-pushdown'),
          ],
        },
        {
          id: 'day-2',
          dayName: 'Day 2: Back & Biceps',
          focus: 'Lat width, mid-back density and arm flexion',
          exercises: [
            getMatchingExercise('Back', 'lat-pulldown'),
            getMatchingExercise('Back', 'bent-over-barbell-row'),
            getMatchingExercise('Back', 'seated-cable-row'),
            getMatchingExercise('Biceps', 'barbell-bicep-curl'),
          ],
        },
        {
          id: 'day-3',
          dayName: 'Day 3: Legs & Abs',
          focus: 'Squats, knee flexion and abdominal endurance',
          exercises: [
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Legs', 'leg-press'),
            getMatchingExercise('Legs', 'romanian-deadlift'),
            getMatchingExercise('Core', 'hanging-leg-raise'),
          ],
        },
        {
          id: 'day-4',
          dayName: 'Day 4: Shoulders & Upper Chest',
          focus: 'Deltoid width, overhead press and collarbone fullness',
          exercises: [
            getMatchingExercise('Shoulders', 'overhead-barbell-press'),
            getMatchingExercise('Shoulders', 'dumbbell-lateral-raise'),
            getMatchingExercise('Shoulders', 'face-pulls'),
            getMatchingExercise('Chest', 'incline-dumbbell-press'),
          ],
        },
        {
          id: 'day-5',
          dayName: 'Day 5: Posterior Chain & Arms',
          focus: 'Deadlifts, glutes and arm pumps',
          exercises: [
            getMatchingExercise('Full Body', 'barbell-deadlift'),
            getMatchingExercise('Glutes', 'glute-hip-thrust'),
            getMatchingExercise('Biceps', 'incline-dumbbell-curl'),
            getMatchingExercise('Triceps', 'overhead-dumbbell-triceps-extension'),
          ],
        },
      ];
    } else {
      // 6-day Push / Pull / Legs x 2
      days = [
        {
          id: 'day-1',
          dayName: 'Day 1: Push A (Chest & Triceps)',
          focus: 'Heavy barbell press & overhead extensions',
          exercises: [
            getMatchingExercise('Chest', 'barbell-bench-press'),
            getMatchingExercise('Chest', 'incline-dumbbell-press'),
            getMatchingExercise('Shoulders', 'dumbbell-lateral-raise'),
            getMatchingExercise('Triceps', 'triceps-rope-pushdown'),
          ],
        },
        {
          id: 'day-2',
          dayName: 'Day 2: Pull A (Back & Biceps)',
          focus: 'Vertical pulling & heavy rows',
          exercises: [
            getMatchingExercise('Back', 'lat-pulldown'),
            getMatchingExercise('Back', 'bent-over-barbell-row'),
            getMatchingExercise('Shoulders', 'face-pulls'),
            getMatchingExercise('Biceps', 'barbell-bicep-curl'),
          ],
        },
        {
          id: 'day-3',
          dayName: 'Day 3: Legs A (Quad Focus)',
          focus: 'Barbell back squats & leg press',
          exercises: [
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Legs', 'leg-press'),
            getMatchingExercise('Core', 'hanging-leg-raise'),
            getMatchingExercise('Core', 'plank'),
          ],
        },
        {
          id: 'day-4',
          dayName: 'Day 4: Push B (Shoulders & Chest)',
          focus: 'Overhead strength & chest flyes',
          exercises: [
            getMatchingExercise('Shoulders', 'overhead-barbell-press'),
            getMatchingExercise('Chest', 'cable-chest-fly'),
            getMatchingExercise('Shoulders', 'dumbbell-lateral-raise'),
            getMatchingExercise('Triceps', 'overhead-dumbbell-triceps-extension'),
          ],
        },
        {
          id: 'day-5',
          dayName: 'Day 5: Pull B (Deadlift & Thickness)',
          focus: 'Conventional deadlifts & seated rows',
          exercises: [
            getMatchingExercise('Full Body', 'barbell-deadlift'),
            getMatchingExercise('Back', 'seated-cable-row'),
            getMatchingExercise('Biceps', 'incline-dumbbell-curl'),
            getMatchingExercise('Back', 'pull-ups'),
          ],
        },
        {
          id: 'day-6',
          dayName: 'Day 6: Legs B (Hamstrings & Glutes)',
          focus: 'Romanian deadlifts & hip thrusts',
          exercises: [
            getMatchingExercise('Legs', 'romanian-deadlift'),
            getMatchingExercise('Glutes', 'glute-hip-thrust'),
            getMatchingExercise('Legs', 'barbell-back-squat'),
            getMatchingExercise('Core', 'hanging-leg-raise'),
          ],
        },
      ];
    }

    const titleGoalMap = {
      muscle_gain: 'Hypertrophy Muscle Builder',
      strength: 'Heavy Strength Routine',
      fat_loss: 'Conditioning & Fat Loss Routine',
      general_fitness: 'Athletic Wellness Routine',
    };

    const newPlan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      title: `${titleGoalMap[selGoal]} (${selDays} Days/Wk)`,
      goal: selGoal,
      experienceLevel: selExp,
      daysPerWeek: selDays,
      equipment: selEquip,
      days,
      updatedAt: Date.now(),
    };

    setActivePlan(newPlan);
    setActiveDayIndex(0);
    persistPlan(newPlan);
  };

  const handleGenerateWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    generateDefaultWorkout(goal, experienceLevel, daysPerWeek, equipment);
    setSaveMessage('New workout generated successfully!');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  // Workout item editing handlers (STABLE IDs)
  const handleUpdateItem = (
    dayIdx: number,
    itemId: string,
    field: keyof WorkoutExerciseItem,
    val: any
  ) => {
    if (!activePlan) return;
    const updatedDays = [...activePlan.days];
    const day = updatedDays[dayIdx];
    if (!day) return;

    day.exercises = day.exercises.map((item) => {
      if (item.id === itemId) {
        return { ...item, [field]: val };
      }
      return item;
    });

    const updatedPlan = { ...activePlan, days: updatedDays, updatedAt: Date.now() };
    setActivePlan(updatedPlan);
    persistPlan(updatedPlan);
  };

  const handleRemoveItem = (dayIdx: number, itemId: string) => {
    if (!activePlan) return;
    const updatedDays = [...activePlan.days];
    const day = updatedDays[dayIdx];
    if (!day) return;

    day.exercises = day.exercises.filter((item) => item.id !== itemId);
    const updatedPlan = { ...activePlan, days: updatedDays, updatedAt: Date.now() };
    setActivePlan(updatedPlan);
    persistPlan(updatedPlan);
  };

  const handleMoveItem = (dayIdx: number, itemIdx: number, direction: 'up' | 'down') => {
    if (!activePlan) return;
    const updatedDays = [...activePlan.days];
    const day = updatedDays[dayIdx];
    if (!day) return;

    const targetIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
    if (targetIdx < 0 || targetIdx >= day.exercises.length) return;

    const list = [...day.exercises];
    const temp = list[itemIdx];
    list[itemIdx] = list[targetIdx];
    list[targetIdx] = temp;

    day.exercises = list;
    const updatedPlan = { ...activePlan, days: updatedDays, updatedAt: Date.now() };
    setActivePlan(updatedPlan);
    persistPlan(updatedPlan);
  };

  const handleAddExerciseToCurrentDay = () => {
    if (!activePlan || !selectedExerciseToAdd) return;
    const found = EXERCISES_DATA.find((e) => e.id === selectedExerciseToAdd);
    if (!found) return;

    const dayIdx = activeDayIndex < activePlan.days.length ? activeDayIndex : 0;
    const newItem: WorkoutExerciseItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exerciseId: found.id,
      name: found.name,
      category: found.category,
      sets: 3,
      reps: 10,
      weightKg: 20,
      restSeconds: 90,
      notes: found.beginnerNotes || 'Controlled eccentric tempo.',
    };

    const updatedDays = [...activePlan.days];
    updatedDays[dayIdx].exercises.push(newItem);

    const updatedPlan = { ...activePlan, days: updatedDays, updatedAt: Date.now() };
    setActivePlan(updatedPlan);
    persistPlan(updatedPlan);
    setShowAddExerciseModal(false);
    setSelectedExerciseToAdd('');
  };

  // Plan actions
  const handleSaveExplicitly = () => {
    if (!activePlan) return;
    persistPlan(activePlan);
    setSaveMessage('Workout saved safely in browser storage!');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleDuplicatePlan = () => {
    if (!activePlan) return;
    const dup: WorkoutPlan = {
      ...activePlan,
      id: `plan-${Date.now()}`,
      title: `${activePlan.title} (Copy)`,
      updatedAt: Date.now(),
    };
    setActivePlan(dup);
    persistPlan(dup);
    setSaveMessage('Workout duplicated!');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleResetToDefault = () => {
    generateDefaultWorkout(goal, experienceLevel, daysPerWeek, equipment);
    setSaveMessage('Workout reset to default schedule.');
    setTimeout(() => setSaveMessage(null), 2500);
  };

  const handleStartRename = () => {
    if (!activePlan) return;
    setRenameValue(activePlan.title);
    setIsRenaming(true);
  };

  const handleFinishRename = () => {
    if (!activePlan) return;
    const updatedPlan = {
      ...activePlan,
      title: renameValue.trim() || activePlan.title,
      updatedAt: Date.now(),
    };
    setActivePlan(updatedPlan);
    persistPlan(updatedPlan);
    setIsRenaming(false);
  };

  const currentDay = activePlan && activePlan.days[activeDayIndex] ? activePlan.days[activeDayIndex] : activePlan?.days[0];

  // Calculate day metrics
  const currentDaySets = currentDay ? currentDay.exercises.reduce((acc, curr) => acc + (Number(curr.sets) || 0), 0) : 0;
  const currentDayVolume = currentDay
    ? currentDay.exercises.reduce(
        (acc, curr) => acc + (Number(curr.sets) || 0) * (Number(curr.reps) || 0) * (Number(curr.weightKg) || 0),
        0
      )
    : 0;

  return (
    <section id="workout-builder" className="py-16 sm:py-24 bg-neutral-900/30 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Structured Workout Planner</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Workout <span className="text-emerald-400">Planner</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Create, customize, and edit your multi-day training schedule. Tailored to your fitness goal, experience level, and available gym equipment with stable auto-saving.
          </p>
        </div>

        {/* Wizard Generator Box */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-7 shadow-xl mb-8">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Step-by-Step Workout Generator
            </span>
          </div>

          <form onSubmit={handleGenerateWorkout} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: Goal */}
            <div>
              <label htmlFor="workout-goal-select" className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">
                Step 1: Choose Goal
              </label>
              <select
                id="workout-goal-select"
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                <option value="strength">Strength (Heavy Iron)</option>
                <option value="fat_loss">Fat Loss & Conditioning</option>
                <option value="general_fitness">General Fitness & Health</option>
              </select>
            </div>

            {/* Step 2: Experience */}
            <div>
              <label htmlFor="workout-exp-select" className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">
                Step 2: Experience Level
              </label>
              <select
                id="workout-exp-select"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="beginner">Beginner (Under 1 year)</option>
                <option value="intermediate">Intermediate (1–3 years)</option>
                <option value="advanced">Advanced (3+ years)</option>
              </select>
            </div>

            {/* Step 3: Days per week */}
            <div>
              <label htmlFor="workout-days-select" className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">
                Step 3: Days per Week
              </label>
              <select
                id="workout-days-select"
                value={daysPerWeek}
                onChange={(e) => setDaysPerWeek(Number(e.target.value))}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={2}>2 Days (Full Body Split)</option>
                <option value={3}>3 Days (Push / Pull / Legs)</option>
                <option value={4}>4 Days (Upper / Lower Split)</option>
                <option value={5}>5 Days (PPL + Upper/Lower)</option>
                <option value={6}>6 Days (Push / Pull / Legs x 2)</option>
              </select>
            </div>

            {/* Step 4: Equipment */}
            <div>
              <label htmlFor="workout-equipment-select" className="block text-xs font-bold text-neutral-400 uppercase mb-1.5">
                Step 4: Equipment
              </label>
              <select
                id="workout-equipment-select"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Full Gym">Full Gym Equipment</option>
                <option value="Barbell & Dumbbells">Barbells & Dumbbells</option>
                <option value="Dumbbells Only">Dumbbells Only</option>
                <option value="Bodyweight">Bodyweight Only</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex items-center justify-between pt-3 border-t border-neutral-900 gap-3">
              <span className="text-xs text-neutral-400">
                Creates structured sets, reps, and exercise selection matched to your equipment.
              </span>
              <button
                type="submit"
                id="generate-workout-btn"
                className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Workout</span>
              </button>
            </div>
          </form>
        </div>

        {/* Feedback Alert */}
        {saveMessage && (
          <div className="mb-6 p-3 bg-emerald-950/70 border border-emerald-800 rounded-2xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {/* Active Plan Viewer & Editor */}
        {activePlan && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-5 sm:p-8 shadow-2xl">
            {/* Header: Title & Management Actions */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-800">
              <div className="flex-1 w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                    {activePlan.goal.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-neutral-400">
                    • {activePlan.experienceLevel} • {activePlan.daysPerWeek} Days/Week • {activePlan.equipment}
                  </span>
                </div>

                {isRenaming ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 text-white font-heading font-bold text-lg focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handleFinishRename}
                      className="py-1.5 px-3 rounded-lg text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
                      {activePlan.title}
                    </h3>
                    <button
                      type="button"
                      onClick={handleStartRename}
                      className="p-1 rounded text-neutral-500 hover:text-neutral-300 transition-colors"
                      title="Rename Workout"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons: Save, Duplicate, Reset */}
              <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto justify-end">
                <button
                  type="button"
                  onClick={handleDuplicatePlan}
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
                  title="Duplicate current workout"
                >
                  <Copy className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Duplicate</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 transition-colors"
                  title="Reset to default routine"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveExplicitly}
                  className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Plan</span>
                </button>
              </div>
            </div>

            {/* Days Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-neutral-800/80 scrollbar-none">
              {activePlan.days.map((day, idx) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setActiveDayIndex(idx)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    activeDayIndex === idx
                      ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-white border border-neutral-800/80'
                  }`}
                >
                  <span>{day.dayName}</span>
                </button>
              ))}
            </div>

            {/* Active Day Detail Card */}
            {currentDay && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h4 className="font-heading text-lg sm:text-xl font-bold text-white">
                      {currentDay.dayName}
                    </h4>
                    <span className="text-xs text-emerald-400 font-medium block mt-0.5">
                      Focus: {currentDay.focus}
                    </span>
                  </div>

                  {/* Day Summary Metrics */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                      <span className="text-neutral-400">Total Sets: </span>
                      <span className="font-bold text-white">{currentDaySets}</span>
                    </div>
                    <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl">
                      <span className="text-neutral-400">Estimated Volume: </span>
                      <span className="font-bold text-emerald-400">{currentDayVolume.toLocaleString()} kg</span>
                    </div>
                  </div>
                </div>

                {/* Exercises List for Current Day */}
                <div className="space-y-3 mb-6">
                  {currentDay.exercises.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700/80 rounded-2xl p-4 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Exercise Title & Reorder Controls */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveItem(activeDayIndex, itemIdx, 'up')}
                              disabled={itemIdx === 0}
                              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveItem(activeDayIndex, itemIdx, 'down')}
                              disabled={itemIdx === currentDay.exercises.length - 1}
                              className="p-1 rounded hover:bg-neutral-800 text-neutral-400 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-neutral-500">#{itemIdx + 1}</span>
                              <h5 className="font-heading font-bold text-white text-base">
                                {item.name}
                              </h5>
                              <span className="px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-[10px] font-semibold text-emerald-400">
                                {item.category}
                              </span>
                            </div>
                            {item.notes && (
                              <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Parameters: Sets, Reps, Weight, Rest */}
                        <div className="flex flex-wrap items-center gap-2.5">
                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase">Sets</label>
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={item.sets}
                              onChange={(e) =>
                                handleUpdateItem(activeDayIndex, item.id, 'sets', Number(e.target.value) || 1)
                              }
                              className="w-14 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase">Reps</label>
                            <input
                              type="number"
                              min={1}
                              max={50}
                              value={item.reps}
                              onChange={(e) =>
                                handleUpdateItem(activeDayIndex, item.id, 'reps', Number(e.target.value) || 1)
                              }
                              className="w-14 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase">Load (kg)</label>
                            <input
                              type="number"
                              min={0}
                              step={2.5}
                              value={item.weightKg}
                              onChange={(e) =>
                                handleUpdateItem(activeDayIndex, item.id, 'weightKg', Number(e.target.value) || 0)
                              }
                              className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-emerald-400 text-center font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-neutral-400 uppercase">Rest (s)</label>
                            <input
                              type="number"
                              min={15}
                              step={15}
                              value={item.restSeconds}
                              onChange={(e) =>
                                handleUpdateItem(activeDayIndex, item.id, 'restSeconds', Number(e.target.value) || 30)
                              }
                              className="w-16 bg-neutral-950 border border-neutral-800 rounded-lg px-2 py-1 text-xs text-white text-center font-bold focus:outline-none focus:border-emerald-500"
                            />
                          </div>

                          {/* Quick Rest Timer Link */}
                          <div className="pt-3">
                            <Link
                              to={`/tools/rest-timer?seconds=${item.restSeconds}&exercise=${encodeURIComponent(item.name)}`}
                              className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold transition-colors whitespace-nowrap"
                              title={`Start Rest Timer for ${item.name} (${item.restSeconds}s)`}
                            >
                              <Clock className="w-3 h-3" />
                              <span className="hidden sm:inline">Start Rest Timer</span>
                              <span className="sm:hidden">Timer</span>
                            </Link>
                          </div>

                          {/* Delete Item */}
                          <div className="pt-3">
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(activeDayIndex, item.id)}
                              className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                              title="Remove exercise from day"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {currentDay.exercises.length === 0 && (
                    <div className="text-center py-10 bg-neutral-900/40 rounded-2xl border border-neutral-800/60 p-6">
                      <Dumbbell className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                      <p className="text-xs text-neutral-400">No exercises added to this day yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddExerciseModal(true)}
                        className="mt-3 inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add First Exercise</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Add Exercise & Rest Timer Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowAddExerciseModal(true)}
                    className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Exercise to {currentDay.dayName}</span>
                  </button>

                  <a
                    href="#timer"
                    className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-900/60 hover:bg-neutral-850 border border-neutral-800/80 transition-colors"
                  >
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <span>Open Rest Interval Timer ↓</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Exercise Modal */}
        {showAddExerciseModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
            onClick={() => setShowAddExerciseModal(false)}
          >
            <div
              className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h4 className="font-heading text-xl font-bold text-white mb-2">
                Add Exercise to Workout
              </h4>
              <p className="text-xs text-neutral-400 mb-4">
                Select an exercise from the library to add to <strong>{currentDay?.dayName}</strong>.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-300 uppercase mb-1.5">
                  Select Exercise
                </label>
                <select
                  value={selectedExerciseToAdd}
                  onChange={(e) => setSelectedExerciseToAdd(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="">-- Choose Exercise --</option>
                  {EXERCISES_DATA.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name} ({ex.category} • {ex.equipment})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddExerciseModal(false)}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!selectedExerciseToAdd}
                  onClick={handleAddExerciseToCurrentDay}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 transition-colors"
                >
                  Confirm & Add
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
