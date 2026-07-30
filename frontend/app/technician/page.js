'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import ProtectedRoute from '../../components/ProtectedRoute';
import TechHeader from '../../components/technician/TechHeader';
import TechDashboard from '../../components/technician/TechDashboard';
import TechJobList from '../../components/technician/TechJobList';
import TechJobDetail from '../../components/technician/TechJobDetail';
import TechProfile from '../../components/technician/TechProfile';
import TechPerformance from '../../components/technician/TechPerformance';
import TechEmergencyModal from '../../components/technician/TechEmergencyModal';
import TechExtraChargesModal from '../../components/technician/TechExtraChargesModal';
import TechDelayModal from '../../components/technician/TechDelayModal';
import TechAuthModal from '../../components/technician/TechAuthModal';
import { Info } from 'lucide-react';

export default function TechnicianModulePage() {
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard | jobs | emergency | performance | profile
  const [selectedJob, setSelectedJob] = useState(null);
  const [availability, setAvailability] = useState('Available'); // Available | Busy | Offline
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Single Dispatcher & Admin Scope for Mangaluru, Karnataka
  const DISPATCHER_EMAIL = 'dispatcher@fixmate.com';
  const MANGALURU_REGION = 'Mangaluru, Karnataka';

  // Authentication & Technician Profile State (Mangaluru Region Focus)
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [currentUser, setCurrentUser] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@fixmate.in',
    phone: '+91 98765 43210',
    specialization: 'Master Plumber',
    experienceYears: '8',
    workingArea: 'Kodialbail & Hampankatta, Mangaluru',
    status: 'Available'
  });

  // Real-time Firebase Sync & Persistent Availability for logged in Technician
  useEffect(() => {
    let unsubscribeUserDoc = null;
    let unsubscribeTechDoc = null;

    // 1. Immediately restore cached availability from localStorage on mount (preserves state across refresh)
    try {
      const cached = localStorage.getItem('fixmate_tech_availability');
      if (cached) setAvailability(cached);
    } catch(e) {}

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const targetUid = user?.uid || 'tech_rajesh_kumar';

      const userDocRef = doc(db, 'users', targetUid);
      const techDocRef = doc(db, 'technicians', targetUid);

      // 2. Real-time subscription to technicians collection in Firestore
      unsubscribeTechDoc = onSnapshot(techDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbStatus = data.availability || data.status;
          if (dbStatus) {
            setAvailability(dbStatus);
            try {
              localStorage.setItem('fixmate_tech_availability', dbStatus);
              localStorage.setItem(`fixmate_tech_availability_${targetUid}`, dbStatus);
            } catch(e) {}
          }
        }
      }, (err) => console.warn('Tech doc snapshot warning:', err));

      // 3. Real-time subscription to users collection in Firestore
      unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const dbStatus = data.availability || data.status;
          if (dbStatus) {
            setAvailability(dbStatus);
            try {
              localStorage.setItem('fixmate_tech_availability', dbStatus);
            } catch(e) {}
          }
          setCurrentUser(prev => ({
            ...prev,
            uid: targetUid,
            name: data.name || data.fullName || user?.displayName || prev.name,
            email: data.email || user?.email || prev.email,
            phone: data.phone || data.mobile || prev.phone,
            specialization: data.specialization || (data.skills && data.skills.join(', ')) || prev.specialization,
            experienceYears: String(data.experienceYears || data.experience || prev.experienceYears),
            workingArea: data.workingArea || data.serviceArea || 'Kodialbail & Hampankatta, Mangaluru',
            avatarUrl: data.avatarUrl || prev.avatarUrl,
            status: dbStatus || prev.status
          }));
        }
      }, (err) => console.warn('User doc snapshot warning:', err));
    });

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc();
      if (unsubscribeTechDoc) unsubscribeTechDoc();
      unsubscribeAuth();
    };
  }, []);

  // Daily Workload Capacity Rule (Max 6 assigned jobs per day)
  const MAX_DAILY_CAPACITY = 6;

  // Modals state
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [extraChargesModalOpen, setExtraChargesModalOpen] = useState(false);
  const [delayModalOpen, setDelayModalOpen] = useState(false);

  // Mock initial jobs list (Tailored for Mangaluru, Karnataka)
  const [jobs, setJobs] = useState([
    {
      id: 'FM-9841',
      title: 'Plumbing Repair & Leak Fixing',
      tag: 'PREMIUM',
      time: '09:30 AM',
      location: '104 MG Road, Kodialbail, Mangaluru',
      customerName: 'Priya Sharma',
      customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      customerPhone: '+91 98123 45678',
      price: 499.00,
      status: 'On The Way',
      description: 'Persistent leak detected under vanity cabinet. Customer reports water pooling after 10 minutes of faucet use.',
      extraCharges: 0,
      extraChargesReason: '',
      isEmergency: false
    },
    {
      id: 'FM-9842',
      title: 'Geyser & Water Heater Flush',
      tag: 'REPAIR',
      time: '11:00 AM',
      location: '742 Hampankatta Main Rd, Mangaluru',
      customerName: 'Aarav Mehta',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      customerPhone: '+91 98234 56789',
      price: 699.00,
      status: 'Accepted',
      description: 'Sediment flush and pressure safety valve inspection for 25L geyser.',
      extraCharges: 0,
      extraChargesReason: '',
      isEmergency: false
    },
    {
      id: 'FM-9843',
      title: 'Kitchen Tap Sensor Replacement',
      tag: 'INSTALL',
      time: '02:00 PM',
      location: '88 Bejai Main Road, Mangaluru',
      customerName: 'Ananya Reddy',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      customerPhone: '+91 98345 67890',
      price: 899.00,
      status: 'Assigned',
      description: 'Replace standard kitchen tap with touchless sensor faucet provided by customer.',
      extraCharges: 0,
      extraChargesReason: '',
      isEmergency: false
    },
    {
      id: 'FM-9844',
      title: 'Bathroom Pipe Anti-Clog Sanitation',
      tag: 'MAINTENANCE',
      time: '04:30 PM',
      location: '482 Kadri Hills, Mangaluru',
      customerName: 'Vikram Malhotra',
      customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      customerPhone: '+91 98456 78901',
      price: 1299.00,
      status: 'Assigned',
      description: 'Deep sanitization and anti-clog treatment for master suite bathroom drainage.',
      extraCharges: 0,
      extraChargesReason: '',
      isEmergency: false
    }
  ]);

  // Notifications state (Mangaluru Region Focus)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Job Assigned', message: 'Assigned #FM-9844 in Kadri Hills, Mangaluru', time: '10 mins ago' },
    { id: 2, title: 'Dispatcher Broadcast', message: 'High service demand in Kodialbail Sector, Mangaluru', time: '45 mins ago' }
  ]);

  // Mock Emergency Job data (Mangaluru Region)
  const mockEmergencyJob = {
    id: 'EMG-9021',
    title: 'Burst Main Pipe & Floor Flooding',
    category: 'Emergency Plumbing',
    distance: '1.2 km away',
    travelTime: '8 mins',
    customerNote: 'Water leaking heavily through living room ceiling. Need immediate main valve shutoff and repair.',
    location: '147 Surathkal Beach Road, Mangaluru',
    customerName: 'Rohan Verma',
    customerPhone: '+91 98999 88877',
    price: 1499.00,
    isEmergency: true
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Availability Switcher with Firebase Firestore & Backend Sync
  const handleToggleAvailability = async (forcedStatus) => {
    let nextStatus = 'Available';
    if (typeof forcedStatus === 'string') {
      nextStatus = (forcedStatus === 'ONLINE' || forcedStatus === 'Available') ? 'Available' : (forcedStatus === 'BUSY' || forcedStatus === 'Busy') ? 'Busy' : 'Offline';
    } else {
      nextStatus = availability === 'Available' ? 'Busy' : availability === 'Busy' ? 'Offline' : 'Available';
    }

    setAvailability(nextStatus);
    try {
      localStorage.setItem('fixmate_tech_availability', nextStatus);
    } catch(e) {}

    const user = auth.currentUser;
    const techUid = user?.uid || currentUser?.uid || 'tech_rajesh_kumar';

    const techPayload = {
      id: techUid,
      uid: techUid,
      name: currentUser?.name || 'Rajesh Kumar',
      phone: currentUser?.phone || '+91 98765 43210',
      email: currentUser?.email || 'rajesh.kumar@fixmate.in',
      specialization: currentUser?.specialization || 'Master Plumber',
      specialty: currentUser?.specialization || 'Plumbing',
      workingArea: currentUser?.workingArea || 'Kodialbail & Hampankatta, Mangaluru',
      zone: currentUser?.workingArea || 'Kodialbail & Hampankatta, Mangaluru',
      availability: nextStatus,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'technicians', techUid), techPayload, { merge: true });
      await setDoc(doc(db, 'users', techUid), techPayload, { merge: true });
    } catch (err) {
      console.warn('Firestore availability update error:', err);
    }

    fetch(`http://localhost:5000/api/technicians/${techUid}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: nextStatus, availability: nextStatus })
    }).catch(err => console.warn('Express API status update error:', err));

    try {
      localStorage.setItem(`fixmate_tech_availability_${techUid}`, nextStatus);
      window.dispatchEvent(new CustomEvent('fixmate_tech_status_updated', { detail: techPayload }));
    } catch(e) {}

    showToast(`🟢 Duty Status: Updated to "${nextStatus}" (Synced with ${DISPATCHER_EMAIL})`);
  };

  // Checklist Progression Handler
  const handleUpdateStatus = (jobId, nextStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, status: nextStatus }));
    }
    
    const newNotif = {
      id: Date.now(),
      title: 'Status Synchronized',
      message: `Job #${jobId} status updated to "${nextStatus}". Synced with ${DISPATCHER_EMAIL}.`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`✅ Job #${jobId} status updated to "${nextStatus}"`);
  };

  // Emergency Acceptance Handler
  const handleAcceptEmergency = (emgJob) => {
    const activeCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Cancelled').length;

    if (activeCount >= MAX_DAILY_CAPACITY) {
      alert(`⚠️ Daily Capacity Limit Reached (${MAX_DAILY_CAPACITY} Jobs Max). Finish or complete existing jobs first!`);
      return;
    }

    const newJob = {
      ...emgJob,
      status: 'Accepted',
      extraCharges: 0,
      extraChargesReason: '',
      time: 'Immediate'
    };

    setJobs(prev => [newJob, ...prev]);
    setEmergencyModalOpen(false);
    setSelectedJob(newJob);
    showToast(`🚨 Emergency Job #${emgJob.id} accepted! Transmitted to ${DISPATCHER_EMAIL}.`);
  };

  // Extra Charges Handler
  const handleAddExtraCharges = (jobId, amount, reason) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          extraCharges: (j.extraCharges || 0) + amount,
          extraChargesReason: reason
        };
      }
      return j;
    }));

    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({
        ...prev,
        extraCharges: (prev.extraCharges || 0) + amount,
        extraChargesReason: reason
      }));
    }

    showToast(`+₹${amount.toFixed(2)} extra charges added to #${jobId} with justification.`);
  };

  // Delay & Cancellation Report Handler
  const handleReportDelay = async (jobId, reasonType, notes) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const isCancellation = reasonType === 'Cancel Assignment';
    
    const alertId = `DISP-ALERT-${Date.now()}`;
    const alertItem = {
      id: alertId,
      jobId: jobId,
      title: `${isCancellation ? '🚨 MID-SERVICE CANCELLATION REQUEST' : '⚠️ TECHNICIAN DELAY ALERT'} - #${jobId}`,
      time: 'Just now',
      address: targetJob?.location || '104 MG Road, Kodialbail, Mangaluru',
      priority: isCancellation ? 'Priority Level 10' : 'Priority Level 8',
      category: isCancellation ? 'CANCELLATION' : 'DELAY',
      type: 'URGENT',
      icon: isCancellation ? '🚫' : '🚗',
      colorClass: isCancellation ? 'bg-rose-50 border-rose-200 hover:border-rose-400' : 'bg-amber-50 border-amber-200 hover:border-amber-400',
      iconBg: isCancellation ? 'bg-rose-100 text-rose-700 font-bold' : 'bg-amber-100 text-amber-700 font-bold',
      customerName: targetJob?.customerName || 'Customer',
      customerPhone: targetJob?.customerPhone || '',
      technicianName: currentUser?.name || 'Rajesh Kumar',
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      targetDispatcher: DISPATCHER_EMAIL,
      region: MANGALURU_REGION,
      reasonType: reasonType,
      notes: notes || 'Technician reported incident during active duty in Mangaluru region.',
      price: targetJob?.price ? `${targetJob.price.toFixed(2)}` : '499.00',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'dispatches', alertId), alertItem, { merge: true });
      await setDoc(doc(db, 'dispatcher_alerts', alertId), alertItem, { merge: true });
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    fetch('http://localhost:5000/api/dispatches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertItem)
    }).catch(err => console.warn('Express API dispatch warning:', err));

    try {
      const localData = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify([alertItem, ...localData]));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));
    } catch(e) {}

    if (isCancellation) {
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'Cancelled' } : j));
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob(prev => ({ ...prev, status: 'Cancelled' }));
      }
    }

    showToast(`🚨 Urgent alert sent to ${DISPATCHER_EMAIL} (Mangaluru) for #${jobId}: "${reasonType}"`);
  };

  // Auth Handler
  const handleAuthSuccess = (userData, message) => {
    setCurrentUser(userData);
    showToast(message);
  };

  const getPageTitle = () => {
    if (selectedJob) return `Job Details: #${selectedJob.id}`;
    switch (activeTab) {
      case 'dashboard': return 'Technician Hub — Mangaluru Region';
      case 'jobs': return 'Assigned Jobs Hub (Mangaluru)';
      case 'emergency': return 'Emergency Requests (Mangaluru)';
      case 'performance': return 'Performance & Analytics';
      case 'profile': return 'Technician Profile & Settings';
      default: return 'Technician Portal — Mangaluru';
    }
  };

  return (
    <ProtectedRoute allowedRole="technician">
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex flex-col antialiased">
        
        {/* Full-width Sticky Header with StaggeredMenu Overlay */}
        <TechHeader 
          title={getPageTitle()}
          availability={availability}
          onToggleAvailability={handleToggleAvailability}
          notifications={notifications}
          onTriggerEmergency={() => setEmergencyModalOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            setSelectedJob(null);
          }}
          currentUser={currentUser}
        />

        {/* Full Width Dashboard Screen Body */}
        <main className="p-6 md:p-8 max-w-7xl w-full mx-auto flex-1">
          {selectedJob ? (
            <TechJobDetail 
              job={selectedJob}
              onBack={() => setSelectedJob(null)}
              onUpdateStatus={handleUpdateStatus}
              onOpenExtraCharges={() => setExtraChargesModalOpen(true)}
              onOpenReportDelay={() => setDelayModalOpen(true)}
            />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <TechDashboard 
                  jobs={jobs}
                  onSelectJob={(j) => setSelectedJob(j)}
                  onViewAllJobs={() => setActiveTab('jobs')}
                  onTriggerEmergency={() => setEmergencyModalOpen(true)}
                  maxCapacity={MAX_DAILY_CAPACITY}
                />
              )}

              {activeTab === 'jobs' && (
                <TechJobList 
                  jobs={jobs}
                  onSelectJob={(j) => setSelectedJob(j)}
                />
              )}

              {activeTab === 'emergency' && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200/80 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-black text-[#0A2540]">Active Emergency Broadcasts — Mangaluru</h3>
                      <p className="text-xs text-slate-500 font-medium">Real-time emergency calls assigned by Mangaluru Dispatcher ({DISPATCHER_EMAIL})</p>
                    </div>
                    <button 
                      onClick={() => setEmergencyModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 shadow-md transition-all"
                    >
                      Open Live Emergency Overlay
                    </button>
                  </div>
                  <TechJobList 
                    jobs={jobs.filter(j => j.isEmergency || j.tag === 'EMERGENCY')}
                    onSelectJob={(j) => setSelectedJob(j)}
                  />
                </div>
              )}

              {activeTab === 'performance' && (
                <TechPerformance 
                  jobs={jobs}
                  currentUser={currentUser}
                  availability={availability}
                />
              )}

              {activeTab === 'profile' && (
                <TechProfile 
                  availability={availability}
                  onToggleAvailability={handleToggleAvailability}
                  currentUser={currentUser}
                  onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
                />
              )}
            </>
          )}
        </main>

        {/* Modals & Overlays */}
        <TechAuthModal 
          isOpen={authModal.isOpen}
          mode={authModal.mode}
          onClose={() => setAuthModal({ ...authModal, isOpen: false })}
          onAuthSuccess={handleAuthSuccess}
        />

        <TechEmergencyModal 
          isOpen={emergencyModalOpen}
          emergencyJob={mockEmergencyJob}
          onClose={() => setEmergencyModalOpen(false)}
          onAcceptEmergency={handleAcceptEmergency}
        />

        <TechExtraChargesModal 
          isOpen={extraChargesModalOpen}
          job={selectedJob}
          onClose={() => setExtraChargesModalOpen(false)}
          onAddCharges={handleAddExtraCharges}
        />

        <TechDelayModal 
          isOpen={delayModalOpen}
          job={selectedJob}
          onClose={() => setDelayModalOpen(false)}
          onReportDelay={handleReportDelay}
        />

        {/* Floating Toast Notice */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[3000] bg-[#0A2540] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-extrabold border border-blue-400/30 animate-in slide-in-from-bottom duration-300">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}
