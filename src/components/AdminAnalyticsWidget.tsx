/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Database, LineChart, Shield, Terminal, Zap, CheckCircle, BarChart, Server } from 'lucide-react';
import { DBState } from '../types';

interface AdminAnalyticsWidgetProps {
  dbState: DBState;
}

export default function AdminAnalyticsWidget({ dbState }: AdminAnalyticsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'db_explorer' | 'telemetry'>('overview');
  const [systemLogs, setSystemLogs] = useState([
    { id: '1', time: '07:02:15', event: 'Vitals tracking module loaded', status: 'SUCCESS', latency: '42ms' },
    { id: '2', time: '07:05:42', event: 'Gemini LLM initialization handshake', status: 'SUCCESS', latency: '210ms' },
    { id: '3', time: '07:07:01', event: 'Garmin sync trigger handshake', status: 'SUCCESS', latency: '124ms' },
    { id: '4', time: '07:08:18', event: 'Clinical report OCR simulated scan', status: 'SUCCESS', latency: '85ms' },
    { id: '5', time: '07:09:30', event: 'Database persistent write sync', status: 'SUCCESS', latency: '15ms' },
  ]);

  // Calculate compliance statistics
  const totalMeds = dbState.medications.length;
  const takenMeds = dbState.medications.filter(m => {
    const todayStr = new Date().toISOString().split('T')[0];
    return m.history[todayStr] === 'taken';
  }).length;

  const complianceRate = totalMeds > 0 ? Math.round((takenMeds / totalMeds) * 100) : 100;

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-4 font-sans">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="text-blue-400 shrink-0" size={18} />
          <div>
            <h3 className="text-sm font-black tracking-tight">Admin & Clinical Console</h3>
            <p className="text-[9px] text-slate-400 font-bold">Workspace telemetry & system logs</p>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-blue-950/80 text-blue-400 border border-blue-900 text-[9px] font-black uppercase px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
          SYS_OK: Port 3000
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-950 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-all text-[10px] font-bold cursor-pointer ${
            activeTab === 'overview' ? 'bg-slate-800 text-white shadow-3xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LineChart size={12} className="inline mr-1" /> Metrics
        </button>
        <button
          onClick={() => setActiveTab('db_explorer')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-all text-[10px] font-bold cursor-pointer ${
            activeTab === 'db_explorer' ? 'bg-slate-800 text-white shadow-3xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database size={12} className="inline mr-1" /> State JSON
        </button>
        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-1.5 text-center rounded-lg transition-all text-[10px] font-bold cursor-pointer ${
            activeTab === 'telemetry' ? 'bg-slate-800 text-white shadow-3xs' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal size={12} className="inline mr-1" /> Telemetry Logs
        </button>
      </div>

      {/* Overview Metric Panel */}
      {activeTab === 'overview' && (
        <div className="space-y-3.5 animate-fadeIn">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">MED COMPLIANCE</span>
              <span className="text-lg font-black text-emerald-400 mt-1 block">{complianceRate}%</span>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full" style={{ width: `${complianceRate}%` }}></div>
              </div>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">ACTIVE RECORDS</span>
              <span className="text-lg font-black text-blue-400 mt-1 block">{dbState.records.length}</span>
              <span className="text-[8px] text-slate-500 font-bold">Labs loaded</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 text-center">
              <span className="text-[8px] text-slate-400 font-bold block">CHATS GENERATED</span>
              <span className="text-lg font-black text-purple-400 mt-1 block">{dbState.chats.length}</span>
              <span className="text-[8px] text-slate-500 font-bold">Dialog events</span>
            </div>
          </div>

          {/* Quick Stats list */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap size={11} className="text-amber-400" /> Patient Analytics Telemetry
            </h4>
            <div className="text-[11px] space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>Water goal satisfaction:</span>
                <span className={dbState.waterLogged >= 2.0 ? 'text-emerald-400' : 'text-amber-400'}>
                  {(dbState.waterLogged / 2 * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-900 pb-1">
                <span>Exercise goal satisfaction:</span>
                <span className={dbState.exerciseLogged >= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                  {(dbState.exerciseLogged / 60 * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between pb-1">
                <span>Sleep goal satisfaction:</span>
                <span className={dbState.sleepLogged >= 7 ? 'text-emerald-400' : 'text-amber-400'}>
                  {(dbState.sleepLogged / 7 * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Database Explorer Tab */}
      {activeTab === 'db_explorer' && (
        <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 h-44 overflow-y-auto font-mono text-[10px] text-blue-300 select-all scrollbar-thin">
          <pre>{JSON.stringify({
            profile: {
              name: dbState.profile.name,
              consentGiven: dbState.profile.consentGiven,
              allergies: dbState.profile.allergies,
              conditions: dbState.profile.conditions,
            },
            medicationsCount: dbState.medications.length,
            appointmentsCount: dbState.appointments.length,
            recordsCount: dbState.records.length,
            trackers: {
              water: dbState.waterLogged,
              exercise: dbState.exerciseLogged,
              sleep: dbState.sleepLogged
            }
          }, null, 2)}</pre>
        </div>
      )}

      {/* Telemetry Logs Tab */}
      {activeTab === 'telemetry' && (
        <div className="space-y-1.5 font-mono max-h-44 overflow-y-auto">
          {systemLogs.map((log) => (
            <div key={log.id} className="flex justify-between text-[9px] bg-slate-950 p-2 rounded-lg border border-slate-900">
              <div>
                <span className="text-slate-500 mr-2">[{log.time}]</span>
                <span className="text-slate-300 font-bold">{log.event}</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <span className="text-emerald-400 font-extrabold">{log.status}</span>
                <span className="text-slate-500">{log.latency}</span>
              </div>
            </div>
          ))}
          <button
            onClick={() => {
              const newLog = {
                id: Date.now().toString(),
                time: new Date().toTimeString().split(' ')[0],
                event: 'Manual system calibration triggered',
                status: 'CALIBRATED',
                latency: '12ms'
              };
              setSystemLogs([...systemLogs, newLog]);
            }}
            className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold text-[10px] py-2 rounded-xl transition-all cursor-pointer"
          >
            + Run Diagnostics
          </button>
        </div>
      )}
    </div>
  );
}
