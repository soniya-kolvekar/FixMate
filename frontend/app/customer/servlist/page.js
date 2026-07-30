'use client';

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Zap,
  Wrench,
  Wind,
  Refrigerator,
  Hammer,
  Paintbrush,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

function ServListContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emergency = searchParams.get("emergency");

  const services = [
    {
      title: 'Electrical',
      description: 'Professional wiring, switches, lighting installation and electrical repairs.',
      icon: Zap,
    },
    {
      title: 'Plumbing',
      description: 'Leaking pipes, tap installations, drain cleaning and plumbing fixes.',
      icon: Wrench,
    },
    {
      title: 'AC Service',
      description: 'AC installation, filter cleaning, gas filling and cooling repair.',
      icon: Wind,
    },
    {
      title: 'Appliance Repair',
      description: 'Washing machine, refrigerator, microwave and other appliance fixing.',
      icon: Refrigerator,
    },
    {
      title: 'Carpentry',
      description: 'Furniture assembly, door adjustments, custom woodwork and repairs.',
      icon: Hammer,
    },
    {
      title: 'Painting',
      description: 'Complete home painting, wall touching, wall decoration and coloring.',
      icon: Paintbrush,
    },
  ];

  const handleCategory = (categoryName) => {
    if (emergency) {
      router.push(`/customer/emergency?category=${encodeURIComponent(categoryName)}`);
    } else {
      router.push(`/customer/bookings/new?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-blue-100">
            <Sparkles size={16} />
            Professional Home Services
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#0A2540] tracking-tight">
            FixMate Service Roster
          </h1>
          <p className="text-slate-500 mt-4 text-base max-w-xl mx-auto font-medium">
            Select a service category below to schedule your expert maintenance assistance.
          </p>
        </div>

        {/* Services List Column */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Left Side: Icon & Details */}
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0 shadow-sm">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2540]">{service.title}</h3>
                    <p className="text-slate-500 mt-1.5 text-sm leading-relaxed max-w-2xl font-medium">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Right Side */}
                <button
                  onClick={() => handleCategory(service.title)}
                  className="bg-[#0A2540] hover:bg-[#12395f] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 whitespace-nowrap"
                >
                  Check Out Service
                  <ArrowRight size={18} />
                </button>

              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}

export default function ServList() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-slate-500 font-bold">Loading services...</div>}>
      <ServListContent />
    </Suspense>
  );
}