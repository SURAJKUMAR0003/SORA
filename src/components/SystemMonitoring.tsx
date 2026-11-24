import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Activity, 
  Cpu, 
  Wifi, 
  HardDrive, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

export const SystemMonitoring: React.FC = () => {
  const { activityLogs, robotState } = useHospital();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchLog, setSearchLog] = useState<string>('');

  const filteredLogs = activityLogs.filter(log => {
    const matchCat = filterCategory === 'all' || log.category === filterCategory;
    const matchSearch = log.title.toLowerCase().includes(searchLog.toLowerCase()) ||
                        log.details.toLowerCase().includes(searchLog.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              AUTONOMOUS SYSTEM HEALTH & EVENT LOGS
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                REAL-TIME TELEMETRY STREAM
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Robotics operating metrics, sensor health matrix, and chronological event audit trail
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-emerald-400 font-mono-num bg-navy-900 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            ALL SUBSYSTEMS NOMINAL
          </span>
        </div>
      </div>

      {/* Subsystem Health Metrics Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase font-mono-num">AI Compute Load</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-white mt-2">
            18.4%
          </div>
          <span className="text-[10px] text-emerald-400 mt-1 block">Quad-Core ARM Cortex-A72</span>
        </div>

        {/* Metric 2 */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase font-mono-num">RAM Utilization</span>
            <HardDrive className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-purple-300 mt-2">
            1.82 GB / 8 GB
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">LPDDR4 SDRAM</span>
        </div>

        {/* Metric 3 */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase font-mono-num">Wi-Fi Telemetry Ping</span>
            <Wifi className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-emerald-400 mt-2">
            8 ms
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Hospital Mesh AP-04 (-52dBm)</span>
        </div>

        {/* Metric 4 */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase font-mono-num">SLAM Loop Rate</span>
            <RefreshCw className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono-num text-cyan-300 mt-2">
            20 Hz
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">A* Costmap sync at 50ms</span>
        </div>
      </div>

      {/* Real-time Activity Logs & Audit Trail */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            Chronological Activity & Mission Log ({filteredLogs.length} events)
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-navy-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              <option value="navigation">Navigation</option>
              <option value="voice">Voice Interaction</option>
              <option value="delivery">Pharmacy Delivery</option>
              <option value="emergency">Emergency</option>
              <option value="system">System Hardware</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={searchLog}
                onChange={(e) => setSearchLog(e.target.value)}
                className="bg-navy-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-44"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-2">
          {filteredLogs.map(log => (
            <div
              key={log.id}
              className={`p-3.5 rounded-2xl border text-xs flex items-start justify-between gap-3 transition ${
                log.level === 'emergency'
                  ? 'bg-rose-950/60 border-rose-500 text-rose-200'
                  : log.level === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : log.level === 'success'
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-slate-200'
                  : 'bg-navy-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono-num font-bold uppercase ${
                    log.level === 'emergency'
                      ? 'bg-rose-500 text-white'
                      : log.level === 'warning'
                      ? 'bg-amber-500 text-navy-950'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {log.category}
                  </span>
                  <span className="font-bold text-white text-sm">{log.title}</span>
                </div>
                <p className="text-xs text-slate-300">{log.details}</p>
                {log.location && (
                  <span className="text-[10px] text-cyan-400 font-mono-num block">
                    Location: {log.location}
                  </span>
                )}
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-mono-num text-slate-400 font-semibold">
                  {log.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
