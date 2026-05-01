import { injectable } from "tsyringe";
import { Database } from "../config/database.js";

@injectable()
export class CategoryRepository {
  constructor(private db: Database) { }

  async getAllCategories(pageIndex: number = 1, pageSize: number = 100, search: string = ""): Promise<any[]> {
    try {
      let sql = `
        SELECT 
          categoryId,
          categoryName,
          description,
          activeFlag,
          createdAt,
          updatedAt
        FROM categories 
        WHERE activeFlag = 1
      `;
      
      const params: any[] = [];
      
      if (search) {
        sql += ` AND (categoryName LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      
      sql += ` ORDER BY categoryName`;
      
      if (pageSize > 0) {
        sql += ` LIMIT ? OFFSET ?`;
        params.push(pageSize, (pageIndex - 1) * pageSize);
      }
      
      const categories = await this.db.query(sql, params);
      return Array.isArray(categories) ? categories : [];
    } catch (error: any) {
      console.error("❌ [CategoryRepository.getAllCategories] Error:", error.message);
      return [];
    }
  }

  async getTotalCount(search: string = ""): Promise<number> {
    try {
      let sql = `SELECT COUNT(*) as total FROM categories WHERE activeFlag = 1`;
      const params: any[] = [];
      
      if (search) {
        sql += ` AND (categoryName LIKE ? OR description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }
      
      const result = await this.db.query(sql, params);
      return result[0]?.total || 0;
    } catch (error: any) {
      console.error("❌ [CategoryRepository.getTotalCount] Error:", error.message);
      return 0;
    }
  }

  async getCategoryById(categoryId: string): Promise<any | null> {
    try {
      const sql = `
        SELECT * FROM categories 
        WHERE categoryId = ? AND activeFlag = 1
      `;
      const results = await this.db.query(sql, [categoryId]);
      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error: any) {
      console.error("❌ [CategoryRepository.getCategoryById] Error:", error.message);
      return null;
    }
  }
}
