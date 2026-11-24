import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { HomeDashboard } from './components/HomeDashboard';
import { VirtualHospitalMap } from './components/VirtualHospitalMap';
import { RobotTouchscreen } from './components/RobotTouchscreen';
import { RobotControlPanel } from './components/RobotControlPanel';
import { VoiceAssistant } from './components/VoiceAssistant';
import { DoctorAppointment } from './components/DoctorAppointment';
import { PharmacyDelivery } from './components/PharmacyDelivery';
import { EmergencyAssistance } from './components/EmergencyAssistance';
import { SystemMonitoring } from './components/SystemMonitoring';
import { AboutProject } from './components/AboutProject';
import { HardwareIntegration } from './components/HardwareIntegration';
import { DemoGuideModal } from './components/DemoGuideModal';
import { 
  LayoutDashboard, 
  Map, 
  Sliders, 
  Mic, 
  Stethoscope, 
  Pill, 
  AlertOctagon, 
  Activity, 
  Info, 
  Cpu, 
  Menu, 
  X, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Smartphone,
  ShieldAlert
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    robotState, 
    startDemo, 
    isVoiceMuted, 
    toggleMuteVoice, 
    returnToReception,
    emergencyStop 
  } = useHospital();

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: 'dashboard', label: 'Home Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Virtual Hospital', icon: Map, badge: 'A* Grid' },
    { id: 'kiosk', label: 'Robot Touchscreen', icon: Smartphone, badge: 'Mounted' },
    { id: 'control', label: 'Robot Control', icon: Sliders },
    { id: 'voice', label: 'AI Voice Assistant', icon: Mic, badge: 'SORA' },
    { id: 'doctors', label: 'Doctor & Appointment', icon: Stethoscope },
    { id: 'pharmacy', label: 'Pharmacy & Delivery', icon: Pill },
    { id: 'emergency', label: 'Emergency Assistance', icon: AlertOctagon, alert: true },
    { id: 'monitoring', label: 'System Monitoring', icon: Activity },
    { id: 'hardware', label: 'Hardware Bridge', icon: Cpu, badge: 'ESP32' },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-navy-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-navy-950">
      {/* Top Professional Robotics Navigation Header */}
      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-8 py-3 flex items-center justify-between shadow-xl">
        {/* Brand & SORA Status Tag */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl bg-navy-900 border border-slate-700 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div 
            onClick={() => setActiveSection('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-navy-950 font-bold text-lg shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tech text-base sm:text-lg font-bold text-white tracking-wide">
                  HOSPITAL AUTONOMY AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono-num font-bold">
                  SORA v4.2
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Autonomous Hospital Mobility, Avoidance & Patient Escort System
              </p>
            </div>
          </div>
        </div>

        {/* Header Telemetry Badges & Quick Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* SORA Live Status Pill */}
          <div className="hidden md:flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-navy-900/80 border border-cyan-500/30 text-xs">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${
                robotState.emergencyActive
                  ? 'bg-rose-500 animate-ping'
                  : robotState.status === 'navigating'
                  ? 'bg-cyan-400 animate-pulse'
                  : 'bg-emerald-400'
              }`} />
              <strong className="text-white font-mono-num uppercase">{robotState.status}</strong>
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300 truncate max-w-[130px]">{robotState.currentZone}</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-300 font-mono-num font-bold">{robotState.batteryPct}%</span>
          </div>

          {/* 10-Step Innovation Demo Trigger Button */}
          <button
            onClick={startDemo}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-navy-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Demo</span>
          </button>

          {/* Voice Mute Toggle */}
          <button
            onClick={toggleMuteVoice}
            className={`p-2 rounded-xl border transition ${
              isVoiceMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-navy-900 text-cyan-400 border-cyan-500/30 hover:bg-navy-800'
            }`}
            title={isVoiceMuted ? 'Voice Muted (Click to Unmute)' : 'Voice Audio Active'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Emergency Halt */}
          <button
            onClick={emergencyStop}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 text-rose-300 font-bold text-xs transition flex items-center gap-1.5"
            title="Emergency Stop"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden md:inline">E-STOP</span>
          </button>
        </div>
      </header>

      {/* Main Body Container with Sidebar + View Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col justify-between bg-navy-950/80 border-r border-slate-800/80 p-4 space-y-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2 font-mono-num">
              SYSTEM SECTIONS
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : item.alert
                      ? 'text-rose-400 hover:bg-rose-950/30'
                      : 'text-slate-300 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : ''}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.2 rounded-md bg-navy-900 border border-slate-700 text-slate-400 font-mono-num">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Hardware Dock Widget in Sidebar Footer */}
          <div className="p-3.5 bg-navy-900/60 rounded-2xl border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Autonomous Base</span>
              <span className="text-cyan-400 font-mono-num font-bold">DOCK-01</span>
            </div>
            <button
              onClick={returnToReception}
              className="w-full py-2 bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              Dock at Reception
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-navy-950/95 backdrop-blur-md p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-tech text-lg font-bold text-white">NAVIGATION MENU</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveSection(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-300 hover:bg-navy-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={startDemo}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-600 text-navy-950 font-bold rounded-xl text-sm"
            >
              Start Innovation Demo Mode
            </button>
          </div>
        )}

        {/* Main Dynamic View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeSection === 'dashboard' && <HomeDashboard />}
          {activeSection === 'map' && <VirtualHospitalMap />}
          {activeSection === 'kiosk' && <RobotTouchscreen />}
          {activeSection === 'control' && <RobotControlPanel />}
          {activeSection === 'voice' && <VoiceAssistant />}
          {activeSection === 'doctors' && <DoctorAppointment />}
          {activeSection === 'pharmacy' && <PharmacyDelivery />}
          {activeSection === 'emergency' && <EmergencyAssistance />}
          {activeSection === 'monitoring' && <SystemMonitoring />}
          {activeSection === 'hardware' && <HardwareIntegration />}
          {activeSection === 'about' && <AboutProject />}
        </main>
      </div>

      {/* Floating 10-Step Innovation Demo Modal / Tracker */}
      <DemoGuideModal />
    </div>
  );
};

export function App() {
  return (
    <HospitalProvider>
      <MainLayout />
    </HospitalProvider>
  );
}

export default App;
