import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Users2,
  TrendingUp,
  Clock,
  Trash2,
  Sparkles,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Goal, GoalTargetType, TaskPriority } from '../../types';
import { getTodayString, getDateOffsetString } from '../../services/storage';
import { TaskCountdownTimer, PriorityBadge } from '../ui/TaskCountdownTimer';

export const GoalsView: React.FC = () => {
  const {
    goals,
    dailyGoals,
    addGoal,
    deleteGoal,
    logGoalProgress,
    toggleMilestone,
    addDailyGoal,
    toggleDailyGoal,
    deleteDailyGoal,
    toggleItemSharing
  } = useApp();

  const [activeTab, setActiveTab] = useState<'daily' | 'longterm'>('daily');
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [selectedGoalForLog, setSelectedGoalForLog] = useState<Goal | null>(null);
  const [logValue, setLogValue] = useState<string>('');
  const [logNote, setLogNote] = useState<string>('');

  // Daily Goal creation inputs
  const [dailyGoalTitle, setDailyGoalTitle] = useState('');
  const [dailyGoalShared, setDailyGoalShared] = useState(true);
  const [dailyGoalTime, setDailyGoalTime] = useState('19:00');
  const [dailyGoalPriority, setDailyGoalPriority] = useState<TaskPriority>('high');
  const [dailyGoalDeadline, setDailyGoalDeadline] = useState('');

  // Long-term goal creation form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState('Fitness');
  const [goalTargetType, setGoalTargetType] = useState<GoalTargetType>('numeric');
  const [goalTargetValue, setGoalTargetValue] = useState('100');
  const [goalUnit, setGoalUnit] = useState('km');
  const [goalDeadline, setGoalDeadline] = useState(getDateOffsetString(30));
  const [goalShared, setGoalShared] = useState(true);
  const [milestonesInput, setMilestonesInput] = useState('Baseline Checkpoint\nHalfway Target\nFinal Push');

  const handleCreateDailyGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyGoalTitle.trim()) return;
    const computedDeadline = dailyGoalDeadline || (dailyGoalTime ? `${getTodayString()}T${dailyGoalTime}` : undefined);
    addDailyGoal(
      dailyGoalTitle.trim(),
      dailyGoalShared,
      dailyGoalTime || undefined,
      dailyGoalPriority,
      computedDeadline
    );
    setDailyGoalTitle('');
    setDailyGoalDeadline('');
  };

  const handleCreateLongTermGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean)
      .map((mTitle, idx) => ({
        id: `m_${Date.now()}_${idx}`,
        title: mTitle,
        completed: false
      }));

    addGoal({
      userId: 'user_primary_001',
      title: goalTitle.trim(),
      category: goalCategory,
      targetType: goalTargetType,
      currentValue: 0,
      targetValue: parseFloat(goalTargetValue) || 100,
      unit: goalUnit || undefined,
      startDate: getTodayString(),
      deadline: goalDeadline,
      milestones,
      sharedWithPartner: goalShared,
      status: 'active'
    });

    setGoalTitle('');
    setIsAddGoalModalOpen(false);
  };

  const handleProgressLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoalForLog) return;
    const val = parseFloat(logValue);
    if (isNaN(val) || val <= 0) return;

    logGoalProgress(selectedGoalForLog.id, val, logNote.trim() || undefined);
    setSelectedGoalForLog(null);
    setLogValue('');
    setLogNote('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header and Filter Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
            Goals &amp; Progress
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-medium">
            Daily focus tasks, partner synchronization, and long-term milestone roadmaps.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex liquid-glass-subtle rounded-xl p-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'liquid-glass-pill text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Today's Must-Dos ({dailyGoals.length})
            </button>
            <button
              onClick={() => setActiveTab('longterm')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'longterm'
                  ? 'liquid-glass-pill text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Roadmaps ({goals.length})
            </button>
          </div>

          {activeTab === 'longterm' && (
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab 1: Today's Daily Goals */}
      {activeTab === 'daily' && (
        <div className="space-y-6">
          {/* Quick Add Form */}
          <div className="liquid-glass rounded-3xl p-5 sm:p-6">
            <h3 className="text-sm font-bold text-white mb-1 tracking-tight">Add Today's Must-Do Item</h3>
            <p className="text-xs text-zinc-400 mb-4 font-medium">
              Collaborator mode synchronizes progress with your accountability partner in real-time.
            </p>

            <form onSubmit={handleCreateDailyGoal} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <input
                  type="text"
                  required
                  value={dailyGoalTitle}
                  onChange={(e) => setDailyGoalTitle(e.target.value)}
                  placeholder="What is your non-negotiable target today?"
                  className="sm:col-span-8 liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-indigo-400/50"
                />

                <div className="sm:col-span-4 flex items-center justify-between sm:justify-end gap-3">
                  <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={dailyGoalShared}
                      onChange={(e) => setDailyGoalShared(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
                    />
                    <span>Share with Partner</span>
                  </label>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>

              {/* Priority & Deadline Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1 border-t border-white/5">
                {/* Priority Selector */}
                <div className="sm:col-span-7 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase">Priority:</span>
                  <div className="flex items-center gap-1.5 flex-1">
                    {(['urgent', 'high', 'medium', 'low'] as TaskPriority[]).map((p) => {
                      const isSelected = dailyGoalPriority === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setDailyGoalPriority(p)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-wider capitalize transition-all cursor-pointer ${
                            isSelected
                              ? p === 'urgent'
                                ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50'
                                : p === 'high'
                                ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                                : p === 'low'
                                ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                                : 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                              : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Time / Deadline */}
                <div className="sm:col-span-5 flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-400 uppercase flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-300" /> Deadline:
                  </span>
                  <input
                    type="time"
                    value={dailyGoalTime}
                    onChange={(e) => {
                      setDailyGoalTime(e.target.value);
                      if (e.target.value) {
                        setDailyGoalDeadline(`${getTodayString()}T${e.target.value}`);
                      }
                    }}
                    className="flex-1 liquid-glass-subtle rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-400/50 font-mono"
                    title="Target completion time"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Daily Goals List */}
          <div className="space-y-3">
            {dailyGoals.length === 0 ? (
              <div className="text-center py-12 liquid-glass rounded-3xl p-8 border border-white/10">
                <Target className="w-10 h-10 text-indigo-300 mx-auto mb-2 opacity-60" />
                <h4 className="text-sm font-bold text-white">No daily goals yet</h4>
                <p className="text-xs text-zinc-400 mt-1">Set priority tasks with live deadline countdown timers today.</p>
              </div>
            ) : (
              dailyGoals.map((dg) => (
                <div
                  key={dg.id}
                  className={`p-4 sm:p-5 rounded-2xl liquid-glass-subtle flex items-center justify-between gap-4 transition-all ${
                    dg.completed ? 'opacity-85' : 'hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => toggleDailyGoal(dg.id)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        dg.completed
                          ? 'liquid-btn-primary text-white'
                          : 'border border-white/25 hover:border-white/50 bg-white/[0.03]'
                      }`}
                    >
                      {dg.completed && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <PriorityBadge priority={dg.priority || 'medium'} />
                        <span
                          className={`text-sm font-semibold truncate ${
                            dg.completed ? 'text-zinc-400 line-through' : 'text-white'
                          }`}
                        >
                          {dg.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5 text-xs text-zinc-400 font-mono mt-1 flex-wrap">
                        <TaskCountdownTimer
                          deadline={dg.deadline}
                          targetTime={dg.targetTime}
                          taskDate={dg.date}
                          completed={dg.completed}
                        />

                        {dg.completedAt && (
                          <span className="text-emerald-300 font-medium">
                            Done at {new Date(dg.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleItemSharing('dailyGoal', dg.id)}
                      title={dg.sharedWithPartner ? 'Shared with partner' : 'Private'}
                      className={`px-2.5 py-1 rounded-xl text-xs font-mono font-medium flex items-center gap-1 transition cursor-pointer ${
                        dg.sharedWithPartner
                          ? 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-300'
                          : 'liquid-glass-subtle text-zinc-400'
                      }`}
                    >
                      <Users2 className="w-3 h-3" />
                      <span className="hidden sm:inline">{dg.sharedWithPartner ? 'Shared' : 'Private'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteDailyGoal(dg.id)}
                      className="p-1.5 rounded-xl liquid-glass-subtle hover:bg-rose-500/15 text-zinc-400 hover:text-rose-300 transition cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Long-Term Goal Roadmaps */}
      {activeTab === 'longterm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const percent = goal.targetType === 'percentage'
              ? Math.min(100, Math.round(goal.currentValue))
              : Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));

            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / 86400000
            );

            return (
              <div
                key={goal.id}
                className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full liquid-glass-pill text-periwinkle">
                      {goal.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => toggleItemSharing('goal', goal.id)}
                        title={goal.sharedWithPartner ? 'Partner can view progress' : 'Private'}
                        className={`p-1.5 rounded-xl text-xs transition cursor-pointer ${
                          goal.sharedWithPartner
                            ? 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-300'
                            : 'liquid-glass-subtle text-zinc-400'
                        }`}
                      >
                        <Users2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-rose-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-white mt-1 mb-2 tracking-tight">{goal.title}</h3>

                  {/* Progress Bar & Value Meter */}
                  <div className="p-3.5 rounded-2xl liquid-glass-subtle my-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-zinc-300 font-medium">Progress</span>
                      <span className="font-mono font-bold text-white">
                        {goal.currentValue} / {goal.targetValue} {goal.unit || ''} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden my-2 p-0.5">
                      <div
                        className="bg-gradient-to-r from-indigo-400 to-violet-400 h-full rounded-full shadow-[0_0_10px_rgba(129,140,248,0.7)] transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span>Deadline: {goal.deadline}</span>
                      <span className={daysLeft < 5 ? 'text-amber-300 font-semibold' : ''}>
                        {daysLeft > 0 ? `${daysLeft} days left` : 'Due today'}
                      </span>
                    </div>
                  </div>

                  {/* Milestones Checklist */}
                  {goal.milestones.length > 0 && (
                    <div className="space-y-1.5 my-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                        Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                      </div>
                      {goal.milestones.map((m) => (
                        <div
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`p-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all ${
                            m.completed
                              ? 'liquid-glass-subtle text-zinc-500 line-through'
                              : 'liquid-glass-subtle text-zinc-200 hover:bg-white/[0.08]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 ${
                              m.completed
                                ? 'liquid-btn-primary text-white'
                                : 'border border-white/25'
                            }`}
                          >
                            {m.completed && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                          </div>
                          <span className="truncate">{m.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Action Button: Log Value */}
                <div className="pt-3 border-t border-white/10 mt-3">
                  <button
                    onClick={() => setSelectedGoalForLog(goal)}
                    className="w-full py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-indigo-200 hover:text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Progress Entry</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log Progress Modal */}
      {selectedGoalForLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl border border-white/15">
            <h3 className="text-base font-bold text-white mb-1 tracking-tight">
              Log Progress: {selectedGoalForLog.title}
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-mono">
              Current: {selectedGoalForLog.currentValue} / {selectedGoalForLog.targetValue} {selectedGoalForLog.unit}
            </p>

            <form onSubmit={handleProgressLogSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Amount to add ({selectedGoalForLog.unit || 'units'})
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  autoFocus
                  value={logValue}
                  onChange={(e) => setLogValue(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Note (optional)</label>
                <input
                  type="text"
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="e.g. 5k morning run with partner"
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForLog(null)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Long-Term Goal Modal */}
      {isAddGoalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto border border-white/15">
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Create Long-Term Goal</h3>
            <p className="text-xs text-zinc-400 mb-4 font-medium">Set target metrics, milestones, and deadlines.</p>

            <form onSubmit={handleCreateLongTermGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Run 100km, Read 12 Books, Emergency Fund..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                  >
                    <option value="Fitness">Fitness</option>
                    <option value="Learning">Learning</option>
                    <option value="Career">Career</option>
                    <option value="Finance">Finance</option>
                    <option value="Lifestyle">Lifestyle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Type</label>
                  <select
                    value={goalTargetType}
                    onChange={(e) => setGoalTargetType(e.target.value as GoalTargetType)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                  >
                    <option value="numeric">Numeric Value</option>
                    <option value="percentage">Percentage (0-100%)</option>
                    <option value="checklist">Milestones Checklist</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Target Number</label>
                  <input
                    type="number"
                    value={goalTargetValue}
                    onChange={(e) => setGoalTargetValue(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Unit (km, books, ₹)</label>
                  <input
                    type="text"
                    value={goalUnit}
                    onChange={(e) => setGoalUnit(e.target.value)}
                    placeholder="km / hrs / ₹"
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={goalDeadline}
                  onChange={(e) => setGoalDeadline(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Milestones (one per line)
                </label>
                <textarea
                  rows={3}
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Share with Collaborator</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Visible on partner dashboard</div>
                </div>
                <input
                  type="checkbox"
                  checked={goalShared}
                  onChange={(e) => setGoalShared(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddGoalModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsView;
