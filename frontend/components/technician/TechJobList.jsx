'use client';
import { useState } from 'react';
import { MapPin, Search, User, Ban } from 'lucide-react';

export default function TechJobList({ jobs = [], onSelectJob }) {
  const [filterTab, setFilterTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter(j => {
    const isCancelledJob = 
      j.status === 'Cancelled' || 
      j.status === 'CANCELLED' || 
      j.status === 'cancelled' ||
      (typeof j.status === 'string' && j.status.toLowerCase().includes('cancel'));

    const matchesFilter = 
      filterTab === 'All' ? true :
      filterTab === 'Assigned' ? (j.status === 'Assigned' || j.status === 'Accepted') && !isCancelledJob :
      filterTab === 'In Progress' ? (j.status === 'On The Way' || j.status === 'Reached Location' || j.status === 'Service Started') && !isCancelledJob :
      filterTab === 'Completed' ? j.status === 'Completed' :
      filterTab === 'Emergency' ? (j.isEmergency || j.tag === 'EMERGENCY') && !isCancelledJob :
      filterTab === 'Cancelled' ? isCancelledJob : true;

    const matchesSearch = 
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
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

    const tierA = getJobTier(a);
    const tierB = getJobTier(b);
    if (tierA !== tierB) return tierA - tierB;

    const timeA = parseTimeMinutes(a.time || a.createdAt);
    const timeB = parseTimeMinutes(b.time || b.createdAt);
    return timeA - timeB;
  });

  return (
    <div className="space-y-6 antialiased">
      
      {/* Header Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Assigned', 'In Progress', 'Completed', 'Emergency', 'Cancelled'].map((tab) => {
            const count = tab === 'Cancelled' 
              ? jobs.filter(j => j.status === 'Cancelled' || j.status === 'CANCELLED').length 
              : null;

            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  filterTab === tab 
                    ? tab === 'Cancelled' 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'bg-[#0A2540] text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span>{tab}</span>
                {count !== null && count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black ${
                    filterTab === tab ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick List Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search job or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
          />
        </div>

      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredJobs.length === 0 ? (
          <div className="md:col-span-2 text-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200 text-xs font-bold text-slate-400 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-black text-lg">
              📋
            </div>
            <h4 className="text-sm font-extrabold text-[#0A2540]">No Service Requests Assigned Yet</h4>
            <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
              When the Dispatcher assigns a customer service request to your roster, it will populate here dynamically in real time.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isCancelled = 
              job.status === 'Cancelled' || 
              job.status === 'CANCELLED' || 
              job.status === 'cancelled' || 
              (typeof job.status === 'string' && job.status.toLowerCase().includes('cancel'));

            return (
              <div
                key={job.id}
                onClick={() => onSelectJob(job)}
                className={`bg-white rounded-3xl p-6 border transition-all cursor-pointer space-y-4 group relative overflow-hidden ${
                  isCancelled 
                    ? 'border-rose-200 bg-rose-50/30 hover:border-rose-400 opacity-90' 
                    : 'border-slate-200/80 hover:border-blue-400 hover:shadow-lg'
                }`}
              >
                {job.isEmergency && !isCancelled && (
                  <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse">
                    EMERGENCY
                  </div>
                )}

                {isCancelled && (
                  <div className="absolute top-0 right-0 bg-rose-600 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                    <Ban className="w-3 h-3" /> CANCELLED
                  </div>
                )}

                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                      isCancelled ? 'text-rose-600' : 'text-blue-600'
                    }`}>
                      #{job.id} • {job.tag || (job.isEmergency ? 'EMERGENCY' : 'SERVICE')}
                    </span>
                    <h3 className={`text-base font-extrabold transition-colors ${
                      isCancelled ? 'text-slate-600 line-through' : 'text-[#0A2540] group-hover:text-blue-600'
                    }`}>
                      {job.title}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-[#0A2540]">
                      ₹{(job.price + (job.extraCharges || 0)).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-medium text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{job.location}</span>
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {job.customerName}
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
                      {job.status}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
