import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { calculateBodyFat } from '../../utils/calculators';
import { UnitSystem } from '../../types';
import {
  Zap,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  Info,
  ArrowRight,
  Scale,
} from 'lucide-react';

interface BodyFatPageProps {
  onAskAi?: (prompt: string) => void;
}

export const BodyFatPage: React.FC<BodyFatPageProps> = ({ onAskAi }) => {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric');

  // Input states as strings
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weightStr, setWeightStr] = useState<string>('75');
  const [heightCmStr, setHeightCmStr] = useState<string>('175');
  const [heightFtStr, setHeightFtStr] = useState<string>('5');
  const [heightInStr, setHeightInStr] = useState<string>('9');
  const [waistStr, setWaistStr] = useState<string>('82');
  const [neckStr, setNeckStr] = useState<string>('38');
  const [hipStr, setHipStr] = useState<string>('98'); // for females

  const weightNum = parseFloat(weightStr);
  const heightCmNum = parseFloat(heightCmStr);
  const heightFtNum = parseFloat(heightFtStr);
  const heightInNum = parseFloat(heightInStr);
  const waistNum = parseFloat(waistStr);
  const neckNum = parseFloat(neckStr);
  const hipNum = parseFloat(hipStr);

  const handleUnitSwitch = (newUnit: UnitSystem) => {
    if (newUnit === unitSystem) return;

    if (newUnit === 'imperial') {
      if (!isNaN(weightNum) && weightNum > 0) {
        setWeightStr(Math.round(weightNum * 2.20462).toString());
      }
      if (!isNaN(heightCmNum) && heightCmNum > 0) {
        const totalInches = heightCmNum / 2.54;
        setHeightFtStr(Math.floor(totalInches / 12).toString());
        setHeightInStr(Math.round(totalInches % 12).toString());
      }
      if (!isNaN(waistNum) && waistNum > 0) {
        setWaistStr((waistNum / 2.54).toFixed(1));
      }
      if (!isNaN(neckNum) && neckNum > 0) {
        setNeckStr((neckNum / 2.54).toFixed(1));
      }
      if (!isNaN(hipNum) && hipNum > 0) {
        setHipStr((hipNum / 2.54).toFixed(1));
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
      if (!isNaN(waistNum) && waistNum > 0) {
        setWaistStr(Math.round(waistNum * 2.54).toString());
      }
      if (!isNaN(neckNum) && neckNum > 0) {
        setNeckStr(Math.round(neckNum * 2.54).toString());
      }
      if (!isNaN(hipNum) && hipNum > 0) {
        setHipStr(Math.round(hipNum * 2.54).toString());
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

  const effectiveWaistCm =
    unitSystem === 'metric' ? waistNum : !isNaN(waistNum) ? waistNum * 2.54 : NaN;

  const effectiveNeckCm =
    unitSystem === 'metric' ? neckNum : !isNaN(neckNum) ? neckNum * 2.54 : NaN;

  const effectiveHipCm =
    unitSystem === 'metric' ? hipNum : !isNaN(hipNum) ? hipNum * 2.54 : NaN;

  const isBasicValid =
    !isNaN(effectiveWeightKg) &&
    !isNaN(effectiveHeightCm) &&
    !isNaN(effectiveWaistCm) &&
    !isNaN(effectiveNeckCm) &&
    effectiveWaistCm > effectiveNeckCm;

  const canCalculate =
    gender === 'male' ? isBasicValid : isBasicValid && !isNaN(effectiveHipCm);

  let bodyFatData = null;
  if (canCalculate) {
    try {
      bodyFatData = calculateBodyFat(
        gender,
        effectiveHeightCm,
        effectiveNeckCm,
        effectiveWaistCm,
        gender === 'female' ? effectiveHipCm : 0,
        effectiveWeightKg
      );
    } catch {
      // Safe fallback
    }
  }

  const handleAskAiAboutBodyFat = () => {
    const prompt = bodyFatData
      ? `Sir, my estimated body fat is ${bodyFatData.bodyFatPercent}% (${bodyFatData.category}) using the Navy circumference method. I weigh ${Math.round(effectiveWeightKg)} kg with ~${bodyFatData.leanMassKg} kg lean mass. Should I aim to cut fat or build muscle first?`
      : `Sir, what is a healthy body fat percentage for natural lifters?`;

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
          <span className="text-cyan-400 font-medium">Body Fat</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>US Navy Body Composition</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-black tracking-tight text-white uppercase mb-2">
            Body Fat <span className="text-cyan-400">Calculator</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Estimate your body fat percentage, lean muscle mass, and fat mass using the validated US Navy circumference method.
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
                    ? 'bg-cyan-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                type="button"
                onClick={() => handleUnitSwitch('imperial')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  unitSystem === 'imperial'
                    ? 'bg-cyan-400 text-neutral-950 shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Imperial (in / lbs)
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Sex */}
            <div>
              <label className="block text-xs font-bold text-neutral-200 mb-2">Biological Sex</label>
              <div className="grid grid-cols-2 gap-3 max-w-xs">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-2 px-4 rounded-xl text-xs font-bold border transition-colors ${
                    gender === 'male'
                      ? 'bg-cyan-400 text-neutral-950 border-cyan-400 shadow'
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
                      ? 'bg-cyan-400 text-neutral-950 border-cyan-400 shadow'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Weight & Height */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="bf-weight" className="block text-xs font-bold text-neutral-200">
                  Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
                </label>
                <input
                  id="bf-weight"
                  type="number"
                  step="any"
                  placeholder={unitSystem === 'metric' ? '75' : '165'}
                  value={weightStr}
                  onChange={(e) => setWeightStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
              </div>

              {unitSystem === 'metric' ? (
                <div className="space-y-1.5">
                  <label htmlFor="bf-height" className="block text-xs font-bold text-neutral-200">Height (cm)</label>
                  <input
                    id="bf-height"
                    type="number"
                    placeholder="175"
                    value={heightCmStr}
                    onChange={(e) => setHeightCmStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label htmlFor="bf-ft" className="block text-xs font-bold text-neutral-200">Feet</label>
                    <input
                      id="bf-ft"
                      type="number"
                      placeholder="5"
                      value={heightFtStr}
                      onChange={(e) => setHeightFtStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="bf-in" className="block text-xs font-bold text-neutral-200">Inches</label>
                    <input
                      id="bf-in"
                      type="number"
                      placeholder="9"
                      value={heightInStr}
                      onChange={(e) => setHeightInStr(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Circumferences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="bf-waist" className="block text-xs font-bold text-neutral-200">
                  Waist at Navel ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  id="bf-waist"
                  type="number"
                  step="any"
                  placeholder={unitSystem === 'metric' ? '82' : '32'}
                  value={waistStr}
                  onChange={(e) => setWaistStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-neutral-500">Measure horizontally at belly button, relaxed.</p>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="bf-neck" className="block text-xs font-bold text-neutral-200">
                  Neck Circumference ({unitSystem === 'metric' ? 'cm' : 'inches'})
                </label>
                <input
                  id="bf-neck"
                  type="number"
                  step="any"
                  placeholder={unitSystem === 'metric' ? '38' : '15'}
                  value={neckStr}
                  onChange={(e) => setNeckStr(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                />
                <p className="text-[10px] text-neutral-500">Measure just below Adam's apple.</p>
              </div>

              {gender === 'female' && (
                <div className="space-y-1.5">
                  <label htmlFor="bf-hip" className="block text-xs font-bold text-neutral-200">
                    Hip Circumference ({unitSystem === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    id="bf-hip"
                    type="number"
                    step="any"
                    placeholder={unitSystem === 'metric' ? '98' : '38.5'}
                    value={hipStr}
                    onChange={(e) => setHipStr(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-neutral-500">Widest point around buttocks.</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Display */}
          <div className="mt-8 pt-8 border-t border-neutral-800">
            {canCalculate && bodyFatData ? (
              <div className="space-y-6">
                <div className="bg-neutral-950 p-6 rounded-2xl border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-cyan-400 block mb-1">
                      Estimated Body Fat Percentage
                    </span>
                    <div className="flex items-baseline gap-3">
                      <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                        {bodyFatData.bodyFatPercent}%
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/40 text-cyan-300 bg-cyan-950/40">
                        {bodyFatData.category}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t sm:border-t-0 border-neutral-800 pt-3 sm:pt-0 w-full sm:w-auto">
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Lean Mass</span>
                      <span className="text-base font-bold text-emerald-400">{bodyFatData.leanMassKg} kg</span>
                    </div>
                    <div className="bg-neutral-900/80 p-3 rounded-xl border border-neutral-800">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-0.5">Fat Mass</span>
                      <span className="text-base font-bold text-rose-400">{bodyFatData.fatMassKg} kg</span>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-neutral-950/60 rounded-2xl p-5 border border-neutral-800/80 space-y-2 text-xs sm:text-sm">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span>What Does This Result Mean?</span>
                  </h3>
                  <p className="text-neutral-300 leading-relaxed">
                    Circumference formulas offer a practical and repeatable estimate without expensive DEXA scans. Track this number every 3 to 4 weeks under identical morning conditions to verify that weight loss is primarily coming from body fat, not hard-earned muscle!
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
                      onClick={handleAskAiAboutBodyFat}
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-neutral-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/10 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Ask AI Coach: Should I Cut or Bulk?</span>
                    </button>

                    <Link
                      to="/tools/calories"
                      className="inline-flex items-center justify-center gap-2 p-3.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-white text-xs font-bold border border-neutral-700 transition-colors"
                    >
                      <span>Calculate Calorie & Macro Intake</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-neutral-400 text-xs space-y-1">
                <Zap className="w-8 h-8 mx-auto text-neutral-600 mb-2" />
                <p className="font-semibold text-neutral-300">
                  Enter your circumference tape measurements above to calculate body fat.
                </p>
                <p className="text-neutral-500">
                  Make sure waist measurement is larger than neck measurement.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
