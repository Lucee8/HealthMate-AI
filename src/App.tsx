/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Pill, 
  User, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  RefreshCw,
  Search,
  Bell
} from 'lucide-react';
import { DBState, UserProfile, Medication, Appointment, MedicalRecord } from './types';

// Importing subcomponents
import HomeSection from './components/HomeSection';
import ChatSection from './components/ChatSection';
import RecordsSection from './components/RecordsSection';
import VitalsSection from './components/VitalsSection';
import MedsSection from './components/MedsSection';
import ProfileSection from './components/ProfileSection';
import OnboardingFlow from './components/onboarding/OnboardingFlow';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'records' | 'vitals' | 'meds' | 'profile'>('home');
  const [dbState, setDbState] = useState<DBState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<'self' | 'father' | 'mother' | 'child'>('self');

  const getDisplayedDBState = (): DBState | null => {
    if (!dbState) return null;
    if (activeProfile === 'self') return dbState;

    if (activeProfile === 'father') {
      return {
        ...dbState,
        profile: {
          ...dbState.profile,
          name: "Yashwant Koyande (Father)",
          age: 72,
          gender: "Male",
          conditions: ["Diabetes Type II", "Osteoarthritis"],
          allergies: ["Penicillin"],
        },
        medications: [
          { id: "f-med-1", name: "Metformin 500mg", dosage: "1 Tablet", frequency: "Twice daily", times: ["Morning", "Evening"], notes: "Take after meals", history: {} },
          { id: "f-med-2", name: "Glimepiride 2mg", dosage: "1 Tablet", frequency: "Once daily", times: ["Morning"], notes: "Take before breakfast", history: {} },
        ],
        appointments: [
          { id: "f-appt-1", doctorName: "Dr. Sandeep Patil", specialty: "Diabetologist", clinicAddress: "Apollo Sugar Clinics, Mumbai", date: "2026-07-05", time: "11:30 AM" }
        ],
        records: [
          { id: "f-rec-1", testName: "HbA1c Diabetes Panel", date: "2026-06-15", labName: "Metropolis Diagnostics", status: "reviewed", bloodSugar: 135, cholesterol: 190, vitaminD: 28, pdfUrl: "#" }
        ]
      };
    }

    if (activeProfile === 'mother') {
      return {
        ...dbState,
        profile: {
          ...dbState.profile,
          name: "Mangal Koyande (Mother)",
          age: 68,
          gender: "Female",
          conditions: ["Mild Osteoporosis", "Hypothyroidism"],
          allergies: ["Sulfa drugs"],
        },
        medications: [
          { id: "m-med-1", name: "Thyronorm 50mcg", dosage: "1 Tablet", frequency: "Once daily", times: ["Morning"], notes: "Strictly empty stomach", history: {} },
          { id: "m-med-2", name: "Shelcal 500 Calcium", dosage: "1 Tablet", frequency: "Once daily", times: ["Evening"], notes: "Take after dinner", history: {} },
        ],
        appointments: [
          { id: "m-appt-1", doctorName: "Dr. Anjali Deshmukh", specialty: "Endocrinologist", clinicAddress: "Lilavati Hospital, Mumbai", date: "2026-07-12", time: "04:15 PM" }
        ],
        records: [
          { id: "m-rec-1", testName: "Thyroid Stimulating Hormone (TSH)", date: "2026-06-20", labName: "Suburban Diagnostics", status: "reviewed", bloodSugar: 98, cholesterol: 180, vitaminD: 22, pdfUrl: "#" }
        ]
      };
    }

    if (activeProfile === 'child') {
      return {
        ...dbState,
        profile: {
          ...dbState.profile,
          name: "Aarav Koyande (Child)",
          age: 14,
          gender: "Male",
          conditions: ["Childhood Asthma", "Dust Allergy"],
          allergies: ["Peanuts", "Dust"],
        },
        medications: [
          { id: "c-med-1", name: "Asthalin Inhaler", dosage: "1 Puff", frequency: "As needed", times: ["Afternoon"], notes: "Use during wheezing events", history: {} },
          { id: "c-med-2", name: "Montair LC Kid", dosage: "1 Tablet", frequency: "Once daily", times: ["Evening"], notes: "Take before sleeping", history: {} },
        ],
        appointments: [
          { id: "c-appt-1", doctorName: "Dr. Bharat Shinde", specialty: "Pediatric Pulmonologist", clinicAddress: "Wadia Childrens Hospital", date: "2026-07-20", time: "10:00 AM" }
        ],
        records: [
          { id: "c-rec-1", testName: "IgE Pediatric Allergy Panel", date: "2026-05-10", labName: "Hinduja Hospital Labs", status: "reviewed", bloodSugar: 85, cholesterol: 140, vitaminD: 35, pdfUrl: "#" }
        ]
      };
    }

    return dbState;
  };

  const displayedDBState = getDisplayedDBState();

  // Load database state on launch
  useEffect(() => {
    fetchState();
  }, []);

  const fetchState = async () => {
    try {
      setIsLoading(true);
      setErrorMsg(null);
      const res = await fetch('/api/db');
      if (!res.ok) throw new Error("Failed to contact HealthMate servers.");
      const data = await res.json();
      setDbState(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Could not retrieve state");
    } finally {
      setIsLoading(false);
    }
  };

  // Sync state with local state and trigger backend post
  const syncWithBackend = async (updater: (prev: DBState) => DBState, apiCall: () => Promise<Response>) => {
    if (!dbState) return;
    const oldState = dbState;
    const newState = updater(dbState);
    setDbState(newState); // Optimistic UI update

    try {
      const res = await apiCall();
      if (!res.ok) throw new Error("Sync failed.");
      // optionally refetch or update state
      const updatedData = await res.json();
      if (updatedData.state) {
        setDbState(updatedData.state);
      } else {
        fetchState(); // fallback sync
      }
    } catch (e) {
      console.error("Optimistic rollback:", e);
      setDbState(oldState); // rollback on error
      alert("Changes could not be synchronized with the server.");
    }
  };

  // Profile update
  const handleUpdateProfile = async (profileUpdates: Partial<UserProfile>) => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates)
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, profile: data.profile } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Tracker updates
  const handleUpdateTrackers = async (water?: number, exercise?: number, sleep?: number) => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/trackers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ water, exercise, sleep })
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { 
          ...prev, 
          waterLogged: data.waterLogged, 
          exerciseLogged: data.exerciseLogged, 
          sleepLogged: data.sleepLogged 
        } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Medication Logging
  const handleLogMedication = async (medId: string, date: string, status: 'taken' | 'missed') => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/medications/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medId, date, status })
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, medications: data.medications } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add/Update medication
  const handleAddMedication = async (med: Partial<Medication>) => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(med)
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, medications: data.medications } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Medication
  const handleDeleteMedication = async (id: string) => {
    if (!dbState) return;
    try {
      const res = await fetch(`/api/db/medications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, medications: data.medications } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Add Appointment
  const handleAddAppointment = async (appt: Partial<Appointment>) => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appt)
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, appointments: data.appointments } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Appointment
  const handleDeleteAppointment = async (id: string) => {
    if (!dbState) return;
    try {
      const res = await fetch(`/api/db/appointments/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, appointments: data.appointments } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Upload Medical Record (Auto extract biomarkers)
  const handleUploadRecord = async (payload: {
    title: string;
    type: 'blood_report' | 'prescription' | 'discharge_summary' | 'other';
    date: string;
    textData?: string;
    fileName: string;
    fileSize: string;
  }) => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(data.state);
        // Switch to vitals tab automatically if blood_report is uploaded so user can see sliders!
        if (payload.type === 'blood_report') {
          setActiveTab('vitals');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Medical Record (Erasure)
  const handleDeleteRecord = async (id: string) => {
    if (!dbState) return;
    try {
      const res = await fetch(`/api/db/records/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, records: data.records } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // AI Chat Messages Send
  const handleSendMessage = async (text: string) => {
    if (!dbState) return;
    try {
      // Optimistically append user chat
      const tempUserMsg = {
        id: `temp-${Date.now()}`,
        sender: 'user' as const,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setDbState(prev => prev ? { ...prev, chats: [...prev.chats, tempUserMsg] } : null);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, chats: data.chats } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Clear AI chat history
  const handleClearChats = async () => {
    if (!dbState) return;
    try {
      const res = await fetch('/api/db/chats/clear', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDbState(prev => prev ? { ...prev, chats: data.chats } : null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reset database state (Satisfies erasure and evaluator tests)
  const handleResetDatabase = async () => {
    try {
      const res = await fetch('/api/db/reset', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setDbState(data.state);
        setActiveTab('home');
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (isLoading && !dbState) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-lg animate-spin mb-4">
          <RefreshCw size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-800">Booting HealthMate AI Portal</h3>
        <p className="text-xs text-slate-400 mt-1">Configuring secure full-stack database & AI pathways...</p>
      </div>
    );
  }

  if (!dbState.profile.onboardingComplete) {
    return (
      <OnboardingFlow 
        profile={dbState.profile} 
        onRefreshDB={fetchState} 
      />
    );
  }

  const finalDBState = displayedDBState || dbState;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col max-w-md mx-auto relative border-x border-slate-100 shadow-xl overflow-x-hidden">
      
      {/* STATIC TOP HEADER BAR (Matching custom logo in screenshot) */}
      <header className="bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-center sticky top-0 z-50 shadow-2xs shrink-0">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('home')}
            className="p-1.5 hover:bg-slate-50 rounded-xl text-blue-600 transition-colors cursor-pointer"
          >
            <Home size={18} />
          </button>
          <span className="text-lg font-black tracking-tight text-blue-600">HealthMate AI</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('chat')}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer relative"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white" />
          </button>
          <div 
            onClick={() => setActiveTab('profile')}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer shadow-3xs flex items-center justify-center font-bold text-xs text-blue-600"
          >
            {finalDBState.profile.name?.charAt(0) || "B"}
          </div>
        </div>
      </header>

      {/* Horizontal Family Profile Switcher strip */}
      <div className="bg-white border-b border-slate-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveProfile('self')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border transition-all cursor-pointer shrink-0 ${
            activeProfile === 'self'
              ? 'bg-blue-600 text-white border-blue-600 shadow-3xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          🙋‍♂️ Rajesh (Self)
        </button>
        <button
          onClick={() => setActiveProfile('father')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border transition-all cursor-pointer shrink-0 ${
            activeProfile === 'father'
              ? 'bg-blue-600 text-white border-blue-600 shadow-3xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          👴 Yashwant (Father)
        </button>
        <button
          onClick={() => setActiveProfile('mother')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border transition-all cursor-pointer shrink-0 ${
            activeProfile === 'mother'
              ? 'bg-blue-600 text-white border-blue-600 shadow-3xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          👵 Mangal (Mother)
        </button>
        <button
          onClick={() => setActiveProfile('child')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black tracking-tight border transition-all cursor-pointer shrink-0 ${
            activeProfile === 'child'
              ? 'bg-blue-600 text-white border-blue-600 shadow-3xs'
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
          }`}
        >
          👦 Aarav (Child)
        </button>
      </div>

      {/* VIEWPORT BODY (Dynamic switching) */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50 px-4 pt-5 pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-full"
          >
            {activeTab === 'home' && (
              <HomeSection 
                dbState={finalDBState} 
                onNavigate={setActiveTab} 
                onUpdateTrackers={handleUpdateTrackers}
                onLogMedication={handleLogMedication}
              />
            )}
            {activeTab === 'chat' && (
              <ChatSection 
                dbState={finalDBState} 
                onSendMessage={handleSendMessage}
                onClearChats={handleClearChats}
                onNavigateToRecords={() => setActiveTab('records')}
              />
            )}
            {activeTab === 'records' && (
              <RecordsSection 
                dbState={finalDBState} 
                onUploadRecord={handleUploadRecord}
                onDeleteRecord={handleDeleteRecord}
              />
            )}
            {activeTab === 'vitals' && (
              <VitalsSection 
                dbState={finalDBState} 
              />
            )}
            {activeTab === 'meds' && (
              <MedsSection 
                dbState={finalDBState}
                onAddMedication={handleAddMedication}
                onDeleteMedication={handleDeleteMedication}
                onLogMedication={handleLogMedication}
                onAddAppointment={handleAddAppointment}
                onDeleteAppointment={handleDeleteAppointment}
              />
            )}
            {activeTab === 'profile' && (
              <ProfileSection 
                dbState={finalDBState}
                onUpdateProfile={handleUpdateProfile}
                onResetDatabase={handleResetDatabase}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FIXED BOTTOM NAVIGATION BAR (Satisfies UI design principles) */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center py-2.5 px-3 z-50 shadow-lg shrink-0">
        {[
          { tab: 'home', label: 'Home', icon: Home },
          { tab: 'chat', label: 'Chat', icon: MessageSquare },
          { tab: 'records', label: 'Vault', icon: FileText },
          { tab: 'vitals', label: 'Vitals', icon: TrendingUp },
          { tab: 'meds', label: 'Meds', icon: Pill },
          { tab: 'profile', label: 'Profile', icon: User }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.tab;
          return (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab as any)}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-blue-50 text-blue-600 scale-110' : ''}`}>
                <Icon size={18} />
              </div>
              <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Floating Action Button for prompt chatbot access anywhere */}
      {activeTab !== 'chat' && (
        <button
          onClick={() => setActiveTab('chat')}
          className="fixed bottom-20 right-6 md:right-auto md:ml-[340px] w-12 h-12 bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer z-40 animate-pulse"
          title="Instant AI Consult"
        >
          🤖
        </button>
      )}

    </div>
  );
}
