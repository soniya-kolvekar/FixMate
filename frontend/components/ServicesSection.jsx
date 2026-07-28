'use client';
import { useEffect, useState } from 'react';

const defaultServices = [
  { id: 'plumbing', name: 'Plumbing', price: 49, icon: '🔧' },
  { id: 'electrical', name: 'Electrical', price: 59, icon: '⚡' },
  { id: 'ac_service', name: 'AC Service', price: 69, icon: '❄️' },
  { id: 'carpentry', name: 'Carpentry', price: 79, icon: '🔨' },
  { id: 'painting', name: 'Painting', price: 149, icon: '🎨' },
  { id: 'cleaning', name: 'Cleaning', price: 89, icon: '🧹' },
  { id: 'appliances', name: 'Appliances', price: 59, icon: '⚙️' },
  { id: 'pest_control', name: 'Pest Control', price: 99, icon: '🛡️' }
];

export default function ServicesSection({ onSelectService }) {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setServices(data.data);
        }
      })
      .catch(() => {
        // Keeps default fallback list if backend is starting
      });
  }, []);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/80 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-9 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0A2540] tracking-tight mb-1.5">
                What do you need help with?
              </h2>
              <p className="text-sm text-slate-600">
                Browse our most popular categories for instant booking
              </p>
            </div>
            <a href="#services" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All Services &rsaquo;
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {services.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectService(item)}
                className="bg-slate-50 border border-slate-200/60 hover:bg-white hover:border-blue-600 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center hover:-translate-y-1 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-[#0A2540] group-hover:text-white flex items-center justify-center text-xl mb-3.5 transition-colors">
                  {item.icon}
                </div>
                <div className="font-bold text-[#0A2540] text-base mb-1">
                  {item.name}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  From ${item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
