import { Request, Response } from "express";
import { Database } from "../config/database.js";

export class InventoryController {
  constructor(private db: Database) {}

  // 1. Nhập hàng mới
  addImport = async (req: Request, res: Response): Promise<void> => {
    try {
      const { variantId, quantity, purchasePrice, supplier, notes, adminId } = req.body;
      const importId = `IMP${Date.now()}`;

      await this.db.query('CALL Proc_Admin_AddImportStock(?, ?, ?, ?, ?, ?, ?)', [
        importId,
        variantId,
        quantity,
        purchasePrice,
        supplier || null,
        notes || null,
        adminId || 'admin'
      ]);

      res.status(201).json({ success: true, message: 'Nhập hàng thành công' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // 2. Lấy lịch sử nhập hàng
  getImportHistory = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageIndex = parseInt(req.query.pageIndex as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const search = (req.query.q as string) || "";

      const results = await this.db.query('CALL Proc_Admin_GetImportHistory(?, ?, ?)', [
        search,
        pageIndex,
        pageSize
      ]);

      const imports = results && results.length > 0 ? results[0] : [];
      const totalItems = imports.length > 0 ? imports[0].RecordCount : 0;

      res.json({
        success: true,
        data: imports,
        totalItems,
        pageCount: Math.ceil(totalItems / pageSize)
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };

  // 3. Báo cáo tồn kho (Nhập - Xuất - Tồn)
  getStockReport = async (req: Request, res: Response): Promise<void> => {
    try {
      const results = await this.db.query('CALL Proc_Admin_GetStockReport()');
      const report = results && results.length > 0 ? results[0] : [];
      res.json({ success: true, data: report });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
}
