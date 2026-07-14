/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Check, 
  Calendar, 
  Clock, 
  Pill, 
  PlusCircle, 
  Heart,
  AlertTriangle,
  FileText,
  User,
  Activity,
  CheckSquare,
  Square,
  Camera,
  Cpu,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { DBState, Medication, Appointment } from '../types';

interface MedsSectionProps {
  dbState: DBState;
  onAddMedication: (med: Partial<Medication>) => Promise<void>;
  onDeleteMedication: (id: string) => Promise<void>;
  onLogMedication: (medId: string, date: string, status: 'taken' | 'missed') => Promise<void>;
  onAddAppointment: (appt: Partial<Appointment>) => Promise<void>;
  onDeleteAppointment: (id: string) => Promise<void>;
}

export default function MedsSection({
  dbState,
  onAddMedication,
  onDeleteMedication,
  onLogMedication,
  onAddAppointment,
  onDeleteAppointment
}: MedsSectionProps) {
  const { medications, appointments } = dbState;
  const todayStr = new Date().toISOString().split('T')[0];

  // Form states for Medication
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('1 Tablet');
  const [medFreq, setMedFreq] = useState('Once daily');
  const [medNotes, setMedNotes] = useState('');
  const [timeMorning, setTimeMorning] = useState(true);
  const [timeAfternoon, setTimeAfternoon] = useState(false);
  const [timeEvening, setTimeEvening] = useState(false);
  const [showAddMedForm, setShowAddMedForm] = useState(false);

  // OCR Scan states
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState('');

  const handleSimulateOCR = () => {
    setIsScanning(true);
    setScanMessage('Initializing Camera Lens & Laser Focus...');
    setTimeout(() => {
      setScanMessage('Scanning printed text and dose frequencies...');
    }, 1000);
    setTimeout(() => {
      setScanMessage('AI Clinical Parser matching medication database...');
    }, 2000);
    setTimeout(() => {
      setMedName('Dolo 650mg');
      setMedDosage('1 Tablet');
      setMedFreq('Twice daily');
      setTimeMorning(true);
      setTimeAfternoon(false);
      setTimeEvening(true);
      setMedNotes('OCR Scanned: Take twice daily after food');
      setIsScanning(false);
      setShowAddMedForm(true);
      setScanMessage('');
    }, 3200);
  };

  // Form states for Appointment
  const [apptDoctor, setApptDoctor] = useState('');
  const [apptSpecialty, setApptSpecialty] = useState('General Physician');
  const [apptClinic, setApptClinic] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('');
  const [apptNotes, setApptNotes] = useState('');
  const [showAddApptForm, setShowAddApptForm] = useState(false);

  // Filter or group medicines by times of day
  const timeGroups = [
    { label: "Morning", active: true },
    { label: "Afternoon", active: true },
    { label: "Evening", active: true }
  ];

  const handleAddMed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName) return;

    const selectedTimes: string[] = [];
    if (timeMorning) selectedTimes.push("Morning");
    if (timeAfternoon) selectedTimes.push("Afternoon");
    if (timeEvening) selectedTimes.push("Evening");

    if (selectedTimes.length === 0) selectedTimes.push("Morning");

    await onAddMedication({
      name: medName,
      dosage: medDosage,
      frequency: medFreq,
      times: selectedTimes,
      notes: medNotes
    });

    setMedName('');
    setMedNotes('');
    setShowAddMedForm(false);
  };

  const handleAddAppt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptDoctor || !apptDate || !apptTime) return;

    await onAddAppointment({
      doctorName: apptDoctor,
      specialty: apptSpecialty,
      clinicName: apptClinic || "General Wellness Center",
      date: apptDate,
      time: apptTime,
      notes: apptNotes
    });

    setApptDoctor('');
    setApptClinic('');
    setApptNotes('');
    setApptDate('');
    setApptTime('');
    setShowAddApptForm(false);
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Tab Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">Medicines & Clinics</h1>
        <p className="text-xs text-slate-500 font-medium">Log doses and manage upcoming physician visits</p>
      </div>

      {/* SECTION 1: TODAY'S DOSAGE CHECKLIST (PRD 8.2, 8.6) */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-3.5">
        <h2 className="text-sm font-black text-slate-800 flex items-center gap-1">
          <CheckSquare size={16} className="text-blue-500" /> Today's Doses Checklist
        </h2>
        
        <div className="space-y-3">
          {timeGroups.map((group) => {
            const groupMeds = medications.filter(m => m.times.includes(group.label));
            if (groupMeds.length === 0) return null;

            return (
              <div key={group.label} className="space-y-1.5">
                <h3 className="text-[10px] font-black tracking-wider uppercase text-slate-400">{group.label} Due</h3>
                <div className="space-y-2">
                  {groupMeds.map((med) => {
                    const isTaken = med.history[todayStr] === 'taken';
                    const isMissed = med.history[todayStr] === 'missed';

                    return (
                      <div 
                        key={med.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                          isTaken ? 'bg-emerald-50/50 border-emerald-100' : 
                          isMissed ? 'bg-red-50/40 border-red-100' : 'bg-slate-50/50 border-slate-100'
                        }`}
                      >
                        <div className="flex gap-2.5 items-center">
                          <span className="text-lg">💊</span>
                          <div>
                            <h4 className={`text-xs font-bold ${isTaken ? 'text-emerald-900 line-through' : 'text-slate-800'}`}>
                              {med.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">{med.dosage} • {med.frequency}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => onLogMedication(med.id, todayStr, isTaken ? 'missed' : 'taken')}
                            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-colors cursor-pointer ${
                              isTaken ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {isTaken ? 'Taken' : 'Mark Taken'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {medications.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400">
              No medications configured. Add a medicine below to start tracking!
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: MEDICINE MANAGER LIST & FORM (PRD 8.6) */}
      <div className="space-y-3">
        {/* OCR Prescription Scanner Live Camera Simulation Overlay */}
        {isScanning && (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 text-white space-y-4 relative overflow-hidden shadow-xl animate-fadeIn">
            {/* Pulsing red lasers */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-bounce"></div>
            
            <div className="flex justify-between items-center relative z-10">
              <div className="flex items-center gap-1.5 text-blue-400 font-black text-xs uppercase tracking-wider">
                <Cpu size={14} className="animate-spin text-blue-400" />
                Active OCR scanner engine
              </div>
              <span className="text-[9px] bg-blue-950 border border-blue-900 text-blue-400 px-2 py-0.5 rounded-full font-bold">
                CAMERA_LINK_ON
              </span>
            </div>

            {/* Viewfinder brackets */}
            <div className="h-28 border border-dashed border-slate-700/80 rounded-2xl flex flex-col items-center justify-center relative bg-slate-900/60 p-4">
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
              
              <p className="text-xs text-slate-300 font-medium text-center font-mono animate-pulse">{scanMessage}</p>
              <div className="mt-2 text-[9px] text-slate-500 font-semibold uppercase tracking-widest font-mono">
                Rx document boundaries aligned
              </div>
            </div>

            <div className="flex justify-end relative z-10">
              <button
                type="button"
                onClick={() => setIsScanning(false)}
                className="text-xs text-slate-400 hover:text-white font-bold cursor-pointer"
              >
                Cancel scan
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">Medication Registry</h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSimulateOCR}
              className="text-xs bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-3xs"
            >
              <Camera size={13} /> OCR Scan Rx
            </button>
            <button
              onClick={() => setShowAddMedForm(!showAddMedForm)}
              className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} /> {showAddMedForm ? 'Close' : 'Add Medication'}
            </button>
          </div>
        </div>

        {/* Add Medication Form */}
        {showAddMedForm && (
          <form 
            onSubmit={handleAddMed}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3.5"
          >
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Medication Name</label>
              <input 
                type="text"
                required
                value={medName}
                onChange={(e) => setMedName(e.target.value)}
                placeholder="e.g. Atorvastatin 10mg"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dosage Form</label>
                <input 
                  type="text"
                  required
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  placeholder="e.g. 1 Tablet"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Frequency</label>
                <select
                  value={medFreq}
                  onChange={(e) => setMedFreq(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-hidden focus:border-blue-500 bg-white"
                >
                  <option value="Once daily">Once daily</option>
                  <option value="Twice daily">Twice daily</option>
                  <option value="As needed">As needed (PRN)</option>
                  <option value="Once weekly">Once weekly</option>
                </select>
              </div>
            </div>

            {/* Time Checkboxes */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">Intake Time of Day</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={timeMorning} onChange={(e) => setTimeMorning(e.target.checked)} />
                  Morning
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={timeAfternoon} onChange={(e) => setTimeAfternoon(e.target.checked)} />
                  Afternoon
                </label>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={timeEvening} onChange={(e) => setTimeEvening(e.target.checked)} />
                  Evening
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doctor Instructions (Optional)</label>
              <input 
                type="text"
                value={medNotes}
                onChange={(e) => setMedNotes(e.target.value)}
                placeholder="e.g. Take after food with water"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl shadow-sm cursor-pointer"
            >
              Add to Medication List
            </button>
          </form>
        )}

        {/* Existing Medications Catalog */}
        <div className="space-y-2">
          {medications.map((med) => (
            <div 
              key={med.id}
              className="bg-white border border-slate-100 rounded-xl p-3.5 flex justify-between items-center shadow-3xs"
            >
              <div className="flex gap-2.5 items-center">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                  💊
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{med.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {med.dosage} • {med.frequency} • Time: {med.times.join(', ')}
                  </p>
                  {med.notes && <p className="text-[9px] text-slate-500 italic mt-0.5">{med.notes}</p>}
                </div>
              </div>
              <button
                onClick={() => onDeleteMedication(med.id)}
                className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                title="Delete Medication"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: CLINIC APPOINTMENTS SCHEDULER (PRD 8.7) */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-800">Clinic Appointments</h2>
          <button
            onClick={() => setShowAddApptForm(!showAddApptForm)}
            className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus size={13} /> {showAddApptForm ? 'Close' : 'Book Appointment'}
          </button>
        </div>

        {/* Add Appointment Form */}
        {showAddApptForm && (
          <form 
            onSubmit={handleAddAppt}
            className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-3.5"
          >
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Doctor Name</label>
              <input 
                type="text"
                required
                value={apptDoctor}
                onChange={(e) => setApptDoctor(e.target.value)}
                placeholder="e.g. Dr. Sarah Smith"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Specialty</label>
                <input 
                  type="text"
                  required
                  value={apptSpecialty}
                  onChange={(e) => setApptSpecialty(e.target.value)}
                  placeholder="e.g. Cardiologist"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Clinic / Hospital</label>
                <input 
                  type="text"
                  value={apptClinic}
                  onChange={(e) => setApptClinic(e.target.value)}
                  placeholder="e.g. City Wellness Care"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Appointment Date</label>
                <input 
                  type="date"
                  required
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-hidden focus:border-blue-500 bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Time Slot</label>
                <input 
                  type="time"
                  required
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-hidden focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Symptoms / Purpose Notes</label>
              <input 
                type="text"
                value={apptNotes}
                onChange={(e) => setApptNotes(e.target.value)}
                placeholder="e.g. Routine hypertension BP reading checkout"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-xl shadow-sm cursor-pointer"
            >
              Book & Lock Appointment
            </button>
          </form>
        )}

        {/* Appointments List view sorted by date */}
        <div className="space-y-2">
          {appointments
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((appt) => (
              <div 
                key={appt.id}
                className="bg-white border border-slate-100 rounded-xl p-3.5 flex justify-between items-center shadow-3xs"
              >
                <div className="flex gap-2.5 items-center">
                  <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center text-sm font-bold">
                    👩‍⚕️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{appt.doctorName}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{appt.specialty} • {appt.clinicName}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5 flex items-center gap-1 font-bold">
                      <Calendar size={9} /> {appt.date} <Clock size={9} /> {appt.time}
                    </p>
                    {appt.notes && <p className="text-[9px] text-slate-500 italic mt-0.5 font-medium">Notes: {appt.notes}</p>}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteAppointment(appt.id)}
                  className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  title="Cancel Appointment"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

          {appointments.length === 0 && (
            <div className="text-center py-5 bg-slate-50/50 border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 font-bold">
              No appointments booked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
