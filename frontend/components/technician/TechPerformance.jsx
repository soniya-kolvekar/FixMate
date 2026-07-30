'use client';

import { useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Zap, 
  Sparkles,
  DollarSign
} from 'lucide-react';

export default function TechPerformance({ 
  jobs = [], 
  currentUser,
  availability = 'Available'
}) {
  // 1. Pure Dynamic Metric Calculations (No hardcoded offset additions)
  const jobsCompletedToday = jobs.filter(j => j.status === 'Completed').length;
  const totalJobsCompleted = jobsCompletedToday; // Purely dynamic count of completed jobs
  const emergencyJobsAccepted = jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY' || j.category === 'Emergency') && j.status !== 'Cancelled').length;
  const emergencyJobsCompleted = jobs.filter(j => (j.isEmergency || j.tag === 'EMERGENCY' || j.category === 'Emergency') && j.status === 'Completed').length;
  const cancellationCount = jobs.filter(j => j.status === 'Cancelled' || j.status === 'CANCELLED' || Boolean(j.cancellationReason)).length;
  
  // Dynamic Monthly Payout Calculation based on COMPLETED jobs only
  const totalEarnings = (totalJobsCompleted * 499) + (emergencyJobsCompleted * 200);

  const [reviews] = useState([
    {
      id: 1,
      customer: 'Priya Sharma',
      rating: 5,
      date: '2 hours ago',
      comment: 'Rajesh arrived within 15 minutes for the pipe leak emergency in Kodialbail. Extremely professional and clean work!',
      service: 'Emergency Plumbing Repair'
    },
    {
      id: 2,
      customer: 'Aarav Mehta',
      rating: 5,
      date: 'Yesterday',
      comment: 'Fixed our geyser pressure issue in Hampankatta quickly. Great transparency on pricing.',
      service: 'Geyser Maintenance'
    },
    {
      id: 3,
      customer: 'Robert Kovich',
      rating: 4.8,
      date: '3 days ago',
      comment: 'Punctual, efficient and polite. Solved main pipeline block smoothly in Kadri Hills.',
      service: 'Pipeline Unblocking'
    }
  ]);

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#13395F] to-[#1D4ED8] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Mangaluru Performance Hub
            </span>

            {/* Current Duty Availability Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
              availability === 'Available' 
                ? 'bg-emerald-500 text-white shadow-sm' 
                : availability === 'Busy'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-200 border border-slate-600'
            }`}>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Status: {availability}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            {currentUser?.name || 'Rajesh Kumar'}'s Performance Summary
          </h2>
          <p className="text-xs text-blue-200 font-medium max-w-xl">
            Live dynamic statistics automatically updated after every completed job and dispatch status update.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Overall Customer Rating</span>
          <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1.5">
            <Star className="w-7 h-7 fill-amber-400 text-amber-400" /> 4.92
          </div>
          <p className="text-[11px] font-semibold text-slate-200">Based on verified reviews in Mangaluru</p>
        </div>
      </div>

      {/* 5 Dynamic Core Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Jobs Completed Today */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Completed Today</span>
          <h3 className="text-2xl font-black text-[#0A2540]">{jobsCompletedToday}</h3>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 py-0.5 px-2 rounded-full">
            ● Live Updated
          </span>
        </div>

        {/* Metric 2: Total Jobs Completed */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Completed</span>
          <h3 className="text-2xl font-black text-emerald-600">{totalJobsCompleted}</h3>
          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 py-0.5 px-2 rounded-full">
            Dynamic Total
          </span>
        </div>

        {/* Metric 3: Emergency Jobs Accepted */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Emergency Accepted</span>
          <h3 className="text-2xl font-black text-rose-600">{emergencyJobsAccepted}</h3>
          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 py-0.5 px-2 rounded-full">
            Accepted Calls
          </span>
        </div>

        {/* Metric 4: Cancellation Count */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Cancellations</span>
          <h3 className={`text-2xl font-black ${cancellationCount > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {cancellationCount}
          </h3>
          <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full ${
            cancellationCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {cancellationCount > 0 ? 'Mid Cancelled' : '0 Mid Cancel'}
          </span>
        </div>

        {/* Metric 5: Current Availability */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-2 text-center flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Current Availability</span>
          <h3 className={`text-xl font-black truncate ${
            availability === 'Available' ? 'text-emerald-600' : availability === 'Busy' ? 'text-amber-600' : 'text-slate-500'
          }`}>
            {availability}
          </h3>
          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 py-0.5 px-2 rounded-full">
            Synced Live
          </span>
        </div>

      </div>

      {/* Two Column Grid: Rating Reviews & Payout Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Customer Reviews (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0A2540]">Customer Feedback & Ratings</h3>
                <p className="text-xs text-slate-400 font-medium">Recent verified client feedback across Mangaluru sector</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                100% Verified Feedback
              </span>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-[#0A2540]">{rev.customer}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">• {rev.service}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{rev.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400 font-bold block text-right">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Monthly Payout Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Monthly Payout Summary</h4>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-1">
              <span className="text-2xl font-black text-[#0A2540]">₹{totalEarnings.toLocaleString()}</span>
              <p className="text-xs text-emerald-600 font-bold">Approved for Next Cycle Payout</p>
            </div>

            <div className="space-y-2 text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Completed Job Rates ({totalJobsCompleted})</span>
                <span>₹{(totalJobsCompleted * 499).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Bonus Pay ({emergencyJobsCompleted})</span>
                <span className="text-emerald-600 font-bold">+₹{(emergencyJobsCompleted * 200).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
