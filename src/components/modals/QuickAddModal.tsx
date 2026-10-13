import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Target,
  Wallet,
  Plus,
  Users2,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayString } from '../../services/storage';
import { ExpenseCategory, PaymentMethod, TaskPriority } from '../../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const {
    habits,
    toggleHabitToday,
    getHabitStreak,
    addDailyGoal,
    addExpense
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dailyGoal' | 'expense' | 'habit'>('dailyGoal');

  // Daily goal fields
  const [goalTitle, setGoalTitle] = useState('');
  const [goalShared, setGoalShared] = useState(true);
  const [goalTime, setGoalTime] = useState('18:00');
  const [goalPriority, setGoalPriority] = useState<TaskPriority>('medium');
  const [goalDeadline, setGoalDeadline] = useState('');

  // Expense fields
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food & Dining');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');

  if (!isOpen) return null;

  const handleDailyGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;
    addDailyGoal(
      goalTitle.trim(),
      goalShared,
      goalTime || undefined,
      goalPriority,
      goalDeadline || undefined
    );
    setGoalTitle('');
    setGoalDeadline('');
    setGoalPriority('medium');
    onClose();
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    addExpense({
      userId: 'user_primary_001',
      amount: parsed,
      type: 'expense',
      category,
      date: getTodayString(),
      note: note.trim() || undefined,
      paymentMethod,
      sharedWithPartner: false
    });

    setAmount('');
    setNote('');
    onClose();
  };

  const applyPresetDeadline = (minutes: number) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, '0');
    const str = `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
    setGoalDeadline(str);
  };

  const applyTimeToday = (hours: number, minutes: number = 0) => {
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    if (d.getTime() < Date.now()) {
      d.setDate(d.getDate() + 1);
    }
    const pad = (n: number) => String(n).padStart(2, '0');
    const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setGoalDeadline(str);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="liquid-glass rounded-t-3xl sm:rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-2xl relative border border-white/15 max-h-[92vh] overflow-y-auto safe-area-pb"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <h3 className="text-lg font-bold text-white tracking-tight">Quick Log</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-white transition cursor-pointer tap-target"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-3 gap-2 p-1 liquid-glass-subtle rounded-2xl mb-5 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('dailyGoal')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'dailyGoal'
                ? 'liquid-btn-primary text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Daily Goal</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('expense')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'expense'
                ? 'liquid-btn-primary text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Expense</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('habit')}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'habit'
                ? 'liquid-btn-primary text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Check Habit</span>
          </button>
        </div>

        {/* Tab 1: Daily Goal */}
        {activeTab === 'dailyGoal' && (
          <form onSubmit={handleDailyGoalSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Today's Must-Do Target</label>
              <input
                type="text"
                required
                autoFocus
                placeholder="e.g. Read 20 pages, Complete mock interview"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
              />
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Priority Level</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => {
                  const isSelected = goalPriority === p;
                  const colors = {
                    urgent: isSelected ? 'bg-rose-500/25 text-rose-300 border-rose-500/50 shadow-sm' : 'text-zinc-400 hover:text-rose-300',
                    high: isSelected ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-sm' : 'text-zinc-400 hover:text-amber-300',
                    medium: isSelected ? 'bg-indigo-500/25 text-indigo-300 border-indigo-500/50 shadow-sm' : 'text-zinc-400 hover:text-indigo-300',
                    low: isSelected ? 'bg-zinc-500/25 text-zinc-300 border-zinc-500/50 shadow-sm' : 'text-zinc-400 hover:text-zinc-300'
                  }[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setGoalPriority(p)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold capitalize border border-white/10 transition cursor-pointer ${colors}`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Deadline Countdown & Timer */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Deadline Countdown Timer</span>
                </label>
                {goalDeadline && (
                  <button
                    type="button"
                    onClick={() => setGoalDeadline('')}
                    className="text-[10px] text-zinc-400 hover:text-white cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Presets */}
              <div className="flex items-center gap-1.5 mb-2 overflow-x-auto pb-1 text-[10px]">
                <button
                  type="button"
                  onClick={() => applyPresetDeadline(60)}
                  className="px-2 py-1 rounded-lg liquid-glass-subtle hover:bg-white/10 text-zinc-300 cursor-pointer whitespace-nowrap"
                >
                  +1h
                </button>
                <button
                  type="button"
                  onClick={() => applyPresetDeadline(180)}
                  className="px-2 py-1 rounded-lg liquid-glass-subtle hover:bg-white/10 text-zinc-300 cursor-pointer whitespace-nowrap"
                >
                  +3h
                </button>
                <button
                  type="button"
                  onClick={() => applyTimeToday(18, 0)}
                  className="px-2 py-1 rounded-lg liquid-glass-subtle hover:bg-white/10 text-zinc-300 cursor-pointer whitespace-nowrap"
                >
                  18:00 EOD
                </button>
                <button
                  type="button"
                  onClick={() => applyTimeToday(22, 0)}
                  className="px-2 py-1 rounded-lg liquid-glass-subtle hover:bg-white/10 text-zinc-300 cursor-pointer whitespace-nowrap"
                >
                  Tonight 22:00
                </button>
              </div>

              <input
                type="datetime-local"
                value={goalDeadline}
                onChange={(e) => setGoalDeadline(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">Share with Collaborator</div>
                <div className="text-[11px] text-zinc-400 font-medium">Partner can see completion status</div>
              </div>
              <input
                type="checkbox"
                checked={goalShared}
                onChange={(e) => setGoalShared(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
              >
                Add Daily Goal
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Expense */}
        {activeTab === 'expense' && (
          <form onSubmit={handleExpenseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Amount (₹)</label>
              <input
                type="number"
                step="0.01"
                required
                autoFocus
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-white/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
              >
                <option value="Food & Dining">Food & Dining</option>
                <option value="Shopping & Groceries">Shopping & Groceries</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Housing & Utilities">Housing & Utilities</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Note (optional)</label>
              <input
                type="text"
                placeholder="e.g. Lunch with team"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
              >
                Save Expense
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Habit Quick Check */}
        {activeTab === 'habit' && (
          <div className="space-y-3">
            <p className="text-xs text-zinc-400 mb-2 font-medium">Tap any active habit to check it off for today:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {habits.filter(h => h.status === 'active').map((h) => {
                const streak = getHabitStreak(h.id);
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => {
                      toggleHabitToday(h.id);
                    }}
                    className={`w-full p-3 rounded-2xl text-left flex items-center justify-between transition cursor-pointer ${
                      streak.completedToday
                        ? 'liquid-glass-subtle opacity-85'
                        : 'liquid-glass-subtle hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center ${
                        streak.completedToday ? 'liquid-btn-primary text-white' : 'border border-white/25'
                      }`}>
                        {streak.completedToday ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                      </span>
                      <span className={`text-xs font-medium truncate ${streak.completedToday ? 'text-zinc-400 line-through' : 'text-white'}`}>
                        {h.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-amber-300 shrink-0">
                      {streak.current}d streak
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuickAddModal;
