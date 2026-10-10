import React, { useState } from 'react';
import { Sparkles, Trophy, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AiDebriefModal } from '../modals/AiDebriefModal';

export const BentoAiDebriefTile: React.FC = () => {
  const { getWeeklyAiDebrief } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debrief = getWeeklyAiDebrief();

  return (
    <>
      <section
        className="w-full rounded-3xl liquid-glass p-5 lg:p-6 relative overflow-hidden transition-all group"
        data-purpose="weekly-ai-debrief-tile"
      >
        {/* Subtle decorative aurora mesh */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/15 transition-all" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-violet-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-white text-sm tracking-tight">Weekly Bento AI Debrief</h3>
                <span className="text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  {debrief.weekRange}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{debrief.headline}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* Grade & Score Badge */}
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl liquid-glass-subtle border border-indigo-400/20">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-black text-white font-mono shadow-[0_0_8px_rgba(139,92,246,0.6)]">
                {debrief.grade}
              </span>
              <div className="text-right">
                <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">Flow Score</div>
                <div className="text-xs font-bold font-mono text-white">{debrief.score}/100</div>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 rounded-xl liquid-glass-pill hover:bg-white/10 text-xs text-indigo-200 hover:text-white flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>Full Debrief</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2-Column Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4 relative z-10">
          {/* Win Insight */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
              <Trophy className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                Major Win Highlight
              </div>
              <p className="text-xs text-zinc-200 mt-1 line-clamp-2 leading-relaxed">
                {debrief.wins[0]}
              </p>
            </div>
          </div>

          {/* Cross-Pillar Correlation Insight */}
          <div className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/5 flex items-start gap-3">
            <div className="w-7 h-7 rounded-xl bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center shrink-0 mt-0.5 text-indigo-300">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-300 font-semibold truncate">
                {debrief.correlations[0]?.insight || 'Synergy Discovery'}
              </div>
              <p className="text-xs text-zinc-200 mt-1 line-clamp-2 leading-relaxed">
                {debrief.correlations[0]?.impact}
              </p>
            </div>
          </div>
        </div>
      </section>

      <AiDebriefModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        debrief={debrief}
      />
    </>
  );
};
