/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, UserPlus, ToggleLeft, ToggleRight, Phone, MessageSquare, Heart, CheckCircle } from 'lucide-react';
import { getTranslation, LanguageCode } from '../utils/translate';

interface CaregiverWidgetProps {
  language: LanguageCode;
}

export default function CaregiverWidget({ language }: CaregiverWidgetProps) {
  const [caregiverName, setCaregiverName] = useState('Rajesh Koyande');
  const [caregiverRelation, setCaregiverRelation] = useState('Father (Guardian)');
  const [caregiverPhone, setCaregiverPhone] = useState('+91 98765 43210');
  const [caregiverEmail, setCaregiverEmail] = useState('rajesh.koyande@gmail.com');
  
  // Toggle alerts
  const [smsOnMissedMed, setSmsOnMissedMed] = useState(true);
  const [smsOnAbnormalVitals, setSmsOnAbnormalVitals] = useState(true);
  const [biweeklyReport, setBiweeklyReport] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(caregiverName);
  const [tempRelation, setTempRelation] = useState(caregiverRelation);
  const [tempPhone, setTempPhone] = useState(caregiverPhone);
  const [tempEmail, setTempEmail] = useState(caregiverEmail);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setCaregiverName(tempName);
    setCaregiverRelation(tempRelation);
    setCaregiverPhone(tempPhone);
    setCaregiverEmail(tempEmail);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield size={18} className="text-indigo-600" />
          <h3 className="text-sm font-black text-slate-800">
            {getTranslation('caregiverConsole', language)}
          </h3>
        </div>
        <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
          {getTranslation('caregiverStatus', language)}
        </span>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-100 animate-fadeIn">
          <h4 className="text-xs font-black text-slate-700">Configure Caregiver Credentials</h4>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Caregiver Name</label>
            <input
              type="text"
              required
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-400 bg-white"
            />
          </div>
          <div>
            <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Relationship</label>
            <input
              type="text"
              required
              value={tempRelation}
              onChange={(e) => setTempRelation(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-400 bg-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Phone (SMS Alerts)</label>
              <input
                type="text"
                required
                value={tempPhone}
                onChange={(e) => setTempPhone(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-400 bg-white"
              />
            </div>
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Email</label>
              <input
                type="email"
                required
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-indigo-400 bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 bg-white border border-slate-200 text-slate-600 font-bold text-xs py-2 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 rounded-xl shadow-xs"
            >
              Save Caregiver
            </button>
          </div>
        </form>
      ) : (
        /* Display Current Active Caregiver Card */
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-bold text-base">
                👨‍💼
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">{caregiverName}</h4>
                <p className="text-[10px] text-indigo-600 font-bold">{caregiverRelation}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setTempName(caregiverName);
                setTempRelation(caregiverRelation);
                setTempPhone(caregiverPhone);
                setTempEmail(caregiverEmail);
                setIsEditing(true);
              }}
              className="text-[10px] text-slate-500 hover:text-indigo-600 font-bold underline cursor-pointer"
            >
              Edit Contact
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold font-mono bg-white p-2 rounded-xl border border-slate-100">
            <div className="flex items-center gap-1">
              <Phone size={10} className="text-slate-400" /> {caregiverPhone}
            </div>
            <div className="flex items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
              ✉️ {caregiverEmail}
            </div>
          </div>
        </div>
      )}

      {/* Permissions toggles & Alert controls */}
      <div className="space-y-3 pt-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">SMS Alert Routing & Privacy Permissions</h4>
        
        <div className="space-y-2 text-xs">
          {/* Toggle 1 */}
          <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">
            <div>
              <p className="font-bold text-slate-800 text-[11px]">Instant SMS on Missed Meds</p>
              <p className="text-[9px] text-slate-400 font-medium">Triggers SMS if doses are unlogged after 2 hours</p>
            </div>
            <button
              onClick={() => setSmsOnMissedMed(!smsOnMissedMed)}
              className="text-indigo-600 focus:outline-hidden cursor-pointer"
            >
              {smsOnMissedMed ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">
            <div>
              <p className="font-bold text-slate-800 text-[11px]">Vitals Anomalies Alerts</p>
              <p className="text-[9px] text-slate-400 font-medium">Alerts Rajesh if Blood sugar or pressure thresholds spike</p>
            </div>
            <button
              onClick={() => setSmsOnAbnormalVitals(!smsOnAbnormalVitals)}
              className="text-indigo-600 focus:outline-hidden cursor-pointer"
            >
              {smsOnAbnormalVitals ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-slate-300" />}
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/60">
            <div>
              <p className="font-bold text-slate-800 text-[11px]">Bi-weekly Compliance PDF Digest</p>
              <p className="text-[9px] text-slate-400 font-medium">Auto-emails analytical dosage spreadsheets</p>
            </div>
            <button
              onClick={() => setBiweeklyReport(!biweeklyReport)}
              className="text-indigo-600 focus:outline-hidden cursor-pointer"
            >
              {biweeklyReport ? <ToggleRight size={26} /> : <ToggleLeft size={26} className="text-slate-300" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-2xl flex items-start gap-2.5">
        <Heart className="text-indigo-600 shrink-0 mt-0.5" size={14} />
        <p className="text-[10px] text-indigo-900 leading-relaxed font-semibold">
          Caregiver Safety net is active. If you encounter emergency warnings, the system will dispatch coordinate details to {caregiverName} automatically.
        </p>
      </div>
    </div>
  );
}
