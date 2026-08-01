'use client';

import { useEffect } from "react";
import { auth, db } from "../../lib/firebase/firebase";

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function NotificationWatcher() {

  useEffect(() => {

    const user = auth.currentUser;

    if (!user) return;

    const statusMap = {
      Pending: {
        type: "booking_created",
        title: "Booking Created",
        message: "Your booking has been created successfully."
      },

      "Emergency Pending": {
        type: "booking_created",
        title: "Emergency Booking Created",
        message: "Your emergency booking has been created."
      },

      Assigned: {
        type: "technician_assigned",
        title: "Technician Assigned",
        message: "A technician has been assigned."
      },

      Accepted: {
        type: "booking_accepted",
        title: "Emergency Accepted",
        message: "A technician accepted your emergency request."
      },

      "On The Way": {
        type: "technician_on_the_way",
        title: "Technician On The Way",
        message: "Your technician is on the way."
      },

      "Reached Location": {
        type: "technician_arrived",
        title: "Technician Arrived",
        message: "Technician has reached your location."
      },

      "Service Started": {
        type: "service_started",
        title: "Service Started",
        message: "Technician has started working."
      },

      Completed: {
        type: "service_completed",
        title: "Service Completed",
        message: "Your service has been completed. Please rate your technician."
      },

      Cancelled: {
        type: "booking_cancelled",
        title: "Booking Cancelled",
        message: "Your booking has been cancelled."
      }
    };

    const watchBookings = (collectionName) => {

      return onSnapshot(

        query(
          collection(db, collectionName),
          where("customerId", "==", user.uid)
        ),

        async (snapshot) => {

          for (const change of snapshot.docChanges()) {

            if (
              change.type !== "added" &&
              change.type !== "modified"
            )
              continue;

            const booking = change.doc.data();

            if (
              booking.lastNotifiedStatus === booking.status
            )
              continue;

            const notification = statusMap[booking.status];

            if (!notification) continue;

            await addDoc(
              collection(db, "notifications"),
              {
                userId: user.uid,
                bookingId: change.doc.id,
                bookingCollection: collectionName,

                type: notification.type,
                title: notification.title,
                message: notification.message,

                isRead: false,
                createdAt: serverTimestamp(),
              }
            );

            await updateDoc(change.doc.ref, {
              lastNotifiedStatus: booking.status,
            });

          }

        }

      );

    };

    const unsub1 = watchBookings("bookings");
    const unsub2 = watchBookings("emergencyBookings");

    return () => {
      unsub1();
      unsub2();
    };

  }, []);

  return null;
}