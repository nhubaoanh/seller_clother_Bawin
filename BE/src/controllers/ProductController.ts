import { Request, Response } from "express";
import { Database } from "../config/database.js";

export class ProductController {
  constructor(private db: Database) {}

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageIndex = parseInt(req.query.pageIndex as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 12;
      const search = (req.query.q as string) || "";
      const categoryId = (req.query.categoryId as string) || null;
      const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : null;
      const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : null;
      const sortBy = (req.query.sortBy as string) || "newest";

      const results = await this.db.query("CALL SearchProducts(?, ?, ?, ?, ?, ?, ?)", [
        search,
        categoryId,
        minPrice,
        maxPrice,
        sortBy,
        pageIndex,
        pageSize,
      ]);
      
      const products = results && results.length > 0 ? results[0] : [];
      const totalItems = products.length > 0 ? products[0].RecordCount : 0;

      res.status(200).json({
        success: true,
        data: products,
        totalItems,
        pageCount: Math.ceil(totalItems / pageSize),
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Lỗi server",
        data: [],
      });
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const results = await this.db.query("CALL Proc_GetProductById(?)", [productId]);
      
      if (!results || results[0].length === 0) {
        res.status(404).json({ success: false, message: "Sản phẩm không tồn tại" });
        return;
      }

      const product = results[0][0];
      
      // Get variants
      const variantsResults = await this.db.query("SELECT * FROM productVariants WHERE productId = ? AND activeFlag = 1", [productId]);

      res.status(200).json({
        success: true,
        data: {
          ...product,
          variants: variantsResults
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, productName, categoryId, description, thumbnail, basePrice, stock, images, adminId } = req.body;
      const finalProductId = productId || `PROD${Date.now()}`;
      
      await this.db.query("CALL Proc_Admin_UpsertProduct(?, ?, ?, ?, ?, ?, ?, ?)", [
        finalProductId,
        productName || null,
        categoryId || null,
        description || null,
        thumbnail || null,
        basePrice || 0,
        stock || 0,
        adminId || null
      ]);

      // Xử lý ảnh chi tiết
      if (Array.isArray(images) && images.length > 0) {
        for (const imgUrl of images) {
          const imageId = `IMG${Date.now()}${Math.random().toString(36).substring(7)}`;
          await this.db.query(
            "INSERT INTO productImages (imageId, productId, imageUrl, activeFlag, userCreateId, luUserId, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?, NOW(), NOW())",
            [imageId, finalProductId, imgUrl, adminId || 'admin', adminId || 'admin']
          );
        }
      }

      res.status(201).json({ success: true, message: "Tạo sản phẩm thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const { productName, categoryId, description, thumbnail, basePrice, stock, images, adminId } = req.body;
      
      await this.db.query("CALL Proc_Admin_UpsertProduct(?, ?, ?, ?, ?, ?, ?, ?)", [
        productId || null,
        productName || null,
        categoryId || null,
        description || null,
        thumbnail || null,
        basePrice || 0,
        stock || 0,
        adminId || null
      ]);

      // Xử lý cập nhật ảnh chi tiết
      if (Array.isArray(images)) {
        // 1. Tạm thời ẩn các ảnh cũ (Soft delete)
        await this.db.query("UPDATE productImages SET activeFlag = 0 WHERE productId = ?", [productId]);
        
        // 2. Thêm danh sách ảnh mới
        for (const imgUrl of images) {
          const imageId = `IMG${Date.now()}${Math.random().toString(36).substring(7)}`;
          await this.db.query(
            "INSERT INTO productImages (imageId, productId, imageUrl, activeFlag, userCreateId, luUserId, createdAt, updatedAt) VALUES (?, ?, ?, 1, ?, ?, NOW(), NOW())",
            [imageId, productId, imgUrl, adminId || 'admin', adminId || 'admin']
          );
        }
      }

      res.status(200).json({ success: true, message: "Cập nhật sản phẩm thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const { adminId } = req.body;
      await this.db.query("CALL Proc_Admin_DeleteProduct(?, ?)", [productId, adminId]);
      res.status(200).json({ success: true, message: "Xóa sản phẩm thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductVariants = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId } = req.params;
      const variants = await this.db.query(
        "SELECT * FROM productVariants WHERE productId = ? AND activeFlag = 1",
        [productId]
      );
      res.status(200).json({ success: true, data: variants || [] });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}