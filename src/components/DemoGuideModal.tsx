import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Sparkles, 
  Play, 
  Square, 
  CheckCircle2, 
  ArrowRight, 
  Compass, 
  Volume2, 
  AlertTriangle, 
  Trophy,
  X
} from 'lucide-react';

export const DemoGuideModal: React.FC = () => {
  const { isDemoRunning, demoStepNumber, startDemo, stopDemo } = useHospital();

  const demoSteps = [
    {
      step: 1,
      title: 'SORA Introduces Itself Aloud',
      desc: '"Hello! I am SORA, your hospital assistance robot. How can I help you today?"',
      badge: 'Voice Introduction'
    },
    {
      step: 2,
      title: 'Touchscreen Destination Choice',
      desc: 'The visitor selects Central Pharmacy on the robot touchscreen.',
      badge: 'UI Touch Interaction'
    },
    {
      step: 3,
      title: 'Audible Spoken Confirmation',
      desc: 'SORA replies: "Certainly! I will guide you to the central pharmacy."',
      badge: 'Speech Synthesis'
    },
    {
      step: 4,
      title: 'Autonomous Navigation Starts',
      desc: 'SORA activates motors and begins moving along the corridor toward Pharmacy.',
      badge: 'Motion Actuation'
    },
    {
      step: 5,
      title: 'Live Route & Telemetry Tracing',
      desc: 'The digital twin map renders the real-time A* path and robot position coordinates.',
      badge: 'A* Pathfinding'
    },
    {
      step: 6,
      title: 'Dynamic Obstacle Appears in Corridor',
      desc: 'An emergency stretcher unexpectedly blocks the corridor path ahead.',
      badge: 'Dynamic Hazard'
    },
    {
      step: 7,
      title: 'Obstacle Detection & Reroute',
      desc: 'Sensor radar alerts, SORA stops safely, and dynamically recalculates alternate corridor route.',
      badge: 'Collision Avoidance'
    },
    {
      step: 8,
      title: 'Safe Arrival at Pharmacy',
      desc: 'SORA smoothly reaches the Central Pharmacy dispensary doorway.',
      badge: 'Precision Escort'
    },
    {
      step: 9,
      title: 'Arrival Announcement Aloud',
      desc: 'SORA announces: "We have arrived at the pharmacy. Is there anything else I can help you with?"',
      badge: 'Voice Feedback'
    },
    {
      step: 10,
      title: 'Mission Logged & Verified',
      desc: 'Activity log records the successful escort, updates telemetry counter, and concludes demo.',
      badge: 'Audit & Telemetry'
    }
  ];

  if (!isDemoRunning && demoStepNumber === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full bg-navy-950/95 border-2 border-cyan-400/80 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-float-slow">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
            <Trophy className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              10-STEP GUIDED DEMO MODE
            </h4>
            <span className="text-[11px] text-cyan-400 font-mono-num font-bold">
              STEP {demoStepNumber} OF 10
            </span>
          </div>
        </div>

        <button
          onClick={stopDemo}
          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="End Demonstration"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Current Step Description Card */}
      {demoStepNumber > 0 && demoStepNumber <= 10 && (
        <div className="my-3 p-3.5 bg-navy-900/90 rounded-2xl border border-cyan-500/40 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-cyan-300 font-bold uppercase">
              {demoSteps[demoStepNumber - 1].badge}
            </span>
            <span className="text-emerald-400 font-mono-num flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Executing
            </span>
          </div>
          <h5 className="text-sm font-bold text-white">
            {demoSteps[demoStepNumber - 1].title}
          </h5>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            {demoSteps[demoStepNumber - 1].desc}
          </p>
        </div>
      )}

      {/* Mini Step Tracker Dots */}
      <div className="flex items-center justify-between gap-1 py-1">
        {demoSteps.map(s => (
          <div
            key={s.step}
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              s.step === demoStepNumber
                ? 'bg-cyan-400 h-2 shadow-md shadow-cyan-400/50'
                : s.step < demoStepNumber
                ? 'bg-emerald-400'
                : 'bg-slate-800'
            }`}
            title={`Step ${s.step}: ${s.title}`}
          />
        ))}
      </div>

      {/* Stop / Cancel Demo Button */}
      <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
        <span className="text-slate-400 text-[11px]">Auto-progressing sequence...</span>
        <button
          onClick={stopDemo}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
        >
          Stop Demo
        </button>
      </div>
    </div>
  );
};
