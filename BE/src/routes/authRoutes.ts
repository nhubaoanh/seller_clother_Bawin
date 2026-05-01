import { Router } from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { Database } from '../config/database.js';

const router = Router();
const db = new Database();
const authController = new AuthController(db);

router.post('/login', authController.login);
router.get('/me', authController.me);

export default router;
