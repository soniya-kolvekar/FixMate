'use client';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function Header({ onOpenAuth, currentUser, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img 
            src="/assets/images/logo.png" 
            alt="FixMate Logo" 
            className="h-16 sm:h-20 w-auto object-contain py-1" 
          />
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          <Link href="#home" className="text-[15px] font-semibold text-slate-600 hover:text-[#0A2540] transition-colors">Home</Link>
          <Link href="#services" className="text-[15px] font-semibold text-slate-600 hover:text-[#0A2540] transition-colors">Services</Link>
          <Link href="#about" className="text-[15px] font-semibold text-slate-600 hover:text-[#0A2540] transition-colors">About</Link>
          <Link href="#contact" className="text-[15px] font-semibold text-slate-600 hover:text-[#0A2540] transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#0A2540] flex items-center gap-1.5">
                <User className="w-4 h-4 text-[#0A2540]" />
                {currentUser.displayName || currentUser.email}
              </span>
              <Link 
                href="/dispatcher"
                className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 rounded-md shadow-sm transition-all"
              >
                Dashboard
              </Link>
              <button 
                onClick={onLogout}
                className="text-sm font-semibold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => onOpenAuth('login')}
                className="text-[15px] font-semibold text-[#0A2540] hover:bg-slate-100 px-4.5 py-2 rounded-md transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => onOpenAuth('signup')}
                className="text-[15px] font-bold text-white bg-[#0A2540] hover:bg-[#13395F] px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
