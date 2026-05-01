import { Request, Response } from "express";
import { Database } from "../config/database.js";

export class RoleController {
  constructor(private db: Database) {}

  searchRoles = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        data: [
          { role_id: "ADMIN", role_code: "ADMIN", role_name: "Quản trị viên" },
          { role_id: "USER", role_code: "USER", role_name: "Người dùng" },
          { role_id: "STAFF", role_code: "STAFF", role_name: "Nhân viên" }
        ]
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
