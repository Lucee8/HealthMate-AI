/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Bot, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip: () => void;
}

const SCREENS = [
  {
    id: 1,
    icon: <Heart className="w-12 h-12 text-rose-500" />,
    iconBg: "bg-rose-50 border-rose-100",
    title: "Your health in one place",
    description: "Store reports, medicines, symptoms, and appointments.",
  },
  {
    id: 2,
    icon: <Bot className="w-12 h-12 text-blue-500" />,
    iconBg: "bg-blue-50 border-blue-100",
    title: "AI that understands your health",
    description: "Ask questions. Explain reports. Track your progress.",
  },
  {
    id: 3,
    icon: <TrendingUp className="w-12 h-12 text-emerald-500" />,
    iconBg: "bg-emerald-50 border-emerald-100",
    title: "See your health improve",
    description: "Personal insights. Smart reminders. Health timeline.",
  }
];

export default function WelcomeStep({ onNext, onSkip }: WelcomeStepProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const handleNext = () => {
    if (current === SCREENS.length - 1) {
      onNext();
    } else {
      setDirection(1);
      setCurrent((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent((prev) => prev - 1);
    }
  };

  // Support swipe/slide simulation
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const activeScreen = SCREENS[current];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6 relative select-none">
      {/* Skip Button in Top-Right Corner */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onSkip}
          className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors py-1 px-3 rounded-full hover:bg-slate-200/50"
        >
          Skip
        </button>
      </div>

      {/* Main Content Carousel */}
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full">
        <div className="w-full relative overflow-hidden h-72 flex items-center justify-center">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
            >
              <div className={`w-24 h-24 rounded-full ${activeScreen.iconBg} border flex items-center justify-center mb-6 shadow-sm`}>
                {activeScreen.icon}
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 mb-2 font-display">
                {activeScreen.title}
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[280px]">
                {activeScreen.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="max-w-sm mx-auto w-full space-y-6 pb-8">
        {/* Dot Indicators */}
        <div className="flex justify-center space-x-2">
          {SCREENS.map((screen, idx) => (
            <button
              key={screen.id}
              onClick={() => {
                setDirection(idx > current ? 1 : -1);
                setCurrent(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-6 bg-blue-600' : 'w-2 bg-slate-200'
              }`}
              aria-label={`Go to screen ${idx + 1}`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-4">
          {current > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div className="w-10" /> // Spacer
          )}

          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
          >
            {current === SCREENS.length - 1 ? (
              <span>Get Started</span>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
