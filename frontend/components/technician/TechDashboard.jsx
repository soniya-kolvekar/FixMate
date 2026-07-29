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
  const activeJobs = jobs.filter(j => j.status !== 'Completed');
  const emergencyJobs = jobs.filter(j => j.isEmergency || j.tag === 'EMERGENCY' || j.tag === 'URGENT');
  const completedTodayCount = 2;
  const capacityPercentage = Math.min(100, Math.round((activeJobs.length / maxCapacity) * 100));

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
            {activeJobs.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs font-bold text-slate-400">
                🎉 No pending jobs assigned for today!
              </div>
            ) : (
              activeJobs.map((job) => (
                <div 
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-4 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold shrink-0 ${
                      job.isEmergency ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {job.isEmergency ? '⚡' : '🔧'}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-[#0A2540]">{job.title}</h4>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          job.isEmergency ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'
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
                      job.status === 'Completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : job.status === 'Service Started' || job.status === 'On The Way'
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-blue-100 text-blue-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
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

          {/* Quick Summary Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-[#0A2540]">Duty Performance Summary</h3>
            
            <div className="space-y-3 text-xs font-semibold text-slate-600">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Jobs Completed Today</span>
                <span className="font-extrabold text-emerald-600">{completedTodayCount} Jobs</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Total Jobs Handled</span>
                <span className="font-extrabold text-[#0A2540]">142 Jobs</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span>Average Completion Time</span>
                <span className="font-extrabold text-blue-600">45 Mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Cancellation Rate</span>
                <span className="font-extrabold text-slate-400">0.0%</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
