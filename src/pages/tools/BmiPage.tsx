import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateBMI, calculateHealthyWeightRange } from '../../utils/calculators';
import { UnitSystem } from '../../types';
import {
  Scale,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';

interface BmiPageProps {
  onAskAi?: (prompt: string) => void;
}

export const BmiPage: React.FC<BmiPageProps> = ({ onAskAi }) => {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // String states so users can freely clear, backspace, or type without unmounting or crashing
  const [weightStr, setWeightStr] = useState<string>('75');
  const [heightCmStr, setHeightCmStr] = useState<string>('175');
  const [heightFtStr, setHeightFtStr] = useState<string>('5');
  const [heightInStr, setHeightInStr] = useState<string>('9');

  // Numerical parsing
  const weightNum = parseFloat(weightStr);
  const heightCmNum = parseFloat(heightCmStr);
  const heightFtNum = parseFloat(heightFtStr);
  const heightInNum = parseFloat(heightInStr);

  // Unit conversion
  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === 'imperial') {
      // Metric to Imperial
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
      // Imperial to Metric
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 0.453592).toString());
      }
      const ft = !isNaN(heightFtNum) ? heightFtNum : 0;
      const inch = !isNaN(heightInNum) ? heightInNum : 0;
      if (ft > 0 || inch > 0) {
        const cm = Math.round((ft * 12 + inch) * 2.54);
        setHeightCmStr(cm.toString());
      }
    }
    setUnitSystem(newUnit);
  };

  // Effective metric values for calculation
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

  // Validation checks
  const isWeightValid = !isNaN(effectiveWeightKg) && effectiveWeightKg >= 20 && effectiveWeightKg <= 350;
  const isHeightValid = !isNaN(effectiveHeightCm) && effectiveHeightCm >= 70 && effectiveHeightCm <= 260;
  const canCalculate = isWeightValid && isHeightValid;

  let bmiData = null;
  let healthyRangeData = null;
  if (canCalculate) {
    try {
      bmiData = calculateBMI(effectiveWeightKg, effectiveHeightCm);
      healthyRangeData = calculateHealthyWeightRange(effectiveHeightCm);
    } catch {
      // Graceful fallback
    }
  }

  const handleAskAiAboutBmi = () => {
    const prompt = bmiData
      ? `Sir, my calculated BMI is ${bmiData.bmi} (${bmiData.category}). I weigh ${Math.round(effectiveWeightKg)} kg at a height of ${Math.round(effectiveHeightCm)} cm. What does this mean for my gym training, and should I focus on muscle gain or fat loss?`
      : `Sir, how should a beginner interpret their BMI for gym training?`;

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
          <span className="text-emerald-400 font-medium">BMI Calculator</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tools</span>
        </Link>

        {/* Page Title & Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>Body Mass Index</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
            BMI <span className="text-emerald-400">Calculator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Check your Body Mass Index (BMI) based on your height and weight. This provides a baseline population reference and healthy weight range estimation.
          </p>
        </div>

        {/* Main Calculator Card - ALWAYS RENDERED, NEVER UNMOUNTS */}
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
                    ? 'bg-emerald-400 text-neutral-950 shadow'
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
                    ? 'bg-emerald-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Imperial (lb / ft)
              </button>
            </div>
          </div>

          {/* Input Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Weight Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="bmi-weight-input" className="block text-xs font-bold text-neutral-200">
                Body Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
              </label>
              <input
                id="bmi-weight-input"
                type="number"
                inputMode="decimal"
                step="any"
                placeholder={unitSystem === 'metric' ? 'e.g. 75' : 'e.g. 165'}
                value={weightStr}
                onChange={(e) => setWeightStr(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
              />
              {!weightStr.trim() ? (
                <p className="text-[11px] text-neutral-400">
                  Please enter your body weight in {unitSystem === 'metric' ? 'kg' : 'lbs'}.
                </p>
              ) : !isWeightValid ? (
                <p className="text-[11px] text-amber-400">
                  Please enter a realistic weight (20–350 {unitSystem === 'metric' ? 'kg' : 'lbs'}).
                </p>
              ) : null}
            </div>

            {/* Height Input Field */}
            {unitSystem === 'metric' ? (
              <div className="space-y-1.5">
                <label htmlFor="bmi-height-cm" className="block text-xs font-bold text-neutral-200">
                  Height (cm)
                </label>
                <input
                  id="bmi-height-cm"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  placeholder="e.g. 175"
                  value={heightCmStr}
                  onChange={(e) => setHeightCmStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                {!heightCmStr.trim() ? (
                  <p className="text-[11px] text-neutral-400">
                    Please enter your height in centimeters.
                  </p>
                ) : !isHeightValid ? (
                  <p className="text-[11px] text-amber-400">
                    Please enter a realistic height (70–260 cm).
                  </p>
                ) : null}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="bmi-height-ft" className="block text-xs font-bold text-neutral-200">
                    Feet (ft)
                  </label>
                  <input
                    id="bmi-height-ft"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 5"
                    value={heightFtStr}
                    onChange={(e) => setHeightFtStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="bmi-height-in" className="block text-xs font-bold text-neutral-200">
                    Inches (in)
                  </label>
                  <input
                    id="bmi-height-in"
                    type="number"
                    inputMode="numeric"
                    placeholder="e.g. 9"
                    value={heightInStr}
                    onChange={(e) => setHeightInStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Clear / Reset Helper */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => {
                setWeightStr('');
                setHeightCmStr('');
                setHeightFtStr('');
                setHeightInStr('');
              }}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline transition-colors"
            >
              Clear inputs
            </button>
          </div>

          {/* Calculation Result Panel */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            {canCalculate && bmiData ? (
              <div className="space-y-6">
                {/* Result Highlights */}
                <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">
                      Your Body Mass Index (BMI)
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                        {bmiData.bmi}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${bmiData.colorClass}`}>
                        {bmiData.category}
                      </span>
                    </div>
                  </div>

                  {healthyRangeData && (
                    <div className="sm:text-right border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0">
                      <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">
                        Normal Healthy Range for your Height
                      </span>
                      <span className="text-base sm:text-lg font-bold text-emerald-400">
                        {unitSystem === 'metric'
                          ? `${healthyRangeData.minKg} kg – ${healthyRangeData.maxKg} kg`
                          : `${healthyRangeData.minLb} lbs – ${healthyRangeData.maxLb} lbs`}
                      </span>
                    </div>
                  )}
                </div>

                {/* What does this result mean? */}
                <div className="bg-neutral-950/60 rounded-2xl p-5 border border-neutral-800/80 space-y-3 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-400" />
                    <span>What Does This Result Mean?</span>
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    BMI is a standard screening metric calculated strictly from weight and height. It is useful as a broad benchmark, but it does not measure body fat directly.
                  </p>
                  <p className="text-neutral-400 text-xs leading-relaxed">
                    <strong>Gym Athlete Note:</strong> If you regularly lift weights or carry significant muscle mass, your BMI may read as "Overweight" even if your body fat is low and healthy. For a more comprehensive look at your composition, try our <strong>Body Fat Calculator</strong> or <strong>BMR & TDEE Calculator</strong>.
                  </p>
                </div>

                {/* What should I do next? Action Cards */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    What should you do next?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAskAiAboutBmi}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/10 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Coach About This Result</span>
                    </button>

                    <Link
                      to="/tools/bmr-tdee"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
                    >
                      <span>Calculate Daily Calories (TDEE)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs space-y-1">
                <Scale className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-300">
                  Enter your weight and height above to view your BMI and healthy weight band.
                </p>
                <p className="text-neutral-500">
                  The calculator updates automatically as you type.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* BMI Standard Reference Scale */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8">
          <h3 className="font-heading text-lg font-bold text-white mb-4">
            WHO BMI Reference Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="block text-amber-400 font-bold mb-1">&lt; 18.5</span>
              <span className="text-neutral-300 font-medium">Underweight</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-emerald-500/30">
              <span className="block text-emerald-400 font-bold mb-1">18.5 – 24.9</span>
              <span className="text-neutral-300 font-medium">Normal / Healthy</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="block text-amber-400 font-bold mb-1">25.0 – 29.9</span>
              <span className="text-neutral-300 font-medium">Overweight</span>
            </div>
            <div className="bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
              <span className="block text-rose-400 font-bold mb-1">30.0+</span>
              <span className="text-neutral-300 font-medium">Obesity Range</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
