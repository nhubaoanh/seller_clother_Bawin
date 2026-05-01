import { Router } from 'express';
import { RoleController } from '../controllers/RoleController.js';
import { Database } from '../config/database.js';

const router = Router();
const db = new Database();
const roleController = new RoleController(db);

router.post('/search', roleController.searchRoles);

export default router;
