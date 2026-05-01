export interface IProduct {
  productId: string;
  productName: string;
  categoryId: string;
  categoryName?: string;
  description?: string;
  thumbnail?: string;
  basePrice: number;
  activeFlag: number;
  createdAt?: Date;
  updatedAt?: Date;
  userCreateId?: string;
  luUserId?: string;
  
  // Thông tin bổ sung từ stored procedure
  variantCount?: number;
  totalStock?: number;
  minPrice?: number;
  maxPrice?: number;
  images?: string[];
  rating?: number;
  ratingCount?: number;
  soldCount?: number;
}

export interface IProductVariant {
  variantId: string;
  productId: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  activeFlag: number;
  createdAt: Date;
  updatedAt: Date;
  userCreateId?: string;
  luUserId?: string;
}

export interface IProductImage {
  imageId: string;
  productId: string;
  imageUrl: string;
  activeFlag: number;
  createdAt: Date;
  updatedAt: Date;
  userCreateId?: string;
  luUserId?: string;
}

export interface ICategory {
  categoryId: string;
  categoryName: string;
  description: string;
  activeFlag: number;
  createdAt: Date;
  updatedAt: Date;
  userCreateId?: string;
  luUserId?: string;
}

export interface IProductSearch {
  search_content?: string;
  categoryId?: string;
  pageIndex: number;
  pageSize: number;
}

export interface IProductForm {
  productId?: string;
  productName: string;
  categoryId: string;
  description: string;
  thumbnail: string;
  basePrice: number;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
}

export interface IProductVariantForm {
  variantId?: string;
  productId: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
}