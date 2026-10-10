import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Calendar,
  AlertCircle,
  Trash2,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubscriptionItem, ExpenseCategory } from '../../types';
import { getTodayString, getDateOffsetString } from '../../services/storage';

export const SubscriptionVaultSection: React.FC = () => {
  const {
    subscriptions,
    addSubscription,
    deleteSubscription,
    toggleSubscriptionActive,
    totalMonthlySubscriptionCost,
    formatCurrency,
    getMonthlyBudgetTotal
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCategory, setSubCategory] = useState<ExpenseCategory>('Entertainment');
  const [subCost, setSubCost] = useState('');
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [subRenewal, setSubRenewal] = useState(getDateOffsetString(14));
  const [subAutoRenew, setSubAutoRenew] = useState(true);

  const categories = [
    'Entertainment',
    'Health & Fitness',
    'Education & Learning',
    'Housing & Utilities',
    'Food & Dining',
    'Shopping & Groceries',
    'Transportation',
    'Others'
  ];

  const totalBudget = getMonthlyBudgetTotal() || 2600;
  const recurringRatio = totalBudget > 0 ? Math.round((totalMonthlySubscriptionCost / totalBudget) * 100) : 0;

  const getDaysUntilRenewal = (renewalDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const renewal = new Date(renewalDateStr);
    renewal.setHours(0, 0, 0, 0);
    const diffTime = renewal.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    const costNum = parseFloat(subCost);
    if (!subName.trim() || isNaN(costNum) || costNum <= 0) return;

    addSubscription({
      name: subName.trim(),
      category: subCategory,
      cost: costNum,
      billingCycle: subCycle,
      renewalDate: subRenewal,
      active: true,
      autoRenew: subAutoRenew
    });

    setSubName('');
    setSubCost('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Vault Summary Glass Card */}
      <div className="p-5 sm:p-6 rounded-3xl liquid-glass border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <CreditCard className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-white tracking-tight">Subscription Vault</h3>
              <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/15 border border-cyan-400/25 px-2.5 py-0.5 rounded-full">
                {subscriptions.filter(s => s.active).length} Active Services
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-medium">
              Monitor recurring charges, auto-renewal expirations, and subscription drag
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap relative z-10">
          <div className="px-4 py-2.5 rounded-2xl liquid-glass-subtle border border-white/10 text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
              Monthly Recurring
            </span>
            <span className="text-base font-bold font-mono text-white">
              {formatCurrency(totalMonthlySubscriptionCost)}
              <span className="text-xs font-normal text-zinc-400"> ({recurringRatio}% of budget)</span>
            </span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl liquid-btn-primary text-white text-xs font-semibold tracking-wide transition cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subscriptions.map((sub) => {
          const daysLeft = getDaysUntilRenewal(sub.renewalDate);
          const isUrgent = daysLeft >= 0 && daysLeft <= 3;
          const isOverdue = daysLeft < 0;

          return (
            <div
              key={sub.id}
              className={`p-4 sm:p-5 rounded-3xl transition-all border flex flex-col justify-between ${
                sub.active
                  ? 'liquid-glass border-white/10 hover:border-white/20'
                  : 'bg-white/[0.02] border-white/5 opacity-60'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-2xl liquid-glass-pill flex items-center justify-center text-sm font-bold font-mono text-indigo-300">
                      {sub.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
                        {sub.name}
                      </h4>
                      <span className="text-[11px] text-zinc-400 block mt-0.5">
                        {sub.category}
                      </span>
                    </div>
                  </div>

                  {/* Days left pill */}
                  <span
                    className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-medium ${
                      isUrgent
                        ? 'text-amber-300 bg-amber-500/15 border border-amber-400/25 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                        : isOverdue
                        ? 'text-zinc-400 bg-white/5 border border-white/10'
                        : 'text-indigo-200 bg-indigo-500/15 border border-indigo-400/20'
                    }`}
                  >
                    {isOverdue ? 'Renewed' : daysLeft === 0 ? 'Renews Today' : `in ${daysLeft} days`}
                  </span>
                </div>

                {/* Renewal & Cost Info */}
                <div className="mt-4 p-3 rounded-2xl liquid-glass-subtle border border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Renewal Date:</span>
                    <span className="font-mono text-zinc-200 font-medium">
                      {new Date(sub.renewalDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Billing Cycle:</span>
                    <span className="font-mono text-zinc-200 capitalize">
                      {sub.billingCycle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Auto-Renew:</span>
                    <span className={sub.autoRenew ? 'text-emerald-300' : 'text-zinc-400'}>
                      {sub.autoRenew ? 'Enabled' : 'Manual Review'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer: Cost + Toggle + Delete */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs text-zinc-400 font-mono">Charge:</span>
                  <div className="text-sm font-bold font-mono text-white">
                    {formatCurrency(sub.cost)}
                    <span className="text-xs font-normal text-zinc-400">
                      /{sub.billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSubscriptionActive(sub.id)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer ${
                      sub.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : 'bg-white/5 text-zinc-400 border border-white/10'
                    }`}
                    title={sub.active ? 'Active (click to pause)' : 'Paused (click to activate)'}
                  >
                    {sub.active ? 'Active' : 'Paused'}
                  </button>

                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="w-7 h-7 rounded-lg liquid-glass-subtle hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center text-zinc-400 transition cursor-pointer"
                    title="Remove Subscription"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fade-in">
          <div
            className="w-full max-w-lg rounded-3xl liquid-glass border border-white/15 p-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl liquid-glass-pill flex items-center justify-center text-blue-300">
                  <Plus className="w-4 h-4 text-blue-300" />
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">Add Subscription</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-zinc-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSub} className="space-y-4 my-5">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Service / Provider Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Spotify, Gym Pass, AWS"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Billing Cycle
                  </label>
                  <select
                    value={subCycle}
                    onChange={(e) => setSubCycle(e.target.value as 'monthly' | 'yearly')}
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white bg-obsidian focus:outline-none focus:border-white/30"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Category
                  </label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as ExpenseCategory)}
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white bg-obsidian focus:outline-none focus:border-white/30"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    required
                    value={subRenewal}
                    onChange={(e) => setSubRenewal(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-xs text-white bg-obsidian focus:outline-none focus:border-white/30"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="autoRenewCheck"
                  checked={subAutoRenew}
                  onChange={(e) => setSubAutoRenew(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-0"
                />
                <label htmlFor="autoRenewCheck" className="text-xs text-zinc-300 cursor-pointer">
                  Auto-renews automatically on renewal date
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl liquid-glass-subtle text-xs text-zinc-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl liquid-btn-primary text-xs font-semibold text-white"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
