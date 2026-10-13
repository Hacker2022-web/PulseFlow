import React, { useState, useMemo } from 'react';
import {
  Check,
  Plus,
  Flame,
  Search,
  Bell,
  Calendar,
  Wallet,
  CheckCircle2,
  Users2,
  TrendingUp,
  ArrowRight,
  Shield,
  SlidersHorizontal,
  Sparkles,
  Zap,
  Info,
  Clock,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getTodayString, getDateOffsetString } from '../../services/storage';
import { TaskPriority } from '../../types';
import { TaskCountdownTimer, PriorityBadge } from '../ui/TaskCountdownTimer';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { BentoAiDebriefTile } from './BentoAiDebriefTile';
import { BentoCoopQuestsTile } from './BentoCoopQuestsTile';
import { BentoSubscriptionsTile } from './BentoSubscriptionsTile';
import { BentoCustomizeModal } from '../modals/BentoCustomizeModal';

interface DashboardViewProps {
  onOpenQuickAdd: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickAdd }) => {
  const {
    user,
    habits,
    habitLogs,
    toggleHabitToday,
    getHabitStreak,
    dailyGoals,
    toggleDailyGoal,
    addDailyGoal,
    deleteDailyGoal,
    expenses,
    budgets,
    getTotalSpentThisMonth,
    getMonthlyBudgetTotal,
    formatCurrency,
    collaboratorPair,
    partnerData,
    unreadNotificationCount,
    setActiveTab,
    streakFreeze,
    activateStreakFreeze,
    bentoTiles,
    getPredictiveBudgetForecast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [newGoalText, setNewGoalText] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('high');
  const [newTaskDeadline, setNewTaskDeadline] = useState<string>('');
  const [showTaskOptions, setShowTaskOptions] = useState<boolean>(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isBentoModalOpen, setIsBentoModalOpen] = useState(false);
  const [showForecastDetail, setShowForecastDetail] = useState(false);

  const isTileEnabled = (id: string) => bentoTiles.find(t => t.id === id)?.enabled ?? true;
  const forecast = getPredictiveBudgetForecast();

  const activeHabits = useMemo(() => habits.filter(h => h.status === 'active'), [habits]);
  const todayStr = getTodayString();

  // Completed metrics
  const habitsCompletedCount = activeHabits.filter(h => getHabitStreak(h.id).completedToday).length;
  const habitCompletionPercent = activeHabits.length > 0
    ? Math.round((habitsCompletedCount / activeHabits.length) * 100)
    : 0;

  const dailyGoalsCompletedCount = dailyGoals.filter(g => g.completed).length;
  const dailyGoalsPercent = dailyGoals.length > 0
    ? Math.round((dailyGoalsCompletedCount / dailyGoals.length) * 100)
    : 0;

  const pendingHabitsCount = activeHabits.length - habitsCompletedCount;
  const pendingGoalsCount = dailyGoals.length - dailyGoalsCompletedCount;

  // Spending metrics
  const todaySpent = expenses
    .filter(e => e.type === 'expense' && e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthSpent = getTotalSpentThisMonth();
  const monthBudget = getMonthlyBudgetTotal();
  const budgetRatio = monthBudget > 0 ? (monthSpent / monthBudget) : 0;
  const budgetPercent = Math.min(100, Math.round(budgetRatio * 100));
  const remainingBudget = Math.max(0, monthBudget - monthSpent);

  const dailyCap = monthBudget > 0 ? Math.round(monthBudget / 30) : 0;
  const isUnderBudget = dailyCap > 0 ? todaySpent <= dailyCap : true;

  // Productivity index calculation (0 when starting from clean slate)
  const productivityIndex = (activeHabits.length === 0 && dailyGoals.length === 0)
    ? 0
    : Math.min(
        100,
        Math.round(
          ((activeHabits.length ? (habitsCompletedCount / activeHabits.length) : 0) * 50) +
          ((dailyGoals.length ? (dailyGoalsCompletedCount / dailyGoals.length) : 0) * 50)
        )
      );

  // 7-day habit consistency calculation
  const weeklyConsistency = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    let totalPossible = activeHabits.length * 7;
    let totalCompleted = 0;
    for (let i = 0; i < 7; i++) {
      const d = getDateOffsetString(-i);
      const dayCompleted = activeHabits.filter(h => {
        return habitLogs.some(l => l.habitId === h.id && l.date === d && l.completed);
      }).length;
      totalCompleted += dayCompleted;
    }
    return Math.min(100, Math.round((totalCompleted / totalPossible) * 100));
  }, [activeHabits, habitLogs]);

  // Week range label for Weekly Overview
  const weekRangeLabel = useMemo(() => {
    const end = new Date();
    const start = new Date(Date.now() - 6 * 86400000);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  }, []);

  // Filtered lists if search query is entered
  const filteredHabits = useMemo(() => {
    if (!searchQuery.trim()) return activeHabits;
    return activeHabits.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [activeHabits, searchQuery]);

  const filteredGoals = useMemo(() => {
    if (!searchQuery.trim()) return dailyGoals;
    return dailyGoals.filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [dailyGoals, searchQuery]);

  // Recent 3 expenses
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .filter(e => e.type === 'expense')
      .slice(0, 3);
  }, [expenses]);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    addDailyGoal(
      newGoalText.trim(),
      true,
      newTaskDeadline && newTaskDeadline.includes('T') ? newTaskDeadline.split('T')[1]?.slice(0, 5) : newTaskDeadline || undefined,
      newTaskPriority,
      newTaskDeadline || undefined
    );
    setNewGoalText('');
    setNewTaskDeadline('');
    setShowTaskOptions(false);
  };

  // Helper for category initials
  const getCategoryInitials = (cat: string) => {
    const map: Record<string, string> = {
      'Food & Dining': 'FD',
      'Entertainment': 'EN',
      'Shopping & Groceries': 'GR',
      'Transportation': 'TR',
      'Health & Fitness': 'HF',
      'Housing & Utilities': 'HU',
      'Education & Learning': 'ED'
    };
    return map[cat] || cat.slice(0, 2).toUpperCase();
  };

  const partnerInitials = collaboratorPair?.userBName
    ? collaboratorPair.userBName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : '--';

  // Format today's date
  const formattedToday = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-6 relative z-10 w-full animate-fade-in">
      {/* Top Header Bar with Mobile-Optimized Capsule & Search */}
      <header
        className="flex flex-col gap-3 border-b border-white/10 pb-4"
        data-purpose="dashboard-header"
      >
        {/* Row 1: Title & Action Capsule */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300 md:hidden">
              <Zap className="w-4 h-4 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" fill="currentColor" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">Dashboard</h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-400/20 rounded-full">
                  PulseFlow OS
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-zinc-400 font-medium">Daily focus, habits, and spending pace</p>
            </div>
          </div>

          {/* Action Button Strip */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Streak Freeze & Rescue Shield Capsule */}
            <button
              onClick={() => activateStreakFreeze()}
              disabled={streakFreeze.availableFreezes === 0 || streakFreeze.isShieldActiveToday}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer tap-target active:scale-95 ${
                streakFreeze.isShieldActiveToday
                  ? 'liquid-glass border border-cyan-400/40 text-cyan-200 shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                  : streakFreeze.availableFreezes > 0
                  ? 'liquid-glass-subtle hover:bg-white/[0.08] text-zinc-300'
                  : 'bg-white/5 opacity-50 cursor-not-allowed text-zinc-500'
              }`}
              title={
                streakFreeze.isShieldActiveToday
                  ? 'Streak Shield active! Streaks protected today.'
                  : `${streakFreeze.availableFreezes} freezes ready. Click to activate shield.`
              }
            >
              <Shield className={`w-3.5 h-3.5 ${streakFreeze.isShieldActiveToday ? 'text-cyan-300 fill-cyan-400/30' : 'text-zinc-400'}`} />
              <span className="font-mono font-medium text-[11px] sm:text-xs">
                {streakFreeze.isShieldActiveToday ? 'Shield' : `${streakFreeze.availableFreezes}F`}
              </span>
            </button>

            {/* Bento Customizer Button */}
            <button
              onClick={() => setIsBentoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-zinc-300 hover:text-white transition-all cursor-pointer tap-target active:scale-95"
              title="Customize Bento Layout"
              type="button"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-300" />
              <span className="text-[11px] font-semibold text-white hidden sm:inline">Bento</span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/20 px-1.5 py-0.2 rounded-full">
                {bentoTiles.filter(t => t.enabled).length}/9
              </span>
            </button>

            {/* Partner Status Pill (Desktop / Tablet, Only when paired) */}
            {collaboratorPair && collaboratorPair.status === 'active' && collaboratorPair.id !== 'pair_demo_99' ? (
              <button
                onClick={() => setActiveTab('collaborator')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-subtle text-xs hover:bg-white/[0.08] transition-all cursor-pointer"
                title={`Duo Partner: ${collaboratorPair.userBName}`}
              >
                <div className="w-5 h-5 rounded-md bg-white/10 border border-white/15 flex items-center justify-center text-[10px] font-bold text-indigo-200">
                  {partnerInitials}
                </div>
                <span className="text-zinc-400 text-[10px]">Partner:</span>
                <span className="font-medium text-zinc-200">{collaboratorPair.userBName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </button>
            ) : null}

            {/* Quick Log Primary Button */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl liquid-btn-primary text-white font-semibold text-xs tracking-wide transition-all cursor-pointer tap-target active:scale-95 shadow-[0_4px_16px_rgba(99,102,241,0.4)]"
              type="button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log</span>
            </button>

            {/* Notifications Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                aria-label="Notifications"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all relative cursor-pointer tap-target active:scale-95"
                type="button"
              >
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_6px_rgba(165,180,252,0.9)]" />
                )}
              </button>
              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div className="relative flex items-center w-full">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full liquid-glass-subtle rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30 transition-all"
            placeholder="Search habits, tasks, expenses..."
            type="text"
          />
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 pointer-events-none" />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          ) : (
            <kbd className="absolute right-2.5 hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-zinc-400 bg-white/10 rounded border border-white/15">
              ⌘K
            </kbd>
          )}
        </div>
      </header>

      {/* Bento Grid Quick Toolbar */}
      <div className="flex items-center justify-between px-1 -mb-1 pt-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white tracking-wide uppercase font-mono text-zinc-300">
            Bento Dashboard
          </span>
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 border border-indigo-400/20 px-2 py-0.5 rounded-full">
            {bentoTiles.filter(t => t.enabled).length} of {bentoTiles.length} active
          </span>
        </div>
        <button
          onClick={() => setIsBentoModalOpen(true)}
          className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white transition-colors cursor-pointer font-medium tap-target active:scale-95 py-1 px-2.5 rounded-xl liquid-glass-subtle hover:bg-white/10"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Customize Layout</span>
        </button>
      </div>

      {/* DYNAMIC BENTO GRID SYSTEM */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 [grid-auto-flow:dense] gap-5 sm:gap-6 border-b border-white/10 pb-6 w-full items-start" data-purpose="dynamic-bento-grid">
        {bentoTiles.filter(t => t.enabled).length === 0 ? (
          <div className="col-span-full py-16 text-center liquid-glass rounded-3xl p-8 border border-white/10">
            <SlidersHorizontal className="w-10 h-10 text-indigo-300 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-white">All Bento modules are currently hidden</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-5">
              Open Customize Bento Grid to toggle on the modules you want on your dashboard.
            </p>
            <button
              onClick={() => setIsBentoModalOpen(true)}
              className="px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition-all"
            >
              Customize Bento Grid
            </button>
          </div>
        ) : (
          [...bentoTiles]
            .filter(t => t.enabled)
            .sort((a, b) => a.order - b.order)
            .map((tile) => {
              switch (tile.id) {
                case 'heroGreeting':
                  return (
                    <div key="heroGreeting" className="col-span-1 md:col-span-2 xl:col-span-2 w-full">
                      <section className="rounded-2xl sm:rounded-3xl liquid-glass p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden h-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-zinc-300 mb-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
                              <span className="font-medium text-periwinkle">{formattedToday}</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-sm">
                              Good day, {user.displayName ? user.displayName.split(' ')[0] : 'friend'}.
                            </h2>
                            <p className="text-xs text-zinc-300 mt-1 font-medium">
                              You have <span className="text-white font-semibold">{pendingHabitsCount} habits</span> and{' '}
                              <span className="text-white font-semibold">{pendingGoalsCount} priority tasks</span> scheduled today.
                            </p>
                          </div>

                          {/* Productivity Index Pill */}
                          <div className="px-3.5 py-2 rounded-2xl liquid-glass-subtle flex items-center gap-3 self-start sm:self-auto">
                            <div className="text-right">
                              <div className="text-[10px] uppercase font-mono text-zinc-400 font-medium tracking-wider">
                                Productivity Index
                              </div>
                              <div className="text-xs font-semibold text-white font-mono tracking-tight">
                                {productivityIndex}% on target
                              </div>
                            </div>
                            <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-indigo-300 to-violet-300 shadow-[0_0_10px_rgba(165,180,252,0.9)]" />
                          </div>
                        </div>

                        {/* 3 Mini Stats Glass Pods */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 mt-4 sm:mt-6 relative z-10">
                          {/* Pod 1: Habits Completed */}
                          <div className="liquid-glass-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-300 font-medium">Habits Completed</span>
                              <span className="text-xs font-mono text-periwinkle font-semibold">{habitCompletionPercent}%</span>
                            </div>
                            <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">{habitsCompletedCount}</span>
                              <span className="text-xs text-zinc-400 font-medium">/ {activeHabits.length} complete</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5">
                              <div
                                className="bg-gradient-to-r from-indigo-400 to-violet-400 h-full rounded-full shadow-[0_0_10px_rgba(129,140,248,0.7)] transition-all duration-500"
                                style={{ width: `${habitCompletionPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Pod 2: Daily Goals */}
                          <div className="liquid-glass-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-300 font-medium">Daily Goals</span>
                              <span className="text-xs font-mono text-periwinkle font-semibold">{dailyGoalsPercent}%</span>
                            </div>
                            <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">{dailyGoalsCompletedCount}</span>
                              <span className="text-xs text-zinc-400 font-medium">/ {dailyGoals.length} closed</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5">
                              <div
                                className="bg-gradient-to-r from-indigo-400 to-violet-400 h-full rounded-full shadow-[0_0_10px_rgba(129,140,248,0.7)] transition-all duration-500"
                                style={{ width: `${dailyGoalsPercent}%` }}
                              />
                            </div>
                          </div>

                          {/* Pod 3: Today's Spend */}
                          <div className="liquid-glass-subtle rounded-xl sm:rounded-2xl p-3 sm:p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-zinc-300 font-medium">Today's Spend</span>
                              <span className={`text-[11px] font-mono font-semibold ${isUnderBudget ? 'text-emerald-300' : 'text-rose-300'}`}>
                                {isUnderBudget ? 'Under budget' : 'Over pace'}
                              </span>
                            </div>
                            <div className="mt-2 mb-3 flex items-baseline gap-1.5">
                              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">{formatCurrency(todaySpent)}</span>
                              <span className="text-xs text-zinc-400 font-medium">of {formatCurrency(dailyCap)} cap</span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden p-0.5">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  isUnderBudget
                                    ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]'
                                    : 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.7)]'
                                }`}
                                style={{ width: `${Math.min(100, Math.round((todaySpent / (dailyCap || 1)) * 100))}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </section>
                    </div>
                  );

                case 'weeklyOverview':
                  return (
                    <div key="weeklyOverview" className="col-span-1 w-full">
                      <section className="rounded-2xl sm:rounded-3xl liquid-glass p-4 sm:p-6 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-semibold text-white tracking-tight">Weekly Overview</h3>
                            </div>
                            <span className="text-[11px] font-mono text-zinc-400">{weekRangeLabel}</span>
                          </div>
                          <div className="mt-4 space-y-3.5">
                            {/* Habit Consistency */}
                            <div className="p-3.5 rounded-2xl liquid-glass-subtle">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-300 font-medium">Habit Consistency</span>
                                <span className="text-white font-mono font-semibold">{weeklyConsistency}%</span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden p-0.5">
                                <div
                                  className="bg-gradient-to-r from-indigo-300 to-violet-400 h-full rounded-full shadow-[0_0_10px_rgba(165,180,252,0.6)] transition-all duration-500"
                                  style={{ width: `${weeklyConsistency}%` }}
                                />
                              </div>
                            </div>

                            {/* Spend Pace */}
                            <div className="p-3.5 rounded-2xl liquid-glass-subtle">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-300 font-medium">Spend Pace</span>
                                <span className="text-zinc-200 font-mono font-medium">
                                  {formatCurrency(monthSpent)} / {formatCurrency(monthBudget)}
                                </span>
                              </div>
                              <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden p-0.5">
                                <div
                                  className="bg-zinc-300 h-full rounded-full transition-all duration-500"
                                  style={{ width: `${monthBudget > 0 ? budgetPercent : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                          <span>Target tracking normal</span>
                          <button
                            onClick={() => setActiveTab('habits')}
                            className="text-periwinkle font-medium hover:text-white hover:underline cursor-pointer transition-colors"
                          >
                            View details →
                          </button>
                        </div>
                      </section>
                    </div>
                  );

                case 'aiDebrief':
                  return (
                    <div key="aiDebrief" className="col-span-full w-full">
                      <BentoAiDebriefTile />
                    </div>
                  );

                case 'coopQuests':
                  return (
                    <div key="coopQuests" className="col-span-full w-full">
                      <BentoCoopQuestsTile />
                    </div>
                  );

                case 'habits':
                  return (
                    <div key="habits" className="col-span-1 w-full">
                      <section className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between h-full" data-purpose="daily-habits-column">
                        <div>
                          <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300">
                                <Check className="w-4 h-4 text-indigo-300" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-sm tracking-tight">Daily Habits</h3>
                                <span className="text-xs text-zinc-400 font-medium">
                                  {habitsCompletedCount} of {activeHabits.length} completed
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveTab('habits')}
                              className="text-xs text-periwinkle hover:text-white transition-colors font-medium cursor-pointer"
                            >
                              View all
                            </button>
                          </div>

                          <div className="flex flex-col gap-2.5 mt-4">
                            {filteredHabits.length === 0 ? (
                              <div className="py-7 text-center liquid-glass-subtle rounded-2xl border border-white/5">
                                <p className="text-xs text-zinc-300 font-medium">No habits yet</p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Build routine momentum with your first habit streak.</p>
                              </div>
                            ) : (
                              filteredHabits.map((habit) => {
                                const streakData = getHabitStreak(habit.id);
                                const isCompleted = streakData.completedToday;

                                return (
                                  <div
                                    key={habit.id}
                                    className={`p-3 rounded-2xl liquid-glass-subtle flex items-center justify-between transition-all ${
                                      !isCompleted ? 'hover:bg-white/[0.08]' : ''
                                    }`}
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <button
                                        type="button"
                                        onClick={() => toggleHabitToday(habit.id)}
                                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                          isCompleted
                                            ? 'liquid-btn-primary text-white'
                                            : 'border border-white/25 hover:border-white/50 bg-white/[0.03] hover:shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                                        }`}
                                      >
                                        {isCompleted && <Check className="w-3 h-3 stroke-[2.5]" />}
                                      </button>

                                      <div className="truncate">
                                        <h4
                                          className={`text-xs font-medium truncate ${
                                            isCompleted ? 'text-zinc-400 line-through' : 'text-white'
                                          }`}
                                        >
                                          {habit.name}
                                        </h4>
                                        <div className="text-[11px] text-zinc-400 font-mono mt-0.5 truncate">
                                          {habit.reminderTime || '08:00'} • {habit.sharedWithPartner ? 'Shared' : 'Goal'}
                                        </div>
                                      </div>
                                    </div>

                                    <span className="text-[11px] font-mono text-zinc-300 bg-white/[0.06] border border-white/10 px-2 py-0.5 rounded-full shrink-0 ml-2">
                                      {streakData.current > 0 ? `${streakData.current}d` : '0d'}
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        <button
                          onClick={onOpenQuickAdd}
                          className="w-full mt-4 py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-indigo-200 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          type="button"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Habit</span>
                        </button>
                      </section>
                    </div>
                  );

                case 'tasks':
                  return (
                    <div key="tasks" className="col-span-1 w-full">
                      <section className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between h-full" data-purpose="daily-must-dos-column">
                        <div>
                          <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300">
                                <Calendar className="w-4 h-4 text-indigo-300" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-sm tracking-tight">Priority Tasks</h3>
                                <span className="text-xs text-zinc-400 font-medium">
                                  {pendingGoalsCount} remaining today
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveTab('goals')}
                              className="text-xs text-periwinkle hover:text-white transition-colors font-medium cursor-pointer"
                            >
                              Roadmap
                            </button>
                          </div>

                          {/* Priority Task Input Form with Priority & Deadline */}
                          <form onSubmit={handleAddGoal} className="my-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                value={newGoalText}
                                onChange={(e) => {
                                  setNewGoalText(e.target.value);
                                  if (!showTaskOptions && e.target.value.trim()) {
                                    setShowTaskOptions(true);
                                  }
                                }}
                                onFocus={() => setShowTaskOptions(true)}
                                className="flex-1 liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-400/50 transition-all"
                                placeholder="Add a priority must-do..."
                                type="text"
                              />
                              <button
                                type="submit"
                                className="px-3.5 py-2 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0"
                              >
                                Add
                              </button>
                            </div>

                            {/* Priority & Deadline Picker Controls */}
                            {showTaskOptions && (
                              <div className="p-3 rounded-2xl liquid-glass-subtle border border-indigo-400/20 space-y-2.5 animate-fade-in">
                                {/* Priority Select */}
                                <div>
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                                    <span>Priority</span>
                                    <span className="text-zinc-500 font-normal">Select urgency</span>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1.5">
                                    {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => {
                                      const isSelected = newTaskPriority === p;
                                      return (
                                        <button
                                          key={p}
                                          type="button"
                                          onClick={() => setNewTaskPriority(p)}
                                          className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer capitalize ${
                                            isSelected
                                              ? p === 'urgent'
                                                ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-[0_0_8px_rgba(244,63,94,0.4)]'
                                                : p === 'high'
                                                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50 shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                                                : p === 'low'
                                                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                                                : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50 shadow-[0_0_8px_rgba(129,140,248,0.4)]'
                                              : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                                          }`}
                                        >
                                          {p}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Deadline Picker with Quick Presets */}
                                <div>
                                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center justify-between">
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-indigo-300" /> Deadline Countdown
                                    </span>
                                    {newTaskDeadline && (
                                      <button
                                        type="button"
                                        onClick={() => setNewTaskDeadline('')}
                                        className="text-[9px] text-zinc-500 hover:text-rose-300 cursor-pointer"
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const d = new Date(Date.now() + 60 * 60 * 1000);
                                        const y = d.getFullYear();
                                        const m = String(d.getMonth() + 1).padStart(2, '0');
                                        const day = String(d.getDate()).padStart(2, '0');
                                        const h = String(d.getHours()).padStart(2, '0');
                                        const min = String(d.getMinutes()).padStart(2, '0');
                                        setNewTaskDeadline(`${y}-${m}-${day}T${h}:${min}`);
                                      }}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                                    >
                                      +1 Hour
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const d = new Date(Date.now() + 3 * 60 * 60 * 1000);
                                        const y = d.getFullYear();
                                        const m = String(d.getMonth() + 1).padStart(2, '0');
                                        const day = String(d.getDate()).padStart(2, '0');
                                        const h = String(d.getHours()).padStart(2, '0');
                                        const min = String(d.getMinutes()).padStart(2, '0');
                                        setNewTaskDeadline(`${y}-${m}-${day}T${h}:${min}`);
                                      }}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                                    >
                                      +3 Hours
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const d = new Date();
                                        const y = d.getFullYear();
                                        const m = String(d.getMonth() + 1).padStart(2, '0');
                                        const day = String(d.getDate()).padStart(2, '0');
                                        setNewTaskDeadline(`${y}-${m}-${day}T18:00`);
                                      }}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                                    >
                                      EOD (18:00)
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const d = new Date();
                                        const y = d.getFullYear();
                                        const m = String(d.getMonth() + 1).padStart(2, '0');
                                        const day = String(d.getDate()).padStart(2, '0');
                                        setNewTaskDeadline(`${y}-${m}-${day}T22:00`);
                                      }}
                                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 cursor-pointer"
                                    >
                                      Tonight (22:00)
                                    </button>
                                  </div>

                                  <input
                                    type="datetime-local"
                                    value={newTaskDeadline}
                                    onChange={(e) => setNewTaskDeadline(e.target.value)}
                                    className="w-full bg-[#18112e]/70 border border-white/15 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-400"
                                  />
                                </div>
                              </div>
                            )}
                          </form>

                          <div className="flex flex-col gap-2.5">
                            {filteredGoals.length === 0 ? (
                              <div className="py-7 text-center liquid-glass-subtle rounded-2xl border border-white/5">
                                <p className="text-xs text-zinc-300 font-medium">No priority tasks today</p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Use the input above to plan your focus must-dos with live timers.</p>
                              </div>
                            ) : (
                              filteredGoals.map((goal) => {
                                const isCompleted = goal.completed;

                                return (
                                  <div
                                    key={goal.id}
                                    onClick={() => toggleDailyGoal(goal.id)}
                                    className={`p-3 rounded-2xl liquid-glass-subtle flex items-start justify-between gap-2.5 cursor-pointer transition-all group ${
                                      !isCompleted ? 'hover:bg-white/[0.08]' : 'opacity-80'
                                    }`}
                                  >
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <div
                                        className={`w-4 h-4 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition-all ${
                                          isCompleted
                                            ? 'liquid-btn-primary text-white'
                                            : 'border border-white/25 hover:border-white/50 bg-white/[0.03]'
                                        }`}
                                      >
                                        {isCompleted && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <PriorityBadge priority={goal.priority || 'medium'} />
                                          <span
                                            className={`text-xs ${
                                              isCompleted ? 'text-zinc-400 line-through' : 'font-medium text-white'
                                            }`}
                                          >
                                            {goal.title}
                                          </span>
                                        </div>

                                        {/* Task Timer & Metadata */}
                                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                          <TaskCountdownTimer
                                            deadline={goal.deadline}
                                            targetTime={goal.targetTime}
                                            taskDate={goal.date}
                                            completed={goal.completed}
                                          />

                                          {goal.sharedWithPartner && (
                                            <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-400/20">
                                              Duo
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Delete Task Button */}
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteDailyGoal(goal.id);
                                      }}
                                      className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100 cursor-pointer shrink-0"
                                      title="Delete task"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      </section>
                    </div>
                  );

                case 'expenses':
                  return (
                    <div key="expenses" className="col-span-1 w-full">
                      <section className="liquid-glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col justify-between h-full" data-purpose="expense-tracker-column">
                        <div>
                          <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300">
                                <Wallet className="w-4 h-4 text-indigo-300" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white text-sm tracking-tight">Expense Tracker</h3>
                                <span className="text-xs text-zinc-400 font-medium">Private &amp; synced</span>
                              </div>
                            </div>
                            <button
                              onClick={() => setActiveTab('expenses')}
                              className="text-xs text-periwinkle hover:text-white transition-colors font-medium cursor-pointer"
                            >
                              Analytics
                            </button>
                          </div>

                          {/* Spend Summary Bubble */}
                          <div className="p-4 rounded-2xl liquid-glass-subtle my-3">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-zinc-300 font-medium">Monthly Spent</span>
                              <span className="text-white font-mono font-semibold">
                                {formatCurrency(monthSpent)}{' '}
                                <span className="text-zinc-400 font-normal">/ {formatCurrency(monthBudget)}</span>
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2.5 overflow-hidden p-0.5">
                              <div
                                className="h-full bg-gradient-to-r from-indigo-300 to-violet-400 rounded-full shadow-[0_0_8px_rgba(165,180,252,0.7)] transition-all duration-500"
                                style={{ width: `${budgetPercent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] font-mono mt-2">
                              <span className="text-zinc-400">{budgetPercent}% consumed</span>
                              <span className="text-emerald-300 font-medium">Remaining: {formatCurrency(remainingBudget)}</span>
                            </div>
                          </div>

                          {/* Predictive Budget Burn Forecast Capsule */}
                          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-indigo-500/20 my-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
                                <span className="text-[11px] font-mono text-zinc-200 font-semibold uppercase tracking-wider">
                                  Burn Forecast
                                </span>
                              </div>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                                  forecast.budgetSafe
                                    ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/25'
                                    : 'text-amber-300 bg-amber-500/15 border border-amber-400/25 shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                                }`}
                              >
                                {forecast.budgetSafe ? 'Pacing Safe' : `Exhausts ${forecast.projectedExhaustionDate}`}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2.5 border-t border-white/5 text-[11px] font-mono">
                              <div>
                                <span className="text-zinc-400 block text-[10px]">Daily Pace</span>
                                <span className="text-white font-bold">{formatCurrency(forecast.dailyPace)}/day</span>
                              </div>
                              <div className="text-right">
                                <span className="text-zinc-400 block text-[10px]">End Projection</span>
                                <span className="text-indigo-200 font-bold">{formatCurrency(forecast.projectedMonthEndSpend)}</span>
                              </div>
                            </div>

                            <div className="mt-2 text-[10px] text-zinc-400 leading-tight">
                              💡 {forecast.recommendation}
                            </div>
                          </div>

                          {/* Recent Transactions List */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-medium">
                                Recent Transactions
                              </span>
                            </div>

                            {recentExpenses.length === 0 ? (
                              <div className="py-5 text-center liquid-glass-subtle rounded-2xl border border-white/5">
                                <p className="text-xs text-zinc-300 font-medium">No transactions yet</p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">Tap Log Expense below to track your first spend.</p>
                              </div>
                            ) : (
                              recentExpenses.map((expense) => {
                                const initials = getCategoryInitials(expense.category);

                                return (
                                  <div
                                    key={expense.id}
                                    className="p-2.5 rounded-2xl liquid-glass-subtle flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <div className="w-7 h-7 rounded-lg liquid-glass-pill flex items-center justify-center text-xs text-indigo-300 font-medium font-mono shrink-0">
                                        {initials}
                                      </div>
                                      <div className="truncate">
                                        <div className="text-xs font-medium text-white truncate">
                                          {expense.note || expense.category}
                                        </div>
                                        <div className="text-[10px] text-zinc-400 font-mono truncate">{expense.category}</div>
                                      </div>
                                    </div>
                                    <span className="text-xs font-mono font-medium text-zinc-100 shrink-0 ml-2">
                                      -{formatCurrency(expense.amount)}
                                    </span>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        <button
                          onClick={onOpenQuickAdd}
                          className="w-full mt-4 py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-white font-medium text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          type="button"
                        >
                          <Plus className="w-3.5 h-3.5 text-indigo-300" />
                          <span>Log Expense</span>
                        </button>
                      </section>
                    </div>
                  );

                case 'subscriptions':
                  return (
                    <div key="subscriptions" className="col-span-full w-full">
                      <BentoSubscriptionsTile />
                    </div>
                  );

                case 'partnerBanner':
                  return (
                    <div key="partnerBanner" className="col-span-full w-full">
                      <section
                        className="w-full rounded-2xl sm:rounded-3xl liquid-glass p-4 sm:p-6 lg:px-7 flex items-center justify-between flex-wrap gap-4 relative overflow-hidden"
                        data-purpose="partner-sync-banner"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-2xl liquid-glass-pill flex items-center justify-center font-bold text-xs text-indigo-200">
                            {collaboratorPair ? partnerInitials : <Users2 className="w-5 h-5 text-indigo-300" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <span className="font-medium text-white text-sm">
                                {collaboratorPair ? collaboratorPair.userBName : 'Duo Partner Sync'}
                              </span>
                              <span className="text-[10px] font-mono text-zinc-200 bg-white/[0.08] border border-white/10 px-2 py-0.5 rounded-full">
                                {collaboratorPair ? 'Shared streak active' : 'Not paired'}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  collaboratorPair
                                    ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/25'
                                    : 'text-zinc-400 bg-white/5 border border-white/10'
                                }`}
                              >
                                {collaboratorPair ? 'Active' : 'Standby'}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                              {collaboratorPair
                                ? 'Mutual visibility active. Completed daily goals and habits sync live.'
                                : 'Link with an accountability partner to unlock duo streaks, co-op quests, and real-time nudges.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setActiveTab('collaborator')}
                            className="px-4 py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.09] text-indigo-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
                            type="button"
                          >
                            {collaboratorPair ? 'View Partner Screen' : 'Connect Partner →'}
                          </button>
                        </div>
                      </section>
                    </div>
                  );

                default:
                  return null;
              }
            })
        )}
      </div>

      {/* Bento Customizer Modal */}
      <BentoCustomizeModal
        isOpen={isBentoModalOpen}
        onClose={() => setIsBentoModalOpen(false)}
      />
    </div>
  );
};

export default DashboardView;
