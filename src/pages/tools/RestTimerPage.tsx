import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Info,
  Dumbbell,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';

type TimerState = 'ready' | 'running' | 'paused' | 'finished';

interface Preset {
  id: string;
  seconds: number;
  label: string;
  category: string;
  description: string;
}

const PRESETS: Preset[] = [
  {
    id: 'p-30',
    seconds: 30,
    label: '30 SEC',
    category: 'Short Rest',
    description: 'Quick conditioning, lighter sets & core work',
  },
  {
    id: 'p-60',
    seconds: 60,
    label: '60 SEC',
    category: 'General Rest',
    description: 'Standard machine & isolation arm/shoulder sets',
  },
  {
    id: 'p-90',
    seconds: 90,
    label: '90 SEC',
    category: 'Muscle Building',
    description: 'Optimal hypertrophy recovery between working sets',
  },
  {
    id: 'p-120',
    seconds: 120,
    label: '120 SEC',
    category: 'Heavy Exercises',
    description: 'Heavy compound squats, bench press & deadlifts',
  },
];

export const RestTimerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Initial duration resolution (from Workout Builder navigation or default 90s)
  const initialFromQuery = Number(searchParams.get('seconds'));
  const initialFromState = (location.state as any)?.restSeconds;
  const initialExerciseName = (location.state as any)?.exerciseName || searchParams.get('exercise');
  const resolvedInitial = !isNaN(initialFromQuery) && initialFromQuery > 0
    ? initialFromQuery
    : typeof initialFromState === 'number' && initialFromState > 0
    ? initialFromState
    : 90;

  const [totalSeconds, setTotalSeconds] = useState<number>(resolvedInitial);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(resolvedInitial);
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [exerciseContext, setExerciseContext] = useState<string | null>(initialExerciseName || null);

  // Custom Input State (Minutes & Seconds)
  const [customMinutes, setCustomMinutes] = useState<string>(Math.floor(resolvedInitial / 60).toString());
  const [customSeconds, setCustomSeconds] = useState<string>((resolvedInitial % 60).toString());
  const [customError, setCustomError] = useState<string | null>(null);

  // High-precision timing refs to prevent drift or multi-interval bugs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(resolvedInitial);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio safely on user click
  const getAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioContextRef.current = new AudioCtx();
      }
    }
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume().catch(() => {});
    }
    return audioContextRef.current;
  };

  // Play a pleasant two-tone completion chime
  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Tone 1: 587.33 Hz (D5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      // Tone 2: 880 Hz (A5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.22);
      gain2.gain.setValueAtTime(0.25, now + 0.22);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.22);
      osc2.stop(now + 0.6);
    } catch {
      // Audio playback restrictions handled gracefully
    }
  };

  // Stop active interval cleanly
  const clearActiveInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      clearActiveInterval();
    };
  }, []);

  // Timer Tick Engine
  const startInterval = (targetEndTime: number) => {
    clearActiveInterval();
    endTimeRef.current = targetEndTime;

    timerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      const remainingMs = targetEndTime - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setRemainingSeconds(remainingSec);

      if (remainingMs <= 0) {
        clearActiveInterval();
        setTimerState('finished');
        setRemainingSeconds(0);
        playCompletionChime();
      }
    }, 200);
  };

  // Action: Start Rest (from Ready or Finished)
  const handleStart = () => {
    getAudioContext(); // user gesture unlocks audio
    const duration = remainingSeconds === 0 ? totalSeconds : remainingSeconds;
    setRemainingSeconds(duration);
    setTimerState('running');
    const targetEndTime = Date.now() + duration * 1000;
    startInterval(targetEndTime);
  };

  // Action: Pause Rest
  const handlePause = () => {
    clearActiveInterval();
    if (endTimeRef.current) {
      const remainingMs = endTimeRef.current - Date.now();
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
      pausedRemainingRef.current = remainingSec;
      setRemainingSeconds(remainingSec);
    }
    setTimerState('paused');
  };

  // Action: Resume Rest
  const handleResume = () => {
    getAudioContext();
    const duration = pausedRemainingRef.current > 0 ? pausedRemainingRef.current : remainingSeconds;
    setTimerState('running');
    const targetEndTime = Date.now() + duration * 1000;
    startInterval(targetEndTime);
  };

  // Action: Reset
  const handleReset = () => {
    clearActiveInterval();
    setTimerState('ready');
    setRemainingSeconds(totalSeconds);
    pausedRemainingRef.current = totalSeconds;
  };

  // Action: Select Preset
  const handleSelectPreset = (seconds: number) => {
    clearActiveInterval();
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    pausedRemainingRef.current = seconds;
    setTimerState('ready');
    setCustomMinutes(Math.floor(seconds / 60).toString());
    setCustomSeconds((seconds % 60).toString());
    setCustomError(null);
  };

  // Action: Apply Custom Duration
  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const mins = parseInt(customMinutes, 10) || 0;
    const secs = parseInt(customSeconds, 10) || 0;
    const computedTotal = mins * 60 + secs;

    if (computedTotal <= 0) {
      setCustomError('Please enter a rest time greater than 0.');
      return;
    }
    if (computedTotal > 1800) {
      setCustomError('Maximum rest interval is 30 minutes.');
      return;
    }

    setCustomError(null);
    clearActiveInterval();
    setTotalSeconds(computedTotal);
    setRemainingSeconds(computedTotal);
    pausedRemainingRef.current = computedTotal;
    setTimerState('ready');
  };

  // Formatted display values
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  // Progress fraction (starts at 100% and drains to 0%, or fills from 0% to 100%)
  const progressPercent = totalSeconds > 0
    ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
    : 0;

  // Circular stroke calculations (radius: 44, circumference: ~276.46)
  const circleCircumference = 2 * Math.PI * 44;
  const strokeDashoffset = circleCircumference - (circleCircumference * (100 - progressPercent)) / 100;

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-36 sm:pb-24 text-neutral-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <Link to="/tools" className="hover:text-white transition-colors">Fitness Tools</Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-emerald-400 font-medium">Rest Timer</span>
        </nav>

        {/* Back Link */}
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all tools</span>
        </Link>

        {/* Header with Clear, Direct Purpose */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Between-Set Recovery</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase mb-2">
            Rest <span className="text-emerald-400">Timer</span>
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl">
            Use this timer between sets so you know when it&apos;s time to start your next set. Rest between sets. Choose a preset or set your own time.
          </p>

          {/* Exercise Context Badge if navigated from Workout Builder */}
          {exerciseContext && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-emerald-500/30 text-xs text-neutral-200">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                Selected for: <strong className="text-white">{exerciseContext}</strong> ({totalSeconds}s)
              </span>
            </div>
          )}
        </div>

        {/* MAIN TIMER PANEL */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl mb-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* Top Row: Sound Toggle & Status */}
          <div className="w-full flex items-center justify-between mb-6">
            {/* Timer State Pill */}
            <div className="flex items-center gap-2">
              <span
                id="timer-status-badge"
                className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border transition-colors ${
                  timerState === 'running'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                    : timerState === 'paused'
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : timerState === 'finished'
                    ? 'bg-emerald-400 text-neutral-950 border-emerald-400 font-bold'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                {timerState === 'running' && 'RESTING'}
                {timerState === 'paused' && 'PAUSED'}
                {timerState === 'finished' && 'REST COMPLETE'}
                {timerState === 'ready' && 'READY'}
              </span>
            </div>

            {/* Sound Toggle Button */}
            <button
              type="button"
              id="timer-sound-toggle-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 sm:px-3 sm:py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500 hover:text-neutral-300'
              }`}
              title={soundEnabled ? 'Completion chime enabled' : 'Muted'}
              aria-label={soundEnabled ? 'Turn sound off' : 'Turn sound on'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">
                {soundEnabled ? 'Sound: ON' : 'Sound: OFF'}
              </span>
            </button>
          </div>

          {/* CIRCULAR COUNTDOWN DISPLAY */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-neutral-800/80 stroke-current"
                strokeWidth="5"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className={`stroke-current transition-all duration-200 ease-linear ${
                  timerState === 'finished'
                    ? 'text-emerald-400'
                    : timerState === 'paused'
                    ? 'text-amber-400'
                    : 'text-emerald-400'
                }`}
                strokeWidth="5"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Central Countdown Text */}
            <div className="absolute flex flex-col items-center justify-center text-center px-4">
              <span
                id="timer-countdown-display"
                className={`font-heading font-black text-6xl sm:text-7xl tracking-tighter tabular-nums ${
                  timerState === 'finished'
                    ? 'text-emerald-400 animate-bounce'
                    : timerState === 'paused'
                    ? 'text-amber-400'
                    : 'text-white'
                }`}
              >
                {formattedTime}
              </span>

              {/* Context subtext */}
              <span className="text-xs font-semibold text-neutral-400 mt-1 max-w-[180px] leading-tight">
                {timerState === 'ready' && `Preset: ${totalSeconds} seconds`}
                {timerState === 'running' && 'Recovering energy...'}
                {timerState === 'paused' && 'Timer paused'}
                {timerState === 'finished' && 'Time to start your next set!'}
              </span>
            </div>
          </div>

          {/* MAIN CONTROL BUTTONS */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 my-6">
            {/* READY State: Start Rest */}
            {timerState === 'ready' && (
              <button
                type="button"
                id="timer-start-btn"
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2 py-4 px-10 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-98 transition-all min-w-[200px]"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Rest</span>
              </button>
            )}

            {/* RUNNING State: Pause & Reset */}
            {timerState === 'running' && (
              <>
                <button
                  type="button"
                  id="timer-pause-btn"
                  onClick={handlePause}
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-black text-base uppercase tracking-wider shadow-lg shadow-amber-500/25 active:scale-98 transition-all min-w-[150px]"
                >
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pause</span>
                </button>

                <button
                  type="button"
                  id="timer-running-reset-btn"
                  onClick={handleReset}
                  className="p-4 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                  title="Reset Timer"
                  aria-label="Reset Timer"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </>
            )}

            {/* PAUSED State: Resume & Reset */}
            {timerState === 'paused' && (
              <>
                <button
                  type="button"
                  id="timer-resume-btn"
                  onClick={handleResume}
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-98 transition-all min-w-[150px]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Resume</span>
                </button>

                <button
                  type="button"
                  id="timer-paused-reset-btn"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </>
            )}

            {/* FINISHED State: Start Again & Reset */}
            {timerState === 'finished' && (
              <>
                <button
                  type="button"
                  id="timer-again-btn"
                  onClick={handleStart}
                  className="inline-flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/25 active:scale-98 transition-all min-w-[170px]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Again</span>
                </button>

                <button
                  type="button"
                  id="timer-finished-reset-btn"
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
              </>
            )}
          </div>

          {/* PRESETS SECTION */}
          <div className="w-full border-t border-neutral-800 pt-6 mt-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3.5">
              Quick Interval Presets
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {PRESETS.map((preset) => {
                const isSelected = totalSeconds === preset.seconds;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset.seconds)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-sm ring-1 ring-emerald-400/40'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-950/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-black text-sm text-emerald-400">
                        {preset.label}
                      </span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        {preset.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 block leading-tight">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CUSTOM TIMER INPUT */}
          <div className="w-full border-t border-neutral-800 pt-6 mt-6">
            <div className="flex items-center justify-center gap-1.5 mb-3 text-xs font-bold text-neutral-400 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Custom Rest Duration</span>
            </div>

            <form onSubmit={handleApplyCustom} className="max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={customMinutes}
                    onChange={(e) => {
                      setCustomMinutes(e.target.value);
                      if (customError) setCustomError(null);
                    }}
                    placeholder="0"
                    aria-label="Custom rest minutes"
                    className="w-12 bg-transparent text-center font-heading font-bold text-white text-base focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-neutral-400">min</span>
                </div>

                <span className="text-neutral-500 font-bold">:</span>

                <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2">
                  <input
                    type="number"
                    min={0}
                    max={59}
                    value={customSeconds}
                    onChange={(e) => {
                      setCustomSeconds(e.target.value);
                      if (customError) setCustomError(null);
                    }}
                    placeholder="0"
                    aria-label="Custom rest seconds"
                    className="w-12 bg-transparent text-center font-heading font-bold text-white text-base focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-neutral-400">sec</span>
                </div>

                <button
                  type="submit"
                  id="set-custom-timer-btn"
                  className="py-2.5 px-5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-heading font-bold text-xs uppercase tracking-wider transition-colors border border-neutral-700"
                >
                  Set Timer
                </button>
              </div>

              {/* Inline Validation Error if any */}
              {customError && (
                <p className="text-rose-400 text-xs mt-2 font-medium">
                  {customError}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* EDUCATIONAL SECTION: HOW MUCH REST SHOULD I TAKE? */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 mb-8">
          <h3 className="font-heading text-lg sm:text-xl font-bold text-white flex items-center gap-2 uppercase tracking-tight">
            <Info className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>How Much Rest Should I Take?</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Resting between sets allows your muscular phosphocreatine and ATP energy stores to replenish, helping you lift with maximal intensity on your next set. Here are simple, practical benchmarks:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase text-emerald-400 block">
                30–60 Seconds
              </span>
              <span className="text-xs font-semibold text-white block">
                Short or Lighter Sets
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Often used for shorter, lighter isolation exercises (biceps, triceps, lateral raises) or circuit conditioning.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase text-emerald-400 block">
                60–90 Seconds
              </span>
              <span className="text-xs font-semibold text-white block">
                General Training Sets
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Common for many general training and hypertrophy sets on machine presses, rows, and dumbbell work.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5">
              <span className="font-heading font-bold text-xs uppercase text-amber-400 block">
                90–120+ Seconds
              </span>
              <span className="text-xs font-semibold text-white block">
                Heavy Strength Sets
              </span>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Often useful for heavier strength-focused exercises (Barbell Squat, Bench Press, Deadlift) where central fatigue is high.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-neutral-500 pt-1 italic">
            *These guidelines are for workout convenience and standard bodybuilding practice, not medical advice. Always adjust rest based on your individual recovery and breathing.
          </p>
        </div>

        {/* WORKOUT INTEGRATION LINKS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/workout-builder"
            className="inline-flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-98"
          >
            <Dumbbell className="w-4 h-4" />
            <span>Open Workout Builder</span>
          </Link>

          <Link
            to="/exercises"
            className="inline-flex items-center justify-center gap-2 p-4 rounded-2xl bg-neutral-900 hover:bg-neutral-850 text-white text-xs font-bold border border-neutral-800 transition-colors"
          >
            <span>Browse Exercise Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
