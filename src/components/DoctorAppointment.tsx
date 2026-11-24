import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  UserCheck, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle, 
  AlertCircle, 
  Navigation, 
  MapPin, 
  Star,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';

export const DoctorAppointment: React.FC = () => {
  const { doctors, appointments, bookAppointment, navigateTo, speakSora } = useHospital();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchDoctor, setSearchDoctor] = useState<string>('');
  
  // Booking modal/state
  const [bookingDoctor, setBookingDoctor] = useState<typeof doctors[0] | null>(null);
  const [patientName, setPatientName] = useState<string>('');
  const [patientPhone, setPatientPhone] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [appointmentDate, setAppointmentDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [confirmedPass, setConfirmedPass] = useState<typeof appointments[0] | null>(null);

  const departments = ['All', 'Cardiology', 'Neurology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Dermatology'];

  const filteredDoctors = doctors.filter(doc => {
    const matchDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchSearch = doc.name.toLowerCase().includes(searchDoctor.toLowerCase()) ||
                        doc.qualification.toLowerCase().includes(searchDoctor.toLowerCase());
    return matchDept && matchSearch;
  });

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDoctor || !patientName || !selectedSlot) return;

    const newApt = bookAppointment({
      patientName,
      patientPhone: patientPhone || '+1 (555) 012-3456',
      department: bookingDoctor.department,
      doctorName: bookingDoctor.name,
      doctorRoom: bookingDoctor.roomNumber,
      date: appointmentDate,
      timeSlot: selectedSlot
    });

    setConfirmedPass(newApt);
    setBookingDoctor(null);
    setPatientName('');
    setSelectedSlot('');
  };

  const handleEscortToDoctor = (doc: typeof doctors[0]) => {
    speakSora(`Guiding you to ${doc.name} in ${doc.roomNumber}.`, 'navigating');
    navigateTo('opd', `Escort to ${doc.name} (${doc.roomNumber})`);
  };

  return (
    <div className="space-y-6">
      {/* Module Title Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Stethoscope className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              DOCTOR DIRECTORY & APPOINTMENT BOOKING
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                OPD CLINICAL SUITE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Search hospital specialists, view real-time availability slots, and book simulated consultations
            </p>
          </div>
        </div>

        {/* Prototype Disclaimer Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Prototype Demonstration Records — Not for real medical booking</span>
        </div>
      </div>

      {/* Department Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap gap-2">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedDept === dept
                  ? 'bg-cyan-500 text-navy-950 shadow-md shadow-cyan-500/20'
                  : 'bg-navy-900/80 text-slate-300 hover:bg-navy-800 border border-slate-700/80'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search doctor by name..."
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
            className="bg-navy-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-56"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div
            key={doc.id}
            className="glass-panel-interactive p-5 rounded-2xl border border-slate-800 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-cyan-500/30 shadow-md"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white">{doc.name}</h3>
                    <span className="text-xs text-cyan-400 font-semibold">{doc.department}</span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 mt-0.5">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-500">({doc.experienceYears} yrs exp)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs space-y-2">
                <div className="text-slate-300">
                  <span className="text-slate-400 block text-[11px]">Qualification</span>
                  {doc.qualification}
                </div>
                <div className="flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono-num font-semibold">{doc.roomNumber}</span>
                </div>
              </div>

              {/* Available Slots Preview */}
              <div className="mt-3">
                <div className="text-[11px] text-slate-400 font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-cyan-400" />
                  Available Today:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {doc.slots.map(slot => (
                    <span
                      key={slot}
                      className="px-2 py-0.5 rounded-md bg-navy-900 border border-slate-700 text-[10px] text-slate-300 font-mono-num"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => setBookingDoctor(doc)}
                className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-navy-950 font-bold text-xs rounded-xl transition shadow-md"
              >
                Book Appointment
              </button>
              <button
                onClick={() => handleEscortToDoctor(doc)}
                className="p-2 bg-navy-900 hover:bg-navy-800 border border-slate-700 text-cyan-400 rounded-xl text-xs transition"
                title="SORA Escort to Doctor's Room"
              >
                <Navigation className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Bookings Records Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          Confirmed Simulated Appointments ({appointments.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono-num uppercase text-[11px]">
                <th className="pb-3">Token</th>
                <th className="pb-3">Patient Name</th>
                <th className="pb-3">Doctor</th>
                <th className="pb-3">Department</th>
                <th className="pb-3">Room</th>
                <th className="pb-3">Slot</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {appointments.map(apt => (
                <tr key={apt.id} className="hover:bg-navy-900/50 transition">
                  <td className="py-3 font-mono-num font-bold text-cyan-300">
                    {apt.tokenNumber}
                  </td>
                  <td className="py-3 font-semibold text-white">
                    {apt.patientName}
                  </td>
                  <td className="py-3">{apt.doctorName}</td>
                  <td className="py-3 text-slate-400">{apt.department}</td>
                  <td className="py-3 font-mono-num">{apt.doctorRoom}</td>
                  <td className="py-3 font-mono-num">{apt.timeSlot} ({apt.date})</td>
                  <td className="py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-semibold text-[10px]">
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Form Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md">
          <div className="glass-panel-glow p-6 rounded-3xl max-w-md w-full border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Book Simulated Consultation</h3>
                <p className="text-xs text-cyan-400">{bookingDoctor.name} ({bookingDoctor.department})</p>
              </div>
              <button
                onClick={() => setBookingDoctor(null)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Smith"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Contact Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Appointment Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full bg-navy-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Select Time Slot *</label>
                <div className="grid grid-cols-2 gap-2">
                  {bookingDoctor.slots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 rounded-xl border text-center font-mono-num font-bold transition ${
                        selectedSlot === slot
                          ? 'bg-cyan-500 text-navy-950 border-cyan-400'
                          : 'bg-navy-900 text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-navy-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 inline mr-1" />
                Hospital Demo System: Token will be generated automatically. SORA can escort you to {bookingDoctor.roomNumber}.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={!patientName || !selectedSlot}
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 disabled:opacity-40 text-navy-950 font-bold rounded-xl transition shadow-lg"
                >
                  Confirm Booking
                </button>
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Pass Modal */}
      {confirmedPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/85 backdrop-blur-md">
          <div className="glass-panel-glow p-6 rounded-3xl max-w-sm w-full border border-emerald-500/50 shadow-2xl text-center space-y-4">
            <CheckCircle className="w-14 h-14 text-emerald-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Appointment Confirmed!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your consultation token has been generated.
              </p>
            </div>

            <div className="p-4 bg-navy-950 rounded-2xl border border-cyan-500/30 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Token Number:</span>
                <span className="font-mono-num font-bold text-cyan-300 text-sm">
                  {confirmedPass.tokenNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Patient:</span>
                <span className="font-semibold text-white">{confirmedPass.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doctor:</span>
                <span className="font-semibold text-white">{confirmedPass.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chamber:</span>
                <span className="font-mono-num text-cyan-400 font-bold">{confirmedPass.doctorRoom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span className="font-mono-num text-white">{confirmedPass.timeSlot}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setConfirmedPass(null);
                navigateTo('opd', `Escort for Token ${confirmedPass.tokenNumber} to ${confirmedPass.doctorRoom}`);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-navy-950 font-bold text-xs rounded-xl transition shadow-lg"
            >
              Have SORA Escort Me to OPD Chamber
            </button>
            <button
              onClick={() => setConfirmedPass(null)}
              className="w-full py-2 bg-navy-900 text-slate-400 hover:text-white text-xs font-semibold rounded-xl"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
