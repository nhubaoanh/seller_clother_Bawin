'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, ArrowRight, X } from 'lucide-react';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function SuccessModal({ isOpen, onClose, productName }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 text-center">
          {/* Animated Icon Container */}
          <div className="relative mx-auto w-20 h-20 mb-6">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20" />
            <div className="relative flex items-center justify-center w-full h-full bg-green-50 rounded-full border-2 border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">Thành công!</h3>
          <p className="text-gray-500 mb-6 leading-relaxed">
            Sản phẩm <span className="font-semibold text-gray-800">{productName || 'của bạn'}</span> đã được thêm vào giỏ hàng.
          </p>

          <div className="space-y-3">
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-rose-600 to-pink-500 text-white py-3.5 rounded-2xl font-bold hover:opacity-90 transition shadow-lg shadow-rose-200"
            >
              <ShoppingBag size={18} />
              Xem giỏ hàng
            </Link>
            
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full bg-gray-50 text-gray-700 py-3.5 rounded-2xl font-semibold hover:bg-gray-100 transition border border-gray-100"
            >
              Tiếp tục mua sắm
              <ArrowRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Decorative Bottom Bar */}
        <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500" />
      </div>
    </div>
  );
}
