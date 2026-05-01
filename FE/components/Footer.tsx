import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-32 pb-12 overflow-hidden relative border-t border-white/5">
      {/* Background Branding */}
      <div className="absolute top-0 right-0 text-[30vw] font-black text-white/5 leading-none select-none tracking-tighter italic pointer-events-none uppercase">
        SELLER
      </div>
      
      <div className="max-w-[1800px] mx-auto px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32 border-b border-white/10 pb-32">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-xl">S</div>
              <span className="text-3xl font-black uppercase tracking-tighter italic leading-none">SELLER <br /> <span className="text-gray-500">CLOTH</span></span>
            </div>
            <p className="text-sm text-gray-500 max-w-md font-bold uppercase tracking-[0.2em] leading-loose">
              Defining the future of fashion curation. A centralized ecosystem for the elite apparel industry. Engineered for clarity, built for legacy.
            </p>
            <div className="flex gap-8 pt-4">
               <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Instagram size={18} />
               </a>
               <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Facebook size={18} />
               </a>
               <a href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Twitter size={18} />
               </a>
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="grid grid-cols-2 gap-12 lg:col-span-2">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Navigation</h4>
              <ul className="space-y-4">
                {['Home', 'Archive', 'Atelier', 'Registry'].map(item => (
                  <li key={item}>
                    <Link href={item === 'Home' ? '/' : '/products'} className="text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                        {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Protocols</h4>
              <ul className="space-y-4">
                {['Shipping', 'Returns', 'Terms', 'Privacy'].map(item => (
                  <li key={item}>
                    <Link href="#" className="text-[11px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2 group">
                        {item} <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Legal & Credits */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
            © {new Date().getFullYear()} SELLER CLOTH. Editorial Curation by Nhu Bao Anh.
          </p>
          <div className="flex gap-12">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-400">System Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
