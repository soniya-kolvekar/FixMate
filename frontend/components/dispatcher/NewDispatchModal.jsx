'use client';

import React from 'react';

export default function NewDispatchModal({
  isNewRequestOpen,
  setIsNewRequestOpen,
  newRequestData,
  setNewRequestData,
  handleCreateRequest
}) {
  if (!isNewRequestOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#0A2540]">Create Dispatch Ticket</h3>
          <button 
            onClick={() => setIsNewRequestOpen(false)} 
            className="text-2xl text-slate-400 hover:text-[#0A2540] font-light leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleCreateRequest} className="p-6 space-y-4 text-xs font-semibold text-slate-700">
          
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Issue / Description</label>
            <input 
              type="text" 
              value={newRequestData.title}
              onChange={(e) => setNewRequestData({ ...newRequestData, title: e.target.value })}
              placeholder="e.g. Toilet Overflowing, Short Circuit in kitchen" 
              className="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600" 
              required 
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Site Address</label>
            <input 
              type="text" 
              value={newRequestData.address}
              onChange={(e) => setNewRequestData({ ...newRequestData, address: e.target.value })}
              placeholder="Street Address, Apt / Suite, City" 
              className="w-full p-3 rounded-lg border border-slate-300 text-xs font-medium focus:outline-none focus:border-blue-600" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Trade Category</label>
              <select 
                value={newRequestData.category}
                onChange={(e) => setNewRequestData({ ...newRequestData, category: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-650"
              >
                <option value="PLUMBING">🔧 PLUMBING</option>
                <option value="ELECTRICAL">⚡ ELECTRICAL</option>
                <option value="AC_SERVICE">❄️ AC SERVICE</option>
                <option value="CARPENTRY">🔨 CARPENTRY</option>
                <option value="CLEANING">🧹 CLEANING</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Service Type</label>
              <select 
                value={newRequestData.type}
                onChange={(e) => setNewRequestData({ ...newRequestData, type: e.target.value })}
                className="w-full p-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-650"
              >
                <option value="RESIDENTIAL">RESIDENTIAL</option>
                <option value="COMMERCIAL">COMMERCIAL</option>
                <option value="URGENT">URGENT</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-150 mt-3">
            <input 
              type="checkbox"
              id="isEmergency"
              checked={newRequestData.isEmergency}
              onChange={(e) => setNewRequestData({ ...newRequestData, isEmergency: e.target.checked })}
              className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="isEmergency" className="cursor-pointer select-none">
              <span className="block text-slate-800 font-extrabold">Emergency Dispatch</span>
              <span className="block text-[10px] text-slate-400 font-medium">Flags as priority level 10 and places in Urgent Broadcast feed</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button 
              type="button"
              onClick={() => setIsNewRequestOpen(false)}
              className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-750 text-white rounded-lg font-bold shadow-sm transition-colors"
            >
              Submit Ticket
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
