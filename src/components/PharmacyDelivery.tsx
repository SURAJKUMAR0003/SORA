import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Pill, 
  Truck, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  AlertCircle, 
  Send, 
  ArrowRight,
  PackageCheck,
  CheckCheck
} from 'lucide-react';
import { DeliveryPipelineStage } from '../types';

export const PharmacyDelivery: React.FC = () => {
  const { 
    medicines, 
    deliveries, 
    requestMedicineDelivery, 
    advanceDeliveryStage, 
    departments 
  } = useHospital();

  const [searchMedicine, setSearchMedicine] = useState<string>('');
  const [selectedMedicine, setSelectedMedicine] = useState<string>(medicines[0]?.name || '');
  const [destinationZone, setDestinationZone] = useState<string>('ICU (Intensive Care Unit)');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'STAT (Emergency)'>('Routine');

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchMedicine.toLowerCase()) ||
    m.genericName.toLowerCase().includes(searchMedicine.toLowerCase()) ||
    m.category.toLowerCase().includes(searchMedicine.toLowerCase())
  );

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine || !destinationZone) return;
    requestMedicineDelivery(selectedMedicine, destinationZone, priority);
  };

  const getStageBadge = (stage: DeliveryPipelineStage) => {
    switch (stage) {
      case 'request_received':
        return { label: '1. Request Received', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
      case 'pharmacy_verification':
        return { label: '2. Pharmacy Verification', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'authorized_preparation':
        return { label: '3. Authorized Prep', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'robot_delivery':
        return { label: '4. Robot In Transit', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse' };
      case 'delivery_completed':
        return { label: '5. Completed & Verified', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Pill className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              CENTRAL PHARMACY & AUTONOMOUS DELIVERY
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                AUTHORIZED PIPELINE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Formulary catalog, hospital cart dispatch, and multi-stage verification pipeline
            </p>
          </div>
        </div>

        {/* Safety & Prescription Disclaimer */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>Supervised Hospital Demo: All deliveries require pharmacist authorization</span>
        </div>
      </div>

      {/* Grid: Medicine Catalog & Request Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Medicine Formulary Directory (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Pill className="w-4 h-4 text-emerald-400" />
                Hospital Medicine Formulary
              </h3>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Search medication..."
                  value={searchMedicine}
                  onChange={(e) => setSearchMedicine(e.target.value)}
                  className="bg-navy-900 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-48"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {filteredMedicines.map(med => (
                <div
                  key={med.id}
                  onClick={() => setSelectedMedicine(med.name)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                    selectedMedicine === med.name
                      ? 'bg-emerald-500/15 border-emerald-400/80'
                      : 'bg-navy-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        {med.name}
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 font-mono-num">
                          {med.dosageForm}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Generic: <strong className="text-slate-300">{med.genericName}</strong> | Category: {med.category}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono-num">
                        Location: {med.shelfLocation} | Storage: {med.temperatureStorage}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono-num font-bold text-emerald-400">
                        {med.stockCount} in stock
                      </span>
                      <button
                        type="button"
                        className="block mt-1 text-[11px] font-semibold text-cyan-400 hover:underline"
                      >
                        Select for Delivery →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Simulated Delivery Request (5 Cols) */}
        <div className="lg:col-span-5 glass-panel-glow p-5 rounded-2xl border border-cyan-500/30 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            Dispatch Autonomous Delivery Request
          </h3>

          <form onSubmit={handleDeliverySubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Selected Medication</label>
              <select
                value={selectedMedicine}
                onChange={(e) => setSelectedMedicine(e.target.value)}
                className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {medicines.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name} ({m.dosageForm})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Destination Ward / Zone</label>
              <select
                value={destinationZone}
                onChange={(e) => setDestinationZone(e.target.value)}
                className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
              >
                {departments
                  .filter(d => d.id !== 'pharmacy')
                  .map(dept => (
                    <option key={dept.id} value={dept.name}>
                      {dept.code} - {dept.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-semibold">Delivery Urgency Priority</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Routine', 'Urgent', 'STAT (Emergency)'] as const).map(p => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 rounded-xl border text-[11px] font-bold text-center transition ${
                      priority === p
                        ? p.includes('STAT')
                          ? 'bg-rose-500 text-white border-rose-400'
                          : 'bg-cyan-500 text-navy-950 border-cyan-400'
                        : 'bg-navy-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-navy-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-cyan-400 inline mr-1" />
              SORA's secure front storage compartment will unlock at the destination only upon staff PIN / NFC verification.
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-navy-950 font-bold text-xs rounded-xl transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Supervised Delivery Request
            </button>
          </form>
        </div>
      </div>

      {/* 5-Stage Delivery Pipeline Simulation Queue */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-cyan-400" />
            Autonomous Medicine Delivery Pipeline ({deliveries.length} Missions)
          </h3>
          <span className="text-xs text-slate-400">
            Click "Advance Pipeline Stage" to simulate hospital authorization progression
          </span>
        </div>

        <div className="space-y-4">
          {deliveries.map(del => {
            const badge = getStageBadge(del.stage);
            return (
              <div
                key={del.id}
                className="p-4 bg-navy-900/80 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-num font-bold text-cyan-300 text-xs">
                      #{del.id}
                    </span>
                    <span className="text-sm font-bold text-white">
                      {del.medicineName} (Qty: {del.quantity})
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                      del.priority.includes('STAT')
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}>
                      {del.priority}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Destination: <strong className="text-slate-200">{del.destinationZone}</strong></span>
                    <span>•</span>
                    <span>Requested by: {del.requestedBy}</span>
                    <span>•</span>
                    <span>Supervising Pharmacist: {del.verificationDoctor}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${badge.color}`}>
                    {badge.label}
                  </span>

                  {del.stage !== 'delivery_completed' ? (
                    <button
                      onClick={() => advanceDeliveryStage(del.id)}
                      className="px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-navy-950 border border-cyan-400 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                    >
                      Advance Stage
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-emerald-400 font-bold">
                      <CheckCheck className="w-4 h-4" />
                      Delivered
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
