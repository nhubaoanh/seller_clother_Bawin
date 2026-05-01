"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Users,
  Lock,
  ChevronRight,
  Scroll,
  Feather,
  Heart,
  ArrowRight,
  Globe,
  Maximize2,
  Layers,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Maximize2 className="w-8 h-8 text-black" />,
      title: "Precision Tailoring",
      description:
        "Masterful craftsmanship meets avant-garde silhouettes. Our garments offer unparalleled fit with a focus on sustainable fabric architecture.",
    },
    {
      icon: <Layers className="w-8 h-8 text-black" />,
      title: "Structural Design",
      description:
        "Engineered for the modern minimalist. Structured, resilient, and meticulously stitched for those who demand excellence in every seam.",
    },
    {
      icon: <Globe className="w-8 h-8 text-black" />,
      title: "Global Couture",
      description:
        "A statement of identity. Our collections transcend borders, blending timeless tailoring with contemporary street edge.",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Editorial Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 py-4"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-12">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black text-xl tracking-tighter transition-transform group-hover:scale-110">
                G
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black uppercase tracking-tighter leading-none">
                  SELLER <span className="text-gray-300 italic">CLOTH</span>
                </span>
                <span className="text-[8px] font-bold uppercase tracking-[0.4em] mt-1 text-gray-400">
                  Master Apparel Registry
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-16">
              {["Collection", "Atelier", "Archive"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-gray-400 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-black transition-all group-hover:w-full"></span>
                </Link>
              ))}
              <Link
                href="/login"
                className="flex items-center gap-3 px-8 py-3 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
              >
                Access Portal <ArrowRight size={14} />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-white">
          {/* Background Text Layer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <h2 className="text-[35vw] font-black text-gray-50/50 leading-none select-none tracking-tighter italic">
              EDITORIAL
            </h2>
          </div>

          <div className="container mx-auto px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-20">
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-black">
                  <div className="w-12 h-[1px] bg-black" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em]">Spring / Summer 2026</span>
                </div>
                <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-black tracking-tighter leading-[0.85] uppercase italic">
                   Seller <br /> 
                   <span className="not-italic text-gray-100">Excellence</span>
                </h1>
              </div>
              
              <p className="text-lg text-gray-500 max-w-lg leading-relaxed font-medium">
                Designing the ultimate registry for the fashion-forward elite. Where every garment is a masterpiece and every stitch is a revelation.
              </p>

              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <Link 
                   href="/login" 
                   className="group flex items-center gap-6 px-10 py-6 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-black/20"
                >
                  Enter Registry <Maximize2 size={16} className="group-hover:rotate-90 transition-transform" />
                </Link>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Authorized Access Only</span>
                  <span className="text-[10px] font-bold text-black uppercase tracking-widest mt-1 italic">Protocol 0.1 Activated</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] relative rounded-[4rem] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border-8 border-white">
                <Image
                  src="/images/collection_banner.jpg"
                  alt="Fashion Concept"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {/* Floating Element */}
              <div className="absolute -bottom-10 -left-10 bg-white p-10 rounded-[3rem] shadow-2xl space-y-4 max-w-xs border border-gray-100 animate-in slide-in-from-bottom duration-1000">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white">
                  <ShoppingBag size={20} />
                </div>
                <h4 className="text-lg font-black uppercase tracking-tighter italic">Curation System</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-bold uppercase tracking-widest">Managing the world's most exclusive apparel taxonomy.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-40 bg-gray-50 relative overflow-hidden">
           {/* Abstract Dots */}
           <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, black 2px, transparent 0)', backgroundSize: '40px 40px' }} />
           
           <div className="max-w-[1400px] mx-auto px-12 relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
                 <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">Operational Excellence</span>
                    <h2 className="text-6xl font-black text-black tracking-tighter uppercase leading-none italic">Superior <br /> <span className="not-italic text-gray-200">Capabilities</span></h2>
                 </div>
                 <p className="text-sm text-gray-400 max-w-sm font-bold uppercase tracking-widest leading-loose text-right">
                    Our administrative engine is built for scale, performance, and aesthetic dominance in the fashion landscape.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-1px bg-gray-200 border border-gray-200 shadow-2xl rounded-[3rem] overflow-hidden">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-16 bg-white hover:bg-black transition-all duration-700 group flex flex-col items-start justify-between min-h-[400px]"
                  >
                    <div className="w-16 h-16 border-2 border-black rounded-3xl flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all">
                      {feature.icon}
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-3xl font-black text-black tracking-tighter uppercase leading-none italic group-hover:text-white transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-loose group-hover:text-gray-500 transition-colors">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </section>

        {/* Archive Call to Action */}
        <section className="py-40 bg-white">
           <div className="max-w-7xl mx-auto px-12 text-center space-y-12">
              <h2 className="text-[12vw] font-black text-black tracking-tighter leading-none uppercase italic">The <span className="text-gray-100 not-italic">Registry</span></h2>
              <div className="flex justify-center">
                 <Link 
                   href="/login" 
                   className="group relative inline-flex items-center gap-12 text-2xl font-black uppercase tracking-widest border-b-2 border-black pb-4 hover:gap-20 transition-all italic"
                 >
                   Begin Administrative Session <ArrowRight size={32} />
                 </Link>
              </div>
           </div>
        </section>

        {/* Editorial Footer */}
        <footer className="bg-black text-white pt-32 pb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 text-[30vw] font-black text-white/5 leading-none select-none tracking-tighter italic pointer-events-none uppercase">
            SELLER
          </div>
          
          <div className="max-w-[1800px] mx-auto px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-20 mb-32 border-b border-white/10 pb-32">
              <div className="lg:col-span-2 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black text-xl">S</div>
                  <span className="text-3xl font-black uppercase tracking-tighter italic leading-none">SELLER <br /> <span className="text-gray-500">CLOTH</span></span>
                </div>
                <p className="text-sm text-gray-500 max-w-md font-bold uppercase tracking-[0.2em] leading-loose">
                  Defining the future of fashion management. A centralized ecosystem for the elite apparel industry. Engineered for clarity, built for legacy.
                </p>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Navigation</h4>
                <ul className="space-y-4">
                  {["Collection", "Atelier", "Archive", "Protocol"].map(item => (
                    <li key={item}><Link href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>

              <div className="space-y-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">Identity</h4>
                <ul className="space-y-4">
                  {["Master Access", "Legal", "Privacy", "Security"].map(item => (
                    <li key={item}><Link href="#" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">{item}</Link></li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">
                © {new Date().getFullYear()} SELLER CLOTH. Editorial Curation by Nhu Bao Anh.
              </p>
              <div className="flex gap-12">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600">All Protocols Operational</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
