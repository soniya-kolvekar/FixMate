'use client';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  PlusCircle, 
  FileText,
  Lock,
  ChevronRight,
  Ban
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

  const isCompleted = job.status === 'Completed';
  const isCancelled = job.status === 'Cancelled' || job.status === 'CANCELLED';
  const isLocked = isCompleted || isCancelled;

  const currentStageIndex = workflowStages.findIndex(s => s.key === job.status);

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
            isCancelled 
              ? 'bg-rose-100 text-rose-700 border border-rose-200' 
              : job.isEmergency 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-blue-100 text-blue-700'
          }`}>
            #{job.id} • {isCancelled ? 'CANCELLED' : job.tag || (job.isEmergency ? 'EMERGENCY' : 'STANDARD')}
          </span>
        </div>
      </div>

      {/* Read-Only Cancelled Notice Banner */}
      {isCancelled && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <Ban className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-rose-900 text-sm">Request Cancelled (Read-Only)</h4>
              <p className="text-xs text-rose-700 font-medium mt-0.5">This job has been cancelled and reported to the Dispatcher terminal. No further edits or status progression can be made.</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shrink-0">
            Locked
          </span>
        </div>
      )}

      {/* Main Job Card */}
      <div className={`bg-white rounded-3xl p-8 border shadow-sm space-y-8 ${isCancelled ? 'border-rose-200' : 'border-slate-200/80'}`}>
        
        {/* Title & Customer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className={`text-2xl font-black ${isCancelled ? 'text-slate-500 line-through' : 'text-[#0A2540]'}`}>{job.title}</h2>
            <p className="text-xs text-slate-400 font-medium mt-1">Service Request Details & Workflow Checklist</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-[#0A2540]">₹{totalAmount.toFixed(2)}</span>
            <span className="text-xs font-semibold text-slate-400 block">Total Final Cost</span>
          </div>
        </div>

        {/* Checklist-Based Job Progress Bar */}
        <div className="space-y-3 bg-slate-50/70 p-6 rounded-2xl border border-slate-200/60">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
              Checklist Workflow Progression
            </h4>
            {isLocked && (
              <span className={`flex items-center gap-1 text-xs font-bold ${isCancelled ? 'text-rose-600' : 'text-emerald-600'}`}>
                <Lock className="w-3.5 h-3.5" /> Job Locked ({isCancelled ? 'Cancelled' : 'Completed'})
              </span>
            )}
          </div>

          {/* Workflow Step Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {workflowStages.map((stage, idx) => {
              const isPassed = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <button
                  key={stage.key}
                  disabled={isLocked}
                  onClick={() => !isLocked && onUpdateStatus(job.id, stage.key)}
                  className={`p-3 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition-all ${
                    isLocked 
                      ? isCancelled
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
                        : isCurrent
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-emerald-100 text-emerald-800 cursor-not-allowed'
                      : isCurrent 
                        ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400'
                        : isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-100'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-white' : isPassed ? 'text-emerald-600' : 'text-slate-300'}`} />
                  <span className="text-center leading-tight">{stage.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer & Location Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer Info Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Customer Details</h4>
            
            <div className="flex items-center gap-3">
              <img 
                src={job.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'} 
                alt={job.customerName}
                className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm"
              />
              <div>
                <h4 className="text-sm font-black text-[#0A2540]">{job.customerName}</h4>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Phone className="w-3 h-3 text-slate-400" /> {job.customerPhone}
                </p>
              </div>
            </div>

            <div className="pt-2 text-xs font-semibold text-slate-500 space-y-1">
              <p className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{job.location}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Scheduled: {job.time}</span>
              </p>
            </div>
          </div>

          {/* Pricing & Billing Breakdown Card */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Pricing & Extra Charges</h4>
              
              {!isLocked && (
                <button
                  onClick={onOpenExtraCharges}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-extrabold flex items-center gap-1 transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Add Extra Charges</span>
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span>Base Service Rate</span>
                <span>₹{fixedPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                <span>Additional Charges</span>
                <span className="font-extrabold text-blue-600">+₹{extraCharges.toFixed(2)}</span>
              </div>

              {job.extraChargesReason && (
                <p className="text-[11px] text-slate-500 font-medium italic bg-white p-2 rounded-lg border border-slate-200/60">
                  Justification: "{job.extraChargesReason}"
                </p>
              )}

              <div className="flex justify-between items-center pt-2 text-sm font-extrabold text-[#0A2540]">
                <span>Total Final Bill</span>
                <span>₹{totalAmount.toFixed(2)}</span>
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

        {/* Action Footer - Report Delay / Cancellation Alert */}
        {!isLocked && (
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
