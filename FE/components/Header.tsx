'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { ShoppingCart, User, LogOut, Menu, X, Sparkles, Search, Package } from 'lucide-react';
import { cartService } from '@/lib/services/cartService';
import { authService } from '@/lib/services/authService';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    setLoading(true);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Fetch user
    authService.me().then((res) => {
      if (res.success && res.data?.data) {
        setUser(res.data.data);
      }
    }).catch(() => {}).finally(() => setLoading(false));

    // Fetch cart count
    const refreshCart = async () => {
      try {
        const res = await cartService.get();
        if (res.success && res.data?.items) {
          setCartCount(res.data.items.length);
        } else {
          setCartCount(0);
        }
      } catch (error) {
        setCartCount(0);
      }
    };
    
    refreshCart();
    window.addEventListener('cart-updated', refreshCart);
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('cart-updated', refreshCart);
    };
  }, [setUser, setLoading]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setCartCount(0);
    router.push('/');
  };

  if (!mounted) return null;

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-8'}`}>
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center">
        
        {/* Left: Branding */}
        <Link href="/" className="flex flex-col group">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black uppercase tracking-tighter leading-none group-hover:scale-110 transition-transform">
                CLOTH <span className="text-gray-300 italic">SELLER</span>
            </span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] mt-1 text-gray-400 group-hover:text-black transition-colors">
            ARCHIVE CURATION
          </span>
        </Link>

        {/* Center: Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
            {[
              { href: '/', label: 'Home' },
              { href: '/products', label: 'Archive' },
              { href: '/about', label: 'Atelier' },
              { href: '/contact', label: 'Registry' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all relative group"
              >
                {label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-black transition-all group-hover:w-full" />
              </Link>
            ))}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-8">
            <button className="hidden sm:flex items-center gap-3 text-gray-300 hover:text-black transition-colors">
                <Search size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Search</span>
            </button>

            <div className="flex items-center gap-4 border-l border-gray-100 pl-8">
                {/* Cart */}
                <Link href="/cart" className="relative group">
                    <div className="p-3 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <ShoppingCart size={18} />
                    </div>
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-black text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* User Portal */}
                {user ? (
                    <div className="relative group">
                        <button className="flex items-center gap-4 bg-gray-50 p-2 rounded-full hover:bg-black hover:text-white transition-all group/btn">
                             <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black italic border border-white/20">
                                {user.name?.charAt(0)}
                             </div>
                        </button>
                        
                        <div className="absolute right-0 top-full mt-6 w-64 bg-white rounded-3xl shadow-2xl py-4 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 border border-gray-100">
                            <div className="px-6 py-4 border-b border-gray-50">
                                <p className="text-xs font-black uppercase tracking-widest text-black">{user.name}</p>
                                <p className="text-[10px] font-bold text-gray-400 truncate">{user.email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                                <Link href="/account" className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-black transition-all rounded-2xl">
                                    <User size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Account</span>
                                </Link>
                                <Link href="/orders" className="flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-gray-50 hover:text-black transition-all rounded-2xl">
                                    <Package size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Orders</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-4 px-4 py-3 text-gray-400 hover:bg-black hover:text-white transition-all rounded-2xl"
                                >
                                    <LogOut size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href="/login" className="px-8 py-3.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10">
                        Access Portal
                    </Link>
                )}

                {/* Mobile Trigger */}
                <button 
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="lg:hidden p-3 bg-gray-50 rounded-full hover:bg-black hover:text-white transition-all"
                >
                    {mobileOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-[110] animate-in slide-in-from-right duration-500 flex flex-col p-12">
            <div className="flex justify-between items-center mb-24">
                <span className="text-2xl font-black uppercase tracking-tighter">SELLER</span>
                <button onClick={() => setMobileOpen(false)} className="p-4 bg-gray-50 rounded-full"><X size={24} /></button>
            </div>
            <nav className="flex flex-col gap-12">
                {['Home', 'Archive', 'Atelier', 'Registry'].map((label, idx) => (
                    <Link 
                        key={label} 
                        href={idx === 0 ? '/' : idx === 1 ? '/products' : '/'} 
                        className="text-5xl font-black uppercase tracking-tighter italic"
                        onClick={() => setMobileOpen(false)}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Identity Control</p>
                {user ? (
                    <div className="flex flex-col gap-6">
                        <Link href="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-4 text-xl font-black uppercase italic"><Package /> My Orders</Link>
                        <button onClick={handleLogout} className="flex items-center gap-4 text-xl font-black uppercase italic"><LogOut /> Sign Out</button>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-4 text-xl font-black uppercase italic"><User /> Login</Link>
                )}
            </div>
        </div>
      )}
    </header>
  );
}
