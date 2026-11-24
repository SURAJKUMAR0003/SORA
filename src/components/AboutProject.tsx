import React from 'react';
import { 
  Award, 
  Cpu, 
  Compass, 
  ShieldCheck, 
  HeartPulse, 
  Code2, 
  CheckCircle, 
  BookOpen, 
  ExternalLink,
  Layers
} from 'lucide-react';

export const AboutProject: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel-glow p-6 rounded-3xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-bold font-mono-num">
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            COLLEGE INNOVATION & ENGINEERING PROJECT DEMONSTRATION
          </div>
          <h2 className="text-2xl font-bold font-tech text-white">
            HOSPITAL AUTONOMY AI (SORA)
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            AI-Powered Autonomous Hospital Assistance, Mobility, Avoidance & Navigation System. Designed to eliminate hospital disorientation, streamline clinical logistics, and reduce healthcare staff physical fatigue.
          </p>
        </div>

        <div className="p-4 bg-navy-900/90 rounded-2xl border border-cyan-500/30 text-right space-y-1">
          <span className="text-[11px] text-slate-400 block font-mono-num font-semibold">ROBOT DESIGNATION</span>
          <div className="text-xl font-bold text-cyan-300 font-mono-num">SORA v4.2</div>
          <span className="text-[10px] text-emerald-400 block font-bold">Autonomous Hospital Escort</span>
        </div>
      </div>

      {/* Core Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pillar 1 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            1. A* Autonomous SLAM Navigation
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Grid-based path planning combined with real-time dynamic obstacle detection. Corridors, rooms, and blocked areas are segmented into safety collision zones with sub-second path recalculation.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-400/30 flex items-center justify-center text-purple-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            2. Multi-Modal Patient Interaction
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Natural speech dialogue via browser SpeechSynthesis and Web Speech Recognition paired with a wheelchair-height touch kiosk display. Accommodates pediatric, elderly, and mobility-impaired patients.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wide">
            3. Supervised Clinical Logistics
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Secure medicine transport with 5-stage pharmacy verification protocol and instant hospital trauma emergency broadcast (Code Blue) with real-time location telemetry.
          </p>
        </div>
      </div>

      {/* Tech Stack Breakdown & Hardware Blueprint */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          System Architecture & Technology Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-navy-900 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Frontend & Visualization</span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>React 19 & TypeScript</li>
              <li>Tailwind CSS + Glassmorphism</li>
              <li>Three.js 3D WebGL Robot</li>
              <li>Lucide UI Robotics Icons</li>
            </ul>
          </div>

          <div className="p-4 bg-navy-900 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Navigation & Algorithms</span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Grid A* Pathfinding</li>
              <li>Dynamic Costmap Rerouting</li>
              <li>Heading Angle Calculation</li>
              <li>Collision Boundary Checks</li>
            </ul>
          </div>

          <div className="p-4 bg-navy-900 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Audio & Natural Language</span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>SpeechSynthesis API (TTS)</li>
              <li>Web Speech Recognition</li>
              <li>Web Audio API Synthesizer</li>
              <li>Intent Action Matcher</li>
            </ul>
          </div>

          <div className="p-4 bg-navy-900 rounded-xl border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">Physical Robot Target</span>
            <ul className="text-slate-300 space-y-1 list-disc list-inside">
              <li>Raspberry Pi 4 (Edge Host)</li>
              <li>ESP32 Dual-Core (Motors)</li>
              <li>RPLiDAR A1 360° Sensor</li>
              <li>WebSocket / MQTT Protocol</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
