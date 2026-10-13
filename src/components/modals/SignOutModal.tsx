import React, { useEffect } from 'react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SignOutModal: React.FC = () => {
  const { user, isSignOutModalOpen, setIsSignOutModalOpen, signOut } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSignOutModalOpen) {
        setIsSignOutModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSignOutModalOpen, setIsSignOutModalOpen]);

  if (!isSignOutModalOpen) return null;

  const userInitials = user.displayName && user.displayName !== 'My Account'
    ? user.displayName
        .split(' ')
        .map(n => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : user.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'PF';

  const handleConfirm = async () => {
    await signOut();
    setIsSignOutModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={() => setIsSignOutModalOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="signout-modal-title"
    >
      <div
        className="liquid-glass rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl relative border border-white/15 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.85), 0 0 35px -5px rgba(244, 63, 94, 0.25)'
        }}
      >
        {/* Subtle top rose light flare */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Close Icon Button */}
        <button
          onClick={() => setIsSignOutModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-xl liquid-glass-subtle text-zinc-400 hover:text-white transition cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center space-y-3 pt-2">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-[0_0_24px_rgba(244,63,94,0.3)]">
            <LogOut className="w-6 h-6 text-rose-400" />
          </div>

          <div>
            <h3 id="signout-modal-title" className="text-lg font-bold text-white tracking-tight">
              Sign Out of PulseFlow?
            </h3>
            <p className="text-xs text-zinc-300 font-medium mt-1">
              Do you really want to sign out?
            </p>
          </div>
        </div>

        {/* User Card Indicator */}
        {user.email && (
          <div className="my-4 p-3 rounded-2xl liquid-glass-subtle border border-white/10 flex items-center gap-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-9 h-9 rounded-xl object-cover border border-white/15 shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-xl liquid-glass-pill flex items-center justify-center font-bold text-xs text-indigo-200 shrink-0">
                {userInitials}
              </div>
            )}
            <div className="overflow-hidden text-left">
              <div className="text-xs font-semibold text-white truncate">
                {user.displayName || 'My Account'}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono truncate">
                {user.email}
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-zinc-400 text-center leading-relaxed mb-5">
          Your current session will be closed on this device. Your habits, goals, and settings are safely stored.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => setIsSignOutModalOpen(false)}
            className="py-2.5 px-4 rounded-xl liquid-glass-subtle hover:bg-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
          >
            Stay Signed In
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-950/60 transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Yes, Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
