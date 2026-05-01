"use client";
import React, { useState } from "react";
import {
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getDashboardStatistics } from "@/service/dashboard.service";
import { DashboardFilterType, IDashboardParams } from "@/types/dashboard";

const COLORS = ["#000000", "#404040", "#737373", "#a3a3a3", "#d4d4d4"];

const FILTER_OPTIONS: { value: DashboardFilterType; label: string }[] = [
  { value: "1M", label: "1 Tháng" },
  { value: "3M", label: "3 Tháng" },
  { value: "6M", label: "6 Tháng" },
  { value: "1Y", label: "1 Năm" },
  { value: "ALL", label: "Tất cả" },
];

const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return "0 VNĐ";
  if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)} Tỷ VNĐ`;
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} Tr VNĐ`;
  return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

// KPI Card Component - B&W Style
const KPICard = ({ title, value, subValue, icon: Icon, trend }: any) => (
  <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:border-black transition-all duration-500 group">
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 italic">{title}</p>
        <p className="text-3xl font-black text-black mb-2 tracking-tighter">{value}</p>
        {subValue && (
          <div className={`flex items-center gap-1 text-[11px] font-bold ${
            trend === 'up' ? 'text-black' : 
            trend === 'down' ? 'text-gray-400' : 
            'text-gray-400'
          }`}>
            {trend === 'up' && <TrendingUp size={12} />}
            {trend === 'down' && <TrendingDown size={12} />}
            <span>{subValue}</span>
          </div>
        )}
      </div>
      <div className="p-5 rounded-full bg-black group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-black/20">
        <Icon size={28} className="text-white" />
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [filterType, setFilterType] = useState<DashboardFilterType>("1M");

  const params: IDashboardParams = {
    filter_type: filterType,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", params],
    queryFn: () => getDashboardStatistics(params),
  });

  const summary = data?.summary;
  const orderByStatus = data?.orderByStatus || [];
  const topProducts = data?.topProducts || [];
  const revenueByMonth = data?.revenueByMonth || [];
  const recentOrders = data?.recentOrders || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-black" />
            <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Synchronizing Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 p-10 bg-white min-h-screen text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-gray-100 pb-10">
        <div>
          <h1 className="text-5xl font-black text-black tracking-tighter flex items-center gap-4 uppercase leading-none">
            Dashboard <span className="text-gray-200">/</span> Stats
          </h1>
          <div className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mt-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full animate-pulse" />
            Live business performance analytics
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-100 shadow-inner">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilterType(option.value)}
              className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                filterType === option.value ? "bg-black text-white shadow-lg" : "text-gray-400 hover:text-black"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <KPICard
          title="Revenue (Doanh thu)"
          value={formatCurrency(summary?.total_sale_revenue || 0)}
          subValue={`Orders: ${summary?.total_sale_orders}`}
          icon={DollarSign}
          trend="up"
        />
        <KPICard
          title="Import Cost (Giá vốn)"
          value={formatCurrency(summary?.total_import_cost || 0)}
          subValue="Total stock inbound"
          icon={Package}
        />
        <KPICard
          title="Net Profit (Lợi nhuận)"
          value={formatCurrency(summary?.profit || 0)}
          subValue={summary?.profit >= 0 ? "Growth phase" : "Investment phase"}
          icon={TrendingUp}
          trend={summary?.profit >= 0 ? "up" : "down"}
        />
        <KPICard
          title="Customers (Khách)"
          value={summary?.total_customers || 0}
          subValue="Active memberships"
          icon={Users}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Comparison Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black">Revenue Timeline (6 Months)</h3>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <div className="w-3 h-3 bg-black rounded-full" /> Revenue
                </div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="month_label" axisLine={false} tickLine={false} fontSize={11} fontWeight={900} />
                <YAxis axisLine={false} tickLine={false} fontSize={11} tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip 
                  cursor={{fill: '#f9f9f9'}}
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '20px' }} 
                />
                <Bar dataKey="revenue" fill="#000000" radius={[15, 15, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black mb-10">Order Architecture</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderByStatus as any[]}
                  cx="50%" cy="50%"
                  innerRadius={80} outerRadius={120}
                  paddingAngle={10}
                  dataKey="count" nameKey="status_label"
                >
                  {orderByStatus.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '15px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Insights & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Top Products */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black italic">Best Sellers</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors">View All</button>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] group hover:bg-black transition-all duration-500">
                <div className="flex items-center gap-6">
                  <span className="text-2xl font-black text-gray-200 group-hover:text-white/20 transition-colors italic">0{idx + 1}</span>
                  <div>
                    <p className="font-black text-black group-hover:text-white transition-colors uppercase tracking-tight">{product.product_name}</p>
                    <p className="text-[9px] uppercase font-black text-gray-400 group-hover:text-white/50 tracking-[0.2em] mt-1">Volume: {product.total_sold}</p>
                  </div>
                </div>
                <p className="font-black text-black group-hover:text-white transition-colors">{formatCurrency(product.total_revenue)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black italic">Recent Activity</h3>
            <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors underline decoration-black">Orders Journal</button>
          </div>
          <div className="space-y-4">
            {recentOrders.map((order: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-5 border-b border-gray-50 group hover:bg-gray-50 transition-all rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-[10px] font-black italic shadow-lg shadow-black/10">
                        {order.customer_name?.charAt(0)}
                    </div>
                    <div>
                        <p className="font-black text-black text-xs uppercase tracking-tight">{order.customer_name}</p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">{formatDate(order.created_at)}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-sm">{formatCurrency(order.total_price)}</p>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-black text-white rounded-full mt-1 inline-block">
                        {order.status}
                    </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
