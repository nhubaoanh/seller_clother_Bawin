'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast, { useToast } from '@/components/Toast';
import {
  MapPin, Phone, CreditCard, Truck, ChevronRight, CheckCircle2,
  Loader2, ShoppingBag, ArrowLeft, Clipboard, CheckCircle
} from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { orderService } from '@/lib/services/orderService';
import { cartService } from '@/lib/services/cartService';

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  notes: string;
  paymentMethod: 'VNPAY' | 'COD';
}

const INITIAL_FORM: FormData = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  district: '',
  notes: '',
  paymentMethod: 'COD',
};

function Steps({ current }: { current: number }) {
  const steps = ['Giỏ hàng', 'Thông tin', 'Xác nhận'];
  return (
    <div className="flex items-center gap-2 mb-8 text-sm">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
            i < current ? 'bg-rose-600 text-white' :
            i === current ? 'bg-rose-600 text-white ring-4 ring-rose-100' :
            'bg-gray-200 text-gray-500'
          }`}>
            {i < current ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
          </div>
          <span className={`font-medium ${i === current ? 'text-rose-600' : i < current ? 'text-gray-900' : 'text-gray-400'}`}>
            {s}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponFromCart = searchParams.get('coupon') || '';
  const { toasts, success, error, removeToast } = useToast();

  const [cart, setCart] = useState<any>(null);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1); 
  
  // QR Payment State
  const [showQR, setShowQR] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  useEffect(() => {
    fetch('/api/cart')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setCart(data.data);
        else router.push('/login');
      })
      .catch(() => router.push('/cart'))
      .finally(() => setLoading(false));
  }, [router]);

  const set = (key: keyof FormData, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Partial<FormData> = {};
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên';
    if (!form.phone.trim()) errs.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|84)[0-9]{9,10}$/.test(form.phone.replace(/\s/g, '')))
      errs.phone = 'Số điện thoại không hợp lệ';
    if (!form.address.trim()) errs.address = 'Vui lòng nhập địa chỉ';
    if (!form.city.trim()) errs.city = 'Vui lòng chọn tỉnh/thành';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (validate()) setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!cart?.items?.length) {
      error('Giỏ hàng của bạn đang trống!');
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = `${form.address}, ${form.district ? form.district + ', ' : ''}${form.city}`;
      
      // CHUẨN BỊ DỮ LIỆU SẢN PHẨM (QUAN TRỌNG)
      const orderItems = cart.items.map((item: any) => ({
        productId: item.productId || item.product?.id || item.id,
        variantId: item.variantId || 'VAR001',
        quantity: Number(item.quantity || 1),
        price: Number(item.price || item.product?.price || 0)
      })).filter((item: any) => item.productId && item.quantity > 0);

      if (orderItems.length === 0) {
        error('Dữ liệu sản phẩm không hợp lệ. Vui lòng kiểm tra lại giỏ hàng.');
        setSubmitting(false);
        return;
      }

      const res = await orderService.create({
        userId: '', // Proxy sẽ tự điền từ cookie
        items: orderItems,
        shippingAddress: fullAddress,
        phone: form.phone,
        paymentMethod: form.paymentMethod,
      });

      if (res.success && res.data) {
        // Xóa giỏ hàng sau khi đặt thành công
        for (const item of cart.items) {
          await cartService.removeItem(item.id);
        }
        window.dispatchEvent(new Event('cart-updated'));

        if (form.paymentMethod === 'VNPAY') {
          setCreatedOrder(res.data);
          setShowQR(true);
        } else {
          success('Đặt hàng thành công!');
          setTimeout(() => router.push('/orders'), 1500);
        }
      } else {
        error(res.error || 'Đặt hàng thất bại. Vui lòng thử lại.');
      }
    } catch (err) {
      error('Có lỗi xảy ra trong quá trình đặt hàng.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmBankTransfer = async () => {
    try {
      setSubmitting(true);
      await orderService.updatePaymentStatus(createdOrder.orderId, 1);
      success('Đã xác nhận thanh toán thành công!');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (err) {
      error('Lỗi xác nhận thanh toán');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        </main>
        <Footer />
      </div>
    );
  }

  // MÀN HÌNH QUÉT MÃ QR
  if (showQR && createdOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        {toasts.map(t => <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />)}
        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-12">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-rose-500 to-red-500" />
            <div className="flex justify-center mb-6">
              <img src="https://vnpay.vn/wp-content/uploads/2020/07/Logo-VNPAYQR-1.png" alt="VNPAY" className="h-10 object-contain" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-2 italic">QUÉT MÃ ĐỂ THANH TOÁN</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Sử dụng ứng dụng Ngân hàng hoặc Ví VNPAY để quét mã</p>
            
            <div className="inline-block p-6 bg-white rounded-[2rem] border-[3px] border-blue-50 shadow-inner mb-8 relative">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=VNPAY_PAYMENT_${createdOrder.orderId}_${createdOrder.totalPrice}`}
                alt="QR Code"
                className="w-64 h-64 mx-auto rounded-xl shadow-lg border-8 border-white"
              />
              <div className="mt-8 text-left space-y-4 bg-blue-50/50 p-6 rounded-2xl">
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium">Mã đơn hàng</span>
                  <span className="font-bold text-gray-900">{createdOrder.orderId}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-blue-100">
                  <span className="text-blue-600 text-sm font-medium">Số tiền</span>
                  <span className="font-black text-2xl text-rose-600">{formatCurrency(createdOrder.totalPrice)}</span>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-xs text-gray-400 font-bold mb-1 uppercase tracking-widest">Nội dung chuyển khoản</p>
                  <p className="text-sm font-bold text-blue-700 bg-white inline-block px-4 py-2 rounded-xl border border-blue-100 italic">
                    THANH TOAN DON HANG {createdOrder.orderId}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              <button onClick={handleConfirmBankTransfer} disabled={submitting} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                Tôi đã chuyển khoản thành công
              </button>
              <button onClick={() => router.push('/orders')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 rounded-xl transition">
                Thanh toán sau
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      {toasts.map(t => <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />)}

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Steps current={step} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-5">
            {step === 1 ? (
              <>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <MapPin className="w-5 h-5 text-rose-500" />
                    <h2 className="font-bold text-gray-900">Thông tin giao hàng</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên *</label>
                      <input type="text" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} placeholder="Nguyễn Thị A" className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition ${errors.fullName ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="0912 345 678" className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition ${errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tỉnh / Thành phố *</label>
                      <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Hồ Chí Minh" className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition ${errors.city ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Quận / Huyện</label>
                      <input type="text" value={form.district} onChange={(e) => set('district', e.target.value)} placeholder="Quận 1" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ chi tiết *</label>
                      <input type="text" value={form.address} onChange={(e) => set('address', e.target.value)} placeholder="Số nhà, tên đường..." className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 transition ${errors.address ? 'border-red-400 bg-red-50' : 'border-gray-200'}`} />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5">
                    <CreditCard className="w-5 h-5 text-rose-500" />
                    <h2 className="font-bold text-gray-900">Phương thức thanh toán</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { value: 'COD', icon: '🚚', label: 'Thanh toán khi nhận hàng (COD)', desc: 'Trả tiền mặt khi giao hàng' },
                      { value: 'VNPAY', icon: '💳', label: 'Thanh toán VNPAY', desc: 'Quét mã QR thanh toán an toàn' },
                    ].map((pm) => (
                      <label key={pm.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${form.paymentMethod === pm.value ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input type="radio" name="payment" value={pm.value} checked={form.paymentMethod === pm.value} onChange={() => set('paymentMethod', pm.value as any)} className="sr-only" />
                        <span className="text-2xl">{pm.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">{pm.label}</p>
                          <p className="text-xs text-gray-500">{pm.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${form.paymentMethod === pm.value ? 'border-rose-500' : 'border-gray-300'}`}>
                          {form.paymentMethod === pm.value && <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link href="/cart" className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Quay lại
                  </Link>
                  <button onClick={handleContinue} className="flex-1 bg-gradient-to-r from-rose-600 to-pink-500 text-white py-3 rounded-2xl font-bold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2">
                    Xem lại đơn hàng <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="font-bold text-gray-900 mb-4">Xác nhận thông tin</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">{form.fullName}</p>
                        <p className="text-gray-600">{form.phone}</p>
                        <p className="text-gray-600">{form.address}, {form.district && form.district + ', '}{form.city}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      <CreditCard className="w-4 h-4 text-rose-500 flex-shrink-0" />
                      <p className="text-gray-700 font-medium">{form.paymentMethod === 'COD' ? '🚚 Thanh toán khi nhận hàng' : '💳 VNPAY-QR'}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex items-center gap-2 px-5 py-3 border border-gray-200 text-gray-600 rounded-2xl hover:bg-gray-50 transition text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> Sửa thông tin
                  </button>
                  <button onClick={handlePlaceOrder} disabled={submitting} className="flex-1 bg-gradient-to-r from-rose-600 to-pink-500 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Đang xử lý...</> : <><CheckCircle2 className="w-5 h-5" /> Đặt hàng ngay</>}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingBag className="w-4 h-4 text-rose-500" />
                <h3 className="font-bold text-gray-900 text-sm">Đơn hàng ({cart?.items?.length || 0} sản phẩm)</h3>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cart?.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="relative flex-shrink-0">
                      <img src={item.product?.image || 'https://via.placeholder.com/50'} alt={item.product?.name} className="w-12 h-12 object-cover rounded-lg" />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{item.quantity}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 line-clamp-1">{item.product?.name}</p>
                      {item.variant && <p className="text-[10px] text-gray-400">{item.variant.size} · {item.variant.color}</p>}
                    </div>
                    <span className="text-xs font-bold text-rose-600 flex-shrink-0">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatCurrency(cart?.subtotal || 0)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Thuế VAT</span><span>{formatCurrency(cart?.tax || 0)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Vận chuyển</span><span className={cart?.shipping === 0 ? 'text-green-600 font-semibold' : ''}>{cart?.shipping === 0 ? 'Miễn phí' : formatCurrency(cart?.shipping || 0)}</span></div>
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Tổng cộng</span>
                <span className="text-xl font-extrabold text-rose-600">{formatCurrency(cart?.total || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
