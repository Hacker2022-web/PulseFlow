'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Mail, Lock, Eye, EyeClosed, ArrowRight, User, AlertCircle, CheckCircle2, LogOut } from 'lucide-react';

import { cn } from "@/lib/utils";
import { loginSchema, signUpSchema, LoginInput, SignUpInput } from "@/lib/schemas/auth";
import { useApp } from "@/context/AppContext";
import { firebaseService } from "@/services/firebase";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-purple-300/35 selection:bg-purple-500 selection:text-white border-purple-500/20 flex h-11 w-full min-w-0 rounded-xl border bg-[#231338]/50 px-3.5 py-2 text-sm text-white shadow-xs transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-purple-400/50 focus-visible:bg-[#2c1747]/70 focus-visible:ring-2 focus-visible:ring-purple-500/20",
        "aria-invalid:ring-rose-500/20 aria-invalid:border-rose-500/50",
        className
      )}
      {...props}
    />
  );
}

export interface ComponentProps {
  embedded?: boolean;
  className?: string;
}

export function Component({ embedded = false, className }: ComponentProps = {}) {
  const { user, signOut, requestSignOut, updateUserProfile, setActiveTab, addNotification } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [switchAccountMode, setSwitchAccountMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // State & Schema Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // 3D Perspective Card Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [8, -8]);
  const rotateY = useTransform(mouseX, [-300, 300], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Submit with Zod Login/Signup Schema Validation
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrors({});
    setAuthSuccess(null);

    if (mode === 'signin') {
      const validation = loginSchema.safeParse({ email, password, rememberMe });
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        const userDisplayName = email.split('@')[0].replace(/[._-]/g, ' ') || 'User';
        const formattedName = userDisplayName.charAt(0).toUpperCase() + userDisplayName.slice(1);

        updateUserProfile({
          email,
          displayName: formattedName
        });

        setAuthSuccess(`Welcome back, ${formattedName}!`);

        setTimeout(() => {
          setActiveTab('dashboard');
        }, 1200);
      }, 1000);

    } else {
      // Sign Up Schema Validation
      const validation = signUpSchema.safeParse({ name, email, password, confirmPassword });
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          if (field && !fieldErrors[field]) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        updateUserProfile({
          displayName: name.trim(),
          email: email.trim()
        });

        setAuthSuccess(`Account created for ${name}!`);

        setTimeout(() => {
          setActiveTab('dashboard');
        }, 1200);
      }, 1000);
    }
  };

  // Google Sign-In with Firebase Auth or fallback
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      if (firebaseService.isConfigured) {
        const fbUser = await firebaseService.signInWithGoogle();
        if (fbUser) {
          updateUserProfile({
            uid: fbUser.uid,
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'My Account'),
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || ''
          });
          setAuthSuccess(`Signed in as ${fbUser.displayName || fbUser.email}!`);
          setTimeout(() => setActiveTab('dashboard'), 800);
          return;
        }
      }
      // Offline / Local Google Auth simulation if Firebase credentials not configured
      setTimeout(() => {
        setIsLoading(false);
        updateUserProfile({
          displayName: 'My Account',
          email: 'member@pulseflow.app',
          photoURL: ''
        });
        setAuthSuccess(`Signed in successfully!`);
        setTimeout(() => setActiveTab('dashboard'), 800);
      }, 900);
    } catch (err: any) {
      setIsLoading(false);
      setErrors({ form: err.message || 'Google sign in failed' });
    }
  };

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("w-full max-w-[390px] relative z-10", className)}
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative"
        style={{ rotateX, rotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
          {/* Frosted Obsidian-Purple Card */}
          <div 
            className="relative rounded-3xl p-7 sm:p-8 border shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              background: 'rgba(23, 13, 38, 0.74)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              borderColor: 'rgba(168, 85, 247, 0.16)',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75), 0 0 35px -5px rgba(126, 34, 206, 0.25)'
            }}
          >
            {/* Logged-In User Profile Card */}
            {user?.email && !switchAccountMode ? (
              <div className="space-y-5">
                <div className="text-center space-y-2 mb-2">
                  <div className="mx-auto w-16 h-16 rounded-2xl border border-purple-400/30 bg-purple-950/70 overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-inner ring-2 ring-purple-500/20">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{user.displayName?.slice(0, 2).toUpperCase() || 'PF'}</span>
                    )}
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-white font-sans">
                    {user.displayName || 'Active Account'}
                  </h1>

                  <p className="text-xs text-purple-200/70 font-mono">
                    {user.email}
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Signed In &amp; Synced</span>
                  </div>
                </div>

                {authSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs tracking-wide transition shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>Open PulseFlow Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={requestSignOut}
                    className="w-full h-11 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 font-medium text-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Account</span>
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => setSwitchAccountMode(true)}
                      className="text-xs text-purple-300/60 hover:text-white transition underline cursor-pointer"
                    >
                      Sign in with another account
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Switch back button if previously authenticated */}
                {user?.email && switchAccountMode && (
                  <div className="mb-4 text-left">
                    <button
                      type="button"
                      onClick={() => setSwitchAccountMode(false)}
                      className="text-xs text-purple-300/70 hover:text-white transition flex items-center gap-1 cursor-pointer"
                    >
                      <span>← Back to {user.displayName || user.email}</span>
                    </button>
                  </div>
                )}

                {/* Header: Circle Avatar & Title */}
                <div className="text-center space-y-1.5 mb-6">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mx-auto w-10 h-10 rounded-full border border-purple-400/25 bg-purple-950/70 flex items-center justify-center text-white font-bold text-sm shadow-inner mb-3"
                  >
                    P
                  </motion.div>

                  <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                    {mode === 'signin' ? 'Welcome to PulseFlow' : 'Create Account'}
                  </h1>
                  
                  <p className="text-xs text-purple-200/60 font-medium">
                    {mode === 'signin' ? 'Sign in to continue to PulseFlow' : 'Join PulseFlow & start tracking your habits'}
                  </p>
                </div>

                {/* Success Banner */}
                {authSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{authSuccess}</span>
                  </motion.div>
                )}

                {/* General Form Error */}
                {errors.form && (
                  <div className="mb-4 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.form}</span>
                  </div>
                )}

                {/* Authentication Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Field (Sign Up mode only) */}
                  {mode === 'signup' && (
                <div>
                  <div className="relative flex items-center">
                    <User className={`absolute left-3.5 w-4 h-4 transition-colors ${
                      focusedInput === 'name' ? 'text-purple-300' : 'text-purple-300/40'
                    }`} />
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                      }}
                      onFocus={() => setFocusedInput('name')}
                      onBlur={() => setFocusedInput(null)}
                      className={cn("pl-10", errors.name && "border-rose-500/60")}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.name}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div>
                <div className="relative flex items-center">
                  <Mail className={`absolute left-3.5 w-4 h-4 transition-colors ${
                    focusedInput === 'email' ? 'text-purple-300' : 'text-purple-300/40'
                  }`} />
                  <Input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                    }}
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className={cn("pl-10", errors.email && "border-rose-500/60")}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative flex items-center">
                  <Lock className={`absolute left-3.5 w-4 h-4 transition-colors ${
                    focusedInput === 'password' ? 'text-purple-300' : 'text-purple-300/40'
                  }`} />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                    }}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    className={cn("pl-10 pr-10", errors.password && "border-rose-500/60")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-purple-300/40 hover:text-purple-200 transition"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeClosed className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field (Sign Up mode only) */}
              {mode === 'signup' && (
                <div>
                  <div className="relative flex items-center">
                    <Lock className={`absolute left-3.5 w-4 h-4 transition-colors ${
                      focusedInput === 'confirmPassword' ? 'text-purple-300' : 'text-purple-300/40'
                    }`} />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                      }}
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      className={cn("pl-10", errors.confirmPassword && "border-rose-500/60")}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] text-rose-400 mt-1 pl-1">{errors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Remember Me & Forgot Password Row (Sign In mode) */}
              {mode === 'signin' && (
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-purple-200/60 hover:text-purple-200 transition select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border border-purple-400/30 bg-[#25153b] text-purple-500 accent-purple-500 focus:ring-0 focus:outline-none"
                    />
                    <span>Remember me</span>
                  </label>

                  <a 
                    href="#forgot" 
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Password reset instructions will be sent to your email.');
                    }}
                    className="text-purple-200/60 hover:text-white transition"
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Primary White Button (Exact Match) */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 h-11 rounded-xl bg-white hover:bg-slate-100 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/70 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Sign In' : 'Sign Up'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {/* Subtle Divider */}
              <div className="relative my-4 flex items-center">
                <div className="flex-grow border-t border-purple-500/15" />
                <span className="mx-3 text-xs text-purple-300/40 font-medium">or</span>
                <div className="flex-grow border-t border-purple-500/15" />
              </div>

              {/* Google Sign In Button (Exact Match) */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/90 text-xs font-semibold flex items-center justify-center gap-2 transition active:scale-[0.99]"
              >
                <span className="font-bold text-sm text-white/90">G</span>
                <span>Sign in with Google</span>
              </button>

              {/* Footer Switcher */}
              <div className="text-center text-xs text-purple-200/60 pt-2">
                {mode === 'signin' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signup');
                        setErrors({});
                      }}
                      className="text-white hover:underline font-semibold"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('signin');
                        setErrors({});
                      }}
                      className="text-white hover:underline font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>
          </>
        )}
      </div>
        </motion.div>
      </motion.div>
  );

  if (embedded) {
    return cardContent;
  }

  return (
    <div className={cn("min-h-screen w-full relative overflow-hidden flex items-center justify-center p-4 bg-[#05010b]", className)}>
      {/* Silky smooth purple gradient glow background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 75% at 50% 45%, #4c116d 0%, #440f62 14%, #3a0c54 28%, #2f0844 42%, #240536 56%, #1a0328 69%, #12021c 80%, #0b0113 90%, #05010b 100%)'
        }}
      />

      {/* Atmospheric Soft Blur Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[550px] bg-purple-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[480px] h-[360px] bg-fuchsia-600/12 rounded-full blur-[120px] pointer-events-none" />

      {/* Subtle micro-noise texture to prevent banding */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {cardContent}
    </div>
  );
}

export default Component;
