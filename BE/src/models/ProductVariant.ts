export interface ProductVariant {
  variantId: string;
  productId: string;
  size?: string;
  color?: string;
  price?: number;
  stock: number;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}