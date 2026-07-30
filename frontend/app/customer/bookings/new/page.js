'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Upload,
  FileText,
  Wrench,
} from 'lucide-react';

export default function BookingPage() {
  const searchParams = useSearchParams();

  const category = searchParams.get('category');
  const service = searchParams.get('service');

  const [formData, setFormData] = useState({
    description: '',
    date: '',
    timeSlot: '',
    images: [],
    requestPreviousTechnician: false,
    notes: '',
  });

  const timeSlots = [
    '09:00 AM - 11:00 AM',
    '11:00 AM - 01:00 PM',
    '02:00 PM - 04:00 PM',
    '04:00 PM - 06:00 PM',
  ];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === 'file') {
      setFormData({
        ...formData,
        images: Array.from(files),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log({
      category,
      service,
      ...formData,
    });

    alert('Booking Submitted Successfully!');
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold text-[#0A2540] mb-8">
          Book Service
        </h1>

        {/* Service Details */}

        <div className="bg-slate-100 rounded-xl p-5 mb-8">

          <h2 className="font-bold text-lg text-[#0A2540] flex items-center gap-2">
            <Wrench size={20} />
            Service Details
          </h2>

          <div className="mt-4 space-y-2">
            <p><strong>Category:</strong> {category}</p>
            <p><strong>Service:</strong> {service}</p>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          {/* Problem Description */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">
              <FileText size={18} />
              Problem Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue..."
              className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-[#0A2540] outline-none"
              required
            />

          </div>

          {/* Upload Images */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">
              <Upload size={18} />
              Upload Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <p className="text-sm text-slate-500 mt-2">
              Upload up to 5 images.
            </p>

          </div>

          {/* Date */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-2">
              <Calendar size={18} />
              Preferred Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
              required
            />

          </div>

          {/* Time Slots */}

          <div>

            <label className="font-semibold flex items-center gap-2 mb-3">
              <Clock size={18} />
              Select Time Slot
            </label>

            <div className="grid md:grid-cols-2 gap-4">

              {timeSlots.map((slot) => (

                <label
                  key={slot}
                  className="border rounded-xl p-4 cursor-pointer hover:border-[#0A2540]"
                >

                  <input
                    type="radio"
                    name="timeSlot"
                    value={slot}
                    checked={formData.timeSlot === slot}
                    onChange={handleChange}
                    className="mr-3"
                  />

                  {slot}

                </label>

              ))}

            </div>

          </div>

          {/* Previous Technician */}

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              name="requestPreviousTechnician"
              checked={formData.requestPreviousTechnician}
              onChange={handleChange}
              className="w-5 h-5"
            />

            <label className="font-medium">
              Request my previous service provider (if available)
            </label>

          </div>

          {/* Notes */}

          <div>

            <label className="font-semibold mb-2 block">
              Additional Notes (Optional)
            </label>

            <textarea
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-xl p-4"
              placeholder="Any additional information..."
            />

          </div>

          {/* Submit */}

          <button
            type="submit"
            className="w-full bg-[#0A2540] text-white py-4 rounded-xl text-lg font-semibold hover:bg-[#12395f]"
          >
            Confirm Booking
          </button>

        </form>

      </div>
    </main>
  );
}