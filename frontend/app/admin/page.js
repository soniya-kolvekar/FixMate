'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Wrench, 
  Calendar, 
  Settings, 
  Search, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreVertical, 
  Sparkles,
  ArrowRight,
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Filter,
  Check,
  TrendingUp,
  Sliders,
  DollarSign,
  Lock,
  UserPlus
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [timeframe, setTimeframe] = useState('This Year');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter & Modal States for sub-pages
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Plumbing');

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Dummy Initial Datasets
  const [usersList, setUsersList] = useState([
    { id: 'USR-101', name: 'Ananya Roy', email: 'ananya@example.com', role: 'Customer', joined: '2024-01-15', status: 'Active' },
    { id: 'USR-102', name: 'Rajesh Kumar', email: 'rajesh.tech@example.com', role: 'Technician', joined: '2023-11-20', status: 'Active' },
    { id: 'USR-103', name: 'Vikram Singh', email: 'vikram.dispatch@example.com', role: 'Dispatcher', joined: '2024-02-10', status: 'Active' },
    { id: 'USR-104', name: 'Soniya K', email: 'soniya.admin@example.com', role: 'Admin', joined: '2023-09-01', status: 'Active' },
    { id: 'USR-105', name: 'Priya Sharma', email: 'priya.s@example.com', role: 'Technician', joined: '2024-03-05', status: 'Active' },
    { id: 'USR-106', name: 'Amit Patel', email: 'amit@example.com', role: 'Customer', joined: '2024-04-12', status: 'Suspended' },
  ]);

  const [techList, setTechList] = useState([
    { id: 'TECH-01', name: 'Rajesh Kumar', specialty: 'Plumbing Repair', exp: '6 Yrs', rating: 4.9, jobsDone: 142, status: 'Verified' },
    { id: 'TECH-02', name: 'Priya Sharma', specialty: 'Electrical Works', exp: '4 Yrs', rating: 4.8, jobsDone: 128, status: 'Verified' },
    { id: 'TECH-03', name: 'Vikram Malhotra', specialty: 'AC Servicing', exp: '5 Yrs', rating: 4.7, jobsDone: 115, status: 'Pending Verification' },
    { id: 'TECH-04', name: 'Aarav Mehta', specialty: 'Carpentry', exp: '3 Yrs', rating: 4.6, jobsDone: 108, status: 'Verified' },
    { id: 'TECH-05', name: 'Suresh Raina', specialty: 'Home Painting', exp: '7 Yrs', rating: 4.5, jobsDone: 94, status: 'Pending Verification' },
  ]);

  const [servicesList, setServicesList] = useState([
    { id: 'SVC-1', title: 'Plumbing Repair', category: 'Plumbing', price: 399, badge: 'Popular', active: true },
    { id: 'SVC-2', title: 'Electrical Works', category: 'Electrical', price: 499, badge: 'Verified', active: true },
    { id: 'SVC-3', title: 'AC Servicing & Repair', category: 'HVAC', price: 699, badge: 'Seasonal', active: true },
    { id: 'SVC-4', title: 'Carpentry & Furniture', category: 'Woodwork', price: 599, badge: 'Expert', active: true },
    { id: 'SVC-5', title: 'Home Painting', category: 'Painting', price: 1499, badge: 'Full Service', active: true },
    { id: 'SVC-6', title: 'Deep Sanitation', category: 'Sanitation', price: 899, badge: 'Hygiene', active: true },
    { id: 'SVC-7', title: 'Appliance Repair', category: 'Appliances', price: 499, badge: 'Fast Fix', active: true },
    { id: 'SVC-8', title: 'Pest Inspection', category: 'Pest Control', price: 599, badge: 'Safe', active: true },
  ]);

  const [bookingsList, setBookingsList] = useState([
    { id: '#HS-2024-8761', customer: 'John Doe', service: 'Plumbing Repair', tech: 'James Smith', status: 'In Progress', statusColor: 'bg-blue-100 text-blue-700', time: 'May 25, 2024 · 10:00 AM', amount: '₹1,499' },
    { id: '#HS-2024-8760', customer: 'Sarah Wilson', service: 'AC Installation', tech: 'Maria Johnson', status: 'Assigned', statusColor: 'bg-amber-100 text-amber-700', time: 'May 25, 2024 · 11:30 AM', amount: '₹3,500' },
    { id: '#HS-2024-8759', customer: 'Mike Brown', service: 'Electrical Wiring', tech: 'Robert Davis', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700', time: 'May 25, 2024 · 09:00 AM', amount: '₹1,800' },
    { id: '#HS-2024-8758', customer: 'Lisa Anderson', service: 'Deep Cleaning', tech: 'David Wilson', status: 'Scheduled', statusColor: 'bg-purple-100 text-purple-700', time: 'May 26, 2024 · 02:00 PM', amount: '₹1,999' },
    { id: '#HS-2024-8757', customer: 'David Lee', service: 'Water Heater Fix', tech: 'James Smith', status: 'Pending', statusColor: 'bg-rose-100 text-rose-700', time: 'May 26, 2024 · 04:30 PM', amount: '₹1,299' }
  ]);

  // Handlers
  const toggleUserStatus = (id) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
    showToastMsg('User status updated');
  };

  const approveTechnician = (id) => {
    setTechList(prev => prev.map(t => t.id === id ? { ...t, status: 'Verified' } : t));
    showToastMsg('Technician verified successfully!');
  };

  const toggleServiceActive = (id) => {
    setServicesList(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    showToastMsg('Service status updated');
  };

  const handleAddService = (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    const newSvc = {
      id: `SVC-${servicesList.length + 1}`,
      title: newServiceName,
      category: newServiceCategory,
      price: parseInt(newServicePrice),
      badge: 'New',
      active: true
    };
    setServicesList([newSvc, ...servicesList]);
    setNewServiceName('');
    setNewServicePrice('');
    setShowAddServiceModal(false);
    showToastMsg('New Service added to catalog!');
  };

  // Line Chart Data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const actualValues = [240, 240, 390, 350, 490, 750, 750, 860, 1020, 1080, 1180, 1220];
  const targetValues = [150, 200, 270, 310, 460, 580, 640, 740, 860, 920, 1000, 1060];

  const getSvgPoints = (data) => {
    return data.map((val, i) => {
      const x = 40 + i * 55;
      const y = 220 - (val / 1300) * 180;
      return `${x},${y}`;
    }).join(' ');
  };

  const actualSvgPoints = getSvgPoints(actualValues);
  const targetSvgPoints = getSvgPoints(targetValues);

  return (
    <ProtectedRoute allowedRole="admin">
    <div className="min-h-screen bg-[#EEF4ED]/50 text-slate-800 font-sans flex antialiased">
      
      {/* Sidebar - Streamlined to 5 essential tabs */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between p-6 z-20 flex-shrink-0 shadow-sm">
        <div className="space-y-8">
          
          {/* FixMate Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B2545] flex items-center justify-center text-white shadow-md">
              <Wrench className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-[#0B2545] tracking-tight flex items-center gap-1">
                FixMate <span className="text-xs bg-[#134074] text-white px-2 py-0.5 rounded-full">Admin</span>
              </h1>
              <p className="text-[11px] font-semibold text-slate-400">Enterprise Control</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {[
              { label: 'Dashboard', icon: LayoutDashboard },
              { label: 'Users', icon: Users },
              { label: 'Technicians', icon: UserCheck },
              { label: 'Services', icon: Wrench },
              { label: 'Bookings', icon: Calendar },
              { label: 'Settings', icon: Settings },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeNav === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveNav(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                    isActive 
                      ? 'bg-[#0B2545] text-white shadow-md' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B2545]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Admin Profile */}
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs shadow-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-extrabold text-[#0B2545] truncate">System Admin</h5>
              <p className="text-[10px] text-slate-400 font-semibold truncate">admin@fixmate.com</p>
            </div>
          </div>

          <Link 
            href="/"
            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2.5 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Sticky Header Bar */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 sticky top-0 z-10 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-[#0B2545] tracking-tight">{activeNav}</h2>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
              FixMate Module
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative w-64 hidden sm:block">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full bg-slate-100 border border-slate-200/80 rounded-full pl-9 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0B2545]/20 transition-all" 
              />
            </div>

            <button 
              onClick={() => showToastMsg('System notifications up to date')}
              className="relative text-slate-500 hover:text-[#0B2545] transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Views Based on Active Tab */}
        <div className="p-8 space-y-7">
          
          {/* TAB 1: DASHBOARD VIEW */}
          {activeNav === 'Dashboard' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Total Platform Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">₹1,28,45,000</div>
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>↑ 12.5% vs last month</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Active Verified Techs</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">1,482</div>
                  <div className="text-xs font-semibold text-slate-500">86.4% Currently Online</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/30 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-500">Pending Emergency Jobs</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-rose-600 tracking-tight">14</div>
                  <div className="text-xs font-bold text-rose-600">High Priority Action Required</div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Customer Rating</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">4.82/5</div>
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>↑ 98% Positive Feedback</span>
                  </div>
                </div>
              </div>

              {/* Chart & Live Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-[#0B2545]">Jobs Completed vs Target</h3>
                      <p className="text-xs text-slate-400 font-medium">Annual performance metrics across all regions</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-slate-700">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#134074]"></span> Actual
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
                      </select>
                    </div>
                  </div>

                  <div className="relative pt-4 pb-2">
                    <svg className="w-full h-56 overflow-visible" viewBox="0 0 680 230">
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

                      <polyline fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 4" points={targetSvgPoints} />
                      <polyline fill="none" stroke="#134074" strokeWidth="2.5" points={actualSvgPoints} />

                      {actualValues.map((val, i) => {
                        const x = 40 + i * 55;
                        const y = 220 - (val / 1300) * 180;
                        return (
                          <circle 
                            key={`a-${i}`} 
                            cx={x} 
                            cy={y} 
                            r="4" 
                            onMouseEnter={() => setHoveredPoint({ month: months[i], actual: val, target: targetValues[i] })}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="fill-[#0B2545] stroke-white stroke-2 cursor-pointer hover:r-6 transition-all" 
                          />
                        );
                      })}
                    </svg>

                    <div className="flex justify-between pl-9 text-xs font-semibold text-slate-400 pt-2">
                      {months.map((m) => <span key={m}>{m}</span>)}
                    </div>

                    {hoveredPoint && (
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-[#0B2545] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-4 z-20">
                        <span>{hoveredPoint.month}</span>
                        <span className="text-emerald-400">Actual: {hoveredPoint.actual}</span>
                        <span className="text-slate-300">Target: {hoveredPoint.target}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Technicians List */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-[#0B2545]">Top Technicians</h3>
                    <button onClick={() => setActiveNav('Technicians')} className="text-xs font-bold text-[#134074] hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {techList.slice(0, 4).map((tech, idx) => (
                      <div key={tech.id} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-400 w-4">{idx + 1}</span>
                          <div className="w-8 h-8 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs">
                            {tech.name.charAt(0)}
                          </div>
                          <div>
                            <h5 className="text-xs font-extrabold text-[#0B2545]">{tech.name}</h5>
                            <p className="text-[10px] text-slate-400 font-semibold">{tech.specialty}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-extrabold text-emerald-600 block">★ {tech.rating}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{tech.jobsDone} jobs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT PAGE */}
          {activeNav === 'Users' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      placeholder="Search user by name or email..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]/20"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select 
                      value={userRoleFilter} 
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Roles</option>
                      <option value="Customer">Customer</option>
                      <option value="Technician">Technician</option>
                      <option value="Dispatcher">Dispatcher</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setShowAddUserModal(true)}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add New User</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                        <th className="pb-3">User ID</th>
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Joined Date</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {usersList
                        .filter(u => userRoleFilter === 'All' || u.role === userRoleFilter)
                        .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 font-mono font-bold text-slate-500">{user.id}</td>
                            <td className="py-4 font-extrabold text-[#0B2545]">{user.name}</td>
                            <td className="py-4 text-slate-600">{user.email}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'Technician' ? 'bg-blue-100 text-blue-700' :
                                user.role === 'Dispatcher' ? 'bg-amber-100 text-amber-700' :
                                'bg-emerald-100 text-emerald-700'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 text-slate-500">{user.joined}</td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button 
                                onClick={() => toggleUserStatus(user.id)}
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                  user.status === 'Active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                }`}
                              >
                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: TECHNICIANS MANAGEMENT PAGE */}
          {activeNav === 'Technicians' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Filter Row */}
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <h3 className="text-sm font-extrabold text-[#0B2545]">Technician Verification & Performance</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                  <select 
                    value={techFilter} 
                    onChange={(e) => setTechFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700"
                  >
                    <option value="All">All Technicians</option>
                    <option value="Verified">Verified Only</option>
                    <option value="Pending Verification">Pending Verification</option>
                  </select>
                </div>
              </div>

              {/* Technician Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {techList
                  .filter(t => techFilter === 'All' || t.status === techFilter)
                  .map((tech) => (
                    <div key={tech.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-[#0B2545] text-white flex items-center justify-center font-black text-sm shadow-sm">
                            {tech.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-[#0B2545]">{tech.name}</h4>
                            <p className="text-xs font-semibold text-emerald-600">{tech.specialty}</p>
                          </div>
                        </div>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          tech.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {tech.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center">
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Experience</span>
                          <span className="text-xs font-extrabold text-[#0B2545]">{tech.exp}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Rating</span>
                          <span className="text-xs font-extrabold text-emerald-600">★ {tech.rating}</span>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-xl">
                          <span className="text-[10px] text-slate-400 font-bold block">Jobs Done</span>
                          <span className="text-xs font-extrabold text-[#0B2545]">{tech.jobsDone}</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        {tech.status === 'Pending Verification' ? (
                          <button 
                            onClick={() => approveTechnician(tech.id)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Verify & Approve Technician</span>
                          </button>
                        ) : (
                          <button 
                            onClick={() => showToastMsg(`Viewing full profile of ${tech.name}`)}
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 rounded-xl transition-colors"
                          >
                            View Activity Log
                          </button>
                        )}
                      </div>
                    </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: SERVICES MANAGEMENT PAGE */}
          {activeNav === 'Services' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Action */}
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2545]">FixMate Core Services Catalog</h3>
                  <p className="text-xs text-slate-400">Manage service pricing, availability, and active status</p>
                </div>

                <button 
                  onClick={() => setShowAddServiceModal(true)}
                  className="bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Service</span>
                </button>
              </div>

              {/* Service Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {servicesList.map((svc) => (
                  <div key={svc.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{svc.category}</span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
                          {svc.badge}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-[#0B2545]">{svc.title}</h4>
                    </div>

                    <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">Starting From</span>
                        <span className="text-xl font-black text-[#0B2545]">₹{svc.price}</span>
                      </div>

                      <button 
                        onClick={() => toggleServiceActive(svc.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          svc.active ? 'bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {svc.active ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 5: BOOKINGS PAGE */}
          {activeNav === 'Bookings' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search by customer or service..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <select 
                    value={bookingFilter}
                    onChange={(e) => setBookingFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700"
                  >
                    <option value="All">All Bookings</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-extrabold text-slate-400 uppercase border-b border-slate-100">
                        <th className="pb-3">Booking ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Assigned Tech</th>
                        <th className="pb-3">Scheduled Time</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Amount</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                      {bookingsList
                        .filter(b => bookingFilter === 'All' || b.status === bookingFilter)
                        .filter(b => b.customer.toLowerCase().includes(bookingSearch.toLowerCase()) || b.service.toLowerCase().includes(bookingSearch.toLowerCase()))
                        .map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 font-mono font-extrabold text-[#134074]">{row.id}</td>
                            <td className="py-4 font-bold text-[#0B2545]">{row.customer}</td>
                            <td className="py-4 text-slate-600">{row.service}</td>
                            <td className="py-4 text-slate-600">{row.tech}</td>
                            <td className="py-4 text-slate-500">{row.time}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${row.statusColor}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-4 font-extrabold text-[#0B2545]">{row.amount}</td>
                            <td className="py-4 text-right">
                              <button 
                                onClick={() => showToastMsg(`Managing booking ${row.id}`)}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: SETTINGS PAGE */}
          {activeNav === 'Settings' && (
            <div className="max-w-2xl bg-white rounded-2xl p-7 border border-slate-200/80 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-extrabold text-[#0B2545]">FixMate Platform Settings</h3>
                <p className="text-xs text-slate-400">Configure core platform parameters and notifications</p>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h5 className="text-xs font-extrabold text-[#0B2545]">Emergency Surcharge Fee</h5>
                    <p className="text-[11px] text-slate-400">Additional fee for 24/7 priority emergency dispatch</p>
                  </div>
                  <span className="text-xs font-black text-[#0B2545] bg-slate-100 px-3 py-1.5 rounded-lg">₹250</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h5 className="text-xs font-extrabold text-[#0B2545]">Platform Commission</h5>
                    <p className="text-[11px] text-slate-400">Percentage charged per completed job</p>
                  </div>
                  <span className="text-xs font-black text-[#0B2545] bg-slate-100 px-3 py-1.5 rounded-lg">15%</span>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div>
                    <h5 className="text-xs font-extrabold text-[#0B2545]">Auto-Approve Verified Techs</h5>
                    <p className="text-[11px] text-slate-400">Automatically enable booking access once background checks clear</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#0B2545]" />
                </div>
              </div>

              <button 
                onClick={() => showToastMsg('Platform settings saved successfully!')}
                className="w-full bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-sm"
              >
                Save Settings
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-semibold gap-4 mt-auto">
          <p>© 2026 FixMate Enterprise. All Rights Reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => showToastMsg('System Status: 100% Operational')} className="hover:text-slate-600">System Health</button>
            <button onClick={() => showToastMsg('Admin Help Center')} className="hover:text-slate-600">Support</button>
          </div>
        </footer>

      </main>

      {/* Add New Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-[#0B2545]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#0B2545]">Add New Core Service</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>

            <form onSubmit={handleAddService} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Smart Lock Installation"
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-[#0B2545]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select 
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="Electrical">Electrical</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Woodwork">Woodwork</option>
                  <option value="Painting">Painting</option>
                  <option value="Sanitation">Sanitation</option>
                  <option value="Appliances">Appliances</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Base Price (₹)</label>
                <input 
                  type="number" 
                  required
                  placeholder="499"
                  value={newServicePrice}
                  onChange={(e) => setNewServicePrice(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium focus:outline-none focus:border-[#0B2545]"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                >
                  Create Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-[#0B2545]/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#0B2545]">Add New System User</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setShowAddUserModal(false);
              showToastMsg('User account created!');
            }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input type="text" required placeholder="John Doe" className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input type="email" required placeholder="john@example.com" className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold">
                  <option value="Customer">Customer</option>
                  <option value="Technician">Technician</option>
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowAddUserModal(false)} className="flex-1 bg-slate-100 text-slate-700 text-xs font-bold py-2.5 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 bg-[#0B2545] text-white text-xs font-bold py-2.5 rounded-xl">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B2545] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

    </div>
    </ProtectedRoute>
  );
}
