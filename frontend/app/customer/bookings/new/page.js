'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  Upload,
  FileText,
  Wrench,
} from 'lucide-react';

function BookingPageContent() {
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
        images: [...files],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      category,
      service,
      ...formData,
    });

    alert('Booking Submitted Successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      <h1 className="text-3xl font-bold text-[#0A2540] mb-2">
        Book Service
      </h1>

      <p className="text-slate-600 mb-8">
        Category: <span className="font-semibold text-blue-600">{category || 'General'}</span>
      </p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">

        {/* Issue Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Issue Description
          </label>

          <div className="relative">
            <FileText className="absolute top-3 left-3 text-slate-400 w-5 h-5" />

            <textarea
              name="description"
              rows="4"
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </div>
        </div>

        {/* Schedule Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Preferred Date
          </label>

          <div className="relative">
            <Calendar className="absolute top-3 left-3 text-slate-400 w-5 h-5" />

            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
            />
          </div>
        </div>

        {/* Preferred Time Slot */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Preferred Time Slot
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <label
                key={slot}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                  formData.timeSlot === slot
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="timeSlot"
                  value={slot}
                  checked={formData.timeSlot === slot}
                  onChange={handleChange}
                  className="accent-blue-600"
                />

                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm">{slot}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Upload Images */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Upload Images / Photos of Issue (Optional)
          </label>

          <div className="relative border-2 border-dashed border-slate-300 p-6 rounded-lg text-center hover:border-blue-600 transition">
            <Upload className="mx-auto text-slate-400 w-8 h-8 mb-2" />

            <input
              type="file"
              multiple
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />

            <p className="text-sm text-slate-600">
              Click or drag files to upload
            </p>
          </div>
        </div>

        {/* Request Previous Technician */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="requestPreviousTechnician"
            id="previousTech"
            checked={formData.requestPreviousTechnician}
            onChange={handleChange}
            className="w-4 h-4 accent-blue-600"
          />

          <label htmlFor="previousTech" className="text-sm text-slate-700 font-medium">
            Request Previous Technician if Available
          </label>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Special Instructions / Gate Code / Notes
          </label>

          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Gate code, parking notes, etc."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-600 text-slate-800"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#0A2540] hover:bg-blue-900 text-white font-semibold py-3 rounded-lg transition"
        >
          Confirm Booking
        </button>

      </form>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-6 py-10 text-center font-bold text-slate-500">Loading booking form...</div>}>
      <BookingPageContent />
    </Suspense>
  );
}