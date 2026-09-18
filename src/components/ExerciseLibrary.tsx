import React, { useState, useMemo } from 'react';
import { EXERCISES_DATA } from '../data/exercisesData';
import { ExerciseItem } from '../types';
import {
  Dumbbell,
  Search,
  Filter,
  X,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  Plus,
  Flame,
} from 'lucide-react';

interface ExerciseLibraryProps {
  onAddToWorkout?: (exercise: ExerciseItem) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onAddToWorkout }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseItem | null>(null);

  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const equipments = ['All', 'Barbell', 'Dumbbell', 'Cable / Machine', 'Bodyweight'];

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATA.filter((ex) => {
      const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || ex.difficulty === selectedDifficulty;
      const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ex.name.toLowerCase().includes(q) ||
        (ex.hindiName && ex.hindiName.toLowerCase().includes(q)) ||
        ex.targetMuscles.some((m) => m.toLowerCase().includes(q));

      return matchesCategory && matchesDifficulty && matchesEquipment && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, selectedEquipment, searchQuery]);

  return (
    <section id="exercises" className="py-16 sm:py-24 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Form & Movement Directory</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Exercise <span className="text-emerald-400">Library</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Master the core gym movements. Browse step-by-step setup guides, muscular targets, beginner cues, and common mistakes to avoid injury.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          {/* Search Field */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise by name or muscle (e.g., Bench Press, Chest, Quads)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white bg-neutral-950/60 hover:bg-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty & Equipment Selects */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Levels</option>
                {difficulties.slice(1).map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 text-neutral-300 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Equipment</option>
                {equipments.slice(1).map((eq) => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                    {ex.category}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {ex.equipment}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-1">
                  {ex.name}
                </h3>
                {ex.hindiName && (
                  <span className="text-xs text-neutral-400 block mb-3 font-medium">
                    {ex.hindiName}
                  </span>
                )}

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ex.targetMuscles.map((muscle, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[11px] border border-neutral-800/80 font-medium"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                  {ex.beginnerNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalExercise(ex)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Technique & Safety</span>
                </button>

                {onAddToWorkout && (
                  <button
                    type="button"
                    onClick={() => onAddToWorkout(ex)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                    title="Add to custom workout builder"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Workout</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 p-8">
            <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No exercises found</h4>
            <p className="text-xs text-neutral-400 mt-1">Try clearing your search query or adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Exercise Detail Modal */}
      {activeModalExercise && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setActiveModalExercise(null)}
        >
          <div
            className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalExercise(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase">
                {activeModalExercise.category}
              </span>
              <span className="text-xs text-neutral-400">
                • {activeModalExercise.difficulty} • {activeModalExercise.equipment}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-1">
              {activeModalExercise.name}
            </h3>
            {activeModalExercise.hindiName && (
              <span className="text-sm font-semibold text-emerald-400 block mb-4">
                {activeModalExercise.hindiName}
              </span>
            )}

            {/* Target Muscles */}
            <div className="mb-6">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Primary & Secondary Muscles
              </span>
              <div className="flex flex-wrap gap-2">
                {activeModalExercise.targetMuscles.map((muscle, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-semibold text-neutral-200"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            {/* Execution Steps */}
            <div className="mb-6">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2.5">
                Execution Instructions
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-sm text-neutral-200 leading-relaxed">
                {activeModalExercise.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Beginner Cue */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                  Beginner Cue
                </span>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeModalExercise.beginnerNotes}
                </p>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="mb-5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Common Form Mistakes
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside leading-relaxed">
                {activeModalExercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Safety Advice */}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200">
              <strong>Safety Note:</strong> {activeModalExercise.safetyNotes}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
              {onAddToWorkout && (
                <button
                  type="button"
                  onClick={() => {
                    onAddToWorkout(activeModalExercise);
                    setActiveModalExercise(null);
                  }}
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Workout Builder</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveModalExercise(null)}
                className="py-2.5 px-4 rounded-xl text-xs font-bold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
