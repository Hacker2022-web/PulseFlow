import React, { useState } from 'react';
import {
  CheckCircle2,
  Flame,
  Plus,
  Clock,
  Sparkles,
  Users2,
  PauseCircle,
  PlayCircle,
  Archive,
  Trash2,
  Check,
  Droplets,
  BookOpen,
  Dumbbell,
  Apple,
  Zap,
  Coffee,
  Heart,
  Moon,
  Footprints,
  Brain
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HabitFrequency } from '../../types';

export const HabitsView: React.FC = () => {
  const {
    habits,
    habitLogs,
    toggleHabitToday,
    getHabitStreak,
    addHabit,
    deleteHabit,
    setHabitStatus,
    toggleItemSharing
  } = useApp();

  const [activeTabFilter, setActiveTabFilter] = useState<'active' | 'paused' | 'archived'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for creating habit
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Sparkles');
  const [color, setColor] = useState('#6366f1');
  const [frequency, setFrequency] = useState<HabitFrequency>('daily');
  const [reminderTime, setReminderTime] = useState('08:00');
  const [sharedWithPartner, setSharedWithPartner] = useState(true);

  const filteredHabits = habits.filter(h => h.status === activeTabFilter);

  const availableIcons = [
    { name: 'Sparkles', icon: Sparkles },
    { name: 'Droplets', icon: Droplets },
    { name: 'BookOpen', icon: BookOpen },
    { name: 'Dumbbell', icon: Dumbbell },
    { name: 'Apple', icon: Apple },
    { name: 'Zap', icon: Zap },
    { name: 'Coffee', icon: Coffee },
    { name: 'Heart', icon: Heart },
    { name: 'Moon', icon: Moon },
    { name: 'Footprints', icon: Footprints },
    { name: 'Brain', icon: Brain }
  ];

  const availableColors = [
    '#6366f1', // Indigo Accent
    '#8b5cf6', // Electric Violet
    '#38bdf8', // Cyan Glow
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ec4899', // Pink
    '#f43f5e'  // Rose
  ];

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      userId: 'user_primary_001',
      name: name.trim(),
      icon,
      color,
      frequency,
      reminderTime: reminderTime || undefined,
      sharedWithPartner,
      status: 'active'
    });

    setName('');
    setIsAddModalOpen(false);
  };

  // Helper to render heatmap for a habit for past 45 days
  const renderHeatmap = (habitId: string) => {
    const today = new Date();
    const days: { dateStr: string; completed: boolean; label: string }[] = [];

    for (let i = 44; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const log = habitLogs.find(l => l.habitId === habitId && l.date === dateStr);
      days.push({
        dateStr,
        completed: Boolean(log?.completed),
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });
    }

    return (
      <div className="pt-3 pb-1">
        <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-2 font-mono">
          <span>45-Day Consistency Heatmap</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-white/[0.04] border border-white/10" /> Missed
            <span className="w-2.5 h-2.5 rounded bg-gradient-to-r from-indigo-500 to-violet-500 ml-2 shadow-[0_0_8px_rgba(99,102,241,0.5)]" /> Done
          </span>
        </div>
        <div className="grid grid-flow-col grid-rows-3 gap-1.5 overflow-x-auto pb-1">
          {days.map((day) => (
            <div
              key={day.dateStr}
              title={`${day.label}: ${day.completed ? 'Completed' : 'Missed'}`}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-all heatmap-cell ${
                day.completed
                  ? 'bg-gradient-to-tr from-indigo-500 to-violet-400 shadow-[0_0_8px_rgba(99,102,241,0.4)]'
                  : 'bg-white/[0.04] border border-white/10 hover:border-white/25'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Habit Tracker
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-medium">
            Build consistency, visualize streaks, and stay accountable with your partner.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex liquid-glass-subtle rounded-xl p-1 text-xs font-semibold">
            {(['active', 'paused', 'archived'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTabFilter(filter)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                  activeTabFilter === filter
                    ? 'liquid-glass-pill text-white font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHabits.length === 0 ? (
          <div className="col-span-full py-16 text-center liquid-glass rounded-3xl p-8 border border-white/10">
            <Sparkles className="w-10 h-10 text-indigo-300 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white">No {activeTabFilter} habits found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
              Get started by adding a routine you want to stick to daily or weekly.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition-all"
            >
              Create First Habit
            </button>
          </div>
        ) : (
          filteredHabits.map((habit) => {
            const streak = getHabitStreak(habit.id);
            return (
              <div
                key={habit.id}
                className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Row: Habit Name, Icon, Menu */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
                        style={{
                          background: `linear-gradient(135deg, ${habit.color} 0%, rgba(13, 17, 36, 0.9) 100%)`,
                          border: `1px solid ${habit.color}40`,
                          boxShadow: `0 0 16px -2px ${habit.color}60`
                        }}
                      >
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-white truncate">
                          {habit.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                          <span className="capitalize">{habit.frequency}</span>
                          {habit.reminderTime && (
                            <span className="flex items-center gap-1">
                              • <Clock className="w-3 h-3 text-indigo-300" /> {habit.reminderTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions dropdown button */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleItemSharing('habit', habit.id)}
                        title={habit.sharedWithPartner ? 'Visible to collaborator' : 'Private'}
                        className={`p-1.5 rounded-xl border text-xs transition cursor-pointer ${
                          habit.sharedWithPartner
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30'
                            : 'liquid-glass-subtle text-zinc-400'
                        }`}
                      >
                        <Users2 className="w-3.5 h-3.5" />
                      </button>

                      {habit.status === 'active' ? (
                        <button
                          onClick={() => setHabitStatus(habit.id, 'paused')}
                          title="Pause Habit"
                          className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-amber-400 transition cursor-pointer"
                        >
                          <PauseCircle className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setHabitStatus(habit.id, 'active')}
                          title="Resume Habit"
                          className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-emerald-400 transition cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => setHabitStatus(habit.id, 'archived')}
                        title="Archive"
                        className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-white transition cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => deleteHabit(habit.id)}
                        title="Delete"
                        className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Streaks and Completion Rates */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl liquid-glass-subtle my-3">
                    <div className="text-center">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Streak</div>
                      <div className="text-base font-extrabold text-amber-300 flex items-center justify-center gap-1 mt-0.5 font-mono">
                        <Flame className="w-4 h-4 fill-amber-300" />
                        <span>{streak.current}d</span>
                      </div>
                    </div>
                    <div className="text-center border-x border-white/10">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">Best</div>
                      <div className="text-base font-extrabold text-zinc-200 mt-0.5 font-mono">
                        {streak.best}d
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] text-zinc-400 uppercase font-mono font-semibold">30d Rate</div>
                      <div className="text-base font-extrabold text-periwinkle mt-0.5 font-mono">
                        {streak.completionRate}%
                      </div>
                    </div>
                  </div>

                  {/* Heatmap visualization */}
                  {renderHeatmap(habit.id)}
                </div>

                {/* Bottom One-Tap Check-in Button */}
                <div className="pt-4 border-t border-white/10 mt-3">
                  <button
                    onClick={() => toggleHabitToday(habit.id)}
                    className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      streak.completedToday
                        ? 'liquid-glass-subtle text-emerald-300 border border-emerald-400/30'
                        : 'liquid-btn-primary text-white'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${streak.completedToday ? 'text-emerald-400' : 'text-white'}`} />
                    <span>{streak.completedToday ? 'Checked in for Today!' : 'Check-in for Today'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative border border-white/15">
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Create New Habit</h3>
            <p className="text-xs text-zinc-400 mb-5 font-medium">Set a daily routine to build lasting consistency.</p>

            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Habit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 25 pages, 10k steps, Meditate..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  {availableColors.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-xl transition cursor-pointer ${
                        color === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as HabitFrequency)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                    <option value="custom_weekly">3x per week</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Reminder Time</label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Share with Collaborator</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Partner can see your streak and check-ins</div>
                </div>
                <input
                  type="checkbox"
                  checked={sharedWithPartner}
                  onChange={(e) => setSharedWithPartner(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsView;
