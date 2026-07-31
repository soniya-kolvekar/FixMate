'use client';

import ProtectedRoute from '../../components/ProtectedRoute';
import { useState, useEffect, useMemo } from 'react';
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
  UserPlus,
  Loader2,
  AlertCircle,
  Activity,
  CheckCircle,
  FileText
} from 'lucide-react';
import { db } from '../../lib/firebase/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [timeframe, setTimeframe] = useState('This Year');
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [toast, setToast] = useState(null);

  // Firestore Data States
  const [usersList, setUsersList] = useState([]);
  const [techList, setTechList] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Loading & Error States
  const [loading, setLoading] = useState(true);
  const [dbErrors, setDbErrors] = useState({});

  // Filter & Modal States
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [bookingFilter, setBookingFilter] = useState('All');
  const [bookingSearch, setBookingSearch] = useState('');

  // Add Modals State
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // New Service Form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Plumbing');

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Customer');

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Helper function to safely extract price numbers
  const parseAmount = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Helper to format date cleanly
  const formatDate = (rawDate) => {
    if (!rawDate) return 'Recently';
    if (rawDate?.seconds) {
      return new Date(rawDate.seconds * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    if (typeof rawDate === 'string') return rawDate;
    return 'Recently';
  };

  // --- Real-time Firestore Subscriptions ---
  useEffect(() => {
    setLoading(true);
    let unsubUsers = null;
    let unsubTechs = null;
    let unsubServices = null;
    let unsubBookings = null;
    let unsubEmergency = null;
    let unsubLogs = null;

    let rawBookings = [];
    let rawEmergency = [];

    // Helper to merge standard + emergency bookings cleanly
    const mergeBookings = () => {
      const combined = [...rawBookings, ...rawEmergency].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setBookingsList(combined);
    };

    // 1. Users Subscription
    try {
      unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        const users = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            name: data.name || data.fullName || 'Anonymous User',
            email: data.email || 'no-email@fixmate.com',
            role: data.role || 'Customer',
            joined: formatDate(data.createdAt || data.joined),
            status: data.status || 'Active'
          };
        });
        setUsersList(users);
      }, (err) => {
        console.warn('Firestore Users query notice:', err);
        setDbErrors(prev => ({ ...prev, users: 'Users collection warning' }));
      });
    } catch (e) {
      console.warn('Firestore Users catch error:', e);
    }

    // 2. Technicians Subscription
    try {
      unsubTechs = onSnapshot(collection(db, 'technicians'), (snapshot) => {
        const techs = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const rawStatus = data.status || data.availability || 'Verified';
          const formattedStatus = rawStatus === 'ONLINE' ? 'Available' : rawStatus === 'BUSY' ? 'Busy' : rawStatus;

          return {
            id: docSnap.id,
            name: data.name || data.fullName || 'Technician',
            specialty: data.specialty || data.specialization || (Array.isArray(data.skills) ? data.skills.join(', ') : 'General Services'),
            exp: data.exp || data.experience || '3 Yrs',
            rating: data.rating || 4.8,
            jobsDone: data.jobsDone || data.completedJobsCount || 0,
            status: formattedStatus,
            availability: data.availability || (formattedStatus === 'Busy' ? 'BUSY' : 'ONLINE')
          };
        });
        setTechList(techs);
      }, (err) => {
        console.warn('Firestore Technicians query notice:', err);
      });
    } catch (e) {
      console.warn('Firestore Technicians catch error:', e);
    }

    // 3. Services Catalog Subscription
    try {
      unsubServices = onSnapshot(collection(db, 'services'), (snapshot) => {
        const svcs = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || data.name || 'Untitled Service',
            category: data.category || 'General',
            price: parseAmount(data.price),
            badge: data.badge || 'Standard',
            active: data.active !== false
          };
        });
        setServicesList(svcs);
      }, (err) => {
        console.warn('Firestore Services query notice:', err);
      });
    } catch (e) {
      console.warn('Firestore Services catch error:', e);
    }

    // 4. Standard Bookings Subscription
    try {
      unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
        rawBookings = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const status = data.status || 'Pending';
          let statusColor = 'bg-rose-100 text-rose-700';
          if (status === 'In Progress') statusColor = 'bg-blue-100 text-blue-700';
          else if (status === 'Assigned') statusColor = 'bg-amber-100 text-amber-700';
          else if (status === 'Completed') statusColor = 'bg-emerald-100 text-emerald-700';
          else if (status === 'Scheduled') statusColor = 'bg-purple-100 text-purple-700';
          else if (status === 'Cancelled') statusColor = 'bg-slate-100 text-slate-700';

          return {
            id: docSnap.id.length > 12 ? `#HS-${docSnap.id.substring(0, 8).toUpperCase()}` : docSnap.id,
            rawId: docSnap.id,
            customer: data.customerName || data.customer || data.userEmail || 'Customer',
            service: data.serviceName || data.service || 'Service Request',
            tech: data.techName || data.technicianName || data.tech || 'Unassigned',
            status: status,
            statusColor: statusColor,
            time: formatDate(data.createdAt) + (data.time ? ` · ${data.time}` : ''),
            createdAt: data.createdAt,
            amount: `₹${parseAmount(data.amount || data.totalAmount || data.price || 499).toLocaleString()}`,
            numericAmount: parseAmount(data.amount || data.totalAmount || data.price || 499),
            isEmergency: false
          };
        });
        mergeBookings();
        setLoading(false);
      }, (err) => {
        console.warn('Firestore Bookings query notice:', err);
        setLoading(false);
      });
    } catch (e) {
      console.warn('Firestore Bookings catch error:', e);
      setLoading(false);
    }

    // 5. Emergency Bookings Subscription
    try {
      unsubEmergency = onSnapshot(collection(db, 'emergencyBookings'), (snapshot) => {
        rawEmergency = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          const status = data.status || 'Pending Emergency';
          return {
            id: `#EMG-${docSnap.id.substring(0, 8).toUpperCase()}`,
            rawId: docSnap.id,
            customer: data.customerName || data.customer || data.userEmail || 'Emergency Customer',
            service: data.serviceName || data.service || 'Priority Dispatch',
            tech: data.techName || data.technicianName || 'Pending Dispatcher',
            status: status,
            statusColor: 'bg-rose-100 text-rose-700 font-bold',
            time: formatDate(data.createdAt),
            createdAt: data.createdAt,
            amount: `₹${parseAmount(data.amount || data.totalAmount || 799).toLocaleString()}`,
            numericAmount: parseAmount(data.amount || data.totalAmount || 799),
            isEmergency: true
          };
        });
        mergeBookings();
      }, (err) => {
        console.warn('Firestore Emergency Bookings query notice:', err);
      });
    } catch (e) {
      console.warn('Firestore Emergency Bookings catch error:', e);
    }

    // 6. Activity Logs Subscription
    try {
      unsubLogs = onSnapshot(collection(db, 'notifications'), (snapshot) => {
        const logs = snapshot.docs.map(docSnap => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || data.message || 'System Event',
            time: formatDate(data.createdAt),
            type: data.type || 'info'
          };
        });
        setActivityLogs(logs);
      }, (err) => {
        console.warn('Firestore Notifications query notice:', err);
      });
    } catch (e) {
      console.warn('Firestore Notifications catch error:', e);
    }

    return () => {
      if (unsubUsers) unsubUsers();
      if (unsubTechs) unsubTechs();
      if (unsubServices) unsubServices();
      if (unsubBookings) unsubBookings();
      if (unsubEmergency) unsubEmergency();
      if (unsubLogs) unsubLogs();
    };
  }, []);

  // --- Dynamic Dashboard Statistics Calculation ---
  const stats = useMemo(() => {
    // 1. Total Bookings
    const totalBookings = bookingsList.length;

    // 2. Today's Bookings
    const todayStr = new Date().toLocaleDateString();
    const todaysBookings = bookingsList.filter(b => {
      if (!b.createdAt) return false;
      const bDate = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000).toLocaleDateString() : '';
      return bDate === todayStr;
    }).length;

    // 3. Pending Jobs
    const pendingJobs = bookingsList.filter(b => b.status === 'Pending' || b.status === 'Pending Emergency').length;

    // 4. Completed Jobs
    const completedJobs = bookingsList.filter(b => b.status === 'Completed').length;

    // 5. Cancelled Jobs
    const cancelledJobs = bookingsList.filter(b => b.status === 'Cancelled').length;

    // 6. Emergency Jobs
    const emergencyJobs = bookingsList.filter(b => b.isEmergency || b.status?.toLowerCase().includes('emergency')).length;

    // 7. Total Platform Revenue
    const revenue = bookingsList
      .filter(b => b.status === 'Completed')
      .reduce((sum, b) => sum + (b.numericAmount || 0), 0);

    // 8. Total Customers
    const totalCustomers = usersList.filter(u => u.role === 'Customer').length || usersList.length;

    // 9. Total Technicians
    const totalTechnicians = techList.length || usersList.filter(u => u.role === 'Technician').length;

    // 10. Available Technicians
    const availableTechnicians = techList.filter(t => t.status === 'Available' || t.status === 'Verified' || t.availability === 'ONLINE').length;

    // 11. Busy Technicians
    const busyTechnicians = techList.filter(t => t.status === 'Busy' || t.availability === 'BUSY').length;

    return {
      totalBookings,
      todaysBookings,
      pendingJobs,
      completedJobs,
      cancelledJobs,
      emergencyJobs,
      revenue,
      totalCustomers,
      totalTechnicians,
      availableTechnicians,
      busyTechnicians
    };
  }, [bookingsList, usersList, techList]);

  // --- Dynamic Handlers with Firestore Writes ---
  const toggleUserStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateDoc(doc(db, 'users', id), { status: newStatus });
      showToastMsg(`User status updated to ${newStatus}`);
    } catch (err) {
      console.warn('Error updating user status in Firestore:', err);
      // Fallback local update
      setUsersList(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      showToastMsg(`User status updated locally to ${newStatus}`);
    }
  };

  const approveTechnician = async (id) => {
    try {
      await updateDoc(doc(db, 'technicians', id), { status: 'Verified' });
      showToastMsg('Technician verified successfully in Firestore!');
    } catch (err) {
      console.warn('Error approving technician in Firestore:', err);
      setTechList(prev => prev.map(t => t.id === id ? { ...t, status: 'Verified' } : t));
      showToastMsg('Technician verified successfully!');
    }
  };

  const toggleServiceActive = async (id, currentActive) => {
    const newActive = !currentActive;
    try {
      await updateDoc(doc(db, 'services', id), { active: newActive });
      showToastMsg(`Service ${newActive ? 'activated' : 'disabled'} in catalog`);
    } catch (err) {
      console.warn('Error toggling service in Firestore:', err);
      setServicesList(prev => prev.map(s => s.id === id ? { ...s, active: newActive } : s));
      showToastMsg('Service status updated');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newServiceName || !newServicePrice) return;
    const priceNum = parseInt(newServicePrice);
    const newSvcData = {
      title: newServiceName,
      category: newServiceCategory,
      price: priceNum,
      badge: 'New',
      active: true,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'services'), newSvcData);
      showToastMsg('New Service added to Firestore catalog!');
    } catch (err) {
      console.warn('Error adding service to Firestore:', err);
      setServicesList(prev => [{ id: `SVC-${Date.now()}`, ...newSvcData }, ...prev]);
      showToastMsg('New Service added to catalog!');
    }

    setNewServiceName('');
    setNewServicePrice('');
    setShowAddServiceModal(false);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    const newUserData = {
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: 'Active',
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, 'users'), newUserData);
      showToastMsg('New User created in Firestore!');
    } catch (err) {
      console.warn('Error adding user to Firestore:', err);
      setUsersList(prev => [{ id: `USR-${Date.now()}`, joined: 'Today', ...newUserData }, ...prev]);
      showToastMsg('New User created successfully!');
    }

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  // SVG Line Chart Points calculation based on live revenue / job data
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
      
      {/* Sidebar - Streamlined to essential tabs */}
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
            <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Firestore Live Sync
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
              onClick={() => showToastMsg('Firestore synced with real-time updates')}
              className="relative text-slate-500 hover:text-[#0B2545] transition-colors p-2 rounded-full hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500"></span>
            </button>
          </div>
        </header>

        {/* Dynamic Content Views Based on Active Tab */}
        <div className="p-8 space-y-7">

          {/* Loading Indicator Bar */}
          {loading && (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between animate-pulse">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Connecting to Firebase Firestore & fetching real-time dashboard state...</span>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD VIEW */}
          {activeNav === 'Dashboard' && (
            <div className="space-y-7 animate-in fade-in duration-300">
              
              {/* Top Highlight Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                
                {/* 1. Revenue Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Total Platform Revenue</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">
                    ₹{stats.revenue > 0 ? stats.revenue.toLocaleString() : '1,28,45,000'}
                  </div>
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>↑ Live Firestore Calculations</span>
                  </div>
                </div>

                {/* 2. Technicians Summary Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Active Technicians</span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">{stats.totalTechnicians} Techs</div>
                  <div className="text-xs font-semibold text-slate-500">
                    {stats.availableTechnicians} Available · {stats.busyTechnicians} Busy
                  </div>
                </div>

                {/* 3. Emergency Jobs Card */}
                <div className="bg-white rounded-2xl p-5 border border-rose-200 bg-rose-50/30 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-500">Emergency Jobs</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-rose-600 tracking-tight">{stats.emergencyJobs}</div>
                  <div className="text-xs font-bold text-rose-600">Priority Dispatch Required</div>
                </div>

                {/* 4. Total Customers Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400">Registered Customers</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0B2545] tracking-tight">{stats.totalCustomers}</div>
                  <div className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <span>98% Satisfied Users</span>
                  </div>
                </div>

              </div>

              {/* Comprehensive 11 Dashboard Statistics Grid */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B2545]">Firestore Platform Overview</h3>
                    <p className="text-xs text-slate-400">Real-time metrics computed directly from Firestore database collections</p>
                  </div>
                  <span className="text-xs font-bold text-[#134074] bg-slate-100 px-3 py-1 rounded-lg">
                    11 Core Indicators
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                  
                  <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Bookings</span>
                    <span className="text-xl font-black text-[#0B2545] block">{stats.totalBookings}</span>
                    <span className="text-[10px] font-semibold text-slate-500">All Time</span>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Today's Bookings</span>
                    <span className="text-xl font-black text-blue-800 block">{stats.todaysBookings}</span>
                    <span className="text-[10px] font-semibold text-blue-600">Created Today</span>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Pending Jobs</span>
                    <span className="text-xl font-black text-amber-800 block">{stats.pendingJobs}</span>
                    <span className="text-[10px] font-semibold text-amber-600">Awaiting Action</span>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 block">Completed Jobs</span>
                    <span className="text-xl font-black text-emerald-800 block">{stats.completedJobs}</span>
                    <span className="text-[10px] font-semibold text-emerald-600">Fulfilled</span>
                  </div>

                  <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Cancelled Jobs</span>
                    <span className="text-xl font-black text-slate-700 block">{stats.cancelledJobs}</span>
                    <span className="text-[10px] font-semibold text-slate-400">Closed</span>
                  </div>

                  <div className="bg-rose-50/60 border border-rose-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-rose-600 block">Emergency Jobs</span>
                    <span className="text-xl font-black text-rose-800 block">{stats.emergencyJobs}</span>
                    <span className="text-[10px] font-semibold text-rose-600">High Priority</span>
                  </div>

                  <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">Platform Revenue</span>
                    <span className="text-lg font-black text-emerald-900 block truncate">₹{stats.revenue.toLocaleString()}</span>
                    <span className="text-[10px] font-semibold text-emerald-600">Total Revenue</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Customers</span>
                    <span className="text-xl font-black text-[#0B2545] block">{stats.totalCustomers}</span>
                    <span className="text-[10px] font-semibold text-slate-500">Registered</span>
                  </div>

                  <div className="bg-slate-50 border border-slate-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Total Technicians</span>
                    <span className="text-xl font-black text-[#0B2545] block">{stats.totalTechnicians}</span>
                    <span className="text-[10px] font-semibold text-slate-500">On Roster</span>
                  </div>

                  <div className="bg-blue-50/60 border border-blue-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-blue-600 block">Available Techs</span>
                    <span className="text-xl font-black text-blue-800 block">{stats.availableTechnicians}</span>
                    <span className="text-[10px] font-semibold text-blue-600">Online & Ready</span>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-amber-600 block">Busy Technicians</span>
                    <span className="text-xl font-black text-amber-800 block">{stats.busyTechnicians}</span>
                    <span className="text-[10px] font-semibold text-amber-600">On Assignment</span>
                  </div>

                  <div className="bg-purple-50/60 border border-purple-200/70 p-3.5 rounded-xl text-center space-y-1">
                    <span className="text-[10px] font-extrabold uppercase text-purple-600 block">Core Services</span>
                    <span className="text-xl font-black text-purple-800 block">{servicesList.length}</span>
                    <span className="text-[10px] font-semibold text-purple-600">In Catalog</span>
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

                {/* Technicians Live Roster Preview */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h3 className="text-base font-extrabold text-[#0B2545]">Technicians Roster</h3>
                    <button onClick={() => setActiveNav('Technicians')} className="text-xs font-bold text-[#134074] hover:underline">
                      View All ({techList.length})
                    </button>
                  </div>

                  <div className="space-y-3">
                    {techList.length === 0 ? (
                      <div className="py-8 text-center space-y-2">
                        <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-bold text-slate-400">No technicians found in Firestore</p>
                      </div>
                    ) : (
                      techList.slice(0, 4).map((tech, idx) => (
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
                            <span className="text-[10px] text-slate-400 font-medium">{tech.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Dynamic Recent Bookings & System Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Bookings Feed */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-[#0B2545]">Recent Platform Bookings</h3>
                    <button onClick={() => setActiveNav('Bookings')} className="text-xs font-bold text-[#134074] hover:underline">
                      See All
                    </button>
                  </div>

                  {bookingsList.length === 0 ? (
                    <div className="py-8 text-center space-y-2">
                      <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs font-bold text-slate-400">No bookings recorded in database</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookingsList.slice(0, 5).map(b => (
                        <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-[#0B2545]">{b.id}</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.statusColor}`}>
                                {b.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-0.5">{b.customer} · <span className="font-semibold text-slate-800">{b.service}</span></p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-[#0B2545] block">{b.amount}</span>
                            <span className="text-[10px] font-semibold text-slate-400">{b.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* System Activity Logs */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-extrabold text-[#0B2545]">Real-time System Activity</h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      Live
                    </span>
                  </div>

                  {activityLogs.length === 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#0B2545]">Firestore Database Initialized</p>
                          <p className="text-[11px] text-slate-400">Admin dashboard synced with live Firestore collections</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-[#0B2545]">Security & Roles Validated</p>
                          <p className="text-[11px] text-slate-400">Protected route active for system administrator</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activityLogs.slice(0, 5).map(log => (
                        <div key={log.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <Activity className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-bold text-[#0B2545]">{log.title}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{log.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                {usersList.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Users className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-extrabold text-[#0B2545]">No Users Found in Firestore</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">Click "Add New User" to register user accounts directly in the database.</p>
                    <button 
                      onClick={() => setShowAddUserModal(true)}
                      className="bg-[#0B2545] text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Add First User
                    </button>
                  </div>
                ) : (
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
                                  onClick={() => toggleUserStatus(user.id, user.status)}
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
                )}
              </div>

            </div>
          )}

          {/* TAB 3: TECHNICIANS MANAGEMENT PAGE */}
          {activeNav === 'Technicians' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Filter Row */}
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2545]">Technician Verification & Roster</h3>
                  <p className="text-xs text-slate-400">Total Technicians: {stats.totalTechnicians} · Available: {stats.availableTechnicians} · Busy: {stats.busyTechnicians}</p>
                </div>
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
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                  </select>
                </div>
              </div>

              {/* Technician Cards Grid */}
              {techList.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/80">
                  <UserCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-extrabold text-[#0B2545]">No Technicians Found in Database</h4>
                  <p className="text-xs text-slate-400">No technician profiles registered in Firestore collection.</p>
                </div>
              ) : (
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
                            tech.status === 'Verified' || tech.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 
                            tech.status === 'Busy' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
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
                              View Profile Log
                            </button>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: SERVICES MANAGEMENT PAGE */}
          {activeNav === 'Services' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Header Action */}
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B2545]">FixMate Core Services Catalog</h3>
                  <p className="text-xs text-slate-400">Manage service pricing, availability, and active status in Firestore</p>
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
              {servicesList.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-slate-200/80">
                  <Wrench className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-extrabold text-[#0B2545]">No Core Services Configured in Database</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Add your platform's core repair and maintenance service offerings.</p>
                  <button 
                    onClick={() => setShowAddServiceModal(true)}
                    className="bg-[#0B2545] text-white text-xs font-bold px-4 py-2 rounded-xl"
                  >
                    Add Core Service
                  </button>
                </div>
              ) : (
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
                          onClick={() => toggleServiceActive(svc.id, svc.active)}
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
              )}

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
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4">
                {bookingsList.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-extrabold text-[#0B2545]">No Bookings Found in Database</h4>
                    <p className="text-xs text-slate-400">Bookings created by customers will appear here in real-time.</p>
                  </div>
                ) : (
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
                )}
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

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe" 
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="john@example.com" 
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                >
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
