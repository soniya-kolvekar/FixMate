'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  Calendar, 
  TrendingUp, 
  FileText, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ShieldAlert, 
  Star, 
  Activity, 
  ShieldCheck, 
  Send, 
  MapPin, 
  ChevronRight, 
  ArrowUpRight, 
  PieChart, 
  RefreshCw, 
  Sparkles,
  Award,
  CheckCircle2,
  SlidersHorizontal,
  Plus
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [timeframe, setTimeframe] = useState('monthly');
  const [hoveredBar, setHoveredBar] = useState(null);
  const [toast, setToast] = useState(null);
  const [livePulse, setLivePulse] = useState(true);

  // Live pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLivePulse(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Monthly performance dataset for "Jobs Completed vs Target"
  const chartData = [
    { month: 'Jan', actual: 980, target: 1100, growth: '+12%' },
    { month: 'Feb', actual: 1250, target: 1200, growth: '+18%' },
    { month: 'Mar', actual: 1420, target: 1350, growth: '+15%' },
    { month: 'Apr', actual: 1100, target: 1300, growth: '+8%' },
    { month: 'May', actual: 1680, target: 1500, growth: '+24%' },
    { month: 'Jun', actual: 1890, target: 1650, growth: '+28%' },
    { month: 'Jul', actual: 2150, target: 1800, growth: '+32%' },
    { month: 'Aug', actual: 1980, target: 1850, growth: '+22%' },
    { month: 'Sep', actual: 2300, target: 2000, growth: '+35%' },
    { month: 'Oct', actual: 2100, target: 1950, growth: '+26%' },
    { month: 'Nov', actual: 2450, target: 2100, growth: '+38%' },
    { month: 'Dec', actual: 2680, target: 2300, growth: '+42%' }
  ];

  const maxVal = 3000;

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-800 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">

        {/* 1. Left Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 z-20 flex-shrink-0">
          <div className="space-y-8">
            
            {/* Admin Brand */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3 group">
                <img 
                  src="/assets/images/logo.png" 
                  alt="FixMate Logo" 
                  className="h-10 w-auto object-contain transition-transform group-hover:scale-105" 
                />
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1.5">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'users', label: 'Users', icon: Users, badge: '1.4k' },
                { id: 'services', label: 'Services', icon: Wrench },
                { id: 'bookings', label: 'Bookings', icon: Calendar, badge: 'New' },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'logs', label: 'Logs', icon: FileText },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white shadow-md shadow-blue-500/20 translate-x-1' 
                        : 'text-slate-600 hover:bg-slate-100/80 hover:text-[#0A2540]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer / Admin Profile */}
          <div className="space-y-4 pt-6 border-t border-slate-200/80">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0A2540] to-blue-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                AP
              </div>
              <div className="overflow-hidden">
                <h5 className="text-xs font-extrabold text-[#0A2540] truncate">Admin Profile</h5>
                <p className="text-[10px] text-slate-500 font-semibold truncate">System Authority</p>
              </div>
            </div>

            <Link
              href="/"
              className="w-full bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-200 hover:shadow-lg"
            >
              <span>Support Portal</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            </Link>
          </div>
        </aside>

        {/* 2. Main Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto">
          
          {/* Top Bar Header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 sticky top-0 z-10 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <h1 className="text-2xl font-black text-[#0A2540] tracking-tight">Admin Console</h1>
              <div className="relative flex-1 hidden sm:block">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search systems, technicians, bookings..." 
                  className="w-full bg-slate-100/80 border border-slate-200/60 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-[#0A2540] focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:bg-white transition-all" 
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => showToastMsg('No new notifications')}
                className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600"></span>
              </button>

              <button 
                onClick={() => showToastMsg('Admin Help Docs loading...')}
                className="p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 text-slate-600 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              <Link 
                href="/" 
                className="text-xs font-bold text-slate-600 hover:text-red-600 px-3 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Link>
            </div>
          </header>

          {/* Main Dashboard Workspace */}
          <div className="p-8 space-y-8 flex-1">
            
            {/* Top Stat Cards (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Total Revenue */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Total Revenue</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#0A2540] tracking-tight mb-2">₹12,84,500</div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+12.5% vs last month</span>
                </div>
              </div>

              {/* Active Technicians */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Active Technicians</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#0A2540] tracking-tight mb-2">1,482</div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600">
                  <span className={`w-2 h-2 rounded-full bg-emerald-500 ${livePulse ? 'opacity-100 scale-110' : 'opacity-70 scale-100'} transition-all`}></span>
                  <span>84 Currently Online</span>
                </div>
              </div>

              {/* Pending Emergencies */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 border-t-4 border-t-rose-500 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Pending Emergencies</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-rose-600 tracking-tight mb-2">14</div>
                <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full w-fit">
                  <ShieldAlert className="w-3 h-3" />
                  <span>High Priority Action Required</span>
                </div>
              </div>

              {/* Customer Satisfaction */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all group">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Customer Satisfaction</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#0A2540] tracking-tight mb-2">4.82/5</div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>98% Positive Sentiment</span>
                </div>
              </div>
            </div>

            {/* Central Grid Row: Jobs Completed vs Target + Live Activity & Fleet */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Center Main Module: Jobs Completed vs Target (Rich Urban Company Animated Visualizer) */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
                
                {/* Module Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-xl font-black text-[#0A2540] tracking-tight">Jobs Completed vs Target</h3>
                    <p className="text-xs font-semibold text-slate-500">Annual performance metrics across all service regions</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-xs font-bold">
                      <span className="flex items-center gap-1.5 text-[#0A2540]">
                        <span className="w-3 h-3 rounded-full bg-[#0A2540]"></span> Actual
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-slate-200"></span> Target
                      </span>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      {['monthly', 'quarterly', 'annual'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTimeframe(t)}
                          className={`px-3 py-1 rounded-lg capitalize transition-all ${
                            timeframe === t ? 'bg-white text-[#0A2540] shadow-sm' : 'text-slate-500 hover:text-[#0A2540]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Animated Interactive Bar Chart Component (Fills Void Area) */}
                <div className="relative pt-6 pb-2 min-h-[300px] flex flex-col justify-end">
                  
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 font-bold">3,000</div>
                    <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 font-bold">2,250</div>
                    <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 font-bold">1,500</div>
                    <div className="border-b border-dashed border-slate-300 text-[10px] text-slate-400 font-bold">750</div>
                    <div className="border-b border-slate-200"></div>
                  </div>

                  {/* Hover Info Tooltip Bar */}
                  {hoveredBar && (
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0A2540] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-4 animate-in fade-in zoom-in duration-150 z-20">
                      <span>Month: {hoveredBar.month}</span>
                      <span className="text-emerald-400">Actual: {hoveredBar.actual}</span>
                      <span className="text-slate-300">Target: {hoveredBar.target}</span>
                      <span className="text-blue-300">{hoveredBar.growth}</span>
                    </div>
                  )}

                  {/* Bars Container */}
                  <div className="relative z-10 grid grid-cols-12 gap-2 sm:gap-3 items-end h-[220px] px-2">
                    {chartData.map((d, idx) => {
                      const actualHeight = `${(d.actual / maxVal) * 100}%`;
                      const targetHeight = `${(d.target / maxVal) * 100}%`;
                      const isHovered = hoveredBar?.month === d.month;

                      return (
                        <div 
                          key={idx} 
                          onMouseEnter={() => setHoveredBar(d)}
                          onMouseLeave={() => setHoveredBar(null)}
                          className="group flex flex-col items-center gap-2 h-full justify-end cursor-pointer"
                        >
                          {/* Dual Bar Pair */}
                          <div className="w-full flex items-end justify-center gap-1 h-full">
                            {/* Actual Bar */}
                            <div 
                              style={{ height: actualHeight }}
                              className={`w-1/2 max-w-[14px] rounded-t-lg transition-all duration-500 ${
                                isHovered 
                                  ? 'bg-blue-600 shadow-lg shadow-blue-500/40 scale-105' 
                                  : 'bg-[#0A2540] group-hover:bg-blue-600'
                              }`}
                            ></div>
                            {/* Target Bar */}
                            <div 
                              style={{ height: targetHeight }}
                              className="w-1/2 max-w-[14px] bg-slate-200 rounded-t-lg transition-all duration-300 group-hover:bg-slate-300"
                            ></div>
                          </div>

                          {/* Month Label */}
                          <span className={`text-[11px] font-extrabold transition-colors ${
                            isHovered ? 'text-blue-600' : 'text-slate-500'
                          }`}>
                            {d.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Urban Company Metric Highlights Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase">Yearly Target Achieved</div>
                      <div className="text-sm font-black text-[#0A2540]">86.4% Completed</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 font-bold">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase">Avg Response Time</div>
                      <div className="text-sm font-black text-[#0A2540]">14.2 Mins (Fast)</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600 font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase">Top Operational City</div>
                      <div className="text-sm font-black text-[#0A2540]">Mumbai Metro</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side Column: Live Activity Feed + Real-time Fleet Map */}
              <div className="space-y-6 flex flex-col justify-between">
                
                {/* Live Activity Feed */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-[#0A2540] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span>Live Activity</span>
                    </h3>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        title: 'New Technician Verified',
                        desc: 'Marcus Johnson (Plumbing Specialist) added to London North region.',
                        time: '2 MINUTES AGO',
                        color: 'bg-blue-600'
                      },
                      {
                        title: 'Large Scale Outage Resolved',
                        desc: 'System stability restored for East Coast booking gateways.',
                        time: '45 MINUTES AGO',
                        color: 'bg-emerald-500'
                      },
                      {
                        title: 'Revenue Milestone Reached',
                        desc: 'Q3 targets exceeded by 5% in "General Maintenance" sector.',
                        time: '2 HOURS AGO',
                        color: 'bg-indigo-600'
                      },
                      {
                        title: 'Scheduled Maintenance',
                        desc: 'Database optimization window starting at 02:00 AM UTC.',
                        time: '4 HOURS AGO',
                        color: 'bg-slate-400'
                      }
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 relative group">
                        <div className="flex flex-col items-center">
                          <span className={`w-3 h-3 rounded-full ${act.color} ring-4 ring-white z-10`}></span>
                          {i !== 3 && <span className="w-0.5 h-full bg-slate-200 absolute top-3"></span>}
                        </div>
                        <div className="pb-3">
                          <h5 className="text-xs font-extrabold text-[#0A2540] group-hover:text-blue-600 transition-colors">
                            {act.title}
                          </h5>
                          <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                            {act.desc}
                          </p>
                          <span className="text-[9px] font-bold text-slate-400 mt-1 block">
                            {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Fleet Map Module */}
                <div className="bg-[#0A2540] rounded-2xl p-5 text-white shadow-lg relative overflow-hidden group">
                  <div className="relative z-10 flex justify-between items-start mb-12">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300">Live GPS Matrix</span>
                      <h4 className="text-base font-extrabold text-white">Real-time Fleet Map</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> 84 Active
                    </span>
                  </div>

                  {/* Simulated Radar Map Graphic */}
                  <div className="h-28 rounded-xl bg-[#061729] border border-blue-900/50 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:12px_12px] opacity-20"></div>
                    
                    {/* Radar Pulse Rings */}
                    <div className="w-20 h-20 rounded-full border border-blue-500/30 animate-ping absolute"></div>
                    <div className="w-36 h-36 rounded-full border border-blue-500/20 absolute"></div>

                    {/* Technician Location Pins */}
                    <div className="absolute top-4 left-8 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce"></div>
                    <div className="absolute top-10 right-12 w-3 h-3 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse"></div>
                    <div className="absolute bottom-6 left-16 w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50"></div>
                    <div className="absolute bottom-5 right-8 w-3 h-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-bounce"></div>

                    <span className="relative z-10 text-xs font-bold text-blue-200 bg-[#0A2540]/80 px-3 py-1.5 rounded-lg border border-blue-500/30 backdrop-blur-sm flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" /> Dispatch Radar Active
                    </span>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Row Modules: Revenue by Service Category + Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Revenue by Service Category (Donut Chart Module) */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0A2540]">Revenue by Service Category</h3>
                    <p className="text-xs text-slate-500">Distribution breakdown across core service verticals</p>
                  </div>
                  <button className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
                  
                  {/* SVG Animated Donut Chart */}
                  <div className="relative w-44 h-44 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      {/* Background Ring */}
                      <path
                        className="text-slate-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Plumbing Segment 45% */}
                      <path
                        className="text-[#0A2540] transition-all duration-1000"
                        strokeDasharray="45, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Electrical Segment 30% */}
                      <path
                        className="text-blue-600 transition-all duration-1000"
                        strokeDasharray="30, 100"
                        strokeDashoffset="-45"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* HVAC Segment 25% */}
                      <path
                        className="text-indigo-400 transition-all duration-1000"
                        strokeDasharray="25, 100"
                        strokeDashoffset="-75"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>

                    {/* Donut Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-bold text-slate-400 uppercase">Total</span>
                      <span className="text-xl font-black text-[#0A2540]">₹12.8M</span>
                    </div>
                  </div>

                  {/* Donut Legend List */}
                  <div className="space-y-3 flex-1 max-w-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-[#0A2540]"></span>
                        <span className="text-xs font-bold text-[#0A2540]">Plumbing</span>
                      </div>
                      <span className="text-xs font-black text-slate-700">45% (₹5.7M)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                        <span className="text-xs font-bold text-[#0A2540]">Electrical</span>
                      </div>
                      <span className="text-xs font-black text-slate-700">30% (₹3.8M)</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
                        <span className="text-xs font-bold text-[#0A2540]">HVAC / AC</span>
                      </div>
                      <span className="text-xs font-black text-slate-700">25% (₹3.3M)</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Quick Actions (Dark Navy Card) */}
              <div className="bg-[#0A2540] rounded-2xl p-7 text-white shadow-lg flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-extrabold text-white mb-1">Quick Actions</h3>
                  <p className="text-xs text-slate-300">Execute key system commands and administrative broadcasts</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => showToastMsg('Technician verification portal opened')}
                    className="w-full p-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-400/30 text-white font-bold text-xs flex justify-between items-center transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Verify Technicians</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => showToastMsg('Generating monthly performance PDF...')}
                    className="w-full p-4 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-400/30 text-white font-bold text-xs flex justify-between items-center transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Generate Monthly Report</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-blue-300 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => showToastMsg('Global Notification Broadcast sent to 1,482 techs')}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex justify-between items-center transition-all shadow-md group"
                  >
                    <div className="flex items-center gap-3">
                      <Send className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                      <span>Global Notification Broadcast</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Admin Page Footer */}
          <footer className="bg-white border-t border-slate-200/80 px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; 2026 FixMate Enterprise. All Rights Reserved.</p>
            <div className="flex items-center gap-6 font-semibold">
              <button onClick={() => showToastMsg('Privacy Policy page')} className="hover:text-[#0A2540]">Privacy Policy</button>
              <button onClick={() => showToastMsg('System Status: 100% Operational')} className="hover:text-[#0A2540]">System Health</button>
              <button onClick={() => showToastMsg('API Docs version v2.4')} className="hover:text-[#0A2540]">API Docs</button>
            </div>
          </footer>
        </main>

      </div>

      {/* Toast Alert Popup */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A2540] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold animate-in slide-in-from-bottom duration-200 border border-blue-500/30">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
