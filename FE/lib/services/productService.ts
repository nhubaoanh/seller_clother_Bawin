import { beClient } from './apiClient';
import { getImageUrl } from '@/lib/helpers';

// Product interfaces
export interface Product {
  id: string;
  name: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  description: string;
  categoryId: string;
  categoryName: string;
  rating: number;
  ratingCount: number;
  sold: number;
  variantCount?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSearchParams {
  pageIndex?: number;
  pageSize?: number;
  q?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}

// Normalize product data from backend
export function normalizeProduct(p: any): Product | null {
  if (!p) return null;
  
  const rawImages = Array.isArray(p.images) ? p.images : (p.images ? p.images.split(',').filter(Boolean) : []);
  
  return {
    id: p.productId || p.id || '',
    name: p.productName || p.name || 'Unnamed Product',
    image: getImageUrl(p.thumbnail || p.image),
    images: rawImages.map((img: string) => getImageUrl(img)),
    price: parseFloat(p.basePrice || p.minPrice || p.price || 0),
    originalPrice: p.maxPrice && p.maxPrice !== p.basePrice ? parseFloat(p.maxPrice) : undefined,
    stock: parseInt(p.totalStock || p.stock || 0),
    description: p.description || '',
    categoryId: p.categoryId || '',
    categoryName: p.categoryName || '',
    rating: parseFloat(p.rating || 0),
    ratingCount: parseInt(p.ratingCount || p.reviewCount || 0),
    sold: parseInt(p.soldCount || p.sold || 0),
    variantCount: parseInt(p.variantCount || 0),
    minPrice: p.minPrice ? parseFloat(p.minPrice) : undefined,
    maxPrice: p.maxPrice ? parseFloat(p.maxPrice) : undefined,
  };
}

// Product service
export const productService = {
  // Get products with filters
  async getAll(params?: ProductSearchParams) {
    const query = new URLSearchParams();
    if (params?.pageIndex) query.set('pageIndex', String(params.pageIndex));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    if (params?.q) query.set('q', params.q);
    if (params?.categoryId) query.set('categoryId', params.categoryId);
    if (params?.minPrice) query.set('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    
    return beClient.get(`/products?${query}`);
  },

  // Get product by ID
  async getById(productId: string) {
    return beClient.get(`/products/${productId}`);
  },

  // Get products by category
  async getByCategory(categoryId: string, params?: { pageIndex?: number; pageSize?: number }) {
    const query = new URLSearchParams();
    if (params?.pageIndex) query.set('pageIndex', String(params.pageIndex));
    if (params?.pageSize) query.set('pageSize', String(params.pageSize));
    
    return beClient.get(`/products/category/${categoryId}?${query}`);
  },

  // Get product variants
  async getVariants(productId: string) {
    return beClient.get(`/products/${productId}/variants`);
  },

  // Admin: Create product
  async create(data: any) {
    return beClient.post('/products', data);
  },

  // Admin: Update product
  async update(productId: string, data: any) {
    return beClient.put(`/products/${productId}`, data);
  },

  // Admin: Delete product
  async delete(productId: string, adminId: string) {
    return beClient.delete(`/products/${productId}`, { 
      body: JSON.stringify({ adminId }) 
    });
  },
};