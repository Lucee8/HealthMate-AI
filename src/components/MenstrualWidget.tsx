/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Heart, ShieldAlert, Sparkles, CheckCircle, Droplet } from 'lucide-react';
import { getTranslation, LanguageCode } from '../utils/translate';

interface MenstrualWidgetProps {
  language: LanguageCode;
}

export default function MenstrualWidget({ language }: MenstrualWidgetProps) {
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [cycleDay, setCycleDay] = useState(14); // mid-cycle (ovulation/fertile window!)
  const [symptoms, setSymptoms] = useState<string[]>(['Mild cramps', 'High energy']);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newSymptom, setNewSymptom] = useState('');

  // Pre-packaged symptom checklists
  const presetSymptoms = ['Cramps', 'Headache', 'Bloating', 'Mood swings', 'Fatigue', 'Acne', 'Nausea'];

  const toggleSymptom = (sym: string) => {
    if (symptoms.includes(sym)) {
      setSymptoms(symptoms.filter(s => s !== sym));
    } else {
      setSymptoms([...symptoms, sym]);
    }
  };

  // Phases math
  const getPhaseName = (day: number) => {
    if (day <= periodDuration) return { name: 'Menstruation Phase', color: 'text-rose-500 bg-rose-50 border-rose-100', emoji: '🩸' };
    if (day <= 11) return { name: 'Follicular Phase', color: 'text-amber-600 bg-amber-50 border-amber-100', emoji: '🌱' };
    if (day <= 16) return { name: 'Ovulatory Phase (Fertile Window)', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', emoji: '🌸' };
    return { name: 'Luteal Phase', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', emoji: '🍁' };
  };

  const phase = getPhaseName(cycleDay);

  // Next period date helper calculation
  const getDaysUntilNext = () => {
    const remaining = cycleLength - cycleDay;
    return remaining;
  };

  const daysRemaining = getDaysUntilNext();

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Droplet size={18} className="text-rose-500" />
          <h3 className="text-sm font-black text-slate-800">
            {getTranslation('menstrualTracker', language)}
          </h3>
        </div>
        <button
          onClick={() => setShowLogModal(!showLogModal)}
          className="text-[10px] bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors"
        >
          {showLogModal ? 'Close Logger' : '+ Log Symptoms'}
        </button>
      </div>

      {/* Cycle Progress Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
            {getTranslation('cycleDay', language)} {cycleDay} / {cycleLength}
          </span>
          <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full ${phase.color}`}>
            {phase.emoji} {phase.name}
          </span>
        </div>

        {/* Dynamic tracker progress slider */}
        <div className="space-y-1">
          <input
            type="range"
            min="1"
            max={cycleLength}
            value={cycleDay}
            onChange={(e) => setCycleDay(parseInt(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-200 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[8px] font-bold text-slate-400 px-1 uppercase tracking-widest">
            <span>Period</span>
            <span>Follicular</span>
            <span>Ovulation</span>
            <span>Luteal</span>
          </div>
        </div>
      </div>

      {/* Ovulation prediction and cycle summary */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-rose-50/40 border border-rose-100/50 p-3.5 rounded-2xl">
          <p className="text-[9px] font-bold tracking-wider text-rose-500 uppercase">FERTILIZATION PROBABILITY</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-rose-950">
              {cycleDay >= 12 && cycleDay <= 15 ? 'HIGH' : 'LOW'}
            </span>
            <span className="text-[10px] font-bold text-rose-600/80">
              {cycleDay >= 12 && cycleDay <= 15 ? '(Peak fertility)' : '(Safe window)'}
            </span>
          </div>
          <p className="text-[10px] text-rose-800 leading-relaxed mt-1">
            Ovulation is estimated in {14 - cycleDay > 0 ? `${14 - cycleDay} days` : cycleDay === 14 ? 'today!' : 'completed'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex flex-col justify-between">
          <div>
            <p className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">NEXT CYCLE STARTS</p>
            <div className="text-lg font-black text-slate-800 mt-0.5">In {daysRemaining} days</div>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">Predicted on: July 14, 2026</p>
        </div>
      </div>

      {/* Symptom Logger Form Area */}
      {showLogModal ? (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/80 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-slate-800">Select Symptoms Experienced Today:</h4>
          <div className="flex flex-wrap gap-1.5">
            {presetSymptoms.map((sym) => {
              const active = symptoms.includes(sym);
              return (
                <button
                  key={sym}
                  type="button"
                  onClick={() => toggleSymptom(sym)}
                  className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    active 
                      ? 'bg-rose-500 border-rose-600 text-white shadow-3xs' 
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {sym}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1.5">
            <input
              type="text"
              value={newSymptom}
              onChange={(e) => setNewSymptom(e.target.value)}
              placeholder="Custom symptom..."
              className="flex-1 text-xs border border-slate-200 rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:border-rose-300 bg-white"
            />
            <button
              type="button"
              onClick={() => {
                if (newSymptom.trim()) {
                  setSymptoms([...symptoms, newSymptom.trim()]);
                  setNewSymptom('');
                }
              }}
              className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        /* Display logged symptoms */
        symptoms.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 px-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Log:</span>
            {symptoms.map((s, i) => (
              <span 
                key={i} 
                className="text-[10px] font-bold text-rose-800 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-lg flex items-center gap-1"
              >
                <Heart size={8} className="text-rose-500 fill-rose-500" /> {s}
              </span>
            ))}
          </div>
        )
      )}

      {/* PMS warnings & reminders */}
      <div className="bg-emerald-50/50 border border-emerald-100/80 p-3 rounded-2xl flex items-start gap-2.5">
        <Sparkles className="text-emerald-600 shrink-0 mt-0.5" size={14} />
        <p className="text-[10px] text-emerald-900 leading-relaxed font-semibold">
          AI Suggestion: Standard hydration (💧 2.0L+) and low sodium during your fertile window support stable biomarker loads and pre-PMS symptom prevention.
        </p>
      </div>
    </div>
  );
}
