import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Sora3DViewer } from './Sora3DViewer';
import { 
  Compass, 
  BatteryCharging, 
  Activity, 
  MapPin, 
  Sparkles, 
  Navigation, 
  Pill, 
  Stethoscope, 
  AlertOctagon, 
  Play, 
  CheckCircle2, 
  Radar, 
  Cpu, 
  ShieldCheck, 
  RotateCcw,
  Volume2
} from 'lucide-react';

export const HomeDashboard: React.FC = () => {
  const { 
    robotState, 
    setActiveSection, 
    startDemo, 
    navigateTo, 
    returnToReception,
    emergencyStop 
  } = useHospital();

  return (
    <div className="space-y-6">
      {/* Top Hero Banner & Robot Status Overview */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative scanner line */}
        <div className="scanner-line opacity-40" />

        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold font-mono-num">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            SORA AUTONOMOUS HOSPITAL ASSISTANCE ROBOT
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-tech text-white tracking-wide">
            HOSPITAL AUTONOMY AI
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            Intelligent patient guidance, autonomous clinical navigation, collision avoidance, and supervised pharmacy delivery system.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={startDemo}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Start 10-Step Innovation Demo
            </button>
            <button
              onClick={() => setActiveSection('map')}
              className="px-4 py-2.5 bg-navy-900/90 hover:bg-navy-800 border border-slate-700 hover:border-cyan-400/50 text-slate-200 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-cyan-400" />
              Open Interactive Digital Twin Map
            </button>
          </div>
        </div>

        {/* Live Status Quick Card */}
        <div className="p-4 bg-navy-900/90 rounded-2xl border border-cyan-500/30 z-10 space-y-3 min-w-[240px]">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono-num font-semibold">ROBOT STATUS</span>
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ONLINE & READY
            </span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Zone:</span>
              <strong className="text-white truncate max-w-[140px] text-right">{robotState.currentZone}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Battery Level:</span>
              <strong className="text-cyan-300 font-mono-num">{robotState.batteryPct}% (LiFePO4)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Escorts Completed:</span>
              <strong className="text-purple-300 font-mono-num">{robotState.completedTasksCount} missions</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: SORA 3D Robot & Active Mission Screen (5 Cols) */}
        <div className="lg:col-span-5 glass-panel p-5 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              SORA Autonomous Unit (3D Preview)
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono-num">
              Firmware v4.2
            </span>
          </div>

          <div className="w-full flex-1 min-h-[300px]">
            <Sora3DViewer compact />
          </div>

          {/* Current Robot Message Display */}
          <div className="p-3.5 bg-navy-950 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs text-cyan-300 font-bold mb-1">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              SORA Vocal / Screen Message:
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{robotState.screenMessage}"
            </p>
          </div>
        </div>

        {/* Right Column: Key Robot Telemetry & Hospital Service Shortcuts (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 4 Telemetry Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Task</span>
              <div className="text-xs font-bold text-cyan-300 mt-1 line-clamp-2">
                {robotState.currentTask}
              </div>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">LiDAR Range</span>
              <div className="text-base font-bold font-mono-num text-emerald-400 mt-1">
                {robotState.sensors.frontDistanceCm} cm
              </div>
              <span className="text-[10px] text-slate-400">Front Obstacle Sensor</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Speed Telemetry</span>
              <div className="text-base font-bold font-mono-num text-white mt-1">
                {robotState.status === 'navigating' ? robotState.speedMps.toFixed(1) : '0.0'} m/s
              </div>
              <span className="text-[10px] text-slate-400">Autonomous Cruise</span>
            </div>

            <div className="glass-panel p-4 rounded-2xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Safety Halo</span>
              <div className="text-base font-bold text-cyan-300 mt-1">
                Active
              </div>
              <span className="text-[10px] text-emerald-400">30cm Safety Perimeter</span>
            </div>
          </div>

          {/* Hospital Service Shortcuts */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Hospital Autonomous Services & Navigation Shortcuts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setActiveSection('map');
                  navigateTo('pharmacy');
                }}
                className="p-3.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-800 hover:border-emerald-500/50 transition flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-emerald-300">
                    Central Pharmacy Escort
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Dispensary & autonomous cart pickup
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('doctors')}
                className="p-3.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-800 hover:border-blue-500/50 transition flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-blue-300">
                    Doctor & Appointments
                  </div>
                  <div className="text-[11px] text-slate-400">
                    OPD consultation chambers & booking
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveSection('map');
                  navigateTo('mri_ct');
                }}
                className="p-3.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 border border-slate-800 hover:border-cyan-500/50 transition flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                    MRI & CT Scan Suite
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Radiology diagnostics wing
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveSection('emergency')}
                className="p-3.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 hover:border-rose-400 transition flex items-center gap-3 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200">
                    Emergency Staff Alert
                  </div>
                  <div className="text-[11px] text-rose-300/70">
                    Distress beacon & trauma broadcast
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Hardware & Dock Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-navy-900/60 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400">Quick Commands:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={returnToReception}
                className="px-3 py-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 border border-slate-700 rounded-xl transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                Return to Reception Dock
              </button>
              <button
                onClick={emergencyStop}
                className="px-3 py-1.5 bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/50 rounded-xl font-bold transition"
              >
                Emergency Stop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
