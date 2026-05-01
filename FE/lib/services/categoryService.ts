import { beClient } from './apiClient';

export const categoryService = {
  // Get all categories
  async getAll() {
    return beClient.get('/categories');
  },

  // Admin: Upsert category (Create or Update)
  async upsert(data: { categoryId?: string; categoryName: string; description: string; adminId: string }) {
    return beClient.post('/categories', data);
  },

  // Admin: Delete category
  async delete(categoryId: string, adminId: string) {
    return beClient.delete(`/categories/${categoryId}`, { adminId });
  },
};
