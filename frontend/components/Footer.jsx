'use client';
import Link from 'next/link';

export default function Footer({ onShowToast }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onShowToast('Thank you for subscribing to FixMate updates!');
    e.target.reset();
  };

  return (
    <footer id="contact" className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <Link href="/" className="inline-block mb-4">
              <img 
                src="/assets/images/logo.png" 
                alt="FixMate Logo" 
                className="h-20 w-auto object-contain" 
              />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-xs">
              Professional home services at your doorstep. Trusted by thousands, delivered with excellence.
            </p>
            <div className="flex gap-3">
              <span className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-[#0A2540] cursor-pointer hover:bg-[#0A2540] hover:text-white transition-colors">in</span>
              <span className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-[#0A2540] cursor-pointer hover:bg-[#0A2540] hover:text-white transition-colors">tw</span>
              <span className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-[#0A2540] cursor-pointer hover:bg-[#0A2540] hover:text-white transition-colors">fb</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-[#0A2540] text-base mb-5">Services</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#services" className="hover:text-[#0A2540]">Plumbing</a></li>
              <li><a href="#services" className="hover:text-[#0A2540]">Electrical</a></li>
              <li><a href="#services" className="hover:text-[#0A2540]">AC Repair</a></li>
              <li><a href="#services" className="hover:text-[#0A2540]">Carpentry</a></li>
              <li><a href="#services" className="hover:text-[#0A2540]">Home Cleaning</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A2540] text-base mb-5">Company</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li><a href="#about" className="hover:text-[#0A2540]">About Us</a></li>
              <li><button onClick={() => onShowToast('Careers portal loading...')} className="hover:text-[#0A2540]">Careers</button></li>
              <li><button onClick={() => onShowToast('Partner program loading...')} className="hover:text-[#0A2540]">Become a Partner</button></li>
              <li><button onClick={() => onShowToast('Privacy policy page loading...')} className="hover:text-[#0A2540]">Privacy Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#0A2540] text-base mb-5">Newsletter</h4>
            <p className="text-sm text-slate-600 mb-4">Get tips and exclusive offers in your inbox.</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="flex-grow px-4 py-3 rounded-md border border-slate-200 text-sm focus:outline-none focus:border-blue-600" 
                required 
              />
              <button type="submit" className="bg-[#0A2540] hover:bg-[#13395F] text-white px-4 rounded-md text-base transition-colors">
                &rarr;
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; 2026 FixMate Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#0A2540]">Privacy</a>
            <a href="#" className="hover:text-[#0A2540]">Terms</a>
            <a href="#" className="hover:text-[#0A2540]">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
