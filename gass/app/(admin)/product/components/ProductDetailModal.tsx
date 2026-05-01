"use client";

import React from "react";
import { X, Box, Info, BarChart3, Clock, LayoutGrid, Star } from "lucide-react";
import { IProduct } from "@/types/product";
import { getImageUrl } from "@/constant/config";

interface ProductDetailModalProps {
  product: IProduct;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  if (amount === undefined || amount === null) return "0 VNĐ";
  return new Intl.NumberFormat("vi-VN").format(amount || 0) + " VNĐ";
};

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center py-12 px-4 animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl max-h-[85vh] flex flex-col overflow-hidden border border-gray-100" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-white border-b border-gray-50 px-10 pt-12 pb-8 flex justify-between items-center">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 mb-2">Technical Dossier</h3>
            <h2 className="text-3xl font-black text-black tracking-tighter uppercase leading-none">{product.productName}</h2>
          </div>
          <button onClick={onClose} className="p-4 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto flex-1 space-y-12">
          {/* Media Assets Section */}
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                <LayoutGrid size={14} /> Registered Media Assets
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {product.thumbnail && (
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group">
                  <img src={getImageUrl(product.thumbnail)} alt="Primary" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase rounded-full">Primary</div>
                </div>
              )}
              {product.images?.filter(img => img !== product.thumbnail).map((image, index) => (
                <div key={index} className="aspect-[3/4] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 group">
                  <img src={getImageUrl(image)} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Base Specification */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                  <Info size={14} /> Base Specification
              </h4>
              <div className="bg-gray-50 rounded-[2rem] p-8 space-y-6">
                <div className="flex justify-between border-b border-gray-100 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">System UUID</span>
                    <span className="text-[11px] font-black text-black font-mono">{product.productId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Classification</span>
                    <span className="text-[11px] font-black text-black uppercase">{product.categoryName || "Uncategorized"}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Current Valuation</span>
                    <span className="text-2xl font-black text-black italic">{formatCurrency(product.basePrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Protocol Status</span>
                    <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${product.activeFlag === 1 ? 'bg-black text-white' : 'border border-gray-200 text-gray-300'}`}>
                        {product.activeFlag === 1 ? 'ACTIVE' : 'SUSPENDED'}
                    </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                  <BarChart3 size={14} /> Performance Metrics
              </h4>
              <div className="bg-black text-white rounded-[2rem] p-8 space-y-6 shadow-xl shadow-black/20">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Total Inventory</span>
                    <span className="text-xl font-black">{product.totalStock || 0} UNITS</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Market Volume</span>
                    <span className="text-xl font-black">{product.soldCount || 0} SOLD</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Market Reputation</span>
                    <div className="flex items-center gap-2">
                        <Star size={14} className="fill-white" />
                        <span className="text-xl font-black">{product.rating || "N/A"}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40">Variant Depth</span>
                    <span className="text-xl font-black">{product.variantCount || 0} TYPES</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 italic">
                  <Box size={14} /> Essence & Narrative
              </h4>
              <div className="bg-gray-50/50 p-10 rounded-[2.5rem] border border-gray-100">
                <p className="text-[11px] font-bold text-gray-500 uppercase leading-loose tracking-widest">{product.description}</p>
              </div>
            </div>
          )}

          {/* Timeline Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-50">
            <div className="flex items-center gap-4 text-gray-300">
                <Clock size={16} />
                <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block">Initialized</span>
                    <span className="text-[10px] font-bold">{product.createdAt ? new Date(product.createdAt).toLocaleString("vi-VN") : "PROTOCOL_BEGIN"}</span>
                </div>
            </div>
            <div className="flex items-center gap-4 text-gray-300">
                <Clock size={16} />
                <div>
                    <span className="text-[8px] font-black uppercase tracking-widest block">Last Modification</span>
                    <span className="text-[10px] font-bold">{product.updatedAt ? new Date(product.updatedAt).toLocaleString("vi-VN") : "NO_MODS"}</span>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-10 bg-white border-t border-gray-50 flex justify-end">
          <button onClick={onClose} className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-black/20">
            Exit Dossier
          </button>
        </div>
      </div>
    </div>
  );
};