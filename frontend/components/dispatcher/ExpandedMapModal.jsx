'use client';

import React from 'react';

export default function ExpandedMapModal({
  isMapExpanded,
  setIsMapExpanded,
  dispatches,
  handleOpenAssign,
  showToast
}) {
  if (!isMapExpanded) return null;

  return (
    <div className="modal-overlay z-[2100]">
      <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-[#0A2540]">Regional Dispatch Live Grid Tracker</h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">City Division: Hyderabad Central Sector</p>
          </div>
          <button 
            onClick={() => setIsMapExpanded(false)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 bg-sky-50 relative flex items-center justify-center overflow-hidden">
          {/* Hyderabad Google Maps Background */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.316041647!2d78.24323062629737!3d17.412299801452296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: 'contrast(1.05) saturate(0.95)' }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 pointer-events-none z-0"
          ></iframe>

          {/* Interactive SVG Layer */}
          <svg className="w-full h-full relative z-10" xmlns="http://www.w3.org/2000/svg">
            {/* Visual links/dispatch loops */}
            <path d="M200 200 L500 200 L500 500 L800 500" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,8" />
            
            {/* Active Technicians Pins */}
            <g className="cursor-pointer" onClick={() => showToast('Dave R. (Plumbing): Active at Jubilee Hills')}>
              <circle cx="200" cy="200" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
              <text x="225" y="204" fill="#0A2540" className="font-extrabold text-xs bg-white px-2 py-0.5 rounded shadow-md border border-slate-200">Dave R. (Jubilee Hills)</text>
            </g>
            
            <g className="cursor-pointer" onClick={() => showToast('Sarah J. (Electrical): Transit at Banjara Hills')}>
              <circle cx="500" cy="350" r="14" fill="#10B981" stroke="white" strokeWidth="4" />
              <text x="525" y="354" fill="#0A2540" className="font-extrabold text-xs bg-white px-2 py-0.5 rounded shadow-md border border-slate-200">Sarah J. (Banjara Hills)</text>
            </g>

            <g className="cursor-pointer" onClick={() => showToast('Mike T. (HVAC): Active at Hitec City')}>
              <circle cx="800" cy="500" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
              <text x="825" y="504" fill="#0A2540" className="font-extrabold text-xs bg-white px-2 py-0.5 rounded shadow-md border border-slate-200">Mike T. (Hitec City)</text>
            </g>

            <g className="cursor-pointer" onClick={() => showToast('Elena K. (Carpentry): Active at Madhapur')}>
              <circle cx="500" cy="120" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
              <text x="525" y="124" fill="#0A2540" className="font-extrabold text-xs bg-white px-2 py-0.5 rounded shadow-md border border-slate-200">Elena K. (Madhapur)</text>
            </g>

            {/* Incident Markers (Smooth non-shaking pulse) */}
            {dispatches.map((disp, idx) => {
              const cx = 200 + (idx * 300);
              const cy = 400 - (idx * 150);
              return (
                <g key={disp.id} className="cursor-pointer group" onClick={() => {
                  handleOpenAssign(disp);
                  setIsMapExpanded(false);
                }}>
                  <circle cx={cx} cy={cy} r="28" fill="none" stroke="#EF4444" strokeWidth="2.5" className="animate-pulse" opacity="0.7" />
                  <circle cx={cx} cy={cy} r="16" fill="#EF4444" stroke="white" strokeWidth="4" className="shadow-lg transition-transform group-hover:scale-110" />
                  <text x={cx + 24} y={cy + 5} fill="#EF4444" className="font-black text-xs bg-white/95 px-2 py-1 rounded border border-red-200 shadow-md">🚨 URGENT: {disp.title}</text>
                </g>
              );
            })}
          </svg>
          
          {/* Map instructions banner */}
          <div className="absolute top-5 left-5 bg-white/95 backdrop-blur border border-slate-200 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-slate-800 z-20">
            💡 Click on red emergency beacons to assign technicians directly from the Hyderabad grid view.
          </div>
        </div>

        <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span><span>Active (Hyderabad Sector)</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span><span>Transit</span></div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span><span>Urgent Incident</span></div>
          </div>
          <button 
            onClick={() => setIsMapExpanded(false)}
            className="px-5 py-2 bg-[#0A2540] hover:bg-[#13395F] text-white rounded-lg text-xs font-bold transition-all shadow-md"
          >
            Close Map view
          </button>
        </div>
      </div>
    </div>
  );
}
