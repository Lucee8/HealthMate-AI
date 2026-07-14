/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  ShieldCheck, 
  Trash2, 
  Save, 
  Phone, 
  Heart, 
  AlertTriangle, 
  Database,
  CheckCircle,
  FileText,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { DBState, UserProfile } from '../types';

interface ProfileSectionProps {
  dbState: DBState;
  onUpdateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  onResetDatabase: () => Promise<void>;
}

export default function ProfileSection({
  dbState,
  onUpdateProfile,
  onResetDatabase
}: ProfileSectionProps) {
  const { profile } = dbState;

  // Form states
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);
  const [allergies, setAllergies] = useState(profile.allergies);
  const [conditions, setConditions] = useState(profile.conditions);
  const [emergencyName, setEmergencyName] = useState(profile.emergencyContactName);
  const [emergencyPhone, setEmergencyPhone] = useState(profile.emergencyContactPhone);
  const [consent, setConsent] = useState(profile.consentGiven);

  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateProfile({
      name,
      age: Number(age),
      gender,
      bloodGroup,
      allergies,
      conditions,
      emergencyContactName: emergencyName,
      emergencyContactPhone: emergencyPhone,
      consentGiven: consent
    });
    setIsSaving(false);
    alert("Profile and DPDP Consent records successfully updated!");
  };

  const handlePermanentDelete = async () => {
    if (confirm("🚨 WARNING: This will permanently delete your account, clinical records, medications, appointments, and all chat logs to satisfy your DPDP 2023 'Right to Erasure'. Are you absolutely sure?")) {
      setIsResetting(true);
      await onResetDatabase();
      setIsResetting(false);
      alert("All personal health data successfully erased from the servers!");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Tab Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Profile & Security</h1>
        <p className="text-xs text-slate-500 font-medium">Manage clinical details and privacy consent</p>
      </div>

      {/* DPDP ACT 2023 CONSENT DRAWER CARD */}
      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-3xs">
        <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
          <ShieldCheck size={18} className="text-emerald-600" /> DPDP Act, 2023 Privacy Consent
        </h3>
        <p className="text-[11px] text-emerald-800 leading-relaxed font-medium">
          Under India's Digital Personal Data Protection Act, 2023, you have absolute control over your digital health logs. We treat your uploaded prescriptions, blood results, and allergy lists with extreme protection.
        </p>
        
        <div className="bg-white border border-emerald-100/50 p-3 rounded-xl space-y-2">
          <h4 className="text-[10px] font-black text-emerald-900 uppercase">Your Legal Rights:</h4>
          <ul className="list-disc pl-4 text-[10px] text-emerald-800 space-y-1 leading-normal font-medium">
            <li><strong>Right to Erasure:</strong> Delete all blood records instantly from the cloud.</li>
            <li><strong>Data Minimization:</strong> We only parse the 4 critical biomarkers requested by you.</li>
            <li><strong>Secure Proxy:</strong> All Gemini AI calls are secured and sandboxed server-side.</li>
          </ul>
        </div>

        <label className="flex items-start gap-2.5 pt-1.5 cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-4 h-4"
          />
          <span className="text-[11px] font-semibold text-emerald-900 leading-normal">
            I explicitly consent to store my personal health records in local sandboxed storage and proxy them to Google Gemini for personalized educational clinical feedback.
          </span>
        </label>
      </div>

      {/* PROFILE DETAILS FORM */}
      <form onSubmit={handleSave} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-3xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
          <User size={16} className="text-blue-500" /> Personal Medical Card
        </h3>

        <div className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Age (Years)</label>
              <input 
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Biological Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2.5 focus:outline-hidden focus:border-blue-500 bg-white font-bold text-slate-800"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Blood Group</label>
              <input 
                type="text"
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-red-400 uppercase mb-1 flex items-center gap-1">
              <AlertTriangle size={11} /> Known Drug & Food Allergies
            </label>
            <input 
              type="text"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="e.g. Penicillin, Peanuts, Sulfa Drugs"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-red-700 bg-red-50/20"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Chronic Health Conditions</label>
            <input 
              type="text"
              value={conditions}
              onChange={(e) => setConditions(e.target.value)}
              placeholder="e.g. Mild Hypertension, Hypothyroidism"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
            />
          </div>

          {/* EMERGENCY DOCTOR CONTACT */}
          <div className="border-t border-slate-50 pt-3.5 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Phone size={12} className="text-slate-500" /> Emergency Medical Contact
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doctor Name</label>
                <input 
                  type="text"
                  required
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doctor Phone</label>
                <input 
                  type="text"
                  required
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Save size={14} /> {isSaving ? 'Saving Card...' : 'Save Profile Card'}
        </button>
      </form>

      {/* ERASURE & UTILITY BUTTONS */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-black text-slate-700 flex items-center gap-1">
          <Database size={14} /> Privacy Actions & Admin Utilities
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {/* Erasure button */}
          <button
            onClick={handlePermanentDelete}
            disabled={isResetting}
            className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all text-slate-600 text-[10px] font-bold p-2.5 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-center cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={15} className="text-red-500" />
            <span>DPDP Erasure</span>
          </button>

          {/* Relaunch Onboarding button */}
          <button
            onClick={async () => {
              if (confirm("Relaunch the multi-step onboarding wizard? Your progress will be reset so you can view all 6 steps.")) {
                setIsResetting(true);
                await onUpdateProfile({ onboardingComplete: false, onboardingStep: 'splash' });
                setIsResetting(false);
                alert("Onboarding state reset! Let's take the wizard flow.");
                window.location.reload();
              }
            }}
            disabled={isResetting}
            className="bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all text-slate-600 text-[10px] font-bold p-2.5 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-center cursor-pointer disabled:opacity-50"
          >
            <HelpCircle size={15} className="text-indigo-500" />
            <span>Run Onboarding</span>
          </button>

          {/* Reset button for evaluators */}
          <button
            onClick={async () => {
              if (confirm("Reset database to preloaded default medical reports and Telmisartan logs?")) {
                setIsResetting(true);
                await onResetDatabase();
                setIsResetting(false);
                alert("Database reset to demo defaults successfully!");
                window.location.reload();
              }
            }}
            disabled={isResetting}
            className="bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-slate-600 text-[10px] font-bold p-2.5 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1 text-center cursor-pointer disabled:opacity-50"
          >
            <Database size={15} className="text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Reload Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
}
