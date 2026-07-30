'use client';

import { useState } from 'react';
import { 
  Star, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Award, 
  DollarSign, 
  ThumbsUp, 
  Zap, 
  Calendar,
  Sparkles,
  BarChart2
} from 'lucide-react';

export default function TechPerformance({ jobs = [], currentUser }) {
  const completedJobsCount = jobs.filter(j => j.status === 'Completed').length + 142;
  const emergencyJobsCount = jobs.filter(j => j.isEmergency).length + 18;
  const totalEarnings = (completedJobsCount * 499) + 12500;

  const [reviews] = useState([
    {
      id: 1,
      customer: 'Priya Sharma',
      rating: 5,
      date: '2 hours ago',
      comment: 'Rajesh arrived within 15 minutes for the pipe leak emergency. Extremely professional and clean work!',
      service: 'Emergency Plumbing Repair'
    },
    {
      id: 2,
      customer: 'Aarav Mehta',
      rating: 5,
      date: 'Yesterday',
      comment: 'Fixed our geyser pressure issue quickly. Great transparency on pricing and extra charges.',
      service: 'Geyser Maintenance'
    },
    {
      id: 3,
      customer: 'Robert Kovich',
      rating: 4.8,
      date: '3 days ago',
      comment: 'Punctual, efficient and polite. Solved main pipeline block smoothly.',
      service: 'Pipeline Unblocking'
    }
  ]);

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#0A2540] via-[#13395F] to-[#1D4ED8] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Top Rated Specialist 2026
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-heading">
            {currentUser?.name || 'Rajesh Kumar'}'s Performance Analytics
          </h2>
          <p className="text-xs text-blue-200 font-medium max-w-xl">
            Real-time rating, service metrics, customer satisfaction index, and task completion speed.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 space-y-1">
          <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">Overall Customer Rating</span>
          <div className="text-3xl font-black text-amber-400 flex items-center justify-center gap-1.5">
            <Star className="w-7 h-7 fill-amber-400 text-amber-400" /> 4.92
          </div>
          <p className="text-[11px] font-semibold text-slate-200">Based on 148 verified reviews</p>
        </div>
      </div>

      {/* Main Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Jobs Completed</span>
          <h3 className="text-2xl font-black text-[#0A2540]">{completedJobsCount}</h3>
          <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +14% this month
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Emergency Runs</span>
          <h3 className="text-2xl font-black text-[#0A2540]">{emergencyJobsCount}</h3>
          <span className="text-[11px] font-bold text-rose-600">100% Acceptance Rate</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Avg Resolution Time</span>
          <h3 className="text-2xl font-black text-[#0A2540]">38 Mins</h3>
          <span className="text-[11px] font-bold text-blue-600">8 Mins faster than SLA</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">Cancellation Rate</span>
          <h3 className="text-2xl font-black text-[#0A2540]">0.4%</h3>
          <span className="text-[11px] font-bold text-emerald-600">Exemplary Reliability</span>
        </div>

      </div>

      {/* Two Column Grid: Rating Breakdown & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Rating Breakdown & Customer Reviews (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#0A2540]">Customer Ratings & Reviews</h3>
                <p className="text-xs text-slate-400 font-medium">Recent client feedback and satisfaction ratings</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                100% Verified Customer Reviews
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

        {/* Right Sidebar: Achievement Badges & Earnings Summary */}
        <div className="space-y-6">
          
          {/* Earnings Card */}
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
                <span>Base Service Revenue</span>
                <span>₹{(totalEarnings * 0.85).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Emergency Bonus Pay</span>
                <span className="text-emerald-600 font-bold">+₹{(totalEarnings * 0.15).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
