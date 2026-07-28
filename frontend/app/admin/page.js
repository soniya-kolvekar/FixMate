'use client';
import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
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
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreVertical, 
  Sparkles,
  ArrowRight,
  Briefcase
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [timeframe, setTimeframe] = useState('This Year');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [toast, setToast] = useState(null);

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Line Chart Data (Actual vs Target for Jan - Dec)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const actualValues = [240, 240, 390, 350, 490, 750, 750, 860, 1020, 1080, 1180, 1220];
  const targetValues = [150, 200, 270, 310, 460, 580, 640, 740, 860, 920, 1000, 1060];

  // SVG Line Path Generators
  const getSvgPoints = (data) => {
    return data.map((val, i) => {
      const x = 40 + i * 55;
      const y = 220 - (val / 1300) * 180;
      return `${x},${y}`;
    }).join(' ');
  };

  const actualSvgPoints = getSvgPoints(actualValues);
  const targetSvgPoints = getSvgPoints(targetValues);

  // Sparkline Paths
  const sparklineBlue = "M 0 25 Q 15 5 30 18 T 60 8 T 90 22 T 120 5 L 120 35 L 0 35 Z";
  const sparklineOrange = "M 0 20 Q 20 28 40 10 T 80 18 T 120 8 L 120 35 L 0 35 Z";
  const sparklineGreen = "M 0 28 Q 15 15 30 22 T 60 5 T 90 12 T 120 4 L 120 35 L 0 35 Z";
  const sparklineRed = "M 0 10 Q 20 5 40 20 T 80 12 T 120 28 L 120 35 L 0 35 Z";

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-800 font-sans flex antialiased">
      
      {/* 1. Left Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 z-20 flex-shrink-0">
        <div className="space-y-8">
          
          {/* Brand Header */}
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-[#0F2A4A] tracking-tight">HomeService Admin</h1>
            <p className="text-[11px] font-semibold text-slate-400">Enterprise Control</p>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Users', icon: Users },
              { label: 'Technicians', icon: UserCheck },
              { label: 'Services', icon: Wrench },
              { label: 'Bookings', icon: Calendar },
              { label: 'Analytics', icon: TrendingUp },
              { label: 'Logs', icon: FileText },
              { label: 'Settings', icon: Settings }
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#A4C4FB]/60 text-[#1B4DFF] shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-[#0F2A4A]'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isActive ? 'text-[#1B4DFF]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Profile & Action */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden border border-slate-200 flex-shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
                alt="Admin Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-extrabold text-[#0F2A4A] truncate">Admin Profile</h5>
              <p className="text-[10px] text-slate-400 font-semibold truncate">System Administrator</p>
            </div>
          </div>

          <button 
            onClick={() => showToastMsg('Connecting to Support Portal...')}
            className="w-full bg-[#0F2A4A] hover:bg-[#1A3D68] text-white text-xs font-bold py-3 rounded-xl shadow-md transition-colors text-center"
          >
            Support Portal
          </button>
        </div>
      </aside>

      {/* 2. Main Content Window */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 sticky top-0 z-10 flex items-center justify-between gap-6">
          <h2 className="text-2xl font-extrabold text-[#0F2A4A] tracking-tight">Admin Console</h2>

          <div className="flex items-center gap-6 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-slate-100/90 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all" 
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button 
              onClick={() => showToastMsg('You have 3 unread system alerts')}
              className="relative text-slate-500 hover:text-[#0F2A4A] transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            <button 
              onClick={() => showToastMsg('Admin Help Center')}
              className="text-slate-500 hover:text-[#0F2A4A] transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <Link 
              href="/" 
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
            >
              Sign Out
            </Link>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="p-8 space-y-7">
          
          {/* Top Row: 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Total Revenue</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A] tracking-tight">$1,284,500</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>↑ 12.5% vs last month</span>
              </div>
            </div>

            {/* Active Technicians */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Active Technicians</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A] tracking-tight">1,482</div>
              <div className="text-xs font-semibold text-slate-500">
                .86.4% Currently Online
              </div>
            </div>

            {/* Pending Emergencies */}
            <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/30 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-500">Pending Emergencies</span>
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4 animate-bounce" />
                </div>
              </div>
              <div className="text-2xl font-black text-rose-600 tracking-tight">14</div>
              <div className="text-xs font-bold text-rose-600">
                High Priority Action Required
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Customer Satisfaction</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="text-base">😊</span>
                </div>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A] tracking-tight">4.82/5</div>
              <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span>↑ 98% Positive Sentiment</span>
              </div>
            </div>

          </div>

          {/* Middle Main Section: Line Chart + Live Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Jobs Completed vs Target (Dual Curved Line Chart) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0F2A4A]">Jobs Completed vs Target</h3>
                  <p className="text-xs text-slate-400 font-medium">Annual performance metrics across all regions</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1B4DFF]"></span> Actual
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span> Target
                    </span>
                  </div>

                  <select 
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 focus:outline-none"
                  >
                    <option>This Year</option>
                    <option>Last Year</option>
                    <option>Quarterly</option>
                  </select>
                </div>
              </div>

              {/* Responsive SVG Line Chart */}
              <div className="relative pt-4 pb-2">
                <svg className="w-full h-56 overflow-visible" viewBox="0 0 680 230">
                  {/* Horizontal Grid lines */}
                  {[
                    { label: '1.25K', y: 40 },
                    { label: '1K', y: 80 },
                    { label: '750', y: 120 },
                    { label: '500', y: 160 },
                    { label: '250', y: 200 }
                  ].map((g, i) => (
                    <g key={i}>
                      <text x="0" y={g.y + 4} className="text-[10px] fill-slate-400 font-medium">{g.label}</text>
                      <line x1="35" y1={g.y} x2="680" y2={g.y} stroke="#E2E8F0" strokeDasharray="3 3" strokeWidth="1" />
                    </g>
                  ))}
                  
                  {/* Target Line (Light Dashed Gray) */}
                  <polyline 
                    fill="none" 
                    stroke="#CBD5E1" 
                    strokeWidth="2" 
                    strokeDasharray="4 4" 
                    points={targetSvgPoints} 
                  />

                  {/* Actual Line (Solid Vibrant Blue) */}
                  <polyline 
                    fill="none" 
                    stroke="#1B4DFF" 
                    strokeWidth="2.5" 
                    points={actualSvgPoints} 
                  />

                  {/* Target Data Nodes */}
                  {targetValues.map((val, i) => {
                    const x = 40 + i * 55;
                    const y = 220 - (val / 1300) * 180;
                    return (
                      <circle key={`t-${i}`} cx={x} cy={y} r="3" className="fill-slate-300" />
                    );
                  })}

                  {/* Actual Data Nodes */}
                  {actualValues.map((val, i) => {
                    const x = 40 + i * 55;
                    const y = 220 - (val / 1300) * 180;
                    const month = months[i];
                    return (
                      <circle 
                        key={`a-${i}`} 
                        cx={x} 
                        cy={y} 
                        r="4" 
                        onMouseEnter={() => setHoveredPoint({ month, actual: val, target: targetValues[i] })}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="fill-[#1B4DFF] stroke-white stroke-2 cursor-pointer hover:r-6 transition-all" 
                      />
                    );
                  })}
                </svg>

                {/* X-Axis Month Labels */}
                <div className="flex justify-between pl-9 text-xs font-semibold text-slate-400 pt-2">
                  {months.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                {/* Hover Tooltip Popup */}
                {hoveredPoint && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0F2A4A] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-4 z-20">
                    <span>{hoveredPoint.month}</span>
                    <span className="text-blue-400">Actual: {hoveredPoint.actual}</span>
                    <span className="text-slate-300">Target: {hoveredPoint.target}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-base font-extrabold text-[#0F2A4A]">Live Activity</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'New Technician Verified',
                    desc: 'Manuel Johnson (Plumbing Specialist) added to Los Angeles region.',
                    time: '2 MINUTES AGO',
                    icon: CheckCircle2,
                    color: 'text-blue-600 bg-blue-50'
                  },
                  {
                    title: 'Large Scale Outage Resolved',
                    desc: 'System stability restored for East Coast booking gateway.',
                    time: '8 MINUTES AGO',
                    icon: CheckCircle2,
                    color: 'text-emerald-600 bg-emerald-50'
                  },
                  {
                    title: 'Revenue Milestone Reached',
                    desc: 'Q3 target exceeded by 5% in "General Maintenance" sector.',
                    time: '25 MINUTES AGO',
                    icon: TrendingUp,
                    color: 'text-blue-600 bg-blue-50'
                  },
                  {
                    title: 'Scheduled Maintenance',
                    desc: 'Database optimization window starting at 02:00 AM UTC.',
                    time: '4 HOURS AGO',
                    icon: Clock,
                    color: 'text-slate-500 bg-slate-100'
                  }
                ].map((act, i) => {
                  const IconC = act.icon;
                  return (
                    <div key={i} className="flex gap-3 items-start">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${act.color}`}>
                        <IconC className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-extrabold text-[#0F2A4A]">{act.title}</h5>
                        <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{act.desc}</p>
                        <span className="text-[9px] font-bold text-slate-400 mt-1 block uppercase">{act.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4 Mini Trend Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Today's Bookings */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" /> Today's Bookings
                </span>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A]">247</div>
              <div className="text-xs font-bold text-emerald-600">↑ 18% vs yesterday</div>
              
              {/* Mini Sparkline Background */}
              <div className="h-9 w-full opacity-40">
                <svg className="w-full h-full" viewBox="0 0 120 35">
                  <path d={sparklineBlue} fill="#1B4DFF" />
                </svg>
              </div>
            </div>

            {/* Jobs In Progress */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-amber-500" /> Jobs In Progress
                </span>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A]">96</div>
              <div className="text-xs font-bold text-emerald-600">↑ 8% vs yesterday</div>

              <div className="h-9 w-full opacity-40">
                <svg className="w-full h-full" viewBox="0 0 120 35">
                  <path d={sparklineOrange} fill="#F59E0B" />
                </svg>
              </div>
            </div>

            {/* Completed Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Completed Today
                </span>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A]">138</div>
              <div className="text-xs font-bold text-emerald-600">↑ 14% vs yesterday</div>

              <div className="h-9 w-full opacity-40">
                <svg className="w-full h-full" viewBox="0 0 120 35">
                  <path d={sparklineGreen} fill="#10B981" />
                </svg>
              </div>
            </div>

            {/* Cancelled Today */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-3 relative overflow-hidden">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-500" /> Cancelled Today
                </span>
              </div>
              <div className="text-2xl font-black text-[#0F2A4A]">13</div>
              <div className="text-xs font-bold text-rose-500">↓ 5% vs yesterday</div>

              <div className="h-9 w-full opacity-40">
                <svg className="w-full h-full" viewBox="0 0 120 35">
                  <path d={sparklineRed} fill="#EF4444" />
                </svg>
              </div>
            </div>

          </div>

          {/* Revenue by Category + Top Technicians + Real-time Field Map */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue by Service Category (Donut Chart) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#0F2A4A]">Revenue by Service Category</h3>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                
                {/* SVG Donut Chart */}
                <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Segment 1: Plumbing 35% */}
                    <path className="text-emerald-500" strokeDasharray="35, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Segment 2: Electrical 30% */}
                    <path className="text-blue-600" strokeDasharray="30, 100" strokeDashoffset="-35" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Segment 3: HVAC 20% */}
                    <path className="text-[#0F2A4A]" strokeDasharray="20, 100" strokeDashoffset="-65" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Segment 4: Cleaning 10% */}
                    <path className="text-purple-500" strokeDasharray="10, 100" strokeDashoffset="-85" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Segment 5: Other 5% */}
                    <path className="text-amber-500" strokeDasharray="5, 100" strokeDashoffset="-95" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute text-center">
                    <div className="text-sm font-black text-[#0F2A4A]">$1.2M</div>
                    <div className="text-[9px] font-bold text-slate-400">Total</div>
                  </div>
                </div>

                {/* Legend List */}
                <div className="space-y-1.5 flex-1 text-xs font-semibold">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Plumbing (35%)</span>
                    <span className="font-bold text-[#0F2A4A]">$448K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Electrical (30%)</span>
                    <span className="font-bold text-[#0F2A4A]">$384K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#0F2A4A]"></span> HVAC (20%)</span>
                    <span className="font-bold text-[#0F2A4A]">$256K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Cleaning (10%)</span>
                    <span className="font-bold text-[#0F2A4A]">$128K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Other (5%)</span>
                    <span className="font-bold text-[#0F2A4A]">$64K</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Top Performing Technicians */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-[#0F2A4A]">Top Performing Technicians</h3>
                <select className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </div>

              <div className="space-y-3">
                {[
                  { rank: 1, name: 'James Smith', role: 'Plumbing Specialist', rating: '98%', jobs: '142 jobs', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=80' },
                  { rank: 2, name: 'Maria Johnson', role: 'Electrical Expert', rating: '96%', jobs: '128 jobs', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80' },
                  { rank: 3, name: 'Robert Davis', role: 'HVAC Technician', rating: '94%', jobs: '115 jobs', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80' },
                  { rank: 4, name: 'David Wilson', role: 'General Maintenance', rating: '92%', jobs: '108 jobs', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }
                ].map((tech) => (
                  <div key={tech.rank} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-400 w-4 text-center">{tech.rank}</span>
                      <img src={tech.img} alt={tech.name} className="w-8 h-8 rounded-full object-cover border border-slate-200" />
                      <div>
                        <h5 className="text-xs font-extrabold text-[#0F2A4A]">{tech.name}</h5>
                        <p className="text-[10px] text-slate-400 font-semibold">{tech.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-600 block">{tech.rating}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{tech.jobs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-time Field Map Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between space-y-4">
              <h3 className="text-base font-extrabold text-[#0F2A4A]">Real-time Field Map</h3>
              
              {/* Futuristic Map Visual Card */}
              <div className="relative h-44 rounded-xl bg-[#0B1E36] overflow-hidden flex flex-col justify-end p-4 shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:10px_10px] opacity-30"></div>
                <div className="absolute top-4 left-6 w-20 h-20 rounded-full border border-blue-500/30 animate-ping"></div>
                <div className="absolute top-8 right-10 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-md shadow-emerald-400"></div>
                <div className="absolute bottom-10 left-12 w-2.5 h-2.5 rounded-full bg-blue-400 shadow-md shadow-blue-400"></div>
                <div className="absolute top-6 left-16 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-md shadow-amber-400"></div>
                
                <button 
                  onClick={() => showToastMsg('Opening Real-time GPS Field Map...')}
                  className="relative z-10 w-fit bg-[#0F2A4A] hover:bg-[#1A3D68] text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition-all flex items-center gap-1.5"
                >
                  <span>View Full Map</span>
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Table: Recent Bookings */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#0F2A4A]">Recent Bookings</h3>
              <button 
                onClick={() => showToastMsg('Viewing all bookings...')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                <span>View All Bookings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-3">Booking ID</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Service</th>
                    <th className="pb-3">Technician</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Scheduled At</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {[
                    { id: '#HS-2024-8761', customer: 'John Doe', service: 'Plumbing Repair', tech: 'James Smith', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', time: 'May 25, 2024 · 10:00 AM', amount: '$120.00' },
                    { id: '#HS-2024-8760', customer: 'Sarah Wilson', service: 'AC Installation', tech: 'Maria Johnson', status: 'Assigned', statusColor: 'bg-amber-100 text-amber-700', time: 'May 25, 2024 · 11:30 AM', amount: '$350.00' },
                    { id: '#HS-2024-8759', customer: 'Mike Brown', service: 'Electrical Wiring', tech: 'Robert Davis', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700', time: 'May 25, 2024 · 09:00 AM', amount: '$180.00' },
                    { id: '#HS-2024-8758', customer: 'Lisa Anderson', service: 'Deep Cleaning', tech: 'David Wilson', status: 'Scheduled', statusColor: 'bg-purple-100 text-purple-700', time: 'May 26, 2024 · 02:00 PM', amount: '$90.00' },
                    { id: '#HS-2024-8757', customer: 'David Lee', service: 'Water Heater Fix', tech: 'James Smith', status: 'Pending', statusColor: 'bg-rose-100 text-rose-700', time: 'May 26, 2024 · 04:30 PM', amount: '$150.00' }
                  ].map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 font-extrabold text-blue-600 cursor-pointer hover:underline">{row.id}</td>
                      <td className="py-4 font-bold text-[#0F2A4A]">{row.customer}</td>
                      <td className="py-4 text-slate-600">{row.service}</td>
                      <td className="py-4 text-slate-600">{row.tech}</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-4 text-slate-500">{row.time}</td>
                      <td className="py-4 font-extrabold text-[#0F2A4A]">{row.amount}</td>
                      <td className="py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4 inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-semibold gap-4 mt-auto">
          <p>© 2024 FieldFlow Enterprise. All Rights Reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => showToastMsg('Privacy Policy')} className="hover:text-slate-600">Privacy Policy</button>
            <button onClick={() => showToastMsg('System Health: 100% Operational')} className="hover:text-slate-600">System Health</button>
            <button onClick={() => showToastMsg('API Documentation')} className="hover:text-slate-600">API Docs</button>
          </div>
        </footer>

      </main>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0F2A4A] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
  );
}
