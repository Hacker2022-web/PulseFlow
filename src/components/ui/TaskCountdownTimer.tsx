import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, Check, Flame } from 'lucide-react';
import { TaskPriority } from '../../types';
import { getTodayString } from '../../services/storage';

interface TaskCountdownTimerProps {
  deadline?: string;
  targetTime?: string;
  taskDate?: string;
  completed?: boolean;
  className?: string;
}

export const TaskCountdownTimer: React.FC<TaskCountdownTimerProps> = ({
  deadline,
  targetTime,
  taskDate,
  completed,
  className = ''
}) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    // If completed or no target time, skip interval
    if (completed || (!deadline && !targetTime)) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [completed, deadline, targetTime]);

  if (completed) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-300 bg-emerald-500/15 border border-emerald-400/25 px-2 py-0.5 rounded-full ${className}`}>
        <Check className="w-3 h-3 text-emerald-400 stroke-[2.5]" />
        <span>Completed</span>
      </span>
    );
  }

  // Parse target timestamp
  let targetMs: number | null = null;
  if (deadline) {
    if (deadline.includes('T')) {
      targetMs = new Date(deadline).getTime();
    } else {
      const datePart = taskDate || getTodayString();
      targetMs = new Date(`${datePart}T${deadline.slice(0, 5)}:00`).getTime();
    }
  } else if (targetTime) {
    const datePart = taskDate || getTodayString();
    targetMs = new Date(`${datePart}T${targetTime.slice(0, 5)}:00`).getTime();
  }

  if (!targetMs || isNaN(targetMs)) {
    return null;
  }

  const diff = targetMs - now;

  // Overdue state
  if (diff < 0) {
    const overdueSec = Math.floor(Math.abs(diff) / 1000);
    const hours = Math.floor(overdueSec / 3600);
    const mins = Math.floor((overdueSec % 3600) / 60);

    const overdueLabel = hours > 0
      ? `${hours}h ${mins}m`
      : `${Math.max(1, mins)}m`;

    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse ${className}`}
        title={`Task deadline was ${new Date(targetMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      >
        <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
        <span>Overdue by {overdueLabel}</span>
      </span>
    );
  }

  // Remaining countdown
  const remainingSec = Math.floor(diff / 1000);
  const days = Math.floor(remainingSec / 86400);
  const hours = Math.floor((remainingSec % 86400) / 3600);
  const mins = Math.floor((remainingSec % 3600) / 60);
  const secs = remainingSec % 60;

  // Less than 30 mins: urgent amber pulse
  if (remainingSec < 1800) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-300 bg-amber-500/20 border border-amber-400/35 px-2 py-0.5 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.3)] ${className}`}
        title={`Due in ${mins}m ${secs}s`}
      >
        <Clock className="w-3 h-3 text-amber-300 animate-spin-slow shrink-0" />
        <span>{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')} left</span>
      </span>
    );
  }

  // Less than 24 hours: active hours:mins:secs countdown
  if (days === 0) {
    return (
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium text-indigo-200 bg-indigo-500/15 border border-indigo-400/25 px-2 py-0.5 rounded-full ${className}`}
        title={`Due at ${new Date(targetMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
      >
        <Clock className="w-3 h-3 text-indigo-300 shrink-0" />
        <span>{hours.toString().padStart(2, '0')}:{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>
      </span>
    );
  }

  // Multi-day deadline
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono font-medium text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full ${className}`}
      title={`Due in ${days} days`}
    >
      <Clock className="w-3 h-3 text-zinc-400 shrink-0" />
      <span>{days}d {hours}h left</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority?: TaskPriority; className?: string }> = ({
  priority = 'medium',
  className = ''
}) => {
  switch (priority) {
    case 'urgent':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-[0_0_6px_rgba(244,63,94,0.3)] ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          Urgent
        </span>
      );
    case 'high':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/35 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          High
        </span>
      );
    case 'low':
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-medium uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-400/25 ${className}`}>
          Low
        </span>
      );
    case 'medium':
    default:
      return (
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-medium uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-400/25 ${className}`}>
          Medium
        </span>
      );
  }
};
