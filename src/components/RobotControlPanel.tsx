import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Sliders, 
  BatteryCharging, 
  Gauge, 
  Activity, 
  ShieldAlert, 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  Eye, 
  Radar, 
  Radio, 
  CheckCircle2, 
  Compass, 
  Zap, 
  Power 
} from 'lucide-react';

export const RobotControlPanel: React.FC = () => {
  const {
    robotState,
    pauseNavigation,
    resumeNavigation,
    cancelNavigation,
    returnToReception,
    emergencyStop,
    clearEmergency,
    setRobotSpeed
  } = useHospital();

  const handleSpeedSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRobotSpeed(parseFloat(e.target.value));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              SORA ROBOT DIAGNOSTICS & TELEMETRY CONTROL
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                DRIVE & SENSOR SUITE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Low-level motor actuation, LiDAR point-cloud range telemetry, and safety overrides
            </p>
          </div>
        </div>

        {/* Master Power Status */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-navy-900 px-3 py-1.5 rounded-xl border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            DRIVE CONTROLLER ONLINE
          </span>
        </div>
      </div>

      {/* Primary Telemetry Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Metric 1: Location */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Grid Coordinates</span>
          <div className="text-lg font-bold font-mono-num text-cyan-300 mt-1">
            [{robotState.position.x}, {robotState.position.y}]
          </div>
          <span className="text-[10px] text-slate-400 truncate block mt-0.5">
            {robotState.currentZone}
          </span>
        </div>

        {/* Metric 2: Heading */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Orientation Angle</span>
          <div className="text-lg font-bold font-mono-num text-white mt-1">
            {robotState.headingAngle}°
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Compass Yaw
          </span>
        </div>

        {/* Metric 3: Speed */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Drive Speed</span>
          <div className="text-lg font-bold font-mono-num text-emerald-400 mt-1">
            {robotState.status === 'navigating' ? robotState.speedMps.toFixed(1) : '0.0'} m/s
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Differential drive
          </span>
        </div>

        {/* Metric 4: Battery */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Battery Charge</span>
          <div className="text-lg font-bold font-mono-num text-cyan-300 mt-1 flex items-center gap-1.5">
            <BatteryCharging className="w-5 h-5 text-cyan-400" />
            {robotState.batteryPct}%
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            LiFePO4 24V 40Ah
          </span>
        </div>

        {/* Metric 5: Navigation State */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Nav State</span>
          <div className={`text-base font-bold uppercase mt-1 truncate ${
            robotState.emergencyActive
              ? 'text-rose-400'
              : robotState.status === 'navigating'
              ? 'text-cyan-400'
              : 'text-slate-300'
          }`}>
            {robotState.status.replace('_', ' ')}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            FSM Controller
          </span>
        </div>

        {/* Metric 6: Completed Missions */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 block uppercase font-mono-num font-semibold">Escorts Done</span>
          <div className="text-lg font-bold font-mono-num text-purple-400 mt-1">
            {robotState.completedTasksCount}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {robotState.totalDistanceTraveledM}m logged
          </span>
        </div>
      </div>

      {/* Main Grid: Control Actions & Sensor Range Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Drive Actuation Commands (6 Cols) */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-3xl border border-cyan-500/20 space-y-5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Locomotion & Safety Actuation Controls
          </h3>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {robotState.status === 'navigating' ? (
              <button
                onClick={pauseNavigation}
                className="py-3 px-4 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition"
              >
                <Pause className="w-5 h-5" />
                Pause Motion
              </button>
            ) : (
              <button
                onClick={resumeNavigation}
                disabled={robotState.activePath.length === 0 || robotState.emergencyActive}
                className="py-3 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-40 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition"
              >
                <Play className="w-5 h-5" />
                Resume Motion
              </button>
            )}

            <button
              onClick={cancelNavigation}
              disabled={robotState.status === 'idle'}
              className="py-3 px-4 bg-navy-900 hover:bg-navy-800 disabled:opacity-40 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition"
            >
              <Square className="w-5 h-5" />
              Stop / Abort
            </button>

            <button
              onClick={returnToReception}
              className="py-3 px-4 bg-navy-900 hover:bg-navy-800 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition"
            >
              <RotateCcw className="w-5 h-5" />
              Dock at Reception
            </button>
          </div>

          {/* Speed Regulation Slider */}
          <div className="p-4 bg-navy-900/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Autonomous Cruising Speed</span>
              <span className="font-mono-num font-bold text-cyan-300">
                {robotState.speedMps.toFixed(1)} m/s (Max 1.4 m/s for hospital safety)
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="1.4"
              step="0.1"
              value={robotState.speedMps}
              onChange={handleSpeedSlider}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Emergency Stop Button & Reset */}
          <div className="pt-2">
            {robotState.emergencyActive ? (
              <button
                onClick={clearEmergency}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold text-sm rounded-2xl transition shadow-xl flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                RESET EMERGENCY INTERLOCK & RE-ENGAGE
              </button>
            ) : (
              <button
                onClick={emergencyStop}
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-sm rounded-2xl transition shadow-xl shadow-rose-900/40 flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-5 h-5" />
                EMERGENCY STOP (HALT ALL MOTORS)
              </button>
            )}
          </div>
        </div>

        {/* Virtual Sensor Telemetry & Point Cloud Range Radar (6 Cols) */}
        <div className="lg:col-span-6 glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400" />
              Multi-Sensor Proximity & Computer Vision Suite
            </h3>
            <span className="text-[11px] font-mono-num text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LiDAR 20Hz Sampling
            </span>
          </div>

          {/* 3 Proximity Radar Gauges: Front, Left, Right */}
          <div className="grid grid-cols-3 gap-3">
            {/* Front Sensor */}
            <div className="p-3 bg-navy-900 rounded-2xl border border-cyan-500/30 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Front LiDAR</span>
              <div className="text-xl font-bold font-mono-num text-cyan-300">
                {robotState.sensors.frontDistanceCm} <span className="text-xs">cm</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                robotState.sensors.frontDistanceCm < 60
                  ? 'bg-rose-500/20 text-rose-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {robotState.sensors.frontDistanceCm < 60 ? 'Warning Zone' : 'Clear Track'}
              </span>
            </div>

            {/* Left Ultrasonic */}
            <div className="p-3 bg-navy-900 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Left Sonar</span>
              <div className="text-xl font-bold font-mono-num text-slate-200">
                {robotState.sensors.leftDistanceCm} <span className="text-xs">cm</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 uppercase">
                Wall Dist Normal
              </span>
            </div>

            {/* Right Ultrasonic */}
            <div className="p-3 bg-navy-900 rounded-2xl border border-slate-800 text-center space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Right Sonar</span>
              <div className="text-xl font-bold font-mono-num text-slate-200">
                {robotState.sensors.rightDistanceCm} <span className="text-xs">cm</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-300 uppercase">
                Corridor Open
              </span>
            </div>
          </div>

          {/* Computer Vision RGB-D Camera Stream Simulation with Object Detection */}
          <div className="p-4 bg-navy-950 rounded-2xl border border-cyan-500/30 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                <Eye className="w-3.5 h-3.5" />
                Wide-Angle Stereo Camera Feed (Simulated AI Inference)
              </span>
              <span className="font-mono-num text-[10px] text-slate-400">
                Res: 1080p @ 30FPS | YOLOv8
              </span>
            </div>

            {/* Simulated Vision Viewport Box */}
            <div className="w-full h-32 rounded-xl bg-gradient-to-b from-navy-900 to-navy-950 border border-slate-800 relative flex items-center justify-center overflow-hidden">
              {/* Scanline overlay */}
              <div className="scanner-line" />

              {/* Bounding box demonstration */}
              {robotState.status === 'avoiding_obstacle' ? (
                <div className="border-2 border-rose-500 bg-rose-500/10 p-2 rounded-lg text-center animate-pulse">
                  <span className="text-[10px] font-mono-num font-bold text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-500">
                    [OBSTACLE DETECTED: 98.4% CONFIDENCE]
                  </span>
                  <div className="text-xs font-bold text-white mt-1">
                    {robotState.sensors.detectedObject || 'Corridor Obstruction'}
                  </div>
                </div>
              ) : (
                <div className="border border-cyan-400/50 bg-cyan-500/5 p-2 rounded-lg text-center">
                  <span className="text-[10px] font-mono-num font-bold text-cyan-300 bg-navy-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    [PATHWAY CLEAR: 99.2%]
                  </span>
                  <div className="text-xs text-slate-300 mt-1">
                    Floor Plane Tracked • Hospital Corridor
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
