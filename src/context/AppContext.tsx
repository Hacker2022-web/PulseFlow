import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  Habit,
  HabitLog,
  Goal,
  DailyGoalItem,
  Expense,
  CategoryBudget,
  CollaboratorPair,
  AppNotification,
  SyncStatus,
  CurrencyCode,
  NudgeRecord,
  CoopQuest,
  StreakFreezeInfo,
  SubscriptionItem,
  BentoTileId,
  BentoTileConfig,
  WeeklyAiDebrief
} from '../types';
import {
  LocalStorageService,
  STORAGE_KEYS,
  INITIAL_USER,
  INITIAL_PAIR,
  INITIAL_HABITS,
  generateInitialHabitLogs,
  INITIAL_GOALS,
  INITIAL_DAILY_GOALS,
  INITIAL_EXPENSES,
  INITIAL_BUDGETS,
  INITIAL_PARTNER_DATA,
  INITIAL_NOTIFICATIONS,
  INITIAL_COOP_QUESTS,
  INITIAL_STREAK_FREEZE,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_BENTO_TILES,
  SAMPLE_DEMO_DATA,
  PartnerSharedData,
  getTodayString,
  getDateOffsetString
} from '../services/storage';

export type NavigationTab = 'dashboard' | 'habits' | 'goals' | 'expenses' | 'collaborator' | 'settings' | 'auth';

interface AppContextType {
  user: UserProfile;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  syncStatus: SyncStatus;
  isOnline: boolean;
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  dailyGoals: DailyGoalItem[];
  expenses: Expense[];
  budgets: CategoryBudget[];
  collaboratorPair: CollaboratorPair | null;
  partnerData: PartnerSharedData;
  notifications: AppNotification[];
  unreadNotificationCount: number;

  // Habit Operations
  toggleHabitToday: (habitId: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  setHabitStatus: (habitId: string, status: 'active' | 'paused' | 'archived') => void;
  getHabitStreak: (habitId: string) => { current: number; best: number; completionRate: number; completedToday: boolean };
  
  // Goal Operations
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'logs'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  logGoalProgress: (goalId: string, value: number, note?: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addDailyGoal: (title: string, shared: boolean, targetTime?: string) => void;
  toggleDailyGoal: (dailyGoalId: string) => void;
  deleteDailyGoal: (dailyGoalId: string) => void;

  // Expense Operations
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (expenseId: string) => void;
  updateBudget: (category: string, monthlyLimit: number) => void;
  getCategorySpentThisMonth: (category: string) => number;
  getTotalSpentThisMonth: () => number;
  getMonthlyBudgetTotal: () => number;
  formatCurrency: (amount: number) => string;

  // Collaborator & Nudge Operations
  sendManualNudge: (targetItemId: string, targetItemTitle: string) => { success: boolean; message: string };
  sendReactionToPartner: (itemId: string, itemType: 'habit' | 'goal' | 'dailyGoal', emoji: string) => void;
  togglePartnerDailyGoalSimulated: (goalId: string) => void;
  connectPartnerWithCode: (code: string) => boolean;
  disconnectPartner: () => void;
  toggleItemSharing: (itemType: 'habit' | 'dailyGoal' | 'goal', itemId: string) => void;

  // Shared Co-op Quests
  coopQuests: CoopQuest[];
  contributeToQuest: (questId: string, amount: number, userRole: 'A' | 'B') => void;
  addCoopQuest: (quest: Omit<CoopQuest, 'id' | 'status'>) => void;

  // Streak Freeze & Rescue
  streakFreeze: StreakFreezeInfo;
  activateStreakFreeze: () => boolean;
  giftFreezeToPartner: () => boolean;

  // Subscription Vault
  subscriptions: SubscriptionItem[];
  addSubscription: (sub: Omit<SubscriptionItem, 'id'>) => void;
  updateSubscription: (sub: SubscriptionItem) => void;
  deleteSubscription: (subId: string) => void;
  toggleSubscriptionActive: (subId: string) => void;
  totalMonthlySubscriptionCost: number;

  // Bento Tile Customization
  bentoTiles: BentoTileConfig[];
  toggleBentoTile: (id: BentoTileId) => void;
  reorderBentoTiles: (reordered: BentoTileConfig[]) => void;
  resetBentoTiles: () => void;

  // Predictive Budget Burn Forecast & AI Debrief
  getPredictiveBudgetForecast: () => {
    dailyPace: number;
    projectedMonthEndSpend: number;
    projectedExhaustionDate: string;
    daysRemainingInMonth: number;
    budgetSafe: boolean;
    deltaVsBudget: number;
    daysDelta: number;
    totalBudget: number;
    currentSpent: number;
    recommendation: string;
  };
  getWeeklyAiDebrief: () => WeeklyAiDebrief;

  // Notification Operations
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Sync & User Profile
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  triggerSyncNow: () => void;
  resetAllDataToDefault: () => void;
  loadSampleDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.USER, INITIAL_USER)
  );

  const [activeTab, setActiveTab] = useState<NavigationTab>('auth');
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const [habits, setHabits] = useState<Habit[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.HABITS, INITIAL_HABITS)
  );

  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.HABIT_LOGS, generateInitialHabitLogs())
  );

  const [goals, setGoals] = useState<Goal[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.GOALS, INITIAL_GOALS)
  );

  const [dailyGoals, setDailyGoals] = useState<DailyGoalItem[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.DAILY_GOALS, INITIAL_DAILY_GOALS)
  );

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS)
  );

  const [collaboratorPair, setCollaboratorPair] = useState<CollaboratorPair | null>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.PAIR, INITIAL_PAIR)
  );

  const [partnerData, setPartnerData] = useState<PartnerSharedData>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.PARTNER_ITEMS, INITIAL_PARTNER_DATA)
  );

  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );

  const [coopQuests, setCoopQuests] = useState<CoopQuest[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.COOP_QUESTS, INITIAL_COOP_QUESTS)
  );

  const [streakFreeze, setStreakFreeze] = useState<StreakFreezeInfo>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.STREAK_FREEZE, INITIAL_STREAK_FREEZE)
  );

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS)
  );

  const [bentoTiles, setBentoTiles] = useState<BentoTileConfig[]>(() =>
    LocalStorageService.getItem(STORAGE_KEYS.BENTO_TILES, INITIAL_BENTO_TILES)
  );

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      triggerSyncNow();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isMountedRef = useRef(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Save changes to localStorage with debounced sync animation
  const queueSync = useCallback(() => {
    if (!isMountedRef.current) return;
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    setSyncStatus('syncing');
    syncTimeoutRef.current = setTimeout(() => {
      setSyncStatus(navigator.onLine ? 'synced' : 'offline');
      syncTimeoutRef.current = null;
    }, 500);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.HABITS, habits);
    queueSync();
  }, [habits, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.HABIT_LOGS, habitLogs);
    queueSync();
  }, [habitLogs, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.GOALS, goals);
    queueSync();
  }, [goals, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.DAILY_GOALS, dailyGoals);
    queueSync();
  }, [dailyGoals, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.EXPENSES, expenses);
    queueSync();
  }, [expenses, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.BUDGETS, budgets);
    queueSync();
  }, [budgets, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.PAIR, collaboratorPair);
  }, [collaboratorPair]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.PARTNER_ITEMS, partnerData);
  }, [partnerData]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.COOP_QUESTS, coopQuests);
    queueSync();
  }, [coopQuests, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.STREAK_FREEZE, streakFreeze);
    queueSync();
  }, [streakFreeze, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.SUBSCRIPTIONS, subscriptions);
    queueSync();
  }, [subscriptions, queueSync]);

  useEffect(() => {
    LocalStorageService.setItem(STORAGE_KEYS.BENTO_TILES, bentoTiles);
    queueSync();
  }, [bentoTiles, queueSync]);

  // Periodic budget checker to fire notifications at 80% and 100%
  useEffect(() => {
    budgets.forEach(b => {
      const spent = getCategorySpentThisMonth(b.category);
      if (b.monthlyLimit > 0) {
        const ratio = spent / b.monthlyLimit;
        if (ratio >= 1.0) {
          const exists = notifications.some(
            n => n.type === 'budget_alert_100' && n.title.includes(b.category)
          );
          if (!exists) {
            addNotification({
              type: 'budget_alert_100',
              title: `Budget Exceeded: ${b.category}`,
              message: `You spent ${formatCurrency(spent)} of your ${formatCurrency(b.monthlyLimit)} limit (${Math.round(ratio * 100)}%).`,
              linkTab: 'expenses'
            });
          }
        } else if (ratio >= 0.8) {
          const exists = notifications.some(
            n => n.type === 'budget_alert_80' && n.title.includes(b.category)
          );
          if (!exists) {
            addNotification({
              type: 'budget_alert_80',
              title: `Budget Warning: ${b.category} at ${Math.round(ratio * 100)}%`,
              message: `You have spent ${formatCurrency(spent)} of your ${formatCurrency(b.monthlyLimit)} budget limit.`,
              linkTab: 'expenses'
            });
          }
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, budgets]);

  // Currency Formatter
  const formatCurrency = useCallback((amount: number): string => {
    const symbolMap: Record<CurrencyCode, string> = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      INR: '₹',
      CAD: 'CA$',
      AUD: 'A$',
      JPY: '¥'
    };
    const sym = symbolMap[user.currency] || '$';
    return `${sym}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [user.currency]);

  // Trigger Sync Now
  const triggerSyncNow = useCallback(() => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus(navigator.onLine ? 'synced' : 'offline');
    }, 700);
  }, []);

  // Notifications
  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 40)]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Habit Streak Calculator
  const getHabitStreak = useCallback((habitId: string) => {
    const todayStr = getTodayString();
    const habitLogsList = habitLogs
      .filter(l => l.habitId === habitId)
      .sort((a, b) => b.date.localeCompare(a.date));

    const todayLog = habitLogsList.find(l => l.date === todayStr);
    const completedToday = Boolean(todayLog?.completed);

    // Calculate current consecutive streak
    let currentStreak = 0;
    let checkDate = new Date();

    // If today is completed, streak includes today
    if (!completedToday) {
      // Check if yesterday was completed
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const log = habitLogsList.find(l => l.date === dateStr);
      if (log && log.completed) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Best streak and 30-day completion rate
    let bestStreak = currentStreak;
    let tempStreak = 0;
    const sortedChronological = [...habitLogsList].sort((a, b) => a.date.localeCompare(b.date));
    sortedChronological.forEach(l => {
      if (l.completed) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    });

    // 30-day completion rate
    const last30Days = sortedChronological.slice(-30);
    const completedCount = last30Days.filter(l => l.completed).length;
    const completionRate = last30Days.length > 0 ? Math.round((completedCount / last30Days.length) * 100) : 0;

    return {
      current: currentStreak,
      best: Math.max(bestStreak, currentStreak),
      completionRate,
      completedToday
    };
  }, [habitLogs]);

  // Toggle Habit Today
  const toggleHabitToday = useCallback((habitId: string) => {
    const todayStr = getTodayString();
    setHabitLogs(prev => {
      const existingIdx = prev.findIndex(l => l.habitId === habitId && l.date === todayStr);
      let nextCompleted = true;

      if (existingIdx >= 0) {
        nextCompleted = !prev[existingIdx].completed;
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          completed: nextCompleted,
          completedAt: nextCompleted ? new Date().toISOString() : undefined
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `log_${habitId}_${todayStr}`,
            habitId,
            userId: user.uid,
            date: todayStr,
            completed: true,
            completedAt: new Date().toISOString()
          }
        ];
      }
    });

    // Play subtle celebratory confetti on check-in
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#38bdf8', '#fbbf24']
      });
    } catch {
      // Ignore if confetti context unavailable
    }
  }, [user.uid]);

  const addHabit = useCallback((newHabit: Omit<Habit, 'id' | 'createdAt'>) => {
    const habit: Habit = {
      ...newHabit,
      id: `h_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [habit, ...prev]);
  }, []);

  const updateHabit = useCallback((updated: Habit) => {
    setHabits(prev => prev.map(h => h.id === updated.id ? updated : h));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId));
    setHabitLogs(prev => prev.filter(l => l.habitId !== habitId));
  }, []);

  const setHabitStatus = useCallback((habitId: string, status: 'active' | 'paused' | 'archived') => {
    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, status } : h));
  }, []);

  // Goal Operations
  const addGoal = useCallback((newGoal: Omit<Goal, 'id' | 'createdAt' | 'logs'>) => {
    const goal: Goal = {
      ...newGoal,
      id: `g_${Date.now()}`,
      createdAt: new Date().toISOString(),
      logs: []
    };
    setGoals(prev => [goal, ...prev]);
  }, []);

  const updateGoal = useCallback((updated: Goal) => {
    setGoals(prev => prev.map(g => g.id === updated.id ? updated : g));
  }, []);

  const deleteGoal = useCallback((goalId: string) => {
    setGoals(prev => prev.filter(g => g.id !== goalId));
  }, []);

  const logGoalProgress = useCallback((goalId: string, value: number, note?: string) => {
    const todayStr = getTodayString();
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const newLog = {
        id: `gl_${Date.now()}`,
        goalId,
        date: todayStr,
        value,
        note,
        createdAt: new Date().toISOString()
      };
      const newCurrent = g.targetType === 'numeric'
        ? Math.min(g.targetValue, g.currentValue + value)
        : Math.min(100, g.currentValue + value);

      const isCompleted = newCurrent >= g.targetValue;
      if (isCompleted && g.status !== 'completed') {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
        addNotification({
          type: 'daily_goal_reminder',
          title: `Goal Achieved: ${g.title}! 🏆`,
          message: `Congratulations! You reached the target of ${g.targetValue} ${g.unit || ''}.`,
          linkTab: 'goals'
        });
      }

      return {
        ...g,
        currentValue: newCurrent,
        status: isCompleted ? 'completed' : g.status,
        logs: [newLog, ...g.logs]
      };
    }));
  }, [addNotification]);

  const toggleMilestone = useCallback((goalId: string, milestoneId: string) => {
    setGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updatedMilestones = g.milestones.map(m =>
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );

      // If checklist target, update currentValue
      let nextCurrent = g.currentValue;
      if (g.targetType === 'checklist') {
        nextCurrent = updatedMilestones.filter(m => m.completed).length;
      }

      return {
        ...g,
        milestones: updatedMilestones,
        currentValue: nextCurrent
      };
    }));
  }, []);

  // Daily Goals
  const addDailyGoal = useCallback((title: string, shared: boolean, targetTime?: string) => {
    const item: DailyGoalItem = {
      id: `dg_${Date.now()}`,
      userId: user.uid,
      date: getTodayString(),
      title,
      completed: false,
      sharedWithPartner: shared,
      targetTime
    };
    setDailyGoals(prev => [item, ...prev]);
  }, [user.uid]);

  const toggleDailyGoal = useCallback((dailyGoalId: string) => {
    setDailyGoals(prev => prev.map(dg => {
      if (dg.id !== dailyGoalId) return dg;
      const nextCompleted = !dg.completed;
      if (nextCompleted) {
        confetti({
          particleCount: 40,
          spread: 70,
          origin: { y: 0.7 }
        });
      }
      return {
        ...dg,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date().toISOString() : undefined
      };
    }));
  }, []);

  const deleteDailyGoal = useCallback((dailyGoalId: string) => {
    setDailyGoals(prev => prev.filter(dg => dg.id !== dailyGoalId));
  }, []);

  // Expense Operations
  const addExpense = useCallback((item: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...item,
      id: `e_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setExpenses(prev => [expense, ...prev]);
  }, []);

  const updateExpense = useCallback((updated: Expense) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  }, []);

  const deleteExpense = useCallback((expenseId: string) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  }, []);

  const updateBudget = useCallback((category: string, monthlyLimit: number) => {
    setBudgets(prev => {
      const idx = prev.findIndex(b => b.category === category);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { category, monthlyLimit };
        return copy;
      }
      return [...prev, { category, monthlyLimit }];
    });
  }, []);

  const getCategorySpentThisMonth = useCallback((category: string): number => {
    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return expenses
      .filter(e => e.type === 'expense' && e.category === category && e.date.startsWith(currentYearMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getTotalSpentThisMonth = useCallback((): number => {
    const today = new Date();
    const currentYearMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return expenses
      .filter(e => e.type === 'expense' && e.date.startsWith(currentYearMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const getMonthlyBudgetTotal = useCallback((): number => {
    return budgets.reduce((sum, b) => sum + b.monthlyLimit, 0);
  }, [budgets]);

  // Collaborator & Nudge Operations
  const sendManualNudge = useCallback((targetItemId: string, targetItemTitle: string) => {
    if (!collaboratorPair || collaboratorPair.status !== 'active') {
      return { success: false, message: 'No active collaborator connected.' };
    }

    // Check quiet hours
    const now = new Date();
    const hours = now.getHours();
    const [startH] = user.quietHoursStart.split(':').map(Number);
    const [endH] = user.quietHoursEnd.split(':').map(Number);
    const inQuietHours = startH > endH
      ? (hours >= startH || hours < endH)
      : (hours >= startH && hours < endH);

    if (inQuietHours) {
      return {
        success: false,
        message: `Partner is currently in quiet hours (${user.quietHoursStart} - ${user.quietHoursEnd}). Nudge delayed.`
      };
    }

    // Rate limiting: check if nudged in last 24h for this item
    const lastNudges = LocalStorageService.getItem<NudgeRecord[]>(STORAGE_KEYS.NUDGES, []);
    const todayStr = getTodayString();
    const alreadyNudged = lastNudges.some(
      n => n.targetItemId === targetItemId && n.date === todayStr
    );

    if (alreadyNudged) {
      return {
        success: false,
        message: 'Rate limit: You have already nudged for this goal today (max 1/day).'
      };
    }

    // Record nudge
    const newNudge: NudgeRecord = {
      id: `nudge_${Date.now()}`,
      senderId: user.uid,
      senderName: user.displayName,
      recipientId: partnerData.partnerProfile.uid,
      targetItemId,
      targetItemTitle,
      message: `Friendly nudge from ${user.displayName}: Keep moving on "${targetItemTitle}"! 💪`,
      timestamp: new Date().toISOString(),
      date: todayStr
    };
    LocalStorageService.setItem(STORAGE_KEYS.NUDGES, [newNudge, ...lastNudges]);

    // Mark item nudged in partnerData
    setPartnerData(prev => ({
      ...prev,
      dailyGoals: prev.dailyGoals.map(dg =>
        dg.id === targetItemId ? { ...dg, nudgedToday: true } : dg
      )
    }));

    // Trigger simulated push notification response from partner
    setTimeout(() => {
      addNotification({
        type: 'partner_nudge',
        title: `Nudge Sent to ${partnerData.partnerProfile.displayName || 'Partner'}`,
        message: `${partnerData.partnerProfile.displayName || 'Partner'} received your nudge for "${targetItemTitle}" via Web Push!`,
        linkTab: 'collaborator'
      });
    }, 1200);

    return {
      success: true,
      message: `Nudge successfully sent to ${partnerData.partnerProfile.displayName}!`
    };
  }, [collaboratorPair, user, partnerData, addNotification]);

  // Reaction to partner item
  const sendReactionToPartner = useCallback((
    itemId: string,
    itemType: 'habit' | 'goal' | 'dailyGoal',
    emoji: string
  ) => {
    const newReaction = {
      id: `rx_${Date.now()}`,
      itemId,
      itemType,
      senderId: user.uid,
      senderName: user.displayName,
      emoji,
      createdAt: new Date().toISOString()
    };

    setPartnerData(prev => {
      return {
        ...prev,
        dailyGoals: prev.dailyGoals.map(dg =>
          dg.id === itemId
            ? { ...dg, reactions: [...dg.reactions, newReaction] }
            : dg
        ),
        habits: prev.habits.map(h =>
          h.id === itemId
            ? { ...h, reactions: [...h.reactions, newReaction] }
            : h
        )
      };
    });

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.8 }
    });
  }, [user]);

  // Simulated live action for testing Partner View
  const togglePartnerDailyGoalSimulated = useCallback((goalId: string) => {
    setPartnerData(prev => {
      const updated = prev.dailyGoals.map(dg => {
        if (dg.id !== goalId) return dg;
        const nextDone = !dg.completed;
        return {
          ...dg,
          completed: nextDone,
          completedAt: nextDone ? new Date().toISOString() : undefined
        };
      });

      const toggledItem = updated.find(dg => dg.id === goalId);
      if (toggledItem && toggledItem.completed) {
        addNotification({
          type: 'partner_completed',
          title: `${prev.partnerProfile.displayName || 'Partner'} completed a goal! 🎉`,
          message: `${prev.partnerProfile.displayName || 'Partner'} just finished "${toggledItem.title}". Send them a cheer reaction!`,
          linkTab: 'collaborator'
        });
      }

      return { ...prev, dailyGoals: updated };
    });
  }, [addNotification]);

  // Connect partner with invite code
  const connectPartnerWithCode = useCallback((code: string): boolean => {
    if (!code || code.trim().length < 4) return false;
    const partnerName = code.toUpperCase().includes('DEMO') ? 'Alex Rivera' : 'Accountability Partner';
    const newPair: CollaboratorPair = {
      id: `pair_${Date.now()}`,
      userAId: user.uid,
      userBId: `partner_${Date.now()}`,
      userAName: user.displayName || 'Primary User',
      userBName: partnerName,
      userAAvatar: user.photoURL,
      userBAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      status: 'active',
      inviteCode: code.toUpperCase().trim(),
      createdAt: new Date().toISOString()
    };
    setCollaboratorPair(newPair);
    setPartnerData(prev => ({
      ...prev,
      partnerProfile: {
        uid: newPair.userBId,
        displayName: partnerName,
        photoURL: newPair.userBAvatar,
        streakDays: 1,
        completionRate: 100
      }
    }));
    addNotification({
      type: 'partner_completed',
      title: 'Partner Connected! 🤝',
      message: `You and ${partnerName} are now accountability partners.`,
      linkTab: 'collaborator'
    });
    return true;
  }, [user, addNotification]);

  const disconnectPartner = useCallback(() => {
    setCollaboratorPair(null);
  }, []);

  const toggleItemSharing = useCallback((
    itemType: 'habit' | 'dailyGoal' | 'goal',
    itemId: string
  ) => {
    if (itemType === 'habit') {
      setHabits(prev => prev.map(h => h.id === itemId ? { ...h, sharedWithPartner: !h.sharedWithPartner } : h));
    } else if (itemType === 'dailyGoal') {
      setDailyGoals(prev => prev.map(dg => dg.id === itemId ? { ...dg, sharedWithPartner: !dg.sharedWithPartner } : dg));
    } else if (itemType === 'goal') {
      setGoals(prev => prev.map(g => g.id === itemId ? { ...g, sharedWithPartner: !g.sharedWithPartner } : g));
    }
  }, []);

  // Shared Co-op Quests
  const contributeToQuest = useCallback((questId: string, amount: number, userRole: 'A' | 'B') => {
    setCoopQuests(prev => prev.map(q => {
      if (q.id !== questId) return q;
      const newA = userRole === 'A' ? q.currentValueUserA + amount : q.currentValueUserA;
      const newB = userRole === 'B' ? q.currentValueUserB + amount : q.currentValueUserB;
      const total = newA + newB;
      const isCompleted = total >= q.targetValue;
      if (isCompleted && q.status !== 'completed') {
        confetti({
          particleCount: 60,
          spread: 80,
          origin: { y: 0.6 }
        });
        const partnerName = collaboratorPair?.userBName || 'your partner';
        addNotification({
          type: 'quest_milestone',
          title: `Quest Completed! 🏆`,
          message: `You and ${partnerName} completed "${q.title}" and unlocked the ${q.rewardBadge} badge!`,
          linkTab: 'collaborator'
        });
      }
      return {
        ...q,
        currentValueUserA: newA,
        currentValueUserB: newB,
        status: isCompleted ? 'completed' : 'active'
      };
    }));
  }, [addNotification, collaboratorPair]);

  const addCoopQuest = useCallback((quest: Omit<CoopQuest, 'id' | 'status'>) => {
    const newQuest: CoopQuest = {
      ...quest,
      id: `quest_${Date.now()}`,
      status: 'active'
    };
    setCoopQuests(prev => [newQuest, ...prev]);
    const partnerName = collaboratorPair?.userBName || 'your partner';
    addNotification({
      type: 'quest_milestone',
      title: 'New Co-op Quest Initiated ⚔️',
      message: `You started the joint challenge "${newQuest.title}" with ${partnerName}!`,
      linkTab: 'collaborator'
    });
  }, [addNotification, collaboratorPair]);

  // Streak Freeze & Rescue
  const activateStreakFreeze = useCallback((): boolean => {
    if (streakFreeze.availableFreezes <= 0 || streakFreeze.isShieldActiveToday) return false;

    setStreakFreeze(prev => ({
      ...prev,
      availableFreezes: prev.availableFreezes - 1,
      freezesUsedThisMonth: prev.freezesUsedThisMonth + 1,
      isShieldActiveToday: true,
      lastUsedDate: getTodayString()
    }));

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#818cf8', '#c084fc']
    });

    addNotification({
      type: 'streak_freeze_gifted',
      title: 'Streak Shield Activated! 🛡️',
      message: 'Your active streaks are safeguarded against missed check-ins for the next 24 hours.',
      linkTab: 'collaborator'
    });
    return true;
  }, [streakFreeze, addNotification]);

  const giftFreezeToPartner = useCallback((): boolean => {
    if (streakFreeze.availableFreezes <= 0) return false;

    setStreakFreeze(prev => ({
      ...prev,
      availableFreezes: prev.availableFreezes - 1,
      partnerGiftedCount: prev.partnerGiftedCount + 1
    }));

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ec4899', '#8b5cf6', '#38bdf8']
    });

    const partnerName = partnerData.partnerProfile.displayName || collaboratorPair?.userBName || 'your partner';
    addNotification({
      type: 'streak_freeze_gifted',
      title: `Streak Rescue Gifted to ${partnerName}! 🎁`,
      message: `You transferred 1 streak shield to save ${partnerName}'s streak!`,
      linkTab: 'collaborator'
    });
    return true;
  }, [streakFreeze, partnerData, collaboratorPair, addNotification]);

  // Subscription Vault
  const addSubscription = useCallback((sub: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      ...sub,
      id: `sub_${Date.now()}`
    };
    setSubscriptions(prev => [...prev, newSub]);
    addNotification({
      type: 'subscription_reminder',
      title: 'Subscription Tracked 💳',
      message: `Added "${newSub.name}" (${formatCurrency(newSub.cost)}/${newSub.billingCycle}) to your Vault.`,
      linkTab: 'expenses'
    });
  }, [formatCurrency, addNotification]);

  const updateSubscription = useCallback((sub: SubscriptionItem) => {
    setSubscriptions(prev => prev.map(s => s.id === sub.id ? sub : s));
  }, []);

  const deleteSubscription = useCallback((subId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
  }, []);

  const toggleSubscriptionActive = useCallback((subId: string) => {
    setSubscriptions(prev => prev.map(s => s.id === subId ? { ...s, active: !s.active } : s));
  }, []);

  const totalMonthlySubscriptionCost = useMemo(() => {
    return subscriptions
      .filter(s => s.active)
      .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.cost / 12 : s.cost), 0);
  }, [subscriptions]);

  // Bento Tile Customization
  const toggleBentoTile = useCallback((id: BentoTileId) => {
    setBentoTiles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  }, []);

  const reorderBentoTiles = useCallback((reordered: BentoTileConfig[]) => {
    setBentoTiles(reordered.map((t, idx) => ({ ...t, order: idx + 1 })));
  }, []);

  const resetBentoTiles = useCallback(() => {
    setBentoTiles(INITIAL_BENTO_TILES);
  }, []);

  // Predictive Budget Burn Forecast
  const getPredictiveBudgetForecast = useCallback(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(0, daysInMonth - dayOfMonth);

    const currentSpent = getTotalSpentThisMonth();
    const totalBudget = getMonthlyBudgetTotal();

    const dailyPace = currentSpent / Math.max(1, dayOfMonth);
    const projectedMonthEndSpend = dailyPace * daysInMonth;

    let burnExhaustionDay = daysInMonth;
    if (dailyPace > 0) {
      burnExhaustionDay = Math.min(365, Math.floor(totalBudget / dailyPace));
    }

    const budgetSafe = projectedMonthEndSpend <= totalBudget;
    const deltaVsBudget = Math.abs(projectedMonthEndSpend - totalBudget);
    const daysDelta = burnExhaustionDay - daysInMonth;

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthName = monthNames[today.getMonth()];
    const exhaustionDateFormatted = daysDelta < 0
      ? `${currentMonthName} ${Math.max(1, burnExhaustionDay)}`
      : `${monthNames[(today.getMonth() + 1) % 12]} ${Math.max(1, burnExhaustionDay - daysInMonth)}`;

    let recommendation = 'Pacing is on track! Your current burn rate comfortably respects your limits.';
    if (!budgetSafe) {
      const allowedDailyRemaining = daysRemaining > 0 ? (totalBudget - currentSpent) / daysRemaining : 0;
      recommendation = allowedDailyRemaining > 0
        ? `Limit discretionary spend to ${formatCurrency(allowedDailyRemaining)}/day for the next ${daysRemaining} days to avoid an overrun.`
        : `Monthly budget cap reached. Focus on essential expenses only for the remainder of the cycle.`;
    }

    return {
      dailyPace,
      projectedMonthEndSpend,
      projectedExhaustionDate: exhaustionDateFormatted,
      daysRemainingInMonth: daysRemaining,
      budgetSafe,
      deltaVsBudget,
      daysDelta,
      totalBudget,
      currentSpent,
      recommendation
    };
  }, [getTotalSpentThisMonth, getMonthlyBudgetTotal, formatCurrency]);

  // Weekly Bento AI Debrief
  const getWeeklyAiDebrief = useCallback((): WeeklyAiDebrief => {
    const forecast = getPredictiveBudgetForecast();
    
    const habitsCompletedToday = habits.filter(h => {
      const logs = habitLogs.filter(l => l.habitId === h.id && l.date === getTodayString() && l.completed);
      return logs.length > 0;
    }).length;
    const habitRateToday = habits.length > 0 ? Math.round((habitsCompletedToday / habits.length) * 100) : 100;

    const score = habits.length === 0
      ? 90
      : Math.min(100, Math.round(habitRateToday * 0.45 + (forecast.budgetSafe ? 45 : 30) + (collaboratorPair ? 10 : 5)));
    
    let grade: 'A+' | 'A' | 'B+' | 'B' | 'C' = 'B+';
    if (score >= 95) grade = 'A+';
    else if (score >= 88) grade = 'A';
    else if (score >= 78) grade = 'B+';
    else if (score >= 68) grade = 'B';
    else grade = 'C';

    const weekStart = getDateOffsetString(-6);
    const weekEnd = getTodayString();
    const partnerName = collaboratorPair?.userBName || 'your partner';

    const winsList = habits.length > 0
      ? [
          `${habits[0].name} consistency tracking strong this cycle.`,
          'Daily routine check-ins successfully logged.',
          streakFreeze.availableFreezes > 0 ? `${streakFreeze.availableFreezes} streak freeze shield banked and ready.` : 'Streak protection active.'
        ]
      : [
          'Welcome to PulseFlow OS! Clean slate ready for routines.',
          'Budget and category tracking configured.',
          'Accountability hub ready for duo pairing.'
        ];

    const frictionList = [
      forecast.budgetSafe
        ? 'Expense burn rate is calibrated within safe margins.'
        : `Current spending pace projects monthly limit reach on ${forecast.projectedExhaustionDate}.`,
      habits.length === 0 ? 'Add your first 3 daily habits to build routine momentum.' : 'Remember to complete evening habits before quiet hours.'
    ];

    const correlationsList = collaboratorPair
      ? [
          {
            insight: 'Duo Synergy → Habit Retention',
            impact: `Shared accountability with ${partnerName} actively boosts consistency.`
          },
          {
            insight: 'Early Check-in → Task Velocity',
            impact: '+34% higher completion rate when habits logged before noon.'
          }
        ]
      : [
          {
            insight: 'Accountability Impact',
            impact: 'Pairing with an accountability partner increases routine adherence by 2.4x.'
          },
          {
            insight: 'Morning Momentum',
            impact: 'Checking off daily tasks early creates sustained focus throughout the day.'
          }
        ];

    return {
      weekRange: `${weekStart} – ${weekEnd}`,
      score,
      grade,
      headline: score >= 90
        ? 'High Velocity Flow State: Peak Consistency & Joint Synergy'
        : 'Steady Momentum with Actionable Budget Calibrations',
      summary: collaboratorPair
        ? `You maintained a strong ${habitRateToday}% routine compliance this week. Your collaboration with ${partnerName} is keeping your goals aligned.`
        : `You are in full control of your daily dashboard. Log habits and priority tasks daily to establish momentum.`,
      wins: winsList,
      frictionPoints: frictionList,
      correlations: correlationsList,
      forecast: {
        budgetBurnDate: forecast.projectedExhaustionDate,
        isOverBudget: !forecast.budgetSafe,
        daysDelta: forecast.daysDelta,
        projectedEndSpend: forecast.projectedMonthEndSpend
      }
    };
  }, [habits, habitLogs, collaboratorPair, getPredictiveBudgetForecast, streakFreeze]);

  // Update user profile
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  // Reset to default (Clean slate)
  const resetAllDataToDefault = useCallback(() => {
    LocalStorageService.clearAll();
    setUser(INITIAL_USER);
    setHabits(INITIAL_HABITS);
    setHabitLogs(generateInitialHabitLogs());
    setGoals(INITIAL_GOALS);
    setDailyGoals(INITIAL_DAILY_GOALS);
    setExpenses(INITIAL_EXPENSES);
    setBudgets(INITIAL_BUDGETS);
    setCollaboratorPair(INITIAL_PAIR);
    setPartnerData(INITIAL_PARTNER_DATA);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCoopQuests(INITIAL_COOP_QUESTS);
    setStreakFreeze(INITIAL_STREAK_FREEZE);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setBentoTiles(INITIAL_BENTO_TILES);
  }, []);

  // Load sample demo dataset (for test driving)
  const loadSampleDemoData = useCallback(() => {
    LocalStorageService.loadSampleData();
    setUser(SAMPLE_DEMO_DATA.user);
    setHabits(SAMPLE_DEMO_DATA.habits);
    setHabitLogs(SAMPLE_DEMO_DATA.habitLogs);
    setGoals(SAMPLE_DEMO_DATA.goals);
    setDailyGoals(SAMPLE_DEMO_DATA.dailyGoals);
    setExpenses(SAMPLE_DEMO_DATA.expenses);
    setBudgets(SAMPLE_DEMO_DATA.budgets);
    setCollaboratorPair(SAMPLE_DEMO_DATA.pair);
    setPartnerData(SAMPLE_DEMO_DATA.partnerData);
    setNotifications(SAMPLE_DEMO_DATA.notifications);
    setCoopQuests(SAMPLE_DEMO_DATA.coopQuests);
    setStreakFreeze(SAMPLE_DEMO_DATA.streakFreeze);
    setSubscriptions(SAMPLE_DEMO_DATA.subscriptions);
    setBentoTiles(INITIAL_BENTO_TILES);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        syncStatus,
        isOnline,
        habits,
        habitLogs,
        goals,
        dailyGoals,
        expenses,
        budgets,
        collaboratorPair,
        partnerData,
        notifications,
        unreadNotificationCount,
        toggleHabitToday,
        addHabit,
        updateHabit,
        deleteHabit,
        setHabitStatus,
        getHabitStreak,
        addGoal,
        updateGoal,
        deleteGoal,
        logGoalProgress,
        toggleMilestone,
        addDailyGoal,
        toggleDailyGoal,
        deleteDailyGoal,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
        getCategorySpentThisMonth,
        getTotalSpentThisMonth,
        getMonthlyBudgetTotal,
        formatCurrency,
        sendManualNudge,
        sendReactionToPartner,
        togglePartnerDailyGoalSimulated,
        connectPartnerWithCode,
        disconnectPartner,
        toggleItemSharing,
        coopQuests,
        contributeToQuest,
        addCoopQuest,
        streakFreeze,
        activateStreakFreeze,
        giftFreezeToPartner,
        subscriptions,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscriptionActive,
        totalMonthlySubscriptionCost,
        bentoTiles,
        toggleBentoTile,
        reorderBentoTiles,
        resetBentoTiles,
        getPredictiveBudgetForecast,
        getWeeklyAiDebrief,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        addNotification,
        updateUserProfile,
        triggerSyncNow,
        resetAllDataToDefault,
        loadSampleDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
