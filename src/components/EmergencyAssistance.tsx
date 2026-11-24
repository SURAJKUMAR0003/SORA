import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  AlertOctagon, 
  ShieldAlert, 
  Radio, 
  PhoneCall, 
  MapPin, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Siren,
  HeartPulse
} from 'lucide-react';

export const EmergencyAssistance: React.FC = () => {
  const { 
    robotState, 
    emergencyStop, 
    clearEmergency, 
    speakSora, 
    addLog,
    navigateTo 
  } = useHospital();

  const [emergencyTriggered, setEmergencyTriggered] = useState<boolean>(robotState.emergencyActive);
  const [selectedProtocol, setSelectedProtocol] = useState<string>('CODE_BLUE');

  const handleActivateEmergency = (protocolName: string) => {
    setSelectedProtocol(protocolName);
    setEmergencyTriggered(true);
    emergencyStop();

    speakSora(
      `Emergency protocol ${protocolName} activated at ${robotState.currentZone}. Hospital trauma and rapid response staff alerted.`,
      'alert'
    );

    addLog({
      category: 'emergency',
      level: 'emergency',
      title: `EMERGENCY BROADCAST: ${protocolName}`,
      details: `Dispatched hospital rapid response team to ${robotState.currentZone} [Pos: ${robotState.position.x}, ${robotState.position.y}]. Robot beacon illuminated.`,
      location: robotState.currentZone
    });
  };

  const handleClear = () => {
    setEmergencyTriggered(false);
    clearEmergency();
  };

  const handleEscortToER = () => {
    navigateTo('emergency', 'Priority Patient Escort to Emergency Department');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-rose-500/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              HOSPITAL EMERGENCY ASSISTANCE & BEACON
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono-num font-bold">
                CODE RED / BLUE PROTOCOLS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Immediate hospital staff broadcast, distress beacon, and automated rapid-response dispatch
            </p>
          </div>
        </div>

        {/* Clear Educational / Prototype Notice */}
        <div className="px-3.5 py-1.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Simulation Demonstration Notice: Connected to simulated campus intranet</span>
        </div>
      </div>

      {/* Emergency Active Banner if Triggered */}
      {emergencyTriggered && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-500 shadow-2xl animate-pulse space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/50">
                <AlertOctagon className="w-8 h-8 animate-bounce" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono-num font-bold text-rose-300 tracking-wider">
                  RAPID RESPONSE ALERT ACTIVE
                </span>
                <h3 className="text-xl font-bold text-white">
                  EMERGENCY BROADCAST TRANSMITTED: {selectedProtocol}
                </h3>
                <p className="text-xs text-rose-200 mt-0.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white" />
                  SORA Location: <strong>{robotState.currentZone}</strong> [Grid: {robotState.position.x}, {robotState.position.y}]
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleClear}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl transition shadow-lg flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Staff Arrived / Clear Emergency
              </button>
            </div>
          </div>

          <div className="p-3 bg-rose-950/80 rounded-xl border border-rose-400/30 text-xs text-rose-100 flex items-center justify-between">
            <span>
              ✓ Simulated Hospital Staff Pager Broadcast Sent (ID: #EMG-{Date.now().toString().slice(-4)})
            </span>
            <span className="font-mono-num font-bold text-rose-300">
              Response Team ETA: ~45 SEC
            </span>
          </div>
        </div>
      )}

      {/* Emergency Trigger Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Protocol 1: Code Blue (Cardiac / Respiratory Arrest) */}
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 hover:border-rose-400 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-3">
              <HeartPulse className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">CODE BLUE (Cardiac Arrest)</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Immediate alert for patient experiencing cardiac, respiratory, or vital collapse. Dispatches crash cart & resuscitation physicians.
            </p>
          </div>
          <button
            onClick={() => handleActivateEmergency('CODE_BLUE (CARDIAC ARREST)')}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-rose-600/30"
          >
            ACTIVATE CODE BLUE
          </button>
        </div>

        {/* Protocol 2: Trauma / Fall Emergency */}
        <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 hover:border-amber-400 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">PATIENT FALL / TRAUMA</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Visitor or inpatient fall in corridor or waiting area. Requests on-duty nursing team with mobile stretcher support.
            </p>
          </div>
          <button
            onClick={() => handleActivateEmergency('PATIENT FALL / CORRIDOR TRAUMA')}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-lg shadow-amber-600/30"
          >
            DISPATCH NURSING STAFF
          </button>
        </div>

        {/* Protocol 3: Immediate Escort to ER */}
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 hover:border-cyan-400 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">ESCORT TO EMERGENCY ROOM</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              If the patient is ambulatory or assisted, SORA clears the corridor path and rapidly escorts them to the 24/7 Level-1 Trauma Bay.
            </p>
          </div>
          <button
            onClick={handleEscortToER}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs rounded-xl transition shadow-lg shadow-cyan-500/30"
          >
            ESCORTE TO ER TRIAGE (BAY 01)
          </button>
        </div>
      </div>

      {/* Safety Mechanisms & Hardware E-Stop Interlock Specs */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          Autonomous Robotics Safety Interlock Architecture
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          SORA incorporates multi-tier redundant safety systems designed in accordance with medical robotics ISO 13482 safety requirements:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
            <strong className="text-cyan-400 block mb-1">1. Hardware E-Stop Relay</strong>
            Physical mushroom switch and software kill-flag immediately disengage motor H-bridge PWM circuits.
          </div>
          <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
            <strong className="text-cyan-400 block mb-1">2. LiDAR Safety Halo (30cm)</strong>
            360-degree laser rangefinder automatically halts movement if any human or object breaches 30cm safety bubble.
          </div>
          <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
            <strong className="text-cyan-400 block mb-1">3. Hospital Telemetry Beacon</strong>
            Transmits high-priority packet over local Wi-Fi / MQTT broker to nurse station dashboard with GPS/grid coordinate overlay.
          </div>
        </div>
      </div>
    </div>
  );
};
