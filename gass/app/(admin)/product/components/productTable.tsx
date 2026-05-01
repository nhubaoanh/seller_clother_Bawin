"use client";

import React, { useState, useMemo } from "react";
import {
  Edit,
  Trash2,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Copy,
  ExternalLink,
  Package,
  TrendingUp,
  Star,
} from "lucide-react";
import { IProduct } from "@/types/product";
import { ProductDetailModal } from "./ProductDetailModal";
import { getImageUrl } from "@/constant/config";

type SortField = 'productName' | 'basePrice' | 'totalStock' | 'soldCount' | 'rating' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface ProductTableProps {
  data: IProduct[];
  isLoading: boolean;
  pageIndex: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onEdit: (product: IProduct) => void;
  onDelete: (product: IProduct) => void;
  onBulkDelete?: (productIds: string[]) => void;
}

const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN").format(amount || 0) + " VNĐ";
};

export const ProductTable: React.FC<ProductTableProps> = ({
  data,
  isLoading,
  pageIndex,
  pageSize,
  totalRecords,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  onBulkDelete,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const sortedData = useMemo(() => {
    if (!data.length) return data;
    return [...data].sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (sortDirection === 'asc') return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    });
  }, [data, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown size={12} className="opacity-20" />;
    return sortDirection === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedProducts(new Set(data.map(p => p.productId)));
    else setSelectedProducts(new Set());
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (checked) newSelected.add(productId);
    else newSelected.delete(productId);
    setSelectedProducts(newSelected);
  };

  const isAllSelected = data.length > 0 && selectedProducts.size === data.length;
  const isPartiallySelected = selectedProducts.size > 0 && selectedProducts.size < data.length;

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'OUT OF STOCK', color: 'text-gray-300 italic' };
    if (stock < 10) return { text: 'LOW STOCK', color: 'text-black font-black underline' };
    return { text: 'OPTIMAL', color: 'text-gray-400' };
  };

  return (
    <>
    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden relative min-h-[600px] flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 z-20 flex items-center justify-center">
            <Loader2 className="text-black w-12 h-12 animate-spin" />
        </div>
      )}

      {selectedProducts.size > 0 && (
        <div className="bg-black text-white p-6 flex items-center justify-between animate-in slide-in-from-top duration-500">
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Selected {selectedProducts.size} Units</span>
            <div className="flex gap-4">
              {onBulkDelete && (
                <button onClick={() => onBulkDelete(Array.from(selectedProducts))} className="px-6 py-2 bg-white text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Revoke Selected</button>
              )}
              <button onClick={() => setSelectedProducts(new Set())} className="px-6 py-2 border border-white/20 text-white rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Deselect All</button>
            </div>
        </div>
      )}

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="p-8 w-12 text-center sticky left-0 bg-gray-50 z-10">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded-full border-gray-200 text-black focus:ring-black"
                />
              </th>
              <th className="p-8 w-12 text-center sticky left-12 bg-gray-50 z-10">#</th>
              <th className="p-8 text-center min-w-[140px]">Serial ID</th>
              <th className="p-8 min-w-[300px] cursor-pointer" onClick={() => handleSort('productName')}>
                <div className="flex items-center gap-3">Label {getSortIcon('productName')}</div>
              </th>
              <th className="p-8 text-center min-w-[160px]">Classification</th>
              <th className="p-8 text-right min-w-[140px] cursor-pointer" onClick={() => handleSort('basePrice')}>
                <div className="flex items-center justify-end gap-3">Price {getSortIcon('basePrice')}</div>
              </th>
              <th className="p-8 text-center min-w-[140px] cursor-pointer" onClick={() => handleSort('totalStock')}>
                <div className="flex items-center justify-center gap-3">Inventory {getSortIcon('totalStock')}</div>
              </th>
              <th className="p-8 text-center min-w-[140px] cursor-pointer" onClick={() => handleSort('soldCount')}>
                <div className="flex items-center justify-center gap-3">Volume {getSortIcon('soldCount')}</div>
              </th>
              <th className="p-8 text-center min-w-[140px]">Media</th>
              <th className="p-8 text-center min-w-[160px] sticky right-0 bg-gray-50 z-10 text-black">Control</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.length > 0 ? sortedData.map((product, index) => {
                const stockStatus = getStockStatus(product.totalStock || 0);
                const isSelected = selectedProducts.has(product.productId);
                return (
                  <tr key={product.productId} className={`hover:bg-gray-50/50 transition-all duration-300 group ${isSelected ? 'bg-gray-50' : ''}`}>
                    <td className="p-8 text-center sticky left-0 bg-white z-10 group-hover:bg-gray-50/50 transition-all">
                      <input type="checkbox" checked={isSelected} onChange={(e) => handleSelectProduct(product.productId, e.target.checked)} className="w-4 h-4 rounded-full border-gray-200 text-black focus:ring-black" />
                    </td>
                    <td className="p-8 text-center text-gray-300 text-[10px] font-bold sticky left-12 bg-white z-10 group-hover:bg-gray-50/50 transition-all">
                      {(pageIndex - 1) * pageSize + index + 1}
                    </td>
                    <td className="p-8 text-center font-black text-gray-300 text-[10px] uppercase tracking-tighter italic">
                      {product.productId.slice(0, 10)}
                    </td>
                    <td className="p-8">
                      <div className="font-black text-black text-xs uppercase tracking-tight group-hover:underline cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.productName}</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Ref: {product.productId.slice(-6)}</div>
                    </td>
                    <td className="p-8 text-center">
                      <span className="px-3 py-1 border border-gray-100 text-gray-400 text-[9px] font-black uppercase rounded-full">{product.categoryName || "UNCATEGORIZED"}</span>
                    </td>
                    <td className="p-8 text-right font-black text-black text-sm italic">{formatCurrency(product.basePrice)}</td>
                    <td className="p-8 text-center">
                      <div className="font-black text-black text-xs">{product.totalStock || 0}</div>
                      <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${stockStatus.color}`}>{stockStatus.text}</div>
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp size={12} className="text-gray-300" />
                        <span className="font-black text-black text-xs">{product.soldCount || 0}</span>
                      </div>
                    </td>
                    <td className="p-8 text-center">
                      <div className="w-16 h-20 mx-auto bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:ring-4 ring-gray-100 transition-all">
                        {product.thumbnail ? (
                          <img src={getImageUrl(product.thumbnail)} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200"><Package size={20} /></div>
                        )}
                      </div>
                    </td>
                    <td className="p-8 text-center sticky right-0 bg-white z-10 group-hover:bg-gray-50/50 transition-all">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                        <button onClick={() => setSelectedProduct(product)} className="p-3 bg-white border border-gray-100 text-black hover:bg-black hover:text-white rounded-full transition-all"><Eye size={14} /></button>
                        <button onClick={() => onEdit(product)} className="p-3 bg-white border border-gray-100 text-black hover:bg-black hover:text-white rounded-full transition-all"><Edit size={14} /></button>
                        <button onClick={() => onDelete(product)} className="p-3 bg-white border border-gray-100 text-red-600 hover:bg-black hover:text-white rounded-full transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              }) : !isLoading && (
                <tr>
                  <td colSpan={10} className="p-32 text-center text-gray-300">
                    <FileSpreadsheet size={64} className="mx-auto mb-6 opacity-5" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em]">Inventory Registry Empty</p>
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-8 border-t border-gray-50 flex items-center justify-between mt-auto">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Scanning <b className="text-black">{totalRecords}</b> Master Units</span>
        <div className="flex items-center gap-6">
          <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer">
            <option value={10}>Show 10</option>
            <option value={20}>Show 20</option>
            <option value={50}>Show 50</option>
          </select>
          <div className="flex items-center gap-3">
            <button onClick={() => onPageChange(Math.max(1, pageIndex - 1))} disabled={pageIndex === 1} className="p-3 border border-gray-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all"><ChevronLeft size={16} /></button>
            <span className="text-[11px] font-black uppercase px-4 tracking-widest">{pageIndex} / {totalPages || 1}</span>
            <button onClick={() => onPageChange(pageIndex + 1)} disabled={data.length < pageSize} className="p-3 border border-gray-100 rounded-full disabled:opacity-20 hover:bg-black hover:text-white transition-all"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
    {selectedProduct && <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </>
  );
};