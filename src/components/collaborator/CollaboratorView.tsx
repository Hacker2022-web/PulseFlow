import React, { useState, useEffect } from 'react';
import {
  Users2,
  Copy,
  Check,
  Share2,
  Flame,
  Send,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  Lock,
  UserPlus,
  RefreshCw,
  BellRing,
  HeartHandshake,
  Shield,
  Gift,
  Swords,
  Trophy,
  Plus,
  Award,
  X,
  Link2,
  Loader2,
  Radio,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CollaboratorView: React.FC = () => {
  const {
    user,
    habits,
    dailyGoals,
    collaboratorPair,
    partnerData,
    myInviteCode,
    regenerateInviteCode,
    sendManualNudge,
    sendReactionToPartner,
    togglePartnerDailyGoalSimulated,
    connectPartnerWithCode,
    disconnectPartner,
    toggleItemSharing,
    coopQuests,
    contributeToQuest,
    addCoopQuest,
    streakFreeze,
    activateStreakFreeze,
    giftFreezeToPartner
  } = useApp();

  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [partnerInviteInput, setPartnerInviteInput] = useState('');
  const [connectFeedback, setConnectFeedback] = useState<{ success: boolean; message: string } | null>(null);
  const [nudgeFeedback, setNudgeFeedback] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'partnerToday' | 'coopQuests' | 'mySharedItems' | 'settings'>('partnerToday');

  // Detect URL ?invite=PULSE-XXXXXX for frictionless 1-tap onboarding
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const inviteParam = params.get('invite');
      if (inviteParam) {
        const clean = inviteParam.trim().toUpperCase();
        setPartnerInviteInput(clean);
        setSelectedTab('settings');
      }
    } catch {
      // Ignore URL parsing errors if any
    }
  }, []);

  // New Quest Form State
  const [isCreateQuestModalOpen, setIsCreateQuestModalOpen] = useState(false);
  const [questTitle, setQuestTitle] = useState('');
  const [questDescription, setQuestDescription] = useState('');
  const [questCategory, setQuestCategory] = useState<'fitness' | 'wellness' | 'finance' | 'learning'>('fitness');
  const [questTarget, setQuestTarget] = useState('50');
  const [questUnit, setQuestUnit] = useState('km');
  const [questBadge, setQuestBadge] = useState('⚡ Century Striders');

  const partnerProfile = partnerData.partnerProfile;
  const partnerDisplayName = collaboratorPair?.userBName || partnerProfile?.displayName || 'Partner';
  const partnerFirstName = partnerDisplayName.split(' ')[0] || 'Partner';

  const currentInviteCode = collaboratorPair?.inviteCode || myInviteCode || 'PULSE-FLOW99';

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(currentInviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `${window.location.origin}${window.location.pathname}?invite=${currentInviteCode}`;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleRegenerateCode = () => {
    setIsRegenerating(true);
    regenerateInviteCode();
    setTimeout(() => setIsRegenerating(false), 500);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = partnerInviteInput.trim().toUpperCase();
    if (!clean || isConnecting) return;
    setIsConnecting(true);
    setConnectFeedback(null);
    try {
      const res = await connectPartnerWithCode(clean);
      setConnectFeedback(res);
      if (res.success) {
        setPartnerInviteInput('');
        setTimeout(() => setSelectedTab('partnerToday'), 1500);
      }
    } catch (err: any) {
      setConnectFeedback({ success: false, message: err?.message || 'Connection failed' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNudgeClick = (itemId: string, itemTitle: string) => {
    const result = sendManualNudge(itemId, itemTitle);
    setNudgeFeedback(result.message);
    setTimeout(() => setNudgeFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Top Banner */}
      {collaboratorPair && partnerProfile ? (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 liquid-glass shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={partnerProfile.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={partnerProfile.displayName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-400/40 shadow-xl"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#070913] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                    Collaborator Mode Active
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">1-to-1 Accountability</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight drop-shadow-sm">
                  Paired with <span className="text-periwinkle">{partnerDisplayName}</span>
                </h2>
                <p className="text-xs text-zinc-300 mt-1 font-medium">
                  Mutual visibility for daily goals and habit consistency. Expenses remain 100% private.
                </p>
              </div>
            </div>

            {/* Quick Partner Streaks & Stats */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl liquid-glass-subtle text-center min-w-[95px]">
                <div className="text-[10px] text-zinc-400 font-mono font-semibold uppercase">Partner Streak</div>
                <div className="text-lg font-bold font-mono text-amber-300 flex items-center justify-center gap-1 mt-0.5">
                  <Flame className="w-4 h-4 fill-amber-300" />
                  <span>{partnerProfile.streakDays || 0}d</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl liquid-glass-subtle text-center min-w-[95px]">
                <div className="text-[10px] text-zinc-400 font-mono font-semibold uppercase">Completion</div>
                <div className="text-lg font-bold font-mono text-periwinkle mt-0.5">
                  {partnerProfile.completionRate || 0}%
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 liquid-glass shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl liquid-glass-pill flex items-center justify-center text-indigo-300">
                <Users2 className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-400/30">
                    Pairing Ready
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Duo Accountability</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight drop-shadow-sm">
                  Connect Your Accountability Partner
                </h2>
                <p className="text-xs text-zinc-300 mt-1 font-medium">
                  Pair with a trusted friend to unlock shared streaks, partner nudges, and collaborative co-op quests.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedTab('settings')}
              className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition shadow-lg shrink-0 cursor-pointer"
            >
              Get Invite Code
            </button>
          </div>
        </div>
      )}

      {/* Streak Freeze & Rescue Shield Capsule Banner */}
      <div className="p-5 sm:p-6 rounded-3xl liquid-glass border border-cyan-500/25 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-indigo-500/30 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.35)] shrink-0">
            <Shield className="w-6 h-6 text-cyan-200" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-base font-bold text-white tracking-tight">Streak Freeze &amp; Rescue</h3>
              <span
                className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                  streakFreeze.isShieldActiveToday
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/30 shadow-[0_0_8px_rgba(52,211,153,0.3)]'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-400/30'
                }`}
              >
                {streakFreeze.isShieldActiveToday ? '🛡️ Shield Active (24h Protected)' : `${streakFreeze.availableFreezes} Freezes Available`}
              </span>
            </div>
            <p className="text-xs text-zinc-300 mt-1 font-medium">
              Protect your habits from broken streaks, or transfer a rescue shield to save {partnerFirstName}'s streak.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap relative z-10">
          <div className="px-3.5 py-2 rounded-2xl liquid-glass-subtle border border-white/10 text-right hidden sm:block">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">Gifted To {partnerFirstName}</span>
            <span className="text-xs font-bold font-mono text-pink-300">
              {streakFreeze.partnerGiftedCount} Shields Transferred
            </span>
          </div>

          {/* Activate My Freeze */}
          <button
            onClick={() => activateStreakFreeze()}
            disabled={streakFreeze.availableFreezes === 0 || streakFreeze.isShieldActiveToday}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
              streakFreeze.isShieldActiveToday
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 cursor-default'
                : streakFreeze.availableFreezes > 0
                ? 'liquid-btn-primary text-white shadow-lg'
                : 'bg-white/5 opacity-40 text-zinc-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{streakFreeze.isShieldActiveToday ? 'Shield Active Today' : 'Activate My Shield'}</span>
          </button>

          {/* Gift Freeze to Partner */}
          <button
            onClick={() => giftFreezeToPartner()}
            disabled={streakFreeze.availableFreezes === 0}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
              streakFreeze.availableFreezes > 0
                ? 'liquid-glass-subtle hover:bg-pink-500/20 text-pink-200 hover:text-white border border-pink-400/30 hover:shadow-[0_0_12px_rgba(236,72,153,0.3)]'
                : 'bg-white/5 opacity-40 text-zinc-500 cursor-not-allowed'
            }`}
            title={`Transfer 1 freeze shield to ${partnerFirstName}`}
          >
            <Gift className="w-4 h-4 text-pink-300" />
            <span>Gift Freeze to {partnerFirstName}</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation for Collaborator View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 liquid-glass-subtle rounded-xl p-1 text-xs font-semibold flex-wrap">
          <button
            onClick={() => setSelectedTab('partnerToday')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              selectedTab === 'partnerToday'
                ? 'liquid-glass-pill text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Partner's Today Screen
          </button>
          <button
            onClick={() => setSelectedTab('coopQuests')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
              selectedTab === 'coopQuests'
                ? 'liquid-glass-pill text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Swords className="w-3.5 h-3.5 text-violet-300" />
            <span>Shared Co-op Quests ({coopQuests.filter(q => q.status === 'active').length})</span>
          </button>
          <button
            onClick={() => setSelectedTab('mySharedItems')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              selectedTab === 'mySharedItems'
                ? 'liquid-glass-pill text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            What I Share With {partnerFirstName}
          </button>
          <button
            onClick={() => setSelectedTab('settings')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              selectedTab === 'settings'
                ? 'liquid-glass-pill text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Invite &amp; Pairing
          </button>
        </div>

        {/* Live Simulator Test Button */}
        <button
          onClick={() => togglePartnerDailyGoalSimulated('pdg_2')}
          title="Simulate partner checking off an item in real-time"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-[11px] font-medium text-indigo-200 hover:text-white transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-300" />
          <span>Simulate Partner Check-off</span>
        </button>
      </div>

      {/* Nudge Alert Feedback Toast */}
      {nudgeFeedback && (
        <div className="p-3.5 rounded-2xl liquid-glass border border-indigo-400/30 text-xs text-indigo-100 flex items-center justify-between animate-slide-up shadow-xl">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-indigo-300" />
            <span>{nudgeFeedback}</span>
          </div>
          <button onClick={() => setNudgeFeedback(null)} className="text-zinc-400 hover:text-white text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: Partner Today Screen */}
      {selectedTab === 'partnerToday' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Partner's Daily Goals with Status and Nudge Buttons */}
          <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
                    <span>{partnerProfile?.displayName || 'Partner'}'s Daily Goals</span>
                    <span className="text-[11px] font-mono liquid-glass-subtle text-periwinkle px-2 py-0.5 rounded-full border border-white/10">
                      {partnerData.dailyGoals.filter(g => g.completed).length}/{partnerData.dailyGoals.length} Done
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                    Live status. Send a nudge if pending or cheer when finished!
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {partnerData.dailyGoals.length === 0 ? (
                  <div className="py-8 text-center liquid-glass-subtle rounded-2xl border border-white/5 p-5">
                    <CheckCircle2 className="w-8 h-8 text-indigo-400/60 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-zinc-200">
                      {partnerFirstName} has not added any shared tasks for today
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      When {partnerFirstName} adds tasks and marks them as shared, they will appear here live with instant check-off sync.
                    </p>
                  </div>
                ) : (
                  partnerData.dailyGoals.map((dg) => (
                  <div
                    key={dg.id}
                    className={`p-3.5 rounded-2xl liquid-glass-subtle transition-all ${
                      dg.completed ? 'opacity-85' : 'hover:bg-white/[0.06]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                          dg.completed ? 'liquid-btn-primary text-white' : 'border border-white/25 bg-white/[0.03]'
                        }`}>
                          {dg.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-xs sm:text-sm font-semibold truncate ${
                            dg.completed ? 'text-zinc-400 line-through' : 'text-white'
                          }`}>
                            {dg.title}
                          </h4>
                          <div className="flex items-center gap-2.5 text-[11px] font-mono text-zinc-400 mt-1">
                            {dg.targetTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-indigo-300" /> Target: {dg.targetTime}
                              </span>
                            )}
                            {dg.completed ? (
                              <span className="text-emerald-300 font-semibold">Completed today</span>
                            ) : (
                              <span className="text-amber-300 font-medium">Pending</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action: Cheer or Nudge */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {dg.completed ? (
                          <div className="flex items-center gap-1">
                            {['🔥', '🎉', '👏'].map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => sendReactionToPartner(dg.id, 'dailyGoal', emoji)}
                                title={`Send ${emoji} Cheer`}
                                className="w-8 h-8 rounded-xl liquid-glass-subtle hover:bg-white/[0.1] text-sm flex items-center justify-center transition active:scale-125 cursor-pointer"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => handleNudgeClick(dg.id, dg.title)}
                            disabled={dg.nudgedToday}
                            className={`px-3 py-1.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition cursor-pointer ${
                              dg.nudgedToday
                                ? 'liquid-glass-subtle text-zinc-500 cursor-not-allowed'
                                : 'liquid-btn-primary text-white shadow-sm active:scale-95'
                            }`}
                          >
                            <Send className="w-3 h-3" />
                            <span>{dg.nudgedToday ? 'Nudged' : 'Nudge'}</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Display Cheer Reactions received */}
                    {dg.reactions && dg.reactions.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400">Cheers:</span>
                        <div className="flex items-center gap-1.5">
                          {dg.reactions.map((rx) => (
                            <span
                              key={rx.id}
                              className="text-xs liquid-glass-pill px-2 py-0.5 rounded-full text-zinc-200"
                            >
                              {rx.emoji} {rx.senderName.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            </div>
          </div>

          {/* Partner's Shared Habits */}
          <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {partnerProfile?.displayName || 'Partner'}'s Shared Habits
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-medium">
                    Consistency streaks and daily check-in status.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {partnerData.habits.length === 0 ? (
                  <div className="py-8 text-center liquid-glass-subtle rounded-2xl border border-white/5 p-5">
                    <Sparkles className="w-8 h-8 text-indigo-400/60 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-zinc-200">
                      {partnerFirstName} has not shared habits yet
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      Habits shared by {partnerFirstName} for mutual accountability will sync here in real time.
                    </p>
                  </div>
                ) : (
                  partnerData.habits.map((h) => (
                  <div
                    key={h.id}
                    className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: h.color }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate">{h.name}</h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mt-0.5 truncate">
                          {h.reminderTime && <span>Reminder: {h.reminderTime}</span>}
                          <span>•</span>
                          <span className={h.completedToday ? 'text-emerald-300 font-semibold' : 'text-zinc-400'}>
                            {h.completedToday ? 'Checked in today' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full liquid-glass-subtle text-amber-300 font-mono font-bold text-xs border border-white/10">
                        <Flame className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{h.currentStreak}d</span>
                      </div>

                      {h.completedToday && (
                        <button
                          onClick={() => sendReactionToPartner(h.id, 'habit', '🎉')}
                          title="Send Cheer"
                          className="w-8 h-8 rounded-xl liquid-glass-subtle hover:bg-white/[0.1] text-sm flex items-center justify-center transition active:scale-125 cursor-pointer"
                        >
                          🎉
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            </div>

            {/* Nudge rules summary note */}
            <div className="mt-6 p-4 rounded-2xl liquid-glass-subtle text-xs text-zinc-300 space-y-1 font-medium">
              <div className="font-semibold text-white flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-300" />
                Nudge Policy &amp; Rate Limits
              </div>
              <p className="text-[11px] text-zinc-400">• Maximum 1 manual nudge per goal per day to preserve focus.</p>
              <p className="text-[11px] text-zinc-400">• Automatically respects partner quiet hours ({user.quietHoursStart} – {user.quietHoursEnd}).</p>
              <p className="text-[11px] text-zinc-400">• Syncs seamlessly via Web Push notifications.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: Shared Co-op Quests */}
      {selectedTab === 'coopQuests' && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-5 sm:p-6 rounded-3xl liquid-glass border border-violet-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Swords className="w-5 h-5 text-violet-300" />
                <span>Active Duo Co-op Quests</span>
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Multi-week quests where your and {partnerFirstName}'s contributions pool toward shared victory badges.
              </p>
            </div>

            <button
              onClick={() => setIsCreateQuestModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition cursor-pointer shadow-lg self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Co-op Quest</span>
            </button>
          </div>

          {/* Quests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coopQuests.length === 0 ? (
              <div className="col-span-full py-12 text-center liquid-glass rounded-3xl border border-white/5">
                <Swords className="w-10 h-10 text-violet-400/40 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-white">No active Co-op Quests</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Create a shared quest to pool distance, savings targets, or streak sprints together!
                </p>
                <button
                  onClick={() => setIsCreateQuestModalOpen(true)}
                  className="mt-4 px-4 py-2 rounded-xl liquid-btn-primary text-white text-xs font-semibold cursor-pointer"
                >
                  + Create First Quest
                </button>
              </div>
            ) : (
              coopQuests.map((quest) => {
                const totalVal = quest.currentValueUserA + quest.currentValueUserB;
                const percent = Math.min(100, Math.round((totalVal / quest.targetValue) * 100));
                const percentA = Math.min(100, Math.round((quest.currentValueUserA / quest.targetValue) * 100));
                const percentB = Math.min(100, Math.round((quest.currentValueUserB / quest.targetValue) * 100));
                const isDone = quest.status === 'completed' || totalVal >= quest.targetValue;
                const increment = quest.unit === 'days' ? 1 : quest.unit === 'km' ? 5 : 1000;

                return (
                  <div
                    key={quest.id}
                    className={`p-5 sm:p-6 rounded-3xl transition-all border flex flex-col justify-between ${
                      isDone
                        ? 'liquid-glass border-amber-400/30 bg-amber-500/[0.03]'
                        : 'liquid-glass border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-periwinkle px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-400/20 capitalize">
                          {quest.category}
                        </span>
                        <span className="text-xs font-mono font-bold text-white bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full">
                          {quest.rewardBadge}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white tracking-tight mt-3">
                        {quest.title}
                      </h4>
                      <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                        {quest.description}
                      </p>

                      {/* Progress Bar & Breakdown */}
                      <div className="mt-5 p-3.5 rounded-2xl liquid-glass-subtle border border-white/5">
                        <div className="flex items-center justify-between text-xs font-mono mb-2">
                          <span className="text-zinc-300">Progress</span>
                          <span className="text-white font-bold">{percent}%</span>
                        </div>

                        {/* Dual segmented progress bar */}
                        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden flex p-0.5">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-l-full shadow-[0_0_8px_rgba(56,189,248,0.7)] transition-all duration-500"
                            style={{ width: `${percentA}%` }}
                            title={`You: ${quest.currentValueUserA} ${quest.unit}`}
                          />
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.7)] transition-all duration-500"
                            style={{ width: `${percentB}%` }}
                            title={`${partnerFirstName}: ${quest.currentValueUserB} ${quest.unit}`}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono mt-2.5">
                          <span className="text-cyan-300 font-medium">You: {quest.currentValueUserA} {quest.unit}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-violet-300 font-medium">{partnerFirstName}: {quest.currentValueUserB} {quest.unit}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-zinc-400">Target: {quest.targetValue} {quest.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions: Log your contribution + Simulate partner */}
                    <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                      {isDone ? (
                        <div className="w-full text-center py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5">
                          <Trophy className="w-4 h-4 text-amber-300" />
                          <span>Quest Completed! Badge Unlocked</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => contributeToQuest(quest.id, increment, 'A')}
                            className="flex-1 py-2 px-3 rounded-xl liquid-glass-pill hover:bg-white/10 text-xs font-semibold text-white flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-cyan-300" />
                            <span>Log +{increment} {quest.unit}</span>
                          </button>

                          <button
                            onClick={() => contributeToQuest(quest.id, increment, 'B')}
                            title="Simulate partner progress"
                            className="py-2 px-3 rounded-xl liquid-glass-subtle hover:bg-white/5 text-[11px] font-medium text-zinc-400 hover:text-violet-200 transition cursor-pointer"
                          >
                            {partnerFirstName} +{increment}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Create Quest Modal */}
          {isCreateQuestModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in">
              <div
                className="w-full max-w-lg rounded-3xl liquid-glass border border-white/15 p-6 shadow-2xl relative overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl liquid-glass-pill flex items-center justify-center text-violet-300">
                      <Swords className="w-4 h-4 text-violet-300" />
                    </div>
                    <h3 className="text-base font-bold text-white tracking-tight">Initiate Co-op Quest</h3>
                  </div>
                  <button
                    onClick={() => setIsCreateQuestModalOpen(false)}
                    className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-zinc-400 hover:text-white transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const targetNum = parseFloat(questTarget);
                    if (!questTitle.trim() || isNaN(targetNum) || targetNum <= 0) return;

                    addCoopQuest({
                      title: questTitle.trim(),
                      description: questDescription.trim() || `Collaborative accountability quest with ${partnerFirstName}.`,
                      category: questCategory,
                      targetValue: targetNum,
                      currentValueUserA: 0,
                      currentValueUserB: 0,
                      unit: questUnit.trim() || 'days',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                      rewardBadge: questBadge.trim() || '🌟 Duo Champions'
                    });

                    setQuestTitle('');
                    setQuestDescription('');
                    setIsCreateQuestModalOpen(false);
                  }}
                  className="space-y-4 my-5"
                >
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Quest Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 30-Day Morning Cold Shower, 150km Cycling Quest"
                      value={questTitle}
                      onChange={(e) => setQuestTitle(e.target.value)}
                      className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What is the shared rule or goal?"
                      value={questDescription}
                      onChange={(e) => setQuestDescription(e.target.value)}
                      className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Category
                      </label>
                      <select
                        value={questCategory}
                        onChange={(e) => setQuestCategory(e.target.value as any)}
                        className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white bg-obsidian focus:outline-none focus:border-white/30 capitalize"
                      >
                        <option value="fitness">Fitness</option>
                        <option value="wellness">Wellness</option>
                        <option value="finance">Finance</option>
                        <option value="learning">Learning</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Reward Badge
                      </label>
                      <input
                        type="text"
                        value={questBadge}
                        onChange={(e) => setQuestBadge(e.target.value)}
                        placeholder="e.g. 🏆 Century Striders"
                        className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Target Value
                      </label>
                      <input
                        type="number"
                        required
                        value={questTarget}
                        onChange={(e) => setQuestTarget(e.target.value)}
                        className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Unit
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="days, km, ₹, books"
                        value={questUnit}
                        onChange={(e) => setQuestUnit(e.target.value)}
                        className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setIsCreateQuestModalOpen(false)}
                      className="px-4 py-2 rounded-xl liquid-glass-subtle text-xs text-zinc-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl liquid-btn-primary text-xs font-semibold text-white"
                    >
                      Start Joint Quest
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: What I Share with Partner */}
      {selectedTab === 'mySharedItems' && (
        <div className="liquid-glass rounded-3xl p-6 sm:p-8">
          <div className="max-w-2xl mb-6 pb-4 border-b border-white/10">
            <h3 className="text-lg font-bold text-white tracking-tight">Granular Sharing Controls</h3>
            <p className="text-xs text-zinc-400 mt-1 font-medium">
              Choose exactly which habits and daily goals {partnerFirstName} can see. Expenses and private notes are NEVER shared.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Habits sharing */}
            <div className="p-5 rounded-2xl liquid-glass-subtle">
              <h4 className="text-sm font-bold text-white mb-3 tracking-tight">
                Habits Shared ({habits.filter(h => h.sharedWithPartner).length}/{habits.length})
              </h4>
              <div className="space-y-2.5">
                {habits.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-3">No habits created yet.</p>
                ) : (
                  habits.map((h) => (
                    <div key={h.id} className="flex items-center justify-between p-3 rounded-xl liquid-glass-subtle text-xs">
                      <span className="font-medium text-zinc-200 truncate">{h.name}</span>
                      <button
                        onClick={() => toggleItemSharing('habit', h.id)}
                        className={`px-3 py-1 rounded-xl font-mono text-[11px] transition cursor-pointer ${
                          h.sharedWithPartner
                            ? 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-300'
                            : 'liquid-glass-subtle text-zinc-400'
                        }`}
                      >
                        {h.sharedWithPartner ? 'Shared' : 'Private'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Daily Goals sharing */}
            <div className="p-5 rounded-2xl liquid-glass-subtle">
              <h4 className="text-sm font-bold text-white mb-3 tracking-tight">
                Today's Goals Shared ({dailyGoals.filter(dg => dg.sharedWithPartner).length}/{dailyGoals.length})
              </h4>
              <div className="space-y-2.5">
                {dailyGoals.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-3">No priority tasks added yet.</p>
                ) : (
                  dailyGoals.map((dg) => (
                    <div key={dg.id} className="flex items-center justify-between p-3 rounded-xl liquid-glass-subtle text-xs">
                      <span className="font-medium text-zinc-200 truncate">{dg.title}</span>
                      <button
                        onClick={() => toggleItemSharing('dailyGoal', dg.id)}
                        className={`px-3 py-1 rounded-xl font-mono text-[11px] transition cursor-pointer ${
                          dg.sharedWithPartner
                            ? 'bg-emerald-500/15 border border-emerald-400/25 text-emerald-300'
                            : 'liquid-glass-subtle text-zinc-400'
                        }`}
                      >
                        {dg.sharedWithPartner ? 'Shared' : 'Private'}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Invite & Pairing Management */}
      {selectedTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Shareable Invite Card */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl liquid-glass-pill text-indigo-300 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Your Unique Invite Code</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4 font-medium">
                Every user receives a dedicated code. Send it or share your direct link with your friend to pair accounts seamlessly.
              </p>

              {/* Status Indicator */}
              {collaboratorPair ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-300 text-[11px] font-mono mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Duo Room Active: {currentInviteCode}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-[11px] font-mono mb-4">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>Cloud Discovery Ready • Real-Time Pairing</span>
                </div>
              )}

              {/* Code Box */}
              <div className="p-4 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="font-mono text-2xl font-black text-white tracking-widest drop-shadow-sm select-all">
                    {currentInviteCode}
                  </div>
                  {!collaboratorPair && (
                    <button
                      onClick={handleRegenerateCode}
                      disabled={isRegenerating}
                      title="Generate fresh unique code"
                      className="p-1.5 rounded-lg liquid-glass-subtle text-zinc-400 hover:text-white transition cursor-pointer hover:bg-white/10"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin text-indigo-400' : ''}`} />
                    </button>
                  )}
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                  Unique Code
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyInvite}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer shadow-lg"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={handleCopyInviteLink}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/10 text-white font-medium text-xs tracking-wide border border-white/10 transition cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Link2 className="w-3.5 h-3.5 text-indigo-300" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Direct Link'}</span>
                </button>
              </div>
            </div>

            {/* Architecture Info Banner */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-1.5 text-[11px] text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scalable Duo Channels</span>
              </div>
              <p className="leading-relaxed">
                Each code maps to an isolated cloud channel. As multiple friends join, each duo operates in its own real-time room without conflicts.
              </p>
            </div>
          </div>

          {/* Join / Connect Form */}
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div>
              <div className="w-12 h-12 rounded-2xl liquid-glass-pill text-violet-300 flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Connect with Partner</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-6 font-medium">
                Enter your friend's invite code to pair your accounts immediately.
              </p>

              <form onSubmit={handleConnect} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Partner's Invite Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. PULSE-8X9J2K"
                      value={partnerInviteInput}
                      onChange={(e) => setPartnerInviteInput(e.target.value.toUpperCase())}
                      className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-sm text-white uppercase tracking-wider font-mono focus:outline-none focus:border-white/30 border border-white/10 placeholder-zinc-500"
                    />
                    {partnerInviteInput && (
                      <button
                        type="button"
                        onClick={() => setPartnerInviteInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {connectFeedback && (
                  <div className={`p-3 rounded-xl border text-xs font-medium flex items-center gap-2 ${
                    connectFeedback.success
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/25'
                      : 'bg-rose-500/15 text-rose-300 border-rose-400/25'
                  }`}>
                    {connectFeedback.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    )}
                    <span>{connectFeedback.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isConnecting || !partnerInviteInput.trim()}
                  className="w-full py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isConnecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Pairing via Cloud Discovery...</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Connect Partner</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {collaboratorPair ? (
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Currently paired with {partnerDisplayName}</span>
                <button
                  onClick={disconnectPartner}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer hover:underline"
                >
                  Disconnect Duo
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-zinc-500">
                Personal expenses and private habits remain 100% confidential.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorView;
