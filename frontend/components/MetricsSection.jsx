'use client';

export default function MetricsSection() {
  const metrics = [
    { value: '15k+', label: 'Jobs Completed' },
    { value: '500+', label: 'Technicians' },
    { value: '98%', label: 'Satisfaction' },
    { value: '24/7', label: 'Support' }
  ];

  return (
    <section className="py-14 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {metrics.map((m, idx) => (
          <div key={idx}>
            <h3 className="text-4xl sm:text-5xl font-extrabold text-[#0A2540] tracking-tight mb-1">
              {m.value}
            </h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
