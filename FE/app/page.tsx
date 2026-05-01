'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast, { useToast } from '@/components/Toast';
import { ProductGridSkeleton } from '@/components/Loading';
import { useAddToCart } from '@/hooks/useAddToCart';
import { ArrowRight, ShoppingCart, Sparkles, TrendingUp, ArrowUpRight, Zap, Play, Mail } from 'lucide-react';
import { productService, normalizeProduct, type Product } from '@/lib/services/productService';
import Lightbox from '@/components/Lightbox';
import SuccessModal from '@/components/SuccessModal';

// ==================== CONFIG ====================

const HERO_CONTENT = {
  tag: "SPRING / SUMMER 2026",
  title: "CLOTH",
  highlight: "SELLER",
  description: "Redefining the digital wardrobe. A curated collection for the modern architect of style. Precision in every stitch, power in every silhouette.",
  image: "/banners/ba1.jpg",
  stats: [
    { value: "01", label: "CURATION" },
    { value: "02", label: "ARCHIVE" },
    { value: "03", label: "ATELIER" }
  ]
};

// ==================== COMPONENT ====================

export default function HomePage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<{ images: string[]; index: number; name: string } | null>(null);
  const [successModal, setSuccessModal] = useState({ isOpen: false, productName: '' });
  
  const { toasts, success, error, warning, removeToast } = useToast();

  const { addToCart, isAddingToCart } = useAddToCart({
    onSuccess: (productId) => {
      const product = products.find(p => p.id === productId);
      setSuccessModal({ isOpen: true, productName: product?.name || '' });
    },
    onError: (errorMsg) => error(errorMsg),
    onAuthRequired: () => {
      warning('Please authenticate to continue access.');
      router.push('/login');
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const result = await productService.getAll({ pageIndex: 1, pageSize: 8 });
        if (result.success && result.data) {
          const rawProducts = Array.isArray(result.data) ? result.data : result.data.data;
          if (Array.isArray(rawProducts)) {
            const normalizedProducts = rawProducts.map(normalizeProduct).filter(Boolean) as Product[];
            setProducts(normalizedProducts);
          }
        }
      } catch (err) {
        console.error("Failed to load archive", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleImageClick = (product: any, index: number) => {
    const allImages = [product.image, ...(product.images || [])].filter(Boolean).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);
    setLightbox({ images: allImages, index, name: product.name });
  };

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) addToCart(productId, product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black overflow-x-hidden">
      <Header />

      {/* Dynamic Notifications */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} duration={t.duration} onClose={() => removeToast(t.id)} />
      ))}

      {/* Modal Systems */}
      {lightbox && <Lightbox images={lightbox.images} initialIndex={lightbox.index} productName={lightbox.name} onClose={() => setLightbox(null)} />}
      <SuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ ...successModal, isOpen: false })} productName={successModal.productName} />

      <main className="flex-1">
        {/* ── SECTION 01: HERO ARCHIVE ──────────────────────────────── */}
        <section className="relative min-h-screen flex items-center pt-20 px-4 md:px-12 bg-white overflow-hidden">
            {/* Background Branding */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[35vw] font-black text-gray-50 leading-none select-none tracking-tighter italic pointer-events-none uppercase">
                SELLER
            </div>

            <div className="max-w-[1800px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-12 animate-in fade-in slide-in-from-left-12 duration-1000">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-4">
                            <div className="w-12 h-[1px] bg-black" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">{HERO_CONTENT.tag}</span>
                        </div>
                        <h1 className="text-[12vw] lg:text-[9vw] font-black text-black tracking-tighter leading-[0.8] uppercase italic">
                           {HERO_CONTENT.title} <br /> 
                           <span className="not-italic text-gray-200">{HERO_CONTENT.highlight}</span>
                        </h1>
                    </div>

                    <p className="max-w-md text-sm font-bold uppercase tracking-[0.2em] leading-loose text-gray-500">
                        {HERO_CONTENT.description}
                    </p>

                    <div className="flex flex-wrap gap-8 items-center pt-4">
                        <Link 
                            href="/products" 
                            className="group relative px-12 py-5 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl shadow-black/20 flex items-center gap-4 overflow-hidden"
                        >
                            <span className="relative z-10">Enter Archive</span>
                            <ArrowUpRight className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={16} />
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                <Play size={14} className="fill-current" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest">Watch Film</span>
                        </div>
                    </div>

                    <div className="flex gap-16 pt-12 border-t border-gray-50">
                        {HERO_CONTENT.stats.map(s => (
                            <div key={s.label} className="space-y-1">
                                <div className="text-xl font-black italic">{s.value}</div>
                                <div className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative group animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
                    <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-gray-100 relative">
                        <img 
                            src={HERO_CONTENT.image} 
                            alt="Editorial" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -bottom-10 -left-10 bg-white p-8 rounded-3xl shadow-2xl space-y-4 max-w-[200px] border border-gray-50">
                        <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white">
                            <Zap size={20} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                            Real-time curation engine active.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        {/* ── SECTION 02: TAXONOMY ────────────────────────────── */}
        <section className="py-24 border-y border-gray-100 overflow-hidden">
            <div className="flex animate-marquee whitespace-nowrap">
                {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center gap-12 px-6">
                        <span className="text-6xl font-black uppercase tracking-tighter italic opacity-5">Spring Summer 2026</span>
                        <div className="w-4 h-4 bg-black rounded-full" />
                        <span className="text-6xl font-black uppercase tracking-tighter opacity-5">Seller Cloth</span>
                        <div className="w-4 h-4 bg-black rounded-full" />
                    </div>
                ))}
            </div>
            
            <div className="max-w-[1800px] mx-auto px-12 mt-20">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {['DRESS', 'SHIRTS', 'PANTS', 'JACKETS', 'ACCESSORIES', 'ARCHIVE', 'SALE', 'NEW'].map(cat => (
                        <Link 
                            key={cat} 
                            href="/products"
                            className="group flex flex-col items-center gap-4 p-8 rounded-3xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                        >
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:scale-110 transition-transform">{cat}</span>
                            <div className="w-2 h-2 bg-gray-100 rounded-full group-hover:bg-black transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>

        {/* ── SECTION 03: CURATED SELECTION ───────────────────── */}
        <section className="py-32 px-12 bg-gray-50/50">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Sparkles size={16} className="animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Featured Archives</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">
                            The <br /> <span className="not-italic text-gray-200">Selection</span>
                        </h2>
                    </div>
                    <Link href="/products" className="group flex items-center gap-6 pb-2 border-b-2 border-black transition-all hover:gap-10">
                        <span className="text-sm font-black uppercase tracking-widest">View Complete Collection</span>
                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <ProductGridSkeleton count={8} />
                ) : products.length === 0 ? (
                    <div className="py-32 text-center space-y-6">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                            <ShoppingCart size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic">Archive Currently Empty</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Database connection active but no items curated.</p>
                        <button onClick={() => window.location.reload()} className="px-12 py-4 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Reload Protocol</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onImageClick={handleImageClick}
                                onAddToCart={handleAddToCart}
                                isAddingToCart={isAddingToCart(product.id)}
                                showImageGallery={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>

        {/* ── SECTION 04: PHILOSOPHY ──────────────────────────── */}
        <section className="py-32 bg-black text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 text-[40vw] font-black text-white/5 leading-none select-none tracking-tighter italic pointer-events-none uppercase">
                STYLE
            </div>
            
            <div className="max-w-7xl mx-auto px-12 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                    <h2 className="text-6xl font-black uppercase tracking-tighter leading-none italic">
                        Precision <br /> Architecture
                    </h2>
                    <p className="text-lg font-bold text-gray-500 uppercase tracking-widest leading-loose">
                        We don't just sell clothes. We engineer identities. Every piece in our archive is selected based on a strict protocol of quality, silhouette, and legacy.
                    </p>
                    <div className="space-y-8">
                        {[
                            { title: "Fast Logistics", desc: "Global shipping within 72 hours of purchase." },
                            { title: "Quality Guarantee", desc: "30-day architectural integrity review." },
                            { title: "Secure Encryption", desc: "Protocol-level payment security." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-8 group">
                                <div className="text-4xl font-black opacity-20 group-hover:opacity-100 transition-opacity italic">0{idx+1}</div>
                                <div className="space-y-2">
                                    <h4 className="text-sm font-black uppercase tracking-widest">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="aspect-[3/4] rounded-[3rem] overflow-hidden grayscale contrast-125 border border-white/10 shadow-2xl relative group">
                    <img src="/banners/b2.jpg" alt="Philosophy" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:scale-125 transition-transform">
                            <Sparkles size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ── SECTION 05: PROTOCOL SUBSCRIPTION ────────────────── */}
        <section className="py-32 px-12 bg-white flex flex-col items-center text-center space-y-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-black" />
            </div>
            <div className="space-y-4 max-w-2xl">
                <h2 className="text-5xl font-black tracking-tighter uppercase italic">Access the Registry</h2>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                    Join the elite circle. Receive real-time updates on new archives, exclusive drops, and architectural style guides.
                </p>
            </div>
            
            <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                <input 
                    type="email" 
                    placeholder="ENTER YOUR IDENTITY..." 
                    className="flex-1 px-10 py-6 bg-gray-50 border-none rounded-full outline-none focus:ring-4 ring-black/5 text-[11px] font-black uppercase tracking-widest text-black placeholder-gray-300 transition-all"
                />
                <button className="px-12 py-6 bg-black text-white rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20">
                    Register
                </button>
            </div>
            
            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em] pt-12">
                © {new Date().getFullYear()} SELLER CLOTH ARCHIVE
            </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
