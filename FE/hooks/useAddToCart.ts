'use client';

import { useState } from 'react';

import { cartService } from '@/lib/services/cartService';
import { useAuthStore } from '@/lib/store';

export interface Product {
  id: string;
  name: string;
  stock?: number;
  [key: string]: any;
}

export interface UseAddToCartOptions {
  onSuccess?: (productId: string) => void;
  onError?: (error: string, productId: string) => void;
  onAuthRequired?: () => void;
}

export function useAddToCart(options: UseAddToCartOptions = {}) {
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const addToCart = async (productId: string, product?: Product, quantity: number = 1) => {
    const user = useAuthStore.getState().user;

    if (!user) {
      options.onAuthRequired?.();
      return;
    }

    if (addingToCart === productId) return;
    
    if (product && (!product.stock || product.stock < 1)) {
      options.onError?.('Sản phẩm đã hết hàng', productId);
      return;
    }

    setAddingToCart(productId);
    
    try {
      const response = await cartService.addItem(productId, quantity);
      
      if (response.success) {
        options.onSuccess?.(productId);
        window.dispatchEvent(new Event('cart-updated'));
      } else if (response.error === 'Unauthorized' || response.error?.includes('login')) {
        options.onAuthRequired?.();
      } else {
        const errorMsg = response.error || 'Không thể thêm vào giỏ hàng';
        options.onError?.(errorMsg, productId);
      }
    } catch (error) {
      options.onError?.('Không thể kết nối đến server', productId);
    } finally {
      setAddingToCart(null);
    }
  };

  const isAddingToCart = (productId: string) => addingToCart === productId;

  return {
    addToCart,
    isAddingToCart,
    addingToCart,
  };
}