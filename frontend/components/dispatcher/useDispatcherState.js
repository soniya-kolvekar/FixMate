import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function useDispatcherState() {
  const router = useRouter();
  
  // Single Dispatcher Email (Demo Scale)
  const DISPATCHER_EMAIL = 'dispatcher@fixmate.com';
  
  // Dashboard Status State
  const [dispatcherStatus, setDispatcherStatus] = useState('Online');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, requests, technicians, map, logs

  // Service Requests specific states
  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [requests, setRequests] = useState([
    { id: '#RQ-9082', customer: 'Alice Montgomery', service: 'Plumbing', status: 'UNASSIGNED', location: 'Oak Ridge, Sector 4', initials: 'AM', color: 'bg-blue-105 text-blue-700', icon: '💧' },
    { id: '#RQ-9079', customer: 'Robert Kovich', service: 'AC Maintenance', status: 'ASSIGNED', location: 'Downtown, Maple Ave', initials: 'RK', color: 'bg-indigo-900 text-white', icon: '❄️' },
    { id: '#RQ-9077', customer: 'James Wilson', service: 'Electrical', status: 'IN-PROGRESS', location: 'Westside, Park Lane', initials: 'JW', color: 'bg-blue-950 text-white', icon: '⚡' },
    { id: '#RQ-9075', customer: 'Elena Lopez', service: 'Appliance', status: 'UNASSIGNED', location: 'North View Dr.', initials: 'EL', color: 'bg-slate-200 text-slate-700', icon: '🧺' },
    { id: '#RQ-9074', customer: 'Bill Hader', service: 'Plumbing', status: 'IN-PROGRESS', location: 'Lake Crescent 10', initials: 'BH', color: 'bg-sky-100 text-sky-700', icon: '💧' },
    { id: '#RQ-9073', customer: 'Sarah Connor', service: 'AC Maintenance', status: 'COMPLETED', location: 'Tech Plaza, Sec 2', initials: 'SC', color: 'bg-indigo-100 text-indigo-800', icon: '❄️' },
    { id: '#RQ-9072', customer: 'John Connor', service: 'Appliance', status: 'COMPLETED', location: 'Sunset Blvd 14', initials: 'JC', color: 'bg-slate-200 text-slate-800', icon: '🧺' },
    { id: '#RQ-9071', customer: 'Clara Oswald', service: 'Cleaning', status: 'UNASSIGNED', location: 'Gallifrey Lane 1', initials: 'CO', color: 'bg-emerald-100 text-emerald-800', icon: '🧹' },
    { id: '#RQ-9070', customer: 'Rose Tyler', service: 'Electrical', status: 'ASSIGNED', location: 'Bad Wolf St. 9', initials: 'RT', color: 'bg-blue-900 text-white', icon: '⚡' },
    { id: '#RQ-9069', customer: 'Martha Jones', service: 'Plumbing', status: 'IN-PROGRESS', location: 'Harrow Hospital', initials: 'MJ', color: 'bg-blue-50 text-blue-800', icon: '💧' },
    { id: '#RQ-9068', customer: 'Donna Noble', service: 'Cleaning', status: 'COMPLETED', location: 'Chiswick Avenue', initials: 'DN', color: 'bg-emerald-50 text-emerald-700', icon: '🧹' },
    { id: '#RQ-9067', customer: 'Amy Pond', service: 'Appliance', status: 'COMPLETED', location: 'Leadworth Drive', initials: 'AP', color: 'bg-slate-300 text-slate-800', icon: '🧺' },
    { id: '#RQ-9066', customer: 'Rory Williams', service: 'Plumbing', status: 'UNASSIGNED', location: 'Leadworth Drive', initials: 'RW', color: 'bg-blue-100 text-blue-700', icon: '💧' }
  ]);

  // Tab 2 Metrics calculations
  const unassignedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'UNASSIGNED').length + 8;
  }, [requests]);

  const inProgressRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length + 43;
  }, [requests]);

  const completedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'COMPLETED').length + 152;
  }, [requests]);
  
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
      title: 'Main Pipe Burst & Floor Flooding', 
      time: '4 mins ago', 
      address: '1204 Oak Ridge Dr, Sector 4', 
      priority: 'Priority Level 10', 
      category: 'PLUMBING', 
      type: 'RESIDENTIAL', 
      icon: '💧', 
      colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300', 
      iconBg: 'bg-rose-100 text-rose-600',
      recommendedTech: 'Dave R.',
      techSpecialty: 'Plumbing',
      distance: '1.2 km away',
      price: '1499.00',
      customerName: 'Priya Sharma',
      targetDispatcher: DISPATCHER_EMAIL
    },
    { 
      id: 'DISP-4821', 
      title: 'Full Power Loss & Sparking Panel', 
      time: '12 mins ago', 
      address: '88 Skyway Ave, Suite 402', 
      priority: 'Priority Level 8', 
      category: 'ELECTRICAL', 
      type: 'URGENT', 
      icon: '⚡', 
      colorClass: 'bg-blue-50 border-blue-100 hover:border-blue-300', 
      iconBg: 'bg-blue-100 text-blue-600',
      recommendedTech: 'Sarah J.',
      techSpecialty: 'Electrical',
      distance: '2.4 km away',
      price: '1199.00',
      customerName: 'Robert Kovich',
      targetDispatcher: DISPATCHER_EMAIL
    },
    { 
      id: 'DISP-4822', 
      title: 'AC Compressor Failure & Smoke', 
      time: '18 mins ago', 
      address: '742 Bandra West, Sec 3', 
      priority: 'Priority Level 9', 
      category: 'HVAC', 
      type: 'URGENT', 
      icon: '❄️', 
      colorClass: 'bg-amber-50 border-amber-100 hover:border-amber-300', 
      iconBg: 'bg-amber-100 text-amber-600',
      recommendedTech: 'Mike T.',
      techSpecialty: 'HVAC',
      distance: '3.1 km away',
      price: '1299.00',
      customerName: 'Aarav Mehta',
      targetDispatcher: DISPATCHER_EMAIL
    }
  ]);

  // Dynamic fetching of Urgent Broadcasts from API, Firestore & LocalStorage
  const fetchDispatches = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/dispatches');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const localData = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
        const combined = [...localData, ...data.data];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
        setDispatches(unique);
        const emergencies = unique.filter(d => (d.priority && d.priority.includes('10')) || d.type === 'URGENT' || d.category === 'CANCELLATION').length;
        setPendingEmergenciesCount(emergencies);
        return;
      }
    } catch (e) {
      const localData = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      if (localData.length > 0) {
        setDispatches(localData);
      }
    }
  };

  useEffect(() => {
    let unsubFirestore = null;
    try {
      const dispatchesRef = collection(db, 'dispatches');
      unsubFirestore = onSnapshot(dispatchesRef, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          setDispatches(prev => {
            const combined = [...firestoreItems, ...prev];
            const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
            return unique;
          });
          const emergencies = firestoreItems.filter(d => (d.priority && d.priority.includes('10')) || d.type === 'URGENT' || d.category === 'CANCELLATION').length;
          setPendingEmergenciesCount(prev => Math.max(prev, emergencies));

          // Toast alert for newly arrived cancellation / delay alert
          const latestAlert = firestoreItems[0];
          if (latestAlert && latestAlert.reasonType) {
            showToast(`🚨 REAL-TIME ALERT (${latestAlert.reasonType}): Technician reported issue on #${latestAlert.jobId || latestAlert.id}!`);
          }
        }
      }, (err) => {
        console.warn('Firestore subscription warning:', err);
      });
    } catch(err) {
      console.warn('Firestore error:', err);
    }

    fetchDispatches();
    const interval = setInterval(fetchDispatches, 2500);
    const handleSync = () => fetchDispatches();

    window.addEventListener('storage', handleSync);
    window.addEventListener('fixmate_dispatch_updated', handleSync);

    return () => {
      if (unsubFirestore) unsubFirestore();
      clearInterval(interval);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fixmate_dispatch_updated', handleSync);
    };
  }, []);

  // Technicians List
  const [technicians, setTechnicians] = useState([
    { name: 'Rajesh Kumar', assigned: 2, travel: 1, status: 'Available', specialty: 'Plumbing', zone: 'Indiranagar & HSR, Bengaluru' },
    { name: 'Dave R.', assigned: 4, travel: 2, status: 'Available', specialty: 'Plumbing', zone: 'North Metro' },
    { name: 'Sarah J.', assigned: 3, travel: 4, status: 'Available', specialty: 'Electrical', zone: 'Downtown Sector' },
    { name: 'Mike T.', assigned: 5, travel: 1, status: 'Busy', specialty: 'HVAC', zone: 'Downtown Sector' },
    { name: 'Elena K.', assigned: 2, travel: 3, status: 'Available', specialty: 'Carpentry', zone: 'South Suburbs' },
    { name: 'James L.', assigned: 1, travel: 1, status: 'Offline', specialty: 'Appliance Repair', zone: 'West District' }
  ]);

  // Live Firestore subscription for Technicians Roster & Real-Time Availability Status
  useEffect(() => {
    let unsubTechs = null;
    try {
      const techsRef = collection(db, 'technicians');
      unsubTechs = onSnapshot(techsRef, (snapshot) => {
        if (!snapshot.empty) {
          const firestoreTechs = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            const rawStatus = data.availability || data.status || 'Available';
            const formattedStatus = rawStatus === 'ONLINE' ? 'Available' : rawStatus === 'BUSY' ? 'Busy' : rawStatus;
            return {
              id: docSnap.id,
              name: data.name || data.fullName || 'Rajesh Kumar',
              assigned: data.assignedJobsCount || 2,
              travel: 1,
              status: formattedStatus,
              specialty: data.specialization || (Array.isArray(data.skills) ? data.skills.join(', ') : data.specialty) || 'Plumbing',
              zone: data.workingArea || data.serviceArea || data.zone || 'Indiranagar & HSR, Bengaluru'
            };
          });

          setTechnicians(prev => {
            const map = new Map();
            firestoreTechs.forEach(t => map.set(t.name, t));
            prev.forEach(t => {
              if (!map.has(t.name)) {
                map.set(t.name, t);
              }
            });
            return Array.from(map.values());
          });
        }
      }, (err) => console.warn('Technicians subscription warning:', err));
    } catch(err) {
      console.warn('Firestore error:', err);
    }

    return () => {
      if (unsubTechs) unsubTechs();
    };
  }, []);

  // Live Technicians (Hyderabad Sector Fleet)
  const [liveTechnicians, setLiveTechnicians] = useState([
    { id: 't1', name: 'Marcus Chen', role: 'HVAC Specialist', eta: '8 MIN', destination: '442 Jubilee Hills Rd, Hyderabad', currentLocation: 'Road No. 36, Jubilee Hills, Hyderabad', status: 'On the Way', progress: null, initials: 'MC', cx: 300, cy: 200 },
    { id: 't2', name: 'Sarah Jenkins', role: 'Plumbing Lead', eta: '14 MIN', destination: '1290 Banjara Hills, Hyderabad', currentLocation: 'Panjagutta Junction, Hyderabad', status: 'On the Way', progress: null, initials: 'SJ', cx: 150, cy: 350 },
    { id: 't3', name: 'David Wilson', role: 'Electrician', eta: null, destination: 'Cyber Towers, Hitec City, Hyderabad', currentLocation: 'Mindspace IT Park, Hitec City, Hyderabad', status: 'Service Started', progress: 65, initials: 'DW', cx: 450, cy: 280 }
  ]);

  const [selectedTechForStatus, setSelectedTechForStatus] = useState(null);

  const handleTechStatusChange = (techId, newStatus) => {
    setLiveTechnicians(prev => prev.map(t => {
      if (t.id === techId) {
        let newProgress = t.progress;
        if (newStatus === 'Service Started' && !newProgress) newProgress = 10;
        if (newStatus === 'Service Completed') newProgress = 100;
        return { ...t, status: newStatus, progress: newProgress };
      }
      return t;
    }));
    setSelectedTechForStatus(null);
    showToast(`Status updated to ${newStatus}`);
  };

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
      text: 'New emergency plumbing request from Sector 4', 
      time: '35 mins ago', 
      meta: 'Unassigned', 
      type: 'warning', 
      dotColor: 'bg-rose-500' 
    }
  ]);

  // All logs database
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

  // Service Requests Filters & Pagination
  const filteredRequests = useMemo(() => {
    const statusPriority = { 'UNASSIGNED': 1, 'ASSIGNED': 2, 'IN-PROGRESS': 3, 'COMPLETED': 4 };
    return requests
      .filter(req => {
        if (selectedServiceType !== 'All' && req.service !== selectedServiceType) {
          return false;
        }
        if (selectedStatus !== 'All' && req.status !== selectedStatus) {
          return false;
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesId = req.id.toLowerCase().includes(query);
          const matchesCustomer = req.customer.toLowerCase().includes(query);
          const matchesLocation = req.location.toLowerCase().includes(query);
          if (!matchesId && !matchesCustomer && !matchesLocation) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5));
  }, [requests, selectedServiceType, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const handleServiceTypeChange = (val) => {
    setSelectedServiceType(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val) => {
    setSelectedStatus(val);
    setCurrentPage(1);
  };

  const handleOpenAssignFromTable = (req) => {
    setAssigningDispatch({
      id: req.id,
      reqId: req.id,
      title: `${req.service} request`,
      time: 'Just now',
      address: req.location,
      priority: 'Priority Level 8',
      category: req.service.toUpperCase(),
      type: 'RESIDENTIAL',
      icon: req.icon
    });
  };

  const handleStartJob = (id) => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'IN-PROGRESS' };
      }
      return r;
    }));
    showToast(`⚡ Job ${id} is now IN-PROGRESS.`);
    setActivities(prev => [
      { id: Date.now(), text: `Job ${id} started`, time: 'Just now', meta: 'Status updated to IN-PROGRESS', type: 'info', dotColor: 'bg-blue-500' },
      ...prev
    ]);
  };

  const handleCompleteJob = (id) => {
    setRequests(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, status: 'COMPLETED' };
      }
      return r;
    }));
    showToast(`✅ Job ${id} marked as COMPLETED.`);
    setActivities(prev => [
      { id: Date.now(), text: `Job ${id} completed`, time: 'Just now', meta: 'Status updated to COMPLETED', type: 'success', dotColor: 'bg-emerald-500' },
      ...prev
    ]);
    setActiveJobsCount(prev => Math.max(0, prev - 1));
  };

  const handleExportCSV = () => {
    const csvRows = [
      ['Request ID', 'Customer', 'Service Type', 'Status', 'Location'],
      ...filteredRequests.map(r => [r.id, r.customer, r.service, r.status, r.location])
    ];
    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `service_requests_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📈 Exported requests to CSV successfully!');
  };

  const handleOpenAssign = (dispatch) => {
    setAssigningDispatch(dispatch);
  };

  const handleConfirmAssignment = (techName) => {
    if (!assigningDispatch) return;

    const dispatchId = assigningDispatch.id;
    setDispatches(prev => prev.filter(d => d.id !== dispatchId));
    
    // Sync with backend & localStorage
    fetch(`http://localhost:5000/api/dispatches/${dispatchId}`, { method: 'DELETE' }).catch(() => {});
    try {
      const local = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      const updated = local.filter(d => d.id !== dispatchId);
      localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify(updated));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));
    } catch(e) {}

    setRequests(prev => prev.map(r => {
      if (r.id === assigningDispatch.id || r.id === assigningDispatch.reqId) {
        return { ...r, status: 'ASSIGNED', assignedTech: techName };
      }
      return r;
    }));

    setActiveJobsCount(prev => prev + 1);
    if (assigningDispatch.priority.includes('10') || assigningDispatch.type === 'URGENT') {
      setPendingEmergenciesCount(prev => Math.max(0, prev - 1));
    }

    const newActivity = {
      id: Date.now(),
      text: `${assigningDispatch.title} assigned to ${techName}`,
      time: 'Just now',
      meta: `${assigningDispatch.category} • Assigned by Sarah Jenkins`,
      type: 'info',
      dotColor: 'bg-blue-600'
    };
    setActivities(prev => [newActivity, ...prev]);

    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `${assigningDispatch.title} assigned to ${techName}`, user: 'Sarah Jenkins' },
      ...prev
    ]);

    setTechnicians(prev => prev.map(t => {
      if (t.name === techName) {
        return { ...t, assigned: t.assigned + 1 };
      }
      return t;
    }));

    showToast(`✅ Successfully assigned ${techName} to ${assigningDispatch.title}!`);
    setAssigningDispatch(null);
  };

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

      fetch('http://localhost:5000/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDispatchItem)
      }).catch(() => {});

      try {
        const local = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
        localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify([newDispatchItem, ...local]));
        window.dispatchEvent(new Event('fixmate_dispatch_updated'));
      } catch(e) {}
    } else {
      showToast(`Created Standard Request for ${newRequestData.title}. Logged in Requests tab.`);
    }

    setTotalRequestsCount(prev => prev + 1);

    const categoryName = newRequestData.category === 'AC_SERVICE' ? 'AC Maintenance' : newRequestData.category === 'PLUMBING' ? 'Plumbing' : newRequestData.category === 'ELECTRICAL' ? 'Electrical' : newRequestData.category === 'CARPENTRY' ? 'Carpentry' : 'Appliance';
    const categoryIcon = newRequestData.category === 'AC_SERVICE' ? '❄️' : newRequestData.category === 'PLUMBING' ? '💧' : newRequestData.category === 'ELECTRICAL' ? '⚡' : newRequestData.category === 'CARPENTRY' ? '🔨' : '🧺';
    const initialsLetters = newRequestData.title.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'RQ';
    
    const newReqItem = {
      id: `#RQ-${Math.floor(9000 + Math.random() * 80)}`,
      customer: 'Walk-In Request',
      service: categoryName,
      status: isEmerg ? 'UNASSIGNED' : 'ASSIGNED',
      location: newRequestData.address,
      initials: initialsLetters,
      color: 'bg-slate-100 text-slate-700',
      icon: categoryIcon
    };
    setRequests(prev => [newReqItem, ...prev]);
    
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

    setLogs(prev => [
      { timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), event: `New dispatch created: ${newRequestData.title}`, user: 'Sarah Jenkins' },
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

  const staggeredMenuItems = [
    { label: 'Dashboard', ariaLabel: 'Dispatcher Dashboard', onClick: () => setActiveTab('dashboard') },
    { label: 'Requests', ariaLabel: 'View service requests', onClick: () => setActiveTab('requests') },
    { label: 'Technicians', ariaLabel: 'Manage technicians', onClick: () => setActiveTab('technicians') },
    { label: 'Live Map', ariaLabel: 'Live dispatch map', onClick: () => setActiveTab('map') },
    { label: 'Logs', ariaLabel: 'System logs', onClick: () => setActiveTab('logs') },
    { label: 'Main Home Platform', ariaLabel: 'Return to home landing page', link: '/' }
  ];

  const socialItems = [
    { label: 'New Request', onClick: () => setIsNewRequestOpen(true) },
    { label: 'Main Website', link: '/' }
  ];

  return {
    router,
    dispatcherStatus,
    setDispatcherStatus,
    showStatusDropdown,
    setShowStatusDropdown,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    selectedServiceType,
    selectedStatus,
    currentPage,
    setCurrentPage,
    unassignedRequestsCount,
    inProgressRequestsCount,
    completedRequestsCount,
    toast,
    showToast,
    activeJobsCount,
    totalRequestsCount,
    pendingEmergenciesCount,
    dispatches,
    technicians,
    liveTechnicians,
    selectedTechForStatus,
    setSelectedTechForStatus,
    handleTechStatusChange,
    logs,
    setLogs,
    isNewRequestOpen,
    setIsNewRequestOpen,
    newRequestData,
    setNewRequestData,
    assigningDispatch,
    setAssigningDispatch,
    isMapExpanded,
    setIsMapExpanded,
    filteredActivities,
    filteredTechnicians,
    filteredRequests,
    totalPages,
    paginatedRequests,
    handleServiceTypeChange,
    handleStatusChange,
    handleOpenAssignFromTable,
    handleStartJob,
    handleCompleteJob,
    handleExportCSV,
    handleOpenAssign,
    handleConfirmAssignment,
    handleCreateRequest,
    staggeredMenuItems,
    socialItems
  };
}
