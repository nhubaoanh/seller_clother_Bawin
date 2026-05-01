'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { orderService } from '@/lib/services/orderService';
import { formatCurrency, getImageUrl } from '@/lib/helpers';
import { 
  ArrowLeft, Clock, CreditCard, Truck, CheckCircle2, 
  XCircle, MapPin, Phone, Package, Calendar, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const STATUS_MAP: any = {
  0: { label: 'Chờ xác nhận', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: Clock },
  1: { label: 'Đã thanh toán', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: CreditCard },
  2: { label: 'Đang giao hàng', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', icon: Truck },
  3: { label: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
  4: { label: 'Đã hủy', color: 'text-rose-600 bg-rose-50 border-rose-100', icon: XCircle },
};

const PAYMENT_MAP: any = {
  1: 'Thanh toán khi nhận hàng (COD)',
  2: 'Chuyển khoản Ngân hàng',
  3: 'VNPAY-QR'
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const { user, isLoading: authLoading } = useAuthStore();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/orders/' + id);
      return;
    }
    if (!authLoading && user) {
      fetchOrderDetails();
    }
  }, [id, authLoading, user]);

  const fetchOrderDetails = async () => {
    try {
      const res = await orderService.getById(id);
      if (res.success) {
        setOrder(res.data);
      } else {
        router.push('/orders');
      }
    } catch (err) {
      console.error(err);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!order) return null;

  const statusStyle = STATUS_MAP[order.orderStatus] || STATUS_MAP[0];
  const StatusIcon = statusStyle.icon;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link href="/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-rose-600 transition mb-8 font-bold text-sm uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </Link>

        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 mb-8">
          {/* Header Section */}
          <div className="p-8 md:p-10 border-b border-gray-100 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-br from-white to-gray-50/50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Đơn hàng</span>
                <span className="text-xl font-black text-gray-900 tracking-tighter italic">#{order.orderId}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Calendar className="w-4 h-4" /> Đặt ngày {formatDate(order.createdAt)}
              </div>
            </div>
            <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${statusStyle.color}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-sm">{statusStyle.label}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Shipping Info */}
            <div className="p-8 md:p-10 border-r border-gray-100">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Thông tin nhận hàng</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Số điện thoại</p>
                    <p className="text-gray-900 font-bold">{order.phone}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Địa chỉ giao hàng</p>
                    <p className="text-gray-900 font-bold leading-relaxed">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="p-8 md:p-10 bg-gray-50/30">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Thanh toán</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Phương thức</p>
                    <p className="text-gray-900 font-bold">{PAYMENT_MAP[order.paymentMethod]}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">Trạng thái thanh toán</p>
                    <p className={`font-bold ${order.paymentStatus === 1 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {order.paymentStatus === 1 ? 'Đã hoàn tất' : 'Chờ xử lý'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Items */}
          <div className="p-8 md:p-10 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
              <Package className="w-4 h-4" /> Danh sách sản phẩm
            </h3>
            <div className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item: any, index: number) => (
                  <div key={item.orderDetailId || index} className="py-6 flex items-center gap-6 first:pt-0 last:pb-0 group">
                  <div className="w-24 h-24 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                    <img 
                      src={getImageUrl(item.thumbnail)} 
                      alt={item.productName} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                      onError={(e: any) => {
                        console.error('Image Load Error:', getImageUrl(item.thumbnail));
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-lg font-black text-gray-900 tracking-tight line-clamp-1 mb-1">{item.productName}</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {item.color} / {item.size}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400 font-bold italic">
                      {formatCurrency(item.price)} × {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-gray-900 italic tracking-tighter">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center text-gray-400 font-medium">
                Không có thông tin sản phẩm
              </div>
            )}
            </div>
          </div>

          {/* Order Summary Total */}
          <div className="p-8 md:p-10 bg-gray-900 text-white">
            <div className="max-w-xs ml-auto space-y-4">
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>Tạm tính</span>
                <span className="text-white">{formatCurrency(order.totalPrice / 1.1)}</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>Phí vận chuyển</span>
                <span className="text-emerald-400 italic">MIỄN PHÍ</span>
              </div>
              <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                <span>VAT (10%)</span>
                <span className="text-white">{formatCurrency(order.totalPrice - order.totalPrice / 1.1)}</span>
              </div>
              <div className="pt-4 border-t border-gray-800 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-rose-500 mb-1">Tổng cộng</span>
                <span className="text-4xl font-black italic tracking-tighter text-white">
                  {formatCurrency(order.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/products" 
            className="flex-1 bg-white text-gray-900 font-black px-8 py-5 rounded-2xl border-2 border-gray-900 text-center hover:bg-gray-900 hover:text-white transition duration-300 uppercase tracking-widest text-sm"
          >
            Mua sắm tiếp
          </Link>
          {order.orderStatus === 0 && (
            <button className="flex-1 bg-rose-600 text-white font-black px-8 py-5 rounded-2xl text-center hover:bg-rose-700 transition duration-300 shadow-xl shadow-rose-200 uppercase tracking-widest text-sm">
              Hủy đơn hàng
            </button>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
