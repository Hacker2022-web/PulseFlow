import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Plus,
  Download,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Tag,
  CreditCard,
  DollarSign,
  Calendar,
  Lock,
  Trash2,
  PieChart as PieIcon,
  BarChart3,
  Repeat,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { LocalStorageService, getTodayString } from '../../services/storage';
import { SubscriptionVaultSection } from './SubscriptionVaultSection';

export const ExpensesView: React.FC = () => {
  const {
    expenses,
    budgets,
    addExpense,
    deleteExpense,
    updateBudget,
    getCategorySpentThisMonth,
    getTotalSpentThisMonth,
    getMonthlyBudgetTotal,
    formatCurrency,
    getPredictiveBudgetForecast,
    subscriptions
  } = useApp();

  const [viewMode, setViewMode] = useState<'overview' | 'vault'>('overview');
  const [activeFilter, setActiveFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBudgetEditModalOpen, setIsBudgetEditModalOpen] = useState(false);

  // Expense form state
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState<string>('Food & Dining');
  const [date, setDate] = useState(getTodayString());
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Card');
  const [isRecurring, setIsRecurring] = useState(false);

  // Budget edit state
  const [editingCategory, setEditingCategory] = useState<string>('Food & Dining');
  const [editingLimit, setEditingLimit] = useState<string>('450');

  const categories = [
    'Food & Dining',
    'Housing & Utilities',
    'Transportation',
    'Shopping & Groceries',
    'Health & Fitness',
    'Entertainment',
    'Education & Learning',
    'Personal Care',
    'Income',
    'Others'
  ];

  const categoryColors: Record<string, string> = {
    'Food & Dining': '#6366f1',
    'Housing & Utilities': '#8b5cf6',
    'Transportation': '#38bdf8',
    'Shopping & Groceries': '#ec4899',
    'Health & Fitness': '#10b981',
    'Entertainment': '#a5b4fc',
    'Education & Learning': '#3b82f6',
    'Personal Care': '#14b8a6',
    'Others': '#94a3b8',
    'Income': '#22c55e'
  };

  const currentMonthTotalSpent = getTotalSpentThisMonth();
  const currentMonthBudget = getMonthlyBudgetTotal();

  // Income this month
  const currentMonthIncome = useMemo(() => {
    const today = new Date();
    const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    return expenses
      .filter(e => e.type === 'income' && e.date.startsWith(ym))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Net cash flow
  const netCashFlow = currentMonthIncome - currentMonthTotalSpent;

  // Category breakdown for Pie Chart
  const pieChartData = useMemo(() => {
    const data: { name: string; value: number; color: string }[] = [];
    budgets.forEach(b => {
      const spent = getCategorySpentThisMonth(b.category);
      if (spent > 0) {
        data.push({
          name: b.category,
          value: spent,
          color: categoryColors[b.category] || '#6366f1'
        });
      }
    });
    return data;
  }, [budgets, getCategorySpentThisMonth]);

  // Daily Trend Data for Bar Chart
  const trendData = useMemo(() => {
    const map: Record<string, number> = {};
    const today = new Date();
    // Last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      map[str] = 0;
    }

    expenses.forEach(e => {
      if (e.type === 'expense' && map[e.date] !== undefined) {
        map[e.date] += e.amount;
      }
    });

    return Object.entries(map).map(([dateStr, total]) => {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        spent: total
      };
    });
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      if (activeFilter === 'expense') return e.type === 'expense';
      if (activeFilter === 'income') return e.type === 'income';
      return true;
    });
  }, [expenses, activeFilter]);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    addExpense({
      userId: 'user_primary_001',
      amount: parsedAmount,
      type,
      category: type === 'income' ? 'Income' : category,
      date,
      note: note.trim() || undefined,
      paymentMethod,
      isRecurring,
      recurringFrequency: isRecurring ? 'monthly' : undefined,
      sharedWithPartner: false
    });

    setAmount('');
    setNote('');
    setIsAddExpenseModalOpen(false);
  };

  const handleExportCSV = () => {
    const csvContent = LocalStorageService.exportExpensesToCSV(expenses);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `pulseflow_expenses_${getTodayString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-7xl mx-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
              Expense Tracker
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-mono liquid-glass-subtle text-periwinkle px-2.5 py-0.5 rounded-full border border-white/10">
              <Lock className="w-3 h-3 text-indigo-300" /> Private by default
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-medium">
            Track spending, manage category budgets with smart alerts, and analyze monthly cashflow.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-300" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={() => setIsBudgetEditModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-zinc-200 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <span>Set Budgets</span>
          </button>

          <button
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Sub-tab navigation: Overview vs Subscription Vault */}
      <div className="flex items-center gap-2 p-1 rounded-2xl liquid-glass-subtle self-start border border-white/10">
        <button
          onClick={() => setViewMode('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            viewMode === 'overview'
              ? 'liquid-btn-primary text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Transactions &amp; Budgets
        </button>
        <button
          onClick={() => setViewMode('vault')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            viewMode === 'vault'
              ? 'liquid-btn-primary text-white shadow-md'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Subscription Vault ({subscriptions.length})</span>
        </button>
      </div>

      {viewMode === 'vault' ? (
        <SubscriptionVaultSection />
      ) : (
        <>
          {/* Predictive Budget Burn Forecast Glass Banner */}
          {(() => {
            const forecast = getPredictiveBudgetForecast();
            return (
              <div className="p-5 sm:p-6 rounded-3xl liquid-glass border border-indigo-500/30 relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="absolute top-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500/30 to-violet-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] shrink-0">
                    <Sparkles className="w-6 h-6 text-indigo-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">Predictive Budget Burn Forecast</h3>
                      <span
                        className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold ${
                          forecast.budgetSafe
                            ? 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/25'
                            : 'text-amber-300 bg-amber-500/15 border border-amber-400/25 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
                        }`}
                      >
                        {forecast.budgetSafe ? 'Runway On-Track' : `Burn Exhaustion: ${forecast.projectedExhaustionDate}`}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                      {forecast.recommendation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 relative z-10 shrink-0">
                  <div className="px-4 py-2.5 rounded-2xl liquid-glass-subtle border border-white/10 text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Current Burn Rate
                    </span>
                    <span className="text-sm font-bold font-mono text-cyan-300">
                      {formatCurrency(forecast.dailyPace)}/day
                    </span>
                  </div>

                  <div className="px-4 py-2.5 rounded-2xl liquid-glass-subtle border border-white/10 text-right">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block">
                      Projected End Spend
                    </span>
                    <span className="text-sm font-bold font-mono text-periwinkle">
                      {formatCurrency(forecast.projectedMonthEndSpend)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Top 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Card 1: Total Spent */}
            <div className="liquid-glass rounded-3xl p-5 sm:p-6">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
            <span>Spent This Month</span>
            <TrendingDown className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            {formatCurrency(currentMonthTotalSpent)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-2">
            Limit: {formatCurrency(currentMonthBudget)} ({Math.round((currentMonthTotalSpent / (currentMonthBudget || 1)) * 100)}%)
          </div>
        </div>

        {/* Card 2: Income */}
        <div className="liquid-glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
            <span>Income This Month</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 tracking-tight">
            {formatCurrency(currentMonthIncome)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-2">
            Salary, freelance &amp; deposits
          </div>
        </div>

        {/* Card 3: Net Cash Flow */}
        <div className="liquid-glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
            <span>Net Monthly Balance</span>
            <Wallet className="w-4 h-4 text-indigo-300" />
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${netCashFlow >= 0 ? 'text-indigo-200' : 'text-rose-400'}`}>
            {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
          </div>
          <div className="text-[11px] font-mono text-zinc-400 mt-2">
            {netCashFlow >= 0 ? 'Positive savings rate' : 'Deficit this month'}
          </div>
        </div>
      </div>

      {/* Charts Section: Category Breakdown & Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart: Spending by Category */}
        <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Category Breakdown</h3>
              <p className="text-xs text-zinc-400 font-medium">Where your money went this month</p>
            </div>
            <PieIcon className="w-4 h-4 text-indigo-300" />
          </div>

          <div className="h-64 w-full">
            {pieChartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                No expense entries yet this month.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Spent']}
                    contentStyle={{
                      backgroundColor: 'rgba(13, 17, 36, 0.95)',
                      borderColor: 'rgba(129, 140, 248, 0.25)',
                      borderRadius: '16px',
                      color: '#fff',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-300 font-mono pt-3 border-t border-white/10">
            {pieChartData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: 14-Day Spend Trend */}
        <div className="liquid-glass rounded-3xl p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Daily Spending Trend</h3>
              <p className="text-xs text-zinc-400 font-medium">Daily expenses over the last 14 days</p>
            </div>
            <BarChart3 className="w-4 h-4 text-violet-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="date" stroke="rgba(165, 180, 252, 0.6)" fontSize={10} fontVariant="mono" />
                <YAxis stroke="rgba(165, 180, 252, 0.6)" fontSize={10} fontVariant="mono" />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val) || 0), 'Spent']}
                  contentStyle={{
                    backgroundColor: 'rgba(13, 17, 36, 0.95)',
                    borderColor: 'rgba(129, 140, 248, 0.25)',
                    borderRadius: '16px',
                    color: '#fff',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
                  }}
                />
                <Bar dataKey="spent" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 pt-3 border-t border-white/10 flex items-center justify-between">
            <span>Pacing: Normal</span>
            <span className="text-periwinkle">Refreshes in real-time</span>
          </div>
        </div>
      </div>

      {/* Monthly Budget Categories & Warnings (80% / 100%) */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Category Budget Limits</h3>
            <p className="text-xs text-zinc-400 font-medium">
              Warning triggered at 80% (amber) and 100% (rose limit reached).
            </p>
          </div>
          <button
            onClick={() => setIsBudgetEditModalOpen(true)}
            className="text-xs text-periwinkle hover:text-white font-medium cursor-pointer transition"
          >
            Adjust Limits
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {budgets.map((b) => {
            const spent = getCategorySpentThisMonth(b.category);
            const ratio = b.monthlyLimit > 0 ? spent / b.monthlyLimit : 0;
            const percent = Math.min(100, Math.round(ratio * 100));

            return (
              <div key={b.category} className="p-3.5 rounded-2xl liquid-glass-subtle">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-zinc-200 truncate">{b.category}</span>
                  {ratio >= 1.0 ? (
                    <span className="text-[10px] font-mono font-bold text-rose-300 bg-rose-500/15 px-1.5 py-0.5 rounded-full border border-rose-500/25 flex items-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Exceeded
                    </span>
                  ) : ratio >= 0.8 ? (
                    <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded-full border border-amber-500/25">
                      80% Alert
                    </span>
                  ) : null}
                </div>

                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden my-2 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      ratio >= 1.0
                        ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                        : ratio >= 0.8
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.7)]'
                        : 'bg-gradient-to-r from-indigo-400 to-violet-400 shadow-[0_0_8px_rgba(129,140,248,0.7)]'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{formatCurrency(spent)}</span>
                  <span>Limit: {formatCurrency(b.monthlyLimit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transaction History Table */}
      <div className="liquid-glass rounded-3xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight">Transaction History</h3>
            <p className="text-xs text-zinc-400 font-medium">All recent expense and income entries.</p>
          </div>

          <div className="flex items-center gap-1.5 liquid-glass-subtle rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'liquid-glass-pill text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('expense')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'expense'
                  ? 'liquid-glass-pill text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setActiveFilter('income')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                activeFilter === 'income'
                  ? 'liquid-glass-pill text-white font-medium shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Income
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-zinc-400 text-[11px] font-mono uppercase tracking-wider">
                <th className="pb-3 font-semibold">Date</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Note</th>
                <th className="pb-3 font-semibold">Method</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-white/[0.04] transition-all">
                  <td className="py-3 text-zinc-400 font-mono text-[11px]">{exp.date}</td>
                  <td className="py-3">
                    <span className="font-medium text-white">{exp.category}</span>
                    {exp.isRecurring && (
                      <span className="ml-1.5 text-[9px] font-mono bg-white/[0.06] text-periwinkle px-1.5 py-0.5 rounded-full border border-white/10">
                        Recurring
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-zinc-300 max-w-xs truncate">{exp.note || '—'}</td>
                  <td className="py-3 text-zinc-400 font-mono">{exp.paymentMethod}</td>
                  <td className="py-3 font-bold font-mono">
                    <span className={exp.type === 'income' ? 'text-emerald-300' : 'text-zinc-100'}>
                      {exp.type === 'income' ? '+' : '-'}{formatCurrency(exp.amount)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => deleteExpense(exp.id)}
                      className="text-zinc-400 hover:text-rose-400 p-1.5 rounded-xl transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

      {/* Add Transaction Modal */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl border border-white/15">
            <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Add Transaction</h3>
            <p className="text-xs text-zinc-400 mb-4 font-medium">Log spending or income in a few taps.</p>

            <form onSubmit={handleCreateExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 liquid-glass-subtle rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    type === 'expense'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-lg transition-all cursor-pointer ${
                    type === 'income'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Income
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2.5 text-base font-bold font-mono text-white focus:outline-none focus:border-white/30"
                />
              </div>

              {type === 'expense' && (
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                  >
                    {categories.filter(c => c !== 'Income').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                  >
                    <option value="Card">Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Digital Wallet">Digital Wallet (Apple Pay / UPI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Note (optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Organic grocery run, Netflix, dinner"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="p-3.5 rounded-2xl liquid-glass-subtle flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">Recurring Monthly?</div>
                  <div className="text-[11px] text-zinc-400 font-medium">Rent, gym, subscriptions</div>
                </div>
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Category Budgets Modal */}
      {isBudgetEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-in">
          <div className="liquid-glass rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl border border-white/15">
            <h3 className="text-base font-bold text-white mb-1 tracking-tight">Set Monthly Budget Limit</h3>
            <p className="text-xs text-zinc-400 mb-4 font-medium">Configure thresholds for 80% and 100% warnings.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Category</label>
                <select
                  value={editingCategory}
                  onChange={(e) => {
                    setEditingCategory(e.target.value);
                    const b = budgets.find(b => b.category === e.target.value);
                    if (b) setEditingLimit(b.monthlyLimit.toString());
                  }}
                  className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white/30 [&>option]:bg-[#0d1124] [&>option]:text-white"
                >
                  {budgets.map(b => (
                    <option key={b.category} value={b.category}>{b.category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Monthly Limit (₹)</label>
                <input
                  type="number"
                  value={editingLimit}
                  onChange={(e) => setEditingLimit(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBudgetEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white font-medium cursor-pointer transition"
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const lim = parseFloat(editingLimit);
                    if (!isNaN(lim) && lim >= 0) {
                      updateBudget(editingCategory, lim);
                    }
                    setIsBudgetEditModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
                >
                  Save Limit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensesView;
