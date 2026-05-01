import { Request, Response } from "express";
import { Database } from "../config/database.js";
import jwt from 'jsonwebtoken';

export class UserController {
  constructor(private db: Database) {}

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { search_content, pageIndex, pageSize } = req.body;
      const results = await this.db.query("CALL Proc_SearchUsers(?, ?, ?)", [
        search_content || "",
        pageIndex || 1,
        pageSize || 10
      ]);
      
      const users = results && results.length > 0 ? results[0] : [];
      const totalItems = users.length > 0 ? users[0].RecordCount : 0;

      res.status(200).json({
        success: true,
        data: users,
        totalItems,
        pageCount: Math.ceil(totalItems / (pageSize || 10)),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      const results = await this.db.query('CALL Proc_LoginUser(?)', [username]);
      const users = results && results.length > 0 ? results[0] : [];

      if (!users || users.length === 0) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const user = users[0];
      if (user.password !== password) {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.userId, role: user.role, email: user.email, name: user.fullName },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      // Alias user columns for FE
      const normalizedUser = {
        user_id: user.userId,
        username: user.username,
        full_name: user.fullName,
        email: user.email,
        role_code: user.role,
        role_name: user.role,
        token
      };

      res.json({
        success: true,
        data: normalizedUser,
        message: 'Login successful'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password_hash, full_name, email } = req.body;
      await this.db.query("INSERT INTO users (userId, username, password, fullName, email, role, activeFlag, createdAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())", [
        `USER${Date.now()}`,
        username,
        password_hash,
        full_name || username,
        email || "",
        "USER"
      ]);
      res.status(201).json({ success: true, message: "Đăng ký thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password, full_name, email, role_code } = req.body;
      await this.db.query("INSERT INTO users (userId, username, password, fullName, email, role, activeFlag, createdAt) VALUES (?, ?, ?, ?, ?, ?, 1, NOW())", [
        `USER${Date.now()}`,
        username,
        password,
        full_name,
        email,
        role_code || "USER"
      ]);
      res.status(201).json({ success: true, message: "Tạo người dùng thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, full_name, email, phone, address, role_code } = req.body;
      await this.db.query("UPDATE users SET fullName = ?, email = ?, phone = ?, address = ?, role = ?, updatedAt = NOW() WHERE userId = ?", [
        full_name, email, phone, address, role_code, user_id
      ]);
      res.status(200).json({ success: true, message: "Cập nhật thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { list_json, updated_by_id } = req.body;
      for (const item of list_json) {
        await this.db.query("UPDATE users SET activeFlag = 0, luUserId = ?, updatedAt = NOW() WHERE userId = ?", [
          updated_by_id, item.user_id
        ]);
      }
      res.status(200).json({ success: true, message: "Xóa người dùng thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  checkUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { username } = req.body;
      const results = await this.db.query("SELECT 1 FROM users WHERE username = ?", [username]);
      res.json({ success: true, exists: results.length > 0 });
    } catch (error: any) {
      res.json({ success: false, exists: false });
    }
  };
}
