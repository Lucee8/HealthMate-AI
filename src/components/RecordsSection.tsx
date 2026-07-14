/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Upload, 
  FileText, 
  Calendar, 
  Trash2, 
  Eye, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  FileSpreadsheet,
  PlusCircle,
  Clock,
  Info,
  RefreshCw
} from 'lucide-react';
import { DBState, MedicalRecord } from '../types';

interface RecordsSectionProps {
  dbState: DBState;
  onUploadRecord: (payload: {
    title: string;
    type: 'blood_report' | 'prescription' | 'discharge_summary' | 'other';
    date: string;
    textData?: string;
    fileName: string;
    fileSize: string;
  }) => Promise<void>;
  onDeleteRecord: (id: string) => Promise<void>;
}

export default function RecordsSection({ 
  dbState, 
  onUploadRecord, 
  onDeleteRecord 
}: RecordsSectionProps) {
  const { records } = dbState;
  const [activeFilter, setActiveFilter] = useState<'all' | 'blood_report' | 'prescription' | 'discharge_summary' | 'other'>('all');
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'blood_report' | 'prescription' | 'discharge_summary' | 'other'>('blood_report');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [simulatedText, setSimulatedText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>("rec-1"); // Default expand the mock one
  const [showUploadForm, setShowUploadForm] = useState(false);

  const filteredRecords = records.filter(r => {
    if (activeFilter === 'all') return true;
    return r.type === activeFilter;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        // Auto populate title from filename
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    }
  };

  // Prepopulated sample reports for quick one-click extraction testing (PRD 8.5 extraction logic proof)
  const sampleReports = [
    {
      name: "Standard Indian Lab Report (Low Vitamin D)",
      title: "Apollo Diagnostics Blood Panel",
      type: "blood_report" as const,
      fileName: "apollo_diagnostics_report.pdf",
      fileSize: "840 KB",
      textData: "Patient: Bhavesh. Date: 2026-06-20. Hemoglobin: 13.8 g/dL. Vitamin D: 18.5 ng/mL (insufficiency). Vitamin B12: 320 pg/mL. Fasting Glucose: 92 mg/dL."
    },
    {
      name: "Healthy Fitness Screening (Optimal Values)",
      title: "Metropolis Lab Yearly Checkup",
      type: "blood_report" as const,
      fileName: "metropolis_annual_panel.pdf",
      fileSize: "1.1 MB",
      textData: "Patient: Bhavesh. Date: 2026-06-25. Hb: 15.1 g/dL. Vit D3: 42.0 ng/mL. Vitamin B12: 610 pg/mL. Blood Sugar Fasting: 84 mg/dL."
    },
    {
      name: "High Sugar Blood Panel (Elevated fasting glucose)",
      title: "Thyrocare Diabetes Assessment",
      type: "blood_report" as const,
      fileName: "thyrocare_diabetes_screening.pdf",
      fileSize: "720 KB",
      textData: "Patient: Bhavesh. Date: 2026-06-28. Hemoglobin: 14.0 g/dL. Vitamin D: 31.0 ng/mL. Vitamin B12: 240 pg/mL. fasting sugar glucose: 115 mg/dL."
    }
  ];

  const triggerSampleUpload = async (sample: typeof sampleReports[0]) => {
    setIsUploading(true);
    await onUploadRecord({
      title: sample.title,
      type: sample.type,
      date: new Date().toISOString().split('T')[0],
      textData: sample.textData,
      fileName: sample.fileName,
      fileSize: sample.fileSize
    });
    setIsUploading(false);
    setShowUploadForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsUploading(true);
    
    // Simulate reading file contents
    const sizeStr = selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : "320 KB";
    const nameStr = selectedFile ? selectedFile.name : "custom_upload.pdf";

    // Auto generate some mock values if text data is empty
    const textDataContent = simulatedText || `Manual entry report of ${title}. Hemoglobin: 14.1, Vitamin D: 33.4, Vitamin B12: 450, Fasting Glucose: 89`;

    await onUploadRecord({
      title,
      type: docType,
      date,
      textData: textDataContent,
      fileName: nameStr,
      fileSize: sizeStr
    });

    setTitle('');
    setSelectedFile(null);
    setSimulatedText('');
    setIsUploading(false);
    setShowUploadForm(false);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header section with Toggle Form trigger */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">Records Vault</h1>
          <p className="text-xs text-slate-500">Store prescriptions, reports & discharge notes</p>
        </div>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus size={14} /> {showUploadForm ? 'Close' : 'Upload File'}
        </button>
      </div>

      {/* Upload Record Expandable Form */}
      {showUploadForm && (
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">New Document Upload</h3>
          
          {/* Quick Prepopulated Sample selection for student viva defense */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-2">
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1">
              <Sparkles size={12} /> Test parsing with Quick Indian Lab Samples
            </h4>
            <p className="text-[10px] text-blue-800 leading-normal">
              Click any sample below to simulate a real OCR document scan. HealthMate's AI will parse Hemoglobin, Vit D, B12, and Sugar instantly.
            </p>
            <div className="flex flex-col gap-1.5 mt-2">
              {sampleReports.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => triggerSampleUpload(sample)}
                  disabled={isUploading}
                  className="bg-white hover:bg-blue-50 transition-colors text-left text-[10px] font-semibold text-slate-700 px-3 py-2 rounded-lg border border-slate-200/60 flex items-center justify-between cursor-pointer"
                >
                  <span>{sample.name}</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black shrink-0">PARSE AI</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            Or Manual File Configuration
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Document Title</label>
              <input 
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Apollo Diabetes Checkup"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Document Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-hidden focus:border-blue-500 bg-white"
                >
                  <option value="blood_report">Blood Report</option>
                  <option value="prescription">Prescription</option>
                  <option value="discharge_summary">Discharge Summary</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Record Date</label>
                <input 
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-2.5 py-2 focus:outline-hidden focus:border-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Custom file input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Select Document PDF/Image</label>
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center transition-colors relative cursor-pointer">
                <input 
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-slate-300 mb-1" size={20} />
                <p className="text-[10px] font-bold text-slate-600">
                  {selectedFile ? selectedFile.name : 'Drag & Drop or Tap to browse files'}
                </p>
                <p className="text-[9px] text-slate-400 mt-0.5">Supports PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>

            {/* Simulated text parsing textbox */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                Simulated OCR Text (Optional)
              </label>
              <textarea 
                value={simulatedText}
                onChange={(e) => setSimulatedText(e.target.value)}
                placeholder="Paste report text here to test automatic extraction. e.g. Hemoglobin: 14.1, Fasting sugar: 88, Vit D: 32.4, B12: 540"
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-blue-500 h-16 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUploading || !title}
              className="w-full bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Processing with AI OCR...
                </>
              ) : (
                <>
                  <PlusCircle size={14} /> Upload & Analyze Record
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0 gap-4">
        {[
          { label: 'All Files', val: 'all' },
          { label: 'Blood Reports', val: 'blood_report' },
          { label: 'Prescriptions', val: 'prescription' },
          { label: 'Discharges', val: 'discharge_summary' },
          { label: 'Others', val: 'other' }
        ].map(tab => (
          <button
            key={tab.val}
            onClick={() => setActiveFilter(tab.val as any)}
            className={`pb-2.5 text-xs font-bold relative shrink-0 cursor-pointer ${
              activeFilter === tab.val ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab.label}
            {activeFilter === tab.val && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Document Records List */}
      <div className="space-y-3.5">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((rec) => {
            const isExpanded = expandedRecordId === rec.id;
            return (
              <div 
                key={rec.id}
                className="bg-white border border-slate-100 rounded-2xl shadow-3xs overflow-hidden transition-all"
              >
                {/* Accordion Trigger Header */}
                <div 
                  onClick={() => setExpandedRecordId(isExpanded ? null : rec.id)}
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex gap-3 items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      rec.type === 'blood_report' ? 'bg-pink-50 text-pink-600' : 
                      rec.type === 'prescription' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {rec.type === 'blood_report' ? '📊' : rec.type === 'prescription' ? '💊' : '📝'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{rec.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={10} /> {rec.date} • {rec.fileSize || "420 KB"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {rec.biomarkers && (
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-0.5">
                        <CheckCircle size={8} /> AI Parsed
                      </span>
                    )}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecord(rec.id);
                      }}
                      className="p-1.5 text-slate-300 hover:text-red-500 rounded-lg hover:bg-red-50/50 transition-colors"
                      title="Right to delete file (DPDP alignment)"
                    >
                      <Trash2 size={13} />
                    </button>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Drawer Details (PRD 8.4, 8.5) */}
                {isExpanded && (
                  <div className="border-t border-slate-50 bg-slate-50/30 p-4 space-y-4 text-xs">
                    
                    {/* Metadata Header */}
                    <div className="flex justify-between items-center text-[10px] text-slate-400 bg-white border border-slate-100 rounded-xl p-2.5">
                      <div><span className="font-bold">File:</span> {rec.fileName || 'uploaded_doc.pdf'}</div>
                      <div><span className="font-bold">Date Logged:</span> {rec.date}</div>
                    </div>

                    {/* Extracted Biomarker trends if it is a Blood report */}
                    {rec.biomarkers && (
                      <div className="space-y-2.5">
                        <h5 className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                          <TrendingUp size={12} className="text-blue-500" /> Parsed Biomarkers (4 MVP Goals)
                        </h5>
                        <div className="grid grid-cols-2 gap-2">
                          {[
                            { name: "Hemoglobin", marker: rec.biomarkers.hemoglobin },
                            { name: "Vitamin D", marker: rec.biomarkers.vitaminD },
                            { name: "Vitamin B12", marker: rec.biomarkers.vitaminB12 },
                            { name: "Fasting Sugar", marker: rec.biomarkers.fastingSugar }
                          ].map((item, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-3xs flex flex-col justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{item.name}</span>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-sm font-black text-slate-800">{item.marker.value}</span>
                                <span className="text-[9px] text-slate-400">{item.marker.unit}</span>
                              </div>
                              <span className={`text-[9px] mt-1 inline-block self-start px-1.5 py-0.5 rounded-full font-bold uppercase ${
                                item.marker.status === 'normal' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {item.marker.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI explanation of report */}
                    {rec.aiExplanation && (
                      <div className="bg-emerald-50/40 border border-emerald-100/50 rounded-xl p-3.5 space-y-1.5 relative overflow-hidden">
                        <div className="text-[10px] font-black text-emerald-800 flex items-center gap-1">
                          <Sparkles size={11} className="text-emerald-600" /> AI Report Synopsis
                        </div>
                        <p className="text-[11px] text-slate-700 leading-normal font-medium whitespace-pre-wrap">
                          {rec.aiExplanation}
                        </p>
                      </div>
                    )}

                    {/* Medical Disclaimer for clinical context */}
                    <div className="flex items-start gap-2 bg-slate-100 text-slate-500 p-2.5 rounded-xl text-[10px]">
                      <Info size={12} className="shrink-0 mt-0.5" />
                      <p className="leading-normal">
                        <strong>Disclaimer:</strong> This parsed blood profile and explanation is generated using educational guidelines, not a clinical diagnosis. Always consult with a licensed doctor regarding symptoms.
                      </p>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400">
            <FileText className="mx-auto text-slate-300 mb-2" size={32} />
            <p className="text-xs font-semibold">No documents uploaded under this filter</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Click "Upload File" or try a sample parser trigger above.</p>
          </div>
        )}
      </div>
    </div>
  );
}
