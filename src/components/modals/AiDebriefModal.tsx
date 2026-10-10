import React from 'react';
import { X, Sparkles, Trophy, AlertTriangle, Lightbulb, TrendingUp, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WeeklyAiDebrief } from '../../types';

interface AiDebriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  debrief: WeeklyAiDebrief;
}

export const AiDebriefModal: React.FC<AiDebriefModalProps> = ({ isOpen, onClose, debrief }) => {
  const { formatCurrency, setActiveTab } = useApp();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-t-3xl sm:rounded-3xl liquid-glass border border-white/15 p-4 sm:p-7 shadow-2xl relative overflow-hidden max-h-[92vh] flex flex-col safe-area-pb"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background mesh */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10 relative z-10 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/25 to-violet-500/25 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <Sparkles className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-periwinkle font-semibold tracking-wider uppercase">
                  Weekly Bento AI Debrief
                </span>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {debrief.weekRange}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                Performance Diagnostics &amp; Synthesis
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Scrollable Body */}
        <div className="my-5 overflow-y-auto pr-1.5 space-y-5 relative z-10 custom-scrollbar">
          {/* Grade & Score Big Banner */}
          <div className="p-5 rounded-2xl liquid-glass-subtle border border-indigo-500/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-2xl font-black text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] font-mono border border-white/20">
                {debrief.grade}
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-300">
                  Calculated Flow Score:{' '}
                  <span className="text-white font-bold">{debrief.score}/100</span>
                </div>
                <h3 className="text-sm font-semibold text-white tracking-tight mt-0.5">
                  {debrief.headline}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="px-3 py-1.5 rounded-xl liquid-glass-pill text-xs font-mono text-emerald-300 border border-emerald-400/25 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Streak Protected</span>
              </span>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="p-4 rounded-2xl liquid-glass-subtle">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-periwinkle font-medium mb-1.5 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-300" />
              <span>AI Executive Synthesis</span>
            </h4>
            <p className="text-xs text-zinc-200 leading-relaxed font-normal">
              {debrief.summary}
            </p>
          </div>

          {/* Key Wins & Triumphs */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-2.5 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-300" />
              <span>Dominant Wins This Cycle</span>
            </h4>
            <div className="space-y-2">
              {debrief.wins.map((win, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl liquid-glass-subtle flex items-start gap-2.5 text-xs text-zinc-200 border border-white/5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{win}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Friction Points & Calibrations */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-medium mb-2.5 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Friction Points &amp; Calibrations</span>
            </h4>
            <div className="space-y-2">
              {debrief.frictionPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl liquid-glass-subtle flex items-start gap-2.5 text-xs text-zinc-300 border border-amber-500/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cross-Pillar AI Correlations */}
          <div>
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-indigo-300 font-medium mb-2.5 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-300" />
              <span>Cross-Pillar Synergy Findings</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {debrief.correlations.map((corr, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl liquid-glass-subtle border border-indigo-500/20 flex flex-col justify-between gap-2"
                >
                  <div className="text-xs font-semibold text-white tracking-tight">
                    {corr.insight}
                  </div>
                  <div className="text-[11px] text-zinc-300 leading-normal">
                    {corr.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Budget Forecast Snapshot */}
          <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Predictive Spend Runway
              </div>
              <div className="text-xs text-white font-medium mt-0.5">
                Projected month-end burn:{' '}
                <span className="font-mono font-bold text-periwinkle">
                  {formatCurrency(debrief.forecast.projectedEndSpend)}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Forecasted exhaustion date:{' '}
                <span className="text-zinc-200 font-semibold">{debrief.forecast.budgetBurnDate}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                setActiveTab('expenses');
              }}
              className="px-3.5 py-2 rounded-xl liquid-glass-pill hover:bg-white/10 text-xs text-indigo-200 hover:text-white flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>Examine Burn Rate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10 shrink-0">
          <span className="text-[11px] text-zinc-400 font-mono">
            Model calibrated with local encrypted telemetry
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition-all cursor-pointer"
          >
            Acknowledge &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
};
