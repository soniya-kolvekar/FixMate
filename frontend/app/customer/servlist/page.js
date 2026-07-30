'use client';

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

export default function ServList() {
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
      description: 'Leak repairs, tap installation, pipe maintenance and bathroom fittings.',
      icon: Wrench,
    },
    {
      title: 'AC Repair',
      description: 'AC servicing, installation, gas refilling and cooling issue repairs.',
      icon: Wind,
    },
    {
      title: 'Appliance Repair',
      description: 'Repair services for TVs, Refrigerators, Washing Machines and Microwaves.',
      icon: Refrigerator,
    },
    {
      title: 'Carpentry',
      description: 'Furniture assembly, door repair, shelf installation and woodwork.',
      icon: Hammer,
    },
    {
      title: 'Painting',
      description: 'Interior, exterior, texture and ceiling painting services.',
      icon: Paintbrush,
    },
    {
      title: 'Cleaning',
      description: 'Deep home, kitchen, bathroom and sofa cleaning by professionals.',
      icon: Sparkles,
    },
  ];

  const handleCategory = (category) => {
  const url = emergency === "true"
    ? `/customer/services?category=${encodeURIComponent(category)}&emergency=true`
    : `/customer/services?category=${encodeURIComponent(category)}`;

  router.push(url);
};

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold text-[#0A2540]">
          Service Categories
        </h1>

        <p className="text-slate-600 mt-2 mb-10">
          Choose a category to explore available services.
        </p>

        <div className="space-y-6">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="bg-white rounded-2xl shadow-md border border-slate-200 hover:shadow-xl transition-all duration-300 p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  {/* Left Side */}
                  <div className="flex items-start gap-5">

                    <div className="w-16 h-16 rounded-2xl bg-[#0A2540]/10 flex items-center justify-center">
                      <Icon
                        size={34}
                        className="text-[#0A2540]"
                      />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-[#0A2540]">
                        {service.title}
                      </h2>

                      <p className="text-slate-600 mt-2 max-w-3xl leading-7">
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
              </div>
            );
          })}

        </div>

      </div>
    </main>
  );
}