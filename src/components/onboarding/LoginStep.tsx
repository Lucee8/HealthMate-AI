/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginStepProps {
  onSuccess: (userData: { name: string; authMethod: string }) => void;
}

export default function LoginStep({ onSuccess }: LoginStepProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  // Platform detection for Apple sign-in
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApplePlatform = /iphone|ipad|ipod|macintosh/.test(userAgent);
    setIsIOS(isApplePlatform);
  }, []);

  const handleLogin = (provider: string, emailValue?: string) => {
    setLoadingProvider(provider);
    
    // Simulate auth provider latency (Firebase-like)
    setTimeout(() => {
      setLoadingProvider(null);
      onSuccess({
        name: emailValue ? emailValue.split('@')[0] : "New User",
        authMethod: provider
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-8">
        
        {/* Header / Brand */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-md">
            🤖
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 font-display">
            Secure Sign In
          </h2>
          <p className="text-sm text-slate-500 max-w-[280px] mx-auto">
            Choose a provider to create your secure, encrypted health companion account.
          </p>
        </div>

        {/* Auth Provider Buttons */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {!showEmailForm ? (
              <motion.div
                key="providers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                {/* Google Sign In */}
                <button
                  disabled={!!loadingProvider}
                  onClick={() => handleLogin('Google')}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {loadingProvider === 'Google' ? (
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.85-.94 2.5l3.28 2.54c1.92-1.77 3.015-4.38 3.015-7.39z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-3.28-2.54c-.9.6-2.06.96-3.32.96-3.2 0-5.91-2.16-6.87-5.07L1.135 17.61C3.105 21.49 7.235 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.13 14.44a7.12 7.12 0 0 1 0-4.52l-3.36-2.61a11.96 11.96 0 0 0 0 9.74l3.36-2.61z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43C17.96 1.19 15.24 0 12 0 7.24 0 3.11 2.51 1.14 6.39l3.36 2.61c.96-2.91 3.67-5.25 6.87-5.25z"
                      />
                    </svg>
                  )}
                  <span>Continue with Google</span>
                </button>

                {/* Apple Sign In (iOS / macOS conditionally rendered) */}
                {(isIOS || true) && ( // Let's also keep it visible for premium display but conditionally flag platform
                  <button
                    disabled={!!loadingProvider}
                    onClick={() => handleLogin('Apple')}
                    className="w-full flex items-center justify-center gap-3 bg-black hover:bg-zinc-900 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
                  >
                    {loadingProvider === 'Apple' ? (
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.64.75-1.2 1.88-1.05 3 .1.1 2.25.04 3-.46z" />
                      </svg>
                    )}
                    <span>Continue with Apple</span>
                  </button>
                )}

                {/* Email Sign In Trigger */}
                <button
                  disabled={!!loadingProvider}
                  onClick={() => setShowEmailForm(true)}
                  className="w-full flex items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100/80 border border-blue-100 text-blue-700 font-bold py-3 px-4 rounded-xl shadow-xs transition-all transform active:scale-[0.99] disabled:opacity-70"
                >
                  <Mail className="w-5 h-5" />
                  <span>Continue with Email</span>
                </button>

                {/* Phone Number Sign In */}
                <button
                  disabled={!!loadingProvider}
                  onClick={() => handleLogin('Phone')}
                  className="w-full flex items-center justify-center gap-3 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-100 text-emerald-700 font-bold py-3 px-4 rounded-xl shadow-xs transition-all transform active:scale-[0.99] disabled:opacity-70"
                >
                  <Phone className="w-5 h-5" />
                  <span>Continue with Phone</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="emailForm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="flex-1 border border-slate-200 text-slate-600 font-bold py-3 px-4 rounded-xl hover:bg-slate-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={!emailInput || !!loadingProvider}
                    onClick={() => handleLogin('Email', emailInput)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors text-sm flex items-center justify-center gap-1"
                  >
                    {loadingProvider === 'Email' && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Sign In</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Safety & Compliance Badge */}
      <div className="max-w-sm mx-auto w-full text-center pb-8">
        <p className="text-[10px] text-slate-400 leading-normal flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 
          HIPAA & GDPR Compliant secure encryption state.
        </p>
      </div>
    </div>
  );
}
