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
    <div className="fixed inset-0 z-[2500] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Assign Emergency Call</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Ticket: {assigningDispatch.id}</p>
          </div>
          <button 
            onClick={() => setAssigningDispatch(null)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs space-y-1">
            <p className="font-extrabold text-rose-800 text-sm">🚨 {assigningDispatch.title}</p>
            <p className="text-rose-700 font-semibold">📍 Address: {assigningDispatch.address}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-black text-slate-700 bg-white/80 px-2 py-0.5 rounded border border-slate-200 uppercase tracking-wider">{assigningDispatch.category}</span>
              {assigningDispatch.price && <span className="text-xs font-black text-emerald-600">₹{assigningDispatch.price}</span>}
            </div>
          </div>

          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Select Technician Roster (Real-Time Status)
          </label>
          
          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
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
              
              // 1. Exclude technicians who have reached capacity (>= 6 jobs)
              const availableCapacityTechs = technicians.filter(tech => (tech.assigned || 0) < 6);
              
              // 2. Filter matching technicians under 6 jobs
              const filteredTechs = availableCapacityTechs.filter(tech => isTechnicianMatch(tech.specialty, jobCategory));

              // If no matching technicians under 6 jobs, fallback to other available capacity techs
              const displayTechs = filteredTechs.length > 0 ? filteredTechs : availableCapacityTechs;

              if (displayTechs.length === 0) {
                return (
                  <div className="text-center py-8 px-4 text-xs text-rose-600 font-bold border border-dashed border-rose-200 rounded-xl bg-rose-50/50">
                    ⚠️ No available technicians (all technicians for "{jobCategory}" have reached 6/6 jobs capacity or are offline).
                  </div>
                );
              }

              return displayTechs.map((tech) => {
                const rawStatus = (tech.status || '').toLowerCase();
                const isBusy = rawStatus.includes('busy') || rawStatus.includes('started');
                const isOffline = rawStatus.includes('offline');
                const isNotAssignable = isBusy || isOffline;
                
                const isMatch = isTechnicianMatch(tech.specialty, jobCategory);

                return (
                  <button
                    key={tech.id || tech.name}
                    disabled={isNotAssignable}
                    onClick={() => !isNotAssignable && handleConfirmAssignment(tech.name)}
                    className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all group ${
                      isNotAssignable 
                        ? 'border-slate-200 bg-slate-100/70 opacity-60 cursor-not-allowed'
                        : isMatch 
                          ? 'border-blue-500 bg-blue-50/40 hover:bg-blue-50 cursor-pointer shadow-xs' 
                          : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50 cursor-pointer'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-700">{tech.name}</h4>
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                          isOffline 
                            ? 'bg-slate-200 text-slate-600'
                            : isBusy
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          ● {tech.status}
                        </span>
                        {isMatch && !isNotAssignable && (
                          <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                            ⭐ Specialty Match
                          </span>
                        )}
                        {isNotAssignable && (
                          <span className="text-[9px] font-black bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200">
                            🚫 Cannot Assign
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">
                        {tech.specialty} • Zone: {tech.zone || 'Mangaluru'}
                        {isOffline && ' • (Offline)'}
                        {isBusy && ' • (Busy on Duty - Cannot Assign)'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-[#0A2540] block">{tech.assigned || 0} / 6 jobs</span>
                      <span className="text-[9px] font-bold text-slate-400 block">{tech.travel || 0} in transit</span>
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
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
