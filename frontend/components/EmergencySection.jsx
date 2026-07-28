'use client';

export default function EmergencySection({ onOpenEmergency }) {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-gradient-to-r from-[#0A2540] to-[#061729] rounded-3xl p-10 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-xl relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3.5 tracking-tight">
              Need Immediate Assistance?
            </h2>
            <p className="text-slate-300 text-base leading-relaxed mb-8">
              Burst pipe? Electrical short? Our emergency teams are available 24/7. Average response time under 45 minutes.
            </p>
            <button 
              onClick={onOpenEmergency}
              className="inline-flex items-center gap-2.5 bg-white text-[#0A2540] hover:bg-slate-50 font-extrabold text-base px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-all"
            >
              <span>📞</span> Request Emergency Service
            </button>
          </div>
          <div className="absolute -right-8 -bottom-10 text-[200px] opacity-5 pointer-events-none select-none">
            ⚡
          </div>
        </div>
      </div>
    </section>
  );
}
