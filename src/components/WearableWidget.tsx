/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, CheckCircle, Activity, Heart, Flame, ShieldCheck } from 'lucide-react';
import { getTranslation, LanguageCode } from '../utils/translate';

interface WearableWidgetProps {
  language: LanguageCode;
  onUpdateTrackers: (water?: number, exercise?: number, sleep?: number) => void;
}

export default function WearableWidget({ language, onUpdateTrackers }: WearableWidgetProps) {
  const [device, setDevice] = useState<'fitbit' | 'garmin' | 'apple' | 'google'>('fitbit');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'completed'>('idle');
  const [steps, setSteps] = useState(6234);
  const [heartRate, setHeartRate] = useState(72);
  const [calories, setCalories] = useState(1480);
  const [lastSync, setLastSync] = useState('2 hours ago');

  // Simulate active heart rate fluctuation
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartRate(prev => {
        const diff = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + diff;
        return Math.max(60, Math.min(next, 95));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSync = () => {
    setSyncStatus('syncing');
    
    // Simulate API loading and data transfer
    setTimeout(() => {
      const generatedSteps = Math.floor(Math.random() * 3000) + 7500; // 7.5k to 10.5k
      const generatedSleep = parseFloat((6.5 + Math.random() * 2).toFixed(1)); // 6.5 to 8.5
      const generatedCalories = Math.floor(generatedSteps * 0.04) + 1200;

      setSteps(generatedSteps);
      setCalories(generatedCalories);
      setSyncStatus('completed');
      setLastSync('Just now');

      // Propagate sleep hours and active mins back to App state tracker
      const activeMins = Math.floor(generatedSteps / 110);
      onUpdateTrackers(undefined, activeMins, generatedSleep);

      // Return to idle after a few seconds
      setTimeout(() => {
        setSyncStatus('idle');
      }, 4000);
    }, 2500);
  };

  const devices = [
    { id: 'fitbit', name: 'Fitbit Sense 2', icon: '🟢', color: 'from-teal-500 to-emerald-600' },
    { id: 'garmin', name: 'Garmin Venu 3', icon: '🔵', color: 'from-blue-600 to-indigo-700' },
    { id: 'apple', name: 'Apple Watch Series 9', icon: '🔴', color: 'from-rose-500 to-pink-600' },
    { id: 'google', name: 'Google Pixel Watch', icon: '🟡', color: 'from-amber-500 to-orange-600' },
  ];

  const currentDeviceObj = devices.find(d => d.id === device) || devices[0];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity size={18} className="text-blue-600" />
          <h3 className="text-sm font-black text-slate-800">
            {getTranslation('wearableTitle', language)}
          </h3>
        </div>
        <div className="text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
          Live Connection
        </div>
      </div>

      {/* Device Selector */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-50 p-1 rounded-xl">
        {devices.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              if (syncStatus === 'syncing') return;
              setDevice(d.id as any);
              setLastSync('Connected');
            }}
            className={`py-1.5 text-center rounded-lg transition-all cursor-pointer ${
              device === d.id 
                ? 'bg-white shadow-3xs text-xs font-black text-slate-800 border border-slate-100' 
                : 'text-[10px] font-bold text-slate-400 hover:text-slate-600'
            }`}
          >
            <span className="mr-1">{d.icon}</span>
            <span className="hidden xs:inline">{d.id.charAt(0).toUpperCase() + d.id.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* Connected Device Status Card */}
      <div className={`p-4 rounded-2xl bg-gradient-to-r ${currentDeviceObj.color} text-white relative overflow-hidden shadow-xs`}>
        <div className="absolute top-0 right-0 translate-x-3 -translate-y-3 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[9px] font-bold tracking-wider text-white/85 uppercase">CONNECTED WEARABLE</p>
            <h4 className="text-sm font-extrabold tracking-tight mt-0.5">{currentDeviceObj.name}</h4>
          </div>
          <button
            onClick={handleSync}
            disabled={syncStatus === 'syncing'}
            className="bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {syncStatus === 'syncing' ? (
              <>
                <RefreshCw size={11} className="animate-spin" />
                <span>{getTranslation('syncing', language)}</span>
              </>
            ) : syncStatus === 'completed' ? (
              <>
                <CheckCircle size={11} />
                <span>{getTranslation('synced', language)}</span>
              </>
            ) : (
              <>
                <RefreshCw size={11} />
                <span>{getTranslation('syncNow', language)}</span>
              </>
            )}
          </button>
        </div>

        {/* Sync telemetry metrics */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/15">
          <div className="text-center">
            <span className="text-[9px] text-white/80 font-bold block">DAILY STEPS</span>
            <span className="text-sm font-black tracking-tight">{steps.toLocaleString()}</span>
            <span className="text-[8px] text-white/70 block mt-0.5">Goal: 10k</span>
          </div>
          <div className="text-center border-x border-white/15">
            <span className="text-[9px] text-white/80 font-bold block flex items-center justify-center gap-0.5">
              <Heart size={8} className="text-rose-300 animate-pulse" /> HEART RATE
            </span>
            <span className="text-sm font-black tracking-tight">{heartRate} <span className="text-[8px] font-normal">BPM</span></span>
            <span className="text-[8px] text-white/70 block mt-0.5">Resting: 64</span>
          </div>
          <div className="text-center">
            <span className="text-[9px] text-white/80 font-bold block">CALORIES</span>
            <span className="text-sm font-black tracking-tight">{calories} <span className="text-[8px] font-normal">Kcal</span></span>
            <span className="text-[8px] text-white/70 block mt-0.5">Burned</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1">
        <span className="flex items-center gap-1 text-slate-500">
          <ShieldCheck size={12} className="text-emerald-500" />
          Secure OAuth 2.0 Client Handshake
        </span>
        <span>Last synced: {lastSync}</span>
      </div>
    </div>
  );
}
