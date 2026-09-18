import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateOneRepMax } from '../../utils/calculators';
import { UnitSystem } from '../../types';
import {
  Activity,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info,
  ArrowRight,
  Dumbbell,
} from 'lucide-react';

interface OneRepMaxPageProps {
  onAskAi?: (prompt: string) => void;
}

export const OneRepMaxPage: React.FC<OneRepMaxPageProps> = ({ onAskAi }) => {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Input states as strings for maximum reliability
  const [liftName, setLiftName] = useState<string>('Bench Press');
  const [weightStr, setWeightStr] = useState<string>('80');
  const [repsStr, setRepsStr] = useState<string>('6');

  const weightNum = parseFloat(weightStr);
  const repsNum = parseInt(repsStr, 10);

  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === 'imperial') {
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 2.20462).toString());
      }
    } else {
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 0.453592).toString());
      }
    }
    setUnitSystem(newUnit);
  };

  const isWeightValid = !isNaN(weightNum) && weightNum > 0 && weightNum <= 1000;
  const isRepsValid = !isNaN(repsNum) && repsNum >= 1 && repsNum <= 25;
  const canCalculate = isWeightValid && isRepsValid;

  let oneRepMaxData = null;
  if (canCalculate) {
    try {
      oneRepMaxData = calculateOneRepMax(weightNum, repsNum);
    } catch {
      // Safe fallback
    }
  }

  const handleAskAiAbout1RM = () => {
    const prompt = oneRepMaxData
      ? `Sir, my estimated 1RM for ${liftName} is ${oneRepMaxData.oneRepMax} ${unitSystem === 'metric' ? 'kg' : 'lbs'} (calculated from ${weightNum} ${unitSystem === 'metric' ? 'kg' : 'lbs'} x ${repsNum} reps). What percentage loading should I use for strength and muscle hypertrophy?`
      : `Sir, how should I safely test and calculate my 1RM for compound lifts?`;

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
          <span className="text-orange-400 font-medium">1RM Calculator</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>Strength & Heavy Loading</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
            1-Rep Max <span className="text-orange-400">Calculator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Estimate your single-repetition maximum without the injury risk of a dangerous true maximum lift, plus view complete percentage working loads.
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
                    ? 'bg-orange-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Metric (kg)
              </button>
              <button
                type="button"
                onClick={() => handleUnitSwitch('imperial')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-orange-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Imperial (lbs)
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Common Lift Preset */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 mb-2">Exercise</label>
              <div className="flex flex-wrap gap-2">
                {['Bench Press', 'Barbell Back Squat', 'Conventional Deadlift', 'Overhead Shoulder Press', 'Barbell Row'].map((lift) => (
                  <button
                    key={lift}
                    type="button"
                    onClick={() => setLiftName(lift)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      liftName === lift
                        ? 'bg-orange-500/10 border-orange-400 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    {lift}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="orm-weight" className="block text-xs font-bold text-neutral-200">
                  Weight Lifted ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  id="orm-weight"
                  type="number"
                  step="any"
                  placeholder={unitSystem === 'metric' ? 'e.g. 80' : 'e.g. 175'}
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                {!weightStr.trim() && (
                  <p className="text-[11px] text-neutral-400">Enter weight lifted.</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="orm-reps" className="block text-xs font-bold text-neutral-200">
                  Repetitions Completed (1–12 recommended)
                </label>
                <input
                  id="orm-reps"
                  type="number"
                  inputMode="numeric"
                  placeholder="e.g. 6"
                  value={repsStr}
                  onChange={(e) => setRepsStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                {!repsStr.trim() && (
                  <p className="text-[11px] text-neutral-400">Enter reps completed.</p>
                )}
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            {canCalculate && oneRepMaxData ? (
              <div className="space-y-6">
                {/* 1RM Highlight */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-orange-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-bold text-orange-400 block mb-1">
                      Estimated 1-Repetition Maximum ({liftName})
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                        {oneRepMaxData.oneRepMax}
                      </span>
                      <span className="text-xs font-bold text-neutral-400 uppercase">
                        {unitSystem === 'metric' ? 'kg' : 'lbs'}
                      </span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 border-neutral-800 pt-2 sm:pt-0">
                    <span className="text-xs uppercase font-bold text-neutral-400 block mb-1">Formula Reference</span>
                    <span className="text-xs font-bold text-neutral-300">Brzycki & Epley Composite</span>
                  </div>
                </div>

                {/* Percentage Loading Matrix */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Percentage Working Sets for {liftName}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                    {oneRepMaxData.percentages.map((p) => (
                      <div
                        key={p.percentage}
                        className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-orange-400">{p.percentage}%</span>
                          <span className="text-[10px] text-neutral-500 font-semibold">{p.repsEstimate} reps</span>
                        </div>
                        <div className="font-heading text-lg font-bold text-white">
                          {p.weight} <span className="text-xs text-neutral-400">{unitSystem === 'metric' ? 'kg' : 'lbs'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-neutral-950/60 rounded-2xl p-5 border border-neutral-800/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-orange-400" />
                    <span>What Does This Result Mean?</span>
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Most hypertrophy programs program heavy compound sets between <strong>70% to 85% of your 1RM</strong>. Use the 75% load for standard 8–10 rep working sets, and 85% for heavy strength 4–6 rep work.
                  </p>
                </div>

                {/* Next Actions */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    What should you do next?
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAskAiAbout1RM}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-orange-400 hover:bg-orange-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-orange-500/10 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Coach How to Program This Lift</span>
                    </button>

                    <Link
                      to="/progress"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
                    >
                      <span>Log Milestone in Progress Tracker</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs space-y-1">
                <Activity className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-300">
                  Enter weight lifted and reps completed above to view your 1RM and percentage load matrix.
                </p>
                <p className="text-neutral-500">
                  Formulas are most accurate when reps are between 1 and 10.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
