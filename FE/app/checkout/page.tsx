'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast, { useToast } from '@/components/Toast';
import { useAuthStore } from '@/lib/store';
import { cartService } from '@/lib/services/cartService';
import { orderService } from '@/lib/services/orderService';
import { formatCurrency } from '@/lib/helpers';
import { MapPin, Phone, CreditCard, CheckCircle, Wallet, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toasts, success, error, removeToast } = useToast();

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK' | 'VNPAY'>('COD');

  // QR Code state
  const [showQR, setShowQR] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    setPhone(user.phone || '');
    setAddress(user.address || '');

    fetchCart();
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await cartService.get();
      if (res.success && res.data) {
        setCart(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cart?.items?.length) {
      error('Giỏ hàng trống!');
      return;
    }
    
    if (!phone || !address) {
      error('Vui lòng điền đầy đủ số điện thoại và địa chỉ giao hàng');
      return;
    }

    setSubmitting(true);

    const finalUserId = user?.id || (user as any)?.userId;
    const orderItems = (cart?.items || []).map((item: any) => ({
      productId: item.productId || item.product?.id || item.id,
      variantId: item.variantId || 'VAR001',
      quantity: Number(item.quantity || 1),
      price: Number(item.price || item.product?.price || 0)
    })).filter((item: any) => item.productId && item.quantity > 0);

    if (orderItems.length === 0) {
      error('Không thể xử lý dữ liệu sản phẩm. Vui lòng kiểm tra lại giỏ hàng.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await orderService.create({
        userId: finalUserId,
        items: orderItems,
        shippingAddress: address,
        phone: phone,
        paymentMethod: paymentMethod
      });

      if (res.success && res.data) {
        // Clear cart
        if (cart?.items) {
          for (const item of cart.items) {
            await cartService.removeItem(item.id);
          }
        }
        window.dispatchEvent(new Event('cart-updated'));

        if (paymentMethod === 'BANK' || paymentMethod === 'VNPAY') {
          setCreatedOrder(res.data);
          setShowQR(true);
        } else {
          success('Đặt hàng thành công!');
          setTimeout(() => router.push('/orders'), 1500);
        }
      } else {
        error(res.error || 'Đặt hàng thất bại');
      }
    } catch (err) {
      error('Đã xảy ra lỗi khi đặt hàng');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBankTransfer = async () => {
    try {
      setSubmitting(true);
      await orderService.updatePaymentStatus(createdOrder.orderId, 1);
      success('Đã xác nhận chuyển khoản!');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (err) {
      error('Lỗi cập nhật thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    );
  }

  // QR CODE SCREEN
  if (showQR && createdOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-rose-500 to-red-500" />
            <div className="flex justify-center mb-6">
              <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-1.png" alt="VNPAY" className="h-10 object-contain" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 italic">QUÉT MÃ ĐỂ THANH TOÁN</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
              Sử dụng ứng dụng Ngân hàng hoặc Ví VNPAY để quét mã QR và hoàn tất giao dịch
            </p>
            <div className="inline-block p-6 bg-white rounded-[2rem] border-[3px] border-blue-50 shadow-inner mb-8 relative">
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wider">
                Đang chờ...
              </div>
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VNPAY_PAYMENT_${createdOrder.orderId}_${createdOrder.totalPrice}`}
                alt="VNPAY QR"
                className="w-64 h-64 mx-auto rounded-xl shadow-lg border-8 border-white"
              />
              <div className="mt-8 text-left space-y-4 bg-blue-50/50 p-6 rounded-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-tight">Mã đơn hàng</span>
                  <span className="font-bold text-gray-900">{createdOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-tight">Số tiền</span>
                  <span className="font-black text-2xl text-rose-600">{formatCurrency(createdOrder.totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-tight">Ngân hàng</span>
                  <span className="font-bold text-gray-900">Vietcombank</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-tight">Số tài khoản</span>
                  <span className="font-bold text-gray-900 text-lg tracking-wider">1234567890</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium uppercase tracking-tight">Chủ tài khoản</span>
                  <span className="font-bold text-gray-900">JM FASHION STORE</span>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Nội dung chuyển khoản</p>
                  <p className="text-sm font-bold text-blue-700 bg-white inline-block px-4 py-2 rounded-xl border border-blue-100 shadow-sm italic">
                    THANH TOAN DON HANG {createdOrder.orderId}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button onClick={handleConfirmBankTransfer} disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CheckCircle className="w-5 h-5" />}
                Tôi đã chuyển khoản
              </button>
              <button onClick={() => router.push('/orders')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition">
                Thanh toán sau
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/cart" className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-600 transition mb-8 font-medium">
          <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                Thông tin giao hàng
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên người nhận</label>
                  <input type="text" value={user?.name || ''} readOnly className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 focus:outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại liên hệ</label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại..." className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                  <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ nhận hàng chi tiết..." rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition resize-none" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                Phương thức thanh toán
              </h2>
              <div className="space-y-4">
                <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'COD' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-rose-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'COD' && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Thanh toán khi nhận hàng (COD)</div>
                      <div className="text-sm text-gray-500">Thanh toán bằng tiền mặt khi giao hàng</div>
                    </div>
                  </div>
                  <Wallet className="w-8 h-8 text-gray-400" />
                  <input type="radio" name="payment" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="hidden" />
                </label>
                <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'BANK' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'BANK' ? 'border-rose-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'BANK' && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Chuyển khoản Ngân hàng</div>
                      <div className="text-sm text-gray-500">Thanh toán chuyển khoản 24/7</div>
                    </div>
                  </div>
                  <CreditCard className="w-8 h-8 text-gray-400" />
                  <input type="radio" name="payment" value="BANK" checked={paymentMethod === 'BANK'} onChange={() => setPaymentMethod('BANK')} className="hidden" />
                </label>
                <label className={`flex items-center justify-between p-5 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'VNPAY' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'VNPAY' ? 'border-rose-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'VNPAY' && <div className="w-3 h-3 bg-rose-500 rounded-full" />}
                    </div>
                    <div className="flex items-center gap-3">
                      <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-1.png" alt="VNPAY" className="h-6" />
                      <div>
                        <div className="font-bold text-gray-900">VNPAY-QR</div>
                        <div className="text-sm text-gray-500">Thanh toán qua ứng dụng Ngân hàng</div>
                      </div>
                    </div>
                  </div>
                  <input type="radio" name="payment" value="VNPAY" checked={paymentMethod === 'VNPAY'} onChange={() => setPaymentMethod('VNPAY')} className="hidden" />
                </label>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                {cart?.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100">
                      <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.product?.name}</h4>
                      <div className="text-xs text-gray-500 mt-1">SL: {item.quantity}</div>
                      <div className="text-sm font-bold text-rose-600 mt-1">{formatCurrency(item.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-6 space-y-3 mb-6">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span className="font-medium text-gray-900">{formatCurrency(cart?.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="font-medium text-gray-900">{cart?.shipping === 0 ? 'Miễn phí' : formatCurrency(cart?.shipping || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Thuế (10%)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(cart?.tax || 0)}</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
                  <span className="text-3xl font-extrabold text-rose-600">{formatCurrency(cart?.total || 0)}</span>
                </div>
              </div>
              <button onClick={handleCheckout} disabled={submitting || !cart?.items?.length} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:shadow-none">
                {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Xác nhận đặt hàng <ArrowRight className="w-5 h-5" /></>}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
