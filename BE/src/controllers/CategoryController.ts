import { Request, Response } from "express";
import { Database } from "../config/database.js";

export class CategoryController {
  constructor(private db: Database) {}

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageIndex = parseInt(req.query.pageIndex as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 100;
      const search = (req.query.search as string) || "";
      
      const results = await this.db.query("CALL Proc_SearchCategories(?, ?, ?)", [
        search,
        pageIndex,
        pageSize
      ]);
      
      const categories = results && results.length > 0 ? results[0] : [];
      const totalItems = categories.length > 0 ? categories[0].RecordCount : 0;

      res.status(200).json({
        success: true,
        data: categories,
        totalItems,
        pageCount: Math.ceil(totalItems / pageSize)
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get categories",
      });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    return this.upsertCategory(req, res);
  };

  upsertCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId, categoryName, description, adminId } = req.body;
      await this.db.query("CALL Proc_Admin_UpsertCategory(?, ?, ?, ?)", [
        categoryId || `CAT${Date.now()}`,
        categoryName,
        description,
        adminId
      ]);
      res.status(200).json({ success: true, message: "Thao tác danh mục thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.params;
      const { adminId } = req.body;
      await this.db.query("CALL Proc_Admin_DeleteCategory(?, ?)", [categoryId, adminId]);
      res.status(200).json({ success: true, message: "Xóa danh mục thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}