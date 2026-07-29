'use client';
import Link from 'next/link';

export default function Footer({ onShowToast }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onShowToast) onShowToast('Thank you for subscribing to FixMate updates!');
    e.target.reset();
  };

  return (
    <footer id="contact" className="bg-[#0B2545] text-slate-300 pt-20 pb-12 antialiased">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Top 4 Column Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#134074] flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path d="M14.7 13.3l-3.5 3.5a1.5 1.5 0 0 1-2.1-2.1l3.5-3.5" />
                  <path d="M14.5 9.5a2.5 2.5 0 0 1 3.5 3.5" />
                </svg>
              </div>

              <div className="flex items-baseline text-xl font-black font-heading tracking-tight text-white">
                <span>Fix</span>
                <span className="text-[#8DA9C4]">Mate</span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-xs">
              Reliable Home Services, Simplified. Connecting homeowners with background-verified professionals for trusted maintenance across India.
            </p>

            <div className="flex gap-2.5 pt-2">
              {['in', 'tw', 'fb'].map((icon) => (
                <span 
                  key={icon}
                  className="w-8 h-8 rounded-lg bg-white/10 text-slate-300 flex items-center justify-center text-xs font-bold hover:bg-[#134074] hover:text-white transition-colors cursor-pointer"
                >
                  {icon}
                </span>
              ))}
            </div>
          </div>

          {/* Services Col */}
          <div className="space-y-4">
            <h4 className="font-bold font-heading text-white text-sm">Services</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              <li><a href="#services" className="hover:text-white transition-colors">Plumbing Repair</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Electrical Services</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">AC Maintenance</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Carpentry & Assembly</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">Home Painting</a></li>
            </ul>
          </div>

          {/* Ecosystem Col */}
          <div className="space-y-4">
            <h4 className="font-bold font-heading text-white text-sm">Ecosystem</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-normal">
              <li><Link href="/technician" className="hover:text-white transition-colors">Technician Hub</Link></li>
              <li><a href="#why-us" className="hover:text-white transition-colors">Why FixMate</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">Safety Standards</a></li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-4">
            <h4 className="font-bold font-heading text-white text-sm">Stay Updated</h4>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Subscribe for seasonal maintenance tips and exclusive offer updates.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email address" 
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 focus:border-[#8DA9C4] transition-all" 
                required 
              />
              <button 
                type="submit" 
                className="bg-[#134074] hover:bg-[#13315C] text-white px-4 rounded-xl text-sm font-semibold transition-colors"
              >
                &rarr;
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-normal gap-4">
          <p>© 2026 FixMate India Services Pvt. Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">System Status</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
