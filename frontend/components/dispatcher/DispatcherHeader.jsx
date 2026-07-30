'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Plus, ChevronDown, Bell, MessageSquare } from 'lucide-react';
import StaggeredMenu from '../technician/StaggeredMenu';

export default function DispatcherHeader({
  searchQuery,
  setSearchQuery,
  dispatcherStatus,
  setDispatcherStatus,
  showStatusDropdown,
  setShowStatusDropdown,
  onOpenNewRequest,
  showToast,
  staggeredMenuItems,
  socialItems
}) {
  return (
    <>
      {/* CSS overrides to replace "Technician Portal" with "Dispatcher Portal" in StaggeredMenu */}
      <style dangerouslySetInnerHTML={{ __html: `
        .dispatcher-menu .sm-panel-header span {
          font-size: 0 !important;
          border: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
        .dispatcher-menu .sm-panel-header span::after {
          content: "Dispatcher Portal" !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          color: #0B2545 !important;
          background-color: #E6F0FA !important;
          padding: 4px 10px !important;
          border-radius: 9999px !important;
          border: 1px solid rgba(186, 215, 233, 0.4) !important;
          display: inline-block !important;
        }
      ` }} />

      <header className="sticky top-0 z-40 h-20 w-full bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between gap-4">
          
          {/* Left Elements: 1. Brand Logo Image -> 2. Dispatcher Portal Badge -> 3. StaggeredMenu Button */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            <Link href="/" className="flex items-center overflow-visible py-1">
              <img 
                src="/assets/images/logo.png" 
                alt="FixMate Logo" 
                className="h-12 sm:h-14 md:h-15 w-auto object-contain scale-125 origin-left" 
              />
            </Link>

            <span className="inline-flex text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-regalNavy bg-mintCream px-3 py-1 rounded-full border border-powderBlue/40 whitespace-nowrap shadow-2xs">
              Dispatcher Portal
            </span>

            <StaggeredMenu
              position="left"
              items={staggeredMenuItems}
              socialItems={socialItems}
              displaySocials={true}
              displayItemNumbering={true}
              colors={['#134074', '#13315C', '#0B2545']}
              logoUrl="/assets/images/logo.png"
              menuButtonColor="#134074"
              openMenuButtonColor="#134074"
              accentColor="#134074"
              changeMenuColorOnOpen={true}
              className="dispatcher-menu"
            />
          </div>

          {/* Search Box in Header */}
          <div className="hidden md:block w-72 lg:w-96 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Booking ID, Customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50/50 hover:bg-slate-50"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 font-bold text-xs"
              >
                &times;
              </button>
            )}
          </div>

          {/* Right Action Tools: Terminal Status Dropdown, New Request Button, Notification, Chat */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            
            {/* New Request Button */}
            <button 
              onClick={onOpenNewRequest}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0A2540] hover:bg-[#13395F] text-white text-xs font-bold shadow-sm transition-all whitespace-nowrap"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Request</span>
            </button>

            {/* Terminal Status Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 border border-slate-200 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${
                  dispatcherStatus === 'Online' ? 'bg-emerald-500' : dispatcherStatus === 'Busy' ? 'bg-amber-500' : 'bg-rose-500'
                }`}></span>
                <span className="hidden sm:inline">Duty: {dispatcherStatus}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {showStatusDropdown && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200/80 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  {['Online', 'Busy', 'Offline'].map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        setDispatcherStatus(st);
                        setShowStatusDropdown(false);
                        showToast(`Status updated to: ${st}`);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
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

            {/* Notification Center Bell */}
            <button 
              onClick={() => showToast('🔔 No new unread alerts')}
              className="relative text-slate-500 hover:text-regalNavy transition-colors p-2 rounded-xl hover:bg-slate-100/60"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>

            {/* Dispatch Chat */}
            <button 
              onClick={() => showToast('💬 Opening live dispatch chat room')}
              className="text-slate-500 hover:text-regalNavy transition-colors p-2 rounded-xl hover:bg-slate-100/60"
              title="Live Dispatch Chat"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

          </div>

        </div>
      </header>
    </>
  );
}
