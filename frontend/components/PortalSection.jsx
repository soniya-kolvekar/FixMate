'use client';

export default function PortalSection({ onOpenPortal }) {
  const portals = [
    {
      id: 'customer',
      icon: '👤',
      title: 'Customer Portal',
      desc: 'Book services, track technician arrival, and manage your home maintenance history.'
    },
    {
      id: 'technician',
      icon: '🛠️',
      title: 'Technician Portal',
      desc: 'View assigned jobs, update status, and access professional resources for every task.'
    },
    {
      id: 'dispatcher',
      icon: '🗺️',
      title: 'Dispatcher Portal',
      desc: 'Coordinate schedules, optimize routes, and manage technician assignments in real-time.'
    },
    {
      id: 'admin',
      icon: '📊',
      title: 'Admin Portal',
      desc: 'Manage users, analyze service performance, and oversee overall platform operations.'
    }
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight mb-3">
            Choose Your Portal
          </h2>
          <p className="text-base text-slate-600">
            Select the portal based on your role to access your personalized dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {portals.map((portal) => (
            <div 
              key={portal.id}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-13 h-13 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-5">
                  {portal.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-2.5">
                  {portal.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-7">
                  {portal.desc}
                </p>
              </div>
              <button 
                onClick={() => onOpenPortal(portal.id)}
                className="w-full bg-[#0A2540] hover:bg-[#13395F] text-white font-bold text-sm py-3.5 rounded-md transition-colors text-center"
              >
                Go to {portal.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
