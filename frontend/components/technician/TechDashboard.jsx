'use client';
import { 
  Briefcase, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowRight, 
  TrendingUp, 
  Flame, 
  Layers, 
  Star,
  ChevronRight,
  User
} from 'lucide-react';

export default function TechDashboard({ 
  jobs = [], 
  onSelectJob, 
  onViewAllJobs, 
  onTriggerEmergency,
  maxCapacity = 6
}) {
  const isJobCancelled = (j) => 
    j.status === 'Cancelled' || 
    j.status === 'CANCELLED' || 
    j.status === 'cancelled' || 
    (typeof j.status === 'string' && j.status.toLowerCase().includes('cancel'));

  const parseTimeMinutes = (timeStr) => {
    if (!timeStr) return 0;
    if (typeof timeStr === 'string' && timeStr.includes('T')) {
      const d = new Date(timeStr);
      if (!isNaN(d.getTime())) return d.getHours() * 60 + d.getMinutes();
    }
    const match = String(timeStr).match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return 0;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3];
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    return hours * 60 + minutes;
  };

  const getJobTier = (job) => {
    const isCancelled = 
      job.status === 'Cancelled' || 
      job.status === 'CANCELLED' || 
      job.status === 'cancelled' ||
      (typeof job.status === 'string' && job.status.toLowerCase().includes('cancel'));
    const isEmg = Boolean(job.isEmergency || job.tag === 'EMERGENCY' || job.category === 'Emergency');
    
    if (isEmg) return 1; // Tier 1: Emergency Requests (Top)
    if (isCancelled || job.tag === 'URGENT' || job.priority === 'HIGH') return 2; // Tier 2: Urgent / Mid-Cancelled
    return 3; // Tier 3: Normal Service Requests
  };

  const activeJobs = jobs.filter(j => j.status !== 'Completed' && !isJobCancelled(j));
  const emergencyJobs = jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY' || j.tag === 'URGENT') && !isJobCancelled(j) && j.status !== 'Completed');
  const completedTodayCount = jobs.filter(j => j.status === 'Completed').length;
  const capacityPercentage = Math.min(100, Math.round((activeJobs.length / maxCapacity) * 100));

  const displayScheduleJobs = [...jobs].sort((a, b) => {
    const tierA = getJobTier(a);
    const tierB = getJobTier(b);
    if (tierA !== tierB) return tierA - tierB; // Emergency (1) < Urgent/Cancelled (2) < Normal (3)

    const timeA = parseTimeMinutes(a.time || a.createdAt);
    const timeB = parseTimeMinutes(b.time || b.createdAt);
    return timeA - timeB;
  });

  return (
    <div className="space-y-7 antialiased">
      
      {/* Top Row: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric 1: Assigned Jobs */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">Assigned Jobs</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A2540] tracking-tight">{activeJobs.length} Active</div>
          <div className="text-xs font-bold text-blue-600 flex items-center gap-1">
            <span>Scheduled for today</span>
          </div>
        </div>

        {/* Metric 2: Emergency Alerts */}
        <div 
          onClick={onTriggerEmergency}
          className="bg-white rounded-2xl p-5 border-2 border-rose-500 bg-rose-50/30 shadow-sm space-y-2 cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
              <Flame className="w-4 h-4 animate-bounce" /> Emergency Jobs
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600 tracking-tight">
            {emergencyJobs.length > 0 ? `${emergencyJobs.length} Pending` : '0 Active'}
          </div>
          <div className="text-xs font-bold text-rose-600">
            High Priority Dispatch Broadcast
          </div>
        </div>

        {/* Metric 3: Daily Workload Capacity */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">Daily Workload</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A2540] tracking-tight">
            {activeJobs.length} / {maxCapacity} Jobs
          </div>
          <div className="text-xs font-bold text-slate-500">
            {capacityPercentage}% Capacity Used
          </div>
        </div>

        {/* Metric 4: Satisfaction & Rating */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">Technician Rating</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#0A2540] tracking-tight">4.92 / 5.0</div>
          <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <span>↑ 98% Positive Feedback</span>
          </div>
        </div>

      </div>

      {/* Main Section: Schedule & Urgent Broadcast Callout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Assigned Schedule */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-[#0A2540]">Today's Assigned Schedule</h3>
              <p className="text-xs text-slate-400 font-medium">Click any job to view details and update workflow checklist</p>
            </div>
            <button 
              onClick={onViewAllJobs}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>View All ({jobs.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-3">
            {displayScheduleJobs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs font-bold text-slate-400">
                🎉 No pending jobs assigned for today!
              </div>
            ) : (
              displayScheduleJobs.map((job) => {
                const isCancelled = 
                  job.status === 'Cancelled' || 
                  job.status === 'CANCELLED' || 
                  job.status === 'cancelled' || 
                  (typeof job.status === 'string' && job.status.toLowerCase().includes('cancel'));

                const isEmergency = Boolean(job.isEmergency || job.tag === 'EMERGENCY' || job.category === 'Emergency');

                return (
                  <div 
                    key={job.id}
                    onClick={() => onSelectJob(job)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCancelled 
                        ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50' 
                        : isEmergency
                          ? 'border-2 border-rose-500 bg-rose-50/30 hover:bg-rose-50 hover:shadow-lg'
                          : 'border-slate-200/80 hover:border-blue-400 hover:shadow-md bg-slate-50/50 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${
                        isCancelled 
                          ? 'bg-rose-100 text-rose-700' 
                          : isEmergency 
                            ? 'bg-rose-600 text-white animate-pulse' 
                            : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isCancelled ? '🚫' : isEmergency ? '⚡' : '🔧'}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`text-sm font-extrabold ${isCancelled ? 'text-slate-500 line-through' : 'text-[#0A2540]'}`}>
                            {job.title}
                          </h4>

                          {isEmergency && !isCancelled && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider animate-pulse">
                              ⚡ EMERGENCY
                            </span>
                          )}

                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            isCancelled 
                              ? 'bg-rose-100 text-rose-700' 
                              : isEmergency 
                                ? 'bg-rose-100 text-rose-700' 
                                : 'bg-blue-100 text-blue-700'
                          }`}>
                            #{job.id}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-xs">{job.location}</span>
                        </p>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400 mt-2">
                          <span className="flex items-center gap-1 text-slate-600">
                            <User className="w-3 h-3 text-slate-400" /> {job.customerName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" /> {job.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                      <span className="text-sm font-black text-[#0A2540]">
                        ₹{(job.price + (job.extraCharges || 0)).toFixed(2)}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        isCancelled
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : job.status === 'Completed' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : job.status === 'Service Started' || job.status === 'On The Way'
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isCancelled ? 'Cancelled' : job.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Live Emergency & Action Box */}
        <div className="space-y-5">
          
          {/* Emergency Card Box */}
          <div className="bg-white rounded-2xl p-6 border-2 border-rose-500 bg-rose-50/20 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-rose-200">
              <h3 className="text-base font-extrabold text-rose-600 flex items-center gap-2">
                <Flame className="w-4 h-4 animate-bounce" /> Emergency Broadcast
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white animate-pulse">
                LIVE
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-600 leading-relaxed">
              Available emergency dispatch calls in your service zone are broadcasted live. First technician to accept locks the job!
            </p>

            <button
              onClick={onTriggerEmergency}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>View Emergency Broadcast</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Dynamic Performance Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0A2540]">Duty Performance Summary</h3>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Jobs Completed Today</span>
                <span className="font-extrabold text-emerald-600">{completedTodayCount} Jobs</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Total Jobs Handled</span>
                <span className="font-extrabold text-[#0A2540]">{jobs.length} Jobs</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Emergency Jobs Accepted</span>
                <span className="font-extrabold text-rose-600">
                  {jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY') && !isJobCancelled(j)).length} Jobs
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancellation Rate</span>
                {(() => {
                  const cancelled = jobs.filter(isJobCancelled).length;
                  const rate = jobs.length > 0 ? ((cancelled / jobs.length) * 100).toFixed(1) + '%' : '0.0%';
                  return (
                    <span className={`font-extrabold ${cancelled > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {rate}
                    </span>
                  );
                })()}
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
