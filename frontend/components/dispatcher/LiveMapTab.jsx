'use client';

import React from 'react';
import { MapPin, Navigation, Clock, Activity, CheckCircle2, User, PhoneCall } from 'lucide-react';

export default function LiveMapTab({
  dispatches,
  liveTechnicians,
  selectedTechForStatus,
  setSelectedTechForStatus,
  handleOpenAssign
}) {
  const activeTech = liveTechnicians.find(t => t.id === selectedTechForStatus);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[700px] animate-in fade-in duration-300">
      
      {/* Map Container (75%) */}
      <div className="lg:w-3/4 relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-sky-50 flex items-center justify-center min-h-[600px]">
        {/* Hyderabad Google Maps Embed */}
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

        {/* Floating Map Controls overlay */}
        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
          <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-bold text-[#0A2540]">Hyderabad Fleet (12 On-Site)</span>
          </div>
          <div className="bg-white/95 backdrop-blur-sm shadow-md rounded-full px-4 py-1.5 flex items-center gap-2 border border-slate-200">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-xs font-bold text-[#0A2540]">In-Transit (8)</span>
          </div>
        </div>

        {/* Interactive Overlay Layer */}
        <div className="absolute inset-0 z-20" onClick={() => setSelectedTechForStatus(null)}>
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Unassigned Incident Checkpoints (Fixed smooth pulsing ring without shaking) */}
            {dispatches.map((disp, idx) => {
              const cx = 180 + (idx * 280);
              const cy = 360 - (idx * 100);
              return (
                <g key={disp.id} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); handleOpenAssign(disp); }}>
                  {/* Stable Outer Pulsing Glow */}
                  <circle cx={cx} cy={cy} r="24" fill="none" stroke="#EF4444" strokeWidth="2.5" className="animate-pulse" opacity="0.7" />
                  <circle cx={cx} cy={cy} r="15" fill="#EF4444" stroke="white" strokeWidth="3" className="shadow-lg transition-transform group-hover:scale-110" />
                  <text x={cx} y={cy + 4} textAnchor="middle" fill="white" className="font-bold text-[10px] pointer-events-none">🚨</text>
                </g>
              );
            })}

            {/* Technician Markers */}
            {liveTechnicians.map((tech) => {
              const isOnSite = ['Reached Location', 'Service Started', 'Service Completed'].includes(tech.status);
              const fillColor = isOnSite ? '#10B981' : '#3B82F6';
              const icon = isOnSite ? '🏠' : '🚗';
              return (
                <g key={tech.id} className="cursor-pointer group" onClick={(e) => { e.stopPropagation(); setSelectedTechForStatus(tech.id); }}>
                  <circle cx={tech.cx} cy={tech.cy} r="17" fill={fillColor} stroke="white" strokeWidth="3" className="shadow-md transition-transform group-hover:scale-110" />
                  <text x={tech.cx} y={tech.cy + 4} textAnchor="middle" fill="white" className="font-bold text-[12px] pointer-events-none">{icon}</text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Read-Only Live Activity Card (Displays current technician location/progress matching Live Activity styling) */}
        {activeTech && (
          <div 
            className="absolute bg-white/95 backdrop-blur border border-slate-200/90 rounded-2xl shadow-2xl p-5 w-80 z-30 animate-in zoom-in-95 duration-150"
            style={{
              left: `${Math.min(activeTech.cx + 25, 600)}px`,
              top: `${Math.max(activeTech.cy - 100, 20)}px`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <h4 className="text-xs font-black uppercase text-[#0A2540] tracking-wider">Live Tracking Feed</h4>
              </div>
              <button 
                onClick={() => setSelectedTechForStatus(null)} 
                className="text-slate-400 hover:text-slate-700 text-lg leading-none font-bold p-1"
              >
                &times;
              </button>
            </div>

            {/* Technician Profile Row */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-sm text-blue-700 shadow-xs">
                {activeTech.initials}
              </div>
              <div>
                <h5 className="font-extrabold text-sm text-slate-800 leading-snug">{activeTech.name}</h5>
                <p className="text-[11px] font-semibold text-slate-500">{activeTech.role}</p>
              </div>
            </div>

            {/* Live Activity Stream Layout Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Current Status</span>
                <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                  activeTech.status === 'Service Started' || activeTech.status === 'Reached Location'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {activeTech.status}
                </span>
              </div>

              <div className="flex items-start gap-2 text-slate-700 pt-1">
                <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Live Sector</span>
                  <span className="font-bold text-slate-800">{activeTech.currentLocation || "Banjara Hills, Road No. 12, Hyderabad"}</span>
                </div>
              </div>

              {activeTech.destination && (
                <div className="flex items-start gap-2 text-slate-700">
                  <Navigation size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-slate-400 font-extrabold uppercase">Enroute To</span>
                    <span className="font-bold text-slate-800">{activeTech.destination}</span>
                  </div>
                </div>
              )}

              {activeTech.eta && (
                <div className="flex items-center justify-between text-slate-600 bg-white p-2 rounded-lg border border-slate-150 mt-1">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock size={12} /> Estimated Arrival
                  </span>
                  <span className="font-black text-blue-700">{activeTech.eta}</span>
                </div>
              )}

              {activeTech.progress !== null && (
                <div className="pt-1">
                  <div className="flex justify-between text-[10px] font-extrabold text-slate-500 mb-1">
                    <span>Work Progress</span>
                    <span className="text-emerald-600">{activeTech.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${activeTech.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* Read-Only Footer Note */}
            <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1"><Activity size={12} className="text-emerald-500" /> GPS Signal Live</span>
              <span>Updated just now</span>
            </div>
          </div>
        )}
      </div>

      {/* Sidebar (25%) */}
      <div className="lg:w-1/4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        
        {/* Sidebar Header */}
        <div className="p-6 pb-4 border-b border-slate-100 bg-white shrink-0">
          <h3 className="text-2xl font-black text-[#0A2540]">Hyderabad Fleet</h3>
          <p className="text-sm font-semibold text-slate-500 mt-1">20 Technicians Active</p>
        </div>

        {/* Scrollable Lists */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* IN-TRANSIT */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 ml-2">In-Transit</h4>
            <div className="space-y-3">
              {liveTechnicians.filter(t => ['Assigned', 'On the Way'].includes(t.status)).map(tech => (
                <div key={tech.id} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-colors cursor-pointer" onClick={() => setSelectedTechForStatus(tech.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                          {tech.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-[8px]">🚗</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-slate-800 leading-tight">{tech.name}</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">{tech.role}</p>
                      </div>
                    </div>
                    {tech.eta && (
                      <span className="bg-blue-100 text-blue-800 text-[9px] font-black px-1.5 py-0.5 rounded-md whitespace-nowrap">
                        {tech.eta}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                    <span className="text-slate-400">📍</span>
                    <span>Enroute to {tech.destination}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ON-SITE */}
          <div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 ml-2">On-Site</h4>
            <div className="space-y-3">
              {liveTechnicians.filter(t => ['Reached Location', 'Service Started', 'Service Completed'].includes(t.status)).map(tech => (
                <div key={tech.id} className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition-colors cursor-pointer" onClick={() => setSelectedTechForStatus(tech.id)}>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                          {tech.initials}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                          <span className="text-[8px]">🏠</span>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-slate-800 leading-tight">{tech.name}</h5>
                        <p className="text-[10px] text-slate-500 font-semibold">{tech.role}</p>
                      </div>
                    </div>
                    <span className="text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                      {tech.status === 'Service Completed' ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  {tech.progress !== null && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${tech.progress}%` }}></div>
                      </div>
                      <div className="flex justify-between text-[9px] font-bold text-slate-400">
                        <span>Job progress: {tech.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Efficiency Footer Panel */}
        <div className="bg-[#1B3B6F] text-white p-5 shrink-0">
          <div className="text-[9px] font-bold text-blue-200 uppercase tracking-wider mb-1">Hyderabad Fleet Efficiency</div>
          <div className="flex justify-between items-end">
            <span className="text-4xl font-black">96%</span>
            <span className="text-blue-300 text-xs font-bold mb-1">📈 +3.1%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
