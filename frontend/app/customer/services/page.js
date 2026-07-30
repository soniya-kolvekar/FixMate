'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { serviceCategories } from '../../../data/services';

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category');
  const emergency = searchParams.get('emergency');
  const services = serviceCategories[category] || [];

  const handleBooking = (service) => {
  let url = `/customer/bookings/new?category=${encodeURIComponent(
    category
  )}&service=${encodeURIComponent(service.name)}&price=${encodeURIComponent(
    service.price
  )}&duration=${encodeURIComponent(service.duration)}`;

  if (emergency === "true") {
    url += "&emergency=true";
  }

  router.push(url);
};

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-4xl font-bold text-[#0A2540] mb-2">
        {category}
      </h1>

      <p className="text-slate-600 mb-10">
        Choose a service to book.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {services.map((service) => (

          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-bold text-[#0A2540] mb-2">
              {service.title}
            </h3>

            <p className="text-slate-600 text-sm mb-4">
              {service.desc}
            </p>

            <div className="flex items-center justify-between font-semibold">
              <span className="text-[#0A2540]">
                ₹{service.price}
              </span>

              <button
                onClick={() => handleBooking(service)}
                className="bg-[#0A2540] hover:bg-blue-950 text-white text-sm px-4 py-2 rounded-lg transition"
              >
                Book Now
              </button>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-10 text-center font-bold text-slate-500">Loading services catalog...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}