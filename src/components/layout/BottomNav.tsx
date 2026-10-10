import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Target,
  Wallet,
  Users2
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, collaboratorPair } = useApp();

  const tabs: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard',    label: 'Today',   icon: LayoutDashboard },
    { id: 'habits',       label: 'Habits',  icon: CheckCircle2 },
    { id: 'goals',        label: 'Goals',   icon: Target },
    { id: 'expenses',     label: 'Money',   icon: Wallet },
    { id: 'collaborator', label: 'Partner', icon: Users2 },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb select-none"
      style={{
        background: 'rgba(7, 9, 19, 0.94)',
        backdropFilter: 'blur(28px)',
        WebkitBackdropFilter: 'blur(28px)',
        borderTop: '1px solid rgba(129, 140, 248, 0.16)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1.5 rounded-2xl transition-all relative tap-target active:scale-95 ${
              isActive
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]' : ''}`}>
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-300 drop-shadow-[0_0_8px_rgba(165,180,252,0.8)]' : 'text-zinc-400'}`} />
                {tab.id === 'collaborator' && collaboratorPair?.status === 'active' && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#070913] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                )}
              </div>
            </div>
            <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-indigo-200 font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-0.5 w-6 h-0.5 bg-gradient-to-r from-indigo-300 to-violet-400 rounded-full shadow-[0_0_8px_rgba(165,180,252,0.9)]" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
