'use client';

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { db } from "../../../../lib/firebase/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import {
  Calendar,
  Clock,
  Wrench,
  AlertTriangle,
  User,
  Mail,
  IndianRupee,
  FileText,
  Loader2,
} from "lucide-react";

export default function BookingDetailsPage() {

  const { id } = useParams();

  const searchParams = useSearchParams();

  const collectionName =
    searchParams.get("collection") || "bookings";

  const [booking, setBooking] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadBooking = async () => {
  try {
    console.log("Params id:", id);
    console.log("Collection:", collectionName);

    const docRef = doc(db, collectionName, id);

    const docSnap = await getDoc(docRef);

    console.log("Exists:", docSnap.exists());

    if (docSnap.exists()) {
      console.log(docSnap.data());

      setBooking({
        id: docSnap.id,
        ...docSnap.data(),
      });
    } else {
      console.log("Document not found");
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
loadBooking();

  }, [id, collectionName]);
  if (loading) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Loader2 className="animate-spin text-[#0A2540]" size={40} />
    </div>
  );
}

if (!booking) {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-2xl font-bold">Booking Not Found</h1>
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
    case "Emergency Pending":
      return "bg-yellow-100 text-yellow-700";

    case "Assigned":
      return "bg-blue-100 text-blue-700";

    case "In Progress":
      return "bg-indigo-100 text-indigo-700";

    case "Completed":
      return "bg-green-100 text-green-700";

    case "Cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
const bookingStages = [
  "Pending",
  "Emergency Pending",
  "Assigned",
  "In Progress",
  "Completed",
];

const getStageIndex = () => {
  switch (booking.status) {
    case "Pending":
      return 0;

    case "Emergency Pending":
      return 1;

    case "Assigned":
      return 2;

    case "In Progress":
      return 3;

    case "Completed":
      return 4;

    default:
      return 0;
  }
};

return (
  <main className="min-h-screen bg-slate-50 py-10">

    <div className="max-w-5xl mx-auto px-4">

      <div className="bg-white rounded-2xl shadow-xl p-8">

        {/* Header */}

        <div className="flex justify-between items-start flex-wrap gap-4">

          <div>

            <h1 className="text-3xl font-bold text-[#0A2540]">
              {booking.service}
            </h1>

            <p className="text-gray-500 mt-2">
              {booking.category}
            </p>

          </div>

          <div className="flex gap-3">

            {booking.isEmergency && (

              <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full flex items-center gap-2">

                <AlertTriangle size={18} />

                Emergency

              </span>

            )}

            <span
              className={`px-4 py-2 rounded-full ${getStatusColor(
                booking.status
              )}`}
            >
              {booking.status}
            </span>

          </div>

        </div>

        {/* Customer Details */}

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div className="border rounded-xl p-5">

            <h2 className="font-bold text-xl mb-5">
              Customer Information
            </h2>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <User />

                {booking.customerName || "Customer"}

              </div>

              <div className="flex items-center gap-3">

                <Mail />

                {booking.customerEmail}

              </div>

            </div>

          </div>

          <div className="border rounded-xl p-5">

            <h2 className="font-bold text-xl mb-5">
              Booking Details
            </h2>

            <div className="space-y-4">

              <div className="flex items-center gap-3">

                <Calendar />

                {booking.date}

              </div>

              <div className="flex items-center gap-3">

                <Clock />

                {booking.timeSlot}

              </div>

              <div className="flex items-center gap-3">

                <IndianRupee />

                ₹{booking.price}

              </div>

              <div className="flex items-center gap-3">

                <Wrench />

                {booking.duration}

              </div>

            </div>

          </div>

        </div>

        {/* Description */}

        <div className="mt-8 border rounded-xl p-6">

          <div className="flex items-center gap-3 mb-4">

            <FileText />

            <h2 className="text-xl font-bold">
              Problem Description
            </h2>

          </div>

          <p className="text-gray-600 whitespace-pre-wrap">
            {booking.description}
          </p>

        </div>

        {/* Notes */}

        {booking.notes && (

          <div className="mt-8 border rounded-xl p-6">

            <h2 className="font-bold text-xl mb-4">
              Additional Notes
            </h2>

            <p className="text-gray-600 whitespace-pre-wrap">
              {booking.notes}
            </p>

          </div>

        )}

        {/* Technician */}

<div className="mt-8 border rounded-xl p-6">

  <h2 className="font-bold text-xl mb-4">
    Technician Status
  </h2>

  <p className="text-lg">
    {booking.technicianId
      ? "✅ Technician Assigned"
      : "⌛ Waiting for Technician Assignment"}
  </p>

</div>

{/* Booking Progress */}

<div className="mt-8 border rounded-xl p-6">

  <h2 className="text-xl font-bold mb-6">
    Booking Progress
  </h2>

  <div className="space-y-5">

    {bookingStages.map((stage, index) => {

      const active = index <= getStageIndex();

      return (

        <div
          key={stage}
          className="flex items-center gap-4"
        >

          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              active
                ? "bg-green-600 text-white"
                : "bg-gray-300"
            }`}
          >
            {active ? "✓" : ""}
          </div>

          <h3 className="font-semibold">
            {stage}
          </h3>

        </div>

      );

    })}

  </div>

</div>

      </div>

    </div>

  </main>
);
}