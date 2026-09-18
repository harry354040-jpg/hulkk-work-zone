import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
  calculateMacros,
  calculateProtein,
  ACTIVITY_MULTIPLIERS,
} from '../../utils/calculators';
import { UnitSystem } from '../../types';
import {
  Apple,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info,
  ArrowRight,
  Flame,
  Zap,
} from 'lucide-react';

interface CaloriesMacrosPageProps {
  onAskAi?: (prompt: string) => void;
}

export const CaloriesMacrosPage: React.FC<CaloriesMacrosPageProps> = ({ onAskAi }) => {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Input states as strings for stability
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [ageStr, setAgeStr] = useState<string>('25');
  const [weightStr, setWeightStr] = useState<string>('75');
  const [heightCmStr, setHeightCmStr] = useState<string>('175');
  const [heightFtStr, setHeightFtStr] = useState<string>('5');
  const [heightInStr, setHeightInStr] = useState<string>('9');
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_MULTIPLIERS>('moderate');

  // Specific goal & macro distribution
  const [goal, setGoal] = useState<'maintain' | 'loss' | 'gain'>('maintain');
  const [macroSplit, setMacroSplit] = useState<'balanced' | 'high_protein' | 'strength_fuel'>('balanced');

  const ageNum = parseInt(ageStr, 10);
  const weightNum = parseFloat(weightStr);
  const heightCmNum = parseFloat(heightCmStr);
  const heightFtNum = parseFloat(heightFtStr);
  const heightInNum = parseFloat(heightInStr);

  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === 'imperial') {
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 2.20462).toString());
      }
      if (!isNaN(heightCmNum) && heightCmNum > 0) {
        const totalInches = heightCmNum / 2.54;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        setHeightFtStr(feet.toString());
        setHeightInStr(inches.toString());
      }
    } else {
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 0.453592).toString());
      }
      const ft = !isNaN(heightFtNum) ? heightFtNum : 0;
      const inch = !isNaN(heightInNum) ? heightInNum : 0;
      if (ft > 0 || inch > 0) {
        setHeightCmStr(Math.round((ft * 12 + inch) * 2.54).toString());
      }
    }
    setUnitSystem(newUnit);
  };

  const effectiveWeightKg =
    unitSystem === 'metric'
      ? weightNum
      : !isNaN(weightNum) && weightNum > 0
      ? weightNum * 0.453592
      : NaN;

  const effectiveHeightCm =
    unitSystem === 'metric'
      ? heightCmNum
      : (!isNaN(heightFtNum) || !isNaN(heightInNum))
      ? (heightFtNum * 12 + (heightInNum || 0)) * 2.54
      : NaN;

  const isAgeValid = !isNaN(ageNum) && ageNum >= 12 && ageNum <= 100;
  const isWeightValid = !isNaN(effectiveWeightKg) && effectiveWeightKg >= 25 && effectiveWeightKg <= 300;
  const isHeightValid = !isNaN(effectiveHeightCm) && effectiveHeightCm >= 80 && effectiveHeightCm <= 250;
  const canCalculate = isAgeValid && isWeightValid && isHeightValid;

  let calorieData = null;
  let macroData = null;
  let proteinBenchmark = null;

  if (canCalculate) {
    try {
      const bmr = calculateBMR(effectiveWeightKg, effectiveHeightCm, ageNum, gender);
      const tdee = calculateTDEE(bmr.bmr, activityLevel);
      calorieData = calculateCalorieGoal(tdee.tdee, goal);
      macroData = calculateMacros(calorieData.targetCalories, macroSplit);
      proteinBenchmark = calculateProtein(effectiveWeightKg, goal === 'loss' ? 'fat_loss' : 'muscle_gain');
    } catch {
      // Safe fallback
    }
  }

  const handleAskAiAboutMacros = () => {
    const prompt = calorieData && macroData
      ? `Sir, my target is ${calorieData.targetCalories} kcal per day (${macroData.proteinGrams}g Protein, ${macroData.carbGrams}g Carbs, ${macroData.fatGrams}g Fats) for my goal of ${goal.replace('_', ' ')}. Could you suggest a practical meal structure or foods available in India to meet these numbers?`
      : `Sir, how should I calculate my daily protein and calorie intake?`;

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
          <Link to="/tools" className="hover:text-white transition-colors">Fitness Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-lime-400 font-medium">Calories & Macros</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tools</span>
        </Link>

        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Apple className="w-3.5 h-3.5" />
            <span>Target Nutrition & Macros</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
            Calorie & Macro <span className="text-lime-400">Calculator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Determine your ideal daily caloric intake and customized macronutrient breakdown (protein, carbohydrates, and fats) aligned with your specific fitness goal.
          </p>
        </div>

        {/* Calculator Main Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8">
          {/* Unit Switcher */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-800 flex-wrap gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Measurement System:
            </span>
            <div className="inline-flex p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleUnitSwitch('metric')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  unitSystem === 'metric'
                    ? 'bg-lime-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Metric (kg / cm)
              </button>
              <button
                type="button"
                onClick={() => handleUnitSwitch('imperial')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-lime-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Imperial (lb / ft)
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Step 1: Goal Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 mb-2">Primary Goal</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setGoal('loss')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    goal === 'loss'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">Fat Loss</span>
                  <span className="text-[11px] text-neutral-400">Moderate deficit (-400 kcal)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('maintain')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    goal === 'maintain'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">Maintain</span>
                  <span className="text-[11px] text-neutral-400">Steady weight & recomposition</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGoal('gain')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    goal === 'gain'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">Muscle Gain</span>
                  <span className="text-[11px] text-neutral-400">Lean surplus (+350 kcal)</span>
                </button>
              </div>
            </div>

            {/* Biological Sex */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 mb-2">Biological Sex</label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'male'
                      ? 'bg-lime-400 text-neutral-950 border-lime-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'female'
                      ? 'bg-lime-400 text-neutral-950 border-lime-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Inputs: Age, Weight, Height */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="macro-age" className="block text-xs font-bold text-neutral-200">
                  Age (years)
                </label>
                <input
                  id="macro-age"
                  type="number"
                  placeholder="25"
                  value={ageStr}
                  onChange={(e) => setAgeStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="macro-weight" className="block text-xs font-bold text-neutral-200">
                  Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  id="macro-weight"
                  type="number"
                  step="any"
                  placeholder={unitSystem === 'metric' ? '75' : '165'}
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              {unitSystem === 'metric' ? (
                <div className="space-y-1.5">
                  <label htmlFor="macro-height" className="block text-xs font-bold text-neutral-200">
                    Height (cm)
                  </label>
                  <input
                    id="macro-height"
                    type="number"
                    placeholder="175"
                    value={heightCmStr}
                    onChange={(e) => setHeightCmStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label htmlFor="macro-ft" className="block text-xs font-bold text-neutral-200">Feet</label>
                    <input
                      id="macro-ft"
                      type="number"
                      placeholder="5"
                      value={heightFtStr}
                      onChange={(e) => setHeightFtStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="macro-in" className="block text-xs font-bold text-neutral-200">Inches</label>
                    <input
                      id="macro-in"
                      type="number"
                      placeholder="9"
                      value={heightInStr}
                      onChange={(e) => setHeightInStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Activity Level */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-200">Activity Level</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                aria-label="Activity Level"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-lime-400 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              >
                {(Object.keys(ACTIVITY_MULTIPLIERS) as Array<keyof typeof ACTIVITY_MULTIPLIERS>).map((k) => (
                  <option key={k} value={k}>
                    {ACTIVITY_MULTIPLIERS[k].label} ({ACTIVITY_MULTIPLIERS[k].factor}x)
                  </option>
                ))}
              </select>
            </div>

            {/* Macro Ratio Approach */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-200">Macronutrient Distribution Approach</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMacroSplit('balanced')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    macroSplit === 'balanced'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">Balanced Athletic</span>
                  <span className="text-[11px] text-neutral-400">30% Protein / 40% Carbs / 30% Fat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMacroSplit('high_protein')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    macroSplit === 'high_protein'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">High Protein</span>
                  <span className="text-[11px] text-neutral-400">35% Protein / 35% Carbs / 30% Fat</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMacroSplit('strength_fuel')}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    macroSplit === 'strength_fuel'
                      ? 'bg-lime-500/10 border-lime-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="block font-bold text-xs text-neutral-200">Carb Fuel / Strength</span>
                  <span className="text-[11px] text-neutral-400">25% Protein / 50% Carbs / 25% Fat</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            {canCalculate && calorieData && macroData ? (
              <div className="space-y-6">
                {/* Daily Calories Header */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-lime-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-lime-400 block mb-1">
                      Daily Calorie Target ({goal.toUpperCase()})
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                        {calorieData.targetCalories.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">kcal / day</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 border-neutral-800 pt-2 sm:pt-0">
                    <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">Weekly Target Pace</span>
                    <span className="text-xs font-bold text-neutral-200">{calorieData.weeklyTarget}</span>
                  </div>
                </div>

                {/* 3 Macro Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Protein */}
                  <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase">Protein</span>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                        {macroData.proteinPct}% of cals
                      </span>
                    </div>
                    <div className="font-heading text-3xl font-black text-white mb-1">
                      {macroData.proteinGrams} <span className="text-sm font-semibold text-neutral-400">grams</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {macroData.proteinCalories} kcal • Essential for muscle repair & satiety.
                    </p>
                  </div>

                  {/* Carbohydrates */}
                  <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-400 uppercase">Carbohydrates</span>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                        {macroData.carbPct}% of cals
                      </span>
                    </div>
                    <div className="font-heading text-3xl font-black text-white mb-1">
                      {macroData.carbGrams} <span className="text-sm font-semibold text-neutral-400">grams</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {macroData.carbCalories} kcal • Primary fuel for hard gym lifting sets.
                    </p>
                  </div>

                  {/* Healthy Fats */}
                  <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-400 uppercase">Fats</span>
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                        {macroData.fatPct}% of cals
                      </span>
                    </div>
                    <div className="font-heading text-3xl font-black text-white mb-1">
                      {macroData.fatGrams} <span className="text-sm font-semibold text-neutral-400">grams</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">
                      {macroData.fatCalories} kcal • Vital for hormone balance & joint health.
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-neutral-950/60 rounded-2xl p-5 border border-neutral-800/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-lime-400" />
                    <span>What Does This Result Mean?</span>
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Hit your daily protein target first to safeguard muscle recovery, then fill remaining calories with whole grain carbs, vegetables, and healthy fats. Consistency over 4 to 8 weeks is where noticeable transformations happen.
                  </p>
                </div>

                {/* Next Steps */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    What should you do next?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAskAiAboutMacros}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-lime-500/10 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Coach for a Sample Meal Plan</span>
                    </button>

                    <Link
                      to="/workout-builder"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
                    >
                      <span>Build a Matching Workout Routine</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs space-y-1">
                <Apple className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-300">
                  Enter your age, weight, height, and goals above to generate your daily calorie & macro targets.
                </p>
                <p className="text-neutral-500">
                  Updates automatically as you type.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
