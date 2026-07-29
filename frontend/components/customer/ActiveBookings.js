'use client';

import {
  Calendar,
  Clock,
  User,
  MapPin,
  ArrowRight,
} from 'lucide-react';

export default function ActiveBookings() {
  const bookings = [
    {
      id: '#FM1024',
      service: 'AC Repair',
      technician: 'Rahul Kumar',
      status: 'Assigned',
      date: '28 July 2026',
      time: '10:30 AM',
      location: 'Mangalore',
    },
    {
      id: '#FM1025',
      service: 'Plumbing',
      technician: 'Not Assigned',
      status: 'Pending',
      date: '29 July 2026',
      time: '2:00 PM',
      location: 'Surathkal',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Assigned':
        return 'bg-green-100 text-green-700';

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'In Progress':
        return 'bg-blue-100 text-blue-700';

      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <section>
      <div className="space-y-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition p-6"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <h3 className="text-xl font-bold text-[#0A2540]">
                    {booking.service}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span>{booking.technician}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{booking.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{booking.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{booking.location}</span>
                  </div>
                </div>
              </div>

              <button className="flex items-center gap-2 bg-[#0A2540] hover:bg-[#13395F] text-white px-5 py-3 rounded-xl transition font-semibold">
                View Details
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}