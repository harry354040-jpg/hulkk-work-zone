import React, { useState } from 'react';
import { UnitSystem } from '../types';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
  calculateProtein,
  calculateMacros,
  calculateHydration,
  calculateBodyFat,
  calculateHealthyWeightRange,
  calculateOneRepMax,
} from '../utils/calculators';
import {
  Calculator,
  Activity,
  Apple,
  Flame,
  Droplet,
  Sparkles,
  Info,
  Scale,
  Zap,
} from 'lucide-react';

interface CalculatorHubProps {
  onAskAi: (prompt: string) => void;
}

type CalculatorTab = 'bmi' | 'bmr_tdee' | 'calories_macros' | 'protein' | 'hydration' | 'body_fat' | 'one_rep_max' | 'healthy_weight';

export const CalculatorHub: React.FC<CalculatorHubProps> = ({ onAskAi }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('bmi');
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Common input states
  const [weight, setWeight] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [heightFt, setHeightFt] = useState<number>(5);
  const [heightIn, setHeightIn] = useState<number>(9);
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activity, setActivity] = useState<'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete'>('moderate');

  // Nutrition specifics
  const [calorieGoal, setCalorieGoal] = useState<'maintain' | 'loss' | 'gain'>('maintain');
  const [macroApproach, setMacroApproach] = useState<'balanced' | 'high_protein' | 'strength_fuel'>('balanced');
  const [proteinGoal, setProteinGoal] = useState<'general' | 'muscle_gain' | 'fat_loss'>('muscle_gain');

  // Body Fat specifics
  const [waistCm, setWaistCm] = useState<number>(85);
  const [neckCm, setNeckCm] = useState<number>(38);
  const [hipCm, setHipCm] = useState<number>(95);

  // 1RM specifics
  const [oneRmWeight, setOneRmWeight] = useState<number>(80);
  const [oneRmReps, setOneRmReps] = useState<number>(5);
  const [oneRmExercise, setOneRmExercise] = useState<string>('Bench Press');

  // Hydration specifics
  const [workoutDurationMins, setWorkoutDurationMins] = useState<number>(60);

  // Convert height if in imperial
  const effectiveHeightCm =
    unitSystem === 'metric' ? heightCm : Math.round((heightFt * 12 + heightIn) * 2.54);

  // Convert weight to kg for calculations
  const effectiveWeightKg =
    unitSystem === 'metric' ? weight : Math.round(weight * 0.453592);

  // Computed results with error safe guards
  let bmiResult = null;
  let bmrResult = null;
  let tdeeResult = null;
  let calorieResult = null;
  let proteinResult = null;
  let macroResult = null;
  let hydrationResult = null;
  let bodyFatResult = null;
  let healthyWeightResult = null;
  let oneRepMaxResult = null;

  try {
    bmiResult = calculateBMI(effectiveWeightKg, effectiveHeightCm);
  } catch (e) {}

  try {
    bmrResult = calculateBMR(effectiveWeightKg, effectiveHeightCm, age, gender);
    tdeeResult = calculateTDEE(bmrResult.bmr, activity);
    calorieResult = calculateCalorieGoal(tdeeResult.tdee, calorieGoal);
    macroResult = calculateMacros(calorieResult.targetCalories, macroApproach);
  } catch (e) {}

  try {
    proteinResult = calculateProtein(effectiveWeightKg, proteinGoal);
  } catch (e) {}

  try {
    hydrationResult = calculateHydration(effectiveWeightKg, workoutDurationMins);
  } catch (e) {}

  try {
    bodyFatResult = calculateBodyFat(gender, effectiveHeightCm, waistCm, neckCm, hipCm, effectiveWeightKg);
  } catch (e) {}

  try {
    healthyWeightResult = calculateHealthyWeightRange(effectiveHeightCm);
  } catch (e) {}

  try {
    oneRepMaxResult = calculateOneRepMax(oneRmWeight, oneRmReps);
  } catch (e) {}

  const tabs: { id: CalculatorTab; label: string; icon: any }[] = [
    { id: 'bmi', label: 'BMI Index', icon: Scale },
    { id: 'bmr_tdee', label: 'BMR & TDEE', icon: Flame },
    { id: 'calories_macros', label: 'Calories & Macros', icon: Apple },
    { id: 'protein', label: 'Protein Target', icon: Zap },
    { id: 'one_rep_max', label: '1RM Strength', icon: Activity },
    { id: 'body_fat', label: 'Body Fat %', icon: Scale },
    { id: 'hydration', label: 'Water & Hydration', icon: Droplet },
    { id: 'healthy_weight', label: 'Healthy Weight Band', icon: Scale },
  ];

  return (
    <section id="calculators" className="py-16 sm:py-24 bg-neutral-900/30 border-t border-neutral-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5" />
            <span>Scientific Fitness Tools</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Fitness Calculator <span className="text-emerald-400">Hub</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            No guesswork. Calculate your body metrics, caloric expenditure, macronutrient targets, and maximum lifting capacity with transparent scientific equations.
          </p>
        </div>

        {/* Units Toggle & Tabs Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-neutral-950 p-2.5 rounded-2xl border border-neutral-800">
          {/* Scrollable Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-400 text-neutral-950 shadow-md shadow-emerald-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Unit Switcher */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 shrink-0">
            <button
              onClick={() => setUnitSystem('metric')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'metric'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Metric (kg/cm)
            </button>
            <button
              onClick={() => setUnitSystem('imperial')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                unitSystem === 'imperial'
                  ? 'bg-neutral-800 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Imperial (lb/ft)
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* TAB 1: BMI CALCULATOR */}
          {activeTab === 'bmi' && bmiResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Body Mass Index (BMI)
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Formula: Weight (kg) / Height (m)². Useful as an initial population screening benchmark.
                </p>

                {/* Weight Input */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Body Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="300"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

                {/* Height Input */}
                {unitSystem === 'metric' ? (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      min="80"
                      max="250"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Feet (ft)
                      </label>
                      <input
                        type="number"
                        min="2"
                        max="8"
                        value={heightFt}
                        onChange={(e) => setHeightFt(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Inches (in)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn}
                        onChange={(e) => setHeightIn(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* BMI Output Card */}
              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Calculated Result
                  </span>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="font-heading text-5xl font-black text-white">
                      {bmiResult.bmi}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${bmiResult.colorClass}`}>
                      {bmiResult.category}
                    </span>
                  </div>

                  <div className="text-xs text-neutral-300 mb-4">
                    Healthy weight range for your height: <strong>{bmiResult.healthyRange}</strong>
                  </div>

                  <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 mb-6 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bmiResult.explanation}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera BMI ${bmiResult.bmi} aaya hai (${bmiResult.category}), weight ${effectiveWeightKg} kg aur height ${effectiveHeightCm} cm par. Iska meri gym training aur fat loss/muscle gain ke liye kya matlab hai? Simple Hindi/Hinglish mein samjhao.`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BMR & TDEE */}
          {activeTab === 'bmr_tdee' && bmrResult && tdeeResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Basal Metabolic Rate (BMR) & TDEE
                </h3>
                <p className="text-xs text-neutral-400">
                  Calculated using the verified <strong>Mifflin-St Jeor Equation</strong>.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Age (years)
                    </label>
                    <input
                      type="number"
                      min="12"
                      max="100"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Activity Multiplier Level
                  </label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="sedentary">Sedentary (Desk job, minimal movement)</option>
                    <option value="light">Lightly Active (1–3 training days / week)</option>
                    <option value="moderate">Moderately Active (3–5 hard workouts / week)</option>
                    <option value="heavy">Very Active (6–7 heavy gym sessions / week)</option>
                    <option value="athlete">Extra Active (Intense training / manual labor)</option>
                  </select>
                </div>
              </div>

              {/* BMR & TDEE Results */}
              <div className="lg:col-span-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 block mb-1">Estimated BMR</span>
                    <span className="font-heading text-3xl font-bold text-emerald-400">
                      {bmrResult.bmr}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">kcal / day at rest</span>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 block mb-1">Estimated TDEE</span>
                    <span className="font-heading text-3xl font-bold text-lime-400">
                      {tdeeResult.tdee}
                    </span>
                    <span className="text-[11px] text-neutral-400 block mt-0.5">kcal / day with activity</span>
                  </div>
                </div>

                <div className="text-xs text-neutral-300 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 leading-relaxed">
                  <strong>How to use this:</strong> To maintain your weight, consume approximately <strong>{tdeeResult.tdee} kcal</strong> per day. For fat loss, target a moderate 350–500 calorie deficit.
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera BMR ${bmrResult.bmr} calories aur TDEE ${tdeeResult.tdee} calories aaya hai (${activity} activity level, age ${age}). Mujhe weight maintenance aur safe calorie deficit ke baare mein samjhao.`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CALORIES & MACRO SPLIT */}
          {activeTab === 'calories_macros' && calorieResult && macroResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Calorie Goal & Macro Distribution
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Primary Fitness Goal
                  </label>
                  <select
                    value={calorieGoal}
                    onChange={(e) => setCalorieGoal(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="maintain">Maintain Current Weight</option>
                    <option value="loss">Gradual Sustainable Fat Loss (-400 kcal)</option>
                    <option value="gain">Lean Muscle Growth Surplus (+350 kcal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Macro Preference Ratio
                  </label>
                  <select
                    value={macroApproach}
                    onChange={(e) => setMacroApproach(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="balanced">Balanced Split (30% Protein, 40% Carb, 30% Fat)</option>
                    <option value="high_protein">High Protein Split (35% Protein, 35% Carb, 30% Fat)</option>
                    <option value="strength_fuel">Strength & Carb Fuel (25% Protein, 50% Carb, 25% Fat)</option>
                  </select>
                </div>

                <div className="p-3.5 bg-neutral-900/70 border border-neutral-800 rounded-xl text-xs text-neutral-400 leading-relaxed">
                  Based on your TDEE ({calorieResult.tdee} kcal), your recommended daily intake is:
                  <div className="font-heading text-2xl font-bold text-white mt-1">
                    {calorieResult.targetCalories} kcal / day
                  </div>
                  <span className="text-emerald-400 font-medium block mt-0.5">{calorieResult.weeklyTarget}</span>
                </div>
              </div>

              {/* Macro Bars */}
              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                  Daily Macronutrient Breakdown
                </span>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-neutral-950 border border-emerald-500/30 p-3.5 rounded-xl">
                    <span className="text-xs text-emerald-400 font-semibold block">PROTEIN</span>
                    <span className="font-heading text-2xl font-black text-white mt-1 block">
                      {macroResult.proteinGrams}g
                    </span>
                    <span className="text-[11px] text-neutral-400">{macroResult.proteinCalories} kcal ({macroResult.proteinPct}%)</span>
                  </div>

                  <div className="bg-neutral-950 border border-amber-500/30 p-3.5 rounded-xl">
                    <span className="text-xs text-amber-400 font-semibold block">CARBS</span>
                    <span className="font-heading text-2xl font-black text-white mt-1 block">
                      {macroResult.carbGrams}g
                    </span>
                    <span className="text-[11px] text-neutral-400">{macroResult.carbCalories} kcal ({macroResult.carbPct}%)</span>
                  </div>

                  <div className="bg-neutral-950 border border-rose-500/30 p-3.5 rounded-xl">
                    <span className="text-xs text-rose-400 font-semibold block">FATS</span>
                    <span className="font-heading text-2xl font-black text-white mt-1 block">
                      {macroResult.fatGrams}g
                    </span>
                    <span className="text-[11px] text-neutral-400">{macroResult.fatCalories} kcal ({macroResult.fatPct}%)</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera daily calorie target ${calorieResult.targetCalories} kcal hai (Protein: ${macroResult.proteinGrams}g, Carbs: ${macroResult.carbGrams}g, Fats: ${macroResult.fatGrams}g) for ${calorieGoal}. Mujhe Indian meals se yeh protein aur calories complete karne ke practical tips do.`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: PROTEIN CALCULATOR */}
          {activeTab === 'protein' && proteinResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Daily Protein Requirements
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Your Training Goal
                  </label>
                  <select
                    value={proteinGoal}
                    onChange={(e) => setProteinGoal(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="general">Active Health & Maintenance (1.2–1.6 g/kg)</option>
                    <option value="muscle_gain">Hypertrophy & Muscle Building (1.8–2.2 g/kg)</option>
                    <option value="fat_loss">Fat Loss with Muscle Retention (2.0–2.4 g/kg)</option>
                  </select>
                </div>

                <div className="text-xs text-neutral-400 leading-relaxed p-3.5 bg-neutral-900 rounded-xl border border-neutral-800">
                  {proteinResult.explanation}
                </div>
              </div>

              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Recommended Daily Target
                  </span>
                  <div className="font-heading text-4xl sm:text-5xl font-black text-emerald-400 mb-2">
                    {proteinResult.dailyGramsMin}g – {proteinResult.dailyGramsMax}g
                  </div>
                  <span className="text-xs text-neutral-300">
                    Equivalent to approx. {proteinResult.gramsPerKg} of body weight ({effectiveWeightKg} kg).
                  </span>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera protein target ${proteinResult.dailyGramsMin}g se ${proteinResult.dailyGramsMax}g per day aaya hai for ${proteinGoal}. Vegetarian aur non-vegetarian sources se daily diet me isse distribute kaise karu?`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ONE REP MAX (1RM) */}
          {activeTab === 'one_rep_max' && oneRepMaxResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  One-Rep Max (1RM) Estimator
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Formula: <strong>Epley Equation</strong> [Weight × (1 + Reps / 30)]. Accurately estimates single-rep strength from working sets.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Exercise Name
                  </label>
                  <select
                    value={oneRmExercise}
                    onChange={(e) => setOneRmExercise(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bench Press">Barbell Bench Press</option>
                    <option value="Back Squat">Barbell Back Squat</option>
                    <option value="Deadlift">Conventional Deadlift</option>
                    <option value="Overhead Press">Overhead Military Press</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Weight Lifted ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      value={oneRmWeight}
                      onChange={(e) => setOneRmWeight(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Completed Reps (1–12)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={oneRmReps}
                      onChange={(e) => setOneRmReps(Number(e.target.value) || 1)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* 1RM Output & Training Load Table */}
              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Estimated 1RM for {oneRmExercise}
                  </span>
                  <div className="font-heading text-5xl font-black text-emerald-400 mb-2">
                    {oneRepMaxResult.oneRepMax} {unitSystem === 'metric' ? 'kg' : 'lbs'}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-neutral-400 block uppercase">
                    Training Load Percentages
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {oneRepMaxResult.percentages.slice(0, 4).map((p) => (
                      <div key={p.percentage} className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 text-center">
                        <span className="text-xs text-neutral-400 font-semibold block">{p.percentage}% 1RM</span>
                        <span className="font-heading text-lg font-bold text-white block">{p.weight} {unitSystem === 'metric' ? 'kg' : 'lb'}</span>
                        <span className="text-[10px] text-emerald-400 block">{p.repsEstimate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera ${oneRmExercise} ka estimated 1RM ${oneRepMaxResult.oneRepMax} ${unitSystem === 'metric' ? 'kg' : 'lbs'} calculate hua hai (${oneRmWeight} for ${oneRmReps} reps). Is basis pe weekly strength training split aur progressive overload plan kaise banau?`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: BODY FAT % ESTIMATOR (US NAVY) */}
          {activeTab === 'body_fat' && bodyFatResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Body Fat % (US Navy Circumference Method)
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Waist (cm at navel)
                    </label>
                    <input
                      type="number"
                      value={waistCm}
                      onChange={(e) => setWaistCm(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Neck (cm narrowest point)
                    </label>
                    <input
                      type="number"
                      value={neckCm}
                      onChange={(e) => setNeckCm(Number(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  {gender === 'female' && (
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        Hip (cm widest point)
                      </label>
                      <input
                        type="number"
                        value={hipCm}
                        onChange={(e) => setHipCm(Number(e.target.value) || 0)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-6 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Estimated Body Fat %
                  </span>
                  <div className="font-heading text-5xl font-black text-emerald-400 mb-2">
                    {bodyFatResult.bodyFatPercent}%
                  </div>
                  <span className="text-xs font-semibold text-white bg-neutral-800 px-3 py-1 rounded-full">
                    Category: {bodyFatResult.category}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 block">Estimated Fat Mass</span>
                    <span className="text-lg font-bold text-white">{bodyFatResult.fatMassKg} kg</span>
                  </div>
                  <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                    <span className="text-xs text-neutral-400 block">Estimated Lean Mass</span>
                    <span className="text-lg font-bold text-emerald-400">{bodyFatResult.leanMassKg} kg</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mera estimated body fat ${bodyFatResult.bodyFatPercent}% aaya hai (${bodyFatResult.category}), Lean Mass approx ${bodyFatResult.leanMassKg} kg. Body recomposition ke liye workout aur diet structure kaise banayein?`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: HYDRATION ESTIMATOR */}
          {activeTab === 'hydration' && hydrationResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Daily Water & Hydration Needs
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Average Daily Workout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={workoutDurationMins}
                    onChange={(e) => setWorkoutDurationMins(Number(e.target.value) || 0)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3.5 bg-neutral-900/60 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                  Hydration maintains intracellular muscle cell volume, preserves strength during heavy sets, and lubricates lifting joints.
                </div>
              </div>

              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Recommended Daily Water Intake
                  </span>
                  <div className="font-heading text-5xl font-black text-emerald-400 mb-2">
                    {hydrationResult.litersPerDay} Liters
                  </div>
                  <span className="text-xs text-neutral-300 block">
                    Approx. {hydrationResult.glassesPerDay} standard glasses (250 ml each) throughout the day.
                  </span>
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Mujhe daily ${hydrationResult.litersPerDay} Liters paani peene ka estimate mila hai for ${workoutDurationMins} mins gym session. Workout ke dauran electrolytes aur intra-workout hydration ke baare mein tips do.`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: HEALTHY WEIGHT BAND */}
          {activeTab === 'healthy_weight' && healthyWeightResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-5 space-y-4">
                <h3 className="font-heading text-xl font-bold text-white mb-2">
                  Healthy Weight Range Estimate
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Based on statistical population healthy BMI cutoffs for your height ({effectiveHeightCm} cm). Note: Not an aesthetic target.
                </p>
              </div>

              <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 space-y-6">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                    Estimated Standard Healthy Range
                  </span>
                  <div className="font-heading text-4xl sm:text-5xl font-black text-emerald-400 mb-2">
                    {healthyWeightResult.minKg} kg – {healthyWeightResult.maxKg} kg
                  </div>
                  <span className="text-xs text-neutral-300 block">
                    ({healthyWeightResult.minLb} lbs – {healthyWeightResult.maxLb} lbs)
                  </span>
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-400 leading-relaxed">
                  {healthyWeightResult.explanation}
                </div>

                <button
                  onClick={() =>
                    onAskAi(
                      `Meri height ${effectiveHeightCm} cm ke liye healthy weight range ${healthyWeightResult.minKg}–${healthyWeightResult.maxKg} kg aayi hai, jabki mera current weight ${effectiveWeightKg} kg hai. Muscle mass badhane ke liye kya target rakhu?`
                    )
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask AI About This Result 🤖</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
