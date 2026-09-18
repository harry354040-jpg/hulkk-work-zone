import React, { useState, useMemo } from 'react';
import { EXERCISES_DATA } from '../data/exercisesData';
import { ExerciseItem } from '../types';
import {
  Dumbbell,
  Search,
  X,
  AlertTriangle,
  ShieldCheck,
  BookOpen,
  Plus,
  Sparkles,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface ExerciseLibraryProps {
  onAddToWorkout?: (exercise: ExerciseItem) => void;
  onAskAi?: (prompt: string) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onAddToWorkout,
  onAskAi,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalExercise, setActiveModalExercise] = useState<ExerciseItem | null>(null);

  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body'];
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
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(q)) ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some((m) => m.toLowerCase().includes(q)));

      return matchesCategory && matchesDifficulty && matchesEquipment && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, selectedEquipment, searchQuery]);

  const handleAskCoach = (exerciseName: string) => {
    const prompt = `Can you explain the correct form, breathing, and common beginner mistakes for ${exerciseName}?`;
    if (onAskAi) {
      onAskAi(prompt);
    } else {
      const el = document.getElementById('ai-coach');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            Clear, step-by-step gym exercise directory with plain-English muscle breakdowns, proper setup cues, and safety tips for injury-free lifting.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 sm:p-5 mb-8 shadow-xl">
          {/* Search Field */}
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="exercise-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search exercise by name or muscle (e.g. Bench Press, Chest, Quads)..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-xs">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
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
            <div className="flex items-center gap-2 self-start lg:self-auto">
              <select
                id="difficulty-filter-select"
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
                id="equipment-filter-select"
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
              id={`exercise-card-${ex.id}`}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 group hover:shadow-xl hover:shadow-emerald-500/5"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                    {ex.category}
                  </span>
                  <span className="text-[11px] font-semibold text-neutral-400">
                    {ex.equipment} • {ex.difficulty}
                  </span>
                </div>

                <h3 className="font-heading text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                  {ex.name}
                </h3>

                {/* Plain-English Muscular Focus */}
                <div className="mb-3">
                  <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                    Main muscles:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ex.primaryMuscles.map((muscle, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-neutral-950 text-emerald-300 text-xs border border-emerald-500/20 font-medium"
                      >
                        {muscle}
                      </span>
                    ))}
                    {ex.secondaryMuscles && ex.secondaryMuscles.slice(0, 2).map((muscle, idx) => (
                      <span
                        key={`sec-${idx}`}
                        className="px-2 py-0.5 rounded bg-neutral-950 text-neutral-400 text-xs border border-neutral-800 font-medium"
                      >
                        {muscle}
                      </span>
                    ))}
                  </div>
                </div>

                {ex.beginnerNotes && (
                  <p className="text-xs text-neutral-300 line-clamp-2 mb-4 leading-relaxed">
                    {ex.beginnerNotes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModalExercise(ex)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Technique Guide</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAskCoach(ex.name)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                    title="Ask AI Coach about this exercise"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </button>

                  {onAddToWorkout && (
                    <button
                      type="button"
                      onClick={() => onAddToWorkout(ex)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-white transition-colors"
                      title="Add to workout routine"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-16 bg-neutral-900/40 rounded-3xl border border-neutral-800/60 p-8">
            <Dumbbell className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No exercises match your search</h4>
            <p className="text-xs text-neutral-400 mt-1">Try clearing your search keyword or switching filters to "All".</p>
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
              type="button"
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
                • {activeModalExercise.equipment} • {activeModalExercise.difficulty}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mb-4">
              {activeModalExercise.name}
            </h3>

            {/* Plain English Muscles Trained */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 mb-6">
              <div className="mb-3">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1.5">
                  Main muscles trained:
                </span>
                <ul className="space-y-1">
                  {activeModalExercise.primaryMuscles.map((muscle, idx) => (
                    <li key={idx} className="text-xs text-emerald-400 flex items-center gap-2 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{muscle}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {activeModalExercise.secondaryMuscles && activeModalExercise.secondaryMuscles.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Secondary muscles:
                  </span>
                  <ul className="space-y-1">
                    {activeModalExercise.secondaryMuscles.map((muscle, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />
                        <span>{muscle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Execution Steps */}
            <div className="mb-6">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2.5">
                How to perform (Step by step):
              </span>
              <ol className="space-y-2.5 list-decimal list-inside text-xs sm:text-sm text-neutral-200 leading-relaxed">
                {activeModalExercise.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Beginner Cue */}
            {activeModalExercise.beginnerNotes && (
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 mb-5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">
                    Coaching Cue
                  </span>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {activeModalExercise.beginnerNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Common Mistakes */}
            <div className="mb-5">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-4 h-4" />
                Common Mistakes to Avoid
              </span>
              <ul className="space-y-1.5 text-xs text-neutral-300 list-disc list-inside leading-relaxed">
                {activeModalExercise.commonMistakes.map((mistake, idx) => (
                  <li key={idx}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Safety Advice */}
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/60 text-xs text-rose-200 mb-6">
              <strong>Safety Note:</strong> {activeModalExercise.safetyNotes}
            </div>

            {/* Alternatives */}
            {activeModalExercise.alternatives && activeModalExercise.alternatives.length > 0 && (
              <div className="mb-6">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Alternative Exercises:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalExercise.alternatives.map((alt, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-neutral-800 text-xs text-neutral-200">
                      {alt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  handleAskCoach(activeModalExercise.name);
                  setActiveModalExercise(null);
                }}
                className="inline-flex items-center gap-1.5 py-2.5 px-3.5 rounded-xl text-xs font-semibold text-neutral-300 bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Ask Coach Hulk</span>
              </button>

              <div className="flex items-center gap-2">
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
                    <span>Add to Routine</span>
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
        </div>
      )}
    </section>
  );
};
