import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EXERCISES_DATA } from '../data/exercisesData';
import { ExerciseItem } from '../types';
import {
  Dumbbell,
  Search,
  Filter,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Plus,
  Check,
  Info,
} from 'lucide-react';

interface ExercisesPageProps {
  onAddToWorkout?: (exercise: ExerciseItem) => void;
}

export const ExercisesPage: React.FC<ExercisesPageProps> = ({ onAddToWorkout }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];
  const equipmentList = ['All', 'Barbell', 'Dumbbell', 'Cable / Machine', 'Bodyweight'];
  const difficultyList = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((ex) => {
      const matchesSearch =
        !searchQuery.trim() ||
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
        ex.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || ex.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesEquipment =
        selectedEquipment === 'All' ||
        ex.equipment.toLowerCase().includes(selectedEquipment.toLowerCase()) ||
        (selectedEquipment === 'Cable / Machine' &&
          (ex.equipment.toLowerCase().includes('cable') || ex.equipment.toLowerCase().includes('machine')));

      const matchesDifficulty =
        selectedDifficulty === 'All' || ex.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCategory && matchesEquipment && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedEquipment, selectedDifficulty]);

  const handleAdd = (exercise: ExerciseItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onAddToWorkout) {
      onAddToWorkout(exercise);
    } else {
      // Direct local storage workout insertion fallback
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
      } catch (err) {
        console.warn('Could not save to localStorage:', err);
      }
    }

    setRecentlyAddedId(exercise.id);
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-28 sm:pb-16 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Exercise Library</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Dumbbell className="w-3.5 h-3.5" />
              <span>Standard Form & Technique</span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-3">
              Exercise <span className="text-emerald-400">Library</span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Explore step-by-step lifting guides, targeted muscle groups, setup cues, and common mistakes to avoid.
            </p>
          </div>

          <Link
            to="/workout-builder"
            className="self-start md:self-auto inline-flex items-center gap-2 py-3 px-5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 active:scale-98 whitespace-nowrap"
          >
            <span>Go to Workout Builder</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-6 mb-8 space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by exercise name, target muscle (e.g. Chest, Quads, Biceps)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="space-y-3 pt-2">
            {/* Category */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase text-neutral-500 shrink-0 mr-1">Muscle:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-400 text-neutral-950'
                      : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Equipment & Difficulty */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase font-bold text-[11px]">Equipment:</span>
                <select
                  value={selectedEquipment}
                  onChange={(e) => setSelectedEquipment(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none"
                >
                  {equipmentList.map((eq) => (
                    <option key={eq} value={eq}>{eq}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-500 uppercase font-bold text-[11px]">Level:</span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-200 focus:outline-none"
                >
                  {difficultyList.map((lvl) => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              <span className="text-neutral-500 ml-auto">
                Showing <strong>{filteredExercises.length}</strong> of {EXERCISES_DATA.length} exercises
              </span>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        {filteredExercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => {
              const isAdded = recentlyAddedId === exercise.id;

              return (
                <div
                  key={exercise.id}
                  className="bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 rounded-3xl p-6 flex flex-col justify-between transition-all duration-200 group shadow-md"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-lg">
                        {exercise.category}
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-950 px-2 py-0.5 rounded-md border border-neutral-800">
                        {exercise.difficulty}
                      </span>
                    </div>

                    {/* Exercise Title */}
                    <Link
                      to={`/exercises/${exercise.id}`}
                      className="block group-hover:text-emerald-400 transition-colors"
                    >
                      <h2 className="font-heading text-lg font-bold text-white mb-2">
                        {exercise.name}
                      </h2>
                    </Link>

                    {/* Meta info */}
                    <div className="space-y-2 text-xs mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-neutral-500 font-semibold">Equipment:</span>
                        <span className="text-neutral-300 font-medium">{exercise.equipment}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-neutral-500 font-semibold">Target:</span>
                        <span className="text-neutral-200 font-semibold">{exercise.primaryMuscles.join(', ')}</span>
                      </div>
                    </div>

                    {/* Beginner preview note */}
                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                      {exercise.beginnerNotes || exercise.instructions[0]}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="pt-4 border-t border-neutral-800/80 flex items-center gap-2">
                    <Link
                      to={`/exercises/${exercise.id}`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-200 hover:text-white transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>View Technique</span>
                    </Link>

                    <button
                      type="button"
                      onClick={(e) => handleAdd(exercise, e)}
                      aria-label={`Add ${exercise.name} to workout`}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all ${
                        isAdded
                          ? 'bg-emerald-500 text-neutral-950'
                          : 'bg-neutral-800 hover:bg-emerald-400 hover:text-neutral-950 text-white'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
            <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto" />
            <h3 className="font-heading text-lg font-bold text-white">No Exercises Found</h3>
            <p className="text-xs text-neutral-400">
              No exercises match your filter criteria. Try clearing your search query or selecting "All".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedEquipment('All');
                setSelectedDifficulty('All');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-400 text-neutral-950 text-xs font-bold hover:bg-emerald-300 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
