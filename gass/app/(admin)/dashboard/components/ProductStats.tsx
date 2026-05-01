"use client";

import React from "react";
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Eye,
  Star,
  ShoppingCart
} from "lucide-react";
import { IProduct } from "@/types/product";

interface ProductStatsProps {
  products: IProduct[];
  isLoading?: boolean;
}

export const ProductStats: React.FC<ProductStatsProps> = ({ 
  products, 
  isLoading = false 
}) => {
  const stats = React.useMemo(() => {
    if (!products.length) {
      return {
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        lowStockProducts: 0,
        totalValue: 0,
        averagePrice: 0,
        totalSold: 0,
        averageRating: 0,
      };
    }

    const activeProducts = products.filter(p => p.activeFlag === 1);
    const inactiveProducts = products.filter(p => p.activeFlag === 0);
    const lowStockProducts = products.filter(p => (p.totalStock || 0) < 10);
    
    const totalValue = products.reduce((sum, p) => sum + (p.basePrice || 0), 0);
    const averagePrice = totalValue / products.length;
    
    const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
    
    const productsWithRating = products.filter(p => p.rating && p.rating > 0);
    const averageRating = productsWithRating.length > 0 
      ? productsWithRating.reduce((sum, p) => sum + (p.rating || 0), 0) / productsWithRating.length
      : 0;

    return {
      totalProducts: products.length,
      activeProducts: activeProducts.length,
      inactiveProducts: inactiveProducts.length,
      lowStockProducts: lowStockProducts.length,
      totalValue,
      averagePrice,
      totalSold,
      averageRating,
    };
  }, [products]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { 
      style: "currency", 
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = "blue",
    trend
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: "blue" | "green" | "red" | "yellow" | "purple" | "indigo";
    trend?: "up" | "down" | "neutral";
  }) => {
    const colorClasses = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      red: "bg-red-50 text-red-600 border-red-200",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200",
    };

    return (
      <div className={`p-6 rounded-lg border ${colorClasses[color]} transition-all hover:shadow-md`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium opacity-75">{title}</p>
            <p className="text-2xl font-bold mt-1">
              {isLoading ? (
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                value
              )}
            </p>
            {subtitle && (
              <p className="text-xs opacity-60 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="p-3 rounded-full bg-white/50">
            <Icon size={24} />
          </div>
        </div>
        
        {trend && (
          <div className="mt-3 flex items-center text-xs">
            <TrendingUp 
              size={14} 
              className={`mr-1 ${
                trend === 'up' ? 'text-green-500' : 
                trend === 'down' ? 'text-red-500' : 'text-gray-500'
              }`} 
            />
            <span className="opacity-75">
              {trend === 'up' ? 'Tăng' : trend === 'down' ? 'Giảm' : 'Ổn định'}
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={Package}
        title="Tổng sản phẩm"
        value={stats.totalProducts}
        subtitle="Tất cả sản phẩm"
        color="blue"
      />
      
      <StatCard
        icon={Eye}
        title="Đang kinh doanh"
        value={stats.activeProducts}
        subtitle={`${stats.inactiveProducts} ngừng bán`}
        color="green"
      />
      
      <StatCard
        icon={AlertTriangle}
        title="Sắp hết hàng"
        value={stats.lowStockProducts}
        subtitle="< 10 sản phẩm"
        color="yellow"
      />
      
      <StatCard
        icon={ShoppingCart}
        title="Đã bán"
        value={stats.totalSold.toLocaleString()}
        subtitle="Tổng số lượng"
        color="purple"
      />
      
      <StatCard
        icon={DollarSign}
        title="Giá trung bình"
        value={formatCurrency(stats.averagePrice)}
        subtitle="Trên mỗi sản phẩm"
        color="indigo"
      />
      
      <StatCard
        icon={Star}
        title="Đánh giá TB"
        value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "Chưa có"}
        subtitle={stats.averageRating > 0 ? "⭐ sao" : ""}
        color="yellow"
      />
      
      <div className="md:col-span-2 lg:col-span-2">
        <StatCard
          icon={DollarSign}
          title="Tổng giá trị kho"
          value={formatCurrency(stats.totalValue)}
          subtitle={`${stats.totalProducts} sản phẩm`}
          color="green"
        />
      </div>
    </div>
  );
};