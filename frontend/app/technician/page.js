'use client';
import { useState } from 'react';
import TechHeader from '../../components/technician/TechHeader';
import TechDashboard from '../../components/technician/TechDashboard';
import TechJobList from '../../components/technician/TechJobList';
import TechJobDetail from '../../components/technician/TechJobDetail';
import TechProfile from '../../components/technician/TechProfile';
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

  // Authentication & Technician Profile State (Issues #1, #2, #14)
  const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });
  const [currentUser, setCurrentUser] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@fixmate.in',
    phone: '+91 98765 43210',
    specialization: 'Master Plumber',
    experienceYears: '8',
    workingArea: 'Indiranagar & HSR, Bengaluru',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    status: 'Available'
  });

  // Daily Workload Capacity Rule (Issue #10: Max 6 assigned jobs per day)
  const MAX_DAILY_CAPACITY = 6;

  // Modals state
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [extraChargesModalOpen, setExtraChargesModalOpen] = useState(false);
  const [delayModalOpen, setDelayModalOpen] = useState(false);

  // Mock initial jobs list
  const [jobs, setJobs] = useState([
    {
      id: 'FM-9841',
      title: 'Plumbing Repair & Leak Fixing',
      tag: 'PREMIUM',
      time: '09:30 AM',
      location: '104 Indiranagar 10th Main, Bengaluru',
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
      location: '742 Bandra West, Mumbai',
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
      location: '88 Connaught Place, New Delhi',
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
      location: '482 HSR Layout Sector 3, Bengaluru',
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

  // Notifications state (Issue #13)
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Job Assigned', message: 'You have been assigned #FM-9844 in HSR Layout', time: '10 mins ago' },
    { id: 2, title: 'Dispatcher Broadcast', message: 'High service demand in Indiranagar Sector', time: '45 mins ago' }
  ]);

  // Mock Emergency Job data (Issues #5, #6)
  const mockEmergencyJob = {
    id: 'EMG-9021',
    title: 'Burst Main Pipe & Floor Flooding',
    category: 'Emergency Plumbing',
    distance: '1.2 km away',
    travelTime: '8 mins',
    customerNote: 'Water leaking heavily through living room ceiling. Need immediate main valve shutoff and repair.',
    location: '147 Jubilee Hills Road No. 36, Hyderabad',
    customerName: 'Rohan Verma',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    customerPhone: '+91 98567 89012',
    price: 1499.00,
    status: 'Accepted',
    tag: 'EMERGENCY',
    time: 'IMMEDIATE',
    isEmergency: true
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Availability Switcher (Issue #11)
  const handleToggleAvailability = (forcedStatus) => {
    if (typeof forcedStatus === 'string') {
      const formatted = forcedStatus === 'ONLINE' ? 'Available' : forcedStatus === 'BUSY' ? 'Busy' : 'Offline';
      setAvailability(formatted);
      showToast(`Duty availability updated to: ${formatted}`);
    } else {
      const next = availability === 'Available' ? 'Busy' : availability === 'Busy' ? 'Offline' : 'Available';
      setAvailability(next);
      showToast(`Duty availability updated to: ${next}`);
    }
  };

  // Checklist Progression Handler (Issue #7 & #8)
  const handleUpdateStatus = (jobId, nextStatus) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, status: nextStatus }));
    }
    
    // Auto add live notification (Issue #13)
    const newNotif = {
      id: Date.now(),
      title: 'Status Synchronized',
      message: `Job #${jobId} status updated to "${nextStatus}". Synced with Dispatcher.`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`✅ Job #${jobId} status updated to "${nextStatus}"`);
  };

  // Emergency Acceptance Handler (Issues #5, #6)
  const handleAcceptEmergency = (emgJob) => {
    const activeCount = jobs.filter(j => j.status !== 'Completed').length;
    if (activeCount >= MAX_DAILY_CAPACITY) {
      showToast(`⚠️ Daily capacity limit of ${MAX_DAILY_CAPACITY} jobs reached! Cannot accept more jobs today.`);
      setEmergencyModalOpen(false);
      return;
    }

    setJobs(prev => [emgJob, ...prev]);
    setEmergencyModalOpen(false);
    setSelectedJob(emgJob);
    
    const notif = {
      id: Date.now(),
      title: 'Emergency Job Locked',
      message: `Accepted & locked emergency assignment #${emgJob.id}!`,
      time: 'Just now'
    };
    setNotifications(prev => [notif, ...prev]);

    showToast(`🚨 Emergency Job #${emgJob.id} accepted! Locked to your account.`);
  };

  // Extra Charges Handler (Issue #9)
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

  // Delay & Cancellation Report Handler (Issue #12)
  const handleReportDelay = (jobId, reasonType, notes) => {
    showToast(`🚨 Urgent alert sent to Dispatcher for #${jobId}: "${reasonType}"`);
  };

  // Auth Handler (Issues #1, #2)
  const handleAuthSuccess = (userData, message) => {
    setCurrentUser(userData);
    showToast(message);
  };

  const getPageTitle = () => {
    if (selectedJob) return `Job Details: #${selectedJob.id}`;
    switch (activeTab) {
      case 'dashboard': return 'Technician Command Dashboard';
      case 'jobs': return 'Assigned Jobs Hub';
      case 'emergency': return 'Emergency Request Broadcasts';
      case 'performance': return 'Performance & Analytics';
      case 'profile': return 'Technician Profile & Settings';
      default: return 'Technician Portal';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex overflow-hidden antialiased">
      
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
                    <h3 className="text-xl font-black text-[#0A2540]">Active Emergency Broadcasts</h3>
                    <p className="text-xs text-slate-500 font-medium">Real-time emergency jobs assigned by Regional Dispatcher</p>
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
              <TechProfile 
                availability={availability}
                onToggleAvailability={handleToggleAvailability}
                currentUser={currentUser}
                onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
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
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        onAuthSuccess={handleAuthSuccess}
      />

      <TechEmergencyModal 
        isOpen={emergencyModalOpen}
        emergencyJob={mockEmergencyJob}
        onAccept={handleAcceptEmergency}
        onDecline={() => setEmergencyModalOpen(false)}
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

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-[#0A2540] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-extrabold animate-in slide-in-from-bottom duration-300 border border-white/10">
          <Info className="w-5 h-5 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
