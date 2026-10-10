import React from 'react';
import { CreditCard, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BentoSubscriptionsTile: React.FC = () => {
  const { subscriptions, totalMonthlySubscriptionCost, formatCurrency, setActiveTab } = useApp();

  const activeSubs = subscriptions.filter(s => s.active);

  // Calculate days until renewal
  const getDaysUntilRenewal = (renewalDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(renewalDateStr);
    renewal.setHours(0, 0, 0, 0);
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const sortedUpcoming = [...activeSubs].sort((a, b) => {
    return getDaysUntilRenewal(a.renewalDate) - getDaysUntilRenewal(b.renewalDate);
  });

  return (
    <section
      className="w-full rounded-3xl liquid-glass p-5 lg:p-6 relative overflow-hidden transition-all group"
      data-purpose="subscriptions-vault-tile"
    >
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <CreditCard className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white text-sm tracking-tight">Subscription Vault</h3>
              <span className="text-[10px] font-mono text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                {activeSubs.length} active services
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">
              Automated renewal watch and recurring burn management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Total Recurring</div>
            <div className="text-xs font-bold font-mono text-white">
              {formatCurrency(totalMonthlySubscriptionCost)}/mo
            </div>
          </div>

          <button
            onClick={() => setActiveTab('expenses')}
            className="text-xs text-periwinkle hover:text-white transition-colors font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Vault</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      {sortedUpcoming.length === 0 ? (
        <div className="py-7 text-center liquid-glass-subtle rounded-2xl border border-white/5 mt-4 relative z-10">
          <CreditCard className="w-8 h-8 text-blue-400/40 mx-auto mb-2" />
          <p className="text-xs text-zinc-300 font-medium">No recurring subscriptions tracked yet</p>
          <p className="text-[11px] text-zinc-400 mt-0.5">Track streaming, gym passes, and cloud services in one place.</p>
          <button
            onClick={() => setActiveTab('expenses')}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold cursor-pointer"
          >
            <span>+ Add Subscription</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 relative z-10">
          {sortedUpcoming.slice(0, 5).map((sub) => {
            const daysLeft = getDaysUntilRenewal(sub.renewalDate);
            const isUrgent = daysLeft >= 0 && daysLeft <= 3;

            return (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl liquid-glass-subtle border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-xl liquid-glass-pill flex items-center justify-center text-xs font-bold font-mono text-indigo-300">
                      {sub.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isUrgent
                          ? 'text-amber-300 bg-amber-500/15 border border-amber-400/25 shadow-[0_0_6px_rgba(251,191,36,0.3)]'
                          : 'text-zinc-300 bg-white/5 border border-white/10'
                      }`}
                    >
                      {daysLeft < 0 ? 'Renewed' : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-white tracking-tight mt-2.5 truncate">
                    {sub.name}
                  </h4>
                  <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                    {sub.category}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-semibold">
                    {formatCurrency(sub.cost)}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
