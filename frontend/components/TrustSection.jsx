'use client';
import Image from 'next/image';
import { ShieldCheck, Tag, MapPin, Award } from 'lucide-react';

export default function TrustSection() {
  return (
    <section id="about" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-11">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A2540] tracking-tight">
            Why thousands of homeowners trust FixMate
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Verified Experts</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every technician undergoes a rigorous background check and skill assessment.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Transparent Pricing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                No hidden costs. See exact quotes before you book your service.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Live Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your technician's arrival in real-time through our app.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#0A2540] mb-2">Service Guarantee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                100% satisfaction guarantee or we'll redo the job for free.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-white/80 h-[380px]">
            <Image 
              src="/assets/images/fixmate_app_mockup.png" 
              alt="FixMate Platform Mockup" 
              fill
              className="object-cover" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}
