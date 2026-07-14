/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string;
  conditions: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  consentGiven: boolean;
  onboardingComplete?: boolean;
  onboardingStep?: string;
  height?: number;
  heightUnit?: 'cm' | 'ft';
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  onboardingAnswers?: {
    conditions?: string[];
    allergies?: string;
    takingMedicines?: boolean;
    medicineNames?: string;
    mainGoal?: string;
  };
  permissions?: {
    notifications?: boolean;
    healthSync?: boolean;
    camera?: boolean;
    storage?: boolean;
  };
}

export interface BiomarkerReading {
  value: number;
  unit: string;
  status: 'normal' | 'low' | 'high';
  rangeMin: number;
  rangeMax: number;
  explanation: string;
}

export interface BiomarkerSet {
  hemoglobin: BiomarkerReading;
  vitaminD: BiomarkerReading;
  vitaminB12: BiomarkerReading;
  fastingSugar: BiomarkerReading;
}

export interface MedicalRecord {
  id: string;
  title: string;
  type: 'blood_report' | 'prescription' | 'discharge_summary' | 'other';
  date: string;
  fileSize?: string;
  fileName?: string;
  fileContent?: string; // Stored parsed content/text or simulated text
  biomarkers?: BiomarkerSet;
  aiExplanation?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g. "Once daily", "Twice daily", "As needed"
  times: string[]; // e.g. ["Morning", "Evening"]
  notes?: string;
  history: {
    [date: string]: 'taken' | 'missed';
  };
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isDisclaimer?: boolean;
  isEmergency?: boolean;
}

export interface DBState {
  profile: UserProfile;
  medications: Medication[];
  appointments: Appointment[];
  records: MedicalRecord[];
  chats: ChatMessage[];
  waterLogged: number; // in Liters
  exerciseLogged: number; // in Minutes
  sleepLogged: number; // in Hours
}
