'use client';
import { useState } from 'react';
import { 
  User, 
  Phone, 
  Wrench, 
  Briefcase, 
  MapPin, 
  Camera, 
  CheckCircle2, 
  Save, 
  Star, 
  Clock, 
  ShieldAlert, 
  TrendingUp,
  XCircle,
  Sparkles
} from 'lucide-react';

export default function TechProfile({ 
  availability = 'ONLINE', 
  onToggleAvailability,
  currentUser,
  onUpdateProfile
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || 'Alex Vance',
    phone: currentUser?.phone || '555-0199',
    email: currentUser?.email || 'alex.vance@fixmate.io',
    specialization: currentUser?.specialization || 'Master Plumber',
    experienceYears: currentUser?.experienceYears || '8',
    workingArea: currentUser?.workingArea || 'Downtown Sector',
    avatarUrl: currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setSavedSuccess(true);
    if (onUpdateProfile) onUpdateProfile(profileData);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 antialiased max-w-5xl mx-auto">
      
      {/* Issue #15: Performance Dashboard Metrics Top Row */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A2540]">Technician Performance & Analytics Summary</h3>
            <p className="text-xs text-slate-400 font-medium">Real-time stats compiled across your completed work history</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
            Top Tier Specialist
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Jobs Today</span>
            <div className="text-xl font-black text-[#0A2540]">2 Completed</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total Completed</span>
            <div className="text-xl font-black text-emerald-600">142 Jobs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Accepted</span>
            <div className="text-xl font-black text-rose-600">18 Runs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Avg Completion</span>
            <div className="text-xl font-black text-blue-600">42 Mins</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Cancellations</span>
            <div className="text-xl font-black text-slate-500">0 Jobs</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Overall Rating</span>
            <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.92
            </div>
          </div>

        </div>
      </div>

      {/* Issue #14: Profile Management Form */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-extrabold text-[#0A2540]">Technician Profile & Duty Settings</h3>
            <p className="text-xs text-slate-400 font-medium">Maintain personal details, skills, and working coverage area</p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition-colors"
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile changes saved successfully! Updated across the platform.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Avatar Header */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <img 
                src={profileData.avatarUrl} 
                alt={profileData.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 shadow-md"
              />
            </div>

            <div>
              <h4 className="text-base font-extrabold text-[#0A2540]">{profileData.name}</h4>
              <p className="text-xs font-semibold text-slate-500">{profileData.specialization}</p>
              
              {/* Duty Toggle (Issue #11) */}
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
              />
            </div>

          </div>

          {isEditing && (
            <div className="pt-4 border-t border-slate-100 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 inline-flex"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Updates</span>
              </button>
            </div>
          )}

        </form>

      </div>

    </div>
  );
}
