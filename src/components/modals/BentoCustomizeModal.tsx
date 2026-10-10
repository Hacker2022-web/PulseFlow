import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
  Sparkles,
  TrendingUp,
  Zap,
  Users2,
  CheckCircle2,
  Calendar,
  Wallet,
  CreditCard,
  Heart,
  LayoutGrid,
  List
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BentoCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BentoCustomizeModal: React.FC<BentoCustomizeModalProps> = ({ isOpen, onClose }) => {
  const { bentoTiles, toggleBentoTile, reorderBentoTiles, resetBentoTiles } = useApp();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (!isOpen) return null;

  const sortedTiles = [...bentoTiles].sort((a, b) => a.order - b.order);
  const activeCount = sortedTiles.filter(t => t.enabled).length;

  const moveTile = (index: number, direction: 'up' | 'down') => {
    const newTiles = [...sortedTiles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTiles.length) return;

    const [moved] = newTiles.splice(index, 1);
    newTiles.splice(targetIndex, 0, moved);
    reorderBentoTiles(newTiles);
  };

  const getTileIcon = (id: string) => {
    switch (id) {
      case 'heroGreeting':    return Sparkles;
      case 'weeklyOverview':  return TrendingUp;
      case 'aiDebrief':       return Zap;
      case 'coopQuests':      return Users2;
      case 'habits':          return CheckCircle2;
      case 'tasks':           return Calendar;
      case 'expenses':        return Wallet;
      case 'subscriptions':   return CreditCard;
      case 'partnerBanner':   return Heart;
      default:                return SlidersHorizontal;
    }
  };

  const getTileShortLabel = (id: string, defaultLabel: string) => {
    switch (id) {
      case 'heroGreeting':    return 'Greeting & Pulse';
      case 'weeklyOverview':  return 'Weekly Overview';
      case 'aiDebrief':       return 'AI Debrief';
      case 'coopQuests':      return 'Co-op Quests';
      case 'habits':          return 'Daily Habits';
      case 'tasks':           return 'Priority Tasks';
      case 'expenses':        return 'Expense Tracker';
      case 'subscriptions':   return 'Subscription Vault';
      case 'partnerBanner':   return 'Partner Sync';
      default:                return defaultLabel;
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl sm:rounded-3xl liquid-glass border border-white/15 shadow-2xl relative overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow corner accents */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header - Compact & Informative */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-indigo-300 shrink-0">
              <SlidersHorizontal className="w-4 h-4 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">Customize Bento Grid</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-indigo-200">
                  {activeCount} of {sortedTiles.length} active
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 truncate">
                Reorder or toggle modules on your daily dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* View Switcher: Grid vs List */}
            <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-indigo-600/40 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Compact Grid (Zero Scrolling)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-md transition-all ${
                  viewMode === 'list'
                    ? 'bg-indigo-600/40 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
                title="Single Column List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer tap-target"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {viewMode === 'grid' ? (
          /* ================= ZERO-SCROLL 2-COLUMN GRID ================= */
          <div className="p-2 sm:p-3 relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
            {sortedTiles.map((tile, index) => {
              const Icon = getTileIcon(tile.id);
              const label = getTileShortLabel(tile.id, tile.label);

              return (
                <div
                  key={tile.id}
                  className={`p-2 rounded-xl transition-all border flex flex-col justify-between gap-1.5 ${
                    tile.enabled
                      ? 'liquid-glass-subtle border-indigo-400/20 hover:border-indigo-400/40'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  {/* Row 1: Module Icon, Label & Order Badge */}
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                          tile.enabled ? 'liquid-glass-pill text-indigo-300' : 'bg-white/5 text-zinc-500'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-semibold text-white tracking-tight truncate">
                        {label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-300/80 shrink-0">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Row 2: Reorder Arrows & Toggle Switch */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    {/* Up / Down Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveTile(index, 'up')}
                        disabled={index === 0}
                        className="w-5 h-5 rounded-md liquid-glass-subtle disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Move Up"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTile(index, 'down')}
                        disabled={index === sortedTiles.length - 1}
                        className="w-5 h-5 rounded-md liquid-glass-subtle disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
                        title="Move Down"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    {/* Smooth iOS Switch */}
                    <button
                      type="button"
                      onClick={() => toggleBentoTile(tile.id)}
                      className={`w-8 h-4.5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer tap-target active:scale-95 ${
                        tile.enabled
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 justify-end shadow-[0_0_6px_rgba(99,102,241,0.5)]'
                          : 'bg-white/10 justify-start'
                      }`}
                      title={tile.enabled ? 'Click to hide' : 'Click to show'}
                    >
                      <span className="w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= HIGH-DENSITY SINGLE-COLUMN LIST ================= */
          <div className="p-2 sm:p-3 overflow-y-auto space-y-1.5 relative z-10 custom-scrollbar flex-1 max-h-[55vh]">
            {sortedTiles.map((tile, index) => {
              const Icon = getTileIcon(tile.id);
              return (
                <div
                  key={tile.id}
                  className={`px-3 py-2 rounded-xl transition-all border flex items-center justify-between gap-2.5 ${
                    tile.enabled
                      ? 'liquid-glass-subtle border-white/10 hover:border-white/20'
                      : 'bg-white/[0.02] border-white/5 opacity-40'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        tile.enabled ? 'liquid-glass-pill text-indigo-300' : 'bg-white/5 text-zinc-500'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-zinc-400">
                        #{index + 1}
                      </span>
                      <h4
                        className={`text-xs font-semibold tracking-tight truncate ${
                          tile.enabled ? 'text-white' : 'text-zinc-400'
                        }`}
                      >
                        {tile.label}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => moveTile(index, 'up')}
                      disabled={index === 0}
                      className="w-6 h-6 rounded-lg liquid-glass-subtle disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer tap-target active:scale-95"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => moveTile(index, 'down')}
                      disabled={index === sortedTiles.length - 1}
                      className="w-6 h-6 rounded-lg liquid-glass-subtle disabled:opacity-20 disabled:cursor-not-allowed hover:bg-white/[0.08] flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer tap-target active:scale-95"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleBentoTile(tile.id)}
                      className={`ml-1 w-9 h-5 rounded-full transition-colors p-0.5 flex items-center cursor-pointer tap-target active:scale-95 ${
                        tile.enabled
                          ? 'bg-gradient-to-r from-indigo-500 to-violet-500 justify-end shadow-[0_0_8px_rgba(99,102,241,0.5)]'
                          : 'bg-white/10 justify-start'
                      }`}
                      title={tile.enabled ? 'Visible on dashboard' : 'Hidden'}
                    >
                      <span className="w-4 h-4 rounded-full bg-white shadow-md transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer - Pinned and Always Fully Visible */}
        <div className="flex items-center justify-between p-2.5 sm:p-3.5 border-t border-white/10 bg-[#070913]/95 backdrop-blur-md relative z-10 shrink-0">
          <button
            onClick={resetBentoTiles}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-[11px] sm:text-xs font-medium text-zinc-300 hover:text-white transition-all cursor-pointer tap-target active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition-all cursor-pointer tap-target active:scale-95 shadow-[0_4px_16px_rgba(99,102,241,0.4)]"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BentoCustomizeModal;
