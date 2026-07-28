'use client';
import { useState } from 'react';
import { 
  Search, 
  Bell, 
  ShieldAlert, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  X,
  AlertTriangle,
  MessageSquare,
  Sparkles
} from 'lucide-react';

export default function TechHeader({ 
  title, 
  availability, 
  onToggleAvailability, 
  notifications = [], 
  onTriggerEmergency,
  searchQuery = '',
  setSearchQuery,
  onOpenAuth
}) {
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-8 py-4 sticky top-0 z-20 flex items-center justify-between gap-6 antialiased">
        
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">{title}</h2>
        </div>

        {/* Center Search Input */}
        <div className="flex items-center gap-6 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search assigned jobs, customer name, or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/90 border border-slate-200/60 rounded-full pl-10 pr-4 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all" 
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
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-5">
          
          {/* Emergency Alert Trigger Button */}
          <button 
            onClick={onTriggerEmergency}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-extrabold hover:bg-rose-100 transition-colors shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">Emergency Broadcast</span>
          </button>

          {/* Duty Status Dropdown (Issue #11) */}
          <div className="relative">
            <button 
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="flex items-center gap-2 border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm"
            >
              <span className={`w-2.5 h-2.5 rounded-full ${
                availability === 'ONLINE' || availability === 'Available'
                  ? 'bg-emerald-500' 
                  : availability === 'BUSY' || availability === 'Busy'
                    ? 'bg-amber-500' 
                    : 'bg-slate-400'
              }`}></span>
              <span>Duty: {availability}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showStatusDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                {[
                  { label: 'Available', statusKey: 'ONLINE', color: 'bg-emerald-500' },
                  { label: 'Busy', statusKey: 'BUSY', color: 'bg-amber-500' },
                  { label: 'Offline', statusKey: 'OFFLINE', color: 'bg-slate-400' }
                ].map((st) => (
                  <button
                    key={st.label}
                    onClick={() => {
                      onToggleAvailability(st.statusKey);
                      setShowStatusDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${st.color}`}></span>
                    <span>{st.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Center Trigger (Issue #13) */}
          <button 
            onClick={() => setShowNotificationDrawer(true)}
            className="relative text-slate-500 hover:text-[#0A2540] transition-colors p-1"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>

          {/* Auth Modal Trigger */}
          <button 
            onClick={() => onOpenAuth && onOpenAuth('login')}
            className="text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Sign In
          </button>
        </div>

      </header>

      {/* Technician Notification Drawer (Issue #13) */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm bg-white h-full shadow-2xl p-6 flex flex-col justify-between border-l border-slate-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-extrabold text-[#0A2540]">Notification Center</h3>
                </div>
                <button 
                  onClick={() => setShowNotificationDrawer(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-xs font-semibold text-slate-400 text-center py-8">
                    No new notifications
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <div className="flex justify-between items-start">
                        <h5 className="text-xs font-extrabold text-[#0A2540]">{n.title}</h5>
                        <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button 
                onClick={() => setShowNotificationDrawer(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors text-center"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
