'use client';
import { useEffect, useState } from 'react';
import { Wrench, Zap, Snowflake, Hammer, Paintbrush, Sparkles, Cog, ShieldCheck } from 'lucide-react';

const serviceIcons = {
  plumbing: Wrench,
  electrical: Zap,
  ac_service: Snowflake,
  carpentry: Hammer,
  painting: Paintbrush,
  cleaning: Sparkles,
  appliances: Cog,
  pest_control: ShieldCheck
};

const defaultServices = [
  { id: 'plumbing', name: 'Plumbing', price: 499, icon: 'plumbing' },
  { id: 'electrical', name: 'Electrical', price: 599, icon: 'electrical' },
  { id: 'ac_service', name: 'AC Service', price: 699, icon: 'ac_service' },
  { id: 'carpentry', name: 'Carpentry', price: 799, icon: 'carpentry' },
  { id: 'painting', name: 'Painting', price: 1499, icon: 'painting' },
  { id: 'cleaning', name: 'Cleaning', price: 899, icon: 'cleaning' },
  { id: 'appliances', name: 'Appliances', price: 599, icon: 'appliances' },
  { id: 'pest_control', name: 'Pest Control', price: 999, icon: 'pest_control' }
];

export default function ServicesSection({ onSelectService }) {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    fetch('http://localhost:5000/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          const adapted = data.data.map(s => ({
            ...s,
            price: s.price < 200 ? s.price * 10 : s.price
          }));
          setServices(adapted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="services" className="py-20 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Categories Grid */}
        <div className="bg-white rounded-3xl p-8 sm:p-11 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-9 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0A2540] tracking-tight mb-1.5">
                What do you need help with?
              </h2>
              <p className="text-sm text-slate-600">
                Browse our most popular home service categories
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {services.map((item) => {
              const IconComponent = serviceIcons[item.id] || Wrench;
              return (
                <div 
                  key={item.id}
                  onClick={() => onSelectService && onSelectService(item)}
                  className="bg-slate-50 border border-slate-200/60 hover:bg-white hover:border-blue-600 rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center hover:-translate-y-1 hover:shadow-lg group"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 group-hover:bg-[#0A2540] group-hover:text-white flex items-center justify-center mb-3.5 transition-colors">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="font-bold text-[#0A2540] text-base mb-1">
                    {item.name}
                  </div>
                  <div className="text-xs font-semibold text-slate-500">
                    From ₹{item.price}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
