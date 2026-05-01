export interface Category {
  categoryId: string;
  categoryName: string;
  description?: string;
  activeFlag: number;
  userCreateId?: string;
  luUserId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}