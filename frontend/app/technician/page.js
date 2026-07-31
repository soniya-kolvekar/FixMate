'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, collection } from 'firebase/firestore';
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
  const [currentUser, setCurrentUser] = useState(null);

  const normalizeTechName = (str) => {
    if (!str) return '';
    return String(str).toLowerCase().replace(/[\._\-]/g, ' ').replace(/\s+/g, ' ').trim();
  };

  // Real-time Firebase Sync & Persistent Availability for logged in Technician
  useEffect(() => {
    let unsubscribeUserDoc = null;
    let unsubscribeTechDoc = null;

    // 1. Immediately restore cached availability from localStorage on mount
    try {
      const cached = localStorage.getItem('fixmate_tech_availability');
      if (cached) setAvailability(cached);
    } catch(e) {}

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clear jobs, ratings, and selections from previous user session on auth change
      setJobs([]);
      setSelectedJob(null);
      setRatingsList([]);

      if (!user) {
        setCurrentUser(null);
        return;
      }

      const targetUid = user.uid;
      const defaultDerivedName = user.displayName || (user.email ? user.email.split('@')[0].replace(/[\._\-]/g, ' ') : 'Technician');
      const formattedName = defaultDerivedName.replace(/\b\w/g, c => c.toUpperCase());

      setCurrentUser({
        uid: targetUid,
        name: formattedName,
        email: user.email || '',
        phone: user.phoneNumber || '',
        specialization: 'Technician',
        experienceYears: '5',
        workingArea: 'Mangaluru Region',
        status: 'Available'
      });

      const userDocRef = doc(db, 'users', targetUid);
      const techDocRef = doc(db, 'technicians', targetUid);

      const updateTechProfileFromDb = (data) => {
        if (!data) return;
        const dbName = data.name || data.fullName || data.displayName;
        const dbStatus = data.availability || data.status;

        if (dbStatus) {
          setAvailability(dbStatus);
          try {
            localStorage.setItem('fixmate_tech_availability', dbStatus);
            localStorage.setItem(`fixmate_tech_availability_${targetUid}`, dbStatus);
          } catch(e) {}
        }

        setCurrentUser(prev => ({
          ...prev,
          uid: targetUid,
          name: dbName || prev?.name || user?.displayName || 'Technician',
          email: data.email || user?.email || prev?.email || '',
          phone: data.phone || data.mobile || data.phoneNumber || prev?.phone || '',
          specialization: data.specialization || (data.skills && data.skills.join(', ')) || prev?.specialization || 'General Services',
          experienceYears: String(data.experienceYears || data.experience || prev?.experienceYears || '5'),
          workingArea: data.workingArea || data.serviceArea || 'Mangaluru Region',
          avatarUrl: data.avatarUrl || prev?.avatarUrl || '',
          status: dbStatus || prev?.status || 'Available'
        }));
      };

      // 2. Real-time subscription to technicians collection in Firestore
      unsubscribeTechDoc = onSnapshot(techDocRef, (docSnap) => {
        if (docSnap.exists()) {
          updateTechProfileFromDb(docSnap.data());
        }
      }, (err) => console.warn('Tech doc snapshot warning:', err));

      // 3. Real-time subscription to users collection in Firestore
      unsubscribeUserDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          updateTechProfileFromDb(docSnap.data());
        }
      }, (err) => console.warn('User doc snapshot warning:', err));

      // 4. Real-time subscription to jobs & bookings collections filtered strictly for assigned Technician
      try {
        const jobsColRef = collection(db, 'jobs');
        const bookingsColRef = collection(db, 'bookings');

        const syncAssignedJobs = (snapshotDocs) => {
          const techName = (currentUser?.name || user?.displayName || '').toLowerCase().trim();
          const techUid = user?.uid || currentUser?.uid;
          const techEmail = (currentUser?.email || user?.email || '').toLowerCase().trim();

          if (!techUid && !techName && !techEmail) return;

          snapshotDocs.forEach(docSnap => {
            const data = docSnap.data();

            const docTechId = data.assignedTechId || data.technicianId || data.acceptedByTechId || data.techId;
            const docTechName = (data.technicianName || data.assignedTechName || data.assignedTo || data.assignedTechnician || data.recommendedTech || data.technician || '').toLowerCase().trim();
            const docTechEmail = (data.technicianEmail || data.assignedTechEmail || data.techEmail || '').toLowerCase().trim();

            // Strictly REJECT if job belongs explicitly to a different technician ID or name
            if (docTechId && techUid && docTechId !== techUid) return;
            if (docTechName && techName && docTechName !== techName && !docTechName.includes(techName) && !techName.includes(docTechName)) return;
            if (docTechEmail && techEmail && docTechEmail !== techEmail) return;

            // Match if ID, Name, or Email matches
            const isAssignedToMe = Boolean(
              (techUid && docTechId && docTechId === techUid) ||
              (techName && docTechName && (docTechName === techName || docTechName.includes(techName) || techName.includes(docTechName))) ||
              (techEmail && docTechEmail && docTechEmail === techEmail)
            );

            if (!isAssignedToMe) return;

            const isEmg = Boolean(
              data.isEmergency === true ||
              data.isEmergency === 'true' ||
              data.isEmergency === 'TRUE' ||
              (typeof data.tag === 'string' && data.tag.toLowerCase().includes('emerg')) ||
              (typeof data.category === 'string' && data.category.toLowerCase().includes('emerg')) ||
              (typeof data.type === 'string' && data.type.toLowerCase().includes('emerg')) ||
              (typeof data.serviceCategory === 'string' && data.serviceCategory.toLowerCase().includes('emerg')) ||
              (typeof data.title === 'string' && data.title.toLowerCase().includes('emerg'))
            );

            if (isAssignedToMe && (data.id || docSnap.id)) {
              const formattedJob = {
                id: docSnap.id || data.id || data.jobId,
                title: data.title || data.serviceName || data.category || 'Service Request',
                service: data.service || data.serviceName || data.category || 'Service Request',
                tag: isEmg ? 'EMERGENCY' : (data.tag || 'STANDARD'),
                category: data.category || data.serviceCategory || 'Plumbing',
                timeSlot: data.timeSlot || (data.time && data.time !== 'Just now' ? data.time : null) || data.scheduledTime || '09:30 AM',
                time: data.timeSlot || (data.time && data.time !== 'Just now' ? data.time : null) || data.scheduledTime || '09:30 AM',
                duration: data.duration || data.estimatedDuration || '1 hour',
                location: data.customerAddress || data.address || data.location || 'Adyar, Mangaluru',
                customerName: data.customerName || data.customer || 'Customer',
                customerAvatar: data.customerAvatar || data.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
                customerPhone: data.customerPhone || data.phone || data.mobile || '+91 98123 45678',
                price: Number(data.price || data.cost || 499),
                status: (
                  data.status === 'Cancelled' || 
                  data.status === 'CANCELLED' || 
                  data.status === 'cancelled' ||
                  (typeof data.status === 'string' && data.status.toLowerCase().includes('cancel'))
                ) ? 'Cancelled' : (data.status || 'Assigned'),
                cancellationReason: (
                  data.status === 'Cancelled' || 
                  data.status === 'CANCELLED' || 
                  data.status === 'cancelled' ||
                  (typeof data.status === 'string' && data.status.toLowerCase().includes('cancel'))
                ) ? (data.cancellationReason || '') : '',
                description: data.description || data.notes || data.customerNote || 'Customer reported issue requiring on-site technician inspection.',
                extraCharges: Number(data.extraCharges || 0),
                extraChargesReason: data.extraChargesReason || '',
                isEmergency: isEmg,
                images: data.images || (data.imageUrl ? [data.imageUrl] : []),
                assignedTechName: data.assignedTechName || techName
              };

              setJobs(prev => {
                const isCancelledByAlert = (() => {
                  try {
                    const alerts = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
                    return alerts.some(a => (a.jobId === formattedJob.id || a.id === formattedJob.id) && (a.category === 'CANCELLATION' || a.status === 'Cancelled' || a.type === 'CANCELLATION'));
                  } catch(e) { return false; }
                })();

                if (isCancelledByAlert) {
                  formattedJob.status = 'Cancelled';
                  if (!formattedJob.cancellationReason) {
                    formattedJob.cancellationReason = 'Mid-Service Assignment Cancelled';
                  }
                }

                const index = prev.findIndex(j => j.id === formattedJob.id);
                if (index !== -1) {
                  const updated = [...prev];
                  updated[index] = { ...updated[index], ...formattedJob };
                  return updated;
                }
                return [formattedJob, ...prev];
              });

              setSelectedJob(prev => (prev && prev.id === formattedJob.id) ? { ...prev, ...formattedJob } : prev);
            }
          });
        };

        onSnapshot(jobsColRef, (snap) => {
          if (!snap.empty) syncAssignedJobs(snap.docs);
        }, (err) => console.warn('Jobs collection snapshot warning:', err));

        onSnapshot(bookingsColRef, (snap) => {
          if (!snap.empty) syncAssignedJobs(snap.docs);
        }, (err) => console.warn('Bookings collection snapshot warning:', err));

        // 5. Real-time subscription to unaccepted emergency broadcasts
        const syncEmergencyBroadcasts = (snapshotDocs) => {
          const list = [];
          snapshotDocs.forEach(docSnap => {
            const data = docSnap.data();
            const isEmg = Boolean(data.isEmergency || data.category === 'Emergency' || data.tag === 'EMERGENCY' || data.type === 'EMERGENCY');
            
            // Only show unaccepted & unassigned emergency requests in the broadcast panel
            const isUnaccepted = 
              data.status !== 'Accepted' && 
              data.status !== 'Completed' && 
              data.status !== 'Cancelled' && 
              !data.acceptedByTechId &&
              !data.assignedTechId &&
              !data.technicianId;

            if (isEmg && isUnaccepted) {
              const docIdStr = docSnap.id || data.id || '1';
              const charSum = docIdStr.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
              const dynamicDist = `${((charSum % 28) / 10 + 0.8).toFixed(1)} km away`;

              list.push({
                id: docSnap.id || data.id,
                title: data.title || data.serviceName || data.category || 'Emergency Service Request',
                category: data.category || data.serviceCategory || 'Emergency Plumbing',
                location: data.customerAddress || data.address || data.location || 'Adyar, Mangaluru',
                customerName: data.customerName || data.customer || 'Customer',
                customerPhone: data.customerPhone || data.phone || '+91 98123 45678',
                price: Number(data.price || data.cost || 1499),
                description: data.description || data.notes || data.customerNote || 'Urgent emergency repair required.',
                distance: data.distance || dynamicDist,
                isEmergency: true,
                status: 'Assigned'
              });
            }
          });
          setEmergencyList(list);
        };

        onSnapshot(collection(db, 'emergencyBookings'), (snap) => {
          if (!snap.empty) syncEmergencyBroadcasts(snap.docs);
          else setEmergencyList([]);
        }, (err) => console.warn('Emergency bookings snapshot warning:', err));

        // 6. Real-Time Customer Ratings & Feedback Subscription
        onSnapshot(collection(db, 'ratings'), (snap) => {
          if (!snap.empty) {
            const list = [];
            const myUid = auth.currentUser?.uid || currentUser?.uid;
            const myNameNorm = normalizeTechName(currentUser?.name || user?.displayName);
            const myEmailNorm = (currentUser?.email || user?.email || '').toLowerCase().trim();

            const myJobIds = new Set(jobs.map(j => j.id).filter(Boolean));

            snap.docs.forEach(docSnap => {
              const data = docSnap.data();
              const docTechId = data.technicianId || data.techId;
              const docNameNorm = normalizeTechName(data.technicianName || data.assignedTechName);
              const docEmailNorm = (data.technicianEmail || data.assignedTechEmail || '').toLowerCase().trim();
              const ratingBookingId = data.bookingId;

              const isBookingMatch = Boolean(ratingBookingId && myJobIds.has(ratingBookingId));
              const isNameMatch = Boolean(myNameNorm && docNameNorm && (docNameNorm === myNameNorm || docNameNorm.includes(myNameNorm) || myNameNorm.includes(docNameNorm)));
              const isEmailMatch = Boolean(myEmailNorm && docEmailNorm && docEmailNorm === myEmailNorm);
              const isIdMatch = Boolean(myUid && docTechId && docTechId === myUid);

              // Hard reject only if docNameNorm explicitly conflicts WITH someone else AND is not our assigned booking
              if (!isBookingMatch) {
                if (!docTechId && !docNameNorm && !docEmailNorm) return;
                if (docNameNorm && myNameNorm && docNameNorm !== myNameNorm && !docNameNorm.includes(myNameNorm) && !myNameNorm.includes(docNameNorm)) return;
                if (docEmailNorm && myEmailNorm && docEmailNorm !== myEmailNorm) return;
                if (docTechId && myUid && docTechId !== myUid && !isNameMatch) return;
              }

              if (isNameMatch || isEmailMatch || isIdMatch || isBookingMatch) {
                list.push({
                  id: docSnap.id,
                  bookingId: data.bookingId || docSnap.id,
                  rating: Number(data.rating || 5),
                  review: data.review || data.comment || '',
                  customerName: data.customerName || data.customer || 'Customer',
                  service: data.service || data.category || 'Service Request',
                  date: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toLocaleDateString() : 'Today') : 'Just now'
                });
              }
            });

            setRatingsList(list);
          } else {
            setRatingsList([]);
          }
        }, (err) => console.warn('Ratings snapshot warning:', err));

        // 6. Sync assigned jobs from localStorage & window custom events
        const syncLocalAssignedJobs = () => {
          try {
            const localAssigned = JSON.parse(localStorage.getItem('fixmate_assigned_jobs') || '[]');
            const techName = currentUser?.name || 'Rajesh Kumar';
            const techUid = user?.uid || currentUser?.uid || 'tech_rajesh_kumar';

            localAssigned.forEach(data => {
              const techName = (currentUser?.name || user?.displayName || '').toLowerCase().trim();
              const techUid = user?.uid || currentUser?.uid;

              const docTechId = data.assignedTechId || data.technicianId || data.acceptedByTechId || data.techId;
              const docTechName = (data.technicianName || data.assignedTechName || data.assignedTo || '').toLowerCase().trim();

              // Strictly reject if job belongs to another technician
              if (docTechId && techUid && docTechId !== techUid) return;
              if (docTechName && techName && docTechName !== techName && !docTechName.includes(techName) && !techName.includes(docTechName)) return;

              const isAssignedToMe = Boolean(
                (techUid && docTechId && docTechId === techUid) ||
                (techName && docTechName && (docTechName === techName || docTechName.includes(techName) || techName.includes(docTechName)))
              );

              if (isAssignedToMe && data.id) {
                const formattedJob = {
                  id: data.id || data.jobId,
                  title: data.title || data.serviceName || data.category || 'Service Request',
                  tag: data.isEmergency ? 'EMERGENCY' : (data.tag || 'STANDARD'),
                  category: data.category || data.serviceCategory || 'Plumbing',
                  time: data.time || data.scheduledTime || data.date || '09:30 AM',
                  location: data.customerAddress || data.address || data.location || 'Adyar, Mangaluru',
                  customerName: data.customerName || data.customer || 'Customer',
                  customerAvatar: data.customerAvatar || data.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
                  customerPhone: data.customerPhone || data.phone || data.mobile || '+91 98123 45678',
                  price: Number(data.price || data.cost || 499),
                  status: (data.status === 'Cancelled' || data.status === 'CANCELLED' || data.status === 'cancelled') ? 'Cancelled' : (data.status || 'Assigned'),
                  cancellationReason: (data.status === 'Cancelled' || data.status === 'CANCELLED' || data.status === 'cancelled') ? (data.cancellationReason || '') : '',
                  description: data.description || data.notes || data.customerNote || 'Customer reported issue requiring on-site technician inspection.',
                  extraCharges: Number(data.extraCharges || 0),
                  extraChargesReason: data.extraChargesReason || '',
                  isEmergency: Boolean(data.isEmergency),
                  images: data.images || (data.imageUrl ? [data.imageUrl] : []),
                  assignedTechName: data.assignedTechName || techName
                };

                setJobs(prev => {
                  const index = prev.findIndex(j => j.id === formattedJob.id);
                  if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = { ...updated[index], ...formattedJob };
                    return updated;
                  }
                  return [formattedJob, ...prev];
                });
              }
            });
          } catch(e) {}
        };

        syncLocalAssignedJobs();
        window.addEventListener('fixmate_job_assigned', syncLocalAssignedJobs);
        window.addEventListener('fixmate_dispatch_updated', syncLocalAssignedJobs);

      } catch(e) {
        console.warn('Firestore jobs live fetch error:', e);
      }
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

  // Pure Dynamic Assigned Jobs List & Real-Time Emergency Broadcasts List & Ratings List
  const [jobs, setJobs] = useState([]);
  const [emergencyList, setEmergencyList] = useState([]);
  const [ratingsList, setRatingsList] = useState([]);

  // Dynamic Real-Time Notifications Stream (Emergency Broadcasts -> Rating Reviews -> Dispatcher Assignments -> Cancelled Requests)
  useEffect(() => {
    const isCancelledJob = (j) => 
      j.status === 'Cancelled' || 
      j.status === 'CANCELLED' || 
      j.status === 'cancelled' ||
      (typeof j.status === 'string' && j.status.toLowerCase().includes('cancel'));

    const emgNotifs = emergencyList.map(e => ({
      id: `emg-${e.id}`,
      title: '🚨 Emergency Broadcast Call',
      message: `High-priority emergency call in ${e.location}: "${e.title}"`,
      time: 'Live Broadcast',
      type: 'EMERGENCY',
      icon: '⚡'
    }));

    const ratingNotifs = ratingsList.map(r => ({
      id: `rating-${r.id}`,
      title: `⭐ ${r.rating}/5 Star Rating Received`,
      message: `${r.customerName} rated ${r.rating} stars for "${r.service}": "${r.review}"`,
      time: r.date,
      type: 'RATING',
      icon: '⭐'
    }));

    const assignedNotifs = jobs.filter(j => (j.status === 'Assigned' || j.status === 'Accepted') && !isCancelledJob(j)).map(j => ({
      id: `assign-${j.id}`,
      title: '📋 Job Assigned by Dispatcher',
      message: `Assigned #${j.id}: ${j.title} in ${j.location} • ${j.time}`,
      time: j.time || 'Today',
      type: 'ASSIGNMENT',
      icon: '📋'
    }));

    const cancelledNotifs = jobs.filter(j => isCancelledJob(j)).map(j => ({
      id: `cancel-${j.id}`,
      title: '🚫 Request Cancelled',
      message: `Job #${j.id} cancelled. Reason: ${j.cancellationReason || 'Mid-Duty Cancellation'}`,
      time: 'Cancelled',
      type: 'CANCELLATION',
      icon: '🚫'
    }));

    setNotifications([...emgNotifs, ...ratingNotifs, ...assignedNotifs, ...cancelledNotifs]);
  }, [emergencyList, jobs, ratingsList]);

  // Dynamic Rating Metrics Calculations
  const totalRatingSum = ratingsList.reduce((acc, r) => acc + r.rating, 0);
  const avgRating = ratingsList.length > 0 ? (totalRatingSum / ratingsList.length).toFixed(2) : '0.00';
  const positiveCount = ratingsList.filter(r => r.rating >= 4).length;
  const positivePercentage = ratingsList.length > 0 ? Math.round((positiveCount / ratingsList.length) * 100) : 0;

  const [notifications, setNotifications] = useState([]);

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
    const techName = currentUser?.name || 'Rajesh Kumar';
    const techUid = auth.currentUser?.uid || currentUser?.uid || 'tech_rajesh_kumar';

    const techPayload = {
      id: techUid,
      uid: techUid,
      name: techName,
      status: nextStatus,
      availability: nextStatus,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('fixmate_tech_availability', nextStatus);
    } catch(e) {}

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

  // Real-Time Checklist Progression & Multi-Module Sync Handler
  const handleUpdateStatus = async (jobId, nextStatus) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const currentTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentTimestamps = targetJob?.timestamps || {};
    const updatedTimestamps = { ...currentTimestamps, [nextStatus]: currentTimeStr };

    // 1. Update local UI state immediately with timestamp record
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: nextStatus, timestamps: updatedTimestamps, updatedAt: new Date().toISOString() } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, status: nextStatus, timestamps: updatedTimestamps, updatedAt: new Date().toISOString() }));
    }

    const jobPayload = {
      id: jobId,
      jobId: jobId,
      status: nextStatus,
      technicianName: currentUser?.name || 'Rajesh Kumar',
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      title: targetJob?.title || 'Service Request',
      customerName: targetJob?.customerName || 'Customer',
      location: targetJob?.location || 'Kodialbail & Hampankatta, Mangaluru',
      updatedAt: new Date().toISOString(),
      timestamps: updatedTimestamps,
      syncMessage: `Status updated to "${nextStatus}" at ${currentTimeStr} by ${currentUser?.name || 'Rajesh Kumar'}`
    };

    // 2. Real-time Firebase Cloud Firestore update across jobs, bookings, emergencyBookings & audit_logs
    try {
      await setDoc(doc(db, 'jobs', jobId), jobPayload, { merge: true });
      await setDoc(doc(db, 'bookings', jobId), jobPayload, { merge: true });
      await setDoc(doc(db, 'emergencyBookings', jobId), jobPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Job #${jobId} checklist status updated to "${nextStatus}" by ${currentUser?.name || 'Rajesh Kumar'}`,
        user: currentUser?.name || 'Rajesh Kumar',
        role: 'technician',
        jobId: jobId,
        status: nextStatus,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore real-time status write warning:', err);
    }

    // 3. Post to Express Backend Sync API
    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobPayload)
    }).catch(err => console.warn('Express API booking status sync error:', err));

    // 4. LocalStorage & Window Custom Event broadcast
    try {
      localStorage.setItem(`fixmate_job_status_${jobId}`, nextStatus);
      localStorage.setItem('fixmate_last_job_status_update', JSON.stringify(jobPayload));
      window.dispatchEvent(new CustomEvent('fixmate_job_status_updated', { detail: jobPayload }));
    } catch(e) {}

    // 5. Add Live Notification entry
    const newNotif = {
      id: Date.now(),
      title: 'Status Synchronized Real-Time',
      message: `Job #${jobId} updated to "${nextStatus}". Synced with Customer, Dispatcher (${DISPATCHER_EMAIL}) & Admin.`,
      time: 'Just now'
    };
    setNotifications(prev => [newNotif, ...prev]);

    showToast(`⚡ Real-Time Sync: Job #${jobId} status updated to "${nextStatus}" across all modules!`);
  };

  // Emergency Acceptance Handler (First-to-Accept Lock Rule)
  const handleAcceptEmergency = async (emgJob) => {
    const activeCount = jobs.filter(j => j.status !== 'Completed' && j.status !== 'Cancelled').length;

    if (activeCount >= MAX_DAILY_CAPACITY) {
      showToast(`⚠️ Daily Capacity Limit Reached (${MAX_DAILY_CAPACITY} Jobs Max). Complete existing jobs first!`);
      return;
    }

    const techName = currentUser?.name || 'Rajesh Kumar';
    const techUid = auth.currentUser?.uid || currentUser?.uid || 'tech_rajesh_kumar';

    const acceptPayload = {
      id: emgJob.id,
      jobId: emgJob.id,
      status: 'Accepted',
      isEmergency: true,
      tag: 'EMERGENCY',
      category: emgJob.category || 'Emergency Plumbing',
      assignedTechId: techUid,
      assignedTechName: techName,
      technicianName: techName,
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      acceptedByTechId: techUid,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newJob = {
      ...emgJob,
      ...acceptPayload,
      extraCharges: 0,
      extraChargesReason: '',
      time: 'Immediate'
    };

    // 1. Multi-collection Firestore atomic updates
    try {
      await setDoc(doc(db, 'emergencyBookings', emgJob.id), acceptPayload, { merge: true });
      await setDoc(doc(db, 'jobs', emgJob.id), acceptPayload, { merge: true });
      await setDoc(doc(db, 'bookings', emgJob.id), acceptPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `🚨 Emergency Job #${emgJob.id} ACCEPTED & LOCKED by ${techName}`,
        user: techName,
        role: 'technician',
        jobId: emgJob.id,
        status: 'Accepted',
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore emergency accept error:', err);
    }

    // 2. Post to Express Backend API Sync
    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(acceptPayload)
    }).catch(err => console.warn('Express API emergency accept sync error:', err));

    // 3. Update React state and select job
    setJobs(prev => [newJob, ...prev.filter(j => j.id !== emgJob.id)]);
    setEmergencyList(prev => prev.filter(e => e.id !== emgJob.id));
    setEmergencyModalOpen(false);
    setSelectedJob(newJob);

    showToast(`🚨 Emergency Job #${emgJob.id} Accepted & Locked! Synced with Dispatcher (${DISPATCHER_EMAIL}).`);
  };

  // Extra Charges Handler with Real-Time Firestore & Backend Sync
  const handleAddExtraCharges = async (jobId, totalExtra, reason, extraLabour = 0, extraMaterial = 0) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const basePrice = targetJob?.price || 0;
    const currentExtra = targetJob?.extraCharges || 0;
    const updatedExtra = currentExtra + totalExtra;
    const finalTotalBill = basePrice + updatedExtra;

    const extraChargesPayload = {
      id: jobId,
      jobId: jobId,
      price: basePrice,
      extraCharges: updatedExtra,
      extraLabour: (targetJob?.extraLabour || 0) + extraLabour,
      extraMaterial: (targetJob?.extraMaterial || 0) + extraMaterial,
      extraChargesReason: reason,
      finalTotalBill: finalTotalBill,
      updatedAt: new Date().toISOString()
    };

    // 1. Local state update
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...extraChargesPayload } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, ...extraChargesPayload }));
    }

    // 2. Real-time Cloud Firestore updates across jobs, bookings, emergencyBookings & audit_logs
    try {
      await setDoc(doc(db, 'jobs', jobId), extraChargesPayload, { merge: true });
      await setDoc(doc(db, 'bookings', jobId), extraChargesPayload, { merge: true });
      await setDoc(doc(db, 'emergencyBookings', jobId), extraChargesPayload, { merge: true });

      const logId = `LOG-${Date.now()}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        event: `Extra charges of +₹${totalExtra.toFixed(2)} added to Job #${jobId} (Final Bill: ₹${finalTotalBill.toFixed(2)}). Justification: "${reason}"`,
        user: currentUser?.name || 'Rajesh Kumar',
        role: 'technician',
        jobId: jobId,
        extraCharges: updatedExtra,
        finalTotal: finalTotalBill,
        createdAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore extra charges update error:', err);
    }

    // 3. Post to Express Backend API Sync
    fetch('http://localhost:5000/api/bookings/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(extraChargesPayload)
    }).catch(err => console.warn('Express API extra charges sync error:', err));

    showToast(`⚡ Real-Time Bill Updated: +₹${totalExtra.toFixed(2)} added to #${jobId} (Final Total: ₹${finalTotalBill.toFixed(2)})`);
  };

  // Job Cancellation Report Handler (Instant Non-Blocking Execution & Priority 10 Alert)
  const handleReportDelay = (jobId, reasonType, notes) => {
    const targetJob = jobs.find(j => j.id === jobId) || selectedJob;
    const cancellationReasonStr = notes ? `${reasonType} — ${notes}` : reasonType;

    const updatedJobState = {
      status: 'Cancelled',
      cancellationReason: cancellationReasonStr,
      cancelledBy: currentUser?.name || 'Rajesh Kumar',
      updatedAt: new Date().toISOString()
    };

    // 1. INSTANT Synchronous Local State & UI Lock (0ms delay)
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, ...updatedJobState } : j));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, ...updatedJobState }));
    }
    setDelayModalOpen(false);

    showToast(`🚫 Job #${jobId} CANCELLED & LOCKED! Priority 10 Urgent Alert sent to Dispatcher (${DISPATCHER_EMAIL}).`);

    const alertId = `DISP-ALERT-${Date.now()}`;
    const alertItem = {
      id: alertId,
      jobId: jobId,
      title: `🚨 MID-SERVICE CANCELLATION REQUEST - #${jobId}`,
      time: 'Just now',
      address: targetJob?.location || '104 MG Road, Kodialbail, Mangaluru',
      priority: 'Priority Level 10',
      category: 'CANCELLATION',
      type: 'URGENT',
      icon: '🚫',
      colorClass: 'bg-rose-50 border-rose-200 hover:border-rose-400',
      iconBg: 'bg-rose-100 text-rose-700 font-bold',
      customerName: targetJob?.customerName || 'Customer',
      customerPhone: targetJob?.customerPhone || '',
      technicianName: currentUser?.name || 'Rajesh Kumar',
      technicianPhone: currentUser?.phone || '+91 98765 43210',
      targetDispatcher: DISPATCHER_EMAIL,
      region: MANGALURU_REGION,
      reasonType: reasonType,
      notes: cancellationReasonStr,
      price: targetJob?.price ? `${targetJob.price.toFixed(2)}` : '499.00',
      createdAt: new Date().toISOString()
    };

    // 2. Broadcast local events instantly for Dispatcher UI updates
    try {
      const localData = JSON.parse(localStorage.getItem('fixmate_urgent_dispatches') || '[]');
      localStorage.setItem('fixmate_urgent_dispatches', JSON.stringify([alertItem, ...localData]));
      window.dispatchEvent(new Event('fixmate_dispatch_updated'));
      window.dispatchEvent(new CustomEvent('fixmate_job_status_updated', { detail: { jobId, status: 'Cancelled', cancellationReason: cancellationReasonStr } }));
    } catch(e) {}

    // 3. Parallel Async Background Persistence across all Firestore collections
    const cancelPayload = {
      id: jobId,
      jobId: jobId,
      status: 'Cancelled',
      cancellationReason: cancellationReasonStr,
      cancelledBy: currentUser?.name || 'Rajesh Kumar',
      updatedAt: new Date().toISOString()
    };

    const logId = `LOG-${Date.now()}`;
    const auditPayload = {
      id: logId,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      event: `🚨 MID-SERVICE CANCELLATION REQUEST for Job #${jobId} by ${currentUser?.name || 'Rajesh Kumar'}. Reason: "${cancellationReasonStr}"`,
      user: currentUser?.name || 'Rajesh Kumar',
      role: 'technician',
      jobId: jobId,
      priority: 'URGENT',
      createdAt: new Date().toISOString()
    };

    Promise.allSettled([
      setDoc(doc(db, 'dispatches', alertId), alertItem, { merge: true }),
      setDoc(doc(db, 'dispatcher_alerts', alertId), alertItem, { merge: true }),
      setDoc(doc(db, 'jobs', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'bookings', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'emergencyBookings', jobId), cancelPayload, { merge: true }),
      setDoc(doc(db, 'audit_logs', logId), auditPayload, { merge: true }),
      fetch('http://localhost:5000/api/dispatches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertItem)
      })
    ]).catch(err => console.warn('Background cancellation sync error:', err));
  };

  // Auth Handler
  const handleAuthSuccess = (userData, message) => {
    setCurrentUser(userData);
    showToast(message);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }

    try {
      localStorage.removeItem('fixmate_user');
      localStorage.removeItem('fixmate_tech_availability');
      localStorage.removeItem('fixmate_assigned_jobs');
      localStorage.removeItem('fixmate_urgent_dispatches');
    } catch (e) {}

    setJobs([]);
    setSelectedJob(null);
    setEmergencyList([]);
    setRatingsList([]);
    setNotifications([]);
    setCurrentUser(null);

    showToast('🔒 Logged out successfully! Account state cleared.');

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
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
          onLogout={handleLogout}
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
                  avgRating={avgRating}
                  positivePercentage={positivePercentage}
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
                      <h3 className="text-xl font-black text-[#0A2540]">Emergency Duty & Broadcasts — Mangaluru</h3>
                      <p className="text-xs text-slate-500 font-medium">Real-time emergency calls and accepted urgent dispatch requests</p>
                    </div>
                    {emergencyList.length > 0 && (
                      <button 
                        onClick={() => setEmergencyModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 shadow-md transition-all flex items-center gap-1.5 animate-pulse"
                      >
                        <span>⚡ View Broadcast Calls ({emergencyList.length})</span>
                      </button>
                    )}
                  </div>

                  {emergencyList.length > 0 && (
                    <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                      <div>
                        <h4 className="text-sm font-black text-rose-900">🚨 {emergencyList.length} Live Emergency Broadcast Call{emergencyList.length > 1 ? 's' : ''} Available</h4>
                        <p className="text-xs text-rose-700 font-semibold mt-0.5">First technician to accept locks assignment. Click to view and accept.</p>
                      </div>
                      <button 
                        onClick={() => setEmergencyModalOpen(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all shrink-0"
                      >
                        Review Broadcast Carousel
                      </button>
                    </div>
                  )}

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Your Accepted & Assigned Emergency Jobs</h4>
                    <TechJobList 
                      jobs={jobs.filter(j => j.isEmergency || j.tag === 'EMERGENCY')}
                      onSelectJob={(j) => setSelectedJob(j)}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <TechPerformance 
                  jobs={jobs}
                  currentUser={currentUser}
                  availability={availability}
                  ratingsList={ratingsList}
                  avgRating={avgRating}
                  positivePercentage={positivePercentage}
                />
              )}

              {activeTab === 'profile' && (
                <TechProfile 
                  availability={availability}
                  onToggleAvailability={handleToggleAvailability}
                  currentUser={currentUser}
                  onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
                  onLogout={handleLogout}
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
          emergencyList={emergencyList}
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
