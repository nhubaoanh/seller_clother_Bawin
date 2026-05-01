'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuthStore } from '@/lib/store';
import { orderService } from '@/lib/services/orderService';
import { formatCurrency } from '@/lib/helpers';
import { 
  ShoppingBag, Package, Truck, CheckCircle2, Clock, 
  XCircle, ChevronRight, Search, Filter, Calendar, CreditCard, MapPin
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

export default function OrdersPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/orders');
      return;
    }
    if (!isLoading && user) {
      fetchOrders();
    }
  }, [user, isLoading]);

  const fetchOrders = async () => {
    try {
      const res = await orderService.getMyOrders();
      if (res.success) {
        setOrders(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.orderStatus === 0;
    if (activeTab === 'paid') return order.orderStatus === 1;
    if (activeTab === 'shipping') return order.orderStatus === 2;
    if (activeTab === 'completed') return order.orderStatus === 3;
    if (activeTab === 'cancelled') return order.orderStatus === 4;
    return true;
  });

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 italic uppercase tracking-tighter">Đơn hàng của tôi</h1>
            <p className="text-gray-500 mt-1">Theo dõi trạng thái và lịch sử mua sắm của bạn</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-2xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm">
            <ShoppingBag className="w-4 h-4" /> Tiếp tục mua sắm
          </Link>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'pending', label: 'Chờ xác nhận' },
            { id: 'paid', label: 'Đã thanh toán' },
            { id: 'shipping', label: 'Đang giao' },
            { id: 'completed', label: 'Hoàn thành' },
            { id: 'cancelled', label: 'Đã hủy' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
                : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map(order => {
              const StatusIcon = STATUS_MAP[order.orderStatus]?.icon || Clock;
              const statusStyle = STATUS_MAP[order.orderStatus] || STATUS_MAP[0];

              return (
                <div key={order.orderId} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${statusStyle.color}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đơn hàng</span>
                            <span className="text-sm font-black text-gray-900">#{order.orderId}</span>
                          </div>
                          <div className={`mt-1 inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${statusStyle.color}`}>
                            {statusStyle.label}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(order.createdAt)}
                        </div>
                        <div className="text-2xl font-black text-rose-600 italic">
                          {formatCurrency(order.totalPrice)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 rounded-2xl p-4 mb-6 border border-gray-100/50">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                        <div className="text-sm text-gray-600 leading-relaxed">
                          <span className="font-bold text-gray-900">{order.phone}</span>
                          <span className="mx-2 text-gray-300">|</span>
                          {order.shippingAddress}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-600 font-medium">
                          {PAYMENT_MAP[order.paymentMethod] || 'Không xác định'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {/* Hiển thị ảnh mẫu (cần join thêm ảnh sản phẩm trong thực tế) */}
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500 overflow-hidden">
                          <Package className="w-5 h-5" />
                        </div>
                      </div>
                      <Link 
                        href={`/orders/${order.orderId}`}
                        className="flex items-center gap-2 text-sm font-black text-rose-600 hover:text-rose-700 transition group-hover:translate-x-1 duration-300"
                      >
                        CHI TIẾT ĐƠN HÀNG <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-[3rem] py-20 px-8 text-center border-2 border-dashed border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 italic">CHƯA CÓ ĐƠN HÀNG NÀO</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                Có vẻ như bạn chưa thực hiện đơn hàng nào. Hãy khám phá bộ sưu tập mới nhất của chúng tôi ngay!
              </p>
              <Link href="/products" className="inline-block bg-rose-600 text-white font-black px-10 py-4 rounded-2xl hover:bg-rose-700 transition shadow-lg shadow-rose-200 uppercase tracking-widest text-sm">
                Bắt đầu mua sắm
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
