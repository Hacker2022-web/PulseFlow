import React, { useState } from 'react';
import {
  Bell,
  Plus,
  Users2,
  Settings,
  CloudCheck,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationDropdown } from '../common/NotificationDropdown';

interface HeaderProps {
  onOpenQuickAdd: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenQuickAdd }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    collaboratorPair,
    syncStatus,
    triggerSyncNow,
    user
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':    return { title: 'Today Dashboard',     subtitle: 'Your daily focus, habits, and spending pace' };
      case 'habits':       return { title: 'Habit Tracker',       subtitle: 'Build sustainable routines and track consistency streaks' };
      case 'goals':        return { title: 'Goals & Progress',    subtitle: 'Milestones, daily must-dos, and long-term targets' };
      case 'expenses':     return { title: 'Expense Tracker',     subtitle: 'Personal spending, monthly budget pace & category analytics' };
      case 'collaborator': return { title: 'Collaborator Mode',   subtitle: 'Mutual accountability with your trusted partner' };
      case 'settings':     return { title: 'Settings & Cloud Sync', subtitle: 'Preferences, Firebase configuration, and data backup' };
      case 'auth':         return { title: 'Sign In',             subtitle: 'Sign in or create your PulseFlow account' };
      default:             return { title: 'PulseFlow',           subtitle: '' };
    }
  };

  const headerInfo = getTabTitle();

  return (
    <header
      className="sticky top-0 z-40 px-3.5 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between border-b border-white/10 safe-area-pt"
      style={{
        background: 'rgba(7, 9, 19, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* View Title */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight font-sans">
            {headerInfo.title}
          </h2>
          {/* Mobile sync icon */}
          <button
            onClick={triggerSyncNow}
            className="md:hidden p-1 text-indigo-300 hover:text-white"
            title="Sync Status"
          >
            {syncStatus === 'synced'  && <CloudCheck className="w-4 h-4 text-emerald-400" />}
            {syncStatus === 'syncing' && <RefreshCw  className="w-4 h-4 text-indigo-400 animate-spin" />}
            {syncStatus === 'offline' && <WifiOff   className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
        <p className="hidden sm:block text-xs text-zinc-400 font-medium mt-0.5">
          {headerInfo.subtitle}
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Collaborator Quick Status Pill */}
        {collaboratorPair?.status === 'active' ? (
          <button
            onClick={() => setActiveTab('collaborator')}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-glass-subtle text-xs hover:bg-white/[0.08] text-zinc-200 transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <img src={collaboratorPair.userBAvatar} alt={collaboratorPair.userBName} className="w-5 h-5 rounded-md object-cover" />
            <span className="font-semibold text-zinc-100">{collaboratorPair.userBName}</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('collaborator')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-subtle text-xs text-zinc-300 hover:text-white transition"
          >
            <Users2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Pair Partner</span>
          </button>
        )}

        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs sm:text-sm tracking-wide transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Quick Log</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-xl liquid-glass-subtle text-zinc-300 hover:text-white transition cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-300 shadow-[0_0_6px_rgba(165,180,252,0.9)]" />
            )}
          </button>
          <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Settings */}
        <button
          onClick={() => setActiveTab('settings')}
          className="p-2 rounded-xl liquid-glass-subtle text-zinc-300 hover:text-white transition cursor-pointer"
          title="App Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
