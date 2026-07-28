'use client';
import { useEffect, useState } from 'react';

export default function PortalModal({ isOpen, initialRole, onClose }) {
  const [activeRole, setActiveRole] = useState(initialRole || 'customer');
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialRole) setActiveRole(initialRole);
  }, [initialRole]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/portals/${activeRole}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.portal) {
          setPortalData(data.portal);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [isOpen, activeRole]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-slate-50 px-7 py-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#0A2540]">
            FixMate Dashboard Preview
          </h3>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-[#0A2540]">&times;</button>
        </div>

        <div className="p-7">
          <div className="flex gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
            {['customer', 'technician', 'dispatcher', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-colors ${
                  activeRole === role ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            {loading ? (
              <div className="text-center py-8 text-sm font-bold text-slate-500">Loading Dashboard...</div>
            ) : portalData ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-300 mb-4">
                  <div>
                    <h4 className="text-lg font-extrabold text-[#0A2540]">{portalData.title}</h4>
                    <p className="text-xs text-slate-500">{portalData.technicianName || portalData.role}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {portalData.activeBooking?.status || 'Active'}
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-lg border border-slate-200 mb-4 flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#0A2540]">System Status</span>
                  <span className="font-bold text-emerald-600">● Operational</span>
                </div>

                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Live Portal Features</div>
                <div className="space-y-2.5">
                  {(portalData.assignedJobs || portalData.history || portalData.routes || []).map((item, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 flex justify-between items-center">
                      <div>
                        <div className="font-bold text-sm text-[#0A2540]">{item.service || item.customer || item.zone}</div>
                        <div className="text-xs text-slate-500">{item.address || item.date || item.techCount + ' Techs'} • {item.price || item.cost || item.status}</div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600">
                        {item.status || 'Verified'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
