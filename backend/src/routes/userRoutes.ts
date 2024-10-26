import express from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const userController = new UserController();

// Tạm thời bỏ checkPermission
router.get('/', authMiddleware, (req, res) => userController.getAllUsers(req, res));
router.get('/:id', authMiddleware, (req, res) => userController.getUserById(req, res));
router.post('/', authMiddleware, (req, res) => userController.createUser(req, res));
router.put('/:id', authMiddleware, (req, res) => userController.updateUser(req, res));
router.delete('/:id', authMiddleware, (req, res) => userController.deleteUser(req, res));

export default router;
