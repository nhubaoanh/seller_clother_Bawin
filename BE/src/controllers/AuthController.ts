import { Request, Response } from 'express';
import { Database } from '../config/database.js';
import jwt from 'jsonwebtoken';

export class AuthController {
  constructor(private db: Database) {}

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required' });
        return;
      }

      const results = await this.db.query('CALL Proc_LoginUser(?)', [email]);
      const users = results && results.length > 0 ? results[0] : [];

      if (!users || users.length === 0) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const user = users[0];
      if (user.password !== password) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.userId, role: user.role, email: user.email, name: user.fullName },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '30d' }
      );

      res.json({
        success: true,
        data: {
          id: user.userId,
          email: user.email,
          name: user.fullName,
          role: user.role,
          token
        },
        message: 'Login successful'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };

  me = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const results = await this.db.query('CALL Proc_GetUser(?)', [userId]);
      const users = results && results.length > 0 ? results[0] : [];

      if (!users || users.length === 0) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const user = users[0];
      res.json({
        success: true,
        data: {
          id: user.userId,
          email: user.email,
          name: user.fullName,
          phone: user.phone,
          address: user.address,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Me error:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
}
