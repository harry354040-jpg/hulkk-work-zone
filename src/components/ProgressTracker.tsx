import React, { useState, useEffect } from 'react';
import { ProgressEntry } from '../types';
import {
  TrendingUp,
  Plus,
  Trash2,
  Download,
  Calendar,
  Scale,
  Dumbbell,
  Check,
  AlertCircle,
} from 'lucide-react';

const STORAGE_KEY = 'hwz_progress_logs';

export const ProgressTracker: React.FC = () => {
  const [logs, setLogs] = useState<ProgressEntry[]>([]);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [weightKg, setWeightKg] = useState<number>(75);
  const [benchPr, setBenchPr] = useState<number>(80);
  const [squatPr, setSquatPr] = useState<number>(100);
  const [deadliftPr, setDeadliftPr] = useState<number>(130);
  const [notes, setNotes] = useState<string>('Strong workout today, progressive overload felt solid.');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLogs(parsed);
          return;
        }
      }
    } catch (e) {
      console.error('Error loading progress logs:', e);
    }

    // Default sample logs if empty
    const initialLogs: ProgressEntry[] = [
      {
        id: 'log-1',
        date: '2025-01-15',
        weightKg: 78.5,
        benchPrKg: 75,
        squatPrKg: 95,
        deadliftPrKg: 120,
        notes: 'Started structured strength routine at Hulk’s Work Zone.',
      },
      {
        id: 'log-2',
        date: '2025-02-10',
        weightKg: 77.0,
        benchPrKg: 80,
        squatPrKg: 105,
        deadliftPrKg: 130,
        notes: 'Noticeable upper chest definition and core stability.',
      },
    ];
    setLogs(initialLogs);
  }, []);

  const saveToStorage = (updated: ProgressEntry[]) => {
    setLogs(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ProgressEntry = {
      id: `entry-${Date.now()}`,
      date,
      weightKg: Number(weightKg) || undefined,
      benchPrKg: Number(benchPr) || undefined,
      squatPrKg: Number(squatPr) || undefined,
      deadliftPrKg: Number(deadliftPr) || undefined,
      notes: notes.trim() || undefined,
    };

    const updated = [newEntry, ...logs];
    saveToStorage(updated);
    setShowAddForm(false);
    setNotes('');
  };

  const handleDeleteLog = (id: string) => {
    const updated = logs.filter((l) => l.id !== id);
    saveToStorage(updated);
  };

  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const header = 'Date,Weight(kg),Bench(kg),Squat(kg),Deadlift(kg),Notes\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.date}","${l.weightKg || ''}","${l.benchPrKg || ''}","${l.squatPrKg || ''}","${
            l.deadliftPrKg || ''
          }","${(l.notes || '').replace(/"/g, '""')}"`
      )
      .join('\n');

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hulks_work_zone_progress_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find best PRs
  const maxBench = Math.max(...logs.map((l) => l.benchPrKg || 0), 0);
  const maxSquat = Math.max(...logs.map((l) => l.squatPrKg || 0), 0);
  const maxDeadlift = Math.max(...logs.map((l) => l.deadliftPrKg || 0), 0);

  return (
    <section id="progress" className="py-16 sm:py-24 bg-neutral-900/30 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Personal Record Log</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white uppercase tracking-tight">
            Progress & PR <span className="text-emerald-400">Tracker</span>
          </h2>
          <p className="text-neutral-300 text-sm sm:text-base mt-2.5 leading-relaxed">
            Record your personal strength milestones, bodyweight fluctuations, and gym journal entries securely saved in your browser.
          </p>
        </div>

        {/* PR Stats Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-neutral-400 font-semibold block">BENCH PR</span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-white mt-1 block">
              {maxBench ? `${maxBench} kg` : '—'}
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-neutral-400 font-semibold block">SQUAT PR</span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">
              {maxSquat ? `${maxSquat} kg` : '—'}
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-neutral-400 font-semibold block">DEADLIFT PR</span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-lime-400 mt-1 block">
              {maxDeadlift ? `${maxDeadlift} kg` : '—'}
            </span>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-2xl text-center">
            <span className="text-xs text-neutral-400 font-semibold block">TOTAL ENTRIES</span>
            <span className="font-heading text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">
              {logs.length}
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel New Entry' : 'Log New Milestone'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold text-neutral-300 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:text-white transition-colors disabled:opacity-40"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Add Entry Form Modal / Slide-down */}
        {showAddForm && (
          <form
            onSubmit={handleAddLog}
            className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 mb-8 shadow-2xl animate-in fade-in duration-200"
          >
            <h3 className="font-heading text-lg font-bold text-white mb-4">
              Record New Milestone / Measurement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5 mb-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Bodyweight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Bench PR (kg)</label>
                <input
                  type="number"
                  value={benchPr}
                  onChange={(e) => setBenchPr(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Squat PR (kg)</label>
                <input
                  type="number"
                  value={squatPr}
                  onChange={(e) => setSquatPr(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Deadlift PR (kg)</label>
                <input
                  type="number"
                  value={deadliftPr}
                  onChange={(e) => setDeadliftPr(Number(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Training Notes</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Reps, feel, workout highlights..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="py-2 px-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-5 rounded-xl text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm"
              >
                Save Log
              </button>
            </div>
          </form>
        )}

        {/* History Table */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-900/80 text-[11px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Bodyweight</th>
                  <th className="py-3.5 px-4">Bench Press</th>
                  <th className="py-3.5 px-4">Squat</th>
                  <th className="py-3.5 px-4">Deadlift</th>
                  <th className="py-3.5 px-4">Notes</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-850">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-900/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                      {log.date}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {log.weightKg ? `${log.weightKg} kg` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                      {log.benchPrKg ? `${log.benchPrKg} kg` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                      {log.squatPrKg ? `${log.squatPrKg} kg` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400 whitespace-nowrap">
                      {log.deadliftPrKg ? `${log.deadliftPrKg} kg` : '—'}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 max-w-xs truncate">
                      {log.notes || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteLog(log.id)}
                        aria-label="Delete entry"
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length === 0 && (
            <div className="py-12 text-center text-xs text-neutral-500">
              No entries logged yet. Tap "Log New Milestone" to record your first workout entry!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
