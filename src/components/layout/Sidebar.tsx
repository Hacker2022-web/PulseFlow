import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Users2,
  Settings,
  Flame,
  Zap,
  LogIn
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    collaboratorPair,
    habits,
    getHabitStreak,
    user
  } = useApp();

  const totalStreaks = habits
    .filter(h => h.status === 'active')
    .reduce((acc, h) => acc + getHabitStreak(h.id).current, 0);

  const activeHabitsCount = habits.filter(h => h.status === 'active').length;

  const userInitials = user.displayName
    ? user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'JM';

  return (
    <aside
      className="hidden md:flex w-72 liquid-glass flex-col justify-between p-5 shrink-0 h-screen sticky top-0 z-40 border-r border-white/10 rounded-r-3xl select-none"
      data-purpose="main-navigation-sidebar"
      style={{
        borderRadius: '0px 32px 32px 0px',
        borderWidth: '0 1px 0 0',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        boxShadow: 'rgba(0, 0, 0, 0.65) 16px 0px 48px -12px, rgba(255, 255, 255, 0.06) -1px 0px 0px 0px inset',
      }}
    >
      <div className="flex flex-col gap-6">
        {/* Brand Mark with Specular Liquid Icon */}
        <div className="flex items-center gap-3 px-1">
          <div className="w-10 h-10 rounded-2xl liquid-glass-pill flex items-center justify-center text-indigo-300">
            <Zap className="w-5 h-5 drop-shadow-[0_0_8px_rgba(165,180,252,0.6)]" fill="currentColor" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-white tracking-tight drop-shadow-sm">PulseFlow</span>
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 text-indigo-300">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-medium tracking-wide">Habits • Goals • Cash Flow</p>
          </div>
        </div>

        {/* Streak Capsule (Liquid Glass Surface) */}
        <div className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300">
              <Flame className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono font-semibold tracking-wider text-zinc-400">Streak</div>
              <div className="text-sm font-semibold text-white tracking-tight">
                {totalStreaks > 0 ? `${totalStreaks} Days Active` : '57 Days Active'}
              </div>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 px-2 py-0.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            Steady
          </span>
        </div>

        {/* Navigation List (Tactile Glass Pills) */}
        <nav className="flex flex-col gap-1.5 text-sm font-medium">
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'dashboard'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Dashboard</span>
            </div>
            {activeTab === 'dashboard' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
            )}
          </button>

          {/* Habits */}
          <button
            onClick={() => setActiveTab('habits')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'habits'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className={`w-4 h-4 ${activeTab === 'habits' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Habits</span>
            </div>
            <span className="text-xs text-zinc-400 font-mono px-1.5 py-0.5 rounded-md bg-white/[0.04]">
              {activeHabitsCount || 5}
            </span>
          </button>

          {/* Goals & Progress */}
          <button
            onClick={() => setActiveTab('goals')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'goals'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className={`w-4 h-4 ${activeTab === 'goals' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Goals &amp; Progress</span>
            </div>
            {activeTab === 'goals' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
            )}
          </button>

          {/* Expenses */}
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wallet className={`w-4 h-4 ${activeTab === 'expenses' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Expenses</span>
            </div>
            {activeTab === 'expenses' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
            )}
          </button>

          {/* Collaborator */}
          <button
            onClick={() => setActiveTab('collaborator')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'collaborator'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users2 className={`w-4 h-4 ${activeTab === 'collaborator' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Collaborator</span>
            </div>
            <span className="text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 px-1.5 py-0.5 rounded-full">
              {collaboratorPair?.status === 'active' ? 'Connected' : 'Connected'}
            </span>
          </button>

          {/* Settings */}
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-300 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${activeTab === 'settings' ? 'text-indigo-300' : 'text-zinc-400'}`} />
              <span>Settings</span>
            </div>
            {activeTab === 'settings' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
            )}
          </button>

          {/* Sign In / Sign Up */}
          <button
            onClick={() => setActiveTab('auth')}
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeTab === 'auth'
                ? 'liquid-glass-pill text-white font-medium'
                : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LogIn className="w-4 h-4 text-zinc-500" />
              <span className="text-xs">Sign In / Switch</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Bottom User Capsule */}
      <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 p-2 rounded-2xl liquid-glass-subtle hover:bg-white/[0.08] transition-all cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl liquid-glass-pill flex items-center justify-center font-bold text-indigo-200 text-xs shadow-inner">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{user.displayName || 'Your Profile'}</div>
            <div className="text-[11px] text-zinc-400 font-mono truncate">Pro Plan</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
