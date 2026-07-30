'use client';

import { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  User, 
  Phone, 
  Wrench, 
  Briefcase, 
  MapPin, 
  CheckCircle2, 
  Save, 
  Star, 
  Clock, 
  ShieldAlert, 
  TrendingUp,
  Loader2,
  Sparkles
} from 'lucide-react';

export default function TechProfile({ 
  availability = 'Available', 
  onToggleAvailability,
  currentUser,
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Rajesh Kumar',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'rajesh.kumar@fixmate.in',
    specialization: currentUser?.specialization || 'Master Plumber',
    experienceYears: currentUser?.experienceYears || '8',
    workingArea: currentUser?.workingArea || 'Kodialbail & Hampankatta, Mangaluru',
    avatarUrl: currentUser?.avatarUrl || '',
    availability: availability || 'Available'
  });

  // Real-time Firebase Sync & Dynamic Fetching
  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const targetUid = user?.uid || currentUser?.uid || 'tech_rajesh_kumar';
      const userDocRef = doc(db, 'users', targetUid);

      // Subscribe to real-time updates from Firestore
      unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const syncedData = {
            name: data.name || data.fullName || profileData.name,
            phone: data.phone || data.mobile || profileData.phone,
            email: data.email || user?.email || profileData.email,
            specialization: data.specialization || (data.skills && data.skills.join(', ')) || profileData.specialization,
            experienceYears: String(data.experienceYears || data.experience || profileData.experienceYears),
            workingArea: data.workingArea || data.serviceArea || profileData.workingArea,
            avatarUrl: data.avatarUrl || profileData.avatarUrl,
            availability: data.availability || availability || 'Available'
          };
          setProfileData(syncedData);
          if (onUpdateProfile) onUpdateProfile(syncedData);
        } else {
          // If doc doesn't exist in Firestore yet, seed initial default profile to Firebase
          const initialData = {
            name: currentUser?.name || 'Rajesh Kumar',
            phone: currentUser?.phone || '+91 98765 43210',
            email: user?.email || currentUser?.email || 'rajesh.kumar@fixmate.in',
            specialization: currentUser?.specialization || 'Master Plumber',
            experienceYears: currentUser?.experienceYears || '8',
            workingArea: currentUser?.workingArea || 'Kodialbail & Hampankatta, Mangaluru',
            avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
            availability: availability || 'Available',
            role: 'technician',
            createdAt: new Date().toISOString()
          };
          setDoc(userDocRef, initialData, { merge: true }).catch(console.error);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Firestore onSnapshot subscription warning:', error);
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribeDoc) unsubscribeDoc();
      unsubscribeAuth();
    };
  }, [currentUser]);

  // Real-time Save & Dynamic Update in Firebase
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = auth.currentUser;
      const targetUid = user?.uid || currentUser?.uid || 'tech_rajesh_kumar';
      
      const userDocRef = doc(db, 'users', targetUid);
      const techDocRef = doc(db, 'technicians', targetUid);

      const payload = {
        name: profileData.name.trim(),
        fullName: profileData.name.trim(),
        phone: profileData.phone.trim(),
        mobile: profileData.phone.trim(),
        email: profileData.email.trim(),
        specialization: profileData.specialization.trim(),
        experienceYears: profileData.experienceYears,
        experience: Number(profileData.experienceYears) || 8,
        workingArea: profileData.workingArea.trim(),
        serviceArea: profileData.workingArea.trim(),
        avatarUrl: profileData.avatarUrl,
        role: 'technician',
        updatedAt: new Date().toISOString()
      };

      // Save to both users and technicians collections in Firebase
      await setDoc(userDocRef, payload, { merge: true });
      await setDoc(techDocRef, payload, { merge: true });

      setIsEditing(false);
      setSavedSuccess(true);
      if (onUpdateProfile) onUpdateProfile(payload);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update profile in Firebase:', err);
      alert('Error updating profile in Firebase: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Real-time Dynamic Profile Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 relative">
        
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin text-regalNavy" />
            <span>Fetching real-time profile from Firebase...</span>
          </div>
        )}

        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A2540] font-heading">Technician Profile & Duty Settings</h3>
            <p className="text-xs text-slate-400 font-medium">Synced in real-time with Cloud Firestore database</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors flex items-center gap-1.5"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile changes saved & updated in Firebase Cloud Firestore!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Profile Icon Header */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#134074] text-white flex items-center justify-center border-2 border-slate-200 shadow-md">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            </div>

            <div>
              <h4 className="text-base font-extrabold text-[#0A2540]">{profileData.name}</h4>
              <p className="text-xs font-semibold text-slate-500">{profileData.specialization}</p>
              
              {/* Duty Toggle */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">Current Duty Status:</span>
                <button
                  type="button"
                  onClick={() => onToggleAvailability && onToggleAvailability()}
                  className={`px-3 py-1 rounded-lg text-[10px] font-extrabold border transition-all ${
                    availability === 'ONLINE' || availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : availability === 'BUSY' || availability === 'Busy'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  ● {availability} (Click to toggle)
                </button>
              </div>
            </div>
          </div>

          {/* Editable Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 disabled:opacity-75 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number</label>
              <input 
                type="tel"
                disabled={!isEditing}
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 disabled:opacity-75 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Service Specialization</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.specialization}
                onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 disabled:opacity-75 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Years of Experience</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.experienceYears}
                onChange={(e) => setProfileData({ ...profileData, experienceYears: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 disabled:opacity-75 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1.5">Working Coverage Zone</label>
              <input 
                type="text"
                disabled={!isEditing}
                value={profileData.workingArea}
                onChange={(e) => setProfileData({ ...profileData, workingArea: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 disabled:opacity-75 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
                placeholder="e.g. Indiranagar & HSR Layout, Bengaluru"
                required
              />
            </div>

          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 inline-flex disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Updates</span>
                  </>
                )}
              </button>
            </div>
          )}

        </form>

      </div>

    </div>
  );
}
