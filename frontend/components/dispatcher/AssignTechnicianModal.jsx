'use client';

import React from 'react';

export default function AssignTechnicianModal({
  assigningDispatch,
  setAssigningDispatch,
  technicians,
  handleConfirmAssignment
}) {
  if (!assigningDispatch) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Assign Emergency Call</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Ticket: {assigningDispatch.id}</p>
          </div>
          <button 
            onClick={() => setAssigningDispatch(null)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs space-y-1">
            <p className="font-extrabold text-rose-800 text-sm">🚨 {assigningDispatch.title}</p>
            <p className="text-rose-700 font-semibold">📍 Address: {assigningDispatch.address}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black text-rose-600 bg-white/80 px-2 py-0.5 rounded border border-rose-200 uppercase tracking-wider">{assigningDispatch.priority}</span>
              <span className="text-[10px] font-black text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">{assigningDispatch.category}</span>
              {assigningDispatch.price && <span className="text-xs font-black text-emerald-600">₹{assigningDispatch.price}</span>}
            </div>
          </div>

          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Technician Roster (Real-Time Status)</label>
          
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {(() => {
              const getJobSpecialtyKey = (serviceName) => {
                const s = (serviceName || '').toLowerCase();
                if (s.includes('plumb')) return 'plumb';
                if (s.includes('elect')) return 'elect';
                if (s.includes('ac ') || s.includes('ac_') || s.includes('hvac') || s.includes('air conditioning') || s.includes('maintenance')) return 'hvac';
                if (s.includes('clean')) return 'clean';
                if (s.includes('appliance')) return 'appliance';
                if (s.includes('carpen')) return 'carpen';
                if (s.includes('paint')) return 'paint';
                if (s.includes('pest')) return 'pest';
                return s;
              };

              const isTechnicianMatch = (techSpecialty, jobService) => {
                if (!techSpecialty || !jobService) return false;
                const techKey = getJobSpecialtyKey(techSpecialty);
                const jobKey = getJobSpecialtyKey(jobService);
                return techKey === jobKey || techSpecialty.toLowerCase().includes(jobKey) || jobService.toLowerCase().includes(techKey);
              };

              const jobCategory = assigningDispatch.techSpecialty || assigningDispatch.category || '';
              const filteredTechs = technicians.filter(tech => isTechnicianMatch(tech.specialty, jobCategory));

              if (filteredTechs.length === 0) {
                return (
                  <div className="text-center py-8 px-4 text-xs text-slate-550 font-bold border border-dashed border-slate-200 rounded-xl bg-slate-50">
                    ⚠️ No active technicians registered for "{jobCategory}" specialty in the database.
                  </div>
                );
              }

              return filteredTechs.map((tech) => {
                const isCapacityFull = (tech.assigned || 0) >= 6;
                const isOffline = tech.status === 'Offline' || isCapacityFull;
                const isBusy = tech.status === 'Busy';
                const isMatch = assigningDispatch.techSpecialty 
                  ? tech.specialty.toLowerCase().includes(assigningDispatch.techSpecialty.toLowerCase()) 
                  : tech.name.toLowerCase() === assigningDispatch.recommendedTech?.toLowerCase();

                return (
                  <button
                    key={tech.name}
                    disabled={isOffline}
                    onClick={() => !isOffline && handleConfirmAssignment(tech.name)}
                    className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all group ${
                      isOffline 
                        ? 'border-slate-200 bg-slate-100/60 opacity-60 cursor-not-allowed'
                        : isBusy
                          ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50'
                          : isMatch 
                            ? 'border-blue-500 bg-blue-50/40 hover:bg-blue-50' 
                            : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-700">{tech.name}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isOffline 
                            ? 'bg-slate-200 text-slate-600'
                            : isBusy
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          ● {tech.status}
                        </span>
                        {isMatch && !isOffline && (
                          <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                            ⭐ Specialty Match
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                        {tech.specialty} • Zone: {tech.zone || 'Bengaluru'}
                        {isOffline && ' • (Receives No Assignments)'}
                        {isBusy && ' • (Finishing Existing Work)'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#0A2540] block">{tech.assigned} / 6 jobs</span>
                      <span className="text-[9px] font-bold text-slate-400 block">{tech.travel} in transit</span>
                    </div>
                  </button>
                );
              });
            })()}
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={() => setAssigningDispatch(null)}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
