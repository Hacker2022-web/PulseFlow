import React from 'react';
import { Swords, Plus, Trophy, Flame, ArrowRight, Users2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BentoCoopQuestsTile: React.FC = () => {
  const { coopQuests, contributeToQuest, collaboratorPair, setActiveTab } = useApp();

  const activeQuests = coopQuests.filter(q => q.status === 'active');
  const partnerName = collaboratorPair?.userBName || 'Partner';

  return (
    <section
      className="w-full rounded-3xl liquid-glass p-5 lg:p-6 relative overflow-hidden transition-all group"
      data-purpose="coop-quests-tile"
    >
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600/30 to-fuchsia-600/30 border border-violet-400/30 flex items-center justify-center text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.3)]">
            <Swords className="w-5 h-5 text-violet-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm tracking-tight">Shared Co-op Quests</h3>
              <span className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                with {partnerName}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Joint milestones and collaborative accountability targets
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('collaborator')}
          className="text-xs text-periwinkle hover:text-white transition-colors font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>Quest Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quests Grid */}
      {activeQuests.length === 0 ? (
        <div className="py-7 text-center liquid-glass-subtle rounded-2xl border border-white/5 mt-4 relative z-10">
          <Users2 className="w-8 h-8 text-violet-400/40 mx-auto mb-2" />
          <p className="text-xs text-zinc-300 font-medium">No active duo quests</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Team up on fitness distance, savings goals, or zero-sugar challenges.</p>
          <button
            onClick={() => setActiveTab('collaborator')}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold cursor-pointer"
          >
            <span>+ Create Duo Quest</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4 relative z-10">
          {activeQuests.slice(0, 3).map((quest) => {
          const totalCurrent = quest.currentValueUserA + quest.currentValueUserB;
          const percent = Math.min(100, Math.round((totalCurrent / quest.targetValue) * 100));
          const percentA = Math.min(100, Math.round((quest.currentValueUserA / quest.targetValue) * 100));
          const percentB = Math.min(100, Math.round((quest.currentValueUserB / quest.targetValue) * 100));

          const incrementAmount = quest.unit === 'days' ? 1 : quest.unit === 'km' ? 5 : 1000;

          return (
            <div
              key={quest.id}
              className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-white tracking-tight leading-snug">
                    {quest.title}
                  </h4>
                  <span className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full shrink-0">
                    {quest.rewardBadge}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                  {quest.description}
                </p>
              </div>

              {/* Progress Segmented Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-300 font-semibold">You: {quest.currentValueUserA} {quest.unit}</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-violet-300 font-semibold">{partnerName.split(' ')[0]}: {quest.currentValueUserB} {quest.unit}</span>
                  </div>
                  <span className="text-white font-bold">{percent}%</span>
                </div>

                {/* Dual Color Segmented Bar */}
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden flex p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(56,189,248,0.7)] transition-all duration-500"
                    style={{ width: `${percentA}%` }}
                    title={`You: ${quest.currentValueUserA} ${quest.unit}`}
                  />
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.7)] transition-all duration-500"
                    style={{ width: `${percentB}%` }}
                    title={`${partnerName}: ${quest.currentValueUserB} ${quest.unit}`}
                  />
                </div>
              </div>

              {/* Quick Action Contribute Button */}
              <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono text-zinc-400">
                  Target: {quest.targetValue} {quest.unit}
                </span>

                <button
                  onClick={() => contributeToQuest(quest.id, incrementAmount, 'A')}
                  className="px-2.5 py-1 rounded-xl liquid-glass-pill hover:bg-white/10 text-xs text-white font-medium flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                  title={`Log +${incrementAmount} ${quest.unit}`}
                >
                  <Plus className="w-3 h-3 text-cyan-300" />
                  <span>+{incrementAmount} {quest.unit}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </section>
  );
};
