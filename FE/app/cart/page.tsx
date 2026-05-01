'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { cartService } from '@/lib/services/cartService';
import { couponService } from '@/lib/services/couponService';

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await cartService.get();
      if (res.success) {
        setCart(res.data);
      } else {
        setCart(null);
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (itemId: string, qty: number) => {
    if (qty < 1) { 
      handleRemove(itemId); 
      return; 
    }
    
    setUpdating(itemId);
    
    try {
      // Call API to update
      const res = await cartService.updateItem(itemId, qty);
      
      if (res.success && cart && cart.items) {
        const updatedItems = cart.items.map((item: any) => 
          item.id === itemId || item.productId === itemId ? { ...item, quantity: qty } : item
        );
        
        const subtotal = updatedItems.reduce((sum: number, item: any) => 
          sum + (item.price * item.quantity), 0
        );
        
        setCart({
          ...cart,
          items: updatedItems,
          subtotal,
          total: subtotal
        });
        
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Update quantity error:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdating(itemId);
    
    try {
      const res = await cartService.removeItem(itemId);
      
      if (res.success && cart && cart.items) {
        const updatedItems = cart.items.filter((item: any) => item.id !== itemId && item.productId !== itemId);
        
        const subtotal = updatedItems.reduce((sum: number, item: any) => 
          sum + (item.price * item.quantity), 0
        );
        
        setCart({
          ...cart,
          items: updatedItems,
          subtotal,
          total: subtotal
        });
        
        window.dispatchEvent(new Event('cart-updated'));
      }
    } catch (error) {
      console.error('Remove item error:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMsg(null);
    const res = await couponService.validate(couponCode, cart?.subtotal || 0);
    if (res.success && res.data) {
      const amt = res.data?.data?.discountAmount ?? 0;
      setDiscount(amt);
      setCouponMsg({ type: 'ok', text: `✓ Tiết kiệm ${formatCurrency(amt)}` });
    } else {
      setDiscount(0);
      setCouponMsg({ type: 'err', text: res.error || 'Mã không hợp lệ' });
    }
  };

  const handleCheckout = () => {
    router.push(`/checkout/new?coupon=${couponCode}`);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
            <div className="h-48 bg-gray-200 rounded-2xl" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Empty cart ── */
  if (!cart || cart.items?.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="w-28 h-28 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="w-14 h-14 text-rose-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Giỏ hàng trống</h2>
          <p className="text-gray-500 mb-8">Hãy thêm sản phẩm yêu thích vào giỏ hàng nhé!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-500 text-white px-8 py-3.5 rounded-2xl font-semibold hover:opacity-90 transition shadow-lg"
          >
            Khám phá sản phẩm <ArrowRight className="w-5 h-5" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const finalTotal = (cart.total || 0) - discount;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Giỏ hàng của tôi</h1>
            <p className="text-sm text-gray-500">{cart.items.length} sản phẩm</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Items list ── */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item: any) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 flex gap-4 shadow-sm transition-opacity duration-200 ${updating === item.id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                {/* Image */}
                <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.image || 'https://via.placeholder.com/100'}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-xl border border-gray-100"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-rose-600 transition line-clamp-2 text-sm leading-snug">
                      {item.product.name}
                    </h3>
                  </Link>
                  {item.variant && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.variant.size && `Cỡ: ${item.variant.size}`}
                      {item.variant.color && ` · Màu: ${item.variant.color}`}
                    </p>
                  )}
                  <p className="text-rose-600 font-bold mt-1">{formatCurrency(item.product.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-300 hover:text-red-500 transition"
                        aria-label="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm text-rose-600 hover:text-rose-700 font-medium mt-2 transition w-fit"
            >
              ← Tiếp tục mua sắm
            </Link>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1 space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-rose-500" />
                <h3 className="font-semibold text-gray-900 text-sm">Mã giảm giá</h3>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(null); }}
                  placeholder="Nhập mã..."
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-400 transition"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 transition"
                >
                  Áp dụng
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 ${couponMsg.type === 'ok' ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-4">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính ({cart.items.length} sp)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế VAT (10%)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(cart.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Vận chuyển
                  </span>
                  <span className={cart.shipping === 0 ? 'text-green-600 font-semibold' : 'font-medium text-gray-900'}>
                    {cart.shipping === 0 ? 'Miễn phí' : formatCurrency(cart.shipping)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá coupon</span>
                    <span className="font-semibold">-{formatCurrency(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-dashed border-gray-200 my-4" />

              <div className="flex justify-between items-center mb-5">
                <span className="font-bold text-gray-900">Tổng thanh toán</span>
                <span className="text-xl font-extrabold text-rose-600">{formatCurrency(Math.max(0, finalTotal))}</span>
              </div>

              {/* Free shipping hint */}
              {cart.shipping > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 mb-4 flex items-start gap-2">
                  <Truck className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    Thêm <strong>{formatCurrency(500000 - cart.subtotal)}</strong> để được miễn phí vận chuyển!
                  </span>
                </div>
              )}

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-rose-600 to-pink-500 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Tiến hành thanh toán
                <ArrowRight className="w-5 h-5" />
              </button>

              {/* Payment icons */}
              <div className="flex justify-center gap-3 mt-4 opacity-60">
                {['💳 VNPAY', '🏦 COD', '🔒 Bảo mật'].map((m) => (
                  <span key={m} className="text-xs text-gray-500">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
