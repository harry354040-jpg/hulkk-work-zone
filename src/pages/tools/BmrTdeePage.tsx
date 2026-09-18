import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateBMR, calculateTDEE, ACTIVITY_MULTIPLIERS } from '../../utils/calculators';
import { UnitSystem } from '../../types';
import {
  Flame,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info,
  ArrowRight,
  Activity,
} from 'lucide-react';

interface BmrTdeePageProps {
  onAskAi?: (prompt: string) => void;
}

export const BmrTdeePage: React.FC<BmrTdeePageProps> = ({ onAskAi }) => {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Input states as strings for robustness
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [ageStr, setAgeStr] = useState<string>('25');
  const [weightStr, setWeightStr] = useState<string>('75');
  const [heightCmStr, setHeightCmStr] = useState<string>('175');
  const [heightFtStr, setHeightFtStr] = useState<string>('5');
  const [heightInStr, setHeightInStr] = useState<string>('9');
  const [activityLevel, setActivityLevel] = useState<keyof typeof ACTIVITY_MULTIPLIERS>('moderate');

  // Parse numerical values
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

  let bmrData = null;
  let tdeeData = null;

  if (canCalculate) {
    try {
      bmrData = calculateBMR(effectiveWeightKg, effectiveHeightCm, ageNum, gender);
      tdeeData = calculateTDEE(bmrData.bmr, activityLevel);
    } catch {
      // Safe fallback
    }
  }

  const handleAskAiAboutTdee = () => {
    const prompt = tdeeData && bmrData
      ? `Sir, my calculated BMR is ${bmrData.bmr} kcal and my daily TDEE is about ${tdeeData.tdee} kcal at a ${activityLevel} training level. I am a ${ageNum} year old ${gender} weighing ${Math.round(effectiveWeightKg)} kg. How should I set my calories for my workout goals?`
      : `Sir, how does TDEE affect my daily calorie intake and gym performance?`;

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
          <span className="text-amber-400 font-medium">BMR & TDEE</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5" />
            <span>Energy Expenditure</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
            BMR & TDEE <span className="text-amber-400">Calculator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Estimate your Basal Metabolic Rate (calories burned at rest) and Total Daily Energy Expenditure (daily calories burned with exercise) using the validated Mifflin-St Jeor formula.
          </p>
        </div>

        {/* Calculator Card */}
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
                    ? 'bg-amber-400 text-neutral-950 shadow'
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
                    ? 'bg-amber-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Imperial (lb / ft)
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 mb-2">Biological Sex</label>
              <div className="grid grid-cols-2 gap-3 max-w-sm">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'male'
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'female'
                      ? 'bg-amber-400 text-neutral-950 border-amber-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Age */}
              <div className="space-y-1.5">
                <label htmlFor="bmr-age" className="block text-xs font-bold text-neutral-200">
                  Age (years)
                </label>
                <input
                  id="bmr-age"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 25"
                  value={ageStr}
                  onChange={(e) => setAgeStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                {!ageStr.trim() && (
                  <p className="text-[11px] text-neutral-400">Enter your age.</p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label htmlFor="bmr-weight" className="block text-xs font-bold text-neutral-200">
                  Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  id="bmr-weight"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder={unitSystem === 'metric' ? 'e.g. 75' : 'e.g. 165'}
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                {!weightStr.trim() && (
                  <p className="text-[11px] text-neutral-400">Enter weight in {unitSystem === 'metric' ? 'kg' : 'lbs'}.</p>
                )}
              </div>

              {/* Height */}
              {unitSystem === 'metric' ? (
                <div className="space-y-1.5">
                  <label htmlFor="bmr-height" className="block text-xs font-bold text-neutral-200">
                    Height (cm)
                  </label>
                  <input
                    id="bmr-height"
                    type="number"
                    inputMode="decimal"
                    placeholder="e.g. 175"
                    value={heightCmStr}
                    onChange={(e) => setHeightCmStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                  {!heightCmStr.trim() && (
                    <p className="text-[11px] text-neutral-400">Enter height in cm.</p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label htmlFor="bmr-ft" className="block text-xs font-bold text-neutral-200">
                      Feet (ft)
                    </label>
                    <input
                      id="bmr-ft"
                      type="number"
                      placeholder="5"
                      value={heightFtStr}
                      onChange={(e) => setHeightFtStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="bmr-in" className="block text-xs font-bold text-neutral-200">
                      Inches (in)
                    </label>
                    <input
                      id="bmr-in"
                      type="number"
                      placeholder="9"
                      value={heightInStr}
                      onChange={(e) => setHeightInStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Activity Level Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-200">Daily Physical Activity Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {(Object.keys(ACTIVITY_MULTIPLIERS) as Array<keyof typeof ACTIVITY_MULTIPLIERS>).map((key) => {
                  const item = ACTIVITY_MULTIPLIERS[key];
                  const isSelected = activityLevel === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivityLevel(key)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 text-white'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs capitalize text-neutral-200">
                          {key.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {item.factor}x
                        </span>
                      </div>
                      <p className="text-[11px] leading-tight text-neutral-400">{item.label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            {canCalculate && bmrData && tdeeData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* BMR Card */}
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
                    <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">
                      Basal Metabolic Rate (BMR)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl sm:text-4xl font-black text-white">
                        {bmrData.bmr.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">kcal / day</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      Calories your body burns at complete rest just to keep vital organs functioning.
                    </p>
                  </div>

                  {/* TDEE Card */}
                  <div className="bg-neutral-950 p-6 rounded-2xl border border-amber-500/40 shadow-lg">
                    <span className="text-xs uppercase font-bold text-amber-400 block mb-1">
                      Total Daily Energy Expenditure (TDEE)
                    </span>
                    <div className="flex items-baseline gap-2">
                      <span className="font-heading text-3xl sm:text-4xl font-black text-amber-400">
                        {tdeeData.tdee.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-neutral-400">kcal / day</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                      Your maintenance energy level factoring in daily movement and workout sessions.
                    </p>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-neutral-950/60 rounded-2xl p-5 border border-neutral-800/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-400" />
                    <span>What Does This Result Mean?</span>
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    To maintain your current bodyweight, consume approximately <strong>{tdeeData.tdee} kcal</strong> daily. Eating roughly 300–400 kcal below this facilitates healthy fat loss, while eating 250–350 kcal above supports clean muscle growth.
                  </p>
                </div>

                {/* Next Actions */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    What should you do next?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Link
                      to="/tools/calories"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-amber-500/10 active:scale-98"
                    >
                      <span>Calculate Calorie & Macro Target</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      type="button"
                      onClick={handleAskAiAboutTdee}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Ask AI Coach About My Calories</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs space-y-1">
                <Flame className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-300">
                  Fill in your age, weight, height, and activity level above to calculate BMR & TDEE.
                </p>
                <p className="text-neutral-500">
                  The calculator updates automatically as you type.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
