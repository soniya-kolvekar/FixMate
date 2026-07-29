'use client';

import {
  CheckCircle2,
  XCircle,
  Calendar,
  Star,
  ArrowRight,
} from 'lucide-react';

export default function BookingHistory() {
  const history = [
    {
      id: '#FM1001',
      service: 'Washing Machine Repair',
      technician: 'Rahul Kumar',
      date: '20 July 2026',
      status: 'Completed',
    },
    {
      id: '#FM1002',
      service: 'Electrical Wiring',
      technician: 'Arjun Shetty',
      date: '15 July 2026',
      status: 'Completed',
    },
    {
      id: '#FM1003',
      service: 'Plumbing',
      technician: 'Not Assigned',
      date: '10 July 2026',
      status: 'Cancelled',
    },
  ];

  return (
    <section>
      <div className="space-y-5">
        {history.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3">
                  {booking.status === 'Completed' ? (
                    <CheckCircle2
                      size={24}
                      className="text-green-600"
                    />
                  ) : (
                    <XCircle
                      size={24}
                      className="text-red-500"
                    />
                  )}

                  <h3 className="text-xl font-bold text-[#0A2540]">
                    {booking.service}
                  </h3>
                </div>

                <div className="mt-4 space-y-2 text-slate-600">
                  <p>
                    <strong>Booking ID:</strong> {booking.id}
                  </p>

                  <p>
                    <strong>Technician:</strong> {booking.technician}
                  </p>

                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{booking.date}</span>
                  </div>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'Completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {booking.status === 'Completed' && (
                  <button className="flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-xl transition font-semibold">
                    <Star size={18} />
                    Rate Service
                  </button>
                )}

                <button className="flex items-center justify-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-5 py-3 rounded-xl transition font-semibold">
                  View Details
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}