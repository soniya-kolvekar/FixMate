'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  Map, 
  Scroll, 
  Settings, 
  LifeBuoy, 
  Plus, 
  Search, 
  Bell, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  Compass, 
  Zap, 
  Home, 
  Clock, 
  Star, 
  ExternalLink,
  ChevronDown,
  User,
  LogOut,
  Info,
  RefreshCw,
  Server,
  Activity,
  Flame
} from 'lucide-react';

export default function DispatcherDashboard() {
  const router = useRouter();
  
  // Dashboard Status State
  const [dispatcherStatus, setDispatcherStatus] = useState('Online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, requests, technicians, map, logs
  
  // Toast notifications state
  const [toast, setToast] = useState(null);
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Metrics States
  const [activeJobsCount, setActiveJobsCount] = useState(42);
  const [totalRequestsCount, setTotalRequestsCount] = useState(1284);
  const [pendingEmergenciesCount, setPendingEmergenciesCount] = useState(3);
  
  // Unassigned urgent broadcasts
  const [dispatches, setDispatches] = useState([
    { 
      id: 'DISP-4820', 
      title: 'Main Pipe Burst', 
      time: '4 mins ago', 
      address: '1204 Oak Ridge Dr', 
      priority: 'Priority Level 10', 
      category: 'PLUMBING', 
      type: 'RESIDENTIAL', 
      icon: '🏠', 
      colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300', 
      iconBg: 'bg-rose-100 text-rose-600' 
    },
    { 
      id: 'DISP-4821', 
      title: 'Full Power Loss', 
      time: '12 mins ago', 
      address: '88 Skyway Ave, Suite 402', 
      priority: 'Priority Level 8', 
      category: 'ELECTRICAL', 
      type: 'URGENT', 
      icon: '⚡', 
      colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300', 
      iconBg: 'bg-blue-100 text-blue-600' 
    }
  ]);

  // Technicians List
  const [technicians, setTechnicians] = useState([
    { name: 'Dave R.', assigned: 4, travel: 2, status: 'Online', specialty: 'Plumbing', zone: 'North Metro' },
    { name: 'Sarah J.', assigned: 3, travel: 4, status: 'Online', specialty: 'Electrical', zone: 'Downtown Sector' },
    { name: 'Mike T.', assigned: 5, travel: 1, status: 'Online', specialty: 'HVAC', zone: 'Downtown Sector' },
    { name: 'Elena K.', assigned: 2, travel: 3, status: 'Online', specialty: 'Carpentry', zone: 'South Suburbs' },
    { name: 'James L.', assigned: 1, travel: 1, status: 'Offline', specialty: 'Appliance Repair', zone: 'West District' }
  ]);

  // Live Activity Stream
  const [activities, setActivities] = useState([
    { 
      id: 1, 
      text: 'Job #4829 completed by Mike T.', 
      time: '2 mins ago', 
      meta: 'HVAC Maintenance', 
      rating: '5.0', 
      type: 'success', 
      dotColor: 'bg-emerald-500' 
    },
    { 
      id: 2, 
      text: 'Sarah J. arrived at location', 
      time: '15 mins ago', 
      meta: 'Kitchen Leak Fix', 
      type: 'info', 
      dotColor: 'bg-blue-500' 
    },
    { 
      id: 3, 
      text: 'New Emergency reported by IoT Sensor', 
      time: '32 mins ago', 
      meta: 'Basement Flooding', 
      type: 'danger', 
      dotColor: 'bg-rose-500' 
    },
    { 
      id: 4, 
      text: 'Technician Offline: James L.', 
      time: '1 hour ago', 
      meta: 'End of Shift', 
      type: 'neutral', 
      dotColor: 'bg-slate-400' 
    },
    { 
      id: 5, 
      text: 'Payment Processed for Invoice #3391', 
      time: '2 hours ago', 
      meta: '$450.00 USD', 
      type: 'payment', 
      dotColor: 'bg-amber-500' 
    }
  ]);

  // All logs database (persists additions)
  const [logs, setLogs] = useState([
    { timestamp: '14:05', event: 'Main Pipe Burst broadcast created', user: 'System' },
    { timestamp: '13:58', event: 'Job #4829 completed successfully', user: 'Mike T.' },
    { timestamp: '13:50', event: 'Full Power Loss broadcast created', user: 'System' },
    { timestamp: '13:45', event: 'Sarah J. dispatched to Kitchen Leak Fix', user: 'Alex Dispatch' },
    { timestamp: '13:00', event: 'Technician James L. set status to Offline', user: 'James L.' }
  ]);

  // Modals States
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [newRequestData, setNewRequestData] = useState({
    title: '',
    address: '',
    category: 'PLUMBING',
    type: 'RESIDENTIAL',
    isEmergency: false
  });
  
  const [assigningDispatch, setAssigningDispatch] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Search Filter
  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities;
    return activities.filter(act => 
      act.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      act.meta.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activities, searchQuery]);

  const filteredTechnicians = useMemo(() => {
    if (!searchQuery) return technicians;
    return technicians.filter(tech => 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.zone.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [technicians, searchQuery]);

  // Navigation Logic
  const handleSignOut = () => {
    showToast('Signed out of dispatcher terminal.');
    setTimeout(() => router.push('/'), 1000);
  };

  // Assigning Technician Action
  const handleOpenAssign = (dispatch) => {
    setAssigningDispatch(dispatch);
  };

  const handleConfirmAssignment = (techName) => {
    if (!assigningDispatch) return;

    // Remove from unassigned dispatches
    setDispatches(prev => prev.filter(d => d.id !== assigningDispatch.id));
    
    // Increment active jobs & decrement pending emergency
    setActiveJobsCount(prev => prev + 1);
    if (assigningDispatch.priority.includes('10') || assigningDispatch.type === 'URGENT') {
      setPendingEmergenciesCount(prev => Math.max(0, prev - 1));
    }

    // Add activity
    const newActivity = {
      id: Date.now(),
      text: `${assigningDispatch.title} assigned to ${techName}`,
      time: 'Just now',
      meta: `${assigningDispatch.category} • Assigned by Alex Dispatch`,
      type: 'info',
      dotColor: 'bg-blue-600'
    };
    setActivities(prev => [newActivity, ...prev]);

    // Add log
    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `${assigningDispatch.title} assigned to ${techName}`, user: 'Alex Dispatch' },
      ...prev
    ]);

    // Increment assigned count for technician
    setTechnicians(prev => prev.map(t => {
      if (t.name === techName) {
        return { ...t, assigned: t.assigned + 1 };
      }
      return t;
    }));

    showToast(`✅ Successfully assigned ${techName} to ${assigningDispatch.title}!`);
    setAssigningDispatch(null);
  };

  // Creating New Service Request
  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newRequestData.title || !newRequestData.address) return;

    const newId = `DISP-${Math.floor(4800 + Math.random() * 200)}`;
    const isEmerg = newRequestData.isEmergency;

    const newDispatchItem = {
      id: newId,
      title: newRequestData.title,
      time: 'Just now',
      address: newRequestData.address,
      priority: isEmerg ? 'Priority Level 10' : 'Priority Level 5',
      category: newRequestData.category,
      type: newRequestData.type,
      icon: newRequestData.category === 'ELECTRICAL' ? '⚡' : '🏠',
      colorClass: isEmerg ? 'bg-rose-50 border-rose-100 hover:border-rose-300' : 'bg-slate-50 border-slate-100 hover:border-slate-300',
      iconBg: isEmerg ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
    };

    if (isEmerg) {
      setDispatches(prev => [newDispatchItem, ...prev]);
      setPendingEmergenciesCount(prev => prev + 1);
    } else {
      // Standard dispatch addition
      showToast(`Created Standard Request for ${newRequestData.title}. Logged in Requests tab.`);
    }

    setTotalRequestsCount(prev => prev + 1);
    
    // Add activity
    setActivities(prev => [
      { 
        id: Date.now(), 
        text: `New dispatch requested: ${newRequestData.title}`, 
        time: 'Just now', 
        meta: `${newRequestData.address}`, 
        type: isEmerg ? 'danger' : 'info',
        dotColor: isEmerg ? 'bg-rose-500' : 'bg-blue-500' 
      },
      ...prev
    ]);

    // Add log
    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `New dispatch created: ${newRequestData.title}`, user: 'Alex Dispatch' },
      ...prev
    ]);

    showToast(`🔥 New request created successfully!`);
    setIsNewRequestOpen(false);
    setNewRequestData({
      title: '',
      address: '',
      category: 'PLUMBING',
      type: 'RESIDENTIAL',
      isEmergency: false
    });
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0A2540] to-blue-600 flex items-center justify-center text-white text-sm shadow-md animate-pulse-slow">
                🛠️
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-[#0A2540] tracking-tight leading-none">FixMate Pro</h1>
                <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-1 block">Regional Dispatch</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'dashboard' 
                  ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard size={18} className={activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'requests' 
                  ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <ClipboardList size={18} className={activeTab === 'requests' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Requests</span>
            </button>

            <button 
              onClick={() => setActiveTab('technicians')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'technicians' 
                  ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Users size={18} className={activeTab === 'technicians' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Technicians</span>
            </button>

            <button 
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'map' 
                  ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Map size={18} className={activeTab === 'map' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Live Map</span>
            </button>

            <button 
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'logs' 
                  ? 'bg-[#EFF6FF] text-blue-600 shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Scroll size={18} className={activeTab === 'logs' ? 'text-blue-600' : 'text-slate-400'} />
              <span>Logs</span>
            </button>
          </nav>

          {/* Action Button */}
          <div className="p-4 pt-2">
            <button 
              onClick={() => setIsNewRequestOpen(true)}
              className="w-full bg-[#0A2540] hover:bg-[#13395F] text-white text-sm font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={16} />
              <span>New Request</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer Profile */}
        <div className="p-4 border-t border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                AD
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 leading-tight">Alex Dispatch</p>
                <p className="text-[10px] font-semibold text-slate-400 leading-tight">Lead Operative</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                onClick={() => showToast('⚙️ Settings panel opening (Mock)')}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-50 text-[11px] font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              >
                <Settings size={12} />
                <span>Settings</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-[11px] font-bold text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP BAR / HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          
          {/* Search Box */}
          <div className="w-96 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search technicians, job IDs, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 font-bold text-xs"
              >
                &times;
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            {/* Quick icons */}
            <button 
              onClick={() => showToast('🔔 No new unread alerts')}
              className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            <button 
              onClick={() => showToast('💬 Opening live dispatch chat room')}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
            >
              <MessageSquare size={18} />
            </button>

            <span className="w-px h-6 bg-slate-200"></span>

            {/* Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 border border-slate-200 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${
                  dispatcherStatus === 'Online' ? 'bg-emerald-500' : dispatcherStatus === 'Busy' ? 'bg-amber-500' : 'bg-rose-500'
                }`}></span>
                <span>Status: {dispatcherStatus}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {['Online', 'Busy', 'Offline'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setDispatcherStatus(st);
                        setShowStatusDropdown(false);
                        showToast(`Status updated to: ${st}`);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        st === 'Online' ? 'bg-emerald-500' : st === 'Busy' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      <span>{st}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          
          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* TOP STAT CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* Stat 1 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Requests</span>
                    <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">{totalRequestsCount.toLocaleString()}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                      +12%
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <ClipboardList size={18} />
                    </div>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Jobs</span>
                    <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">{activeJobsCount}</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-50 text-slate-650 flex items-center gap-0.5">
                      Steady
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <RefreshCw size={16} className="animate-spin-slow" />
                    </div>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Technicians Online</span>
                    <h3 className="text-3xl font-extrabold text-[#0A2540] mt-1">18</h3>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-600 flex items-center gap-0.5">
                      85% Capacity
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <Server size={18} />
                    </div>
                  </div>
                </div>

                {/* Stat 4 - EMERGENCY RED CARD */}
                <div className="bg-white border-2 border-red-500 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                      <Flame size={12} className="animate-bounce" />
                      Pending Emergency
                    </span>
                    <h3 className="text-3xl font-black text-red-650 mt-1">
                      {pendingEmergenciesCount < 10 ? `0${pendingEmergenciesCount}` : pendingEmergenciesCount}
                    </h3>
                  </div>
                  <div className="flex flex-col items-end gap-2.5">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-red-550 text-red-600 border border-red-100">
                      High Priority
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
                      <AlertCircle size={18} />
                    </div>
                  </div>
                </div>

              </div>

              {/* TWO COLUMN GRID MAIN SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT & MIDDLE (Col Span 2) */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Urgent Broadcasts Box */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-extrabold text-[#0A2540]">Urgent Broadcasts</h4>
                        <p className="text-xs text-slate-400 font-medium">Unassigned emergency service calls</p>
                      </div>
                      <button 
                        onClick={() => showToast('View all unassigned jobs')}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        View All
                      </button>
                    </div>

                    <div className="p-6 space-y-4">
                      {dispatches.length === 0 ? (
                        <div className="text-center py-8 text-sm font-semibold text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                          🎉 All urgent broadcasts assigned!
                        </div>
                      ) : (
                        dispatches.map((disp) => (
                          <div 
                            key={disp.id} 
                            className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${disp.colorClass}`}
                          >
                            <div className="flex items-start gap-4">
                              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg shadow-inner ${disp.iconBg}`}>
                                {disp.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-slate-800 text-sm">{disp.title}</h5>
                                  <span className="text-[10px] font-bold text-slate-400 bg-white/70 px-2 py-0.5 rounded-md border border-slate-100">
                                    {disp.time}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                  {disp.address} • <span className="font-bold text-[#0A2540]">{disp.priority}</span>
                                </p>
                                <div className="flex items-center gap-1.5 mt-2">
                                  <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-150 text-slate-650">
                                    {disp.category}
                                  </span>
                                  <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded bg-white/80 border border-slate-150 text-slate-650">
                                    {disp.type}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleOpenAssign(disp)}
                              className="self-start md:self-center px-5 py-2.5 bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-bold rounded-lg shadow-sm transition-all whitespace-nowrap"
                            >
                              Assign Now
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Technician Workload Box */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-base font-extrabold text-[#0A2540]">Technician Workload</h4>
                        <p className="text-xs text-slate-400 font-medium">Real-time task distribution across fleet</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-bold">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded bg-blue-600"></span>
                          <span>Assigned</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <span className="w-2.5 h-2.5 rounded bg-[#93C5FD]"></span>
                          <span>Travel</span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Chart Visual */}
                    <div className="flex items-end justify-between h-52 pt-8 px-6 border-b border-slate-100">
                      {technicians.map((tech) => {
                        const total = tech.assigned + tech.travel;
                        const maxVal = 10;
                        const assignedHeight = `${(tech.assigned / maxVal) * 100}%`;
                        const travelHeight = `${(tech.travel / maxVal) * 100}%`;
                        const isOff = tech.status === 'Offline';
                        
                        return (
                          <div key={tech.name} className="flex flex-col items-center gap-2 group w-16 relative">
                            {/* Visual columns stack */}
                            <div className="relative w-8 h-36 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden flex flex-col justify-end">
                              {isOff ? (
                                <div className="absolute inset-0 bg-slate-200/40 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest rotate-90">OFF</span>
                                </div>
                              ) : (
                                <>
                                  {/* Travel Portion */}
                                  <div 
                                    style={{ height: travelHeight }}
                                    className="w-full bg-[#93C5FD] hover:bg-[#60A5FA] transition-all duration-300 cursor-pointer"
                                    title={`Travel: ${tech.travel}`}
                                  />
                                  {/* Assigned Portion */}
                                  <div 
                                    style={{ height: assignedHeight }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 cursor-pointer"
                                    title={`Assigned: ${tech.assigned}`}
                                  />
                                </>
                              )}

                              {/* Interactive tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 hidden group-hover:block bg-[#0A2540] text-white text-[10px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-30">
                                <p className="font-extrabold text-white border-b border-white/10 pb-1 mb-1">{tech.name} ({tech.specialty})</p>
                                <p className="text-slate-300 font-semibold">📍 Zone: {tech.zone}</p>
                                <p className="text-blue-300 font-semibold">⚡ Assigned Jobs: {tech.assigned}</p>
                                <p className="text-[#93C5FD] font-semibold">🚙 Transit Runs: {tech.travel}</p>
                                <p className={`mt-1 font-bold ${tech.status === 'Online' ? 'text-emerald-400' : 'text-slate-400'}`}>● {tech.status}</p>
                              </div>
                            </div>

                            <span className="text-xs font-bold text-slate-700">{tech.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* RIGHT COLUMN (Col Span 1) */}
                <div className="space-y-8">
                  
                  {/* Live Activity Box */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-extrabold text-[#0A2540]">Live Activity</h4>
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <Activity size={16} className="text-slate-400" />
                      </div>

                      {/* Activity List */}
                      <div className="space-y-4 max-h-[310px] overflow-y-auto pr-1">
                        {filteredActivities.length === 0 ? (
                          <div className="text-center py-10 text-xs font-bold text-slate-400">
                            No activities matching criteria.
                          </div>
                        ) : (
                          filteredActivities.map((act) => (
                            <div key={act.id} className="flex gap-3 text-xs">
                              {/* Left dot & line */}
                              <div className="flex flex-col items-center">
                                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${act.dotColor}`}></span>
                                <span className="w-0.5 flex-1 bg-slate-100 mt-1"></span>
                              </div>
                              {/* Content */}
                              <div className="flex-1 pb-4 border-b border-slate-50 last:border-b-0 leading-tight">
                                <div className="flex justify-between items-start gap-2">
                                  <p className="font-bold text-slate-800">{act.text}</p>
                                  <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{act.time}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                                  <span>{act.meta}</span>
                                  {act.rating && (
                                    <span className="flex items-center gap-0.5 bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-100 font-black">
                                      ★ {act.rating}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* MINI MAP CARD */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-4 overflow-hidden group">
                    <div className="relative h-44 rounded-xl overflow-hidden bg-slate-105 border border-slate-200 shadow-inner flex items-center justify-center">
                      
                      {/* Grid representation of mock map */}
                      <div className="absolute inset-0 bg-cover opacity-90 transition-transform duration-500 group-hover:scale-105" 
                           style={{ backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/-87.6298,41.8781,11,0/400x250?access_token=mock')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                        {/* Backup styled elements if background API key doesn't render */}
                        <div className="w-full h-full bg-sky-50 relative flex items-center justify-center">
                          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="1"/>
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                            
                            {/* Paths representing dispatch transit */}
                            <path d="M50 40 Q 150 20 220 80" fill="none" stroke="#60A5FA" strokeWidth="3" strokeDasharray="5,5" />
                            <path d="M120 130 Q 180 80 220 80" fill="none" stroke="#3B82F6" strokeWidth="4" />
                            
                            {/* Tech pin markers */}
                            <circle cx="50" cy="40" r="7" fill="#10B981" stroke="white" strokeWidth="2" />
                            <circle cx="120" cy="130" r="7" fill="#3B82F6" stroke="white" strokeWidth="2" />
                            
                            {/* Incident Red Pin */}
                            <circle cx="220" cy="80" r="8" fill="#EF4444" stroke="white" strokeWidth="2" />
                            <circle cx="220" cy="80" r="16" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: '220px 80px' }} />
                          </svg>
                        </div>
                      </div>

                      {/* Expand Button overlay */}
                      <div className="absolute inset-0 bg-[#0A2540]/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                        <button
                          onClick={() => setIsMapExpanded(true)}
                          className="px-4 py-2 bg-white text-[#0A2540] text-xs font-bold rounded-lg shadow-xl flex items-center gap-1.5 transition-transform duration-200 hover:scale-105"
                        >
                          <ExternalLink size={12} />
                          <span>Expand Fleet Map</span>
                        </button>
                      </div>

                      {/* Small inline indicators */}
                      <div className="absolute bottom-2.5 left-2.5 bg-[#0A2540] text-white text-[9px] font-bold px-2 py-1 rounded shadow-md pointer-events-none">
                        Chicago Fleet Grid
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: REQUESTS VIEW */}
          {activeTab === 'requests' && (
            <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2540]">Dispatch & Job Requests</h3>
                  <p className="text-xs text-slate-400 font-semibold">Overview of all registered active and pending tickets</p>
                </div>
                <button
                  onClick={() => setIsNewRequestOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus size={14} />
                  <span>Create Request</span>
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-600">
                  <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Ticket ID</th>
                      <th className="py-3.5 px-4">Issue Description</th>
                      <th className="py-3.5 px-4">Site Location</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Level</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {/* Unassigned dispatches */}
                    {dispatches.map((disp) => (
                      <tr key={disp.id} className="hover:bg-slate-50/50 bg-rose-50/20">
                        <td className="py-3 px-4 font-bold text-red-650">{disp.id}</td>
                        <td className="py-3 px-4 font-bold">{disp.title}</td>
                        <td className="py-3 px-4 text-slate-500">{disp.address}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-150 border border-slate-200 rounded text-[9px] font-black text-slate-600">
                            {disp.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-extrabold text-red-500">Emergency</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-[9px] font-extrabold">
                            Unassigned
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => handleOpenAssign(disp)}
                            className="bg-[#0A2540] text-white hover:bg-[#13395F] text-[10px] font-bold px-3 py-1.5 rounded transition-all"
                          >
                            Assign Tech
                          </button>
                        </td>
                      </tr>
                    ))}
                    {/* Mock assigned active list */}
                    {[
                      { id: 'JOB-4811', title: 'Sink Overflow Repair', address: '742 Evergreen Terr.', cat: 'PLUMBING', level: 'Normal', status: 'En Route', tech: 'Dave R.' },
                      { id: 'JOB-4812', title: 'Water Heater Check', address: '104 Maple Ave.', cat: 'PLUMBING', level: 'Normal', status: 'Assigned', tech: 'Elena K.' },
                      { id: 'JOB-4813', title: 'Breaker Tripping Fix', address: '302 Pine Rd.', cat: 'ELECTRICAL', level: 'High', status: 'In Progress', tech: 'Sarah J.' }
                    ].map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-bold text-[#0A2540]">{job.id}</td>
                        <td className="py-3 px-4 font-bold">{job.title}</td>
                        <td className="py-3 px-4 text-slate-500">{job.address}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-slate-150 border border-slate-200 rounded text-[9px] font-black text-slate-655">
                            {job.cat}
                          </span>
                        </td>
                        <td className={`py-3 px-4 font-extrabold ${job.level === 'High' ? 'text-amber-600' : 'text-slate-500'}`}>
                          {job.level}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[9px] font-extrabold">
                            {job.status} ({job.tech})
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-[10px] font-bold italic">
                          Assigned
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TECHNICIANS TAB */}
          {activeTab === 'technicians' && (
            <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
              <div>
                <h3 className="text-lg font-extrabold text-[#0A2540]">Technicians Roster</h3>
                <p className="text-xs text-slate-400 font-semibold">Manage, inspect workloads, and check real-time availability of operatives</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTechnicians.map((tech) => (
                  <div key={tech.name} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all space-y-4 bg-slate-50/50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-sm text-[#0A2540]">
                          {tech.name.split(' ')[0][0]}{tech.name.split(' ')[1] ? tech.name.split(' ')[1][0] : ''}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-800">{tech.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{tech.specialty}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        tech.status === 'Online' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tech.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Assigned Tasks</span>
                        <span className="font-extrabold text-[#0A2540]">{tech.assigned} Active Jobs</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Transit Runs</span>
                        <span className="font-extrabold text-[#0A2540]">{tech.travel} Drives</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-1">
                      <span className="text-[10px] text-slate-400 font-bold">📍 Grid Sector: {tech.zone}</span>
                      <button 
                        onClick={() => showToast(`Opening chat with ${tech.name}`)}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Ping Radio
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE MAP PREVIEW INLINE */}
          {activeTab === 'map' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2540]">Live Grid Tracker</h3>
                  <p className="text-xs text-slate-400 font-semibold">Real-time overlay of active incidents (red) and technician locations (blue/green)</p>
                </div>
                <button
                  onClick={() => showToast('Syncing satellite location metrics...')}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw size={12} className="animate-spin-slow" />
                  <span>Refresh GPS</span>
                </button>
              </div>

              <div className="w-full h-[500px] rounded-xl overflow-hidden bg-sky-50 relative border border-slate-200 flex items-center justify-center">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <pattern id="grid-large" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBD5E1" strokeWidth="0.75" />
                  </pattern>
                  <rect width="100%" height="100%" fill="url(#grid-large)" />
                  
                  {/* Styled streets lines */}
                  <line x1="100" y1="0" x2="100" y2="1000" stroke="#94A3B8" strokeWidth="4" />
                  <line x1="300" y1="0" x2="300" y2="1000" stroke="#94A3B8" strokeWidth="6" />
                  <line x1="500" y1="0" x2="500" y2="1000" stroke="#94A3B8" strokeWidth="4" strokeDasharray="8,8" />
                  <line x1="0" y1="150" x2="1500" y2="150" stroke="#94A3B8" strokeWidth="5" />
                  <line x1="0" y1="350" x2="1500" y2="350" stroke="#94A3B8" strokeWidth="6" />
                  
                  {/* Transit Routes */}
                  <path d="M100 150 L300 150 L300 350 L500 350" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,5" />
                  
                  {/* Tech Marker Points */}
                  <g className="cursor-pointer" onClick={() => showToast('Mike T.: Active on Job #4829')}>
                    <circle cx="300" cy="150" r="10" fill="#3B82F6" stroke="white" strokeWidth="3" />
                    <text x="320" y="154" fill="#0A2540" className="font-extrabold text-[10px] bg-white">Mike T. (HVAC)</text>
                  </g>
                  
                  <g className="cursor-pointer" onClick={() => showToast('Sarah J.: Transit to Kitchen Leak')}>
                    <circle cx="100" cy="350" r="10" fill="#10B981" stroke="white" strokeWidth="3" />
                    <text x="120" y="354" fill="#0A2540" className="font-extrabold text-[10px] bg-white">Sarah J. (Transit)</text>
                  </g>

                  <g className="cursor-pointer" onClick={() => showToast('Elena K.: Assigned to Water Heater')}>
                    <circle cx="500" cy="200" r="10" fill="#3B82F6" stroke="white" strokeWidth="3" />
                    <text x="520" y="204" fill="#0A2540" className="font-extrabold text-[10px] bg-white">Elena K. (Plumbing)</text>
                  </g>

                  {/* Incident locations */}
                  {dispatches.map((disp, idx) => {
                    const cx = 100 + (idx * 250);
                    const cy = 250 - (idx * 50);
                    return (
                      <g key={disp.id} className="cursor-pointer" onClick={() => handleOpenAssign(disp)}>
                        <circle cx={cx} cy={cy} r="11" fill="#EF4444" stroke="white" strokeWidth="3" />
                        <circle cx={cx} cy={cy} r="22" fill="none" stroke="#EF4444" strokeWidth="1.5" className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                        <text x={cx + 18} y={cy + 4} fill="#EF4444" className="font-black text-[10px] bg-white/90 p-0.5 rounded border border-red-200">🚨 {disp.title}</text>
                      </g>
                    );
                  })}
                </svg>

                {/* Floating GPS card overlay */}
                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur border border-slate-200 p-4 rounded-xl shadow-2xl text-[11px] font-bold text-slate-700 space-y-1 z-20">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span>Active Technicians (Job Hub)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Transit / En Route Technicians</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>Pending Emergency Incident Sites</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-6 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg font-extrabold text-[#0A2540]">Dispatch & Event Audit Logs</h3>
                  <p className="text-xs text-slate-400 font-semibold">Comprehensive historic timeline of system events and operator overrides</p>
                </div>
                <button
                  onClick={() => {
                    setLogs([
                      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: 'Manual log reload requested', user: 'Alex Dispatch' },
                      ...logs
                    ]);
                    showToast('Logs refreshed.');
                  }}
                  className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors"
                >
                  Reload Logs
                </button>
              </div>

              {/* Logs chronological stream */}
              <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 whitespace-nowrap">
                      🕒 {log.timestamp}
                    </span>
                    <span className="flex-1 font-bold text-slate-700">{log.event}</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                      User: {log.user}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

      {/* TOAST POPUP NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-[#0A2540] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <span>ℹ️</span>
          <span>{toast}</span>
        </div>
      )}

      {/* MODAL 1: ASSIGN TECHNICIAN MODAL */}
      {assigningDispatch && (
        <div className="modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#0A2540]">Assign Emergency Call</h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">Ticket: {assigningDispatch.id}</p>
              </div>
              <button 
                onClick={() => setAssigningDispatch(null)} 
                className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs">
                <p className="font-extrabold text-rose-800 text-sm">🚨 {assigningDispatch.title}</p>
                <p className="text-rose-700 mt-1 font-semibold">📍 Address: {assigningDispatch.address}</p>
                <p className="text-rose-600 mt-0.5 font-bold uppercase tracking-wider">{assigningDispatch.priority} • {assigningDispatch.category}</p>
              </div>

              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Available Technician</label>
              
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {technicians.filter(t => t.status === 'Online').map((tech) => (
                  <button
                    key={tech.name}
                    onClick={() => handleConfirmAssignment(tech.name)}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/20 flex justify-between items-center transition-all group"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-700">{tech.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{tech.specialty} • Zone: {tech.zone}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-[#0A2540] block">{tech.assigned} jobs active</span>
                      <span className="text-[9px] font-bold text-slate-400 block">{tech.travel} in transit</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                onClick={() => setAssigningDispatch(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NEW REQUEST MODAL */}
      {isNewRequestOpen && (
        <div className="modal-overlay">
          <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#0A2540]">Create Dispatch Ticket</h3>
              <button 
                onClick={() => setIsNewRequestOpen(false)} 
                className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Issue / Description</label>
                <input 
                  type="text" 
                  value={newRequestData.title}
                  onChange={(e) => setNewRequestData({ ...newRequestData, title: e.target.value })}
                  placeholder="e.g. Toilet Overflowing, Short Circuit in kitchen" 
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Site Address</label>
                <input 
                  type="text" 
                  value={newRequestData.address}
                  onChange={(e) => setNewRequestData({ ...newRequestData, address: e.target.value })}
                  placeholder="Street Address, Apt / Suite, City" 
                  className="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Trade Category</label>
                  <select 
                    value={newRequestData.category}
                    onChange={(e) => setNewRequestData({ ...newRequestData, category: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-650"
                  >
                    <option value="PLUMBING">🔧 PLUMBING</option>
                    <option value="ELECTRICAL">⚡ ELECTRICAL</option>
                    <option value="AC_SERVICE">❄️ AC SERVICE</option>
                    <option value="CARPENTRY">🔨 CARPENTRY</option>
                    <option value="CLEANING">🧹 CLEANING</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Service Type</label>
                  <select 
                    value={newRequestData.type}
                    onChange={(e) => setNewRequestData({ ...newRequestData, type: e.target.value })}
                    className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-650"
                  >
                    <option value="RESIDENTIAL">RESIDENTIAL</option>
                    <option value="COMMERCIAL">COMMERCIAL</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-150 mt-3">
                <input 
                  type="checkbox"
                  id="isEmergency"
                  checked={newRequestData.isEmergency}
                  onChange={(e) => setNewRequestData({ ...newRequestData, isEmergency: e.target.checked })}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="isEmergency" className="cursor-pointer select-none">
                  <span className="block text-slate-800 font-extrabold">Emergency Dispatch</span>
                  <span className="block text-[10px] text-slate-400 font-medium">Flags as priority level 10 and places in Urgent Broadcast feed</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button 
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-bold shadow-sm transition-colors"
                >
                  Submit Ticket
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EXPANDED MAP MODAL */}
      {isMapExpanded && (
        <div className="modal-overlay z-[2100]">
          <div className="bg-white rounded-2xl max-w-6xl w-full mx-4 h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-base font-extrabold text-[#0A2540]">Regional Dispatch Live Grid Tracker</h3>
                <p className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5">City Division: Chicago Central Sector</p>
              </div>
              <button 
                onClick={() => setIsMapExpanded(false)} 
                className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 bg-sky-50 relative flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid-large-expanded" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#CBD5E1" strokeWidth="1" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid-large-expanded)" />
                
                {/* Major highway layout */}
                <line x1="200" y1="0" x2="200" y2="1000" stroke="#94A3B8" strokeWidth="8" />
                <line x1="500" y1="0" x2="500" y2="1000" stroke="#94A3B8" strokeWidth="10" />
                <line x1="800" y1="0" x2="800" y2="1000" stroke="#94A3B8" strokeWidth="8" strokeDasharray="15,15" />
                <line x1="0" y1="200" x2="2000" y2="200" stroke="#94A3B8" strokeWidth="8" />
                <line x1="0" y1="500" x2="2000" y2="500" stroke="#94A3B8" strokeWidth="12" />
                
                {/* Visual links/dispatch loops */}
                <path d="M200 200 L500 200 L500 500 L800 500" fill="none" stroke="#2563EB" strokeWidth="5" strokeLinecap="round" strokeDasharray="8,8" />
                
                {/* Active Technicians Pins */}
                <g className="cursor-pointer" onClick={() => showToast('Dave R. (Plumbing): Active')}>
                  <circle cx="200" cy="200" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
                  <text x="225" y="204" fill="#0A2540" className="font-extrabold text-xs bg-white px-1.5 py-0.5 rounded shadow">Dave R. (Plumbing)</text>
                </g>
                
                <g className="cursor-pointer" onClick={() => showToast('Sarah J. (Electrical): On Route')}>
                  <circle cx="500" cy="350" r="14" fill="#10B981" stroke="white" strokeWidth="4" />
                  <text x="525" y="354" fill="#0A2540" className="font-extrabold text-xs bg-white px-1.5 py-0.5 rounded shadow">Sarah J. (Transit)</text>
                </g>

                <g className="cursor-pointer" onClick={() => showToast('Mike T. (HVAC): Active')}>
                  <circle cx="800" cy="500" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
                  <text x="825" y="504" fill="#0A2540" className="font-extrabold text-xs bg-white px-1.5 py-0.5 rounded shadow">Mike T. (HVAC)</text>
                </g>

                <g className="cursor-pointer" onClick={() => showToast('Elena K. (Carpentry): Active')}>
                  <circle cx="500" cy="120" r="14" fill="#3B82F6" stroke="white" strokeWidth="4" />
                  <text x="525" y="124" fill="#0A2540" className="font-extrabold text-xs bg-white px-1.5 py-0.5 rounded shadow">Elena K. (Carpentry)</text>
                </g>

                {/* Incident Markers */}
                {dispatches.map((disp, idx) => {
                  const cx = 200 + (idx * 300);
                  const cy = 400 - (idx * 150);
                  return (
                    <g key={disp.id} className="cursor-pointer" onClick={() => {
                      handleOpenAssign(disp);
                      setIsMapExpanded(false);
                    }}>
                      <circle cx={cx} cy={cy} r="16" fill="#EF4444" stroke="white" strokeWidth="4" />
                      <circle cx={cx} cy={cy} r="32" fill="none" stroke="#EF4444" strokeWidth="2.5" className="animate-ping" style={{ transformOrigin: `${cx}px ${cy}px` }} />
                      <text x={cx + 24} y={cy + 5} fill="#EF4444" className="font-black text-xs bg-white/95 px-2 py-1 rounded border border-red-200 shadow-md">🚨 EMERGENCY: {disp.title}</text>
                    </g>
                  );
                })}
              </svg>
              
              {/* Map instructions banner */}
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur border border-slate-200 px-4 py-3 rounded-xl shadow-xl text-xs font-bold text-slate-800">
                💡 Click on red emergency beacons to assign technicians directly from the satellite map view.
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-4.5 border-t border-slate-200 flex justify-between items-center shrink-0">
              <div className="flex gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span><span>Active (Working)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 border border-white"></span><span>Transit (Drives)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 border border-white"></span><span>Incident (Emergency)</span></div>
              </div>
              <button 
                onClick={() => setIsMapExpanded(false)}
                className="px-5 py-2 bg-[#0A2540] hover:bg-[#13395F] text-white rounded-lg text-xs font-bold transition-all shadow-md"
              >
                Close Map view
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
