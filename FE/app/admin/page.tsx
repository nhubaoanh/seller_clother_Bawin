'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { LayoutDashboard, Package, ListTree, ShoppingCart, Users, LogOut, Search, Plus, Edit, Trash2, Check, X, Eye } from 'lucide-react';
import { productService } from '@/lib/services/productService';
import { categoryService } from '@/lib/services/categoryService';
import { orderService } from '@/lib/services/orderService';
import { formatCurrency } from '@/lib/helpers';
import Link from 'next/link';

type Tab = 'dashboard' | 'products' | 'categories' | 'orders';

export default function AdminPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(true);

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 0) {
      router.push('/login?redirect=/admin');
      return;
    }
    setLoading(false);
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [prodRes, catRes, orderRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        fetch('http://localhost:3000/api/orders/admin/all').then(r => r.json())
      ]);
      
      setProducts(prodRes.data || []);
      setCategories(catRes.data || []);
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: number) => {
    try {
      // Using direct fetch for the new admin status endpoint
      const adminUpdateRes = await fetch('http://localhost:3000/api/orders/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, adminId: user!.id })
      }).then(r => r.json());

      if (adminUpdateRes.success) {
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  if (loading) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">JM</span>
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-rose-600 to-pink-500 bg-clip-text text-transparent">
              Admin Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Tổng quan" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<Package size={20} />} label="Sản phẩm" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
          <SidebarLink icon={<ListTree size={20} />} label="Danh mục" active={activeTab === 'categories'} onClick={() => setActiveTab('categories')} />
          <SidebarLink icon={<ShoppingCart size={20} />} label="Đơn hàng" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition font-medium">
            <LogOut size={20} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-800 capitalize">
            {activeTab === 'dashboard' ? 'Bảng điều khiển' : activeTab === 'products' ? 'Quản lý sản phẩm' : activeTab === 'categories' ? 'Quản lý danh mục' : 'Quản lý đơn hàng'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Tìm kiếm..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 w-64" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">{user?.name?.charAt(0)}</div>
              <span className="text-sm font-semibold text-gray-700">{user?.name}</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <DashboardOverview products={products} orders={orders} categories={categories} />}
          {activeTab === 'products' && <ProductManager products={products} refresh={fetchDashboardData} />}
          {activeTab === 'categories' && <CategoryManager categories={categories} refresh={fetchDashboardData} />}
          {activeTab === 'orders' && <OrderManager orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition font-medium ${active ? 'bg-rose-500 text-white shadow-lg shadow-rose-100' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {icon} {label}
    </button>
  );
}

function DashboardOverview({ products, orders, categories }: any) {
  const totalRevenue = orders.filter((o: any) => o.paymentStatus === 1).reduce((acc: number, curr: any) => acc + curr.totalPrice, 0);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Doanh thu" value={formatCurrency(totalRevenue)} icon={<CreditCard className="text-emerald-500" />} color="bg-emerald-50" />
        <StatCard title="Đơn hàng" value={orders.length} icon={<ShoppingCart className="text-blue-500" />} color="bg-blue-50" />
        <StatCard title="Sản phẩm" value={products.length} icon={<Package className="text-rose-500" />} color="bg-rose-50" />
        <StatCard title="Danh mục" value={categories.length} icon={<ListTree className="text-amber-500" />} color="bg-amber-50" />
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Đơn hàng mới nhất</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm font-bold border-b border-gray-50">
                <th className="pb-4">Mã ĐH</th>
                <th className="pb-4">Khách hàng</th>
                <th className="pb-4">Tổng tiền</th>
                <th className="pb-4">Trạng thái</th>
                <th className="pb-4">Ngày đặt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order: any) => (
                <tr key={order.orderId} className="group">
                  <td className="py-4 font-bold text-gray-900">#{order.orderId}</td>
                  <td className="py-4 text-gray-600">{order.fullName}</td>
                  <td className="py-4 font-bold text-rose-600">{formatCurrency(order.totalPrice)}</td>
                  <td className="py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.orderStatus === 0 ? 'bg-amber-100 text-amber-600' : order.orderStatus === 1 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {order.orderStatus === 0 ? 'Chờ xử lý' : order.orderStatus === 1 ? 'Đã xác nhận' : 'Hoàn thành'}
                    </span>
                  </td>
                  <td className="py-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-extrabold text-gray-900">{value}</h4>
      </div>
      <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  );
}

// Minimalist versions of managers for demonstration
function ProductManager({ products, refresh }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold">Danh sách sản phẩm</h3>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">
          <Plus size={18} /> Thêm sản phẩm
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Ảnh</th>
            <th className="px-6 py-4">Tên sản phẩm</th>
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Giá gốc</th>
            <th className="px-6 py-4">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((p: any) => (
            <tr key={p.productId} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4"><img src={p.thumbnail} className="w-10 h-10 rounded-lg object-cover" /></td>
              <td className="px-6 py-4 font-bold text-gray-900">{p.productName}</td>
              <td className="px-6 py-4 text-gray-500">{p.categoryName}</td>
              <td className="px-6 py-4 font-bold text-rose-600">{formatCurrency(p.basePrice)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit size={16} /></button>
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CategoryManager({ categories, refresh }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold">Danh sách danh mục</h3>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition">
          <Plus size={18} /> Thêm danh mục
        </button>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">ID</th>
            <th className="px-6 py-4">Tên danh mục</th>
            <th className="px-6 py-4">Mô tả</th>
            <th className="px-6 py-4">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {categories.map((c: any) => (
            <tr key={c.categoryId} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-mono text-xs text-gray-400">{c.categoryId}</td>
              <td className="px-6 py-4 font-bold text-gray-900">{c.categoryName}</td>
              <td className="px-6 py-4 text-gray-500 text-sm">{c.description || 'N/A'}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"><Edit size={16} /></button>
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderManager({ orders, onUpdateStatus }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold">Danh sách đơn hàng</h3>
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-gray-400 text-xs font-bold uppercase tracking-wider">
          <tr>
            <th className="px-6 py-4">Mã ĐH</th>
            <th className="px-6 py-4">Khách hàng</th>
            <th className="px-6 py-4">Tổng tiền</th>
            <th className="px-6 py-4">Trạng thái</th>
            <th className="px-6 py-4">Thanh toán</th>
            <th className="px-6 py-4">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((o: any) => (
            <tr key={o.orderId} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 font-bold text-gray-900">#{o.orderId}</td>
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-gray-900">{o.fullName}</div>
                <div className="text-xs text-gray-500">{o.email}</div>
              </td>
              <td className="px-6 py-4 font-bold text-rose-600">{formatCurrency(o.totalPrice)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${o.orderStatus === 0 ? 'bg-amber-100 text-amber-600' : o.orderStatus === 1 ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                  {o.orderStatus === 0 ? 'Chờ duyệt' : o.orderStatus === 1 ? 'Đã xác nhận' : 'Hoàn thành'}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1.5 text-sm font-medium ${o.paymentStatus === 1 ? 'text-green-600' : 'text-amber-600'}`}>
                  {o.paymentStatus === 1 ? <Check size={14} /> : <Clock size={14} />}
                  {o.paymentStatus === 1 ? 'Đã thu' : 'Chưa thu'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition" title="Xem chi tiết"><Eye size={16} /></button>
                  {o.orderStatus === 0 && (
                    <button 
                      onClick={() => onUpdateStatus(o.orderId, 1)}
                      className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition" 
                      title="Xác nhận đơn hàng"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  {o.orderStatus === 1 && (
                    <button 
                      onClick={() => onUpdateStatus(o.orderId, 3)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition" 
                      title="Hoàn thành đơn hàng"
                    >
                      <Package size={16} />
                    </button>
                  )}
                  <button className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition" title="Hủy đơn hàng"><X size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function CreditCard(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
