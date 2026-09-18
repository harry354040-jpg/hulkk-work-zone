import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Sliders } from 'lucide-react';

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

export const RestTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(90);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90);
  const [timerState, setTimerState] = useState<TimerState>('ready');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Custom Input State
  const [customMinutes, setCustomMinutes] = useState<string>('1');
  const [customSeconds, setCustomSeconds] = useState<string>('30');
  const [customError, setCustomError] = useState<string | null>(null);

  // High-precision timing refs to prevent drift or multi-interval bugs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(90);
  const audioContextRef = useRef<AudioContext | null>(null);

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

  const playCompletionChime = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
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

  const clearActiveInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearActiveInterval();
    };
  }, []);

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

  const handleStart = () => {
    getAudioContext();
    const duration = remainingSeconds === 0 ? totalSeconds : remainingSeconds;
    setRemainingSeconds(duration);
    setTimerState('running');
    const targetEndTime = Date.now() + duration * 1000;
    startInterval(targetEndTime);
  };

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

  const handleResume = () => {
    getAudioContext();
    const duration = pausedRemainingRef.current > 0 ? pausedRemainingRef.current : remainingSeconds;
    setTimerState('running');
    const targetEndTime = Date.now() + duration * 1000;
    startInterval(targetEndTime);
  };

  const handleReset = () => {
    clearActiveInterval();
    setTimerState('ready');
    setRemainingSeconds(totalSeconds);
    pausedRemainingRef.current = totalSeconds;
  };

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

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const progressPercent = totalSeconds > 0
    ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100
    : 0;

  const circleCircumference = 2 * Math.PI * 44;
  const strokeDashoffset = circleCircumference - (circleCircumference * (100 - progressPercent)) / 100;

  return (
    <section id="timer" className="py-12 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Clock className="w-3.5 h-3.5" />
            <span>Between-Set Recovery</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Rest <span className="text-emerald-400">Timer</span>
          </h2>
          <p className="text-neutral-300 text-xs sm:text-sm mt-1">
            Rest between sets. Choose a preset or set your own time.
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          {/* Header Controls */}
          <div className="w-full flex items-center justify-between mb-4">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
              timerState === 'running'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : timerState === 'paused'
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : timerState === 'finished'
                ? 'bg-emerald-400 text-neutral-950 border-emerald-400 font-bold'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}>
              {timerState === 'running' && 'RESTING'}
              {timerState === 'paused' && 'PAUSED'}
              {timerState === 'finished' && 'REST COMPLETE'}
              {timerState === 'ready' && 'READY'}
            </span>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 transition-colors ${
                soundEnabled
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-neutral-950 border-neutral-800 text-neutral-500'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{soundEnabled ? 'Sound: ON' : 'Sound: OFF'}</span>
            </button>
          </div>

          {/* Circular Countdown */}
          <div className="relative w-56 h-56 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-neutral-800 stroke-current"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-current text-emerald-400 transition-all duration-200 ease-linear"
                strokeWidth="5"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center px-4">
              <span className="font-heading font-black text-5xl text-white tracking-tighter tabular-nums">
                {formattedTime}
              </span>
              <span className="text-[11px] font-semibold text-neutral-400 mt-1">
                {timerState === 'ready' && `Preset: ${totalSeconds}s`}
                {timerState === 'running' && 'Resting...'}
                {timerState === 'paused' && 'Paused'}
                {timerState === 'finished' && 'Next set!'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 my-5">
            {timerState === 'ready' && (
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center justify-center gap-2 py-3 px-8 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-sm uppercase tracking-wider transition-all min-w-[150px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Rest</span>
              </button>
            )}

            {timerState === 'running' && (
              <>
                <button
                  type="button"
                  onClick={handlePause}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-heading font-black text-sm uppercase tracking-wider transition-all min-w-[120px]"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            {timerState === 'paused' && (
              <>
                <button
                  type="button"
                  onClick={handleResume}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-sm uppercase tracking-wider transition-all min-w-[120px]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            {timerState === 'finished' && (
              <>
                <button
                  type="button"
                  onClick={handleStart}
                  className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-heading font-black text-sm uppercase tracking-wider transition-all min-w-[140px]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Again</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-3 rounded-2xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Presets */}
          <div className="w-full border-t border-neutral-800 pt-5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block text-center mb-3">
              Quick Presets
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.seconds)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    totalSeconds === preset.seconds
                      ? 'bg-emerald-500/15 border-emerald-400 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="font-heading font-bold text-xs block text-emerald-400">{preset.label}</span>
                  <span className="text-[10px] text-neutral-500 block">{preset.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Input */}
          <div className="w-full border-t border-neutral-800 pt-4 mt-4">
            <form onSubmit={handleApplyCustom} className="flex items-center justify-center gap-2">
              <input
                type="number"
                min={0}
                max={30}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="0"
                className="w-12 bg-neutral-950 border border-neutral-800 rounded-lg p-1.5 text-center text-xs text-white"
              />
              <span className="text-xs text-neutral-400">m</span>
              <input
                type="number"
                min={0}
                max={59}
                value={customSeconds}
                onChange={(e) => setCustomSeconds(e.target.value)}
                placeholder="0"
                className="w-12 bg-neutral-950 border border-neutral-800 rounded-lg p-1.5 text-center text-xs text-white"
              />
              <span className="text-xs text-neutral-400">s</span>
              <button
                type="submit"
                className="py-1.5 px-3 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
              >
                Set
              </button>
            </form>
            {customError && <p className="text-rose-400 text-[11px] text-center mt-1">{customError}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};
