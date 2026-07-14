/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion } from 'motion/react';

interface SplashStepProps {
  onNext: () => void;
}

export default function SplashStep({ onNext }: SplashStepProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onNext();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onNext]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center space-y-6"
      >
        {/* Animated Custom Logo */}
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4, 
            ease: "easeInOut" 
          }}
          className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl shadow-xl border-4 border-white/20"
        >
          🤖
        </motion.div>

        {/* Title & Tagline with Space Grotesk display headings */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-slate-800 font-display">
            HealthMate AI
          </h1>
          <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
            Your Personal AI Health Companion
          </p>
        </div>

        {/* Pulsing secure lock badge */}
        <div className="bg-blue-50 text-blue-700 text-[10px] font-bold py-1 px-3 rounded-full border border-blue-100/50 flex items-center gap-1">
          <span>🔒</span> End-to-End Encrypted & DPDP Compliant
        </div>
      </motion.div>
    </div>
  );
}
