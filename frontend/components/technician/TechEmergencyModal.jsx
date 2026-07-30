'use client';
import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, Flame, Lock, ChevronLeft, ChevronRight, X, ShieldAlert } from 'lucide-react';

export default function TechEmergencyModal({ 
  isOpen, 
  emergencyList = [], 
  emergencyJob, 
  onAccept, 
  onDecline 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [dismissedIds, setDismissedIds] = useState([]);

  // Reset dismissed IDs when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setDismissedIds([]);
      setCurrentIndex(0);
      setIsLocked(false);
      setIsAccepting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const rawJobsArray = Array.isArray(emergencyList) && emergencyList.length > 0 
    ? emergencyList 
    : emergencyJob ? [emergencyJob] : [];

  const jobsArray = rawJobsArray.filter(j => !dismissedIds.includes(j.id));

  // No active emergency broadcasts state popup
  if (jobsArray.length === 0) {
    return (
      <div className="modal-overlay animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200/80 relative text-center space-y-6">
          
          <button 
            onClick={onDecline}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl shadow-inner border border-blue-100">
            <ShieldAlert className="w-8 h-8 text-blue-600" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              EMERGENCY BROADCAST STATUS
            </span>
            <h3 className="text-xl font-black text-[#0A2540] tracking-tight">No Emergency Broadcasts Available</h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
              All clear! There are currently no active or unassigned emergency service calls in your zone (Mangaluru Region).
            </p>
          </div>

          <button
            onClick={onDecline}
            className="w-full py-3 bg-[#0A2540] hover:bg-[#13395F] text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
          >
            Close Emergency Panel
          </button>

        </div>
      </div>
    );
  }

  const activeIndex = Math.min(currentIndex, jobsArray.length - 1);
  const currentJob = jobsArray[activeIndex] || jobsArray[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : jobsArray.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev < jobsArray.length - 1 ? prev + 1 : 0));
  };

  const handleDeclineClick = () => {
    const remaining = jobsArray.filter(j => j.id !== currentJob.id);
    setDismissedIds(prev => [...prev, currentJob.id]);

    if (remaining.length === 0) {
      if (onDecline) onDecline();
    } else {
      setCurrentIndex(prev => (prev < remaining.length ? prev : 0));
    }
  };

  const handleAcceptClick = () => {
    setIsAccepting(true);
    setTimeout(() => {
      setIsAccepting(false);
      setIsLocked(true);
      if (onAccept) onAccept(currentJob);
    }, 400);
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
              <h3 className="text-lg font-black tracking-tight">{currentJob.title}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-black animate-pulse">
              LIVE
            </span>
            <button 
              onClick={handleDeclineClick}
              className="w-8 h-8 rounded-full bg-rose-700/60 hover:bg-rose-800 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Indicator */}
        {jobsArray.length > 1 && (
          <div className="flex items-center justify-between bg-rose-50 p-2.5 rounded-2xl border border-rose-200/80">
            <button 
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-700 font-bold transition-colors shadow-sm flex items-center gap-1 text-xs"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <span className="text-xs font-black text-rose-900 uppercase tracking-wider">
              Emergency Request {activeIndex + 1} of {jobsArray.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-white hover:bg-rose-100 text-rose-700 font-bold transition-colors shadow-sm flex items-center gap-1 text-xs"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Issue Details Box */}
        <div className="space-y-3 bg-rose-50/50 p-5 rounded-2xl border border-rose-100 text-xs font-medium text-slate-700">
          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Service Category</span>
            <span className="font-extrabold text-rose-600">{currentJob.category || "Emergency Plumbing"}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Proximity Distance</span>
            <span className="font-extrabold text-[#0A2540]">{currentJob.distance || "1.2 km away"}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-rose-200/60">
            <span className="font-bold text-slate-500">Fixed Compensation</span>
            <span className="font-black text-emerald-600 text-sm">₹{Number(currentJob.price || 1499).toFixed(2)}</span>
          </div>

          <div className="pt-1">
            <span className="font-bold text-slate-500 block mb-1">Customer Address</span>
            <p className="font-semibold text-slate-800 flex items-start gap-1">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{currentJob.location || currentJob.address}</span>
            </p>
          </div>

          {(currentJob.description || currentJob.notes || currentJob.customerNote) && (
            <div className="pt-2 border-t border-rose-200/60">
              <span className="font-bold text-slate-500 block mb-1">Issue Description</span>
              <p className="italic text-slate-600 bg-white p-2.5 rounded-xl border border-rose-200/60">
                "{currentJob.description || currentJob.notes || currentJob.customerNote}"
              </p>
            </div>
          )}
        </div>

        {/* Lock Rules Notice */}
        <p className="text-[11px] font-semibold text-slate-500 text-center">
          ⚡ <span className="font-bold">First technician to accept locks assignment.</span> Broadcast auto-expires for other technicians once accepted.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            disabled={isAccepting || isLocked}
            onClick={handleDeclineClick}
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
