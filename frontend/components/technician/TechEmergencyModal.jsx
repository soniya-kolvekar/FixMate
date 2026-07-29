'use client';
import { useState } from 'react';
import { MapPin, CheckCircle2, Flame, Lock } from 'lucide-react';

export default function TechEmergencyModal({ 
  isOpen, 
  emergencyJob, 
  onAccept, 
  onDecline 
}) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  if (!isOpen || !emergencyJob) return null;

  const handleAcceptClick = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      setIsLocked(true);
      if (onAccept) onAccept(emergencyJob);
    }, 600);
  };

  return (
    <div className="modal-overlay animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border-2 border-rose-500 relative overflow-hidden space-y-6">
        
        {/* Pulsing Emergency Header Banner */}
        <div className="bg-rose-600 -mx-8 -mt-8 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">
              <Flame className="w-6 h-6 animate-bounce text-yellow-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-rose-200 block">
                HIGH PRIORITY EMERGENCY BROADCAST
              </span>
              <h3 className="text-lg font-black tracking-tight">{emergencyJob.title}</h3>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-black animate-pulse">
            LIVE
          </span>
        </div>

        {/* Issue Details Box */}
        <div className="space-y-3 bg-rose-50/50 p-5 rounded-2xl border border-rose-100 text-xs font-medium text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Service Category</span>
            <span className="font-extrabold text-rose-600">{emergencyJob.category}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Proximity Distance</span>
            <span className="font-extrabold text-[#0A2540]">{emergencyJob.distance || "1.2 km away"}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Estimated Compensation</span>
            <span className="font-black text-emerald-600 text-sm">₹{emergencyJob.price || 1499.00}</span>
          </div>

          <div className="pt-1">
            <span className="font-bold text-slate-500 block mb-1">Customer Address</span>
            <p className="font-semibold text-slate-800 flex items-start gap-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{emergencyJob.location}</span>
            </p>
          </div>

          {emergencyJob.customerNote && (
            <div className="pt-2 border-t border-rose-200/60">
              <span className="font-bold text-slate-500 block mb-1">Customer Note</span>
              <p className="italic text-slate-600 bg-white p-2.5 rounded-xl border border-rose-200/60">
                "{emergencyJob.customerNote}"
              </p>
            </div>
          )}
        </div>

        {/* Lock Rules Notice */}
        <p className="text-[11px] font-semibold text-slate-500 text-center">
          ⚡ <span className="font-bold">First to accept locks assignment.</span> Notification will auto-expire for other technicians once accepted.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            disabled={isAccepting || isLocked}
            onClick={onDecline}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
          >
            Decline Broadcast
          </button>

          <button
            disabled={isAccepting || isLocked}
            onClick={handleAcceptClick}
            className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-lg shadow-rose-900/20 flex items-center gap-2 transition-all"
          >
            {isAccepting ? (
              <span>Locking Assignment...</span>
            ) : isLocked ? (
              <span className="flex items-center gap-1">
                <Lock className="w-4 h-4" /> Job Locked & Accepted!
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Accept Emergency Job
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
