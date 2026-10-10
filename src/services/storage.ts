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
  PartnerReaction,
  CoopQuest,
  StreakFreezeInfo,
  SubscriptionItem,
  BentoTileConfig
} from '../types';

const STORAGE_KEYS = {
  USER: 'synctrack_user',
  HABITS: 'synctrack_habits',
  HABIT_LOGS: 'synctrack_habit_logs',
  GOALS: 'synctrack_goals',
  DAILY_GOALS: 'synctrack_daily_goals',
  EXPENSES: 'synctrack_expenses',
  BUDGETS: 'synctrack_budgets',
  PAIR: 'synctrack_pair',
  PARTNER_ITEMS: 'synctrack_partner_items',
  NOTIFICATIONS: 'synctrack_notifications',
  NUDGES: 'synctrack_nudges',
  REACTIONS: 'synctrack_reactions',
  FIREBASE_CONFIG: 'synctrack_fb_config',
  COOP_QUESTS: 'synctrack_coop_quests',
  STREAK_FREEZE: 'synctrack_streak_freeze',
  SUBSCRIPTIONS: 'synctrack_subscriptions',
  BENTO_TILES: 'synctrack_bento_tiles'
};

// Helper to format date string YYYY-MM-DD
export function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDateOffsetString(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// -------------------------------------------------------------
// CLEAN PRODUCTION SLATE (ZERO DEMO DATA)
// -------------------------------------------------------------

export const INITIAL_USER: UserProfile = {
  uid: 'user_pulse_' + Math.random().toString(36).substring(2, 9),
  displayName: 'My Account',
  email: '',
  photoURL: '',
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  currency: 'USD',
  createdAt: new Date().toISOString(),
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  notificationsEnabled: true
};

export const INITIAL_PAIR: CollaboratorPair | null = null;

export const INITIAL_HABITS: Habit[] = [];

export function generateInitialHabitLogs(): HabitLog[] {
  return [];
}

export const INITIAL_GOALS: Goal[] = [];

export const INITIAL_DAILY_GOALS: DailyGoalItem[] = [];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Food & Dining', monthlyLimit: 500 },
  { category: 'Housing & Utilities', monthlyLimit: 1200 },
  { category: 'Transportation', monthlyLimit: 200 },
  { category: 'Shopping & Groceries', monthlyLimit: 400 },
  { category: 'Health & Fitness', monthlyLimit: 150 },
  { category: 'Entertainment', monthlyLimit: 120 },
  { category: 'Education & Learning', monthlyLimit: 100 },
  { category: 'Others', monthlyLimit: 200 }
];

export const INITIAL_EXPENSES: Expense[] = [];

export interface PartnerSharedData {
  partnerProfile: {
    uid: string;
    displayName: string;
    photoURL: string;
    streakDays: number;
    completionRate: number;
  };
  dailyGoals: {
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
    targetTime?: string;
    nudgedToday?: boolean;
    reactions: PartnerReaction[];
  }[];
  habits: {
    id: string;
    name: string;
    icon: string;
    color: string;
    currentStreak: number;
    completedToday: boolean;
    reminderTime?: string;
    reactions: PartnerReaction[];
  }[];
}

export const INITIAL_PARTNER_DATA: PartnerSharedData = {
  partnerProfile: {
    uid: '',
    displayName: '',
    photoURL: '',
    streakDays: 0,
    completionRate: 0
  },
  dailyGoals: [],
  habits: []
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [];

export const INITIAL_COOP_QUESTS: CoopQuest[] = [];

export const INITIAL_STREAK_FREEZE: StreakFreezeInfo = {
  availableFreezes: 1,
  freezesUsedThisMonth: 0,
  partnerGiftedCount: 0,
  isShieldActiveToday: false
};

export const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [];

export const INITIAL_BENTO_TILES: BentoTileConfig[] = [
  { id: 'heroGreeting', label: 'Hero Overview & Mini Pods', description: 'Daily greeting, productivity score, and habit metrics', enabled: true, order: 1 },
  { id: 'weeklyOverview', label: 'Weekly Overview & Pacing', description: 'Weekly habit consistency and spend rate', enabled: true, order: 2 },
  { id: 'aiDebrief', label: 'Weekly Bento AI Debrief', description: 'AI performance grade, friction analysis, and correlation insights', enabled: true, order: 3 },
  { id: 'coopQuests', label: 'Co-op Duo Quests', description: 'Shared targets and milestones with partner', enabled: true, order: 4 },
  { id: 'habits', label: 'Daily Habits List', description: 'Interactive routine check-ins with streaks', enabled: true, order: 5 },
  { id: 'tasks', label: 'Priority Must-Dos', description: 'Time-targeted focus list for today', enabled: true, order: 6 },
  { id: 'expenses', label: 'Predictive Expense Burn & Tracker', description: 'Monthly budget burn forecast and recent spends', enabled: true, order: 7 },
  { id: 'subscriptions', label: 'Subscription Vault Quick-View', description: 'Upcoming recurring renewals and monthly burn', enabled: true, order: 8 },
  { id: 'partnerBanner', label: 'Collaborator Sync Banner', description: 'Accountability status, shared streak, and partner portal', enabled: true, order: 9 }
];

// -------------------------------------------------------------
// SAMPLE / DEMO DATASET (OPTIONAL TEST-DRIVE PRESET)
// -------------------------------------------------------------

export const SAMPLE_DEMO_DATA: {
  user: UserProfile;
  pair: CollaboratorPair;
  habits: Habit[];
  habitLogs: HabitLog[];
  goals: Goal[];
  dailyGoals: DailyGoalItem[];
  expenses: Expense[];
  budgets: CategoryBudget[];
  partnerData: PartnerSharedData;
  notifications: AppNotification[];
  coopQuests: CoopQuest[];
  streakFreeze: StreakFreezeInfo;
  subscriptions: SubscriptionItem[];
} = {
  user: {
    uid: 'demo_user_001',
    displayName: 'Jordan Miller',
    email: 'jordan@pulseflow.app',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
    currency: 'USD' as const,
    createdAt: new Date().toISOString(),
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationsEnabled: true
  },
  pair: {
    id: 'pair_demo_99',
    userAId: 'demo_user_001',
    userBId: 'demo_partner_002',
    userAName: 'Jordan Miller',
    userBName: 'Alex Rivera',
    userAAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    userBAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    status: 'active' as const,
    inviteCode: 'PULSE-7749',
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  habits: [
    {
      id: 'h1',
      userId: 'demo_user_001',
      name: 'Morning Hydration & Electrolytes',
      icon: 'Droplets',
      color: '#06b6d4',
      frequency: 'daily' as const,
      reminderTime: '07:30',
      sharedWithPartner: true,
      status: 'active' as const,
      createdAt: new Date(Date.now() - 40 * 86400000).toISOString()
    },
    {
      id: 'h2',
      userId: 'demo_user_001',
      name: '30-Min Deep Focus Reading',
      icon: 'BookOpen',
      color: '#8b5cf6',
      frequency: 'daily' as const,
      reminderTime: '21:00',
      sharedWithPartner: true,
      status: 'active' as const,
      createdAt: new Date(Date.now() - 35 * 86400000).toISOString()
    },
    {
      id: 'h3',
      userId: 'demo_user_001',
      name: 'Strength & Core Workout',
      icon: 'Dumbbell',
      color: '#f97316',
      frequency: 'weekdays' as const,
      weeklyTargetDays: 5,
      reminderTime: '18:00',
      sharedWithPartner: true,
      status: 'active' as const,
      createdAt: new Date(Date.now() - 28 * 86400000).toISOString()
    }
  ],
  habitLogs: [
    { id: 'log_h1_today', habitId: 'h1', userId: 'demo_user_001', date: getTodayString(), completed: true, completedAt: `${getTodayString()}T08:00:00Z` },
    { id: 'log_h2_today', habitId: 'h2', userId: 'demo_user_001', date: getTodayString(), completed: false },
    { id: 'log_h3_today', habitId: 'h3', userId: 'demo_user_001', date: getTodayString(), completed: true, completedAt: `${getTodayString()}T18:30:00Z` }
  ],
  goals: [
    {
      id: 'g1',
      userId: 'demo_user_001',
      title: 'Run 100 Kilometers',
      category: 'Fitness',
      targetType: 'numeric' as const,
      currentValue: 68.5,
      targetValue: 100,
      unit: 'km',
      startDate: getDateOffsetString(-20),
      deadline: getDateOffsetString(10),
      sharedWithPartner: true,
      status: 'active' as const,
      createdAt: getDateOffsetString(-20),
      milestones: [
        { id: 'm1_1', title: 'First 25km baseline run', completed: true },
        { id: 'm1_2', title: '50km half-way checkpoint', completed: true },
        { id: 'm1_3', title: '75km long-distance pace', completed: false }
      ],
      logs: []
    }
  ],
  dailyGoals: [
    {
      id: 'dg1',
      userId: 'demo_user_001',
      date: getTodayString(),
      title: 'Review System Design Notes',
      completed: true,
      completedAt: `${getTodayString()}T09:30:00Z`,
      sharedWithPartner: true,
      targetTime: '12:00'
    },
    {
      id: 'dg2',
      userId: 'demo_user_001',
      date: getTodayString(),
      title: '5km Interval Run at Evening Track',
      completed: false,
      sharedWithPartner: true,
      targetTime: '19:30'
    }
  ],
  expenses: [
    {
      id: 'e1',
      userId: 'demo_user_001',
      amount: 38.5,
      type: 'expense' as const,
      category: 'Food & Dining',
      date: getTodayString(),
      note: 'Team lunch bowls & green smoothie',
      paymentMethod: 'Card',
      sharedWithPartner: false,
      createdAt: `${getTodayString()}T13:00:00Z`
    },
    {
      id: 'e2',
      userId: 'demo_user_001',
      amount: 14.99,
      type: 'expense' as const,
      category: 'Entertainment',
      date: getDateOffsetString(-1),
      note: 'Spotify Family Subscription',
      paymentMethod: 'Digital Wallet',
      isRecurring: true,
      recurringFrequency: 'monthly' as const,
      sharedWithPartner: false,
      createdAt: `${getDateOffsetString(-1)}T08:00:00Z`
    }
  ],
  budgets: INITIAL_BUDGETS,
  partnerData: {
    partnerProfile: {
      uid: 'demo_partner_002',
      displayName: 'Alex Rivera',
      photoURL: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
      streakDays: 14,
      completionRate: 92
    },
    dailyGoals: [
      {
        id: 'pdg_1',
        title: 'LeetCode 2 Medium Problems',
        completed: true,
        completedAt: `${getTodayString()}T11:20:00Z`,
        targetTime: '14:00',
        nudgedToday: false,
        reactions: []
      }
    ],
    habits: [
      {
        id: 'ph_1',
        name: 'Cold Shower & Wim Hof Breath',
        icon: 'Zap',
        color: '#3b82f6',
        currentStreak: 18,
        completedToday: true,
        reminderTime: '06:45',
        reactions: []
      }
    ]
  },
  notifications: [
    {
      id: 'notif_1',
      type: 'partner_reaction' as const,
      title: 'Alex reacted with 🔥',
      message: 'Alex cheered your completed daily task!',
      timestamp: new Date().toISOString(),
      read: false,
      linkTab: 'collaborator' as const
    }
  ],
  coopQuests: [
    {
      id: 'quest_1',
      title: '14-Day Zero Sugar Duo Challenge',
      description: 'Avoid refined sugars together for 14 continuous days.',
      category: 'wellness' as const,
      targetValue: 14,
      currentValueUserA: 11,
      currentValueUserB: 12,
      unit: 'days',
      startDate: getDateOffsetString(-12),
      endDate: getDateOffsetString(2),
      rewardBadge: '🌟 Pure Vitality Duo',
      status: 'active' as const
    }
  ],
  streakFreeze: {
    availableFreezes: 2,
    freezesUsedThisMonth: 1,
    partnerGiftedCount: 1,
    lastUsedDate: getDateOffsetString(-8),
    isShieldActiveToday: false
  },
  subscriptions: [
    {
      id: 'sub_1',
      name: 'Spotify Family Plan',
      category: 'Entertainment',
      cost: 179,
      billingCycle: 'monthly' as const,
      renewalDate: getDateOffsetString(3),
      active: true,
      autoRenew: true,
      icon: 'Music'
    }
  ]
};

// -------------------------------------------------------------
// LOCAL STORAGE SERVICE
// -------------------------------------------------------------

export class LocalStorageService {
  static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch (e) {
      console.warn(`Error reading key ${key} from storage:`, e);
      return defaultValue;
    }
  }

  static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to storage:`, e);
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error(`Error removing key ${key} from storage:`, e);
    }
  }

  static clearAll(): void {
    localStorage.clear();
  }

  static loadSampleData(): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(SAMPLE_DEMO_DATA.user));
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(SAMPLE_DEMO_DATA.habits));
    localStorage.setItem(STORAGE_KEYS.HABIT_LOGS, JSON.stringify(SAMPLE_DEMO_DATA.habitLogs));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(SAMPLE_DEMO_DATA.goals));
    localStorage.setItem(STORAGE_KEYS.DAILY_GOALS, JSON.stringify(SAMPLE_DEMO_DATA.dailyGoals));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(SAMPLE_DEMO_DATA.expenses));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(SAMPLE_DEMO_DATA.budgets));
    localStorage.setItem(STORAGE_KEYS.PAIR, JSON.stringify(SAMPLE_DEMO_DATA.pair));
    localStorage.setItem(STORAGE_KEYS.PARTNER_ITEMS, JSON.stringify(SAMPLE_DEMO_DATA.partnerData));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(SAMPLE_DEMO_DATA.notifications));
    localStorage.setItem(STORAGE_KEYS.COOP_QUESTS, JSON.stringify(SAMPLE_DEMO_DATA.coopQuests));
    localStorage.setItem(STORAGE_KEYS.STREAK_FREEZE, JSON.stringify(SAMPLE_DEMO_DATA.streakFreeze));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(SAMPLE_DEMO_DATA.subscriptions));
    localStorage.setItem(STORAGE_KEYS.BENTO_TILES, JSON.stringify(INITIAL_BENTO_TILES));
  }

  // Export full user database as JSON
  static exportFullBackup(): string {
    const backup = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      user: this.getItem(STORAGE_KEYS.USER, INITIAL_USER),
      habits: this.getItem(STORAGE_KEYS.HABITS, INITIAL_HABITS),
      habitLogs: this.getItem(STORAGE_KEYS.HABIT_LOGS, generateInitialHabitLogs()),
      goals: this.getItem(STORAGE_KEYS.GOALS, INITIAL_GOALS),
      dailyGoals: this.getItem(STORAGE_KEYS.DAILY_GOALS, INITIAL_DAILY_GOALS),
      expenses: this.getItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES),
      budgets: this.getItem(STORAGE_KEYS.BUDGETS, INITIAL_BUDGETS),
      pair: this.getItem(STORAGE_KEYS.PAIR, INITIAL_PAIR),
      coopQuests: this.getItem(STORAGE_KEYS.COOP_QUESTS, INITIAL_COOP_QUESTS),
      streakFreeze: this.getItem(STORAGE_KEYS.STREAK_FREEZE, INITIAL_STREAK_FREEZE),
      subscriptions: this.getItem(STORAGE_KEYS.SUBSCRIPTIONS, INITIAL_SUBSCRIPTIONS),
      bentoTiles: this.getItem(STORAGE_KEYS.BENTO_TILES, INITIAL_BENTO_TILES)
    };
    return JSON.stringify(backup, null, 2);
  }

  // Export expenses as CSV (PRD 4.4)
  static exportExpensesToCSV(expenses: Expense[]): string {
    const headers = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes', 'Recurring'];
    const rows = expenses.map(e => [
      e.date,
      e.type,
      `"${e.category}"`,
      e.amount.toFixed(2),
      e.paymentMethod,
      `"${(e.note || '').replace(/"/g, '""')}"`,
      e.isRecurring ? 'Yes' : 'No'
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}

export { STORAGE_KEYS };
