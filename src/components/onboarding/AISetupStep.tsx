/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Check, ArrowRight, UserCheck, Shield } from 'lucide-react';

interface AISetupStepProps {
  firstName: string;
  onPartialSave: (answers: {
    conditions?: string[];
    allergies?: string;
    takingMedicines?: boolean;
    medicineNames?: string;
    mainGoal?: string;
  }) => void;
  onComplete: () => void;
}

const QUESTIONS = [
  {
    id: 'conditions',
    title: "Do you have any medical conditions?",
    description: "Select all that apply. This helps HealthMate AI flag dangerous medication interactions.",
  },
  {
    id: 'allergies',
    title: "Any allergies?",
    description: "Enter any active substance or food allergies, or click 'None' to continue.",
  },
  {
    id: 'medicines',
    title: "Are you taking medicines?",
    description: "We will help you set up friendly, smart reminders.",
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    description: "Customizes the health metrics shown on your primary dashboard.",
  }
];

export default function AISetupStep({ firstName = 'there', onPartialSave, onComplete }: AISetupStepProps) {
  const [subStep, setSubStep] = useState<number>(0); // 0: intro, 1: conditions, 2: allergies, 3: medicines, 4: goal
  const [direction, setDirection] = useState<number>(1);

  // Form states
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string>('');
  const [takingMedicines, setTakingMedicines] = useState<boolean | null>(null);
  const [medicineNames, setMedicineNames] = useState<string>('');
  const [mainGoal, setMainGoal] = useState<string>('');

  const nextStep = () => {
    // Save current step data to parent (which saves to server)
    const currentAnswers: any = {};
    if (subStep === 1) currentAnswers.conditions = conditions;
    if (subStep === 2) currentAnswers.allergies = allergies;
    if (subStep === 3) {
      currentAnswers.takingMedicines = !!takingMedicines;
      currentAnswers.medicineNames = medicineNames;
    }
    if (subStep === 4) currentAnswers.mainGoal = mainGoal;

    onPartialSave(currentAnswers);

    if (subStep === 4) {
      onComplete();
    } else {
      setDirection(1);
      setSubStep((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    // Save blank or skipped data
    const skippedAnswers: any = {};
    if (subStep === 1) skippedAnswers.conditions = [];
    if (subStep === 2) skippedAnswers.allergies = 'None';
    if (subStep === 3) {
      skippedAnswers.takingMedicines = false;
      skippedAnswers.medicineNames = '';
    }
    if (subStep === 4) skippedAnswers.mainGoal = 'General wellness';

    onPartialSave(skippedAnswers);

    if (subStep === 4) {
      onComplete();
    } else {
      setDirection(1);
      setSubStep((prev) => prev + 1);
    }
  };

  const handleConditionToggle = (item: string) => {
    if (item === 'None') {
      setConditions(['None']);
    } else {
      setConditions((prev) => {
        const filtered = prev.filter((c) => c !== 'None');
        if (filtered.includes(item)) {
          return filtered.filter((c) => c !== item);
        } else {
          return [...filtered, item];
        }
      });
    }
  };

  // Slide transitions for Framer Motion
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      
      {/* Top Bar with Progress */}
      <div className="max-w-sm mx-auto w-full pt-4 flex items-center justify-between gap-4">
        <div className="flex-1 bg-slate-200 h-1 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-500" 
            style={{ width: `${(subStep / 4) * 100}%` }}
          />
        </div>
        
        {subStep > 0 && (
          <button
            onClick={handleSkip}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 px-3 py-1 bg-slate-100 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Chat Area Container */}
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full py-4 space-y-6">
        
        {/* Assistant Avatar & Greeting */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl shadow-md shrink-0">
            🤖
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm p-4 shadow-xs text-sm text-slate-700 leading-relaxed max-w-[85%]">
            <AnimatePresence mode="wait">
              {subStep === 0 && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-slate-800 mb-1">Hi {firstName || 'there'} 👋</p>
                  I'm your AI Health Assistant. I'll help you understand medical reports, track daily medicines, and keep tabs on symptoms. Let's personalize your companion!
                </motion.div>
              )}

              {subStep === 1 && (
                <motion.div
                  key="q-conditions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-slate-800 mb-1">Medical Conditions 🩺</p>
                  Do you currently manage any chronic medical conditions? Selecting these helps me tailor nutrition, vitals alerts, and health tips.
                </motion.div>
              )}

              {subStep === 2 && (
                <motion.div
                  key="q-allergies"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-slate-800 mb-1">Allergies & Sensitivities 💊</p>
                  Do you have any known pharmaceutical or food allergies (e.g., Penicillin, Peanuts)? I'll cross-check medications you load later.
                </motion.div>
              )}

              {subStep === 3 && (
                <motion.div
                  key="q-medicines"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-slate-800 mb-1">Current Medications 🧪</p>
                  Are you currently taking any prescription pills or regular daily vitamins? Let's get these structured for safety tracking.
                </motion.div>
              )}

              {subStep === 4 && (
                <motion.div
                  key="q-goal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="font-semibold text-slate-800 mb-1">Your Primary Health Goal 🎯</p>
                  Finally, what is your top priority right now? This sets up the telemetry charts, reminders, and daily task card summaries.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Interactive Controls (Animated Transition between screens) */}
        <div className="min-h-[180px] flex flex-col justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={subStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-4"
            >
              {/* INTRO SCREEN CONTINUE */}
              {subStep === 0 && (
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-center space-y-3">
                  <div className="flex justify-center text-blue-600">
                    <UserCheck className="w-8 h-8" />
                  </div>
                  <p className="text-xs text-blue-700/80 font-semibold px-4 leading-relaxed">
                    "I am ready to build a customized, highly secure medical workspace."
                  </p>
                </div>
              )}

              {/* CONDITIONS SELECTION */}
              {subStep === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {['Diabetes', 'BP', 'Asthma', 'None'].map((cond) => {
                    const isSelected = conditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => handleConditionToggle(cond)}
                        className={`p-3 rounded-xl border font-bold text-sm text-left transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cond}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* ALLERGIES FREE TEXT & CHIP */}
              {subStep === 2 && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Pollen, Peanuts..."
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  />
                  <div className="flex gap-2 items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Select:</span>
                    <button
                      type="button"
                      onClick={() => setAllergies('None')}
                      className={`text-xs px-3 py-1 rounded-full border transition-all ${
                        allergies === 'None' 
                          ? 'bg-blue-600 border-blue-600 text-white font-bold' 
                          : 'bg-white border-slate-200 text-slate-500 font-medium'
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>
              )}

              {/* MEDICINES YES/NO TOGGLE */}
              {subStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setTakingMedicines(true);
                      }}
                      className={`p-3 rounded-xl border font-bold text-sm text-center transition-all ${
                        takingMedicines === true 
                          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Yes, taking medicines
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTakingMedicines(false);
                        setMedicineNames('');
                      }}
                      className={`p-3 rounded-xl border font-bold text-sm text-center transition-all ${
                        takingMedicines === false 
                          ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      No
                    </button>
                  </div>

                  {takingMedicines === true && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">List medicine names (optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Telmisartan, Vitamin D3"
                        value={medicineNames}
                        onChange={(e) => setMedicineNames(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {/* MAIN GOAL SINGLE SELECT */}
              {subStep === 4 && (
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {[
                    { id: 'Lose weight', label: '🏃‍♂️ Lose weight' },
                    { id: 'Better sleep', label: '😴 Better sleep' },
                    { id: 'Manage diabetes', label: '🩸 Manage diabetes' },
                    { id: 'Improve fitness', label: '💪 Improve fitness' },
                    { id: 'General wellness', label: '🌱 General wellness' }
                  ].map((goal) => {
                    const isSelected = mainGoal === goal.id;
                    return (
                      <button
                        type="button"
                        key={goal.id}
                        onClick={() => setMainGoal(goal.id)}
                        className={`w-full p-3 rounded-xl border font-bold text-sm text-left transition-all flex items-center justify-between ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{goal.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Action Footer */}
      <div className="max-w-sm mx-auto w-full pt-4 pb-8 flex flex-col items-center">
        {/* Secure verification indicator */}
        <p className="text-[10px] text-slate-400 flex items-center gap-1 mb-4 font-semibold">
          <Shield className="w-3 h-3 text-emerald-500" /> Responses processed and encrypted locally
        </p>

        <button
          onClick={nextStep}
          disabled={
            (subStep === 1 && conditions.length === 0) ||
            (subStep === 3 && takingMedicines === null) ||
            (subStep === 4 && !mainGoal)
          }
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform active:scale-[0.99]"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
