export interface Product {
  productId: string;
  productName: string;
  categoryId?: string;
  description?: string;
  thumbnail?: string;
  basePrice?: number;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  images?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}