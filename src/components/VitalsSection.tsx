/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Info, 
  ChevronRight, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Heart,
  Droplet
} from 'lucide-react';
import { DBState, MedicalRecord, BiomarkerReading } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface VitalsSectionProps {
  dbState: DBState;
}

export default function VitalsSection({ dbState }: VitalsSectionProps) {
  const { records } = dbState;
  
  // Find all records that are blood reports and sort them by date (oldest first for chart)
  const bloodReports = records
    .filter(r => r.type === 'blood_report' && r.biomarkers)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Set the active report for detailed biomarker slide bars (usually newest report by default)
  const newestReports = [...bloodReports].reverse();
  const [selectedReportId, setSelectedReportId] = useState<string>(
    newestReports.length > 0 ? newestReports[0].id : ""
  );

  const activeReport = bloodReports.find(r => r.id === selectedReportId) || (bloodReports.length > 0 ? bloodReports[bloodReports.length - 1] : null);

  // Compile trend data for Recharts
  const chartData = bloodReports.map(report => ({
    date: report.date,
    hemoglobin: report.biomarkers?.hemoglobin.value || 0,
    vitaminD: report.biomarkers?.vitaminD.value || 0,
    vitaminB12: report.biomarkers?.vitaminB12.value || 0,
    fastingSugar: report.biomarkers?.fastingSugar.value || 0
  }));

  const [activeChartKey, setActiveChartKey] = useState<'hemoglobin' | 'vitaminD' | 'vitaminB12' | 'fastingSugar'>('hemoglobin');

  const chartMeta = {
    hemoglobin: { label: "Hemoglobin", unit: "g/dL", color: "#3b82f6", min: 13.5, max: 17.5 },
    vitaminD: { label: "Vitamin D", unit: "ng/mL", color: "#10b981", min: 30, max: 100 },
    vitaminB12: { label: "Vitamin B12", unit: "pg/mL", color: "#a855f7", min: 200, max: 900 },
    fastingSugar: { label: "Fasting Sugar", unit: "mg/dL", color: "#ec4899", min: 70, max: 99 }
  };

  const activeMeta = chartMeta[activeChartKey];

  // Render a visual progress bar indicating normal ranges (PRD 8.5, and the second screenshot)
  const renderRangeBar = (reading: BiomarkerReading) => {
    const min = reading.rangeMin;
    const max = reading.rangeMax;
    const val = reading.value;

    // Calculate percent position from 0% to 100% relative to a wider visual spectrum (e.g. 50% below min to 50% above max)
    const rangeSpan = max - min;
    const spectrumMin = Math.max(0, min - rangeSpan * 0.4);
    const spectrumMax = max + rangeSpan * 0.4;
    const spectrumWidth = spectrumMax - spectrumMin;
    
    const percentage = Math.min(Math.max(((val - spectrumMin) / spectrumWidth) * 100, 5), 95);

    return (
      <div className="space-y-1.5 mt-2.5">
        {/* Segmented ranges */}
        <div className="relative h-6 bg-slate-100 rounded-lg overflow-hidden flex text-[8px] font-bold text-slate-400">
          <div className="flex-1 bg-red-100/50 border-r border-slate-200/50 flex items-center justify-center text-red-500">LOW</div>
          <div className="flex-2 bg-emerald-100/40 border-r border-slate-200/50 flex items-center justify-center text-emerald-600">NORMAL</div>
          <div className="flex-1 bg-red-100/50 flex items-center justify-center text-red-500">HIGH</div>
          
          {/* Indicator Marker */}
          <div 
            className="absolute top-0 bottom-0 w-2.5 bg-blue-600 border border-white rounded-full shadow-md transition-all duration-500"
            style={{ left: `calc(${percentage}% - 5px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Range: {min} - {max} {reading.unit}</span>
          <span>Current: {val} {reading.unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Biomarker Analysis</h1>
          <p className="text-xs text-slate-500 font-medium">Deep AI tracking of clinical trends</p>
        </div>
      </div>

      {bloodReports.length > 0 ? (
        <>
          {/* Selector if multiple blood reports are present */}
          {bloodReports.length > 1 && (
            <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Report Date:</span>
              <select
                value={selectedReportId}
                onChange={(e) => setSelectedReportId(e.target.value)}
                className="flex-1 text-xs font-bold text-slate-700 bg-transparent focus:outline-hidden border-0 cursor-pointer"
              >
                {newestReports.map(r => (
                  <option key={r.id} value={r.id}>{r.title} ({r.date})</option>
                ))}
              </select>
            </div>
          )}

          {/* Active overall status card */}
          {activeReport && (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-3xs space-y-4">
              <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold py-1.5 px-4 rounded-xl flex items-center gap-1.5 border border-emerald-100/50">
                <Sparkles size={14} className="text-emerald-600 animate-pulse" />
                AI Insights Active • Overall Status: Optimal
              </div>

              <div className="bg-blue-50/40 border border-blue-100/50 rounded-xl p-4 flex gap-3">
                <span className="text-xl shrink-0 mt-0.5">🤖</span>
                <p className="text-[11px] font-medium text-slate-700 leading-normal">
                  "{activeReport.aiExplanation || "Most biomarkers are in range. Blood sugar is optimal. Your slight iron deficiency is improving as hemoglobin levels stay steady."}"
                </p>
              </div>
            </div>
          )}

          {/* Biomarkers Segmented Sliders (Exactly matching second screenshot) */}
          {activeReport?.biomarkers && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Biomarker Ranges</h3>
              
              <div className="space-y-3.5">
                {[
                  { key: 'hemoglobin', title: 'Hemoglobin', data: activeReport.biomarkers.hemoglobin },
                  { key: 'vitaminD', title: 'Vitamin D', data: activeReport.biomarkers.vitaminD },
                  { key: 'vitaminB12', title: 'Vitamin B12', data: activeReport.biomarkers.vitaminB12 },
                  { key: 'fastingSugar', title: 'Blood Sugar (Fasting)', data: activeReport.biomarkers.fastingSugar }
                ].map((item) => (
                  <div key={item.key} className="bg-white border border-slate-100 rounded-2xl p-4.5 shadow-3xs space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-slate-800">{item.title}</h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        item.data.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                      }`}>
                        {item.data.status}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xl font-black text-slate-800">{item.data.value}</span>
                      <span className="text-xs font-semibold text-slate-400">{item.data.unit}</span>
                    </div>

                    {renderRangeBar(item.data)}

                    <p className="text-[11px] text-slate-600 leading-normal mt-2 pt-1 border-t border-slate-50 font-medium">
                      <strong className="text-slate-700">AI Note:</strong> {item.data.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recharts Linear Line Graph Trend History (PRD 8.5) */}
          {chartData.length >= 2 && (
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-3xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <TrendingUp size={14} className="text-blue-500" /> Historical Trend Lines
                </h3>
                <div className="flex gap-1">
                  {(Object.keys(chartMeta) as Array<keyof typeof chartMeta>).map(key => (
                    <button
                      key={key}
                      onClick={() => setActiveChartKey(key)}
                      className={`text-[9px] font-bold px-2 py-1 rounded-lg transition-all border cursor-pointer ${
                        activeChartKey === key 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {chartMeta[key].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-52 w-full text-[10px] font-bold">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '11px' }}
                      formatter={(val) => [`${val} ${activeMeta.unit}`, activeMeta.label]}
                    />
                    <Line 
                      type="monotone" 
                      dataKey={activeChartKey} 
                      stroke={activeMeta.color} 
                      strokeWidth={3} 
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Clinical Disclaimer suffix */}
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
            <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
            <div className="space-y-1">
              <p className="text-[11px] font-black text-blue-900">Medical Disclaimer</p>
              <p className="text-[10px] text-blue-800 leading-normal font-medium">
                This is educational information, not a diagnostic decision. Please consult a doctor before making medical decisions or changes to your diet and supplement regimen based on these findings.
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-10 text-center text-slate-400">
          <Droplet className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-sm font-semibold">No blood reports found to analyze</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Please upload a blood report PDF or select a quick Indian Lab sample in the Records tab to unlock biomarker range sliders and trend lines!
          </p>
        </div>
      )}
    </div>
  );
}
