'use client';
import { useState } from 'react';
import { MapPin, Search, User } from 'lucide-react';

export default function TechJobList({ jobs = [], onSelectJob }) {
  const [filterTab, setFilterTab] = useState('All');
  const [search, setSearch] = useState('');

  const filteredJobs = jobs.filter(j => {
    const matchesFilter = 
      filterTab === 'All' ? true :
      filterTab === 'Assigned' ? j.status === 'Assigned' || j.status === 'Accepted' :
      filterTab === 'In Progress' ? j.status === 'On The Way' || j.status === 'Reached Location' || j.status === 'Service Started' :
      filterTab === 'Completed' ? j.status === 'Completed' :
      filterTab === 'Emergency' ? j.isEmergency || j.tag === 'EMERGENCY' : true;

    const matchesSearch = 
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.customerName.toLowerCase().includes(search.toLowerCase()) ||
      j.id.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 antialiased">
      
      {/* Header Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Assigned', 'In Progress', 'Completed', 'Emergency'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                filterTab === tab 
                  ? 'bg-[#0A2540] text-white shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
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
          <div className="md:col-span-2 text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-xs font-bold text-slate-400 space-y-2">
            <p>No assigned jobs found matching criteria.</p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer space-y-4 group relative overflow-hidden"
            >
              {job.isEmergency && (
                <div className="absolute top-0 right-0 bg-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider animate-pulse">
                  EMERGENCY
                </div>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider">
                    #{job.id} • {job.tag || 'SERVICE'}
                  </span>
                  <h3 className="text-base font-extrabold text-[#0A2540] group-hover:text-blue-600 transition-colors">
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

            </div>
          ))
        )}
      </div>

    </div>
  );
}
