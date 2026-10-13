import React, { useState } from 'react';
import {
  Settings,
  User,
  DollarSign,
  Clock,
  Bell,
  Download,
  Trash2,
  Database,
  ShieldAlert,
  Save,
  Check,
  Sparkles,
  Key,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CurrencyCode } from '../../types';
import { LocalStorageService } from '../../services/storage';
import { saveCustomFirebaseConfig, getSavedFirebaseConfig } from '../../services/firebase';

export const SettingsModal: React.FC = () => {
  const {
    user,
    updateUserProfile,
    resetAllDataToDefault,
    loadSampleDemoData,
    triggerSyncNow,
    syncStatus,
    signOut
  } = useApp();

  const [displayName, setDisplayName] = useState(user.displayName);
  const [currency, setCurrency] = useState<CurrencyCode>(user.currency);
  const [quietHoursStart, setQuietHoursStart] = useState(user.quietHoursStart);
  const [quietHoursEnd, setQuietHoursEnd] = useState(user.quietHoursEnd);
  const [notificationsEnabled, setNotificationsEnabled] = useState(user.notificationsEnabled);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Firebase Config inputs
  const [isFirebaseDrawerOpen, setIsFirebaseDrawerOpen] = useState(false);
  const savedFb = getSavedFirebaseConfig();
  const [fbApiKey, setFbApiKey] = useState(savedFb?.apiKey || '');
  const [fbProjectId, setFbProjectId] = useState(savedFb?.projectId || '');
  const [fbAuthDomain, setFbAuthDomain] = useState(savedFb?.authDomain || '');
  const [fbAppId, setFbAppId] = useState(savedFb?.appId || '');

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', label: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', label: 'Japanese Yen', symbol: '¥' }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      displayName,
      currency,
      quietHoursStart,
      quietHoursEnd,
      notificationsEnabled
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleExportFullData = () => {
    const jsonString = LocalStorageService.exportFullBackup();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pulseflow_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const handleSaveFirebaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbApiKey || !fbProjectId) {
      saveCustomFirebaseConfig(null);
    } else {
      saveCustomFirebaseConfig({
        apiKey: fbApiKey,
        projectId: fbProjectId,
        authDomain: fbAuthDomain || `${fbProjectId}.firebaseapp.com`,
        appId: fbAppId
      });
    }
    alert('Firebase configuration saved. Reloading page to apply...');
    window.location.reload();
  };

  const handleConfirmReset = () => {
    if (window.confirm('Clear all local data and reset to a clean production slate? (Habits, daily goals, partner pair, and expenses will be reset to empty).')) {
      resetAllDataToDefault();
      window.location.reload();
    }
  };

  const handleLoadSampleData = () => {
    if (window.confirm('Load sample test data (habits, goals, subscriptions, duo quest)? This will replace current local data with a rich demo dataset.')) {
      loadSampleDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Settings &amp; Profile
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 font-medium">
          Manage preferences, currency format, quiet hours, Firebase credentials, and cloud backups.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Profile Card */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <User className="w-4 h-4 text-indigo-300" />
            <span>Profile &amp; Account</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/15 shadow-xl"
            />
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full max-w-md liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="text-xs font-mono text-zinc-400">
                  Email: {user.email || 'guest@pulseflow.app'}
                </div>
                {user.email && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to sign out of this account?')) {
                        await signOut();
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-medium text-xs border border-rose-500/30 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Financial Preferences */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <DollarSign className="w-4 h-4 text-emerald-300" />
            <span>Preferred Currency</span>
          </h3>

          <p className="text-xs text-zinc-400 font-medium">
            Select the currency format used across expense tracking, analytics, and monthly budgets.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {currencies.map((c) => (
              <button
                type="button"
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`p-3.5 rounded-2xl transition flex items-center justify-between cursor-pointer ${
                  currency === c.code
                    ? 'liquid-glass-pill border border-white/25 text-white shadow-md'
                    : 'liquid-glass-subtle text-zinc-400 hover:text-white'
                }`}
              >
                <div>
                  <div className="font-bold font-mono text-xs text-white">{c.code}</div>
                  <div className="text-[11px] text-zinc-400 font-medium">{c.label}</div>
                </div>
                <span className="text-base font-black font-mono text-periwinkle">{c.symbol}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nudge & Quiet Hours Controls */}
        <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>Nudge &amp; Notification Preferences</span>
          </h3>

          <p className="text-xs text-zinc-400 font-medium">
            During quiet hours, partner manual nudges and automated reminders are paused.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quiet Hours Start</label>
              <input
                type="time"
                value={quietHoursStart}
                onChange={(e) => setQuietHoursStart(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Quiet Hours End</label>
              <input
                type="time"
                value={quietHoursEnd}
                onChange={(e) => setQuietHoursEnd(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/30"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-500 accent-indigo-500 cursor-pointer"
              />
              <span className="text-xs text-zinc-200 font-medium">
                Enable Web Push notifications on this device
              </span>
            </label>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
          >
            {saveSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Saved Successfully!' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>

      {/* Cloud Sync & Firebase Config Accordion */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl liquid-glass-pill text-amber-300 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Backend &amp; Firebase Integration</h3>
              <p className="text-xs text-zinc-400 font-medium">
                Running in Local First Sync mode. Connect live Firebase for multi-device cloud sync.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsFirebaseDrawerOpen(!isFirebaseDrawerOpen)}
            className="text-xs text-periwinkle hover:text-white font-medium cursor-pointer transition"
          >
            {isFirebaseDrawerOpen ? 'Close Firebase Keys' : 'Configure Firebase'}
          </button>
        </div>

        {isFirebaseDrawerOpen && (
          <form onSubmit={handleSaveFirebaseConfig} className="p-4 rounded-2xl liquid-glass-subtle space-y-3 mt-3 animate-fade-in">
            <div className="text-xs text-zinc-200 font-medium flex items-center gap-1.5 mb-2">
              <Key className="w-3.5 h-3.5 text-amber-300" />
              <span>Firebase Web App Credentials (Optional)</span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">API Key (apiKey)</label>
              <input
                type="text"
                placeholder="AIzaSy..."
                value={fbApiKey}
                onChange={(e) => setFbApiKey(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Project ID (projectId)</label>
                <input
                  type="text"
                  placeholder="pulseflow-app"
                  value={fbProjectId}
                  onChange={(e) => setFbProjectId(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1">Auth Domain (authDomain)</label>
                <input
                  type="text"
                  placeholder="pulseflow-app.firebaseapp.com"
                  value={fbAuthDomain}
                  onChange={(e) => setFbAuthDomain(e.target.value)}
                  className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">App ID (appId - Optional)</label>
              <input
                type="text"
                placeholder="1:1234567890:web:abcdef123456"
                value={fbAppId}
                onChange={(e) => setFbAppId(e.target.value)}
                className="w-full liquid-glass-subtle rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white/30"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl liquid-btn-primary text-white font-medium text-xs tracking-wide transition cursor-pointer"
              >
                Save &amp; Initialize Firebase
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Data Export & Account Reset Section */}
      <div className="liquid-glass rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 tracking-tight">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Data Privacy, Backup &amp; Reset</span>
        </h3>
        <p className="text-xs text-zinc-400 font-medium">
          Export your complete database (habits, goals, transactions, partner data) or reset to factory defaults.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportFullData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass-subtle hover:bg-white/[0.08] text-zinc-200 hover:text-white font-medium text-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4 text-indigo-300" />
            <span>Export Complete JSON Backup</span>
          </button>

          <button
            type="button"
            onClick={handleConfirmReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-medium text-xs border border-rose-500/25 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All Data (Clean Slate)</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSampleData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl liquid-glass-pill hover:bg-indigo-500/20 text-indigo-200 hover:text-white font-medium text-xs border border-indigo-400/25 transition cursor-pointer"
            title="Load sample demo habits, goals, expenses and duo quest"
          >
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <span>Load Sample Demo Data</span>
          </button>

          {user.email && (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm('Sign out and end your active session?')) {
                  await signOut();
                }
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-200 font-medium text-xs border border-rose-500/30 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out of Account</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
