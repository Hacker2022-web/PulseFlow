import React, { useRef, useEffect } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    setActiveTab
  } = useApp();

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getIconForType = (type: AppNotification['type']) => {
    switch (type) {
      case 'partner_reaction':
        return <Flame className="w-4 h-4 text-amber-300" />;
      case 'partner_nudge':
        return <Sparkles className="w-4 h-4 text-indigo-300" />;
      case 'budget_alert_80':
      case 'budget_alert_100':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      case 'habit_reminder':
      case 'daily_goal_reminder':
      default:
        return <Clock className="w-4 h-4 text-periwinkle" />;
    }
  };

  const formatTimeAgo = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    if (isNaN(diffMs) || diffMs < 0) return 'Just now';
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl liquid-glass border border-white/15 shadow-2xl z-50 overflow-hidden animate-slide-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-300" />
          <h3 className="font-bold text-sm text-white tracking-tight">Notifications</h3>
          <span className="text-[11px] font-mono liquid-glass-pill text-periwinkle font-medium px-2 py-0.5 rounded-full border border-white/10">
            {notifications.length}
          </span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-zinc-400 text-xs">
            No notifications yet. You're all caught up!
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id);
                if (n.linkTab) {
                  setActiveTab(n.linkTab);
                  onClose();
                }
              }}
              className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-white/[0.04] ${
                !n.read ? 'bg-white/[0.03]' : ''
              }`}
            >
              <div className="p-2 rounded-xl liquid-glass-subtle shrink-0">
                {getIconForType(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <h4 className={`text-xs font-semibold truncate ${!n.read ? 'text-white' : 'text-zinc-300'}`}>
                    {n.title}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                    {formatTimeAgo(n.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                  {n.message}
                </p>
                {n.linkTab && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] text-periwinkle font-medium">
                    <span>View in {n.linkTab}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearNotification(n.id);
                }}
                className="text-zinc-500 hover:text-zinc-200 p-1 rounded-lg transition cursor-pointer"
                title="Dismiss"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
