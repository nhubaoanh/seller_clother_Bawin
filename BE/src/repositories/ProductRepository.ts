import { injectable } from "tsyringe";
import { Product } from "../models/Product.js";
import { Database } from "../config/database.js";

@injectable()
export class ProductRepository {
  constructor(private db: Database) { }

  async getAllProducts(pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL GetAllProducts(?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [pageIndex, pageSize]);
      console.log(results);

      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getAllProducts] Error:", error.message);
      return [];
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const sql = "CALL GetProductById(?, @err_code, @err_msg)";
      const [results] = await this.db.query(sql, [productId]);

      if (Array.isArray(results) && results.length > 0) {
        return results[0];
      }
      return null;
    } catch (error: any) {
      console.error("❌ [getProductById] Error:", error.message);
      return null;
    }
  }

  async getProductsByCategory(categoryId: string, pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL GetProductsByCategory(?, ?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [categoryId, pageIndex, pageSize]);

      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getProductsByCategory] Error:", error.message);
      return [];
    }
  }

  async createProduct(product: Product): Promise<boolean> {
    try {
      const sql = "CALL CreateProduct(?,?,?,?,?,?,?, @err_code, @err_msg)";
      await this.db.query(sql, [
        product.productId,
        product.productName,
        product.categoryId || null,
        product.description || null,
        product.thumbnail || null,
        product.basePrice || 0,
        product.userCreateId || null
      ]);

      // Check error code
      const [result] = await this.db.query("SELECT @err_code as error_code, @err_msg as error_message");
      const errorInfo = Array.isArray(result) ? result[0] : result;

      if (errorInfo.error_code !== 0) {
        throw new Error(errorInfo.error_message || "Tạo sản phẩm thất bại");
      }

      // Insert product images if provided
      if (product.images && Array.isArray(product.images)) {
        for (const imageUrl of product.images) {
          const imageId = `IMG_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const insertImageSql = "INSERT INTO productImages (imageId, productId, imageUrl, activeFlag, createUserId, luUserId, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?, NOW(), NOW())";
          await this.db.query(insertImageSql, [imageId, product.productId, imageUrl, product.userCreateId || 'admin', product.userCreateId || 'admin']);
        }
      }

      return true;
    } catch (error: any) {
      console.error("❌ [createProduct] Error:", error.message);
      throw new Error(error.message || "Tạo sản phẩm thất bại");
    }
  }

  async updateProduct(product: Product): Promise<boolean> {
    try {
      const sql = "CALL UpdateProduct(?,?,?,?,?,?,?, @err_code, @err_msg)";
      await this.db.query(sql, [
        product.productId,
        product.productName,
        product.categoryId || null,
        product.description || null,
        product.thumbnail || null,
        product.basePrice || 0,
        product.luUserId || null
      ]);

      // Check error code
      const [result] = await this.db.query("SELECT @err_code as error_code, @err_msg as error_message");
      const errorInfo = Array.isArray(result) ? result[0] : result;

      if (errorInfo.error_code !== 0) {
        throw new Error(errorInfo.error_message || "Cập nhật sản phẩm thất bại");
      }

      // Update product images if provided
      if (product.images && Array.isArray(product.images)) {
        // 1. Mark existing images as inactive or delete them
        const deleteSql = "UPDATE productImages SET activeFlag = 0 WHERE productId = ?";
        await this.db.query(deleteSql, [product.productId]);

        // 2. Insert new images
        for (const imageUrl of product.images) {
          const imageId = `IMG_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const insertImageSql = "INSERT INTO productImages (imageId, productId, imageUrl, activeFlag, createUserId, luUserId, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?, NOW(), NOW())";
          // We use luUserId for both if it's an update
          await this.db.query(insertImageSql, [imageId, product.productId, imageUrl, product.luUserId || 'admin', product.luUserId || 'admin']);
        }
      }

      return true;
    } catch (error: any) {
      console.error("❌ [updateProduct] Error:", error.message);
      throw new Error(error.message || "Cập nhật sản phẩm thất bại");
    }
  }

  async deleteProduct(productId: string, deletedBy: string): Promise<boolean> {
    try {
      const sql = "CALL DeleteProduct(?, ?, @err_code, @err_msg)";
      await this.db.query(sql, [productId, deletedBy]);
      return true;
    } catch (error: any) {
      console.error("❌ [deleteProduct] Error:", error.message);
      throw new Error(error.message || "Xóa sản phẩm thất bại");
    }
  }

  async searchProducts(searchTerm: string, categoryId?: string, pageIndex: number = 1, pageSize: number = 10): Promise<any[]> {
    try {
      const sql = "CALL SearchProducts(?, ?, ?, ?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [
        searchTerm || null,
        categoryId || null,
        pageIndex,
        pageSize
      ]);

      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [searchProducts] Error:", error.message);
      return [];
    }
  }

  async getProductVariants(productId: string): Promise<any[]> {
    try {
      const sql = "CALL GetProductVariants(?, @err_code, @err_msg)";
      const results = await this.db.query(sql, [productId]);

      if (Array.isArray(results) && results.length > 0) {
        return Array.isArray(results[0]) ? results[0] : results;
      }
      return [];
    } catch (error: any) {
      console.error("❌ [getProductVariants] Error:", error.message);
      return [];
    }
  }
}
