'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProtectedRoute({
  children,
  allowedRole,
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/');
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          router.replace('/');
          return;
        }

        const userData = docSnap.data();

        if (userData.role !== allowedRole) {
          router.replace('/');
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [router, allowedRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return children;
}