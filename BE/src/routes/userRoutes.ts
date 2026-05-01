import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { Database } from '../config/database.js';

const router = Router();
const db = new Database();
const userController = new UserController(db);

router.post('/search', userController.searchUsers);
router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/create', userController.createUser);
router.post('/update', userController.updateUser);
router.post('/delete', userController.deleteUser);
router.post('/checkuser', userController.checkUser);

export default router;
