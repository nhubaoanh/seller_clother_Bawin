'use client';

import Link from 'next/link';
import { Star, ShoppingCart, Heart, Zap, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image?: string;
    images?: string[];
    price: number;
    originalPrice?: number;
    stock?: number;
    description?: string;
    rating?: number;
    ratingCount?: number;
  };
  onImageClick?: (product: any, index: number) => void;
  onAddToCart: (productId: string) => void;
  isAddingToCart?: boolean;
  showImageGallery?: boolean;
  className?: string;
}

export default function ProductCard({
  product,
  onImageClick,
  onAddToCart,
  isAddingToCart = false,
  showImageGallery = false,
  className = '',
}: ProductCardProps) {
  const allImages = [
    product.image,
    ...(product.images || []),
  ].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAddingToCart || !product.stock || product.stock < 1) return;
    onAddToCart(product.id);
  };

  return (
    <div className={`group flex flex-col space-y-6 ${className}`}>
      {/* Editorial Image Area */}
      <Link href={`/products/${product.id}`} className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2">
        <img
          src={allImages[0] || 'https://via.placeholder.com/400x600?text=ARCHIVE'}
          alt={product.name}
          className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
        />
        
        {/* Abstract Overlays */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        
        {/* Status Protocol */}
        <div className="absolute top-6 left-6 flex flex-col gap-2">
          {discount && discount > 0 && (
            <span className="bg-white text-black text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl">
              -{discount}%
            </span>
          )}
          {(!product.stock || product.stock < 1) && (
            <span className="bg-black text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-2xl">
              Depleted
            </span>
          )}
        </div>

        {/* Interaction Gate */}
        <div className="absolute inset-x-6 bottom-6 flex justify-between items-end opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
             <button 
                onClick={handleAddToCartClick}
                className="p-4 bg-white text-black rounded-full shadow-2xl hover:bg-black hover:text-white transition-all transform active:scale-90"
             >
                <ShoppingCart size={18} />
             </button>
             <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <ArrowUpRight size={18} />
             </div>
        </div>
      </Link>

      {/* Editorial Metadata */}
      <div className="space-y-4 px-2 text-center">
        <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Catalog Registry</h3>
            <Link href={`/products/${product.id}`}>
                <h2 className="text-xl font-black uppercase tracking-tighter leading-none italic group-hover:text-gray-400 transition-colors">
                    {product.name}
                </h2>
            </Link>
        </div>

        <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
                <span className="text-sm font-black italic">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                    <span className="text-[10px] font-bold text-gray-300 line-through tracking-widest">{formatCurrency(product.originalPrice)}</span>
                )}
            </div>
            <div className="w-4 h-[1px] bg-gray-100" />
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 h-1 rounded-full ${i < Math.round(product.rating || 0) ? 'bg-black' : 'bg-gray-100'}`} 
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}