'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const response = await fetch('/api/wishlists');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      if (data.success) {
        setWishlists(data.data.wishlists);
      }
    } catch (error) {
      console.error('Failed to fetch wishlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlists/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchWishlists();
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      if (response.ok) {
        alert('Đã thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Danh sách yêu thích</h1>

        {wishlists.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Danh sách yêu thích của bạn trống</p>
            <Link
              href="/products"
              className="inline-block bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlists.map((w) => (
              <div key={w.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={w.product.image}
                  alt={w.product.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <Link href={`/products/${w.product.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-rose-600 transition line-clamp-2">
                      {w.product.name}
                    </h3>
                  </Link>
                  <p className="text-rose-600 font-bold mt-2">
                    {formatCurrency(w.product.price)}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAddToCart(w.product.id)}
                      className="flex-1 bg-rose-600 text-white py-2 rounded-lg hover:bg-rose-700 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Thêm
                    </button>
                    <button
                      onClick={() => handleRemove(w.id)}
                      className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
