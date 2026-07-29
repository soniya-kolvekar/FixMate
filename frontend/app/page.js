'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import PortalSection from '../components/PortalSection';
import ServicesSection from '../components/ServicesSection';
import TrustSection from '../components/TrustSection';
import EmergencySection from '../components/EmergencySection';
import MetricsSection from '../components/MetricsSection';
import Footer from '../components/Footer';

import PortalModal from '../components/PortalModal';
import BookingModal from '../components/BookingModal';
import EmergencyModal from '../components/EmergencyModal';
import AuthModal from '../components/AuthModal';

import { logoutUser } from '../lib/firebase/auth';

import { Info } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);

  const [authModal, setAuthModal] = useState({
    isOpen: false,
    mode: 'login',
  });

  const [portalModal, setPortalModal] = useState({
    isOpen: false,
    role: 'customer',
  });

  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    service: null,
  });

  const [emergencyModal, setEmergencyModal] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();

      setCurrentUser(null);

      showToast('Signed out successfully.');

      router.push('/');
    } catch (error) {
      showToast(error.message);
    }
  };

 const handleAuthSuccess = (user, role, authMode) => {
  setCurrentUser(user);

  if (authMode === 'signup') {
    switch (role) {
      case 'customer':
        router.push('/customer/profile');
        return;

      case 'technician':
        router.push('/technician/profile');
        return;
    }
  }

  switch (role) {
    case 'customer':
      router.push('/customer');
      break;

    case 'technician':
      router.push('/technician');
      break;

    case 'dispatcher':
      router.push('/dispatcher');
      break;

    case 'admin':
      router.push('/admin');
      break;

    default:
      router.push('/');
  }
};

  return (
    <main className="min-h-screen flex flex-col font-sans">

      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={(mode) =>
          setAuthModal({
            isOpen: true,
            mode,
          })
        }
      />

      <HeroSection
        onBookService={() =>
          setBookingModal({
            isOpen: true,
            service: null,
          })
        }
      />

      <PortalSection
        onOpenPortal={(role) =>
          setPortalModal({
            isOpen: true,
            role,
          })
        }
      />

      <ServicesSection
        onSelectService={(service) =>
          setBookingModal({
            isOpen: true,
            service,
          })
        }
      />

      <TrustSection />

      <EmergencySection
        onOpenEmergency={() => setEmergencyModal(true)}
      />

      <MetricsSection />

      <Footer
        onShowToast={showToast}
      />

      {/* Portal Modal */}

      <PortalModal
        isOpen={portalModal.isOpen}
        initialRole={portalModal.role}
        onClose={() =>
          setPortalModal({
            isOpen: false,
            role: 'customer',
          })
        }
      />

      {/* Booking Modal */}

      <BookingModal
        isOpen={bookingModal.isOpen}
        selectedService={bookingModal.service}
        onClose={() =>
          setBookingModal({
            isOpen: false,
            service: null,
          })
        }
        onShowToast={showToast}
      />

      {/* Emergency Modal */}

      <EmergencyModal
        isOpen={emergencyModal}
        onClose={() => setEmergencyModal(false)}
        onShowToast={showToast}
      />

      {/* Authentication Modal */}

      <AuthModal
        isOpen={authModal.isOpen}
        mode={authModal.mode}
        onClose={() =>
          setAuthModal({
            isOpen: false,
            mode: 'login',
          })
        }
        onAuthSuccess={handleAuthSuccess}
        onShowToast={showToast}
      />

      {/* Toast */}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[3000] bg-[#0A2540] text-white px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 text-sm font-semibold animate-in slide-in-from-bottom duration-300">
          <Info className="w-5 h-5 text-blue-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </main>
  );
}