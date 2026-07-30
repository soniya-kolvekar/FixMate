'use client';

import Link from 'next/link';
import { User, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '../../lib/firebase/auth';

export default function CustomerHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 h-20 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/customer"
          className="flex items-center overflow-visible py-1"
        >
          <img
            src="/assets/images/logo.png"
            alt="FixMate Logo"
            className="h-14 sm:h-16 w-auto object-contain scale-125 origin-left transition-transform hover:scale-110"
          />
        </Link>

        {/* Right Side Buttons */}
        <div className="flex items-center gap-4">

          {/* Profile */}
          <button
            onClick={() => router.push('/customer/profile')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0B2545] font-semibold transition"
          >
            <User size={18} />
            Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#133A63] text-white font-semibold transition"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </div>
    </header>
  );
}