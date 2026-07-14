/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Heart, Camera, FolderOpen, ShieldCheck, Check, Info } from 'lucide-react';

interface PermissionsStepProps {
  onSavePermission: (permId: string, allowed: boolean) => void;
  onComplete: () => void;
}

export default function PermissionsStep({ onSavePermission, onComplete }: PermissionsStepProps) {
  const [currentCard, setCurrentCard] = useState<number>(0); // 0: notifications, 1: healthSync, 2: camera, 3: storage
  const [isIOS, setIsIOS] = useState(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);
  const [permissionStates, setPermissionStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod|macintosh/.test(userAgent);
    setIsIOS(isApple);
  }, []);

  const cards = [
    {
      id: 'notifications',
      icon: <Bell className="w-10 h-10 text-indigo-500" />,
      bg: "bg-indigo-50 border-indigo-100",
      title: "Smart Notifications",
      description: "Get critical reminders for medicines, clinical vitals updates, and upcoming specialist appointments.",
      reason: "HealthMate AI sends silent reminders configured specifically for your routine so you never miss doses."
    },
    {
      id: 'healthSync',
      icon: <Heart className="w-10 h-10 text-rose-500" />,
      bg: "bg-rose-50 border-rose-100",
      title: isIOS ? "Apple Health Integration" : "Health Connect Sync",
      description: isIOS 
        ? "Sync steps, sleep cycle metrics, and active calories from your Apple Watch automatically."
        : "Sync your blood glucose, blood pressure, and steps directly from your connected Google trackers.",
      reason: "Allows our AI assistant to correlate physical metrics with your uploaded prescription timelines."
    },
    {
      id: 'camera',
      icon: <Camera className="w-10 h-10 text-amber-500" />,
      bg: "bg-amber-50 border-amber-100",
      title: "Prescription Scan Camera",
      description: "Instantly capture, analyze, and parse printed laboratory blood panels and doctors' prescriptions.",
      reason: "Uses highly accurate local text processing to turn raw paper documents into actionable medical insights."
    },
    {
      id: 'storage',
      icon: <FolderOpen className="w-10 h-10 text-blue-500" />,
      bg: "bg-blue-50 border-blue-100",
      title: "Local Storage Vault",
      description: "Upload and back up existing laboratory results, medical PDFs, and historical documents from your device.",
      reason: "Safely transfers files to your encrypted medical vault container."
    }
  ];

  const handleAction = (allowed: boolean) => {
    const cardId = cards[currentCard].id;
    setLoadingState(true);
    
    // Simulate brief system permission dialog response latency
    setTimeout(() => {
      onSavePermission(cardId, allowed);
      setPermissionStates(prev => ({ ...prev, [cardId]: allowed }));
      setLoadingState(false);

      if (currentCard === cards.length - 1) {
        onComplete();
      } else {
        setCurrentCard(prev => prev + 1);
      }
    }, 800);
  };

  const activeCard = cards[currentCard];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 select-none">
      
      {/* Top indicator */}
      <div className="max-w-sm mx-auto w-full pt-4 flex justify-between items-center text-xs font-bold text-slate-400">
        <span className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Step 6 of 6
        </span>
        <span>
          Permission {currentCard + 1} of {cards.length}
        </span>
      </div>

      {/* Permissions Carousel Card Stack */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard}
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center space-y-6"
          >
            {/* Round Icon Badge */}
            <div className={`w-20 h-20 rounded-2xl ${activeCard.bg} border flex items-center justify-center shadow-xs`}>
              {activeCard.icon}
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-800 font-display">
                {activeCard.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed px-2">
                {activeCard.description}
              </p>
            </div>

            {/* Contextual explanation bubble */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-left flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 leading-normal font-medium">
                <strong>Why this is useful:</strong> {activeCard.reason}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="max-w-sm mx-auto w-full space-y-4 pb-8">
        <div className="flex gap-3">
          {/* Not now */}
          <button
            disabled={loadingState}
            onClick={() => handleAction(false)}
            className="flex-1 border border-slate-200 text-slate-600 font-bold py-3.5 px-4 rounded-xl hover:bg-slate-100 transition-colors text-sm disabled:opacity-50"
          >
            Not now
          </button>

          {/* Allow */}
          <button
            disabled={loadingState}
            onClick={() => handleAction(true)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform active:scale-[0.99] text-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loadingState ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Allow</span>
              </>
            )}
          </button>
        </div>

        {/* DPDP Compliance & Secure Consent Badge */}
        <p className="text-[10px] text-slate-400 leading-normal text-center flex items-center justify-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> 
          Consents comply with your local data privacy regulations.
        </p>
      </div>
    </div>
  );
}
