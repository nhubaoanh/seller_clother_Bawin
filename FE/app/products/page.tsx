'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Toast, { useToast } from '@/components/Toast';
import { useAddToCart } from '@/hooks/useAddToCart';
import { Search, SlidersHorizontal, LayoutGrid, X } from 'lucide-react';
import { normalizeProduct, productService } from '@/lib/services/productService';
import SuccessModal from '@/components/SuccessModal';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categoryId: '',
    sortBy: 'newest',
  });
  const [successModal, setSuccessModal] = useState({ isOpen: false, productName: '' });

  const { toasts, error, warning, removeToast } = useToast();
  const router = useRouter();

  // Add to cart functionality
  const { addToCart, isAddingToCart } = useAddToCart({
    onSuccess: (productId) => {
      const product = products.find(p => p.id === productId);
      setSuccessModal({ isOpen: true, productName: product?.name || '' });
    },
    onError: (errorMsg) => error(errorMsg),
    onAuthRequired: () => {
      warning('Vui lòng đăng nhập để mua hàng');
      router.push('/login');
    },
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.success) setCategories(data.data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Main Fetch Logic
  const fetchProducts = useCallback(async (query: string, categoryId: string, sortBy: string) => {
    setLoading(true);
    try {
      const params: any = { q: query, categoryId, sortBy };
      const result = await productService.getAll(params);

      if (result.success && result.data) {
        const rawProducts = Array.isArray(result.data) ? result.data : (result.data.data || []);
        const normalized = rawProducts.map(normalizeProduct).filter(Boolean);
        setProducts(normalized as any[]);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Instant Search with Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(searchTerm, filters.categoryId, filters.sortBy);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [searchTerm, filters.categoryId, filters.sortBy, fetchProducts]);

  const handleAddToCart = (productId: string) => {
    const product = products.find(p => p.id === productId);
    addToCart(productId, product);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      {/* Toasts */}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} duration={t.duration} onClose={() => removeToast(t.id)} />
      ))}

      {/* Success Modal */}
      <SuccessModal 
        isOpen={successModal.isOpen} 
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })} 
        productName={successModal.productName}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">COLLECTION</h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs">Phát huy phong cách riêng của bạn</p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full w-64 focus:ring-2 focus:ring-black transition-all outline-none text-sm"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black">
                    <X size={14} />
                  </button>
                )}
             </div>
             <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />
             <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                <LayoutGrid size={18} />
                <span className="hidden sm:inline">Grid View</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <section>
                <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <SlidersHorizontal size={14} /> Danh mục
                </h3>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => setFilters({ ...filters, categoryId: '' })}
                    className={`text-left py-1 transition-colors ${!filters.categoryId ? 'font-bold text-black border-l-2 border-black pl-3' : 'text-gray-500 hover:text-black pl-3'}`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat: any) => (
                    <button
                      key={cat.categoryId}
                      onClick={() => setFilters({ ...filters, categoryId: cat.categoryId })}
                      className={`text-left py-1 transition-colors ${filters.categoryId === cat.categoryId ? 'font-bold text-black border-l-2 border-black pl-3' : 'text-gray-500 hover:text-black pl-3'}`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-black uppercase tracking-widest mb-4">Sắp xếp</h3>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                  className="w-full bg-transparent border-b border-gray-200 py-2 outline-none text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price-asc">Giá: Thấp tới Cao</option>
                  <option value="price-desc">Giá: Cao tới Thấp</option>
                  <option value="popular">Phổ biến</option>
                </select>
              </section>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-4" />
                    <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <X className="text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">Chúng tôi không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={() => {setSearchTerm(''); setFilters({categoryId: '', sortBy: 'newest'})}} className="mt-4 text-xs font-bold underline uppercase tracking-widest">Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {products.map((p, idx) => (
                  <div key={p.id} className="fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ProductCard
                      product={p}
                      onAddToCart={handleAddToCart}
                      isAddingToCart={isAddingToCart(p.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      <style jsx>{`
        .fade-in {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
