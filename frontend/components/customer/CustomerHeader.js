'use client';

import { Bell, LogOut, User } from 'lucide-react';
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
    <header className="bg-[#0A2540] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            FixMate
          </h1>

          <p className="text-blue-200 text-sm">
            Customer Dashboard
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative text-white hover:text-blue-300 transition">
            <Bell size={22} />
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <User className="text-[#0A2540]" size={20} />
            </div>

            <div>
              <h3 className="text-white font-semibold">
                Customer
              </h3>

              <p className="text-blue-200 text-xs">
                customer@fixmate.com
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}