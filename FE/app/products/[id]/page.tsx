'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Toast, { useToast } from '@/components/Toast';
import { useAddToCart } from '@/hooks/useAddToCart';
import { ShoppingCart, Star, Heart, ArrowLeft, Truck, Shield, RefreshCw } from 'lucide-react';
import { formatCurrency } from '@/lib/helpers';
import { productService, Product, normalizeProduct } from '@/lib/services/productService';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Toast notifications
  const { toasts, success, error, warning, removeToast } = useToast();

  // Add to cart functionality
  const { addToCart, isAddingToCart } = useAddToCart({
    onSuccess: () => success('Đã thêm vào giỏ hàng!'),
    onError: (errorMsg) => error(errorMsg),
    onAuthRequired: () => warning('Vui lòng đăng nhập để mua hàng'),
  });

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await productService.getById(id);
      if (response.success && response.data) {
        const productData = response.data.data || response.data;
        
        // Use the centralized normalizeProduct function
        const normalizedProduct = normalizeProduct(productData);
          
        if (normalizedProduct) {
          setProduct(normalizedProduct);
          setSelectedImage(normalizedProduct.image);
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, product, quantity);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h1>
          <p className="text-gray-500 mb-6">Sản phẩm này không tồn tại hoặc đã bị xóa.</p>
          <Link href="/products" className="bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700 transition">
            Quay lại danh sách sản phẩm
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      {/* Toast notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-rose-600 transition">Trang chủ</Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-rose-600 transition">Sản phẩm</Link>
          {product.categoryName && (
            <>
              <span className="mx-2">/</span>
              <span className="hover:text-rose-600 transition cursor-pointer">{product.categoryName}</span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            
            {/* Product Images */}
            <div className="flex flex-col gap-4">
              <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
                <img 
                  src={selectedImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                {discount && discount > 0 && (
                  <div className="absolute top-4 left-4 bg-rose-600 text-white font-bold px-3 py-1 rounded-lg">
                    -{discount}%
                  </div>
                )}
              </div>
              
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                  {allImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === img ? 'border-rose-500' : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Rating & Sold */}
              <div className="flex items-center gap-4 mb-6 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-gray-900">{product.rating || 5.0}</span>
                  <span className="text-gray-500">({product.ratingCount || 0} đánh giá)</span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <div className="text-gray-500">
                  Đã bán <span className="font-medium text-gray-900">{product.sold || 0}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-8 p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-3xl font-bold text-rose-600">{formatCurrency(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through mb-1">{formatCurrency(product.originalPrice)}</span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-8">
                <span className="font-medium text-gray-700 min-w-[80px]">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-x border-gray-300 py-2 focus:outline-none"
                    min="1"
                    max={product.stock || 1}
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-600 transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock > 0 ? `${product.stock} sản phẩm có sẵn` : 'Hết hàng'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mb-10">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart(product.id) || !product.stock || product.stock < 1}
                  className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-lg transition shadow-sm ${
                    !product.stock || product.stock < 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-rose-600 hover:bg-rose-700 text-white hover:shadow-md'
                  }`}
                >
                  {isAddingToCart(product.id) ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingCart className="w-5 h-5" />
                  )}
                  {!product.stock || product.stock < 1 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
                
                <button className="px-5 py-4 border border-gray-300 rounded-xl hover:border-rose-600 hover:text-rose-600 hover:bg-rose-50 transition flex items-center justify-center group">
                  <Heart className="w-6 h-6 text-gray-400 group-hover:text-rose-600 transition" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Giao hàng miễn phí</p>
                    <p className="text-gray-500">Cho đơn từ 500K</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Đổi trả 30 ngày</p>
                    <p className="text-gray-500">Miễn phí đổi trả</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-gray-900">Cam kết chính hãng</p>
                    <p className="text-gray-500">Bảo hành 1 năm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mô tả sản phẩm</h2>
          <div className="prose prose-rose max-w-none text-gray-600">
            {product.description ? (
              product.description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))
            ) : (
              <p>Chưa có mô tả cho sản phẩm này.</p>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
