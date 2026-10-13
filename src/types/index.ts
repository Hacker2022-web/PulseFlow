export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  timeZone: string;
  currency: CurrencyCode;
  createdAt: string;
  quietHoursStart: string; // e.g. "22:00"
  quietHoursEnd: string;   // e.g. "08:00"
  notificationsEnabled: boolean;
  inviteCode?: string;
}

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom_weekly';

export interface Habit {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  weeklyTargetDays?: number; // e.g., 4 times a week
  targetDaysOfWeek?: number[]; // [1,2,3,4,5] for weekdays (0=Sun, 1=Mon, ...)
  reminderTime?: string; // "07:30"
  sharedWithPartner: boolean;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  completed: boolean;
  completedAt?: string; // ISO string
}

export type GoalTargetType = 'numeric' | 'percentage' | 'checklist';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface ProgressLog {
  id: string;
  goalId: string;
  date: string;
  value: number;
  note?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  category: string;
  targetType: GoalTargetType;
  currentValue: number;
  targetValue: number;
  unit?: string; // e.g. "km", "pages", "hours", "%"
  startDate: string;
  deadline: string;
  milestones: Milestone[];
  logs: ProgressLog[];
  sharedWithPartner: boolean;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';

export interface DailyGoalItem {
  id: string;
  userId: string;
  date: string; // "YYYY-MM-DD"
  title: string;
  completed: boolean;
  completedAt?: string;
  sharedWithPartner: boolean;
  targetTime?: string; // e.g., "20:00" for reminder
  priority?: TaskPriority;
  deadline?: string; // e.g., "2026-10-13T18:00" or "18:00" for live deadline countdown timer
  nudgedToday?: boolean;
}

export type ExpenseCategory =
  | 'Food & Dining'
  | 'Housing & Utilities'
  | 'Transportation'
  | 'Shopping & Groceries'
  | 'Health & Fitness'
  | 'Entertainment'
  | 'Education & Learning'
  | 'Personal Care'
  | 'Income'
  | 'Others';

export type PaymentMethod = 'Card' | 'Cash' | 'Bank Transfer' | 'Digital Wallet';

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  type: 'expense' | 'income';
  category: ExpenseCategory | string;
  date: string; // "YYYY-MM-DD"
  note?: string;
  paymentMethod: PaymentMethod;
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';
  sharedWithPartner: boolean; // default false
  createdAt: string;
}

export interface CategoryBudget {
  category: ExpenseCategory | string;
  monthlyLimit: number;
}

export interface CollaboratorPair {
  id: string;
  userAId: string;
  userBId: string;
  userAName: string;
  userBName: string;
  userAAvatar: string;
  userBAvatar: string;
  status: 'active' | 'pending' | 'disconnected';
  inviteCode: string;
  createdAt: string;
  lastNudgeSentAt?: string;
}

export interface PartnerReaction {
  id: string;
  itemId: string;
  itemType: 'habit' | 'goal' | 'dailyGoal';
  senderId: string;
  senderName: string;
  emoji: string; // 🎉, 🔥, 👏, 💪, 🚀
  createdAt: string;
}

export interface NudgeRecord {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  targetItemId: string;
  targetItemTitle: string;
  message: string;
  timestamp: string;
  date: string;
}

export type NotificationType =
  | 'habit_reminder'
  | 'daily_goal_reminder'
  | 'partner_nudge'
  | 'partner_reaction'
  | 'partner_completed'
  | 'streak_freeze_gifted'
  | 'quest_milestone'
  | 'subscription_reminder'
  | 'budget_alert_80'
  | 'budget_alert_100';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTab?: 'dashboard' | 'habits' | 'goals' | 'expenses' | 'collaborator';
}

export type SyncStatus = 'synced' | 'syncing' | 'offline';

// --- Shared Co-op Quests ---
export interface CoopQuest {
  id: string;
  title: string;
  description: string;
  category: 'fitness' | 'finance' | 'wellness' | 'learning';
  targetValue: number;
  currentValueUserA: number;
  currentValueUserB: number;
  unit: string;
  startDate: string;
  endDate: string;
  rewardBadge: string;
  status: 'active' | 'completed';
}

// --- Streak Freeze & Rescue ---
export interface StreakFreezeInfo {
  availableFreezes: number;
  freezesUsedThisMonth: number;
  partnerGiftedCount: number;
  lastUsedDate?: string;
  isShieldActiveToday: boolean;
}

// --- Subscription Vault ---
export interface SubscriptionItem {
  id: string;
  name: string;
  category: ExpenseCategory | string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string; // YYYY-MM-DD
  active: boolean;
  autoRenew: boolean;
  icon?: string;
}

// --- Bento Tile Customization ---
export type BentoTileId =
  | 'heroGreeting'
  | 'weeklyOverview'
  | 'aiDebrief'
  | 'coopQuests'
  | 'habits'
  | 'tasks'
  | 'expenses'
  | 'subscriptions'
  | 'partnerBanner';

export interface BentoTileConfig {
  id: BentoTileId;
  label: string;
  description: string;
  enabled: boolean;
  order: number;
}

// --- Weekly Bento AI Debrief ---
export interface WeeklyAiDebrief {
  weekRange: string;
  score: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | '--';
  headline: string;
  summary: string;
  wins: string[];
  frictionPoints: string[];
  correlations: {
    insight: string;
    impact: string;
  }[];
  forecast: {
    budgetBurnDate: string;
    isOverBudget: boolean;
    daysDelta: number;
    projectedEndSpend: number;
  };
}

