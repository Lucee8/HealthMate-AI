/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  TrendingUp, 
  Plus, 
  Minus, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Upload, 
  MessageSquare, 
  Pill, 
  AlertTriangle, 
  ShieldCheck,
  User,
  Activity,
  Bell
} from 'lucide-react';
import { DBState, Medication, Appointment } from '../types';

// Import newly created widgets
import WearableWidget from './WearableWidget';
import MenstrualWidget from './MenstrualWidget';
import CaregiverWidget from './CaregiverWidget';
import AdminAnalyticsWidget from './AdminAnalyticsWidget';

interface HomeSectionProps {
  dbState: DBState;
  onNavigate: (tab: 'home' | 'chat' | 'records' | 'vitals' | 'meds' | 'profile') => void;
  onUpdateTrackers: (water?: number, exercise?: number, sleep?: number) => void;
  onLogMedication: (medId: string, date: string, status: 'taken' | 'missed') => void;
}

export default function HomeSection({ 
  dbState, 
  onNavigate, 
  onUpdateTrackers, 
  onLogMedication 
}: HomeSectionProps) {
  const { profile, medications, appointments, waterLogged, exerciseLogged, sleepLogged } = dbState;
  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate dynamic Health Score
  // Base is 70.
  // +10 if water goal (2L) is met. +10 if exercise goal (60m) is met. +10 if sleep goal (7h) is met.
  // +10 if all morning medications are logged as taken.
  const calculateHealthScore = () => {
    let score = 65;
    if (waterLogged >= 2.0) score += 10;
    else if (waterLogged > 0) score += Math.floor((waterLogged / 2.0) * 8);

    if (exerciseLogged >= 60) score += 10;
    else if (exerciseLogged > 0) score += Math.floor((exerciseLogged / 60) * 8);

    if (sleepLogged >= 7) score += 10;
    else if (sleepLogged > 0) score += Math.floor((sleepLogged / 7) * 8);

    // Medication compliance
    const todayMeds = medications.filter(m => m.times.includes("Morning"));
    if (todayMeds.length > 0) {
      const takenCount = todayMeds.filter(m => m.history[todayStr] === 'taken').length;
      score += Math.floor((takenCount / todayMeds.length) * 5);
    } else {
      score += 5; // bonus if no meds
    }

    return Math.min(score, 100);
  };

  const score = calculateHealthScore();
  const nextAppt = appointments.length > 0 ? appointments[0] : null;

  // Find medication due today
  const pendingMeds = medications.filter(m => {
    // Check if not logged yet today
    return !m.history[todayStr];
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Dynamic greeting based on consent */}
      {!profile.consentGiven && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-amber-800">DPDP Consent Pending</p>
            <p className="text-xs text-amber-700 mt-1">
              To store records and get medical AI advice, please review and accept our Privacy Consent Agreement.
            </p>
            <button 
              onClick={() => onNavigate('profile')}
              className="text-xs font-semibold text-amber-800 underline mt-2 hover:text-amber-900 cursor-pointer"
            >
              Go to Consent Settings
            </button>
          </div>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">
            Good Afternoon, {profile.name || "Bhavesh"}
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">Ready to optimize your health today?</p>
        </div>
        <div 
          onClick={() => onNavigate('profile')} 
          className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center cursor-pointer shadow-xs hover:bg-blue-100 transition-colors"
        >
          <User className="text-blue-600" size={20} />
        </div>
      </div>

      {/* Smart Care Alert & Reminders (Smart Notifications) */}
      <div className="bg-amber-50/70 border border-amber-200/50 p-4 rounded-3xl flex items-start gap-3 shadow-3xs">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Bell className="text-amber-700" size={15} />
        </div>
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-amber-950">Active Smart Notifications</h4>
          <p className="text-[11px] text-amber-800 leading-relaxed font-semibold">
            {pendingMeds.length > 0 
              ? `You have ${pendingMeds.length} pending medication doses today. Keeping streaks intact supports high clinical compliance!`
              : "All scheduled medication dosages logged successfully. Your streak score is active & safe!"}
          </p>
        </div>
      </div>

      {/* Main Score Widget Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-4 left-4 bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Activity size={12} />
          Dynamic Score
        </div>
        
        {/* SVG Circular Progress */}
        <div className="relative w-40 h-40 mt-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="stroke-slate-100" 
              strokeWidth="8" 
              fill="transparent" 
            />
            {/* Active Circle with strokeDasharray */}
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="stroke-blue-600 transition-all duration-500 ease-out" 
              strokeWidth="8" 
              fill="transparent" 
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * score) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold text-slate-800">{score}</span>
            <span className="text-xs font-semibold text-emerald-600">
              {score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Care'}
            </span>
          </div>
        </div>

        <div className="mt-4 bg-emerald-50 text-emerald-800 text-xs font-semibold py-1.5 px-4 rounded-full flex items-center gap-1">
          <TrendingUp size={12} />
          Score is up 12% this week
        </div>
      </div>

      {/* AI Insights Block */}
      <div className="bg-emerald-50/50 rounded-3xl p-5 border border-emerald-100/60 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 text-emerald-100/50">
          <Sparkles size={80} />
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <Sparkles size={18} />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-emerald-900">AI Health Insights</h3>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-[85%]">
              {sleepLogged >= 7 
                ? "Your sleep quality improved by 18% this week. Keep up the 10 PM routine to stabilize morning blood pressure!" 
                : "Your sleep was slightly below 7h today. Taking Telmisartan on time in the morning will support stable cardiovascular load."}
            </p>
            <button 
              onClick={() => onNavigate('vitals')}
              className="text-xs font-semibold text-emerald-900 bg-white hover:bg-emerald-50 transition-colors border border-emerald-200/50 rounded-lg px-3 py-1.5 mt-2 shadow-2xs flex items-center gap-1 cursor-pointer"
            >
              View Trends <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Trackers Progress */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800">Today's Trackers</h2>
          <span className="text-xs text-slate-400">Tap to log</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Water Tracker */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water</span>
              <span className="text-xs bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">💧</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-800">{waterLogged.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">/ 2L</span></div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-blue-500 h-full transition-all duration-300" 
                  style={{ width: `${Math.min((waterLogged / 2) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button 
                onClick={() => onUpdateTrackers(Math.max(0, waterLogged - 0.25), undefined, undefined)}
                className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Minus size={12} />
              </button>
              <button 
                onClick={() => onUpdateTrackers(waterLogged + 0.25, undefined, undefined)}
                className="flex-1 bg-blue-50 border border-blue-100 hover:bg-blue-100 text-blue-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Exercise Tracker */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Exercise</span>
              <span className="text-xs bg-teal-50 text-teal-600 font-bold px-1.5 py-0.5 rounded">🏃‍♂️</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-800">{exerciseLogged} <span className="text-[10px] font-normal text-slate-400">/ 60m</span></div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-teal-500 h-full transition-all duration-300" 
                  style={{ width: `${Math.min((exerciseLogged / 60) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button 
                onClick={() => onUpdateTrackers(undefined, Math.max(0, exerciseLogged - 5), undefined)}
                className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Minus size={12} />
              </button>
              <button 
                onClick={() => onUpdateTrackers(undefined, exerciseLogged + 5, undefined)}
                className="flex-1 bg-teal-50 border border-teal-100 hover:bg-teal-100 text-teal-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Sleep Tracker */}
          <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-2xs flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sleep</span>
              <span className="text-xs bg-purple-50 text-purple-600 font-bold px-1.5 py-0.5 rounded">😴</span>
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-800">{sleepLogged.toFixed(1)} <span className="text-[10px] font-normal text-slate-400">/ 7h</span></div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-purple-500 h-full transition-all duration-300" 
                  style={{ width: `${Math.min((sleepLogged / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button 
                onClick={() => onUpdateTrackers(undefined, undefined, Math.max(0, sleepLogged - 0.5))}
                className="flex-1 bg-slate-50 border border-slate-100 hover:bg-slate-100 text-slate-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Minus size={12} />
              </button>
              <button 
                onClick={() => onUpdateTrackers(undefined, undefined, sleepLogged + 0.5)}
                className="flex-1 bg-purple-50 border border-purple-100 hover:bg-purple-100 text-purple-600 rounded-lg py-1 flex justify-center items-center cursor-pointer"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointment */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Upcoming</h2>
        {nextAppt ? (
          <div className="bg-blue-600 text-white rounded-3xl p-5 shadow-md flex items-center justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10">
              <Calendar size={120} />
            </div>
            <div className="flex gap-3.5 items-center">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-lg">
                👩‍⚕️
              </div>
              <div>
                <h4 className="font-bold text-base">{nextAppt.doctorName}</h4>
                <p className="text-xs text-blue-100 font-medium">{nextAppt.specialty}</p>
                <p className="text-[10px] text-blue-200 mt-1 flex items-center gap-1">
                  <Clock size={10} /> {nextAppt.clinicName}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xl font-black">{nextAppt.time}</div>
              <div className="text-[10px] font-bold tracking-wider uppercase text-blue-200 mt-0.5 bg-white/15 px-2 py-0.5 rounded-full">
                {nextAppt.date === todayStr ? 'TODAY' : nextAppt.date}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-3xl p-5 text-center text-slate-400">
            <Calendar className="mx-auto text-slate-300 mb-1" size={24} />
            <p className="text-xs font-semibold">No appointments scheduled</p>
            <button 
              onClick={() => onNavigate('meds')} // redirect to schedule tab if applicable
              className="text-xs text-blue-600 font-bold underline mt-1 hover:text-blue-700 cursor-pointer"
            >
              Add Clinic Visit
            </button>
          </div>
        )}
      </div>

      {/* Wearable Device Synced Vitals Data */}
      <WearableWidget 
        language={((profile as any).language || 'en') as any} 
        onUpdateTrackers={onUpdateTrackers} 
      />

      {/* Menstrual Health & Ovulation Cycle Tracker (Only for Female) */}
      {profile.gender?.toLowerCase() === 'female' && (
        <MenstrualWidget language={((profile as any).language || 'en') as any} />
      )}

      {/* Caregiver SMS alerts & Safety controls */}
      <CaregiverWidget language={((profile as any).language || 'en') as any} />

      {/* Clinical Telemetry & Database JSON Engine Console */}
      <AdminAnalyticsWidget dbState={dbState} />

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-800">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onNavigate('records')}
            className="bg-white hover:bg-slate-50 transition-colors p-5 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-28 shadow-3xs cursor-pointer"
          >
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <Upload size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Upload Report</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Parse labs with AI</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('chat')}
            className="bg-white hover:bg-slate-50 transition-colors p-5 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-28 shadow-3xs cursor-pointer"
          >
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <MessageSquare size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Ask AI</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Instant medical Q&A</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('meds')}
            className="bg-white hover:bg-slate-50 transition-colors p-5 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-28 shadow-3xs cursor-pointer"
          >
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <Pill size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Add Medicine</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure schedule</p>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('vitals')}
            className="bg-white hover:bg-slate-50 transition-colors p-5 border border-slate-100 rounded-2xl text-left flex flex-col justify-between h-28 shadow-3xs cursor-pointer"
          >
            <div className="p-2.5 bg-pink-50 text-pink-600 rounded-xl w-10 h-10 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Blood Analysis</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Track 4 biomarkers</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
