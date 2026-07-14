/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Activity, Scale, ChevronRight } from 'lucide-react';

interface ProfileStepProps {
  initialName?: string;
  onSave: (data: {
    name: string;
    age: number;
    gender: string;
    height: number;
    heightUnit: 'cm' | 'ft';
    weight: number;
    weightUnit: 'kg' | 'lb';
    bloodGroup: string;
  }) => void;
}

export default function ProfileStep({ initialName = '', onSave }: ProfileStepProps) {
  const [name, setName] = useState(initialName === 'New User' ? '' : initialName);
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('Prefer not to say');
  const [height, setHeight] = useState<number | ''>('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weight, setWeight] = useState<number | ''>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>('kg');
  const [bloodGroup, setBloodGroup] = useState('');

  const [touched, setTouched] = useState(false);

  const isFormValid = 
    name.trim().length > 0 && 
    typeof age === 'number' && age > 0 && age < 125 &&
    typeof height === 'number' && height > 0 &&
    typeof weight === 'number' && weight > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isFormValid) {
      onSave({
        name: name.trim(),
        age: Number(age),
        gender,
        height: Number(height),
        heightUnit,
        weight: Number(weight),
        weightUnit,
        bloodGroup,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] bg-blue-100 text-blue-700 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
            Step 4 of 6
          </span>
          <h2 className="text-2xl font-black tracking-tight text-slate-800 font-display mt-2">
            Tell us about yourself
          </h2>
          <p className="text-xs text-slate-500">
            Helps calibrate your biomarkers & medication tracking safely. Takes &lt; 30 seconds.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-blue-500" /> Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Bhavesh"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800"
            />
          </div>

          {/* Age & Gender */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Age</label>
              <input
                type="number"
                required
                min="1"
                max="125"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800 appearance-none cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Height & Unit */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-blue-500" /> Height
              </label>
              {/* Unit Toggle */}
              <div className="bg-slate-100 rounded-lg p-0.5 flex text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setHeightUnit('cm')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${heightUnit === 'cm' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => setHeightUnit('ft')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${heightUnit === 'ft' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                >
                  ft
                </button>
              </div>
            </div>
            <input
              type="number"
              step="any"
              required
              placeholder={heightUnit === 'cm' ? 'e.g. 175' : 'e.g. 5.8'}
              value={height}
              onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800"
            />
          </div>

          {/* Weight & Unit */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-blue-500" /> Weight
              </label>
              {/* Unit Toggle */}
              <div className="bg-slate-100 rounded-lg p-0.5 flex text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setWeightUnit('kg')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${weightUnit === 'kg' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => setWeightUnit('lb')}
                  className={`px-2.5 py-0.5 rounded-md transition-all ${weightUnit === 'lb' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500'}`}
                >
                  lb
                </button>
              </div>
            </div>
            <input
              type="number"
              step="any"
              required
              placeholder={weightUnit === 'kg' ? 'e.g. 70' : 'e.g. 154'}
              value={weight}
              onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800"
            />
          </div>

          {/* Blood Group (Optional) */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Blood Group (Optional)</label>
              <button
                type="button"
                onClick={() => setBloodGroup('')}
                className="text-[10px] font-semibold text-slate-400 hover:text-red-500"
              >
                Clear / Skip
              </button>
            </div>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-medium text-slate-800 cursor-pointer"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </form>
      </div>

      {/* Footer Submit */}
      <div className="max-w-sm mx-auto w-full pt-6 pb-8">
        <button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/10 transition-all transform active:scale-[0.99]"
        >
          <span>Continue</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
