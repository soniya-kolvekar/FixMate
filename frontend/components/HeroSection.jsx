'use client';
import Image from 'next/image';

export default function HeroSection({ onBookService }) {
  return (
    <section id="home" className="py-16 md:py-20 bg-gradient-to-b from-white to-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-bold text-xs px-3.5 py-1.5 rounded-full mb-6 border border-blue-100 uppercase tracking-wide">
            🛡️ TRUSTED BY 10k+ HOMEOWNERS
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0A2540] tracking-tight leading-[1.12] mb-5">
            Reliable Home Services, Simplified.
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed mb-9 max-w-xl">
            Empowering homeowners with expert repairs, technicians with tools for success, and dispatchers with seamless coordination. The complete ecosystem for modern home maintenance.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button 
              onClick={onBookService}
              className="bg-[#0A2540] hover:bg-[#13395F] text-white font-bold text-base px-8 py-4 rounded-md shadow-lg hover:shadow-xl transition-all"
            >
              Book a Service
            </button>
            <a 
              href="#services"
              className="bg-white hover:bg-slate-100 text-[#0A2540] font-bold text-base px-8 py-4 rounded-md border border-slate-200 shadow-sm transition-all"
            >
              Explore Services
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200">
            <div>
              <h4 className="text-2xl font-extrabold text-[#0A2540]">4.9 ⭐</h4>
              <p className="text-xs font-semibold text-slate-500">Customer Rating</p>
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#0A2540]">Verified</h4>
              <p className="text-xs font-semibold text-slate-500">Technicians</p>
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#0A2540]">24/7</h4>
              <p className="text-xs font-semibold text-slate-500">Emergency Services</p>
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-[#0A2540]">Live</h4>
              <p className="text-xs font-semibold text-slate-500">Service Tracking</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Collage */}
        <div className="relative h-[440px] flex items-center justify-center">
          <div className="relative w-full h-full">
            {/* Top Left Card */}
            <div className="absolute top-2 left-4 w-60 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-10 transition-transform hover:scale-105">
              <Image src="/assets/images/hero_plumber.png" alt="Plumber" fill className="object-cover" />
            </div>

            {/* Top Right Card */}
            <div className="absolute top-4 right-4 w-44 h-36 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-0 transition-transform hover:scale-105">
              <Image src="/assets/images/hero_handyman.png" alt="Handyman" fill className="object-cover" />
            </div>

            {/* Mid Right Card */}
            <div className="absolute top-36 right-8 w-40 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 transition-transform hover:scale-105">
              <Image src="/assets/images/hero_electrician.png" alt="Electrician" fill className="object-cover" />
            </div>

            {/* Bottom Large Card */}
            <div className="absolute bottom-2 left-8 w-72 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-30 transition-transform hover:scale-105">
              <Image src="/assets/images/hero_ac_tech.png" alt="AC Technician" fill className="object-cover" />
            </div>

            {/* Tool Badge */}
            <div className="absolute bottom-36 right-2 w-11 h-11 bg-[#0A2540] text-white rounded-full flex items-center justify-center text-xl shadow-lg border-2 border-white z-40 animate-pulse-slow">
              🔧
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
