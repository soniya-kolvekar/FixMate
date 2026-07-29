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

          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Available Technician</label>
          
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {technicians.filter(t => t.status === 'Online').map((tech) => {
              const isMatch = assigningDispatch.techSpecialty 
                ? tech.specialty.toLowerCase().includes(assigningDispatch.techSpecialty.toLowerCase()) 
                : tech.name.toLowerCase() === assigningDispatch.recommendedTech?.toLowerCase();
              return (
                <button
                  key={tech.name}
                  onClick={() => handleConfirmAssignment(tech.name)}
                  className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition-all group ${
                    isMatch 
                      ? 'border-blue-500 bg-blue-50/40 hover:bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-800 group-hover:text-blue-700">{tech.name}</h4>
                      {isMatch && (
                        <span className="text-[9px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-full">
                          ⭐ Specialty Match
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">{tech.specialty} • Zone: {tech.zone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-extrabold text-[#0A2540] block">{tech.assigned} / 6 jobs</span>
                    <span className="text-[9px] font-bold text-slate-400 block">{tech.travel} in transit</span>
                  </div>
                </button>
              );
            })}
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
