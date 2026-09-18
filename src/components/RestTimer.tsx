import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Bell } from 'lucide-react';

export const RestTimer: React.FC = () => {
  const [totalSeconds, setTotalSeconds] = useState<number>(90);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(90);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const presets = [
    { label: '30s (Metabolic)', seconds: 30 },
    { label: '60s (Isolation)', seconds: 60 },
    { label: '90s (Hypertrophy)', seconds: 90 },
    { label: '120s (Compounds)', seconds: 120 },
    { label: '180s (Heavy Power)', seconds: 180 },
  ];

  // Sound beep using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            playBeep();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (remainingSeconds === 0) {
      setIsRunning(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, soundEnabled]);

  const handleSelectPreset = (sec: number) => {
    setTotalSeconds(sec);
    setRemainingSeconds(sec);
    setIsRunning(false);
  };

  const handleTogglePlay = () => {
    if (remainingSeconds === 0) {
      setRemainingSeconds(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(totalSeconds);
  };

  // Progress percentage
  const progressPct = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <section id="timer" className="py-16 sm:py-20 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Set Rest Intervals</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white uppercase tracking-tight">
            Rest Interval <span className="text-emerald-400">Timer</span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1.5">
            Time your rest intervals between heavy sets for optimal neuromuscular recovery and ATP replenishment.
          </p>
        </div>

        {/* Timer Box */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col items-center">
          {/* Circular Countdown Progress */}
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-neutral-800 stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="50"
                cy="50"
                r="44"
                className="text-emerald-400 stroke-current transition-all duration-300 ease-linear"
                strokeWidth="7"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPct) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Centered Digital Counter */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-heading font-black text-4xl sm:text-5xl text-white tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest mt-1">
                {isRunning ? 'Resting...' : remainingSeconds === 0 ? 'Set Complete! 🔥' : 'Ready'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`inline-flex items-center justify-center gap-2 py-3 px-8 rounded-2xl font-bold text-sm transition-all shadow-lg min-w-[140px] ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-amber-500/20'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-emerald-500/20'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{remainingSeconds === 0 ? 'Restart' : 'Start Rest'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              title="Reset Timer"
              aria-label="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white border border-neutral-700 transition-colors"
              title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <VolumeX className="w-5 h-5 text-neutral-500" />
              )}
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="w-full pt-6 border-t border-neutral-800">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block text-center mb-3">
              Quick Interval Presets
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.seconds}
                  type="button"
                  onClick={() => handleSelectPreset(preset.seconds)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    totalSeconds === preset.seconds
                      ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/40'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800/80 hover:bg-neutral-850'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
