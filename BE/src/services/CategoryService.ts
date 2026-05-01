import { injectable } from "tsyringe";
import { CategoryRepository } from "../repositories/CategoryRepository.js";

@injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) { }

  async searchCategories(pageIndex: number, pageSize: number, search: string) {
    try {
      const categories = await this.categoryRepository.getAllCategories(pageIndex, pageSize, search);
      const totalItems = await this.categoryRepository.getTotalCount(search);
      const pageCount = Math.ceil(totalItems / pageSize);

      return {
        success: true,
        data: categories,
        totalItems,
        pageIndex,
        pageSize,
        pageCount,
        message: "Get categories successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: [],
        message: error.message || "Failed to search categories"
      };
    }
  }

  async getCategoryById(categoryId: string) {
    try {
      const category = await this.categoryRepository.getCategoryById(categoryId);
      if (!category) {
        return {
          success: false,
          data: null,
          message: "Category not found"
        };
      }
      return {
        success: true,
        data: category,
        message: "Get category successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        data: null,
        message: error.message || "Failed to get category"
      };
    }
  }
}
