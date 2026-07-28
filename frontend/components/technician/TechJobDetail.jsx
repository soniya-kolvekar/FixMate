'use client';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  ShieldAlert, 
  FileText,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function TechJobDetail({ 
  job, 
  onBack, 
  onUpdateStatus, 
  onOpenExtraCharges, 
  onOpenReportDelay 
}) {
  if (!job) return null;

  // Ordered Checklist Workflow Stages (Issue #7)
  const workflowStages = [
    { key: 'Assigned', label: '1. Assigned' },
    { key: 'Accepted', label: '2. Accepted' },
    { key: 'On The Way', label: '3. On The Way' },
    { key: 'Reached Location', label: '4. Reached Location' },
    { key: 'Service Started', label: '5. Service Started' },
    { key: 'Completed', label: '6. Service Completed' }
  ];

  const currentStageIndex = workflowStages.findIndex(s => s.key === job.status);
  const isCompleted = job.status === 'Completed';

  // Calculate pricing breakdown (Issue #9)
  const fixedPrice = job.price || 0;
  const extraCharges = job.extraCharges || 0;
  const totalAmount = fixedPrice + extraCharges;

  return (
    <div className="space-y-6 antialiased max-w-5xl mx-auto">
      
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/80 text-xs font-extrabold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400" />
          <span>Back to Jobs</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
            job.isEmergency ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
          }`}>
            #{job.id} • {job.tag || (job.isEmergency ? 'EMERGENCY' : 'STANDARD')}
          </span>
        </div>
      </div>

      {/* Main Job Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-8">
        
        {/* Title & Customer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-[#0A2540]">{job.title}</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Service Request Details & Interactive Checklist</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#0A2540]">${totalAmount.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-400 block">Total Final Cost</span>
          </div>
        </div>

        {/* Issue #7: Checklist-Based Job Progress Bar */}
        <div className="space-y-3 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/60">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Checklist Workflow Progression
            </h4>
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                <Lock className="w-3.5 h-3.5" /> Job Locked (Completed)
              </span>
            )}
          </div>

          {/* Workflow Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {workflowStages.map((stage, idx) => {
              const isActive = job.status === stage.key;
              const isPast = currentStageIndex > idx;
              const isNextPossible = currentStageIndex + 1 === idx && !isCompleted;

              return (
                <button
                  key={stage.key}
                  disabled={isCompleted || (!isPast && !isActive && !isNextPossible)}
                  onClick={() => onUpdateStatus(job.id, stage.key)}
                  className={`px-3 py-3 rounded-xl text-[11px] font-bold transition-all text-center border ${
                    isActive 
                      ? 'bg-[#0A2540] text-white border-[#0A2540] shadow-md ring-2 ring-blue-500/30' 
                      : isPast 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : isNextPossible
                          ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100 cursor-pointer animate-pulse'
                          : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  }`}
                >
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Issue #4: Complete Job Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer & Location Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Customer & Contact Information</h4>
            
            <div className="flex items-center gap-3">
              <img 
                src={job.customerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                alt={job.customerName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
              />
              <div>
                <h5 className="text-sm font-extrabold text-[#0A2540]">{job.customerName}</h5>
                <p className="text-xs text-slate-500 font-semibold flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{job.customerPhone || "555-0192"}</span>
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Service Address</span>
              <p className="text-xs font-semibold text-slate-700 flex items-start gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{job.location}</span>
              </p>
            </div>
          </div>

          {/* Issue #9: Pricing Breakdown */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Service Cost & Extra Charges</h4>
              {!isCompleted && (
                <button
                  onClick={onOpenExtraCharges}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Add Extra Charges
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span>Fixed Service Base Price</span>
                <span className="font-extrabold text-[#0A2540]">${fixedPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span>Additional Materials & Labour</span>
                <span className="font-extrabold text-blue-600">+${extraCharges.toFixed(2)}</span>
              </div>

              {job.extraChargesReason && (
                <p className="text-[11px] text-slate-500 font-medium italic bg-white p-2 rounded-lg border border-slate-200/60">
                  Justification: "{job.extraChargesReason}"
                </p>
              )}

              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0A2540]">
                <span>Total Final Bill</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Issue Description & Notes</h4>
          <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {job.description || "No specific customer instructions provided."}
          </p>
        </div>

        {/* Issue #12: Action Footer - Report Delay / Cancellation Alert */}
        {!isCompleted && (
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onOpenReportDelay}
              className="px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-extrabold hover:bg-amber-100 transition-colors flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Report Delay or Request Cancellation</span>
            </button>

            <button
              onClick={() => onUpdateStatus(job.id, 'Completed')}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all shadow-md flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalize & Mark Completed</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
