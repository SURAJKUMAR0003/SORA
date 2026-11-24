import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Sora3DViewer } from './Sora3DViewer';
import { 
  Compass, 
  UserCheck, 
  Calendar, 
  Pill, 
  FileText, 
  Receipt, 
  AlertOctagon, 
  Mic, 
  ArrowLeft,
  Navigation,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export const RobotTouchscreen: React.FC = () => {
  const {
    robotState,
    departments,
    doctors,
    navigateTo,
    speakSora,
    setActiveSection,
    emergencyStop
  } = useHospital();

  // Active kiosk screen workflow: 'home' | 'find_department' | 'find_doctor' | 'medicine_info' | 'billing' | 'emergency_confirm'
  const [currentScreen, setCurrentScreen] = useState<string>('home');
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  const handleDepartmentSelect = (deptId: string, deptName: string) => {
    setSelectedSubItem(deptId);
    speakSora(`Certainly! I will guide you to ${deptName}. Please follow me safely.`, 'navigating');
    navigateTo(deptId);
  };

  const handleDoctorSelect = (doc: typeof doctors[0]) => {
    // Escort to doctor's OPD room
    navigateTo('opd', `Escorting to ${doc.name} (${doc.roomNumber})`);
    speakSora(`Guiding you to ${doc.name} in ${doc.roomNumber}.`, 'navigating');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="glass-panel p-5 rounded-2xl flex items-center justify-between border border-cyan-500/20">
        <div>
          <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
            SORA ROBOT ONBOARD TOUCHSCREEN INTERFACE
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              MOUNTED KIOSK DISPLAY
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Interactive simulated touchscreen mounted directly on SORA's robotic torso
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 font-mono-num bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-700">
            Battery: <strong className="text-cyan-400">{robotState.batteryPct}%</strong>
          </span>
          <span className="text-xs text-slate-300 font-mono-num bg-navy-900 px-3 py-1.5 rounded-lg border border-slate-700">
            Status: <strong className="text-emerald-400 uppercase">{robotState.status}</strong>
          </span>
        </div>
      </div>

      {/* Main Kiosk Chassis Layout: 3D Robot Alongside Mounted Touchscreen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Side: Physical 3D Robot Mount (4 Cols) */}
        <div className="lg:col-span-4 glass-panel-glow rounded-3xl p-4 flex flex-col justify-between border border-cyan-500/30 min-h-[500px]">
          <div className="text-xs text-cyan-400 font-bold tracking-wider uppercase flex items-center justify-between pb-2 border-b border-cyan-500/20">
            <span>SORA ROBOT PHYSICAL UNIT</span>
            <span className="text-slate-400 font-mono-num">20 INCHES / AUTONOMOUS</span>
          </div>

          {/* 3D Canvas */}
          <div className="w-full flex-1 my-2 min-h-[340px]">
            <Sora3DViewer />
          </div>

          {/* Robot Screen Message Mirror */}
          <div className="p-3 bg-navy-950/80 rounded-2xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-[11px] text-cyan-300 font-bold mb-1">
              <Volume2 className="w-3.5 h-3.5 animate-pulse" />
              SORA VISOR MESSAGE
            </div>
            <p className="text-xs text-slate-200 italic leading-relaxed">
              "{robotState.screenMessage}"
            </p>
          </div>
        </div>

        {/* Right Side: Virtual Mounted Tablet Display (8 Cols) */}
        <div className="lg:col-span-8 bg-gradient-to-b from-navy-900/95 via-navy-950 to-navy-900 rounded-3xl p-6 border-4 border-slate-700/80 shadow-2xl relative flex flex-col justify-between min-h-[500px]">
          {/* Simulated Tablet Bezel & Front Camera Dot */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
          </div>

          {/* Kiosk Display Screen Header */}
          <div className="mt-2 flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <div className="flex items-center gap-2">
              {currentScreen !== 'home' && (
                <button
                  onClick={() => setCurrentScreen('home')}
                  className="p-1.5 rounded-lg bg-navy-800 hover:bg-navy-700 text-cyan-400 border border-cyan-500/30 transition mr-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                S
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {currentScreen === 'home' && 'HOW MAY SORA ASSIST YOU TODAY?'}
                  {currentScreen === 'find_department' && 'SELECT HOSPITAL DEPARTMENT'}
                  {currentScreen === 'find_doctor' && 'SELECT DOCTOR FOR ESCORT'}
                  {currentScreen === 'medicine_info' && 'CENTRAL PHARMACY CATALOG'}
                  {currentScreen === 'billing' && 'BILLING & CASHLESS CLEARANCE'}
                  {currentScreen === 'emergency_confirm' && 'EMERGENCY STAFF ASSISTANCE'}
                </h3>
                <span className="text-[11px] text-cyan-400">
                  Tap any option on screen or use voice commands
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono-num text-slate-300 font-bold">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-[10px] text-slate-400">Ground Floor Lobby</div>
            </div>
          </div>

          {/* Touchscreen Content Body */}
          <div className="my-5 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {/* SCREEN 1: HOME TOUCH GRID */}
            {currentScreen === 'home' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 1. Find Department */}
                <button
                  onClick={() => {
                    setCurrentScreen('find_department');
                    speakSora("Where would you like to go? Please select your destination department on the touchscreen.", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-cyan-500/30 hover:border-cyan-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-navy-950 transition">
                    <Compass className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Find Department</span>
                    <span className="text-[11px] text-slate-400">Navigate to rooms & wards</span>
                  </div>
                </button>

                {/* 2. Find Doctor */}
                <button
                  onClick={() => {
                    setCurrentScreen('find_doctor');
                    speakSora("Showing available specialists. Tap any doctor to have me escort you to their room.", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-blue-500/30 hover:border-blue-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 border border-blue-400/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-400 group-hover:text-navy-950 transition">
                    <UserCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Find Doctor</span>
                    <span className="text-[11px] text-slate-400">Search specialist doctors</span>
                  </div>
                </button>

                {/* 3. Book Appointment */}
                <button
                  onClick={() => {
                    setActiveSection('doctors');
                    speakSora("Switching to appointment scheduler. You can choose a convenient consultation slot.", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-indigo-500/30 hover:border-indigo-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-400 group-hover:text-navy-950 transition">
                    <Calendar className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Book Appointment</span>
                    <span className="text-[11px] text-slate-400">Schedule consultation</span>
                  </div>
                </button>

                {/* 4. Pharmacy */}
                <button
                  onClick={() => {
                    speakSora("Certainly! I will guide you to the central pharmacy.", 'navigating');
                    navigateTo('pharmacy');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-emerald-500/30 hover:border-emerald-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-navy-950 transition">
                    <Pill className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Pharmacy</span>
                    <span className="text-[11px] text-slate-400">Prescription pickup</span>
                  </div>
                </button>

                {/* 5. Medicine Information */}
                <button
                  onClick={() => {
                    setCurrentScreen('medicine_info');
                    speakSora("Here is the hospital medicine formulary and delivery portal.", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-teal-500/30 hover:border-teal-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/15 border border-teal-400/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-400 group-hover:text-navy-950 transition">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Medicine Info</span>
                    <span className="text-[11px] text-slate-400">Catalog & details</span>
                  </div>
                </button>

                {/* 6. Billing */}
                <button
                  onClick={() => {
                    setCurrentScreen('billing');
                    speakSora("Billing and discharge counter is located at Wing B. Would you like me to guide you there?", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-navy-800/90 to-navy-900 border border-amber-500/30 hover:border-amber-400 hover:bg-navy-800 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-400 group-hover:text-navy-950 transition">
                    <Receipt className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">Billing Counter</span>
                    <span className="text-[11px] text-slate-400">Cashless & discharge</span>
                  </div>
                </button>

                {/* 7. Emergency Help (Red Highlight) */}
                <button
                  onClick={() => {
                    setCurrentScreen('emergency_confirm');
                    speakSora("Emergency assistance mode requested. Please confirm to alert hospital staff.", 'alert');
                  }}
                  className="p-5 bg-gradient-to-br from-rose-900/60 to-rose-950/80 border-2 border-rose-500 hover:bg-rose-900 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-xl shadow-rose-900/40"
                >
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition animate-pulse">
                    <AlertOctagon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-rose-300 block">Emergency Help</span>
                    <span className="text-[11px] text-rose-200">Instant staff alert</span>
                  </div>
                </button>

                {/* 8. Talk to SORA (Voice) */}
                <button
                  onClick={() => {
                    setActiveSection('voice');
                    speakSora("I am listening! How may I assist you?", 'friendly');
                  }}
                  className="p-5 bg-gradient-to-br from-cyan-900/50 to-blue-950/80 border border-cyan-400 hover:border-cyan-300 hover:bg-cyan-950 rounded-2xl flex flex-col items-center justify-center text-center gap-3 transition-all hover:scale-[1.02] group shadow-lg"
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-400/20 border border-cyan-300 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-navy-950 transition">
                    <Mic className="w-7 h-7 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-cyan-300 block">Talk to SORA</span>
                    <span className="text-[11px] text-slate-300">Voice dialogue mode</span>
                  </div>
                </button>
              </div>
            )}

            {/* SCREEN 2: FIND DEPARTMENT */}
            {currentScreen === 'find_department' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Select a destination department below. SORA will autonomously escort you along the safest corridor path.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {departments.map(dept => (
                    <button
                      key={dept.id}
                      onClick={() => handleDepartmentSelect(dept.id, dept.name)}
                      className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between group ${
                        selectedSubItem === dept.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-white'
                          : 'bg-navy-900/80 border-slate-700/80 hover:border-cyan-400/60 hover:bg-navy-800'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold font-mono-num text-cyan-400">
                          {dept.code}
                        </div>
                        <div className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 mt-0.5">
                          {dept.name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {dept.description}
                        </div>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-navy-950 transition">
                        <Navigation className="w-4 h-4" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 3: FIND DOCTOR */}
            {currentScreen === 'find_doctor' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-300">
                  Select a consulting specialist. SORA will guide you directly to their OPD chamber room.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {doctors.map(doc => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-xl bg-navy-900/80 border border-slate-700 hover:border-cyan-400 transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-11 h-11 rounded-xl object-cover border border-cyan-500/30"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                          <span className="text-xs text-cyan-300 font-semibold">{doc.department}</span>
                          <div className="text-[11px] text-slate-400">{doc.roomNumber}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDoctorSelect(doc)}
                        className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-navy-950 border border-cyan-400 text-xs font-bold rounded-lg transition"
                      >
                        Escort Me
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN 4: MEDICINE INFO */}
            {currentScreen === 'medicine_info' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-300">
                  Central Pharmacy formulary information. Select Pharmacy & Delivery for automated hospital cart transport.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
                    <span className="text-xs text-cyan-400 font-bold">Amoxicillin 500mg</span>
                    <p className="text-[11px] text-slate-300 mt-1">Antibiotic capsule vault, Shelf A-04.</p>
                  </div>
                  <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
                    <span className="text-xs text-cyan-400 font-bold">Paracetamol IV 1000mg</span>
                    <p className="text-[11px] text-slate-300 mt-1">Parenteral analgesics infusion, Shelf C-12.</p>
                  </div>
                  <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
                    <span className="text-xs text-cyan-400 font-bold">Emergency Epinephrine</span>
                    <p className="text-[11px] text-slate-300 mt-1">STAT Anaphylaxis kit, Rapid Access Vault STAT-01.</p>
                  </div>
                  <div className="p-3 bg-navy-900 rounded-xl border border-slate-800">
                    <span className="text-xs text-cyan-400 font-bold">Sterile Saline 0.9%</span>
                    <p className="text-[11px] text-slate-300 mt-1">500ml IV Infusion, Bulk Bay Pallet IV-02.</p>
                  </div>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setActiveSection('pharmacy')}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs rounded-xl transition"
                  >
                    Open Pharmacy & Delivery Module →
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 5: BILLING */}
            {currentScreen === 'billing' && (
              <div className="p-5 bg-navy-900/90 rounded-2xl border border-amber-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Billing & Insurance Counter</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Located in Ground Floor Wing B. Clear outpatient bills, submit cashless TPA insurance claims, or collect discharge summaries.
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigateTo('billing');
                    speakSora("Guiding you to the Billing and Insurance Counter.", 'navigating');
                  }}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-navy-950 font-bold text-sm rounded-xl transition shadow-lg"
                >
                  Escort Me to Billing Counter
                </button>
              </div>
            )}

            {/* SCREEN 6: EMERGENCY CONFIRM */}
            {currentScreen === 'emergency_confirm' && (
              <div className="p-6 bg-rose-950/70 rounded-2xl border-2 border-rose-500 text-center space-y-4">
                <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto animate-bounce" />
                <div>
                  <h4 className="text-lg font-bold text-rose-200">CONFIRM EMERGENCY ASSISTANCE</h4>
                  <p className="text-xs text-rose-300 mt-1 max-w-md mx-auto">
                    This will broadcast your location at <strong>{robotState.currentZone}</strong> to hospital trauma staff, sounding the on-duty alert.
                  </p>
                </div>
                <div className="flex justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      emergencyStop();
                      setCurrentScreen('home');
                    }}
                    className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-rose-900/50"
                  >
                    BROADCAST CODE BLUE / CALL STAFF
                  </button>
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Kiosk Status Bar */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              SORA Autonomous Kiosk Operating Normally
            </span>
            <span className="font-mono-num text-[11px] text-slate-400">
              Firmware v4.2 | Touch Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
