import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../../lib/firebase/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, addDoc, serverTimestamp } from 'firebase/firestore';

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

  const [requests, setRequests] = useState([]);

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

  // Live Firestore subscription for Bookings & Emergency Bookings
  useEffect(() => {
    let unsubBookings = null;
    let unsubEmergency = null;
    
    let bookingsList = [];
    let emergencyList = [];
    
    const getServiceType = (docCategory, docService) => {
      const cat = (docCategory || docService || '').toLowerCase();
      if (cat.includes('plumb')) return 'Plumbing';
      if (cat.includes('elect')) return 'Electrical';
      if (cat.includes('ac_') || cat.includes('ac ') || cat.includes('hvac') || cat.includes('air conditioning')) return 'AC Maintenance';
      if (cat.includes('appliance')) return 'Appliance';
      if (cat.includes('clean')) return 'Cleaning';
      if (cat.includes('carpen')) return 'Carpentry';
      if (cat.includes('paint')) return 'Painting';
      if (cat.includes('pest')) return 'Pest Control';
      return docService || docCategory || 'Other';
    };

    const getServiceIcon = (serviceType) => {
      const s = serviceType.toLowerCase();
      if (s.includes('plumb')) return '💧';
      if (s.includes('elect')) return '⚡';
      if (s.includes('ac ') || s.includes('ac_') || s.includes('hvac') || s.includes('air conditioning') || s.includes('maintenance')) return '❄️';
      if (s.includes('appliance')) return '🧺';
      if (s.includes('clean')) return '🧹';
      if (s.includes('carpen')) return '🔨';
      if (s.includes('paint')) return '🎨';
      if (s.includes('pest')) return '🐜';
      return '🛠️';
    };

    const getServiceColor = (serviceType) => {
      const s = serviceType.toLowerCase();
      if (s.includes('plumb')) return 'bg-blue-100 text-blue-700';
      if (s.includes('elect')) return 'bg-yellow-100 text-yellow-800';
      if (s.includes('ac ') || s.includes('ac_') || s.includes('hvac') || s.includes('air conditioning') || s.includes('maintenance')) return 'bg-indigo-100 text-indigo-800';
      if (s.includes('appliance')) return 'bg-slate-200 text-slate-800';
      if (s.includes('clean')) return 'bg-emerald-100 text-emerald-800';
      if (s.includes('carpen')) return 'bg-amber-100 text-amber-800';
      if (s.includes('paint')) return 'bg-purple-100 text-purple-800';
      if (s.includes('pest')) return 'bg-red-100 text-red-800';
      return 'bg-slate-100 text-slate-700';
    };

    const processLists = () => {
      const combined = [];
      
      const mapItem = (d, isEmergency) => {
        const data = d.data();
        const rawStatus = data.status || (isEmergency ? 'Emergency Pending' : 'Pending');
        
        let status = 'UNASSIGNED';
        const s = rawStatus.toUpperCase();
        if (s.includes('PENDING') || s === 'UNASSIGNED') {
          status = 'UNASSIGNED';
        } else if (s.includes('COMPLETED') || s.includes('FINISHED') || s.includes('DONE')) {
          status = 'COMPLETED';
        } else if (s.includes('CANCEL')) {
          status = 'CANCELLED';
        } else if (s.includes('WAY') || s.includes('REACHED') || s.includes('START') || s.includes('PROGRESS') || s.includes('ACTIVE') || s.includes('TRANSIT')) {
          status = 'IN-PROGRESS';
        } else {
          status = 'ASSIGNED';
        }
        
        const serviceType = getServiceType(data.category, data.service);
        const customer = data.customerName || data.customerEmail || 'Customer';
        const initials = customer.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'CU';
        
        return {
          id: d.id,
          customer,
          initials,
          service: serviceType,
          status,
          rawStatus,
          location: data.address || data.location || 'Mangaluru',
          color: getServiceColor(serviceType),
          icon: getServiceIcon(serviceType),
          assignedTech: data.technicianName || data.assignedTechName || data.assignedTech || data.assignedTo || data.recommendedTech || null,
          isEmergency,
          collectionName: isEmergency ? 'emergencyBookings' : 'bookings',
          createdAt: data.createdAt
        };
      };
      
      bookingsList.forEach(item => combined.push(mapItem(item, false)));
      emergencyList.forEach(item => combined.push(mapItem(item, true)));
      jobsList.forEach(item => {
        if (!combined.some(c => c.id === item.id)) {
          combined.push(mapItem(item, false));
        }
      });
      
      // Sort by createdAt descending
      combined.sort((a, b) => {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      });
      
      setRequests(combined);
    };

    let jobsList = [];

    try {
      const bookingsRef = collection(db, 'bookings');
      unsubBookings = onSnapshot(bookingsRef, (snapshot) => {
        bookingsList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Bookings subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to bookings:', e);
    }

    try {
      const emergencyRef = collection(db, 'emergencyBookings');
      unsubEmergency = onSnapshot(emergencyRef, (snapshot) => {
        emergencyList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Emergency bookings subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to emergency bookings:', e);
    }

    let unsubJobs = null;
    try {
      const jobsRef = collection(db, 'jobs');
      unsubJobs = onSnapshot(jobsRef, (snapshot) => {
        jobsList = snapshot.docs;
        processLists();
      }, (err) => console.warn('Jobs subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to jobs:', e);
    }

    const handleStatusUpdateEvent = (e) => {
      const detail = e.detail;
      if (detail && detail.id && detail.status) {
        setRequests(prev => prev.map(r => r.id === detail.id ? { ...r, rawStatus: detail.status, status: detail.status.toUpperCase().includes('COMPLET') ? 'COMPLETED' : detail.status.toUpperCase().includes('CANCEL') ? 'CANCELLED' : detail.status.toUpperCase().includes('ASSIGN') || detail.status.toUpperCase().includes('ACCEPT') ? 'ASSIGNED' : 'IN-PROGRESS' } : r));
      }
    };
    window.addEventListener('fixmate_job_status_updated', handleStatusUpdateEvent);

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubEmergency) unsubEmergency();
      if (unsubJobs) unsubJobs();
      window.removeEventListener('fixmate_job_status_updated', handleStatusUpdateEvent);
    };
  }, []);

  // Tab 2 Metrics calculations
  const unassignedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'UNASSIGNED').length;
  }, [requests]);

  const inProgressRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length;
  }, [requests]);

  const completedRequestsCount = useMemo(() => {
    return requests.filter(r => r.status === 'COMPLETED').length;
  }, [requests]);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  };

  // Metrics States
  const activeJobsCount = useMemo(() => {
    return requests.filter(r => r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS').length;
  }, [requests]);

  const totalRequestsCount = useMemo(() => {
    return requests.length;
  }, [requests]);

  const pendingEmergenciesCount = useMemo(() => {
    const unassignedEmergencyRequests = requests.filter(r => r.isEmergency && r.status === 'UNASSIGNED');
    const emergencyDispatchItems = dispatches.filter(d => 
      (d.priority && (d.priority.includes('10') || d.priority.includes('9') || d.priority.includes('8'))) ||
      d.type === 'URGENT' || 
      d.category === 'CANCELLATION' ||
      d.isEmergency
    );

    const uniqueEmergencyIds = new Set([
      ...unassignedEmergencyRequests.map(r => r.id),
      ...emergencyDispatchItems.map(d => d.id || d.jobId)
    ]);

    return uniqueEmergencyIds.size;
  }, [requests, dispatches]);

  const emergencyRequests = useMemo(() => {
    return requests.filter(r => r.isEmergency && r.status === 'UNASSIGNED');
  }, [requests]);
  
  const [notifications, setNotifications] = useState([]);

  // Live Firestore subscription for dispatcher alerts / notifications
  useEffect(() => {
    let unsubAlerts = null;
    try {
      const alertsRef = collection(db, 'dispatcher_alerts');
      unsubAlerts = onSnapshot(alertsRef, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs.map(docSnap => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || 'System Alert',
              message: data.notes || data.message || 'No additional details.',
              time: data.time || 'Just now',
              createdAt: data.createdAt
            };
          });
          
          // Sort by createdAt descending
          list.sort((a, b) => {
            const tA = new Date(a.createdAt).getTime() || 0;
            const tB = new Date(b.createdAt).getTime() || 0;
            return tB - tA;
          });
          setNotifications(list);
        } else {
          setNotifications([]);
        }
      }, (err) => console.warn('Alerts subscription warning:', err));
    } catch (e) {
      console.warn('Error listening to dispatcher alerts:', e);
    }
    return () => {
      if (unsubAlerts) unsubAlerts();
    };
  }, []);
  


  // Dynamic real-time subscription for Urgent Broadcasts from Firebase & LocalStorage
  useEffect(() => {
    let unsubDispatches = null;
    let unsubEmergencyBookings = null;

    let firestoreDispatches = [];
    let firestoreEmergencyBookings = [];

    const syncDispatchesFeed = () => {
      const emgItems = firestoreEmergencyBookings.map(d => {
        const data = d.data();
        const isUnassigned = !data.status || data.status.toUpperCase().includes('PENDING') || data.status === 'UNASSIGNED';
        if (!isUnassigned) return null;
        return {
          id: d.id,
          title: data.title || data.serviceName || `${data.category || 'Emergency'} Service Request`,
          time: data.time || 'Live Broadcast',
          address: data.address || data.location || 'Mangaluru',
          priority: 'Priority Level 10',
          category: (data.category || data.serviceCategory || data.service || 'EMERGENCY').toUpperCase(),
          type: 'URGENT',
          icon: '⚡',
          colorClass: 'bg-rose-50 border-rose-100 hover:border-rose-300',
          iconBg: 'bg-rose-100 text-rose-600',
          recommendedTech: data.recommendedTech || data.assignedTech || 'Rajesh Kumar',
          techSpecialty: data.category || 'Emergency',
          distance: data.distance || '1.2 km away',
          price: data.price ? String(data.price) : '1499.00',
          customerName: data.customerName || data.customer || 'Customer',
          targetDispatcher: DISPATCHER_EMAIL,
          isEmergency: true
        };
      }).filter(Boolean);

      const localData = (() => {
        try { return JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]'); }
        catch(e) { return []; }
      })();

      const combined = [...firestoreDispatches, ...emgItems, ...localData];
      const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
      setDispatches(unique);
    };

    try {
      const dispatchesRef = collection(db, 'dispatches');
      unsubDispatches = onSnapshot(dispatchesRef, (snapshot) => {
        firestoreDispatches = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        syncDispatchesFeed();
      }, (err) => console.warn('Dispatches subscription warning:', err));
    } catch(err) {
      console.warn('Dispatches error:', err);
    }

    try {
      const emgRef = collection(db, 'emergencyBookings');
      unsubEmergencyBookings = onSnapshot(emgRef, (snapshot) => {
        firestoreEmergencyBookings = snapshot.docs;
        syncDispatchesFeed();
      }, (err) => console.warn('Emergency bookings subscription warning:', err));
    } catch(err) {
      console.warn('Emergency bookings error:', err);
    }

    const handleSync = () => syncDispatchesFeed();
    window.addEventListener('storage', handleSync);
    window.addEventListener('fixmate_dispatch_updated', handleSync);

    return () => {
      if (unsubDispatches) unsubDispatches();
      if (unsubEmergencyBookings) unsubEmergencyBookings();
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('fixmate_dispatch_updated', handleSync);
    };
  }, []);

  // Technicians List (Real-Time from Firestore)
  const [technicians, setTechnicians] = useState([]);

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
              assigned: data.assignedJobsCount || 0,
              travel: 1,
              status: formattedStatus,
              specialty: data.specialization || (Array.isArray(data.skills) ? data.skills.join(', ') : data.specialty) || 'Plumbing',
              zone: data.workingArea || data.serviceArea || data.zone || 'Kodialbail & Hampankatta, Mangaluru',
              phone: data.phone || data.mobile || '+91 98765 43210'
            };
          });

          setRequests(prevRequests => {
            return prevRequests;
          });

          setTechnicians(firestoreTechs);
        } else {
          setTechnicians([]);
        }
      }, (err) => console.warn('Technicians subscription warning:', err));
    } catch(err) {
      console.warn('Firestore error:', err);
    }

    return () => {
      if (unsubTechs) unsubTechs();
    };
  }, []);

  // Live Technicians (Dynamically derived from Firestore technicians and bookings)
  const liveTechnicians = useMemo(() => {
    const locations = [
      'Kodialbail, Mangaluru',
      'Hampankatta, Mangaluru',
      'Kadri, Mangaluru',
      'Bejai, Mangaluru',
      'Lalbagh, Mangaluru',
      'Kavoor, Mangaluru',
      'Urwa, Mangaluru',
      'Attavar, Mangaluru',
      'Kulshekar, Mangaluru'
    ];

    const hashStr = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };

    const onlineTechs = technicians.filter(t => t.status && t.status.toLowerCase() !== 'offline');

    return onlineTechs.map((tech) => {
      // Find active request if any
      const activeRequest = requests.find(r => 
        (r.status === 'ASSIGNED' || r.status === 'IN-PROGRESS') &&
        (
          !r.assignedTech ||
          r.assignedTech.toLowerCase() === tech.name.toLowerCase() ||
          tech.name.toLowerCase().includes(r.assignedTech.toLowerCase()) ||
          r.assignedTech.toLowerCase().includes(tech.name.toLowerCase()) ||
          onlineTechs.length === 1
        )
      );

      // Check localStorage for recent real-time status update override
      const lastStatusUpdate = (() => {
        try {
          const raw = localStorage.getItem('fixmate_last_job_status_update');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && parsed.status) return parsed.status;
          }
        } catch(e) {}
        return null;
      })();

      const currentStatus = lastStatusUpdate || activeRequest?.rawStatus || activeRequest?.status || tech.status || 'Assigned';
      const hashValue = hashStr(tech.id || tech.name);
      const isCompleted = currentStatus === 'Completed' || currentStatus === 'COMPLETED';

      // Coordinate placement in SVG grid (cx: 150-650, cy: 150-500)
      const cx = 150 + (hashValue % 500);
      const cy = 150 + ((hashValue >> 2) % 350);

      const initials = tech.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'TK';

      // Pick neighborhood from Mangaluru list based on hash
      const defaultLoc = locations[hashValue % locations.length];
      const destLoc = locations[(hashValue + 1) % locations.length];

      return {
        id: tech.id,
        name: tech.name,
        role: tech.specialty || tech.specialization || 'Technician',
        eta: (currentStatus.toLowerCase().includes('way') || currentStatus.toLowerCase().includes('assign') || currentStatus.toLowerCase().includes('accept')) ? `${5 + (hashValue % 15)} MIN` : null,
        destination: activeRequest ? activeRequest.location : destLoc,
        currentLocation: activeRequest ? activeRequest.location : defaultLoc,
        status: currentStatus,
        progress: isCompleted ? 100 : currentStatus.toLowerCase().includes('start') ? 75 : currentStatus.toLowerCase().includes('reach') ? 50 : 25,
        initials,
        cx,
        cy
      };
    });
  }, [technicians, requests]);

  const [selectedTechForStatus, setSelectedTechForStatus] = useState(null);

  const handleTechStatusChange = async (techId, newStatus) => {
    let dbStatus = 'ONLINE';
    if (newStatus === 'Service Started' || newStatus === 'Busy') {
      dbStatus = 'BUSY';
    } else if (newStatus === 'Offline') {
      dbStatus = 'OFFLINE';
    }

    try {
      const techRef = doc(db, 'technicians', techId);
      await updateDoc(techRef, { availability: dbStatus, status: dbStatus });
      showToast(`Status of technician updated to ${newStatus} in database.`);
    } catch (err) {
      console.error("Error updating technician status in database:", err);
      showToast("❌ Failed to update technician status.");
    }
    setSelectedTechForStatus(null);
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
      priority: req.isEmergency ? 'Priority Level 10' : 'Priority Level 8',
      category: req.service.toUpperCase(),
      type: req.isEmergency ? 'URGENT' : 'RESIDENTIAL',
      icon: req.icon,
      isEmergency: req.isEmergency,
      collectionName: req.collectionName,
      customerName: req.customer,
      techSpecialty: req.service
    });
  };

  const handleStartJob = async (id) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const colName = req.collectionName || (req.isEmergency ? 'emergencyBookings' : 'bookings');
    const updatePayload = {
      status: 'In Progress',
      updatedAt: new Date().toISOString()
    };
    
    try {
      await updateDoc(doc(db, colName, id), updatePayload);
      await setDoc(doc(db, 'jobs', id), { id, status: 'In Progress', updatedAt: new Date().toISOString() }, { merge: true });
      showToast(`⚡ Job ${id} is now IN-PROGRESS.`);
      
      setActivities(prev => [
        { id: Date.now(), text: `Job ${id} started`, time: 'Just now', meta: 'Status updated to IN-PROGRESS', type: 'info', dotColor: 'bg-blue-500' },
        ...prev
      ]);
    } catch (err) {
      console.error("Error starting job in Firestore:", err);
      showToast("❌ Failed to start job.");
    }
  };

  const handleCompleteJob = async (id) => {
    const req = requests.find(r => r.id === id);
    if (!req) return;
    
    const colName = req.collectionName || (req.isEmergency ? 'emergencyBookings' : 'bookings');
    const updatePayload = {
      status: 'Completed',
      updatedAt: new Date().toISOString()
    };
    
    try {
      await updateDoc(doc(db, colName, id), updatePayload);
      await setDoc(doc(db, 'jobs', id), { id, status: 'Completed', updatedAt: new Date().toISOString() }, { merge: true });
      showToast(`✅ Job ${id} marked as COMPLETED.`);
      
      setActivities(prev => [
        { id: Date.now(), text: `Job ${id} completed`, time: 'Just now', meta: 'Status updated to COMPLETED', type: 'success', dotColor: 'bg-emerald-500' },
        ...prev
      ]);
    } catch (err) {
      console.error("Error completing job in Firestore:", err);
      showToast("❌ Failed to complete job.");
    }
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

  const handleConfirmAssignment = async (techName) => {
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

    // Find if there is a corresponding booking in requests
    const requestItem = requests.find(r => r.id === assigningDispatch.id || r.id === assigningDispatch.reqId);
    const selectedTech = technicians.find(t => t.name === techName);
    const targetId = requestItem?.id || assigningDispatch.id || `JOB-${Date.now()}`;

    const jobPayload = {
      id: targetId,
      jobId: targetId,
      status: 'Assigned',
      technicianId: selectedTech?.id || selectedTech?.uid || 'tech_rajesh_kumar',
      technicianName: techName,
      assignedTechName: techName,
      technicianPhone: selectedTech?.phone || '+91 98765 43210',
      title: assigningDispatch.title || requestItem?.service || requestItem?.title || 'Service Request',
      category: assigningDispatch.category || requestItem?.service || 'Plumbing',
      location: assigningDispatch.address || assigningDispatch.location || requestItem?.location || 'Kodialbail & Hampankatta, Mangaluru',
      customerName: assigningDispatch.customerName || requestItem?.customer || 'Customer',
      customerPhone: assigningDispatch.customerPhone || requestItem?.phone || '+91 98123 45678',
      price: Number(assigningDispatch.price || requestItem?.price || 499),
      isEmergency: Boolean(assigningDispatch.priority?.includes('10') || requestItem?.isEmergency),
      description: assigningDispatch.notes || requestItem?.notes || 'Assigned by Dispatcher',
      time: assigningDispatch.time || '09:30 AM',
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      updatedAt: new Date().toISOString()
    };

    try {
      if (requestItem) {
        const colName = requestItem.collectionName || (requestItem.isEmergency ? 'emergencyBookings' : 'bookings');
        await setDoc(doc(db, colName, targetId), jobPayload, { merge: true });
      }
      await setDoc(doc(db, 'jobs', targetId), jobPayload, { merge: true });
      await setDoc(doc(db, 'bookings', targetId), jobPayload, { merge: true });

      // Save to localStorage fixmate_assigned_jobs for instant cross-tab sync
      const existingLocal = JSON.parse(localStorage.getItem('fixmate_assigned_jobs') || '[]');
      const updatedLocal = [jobPayload, ...existingLocal.filter(j => j.id !== targetId)];
      localStorage.setItem('fixmate_assigned_jobs', JSON.stringify(updatedLocal));

      // Dispatch custom events
      window.dispatchEvent(new CustomEvent('fixmate_job_assigned', { detail: jobPayload }));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));

      // Sync with backend API
      fetch('http://localhost:5000/api/bookings/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobPayload)
      }).catch(() => {});

      // Update technician's assigned jobs count in Firestore
      if (selectedTech && selectedTech.id) {
        const techRef = doc(db, 'technicians', selectedTech.id);
        await setDoc(techRef, { assignedJobsCount: (selectedTech.assigned || 0) + 1 }, { merge: true });
      }
    } catch (err) {
      console.error("Error setting assignment in Firestore/backend:", err);
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

    showToast(`✅ Successfully assigned ${techName} to ${assigningDispatch.title}!`);
    setAssigningDispatch(null);
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequestData.title || !newRequestData.address) return;

    const isEmerg = newRequestData.isEmergency;
    const categoryName = newRequestData.category === 'AC_SERVICE' ? 'AC Maintenance' : newRequestData.category === 'PLUMBING' ? 'Plumbing' : newRequestData.category === 'ELECTRICAL' ? 'Electrical' : newRequestData.category === 'CARPENTRY' ? 'Carpentry' : 'Appliance';

    const bookingData = {
      customerId: 'walk-in-dispatcher',
      customerName: 'Walk-In Request',
      customerEmail: 'dispatcher@fixmate.com',

      category: newRequestData.category.toLowerCase(),
      service: categoryName,
      price: isEmerg ? 1499 : 499,
      duration: '1-2 hrs',

      description: newRequestData.title,
      address: newRequestData.address,
      location: newRequestData.address,
      date: null,
      timeSlot: null,

      requestPreviousTechnician: false,
      isEmergency: isEmerg,

      notes: 'Created by dispatcher',
      status: isEmerg ? 'Emergency Pending' : 'Pending',

      technicianId: null,
      dispatcherId: 'dispatcher@fixmate.com',

      createdAt: serverTimestamp()
    };

    const colName = isEmerg ? 'emergencyBookings' : 'bookings';
    try {
      await addDoc(collection(db, colName), bookingData);
      showToast(`🔥 Created ${isEmerg ? 'Emergency' : 'Standard'} Request for "${newRequestData.title}" in Firestore!`);
    } catch (err) {
      console.error("Error creating request in Firestore:", err);
      showToast("❌ Failed to create request in database.");
    }

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
    socialItems,
    notifications,
    emergencyRequests
  };
}
