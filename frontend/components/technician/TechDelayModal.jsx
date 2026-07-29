'use client';
import { useState } from 'react';
import { AlertTriangle, Clock, X, Send, ShieldAlert } from 'lucide-react';

export default function TechDelayModal({ 
  isOpen, 
  job, 
  onClose, 
  onReportDelay 
}) {
  const [reasonType, setReasonType] = useState('Running Late');
  const [notes, setNotes] = useState('');

  if (!isOpen || !job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onReportDelay) {
      onReportDelay(job.id, reasonType, notes);
    }
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-200/80 relative space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-[#0A2540]">Report Delay / Cancellation</h3>
            <p className="text-xs font-medium text-slate-500">Job #{job.id} • Dispatcher Alert Notification</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-slate-700 block mb-1.5">Select Incident Category *</label>
            <div className="space-y-2">
              {[
                { key: 'Running Late', label: '🚗 Running Late (Traffic / Prolonged Previous Job)' },
                { key: 'Unable to Reach Customer', label: '📞 Unable to Reach Customer / No Answer' },
                { key: 'Cancel Assignment', label: '🚫 Request Cancellation of Assignment' }
              ].map((opt) => (
                <label 
                  key={opt.key}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer font-bold transition-all ${
                    reasonType === opt.key 
                      ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm' 
                      : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="delayReason"
                    checked={reasonType === opt.key}
                    onChange={() => setReasonType(opt.key)}
                    className="accent-amber-600"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Additional Notes / Estimated Delay (Mins)</label>
            <textarea 
              rows="3"
              placeholder="e.g. Stuck in highway traffic congestion. Estimated 20 mins delay."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[11px]">
            🚨 Submitting immediately broadcasts an urgent high-priority alert to the Regional Dispatcher terminal.
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#0A2540] hover:bg-[#13395F] text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Broadcast Alert to Dispatcher</span>
          </button>

        </form>

      </div>
    </div>
  );
}
