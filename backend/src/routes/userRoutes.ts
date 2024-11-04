import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// Routes
router.get('/', authMiddleware, userController.getAllUsers);
router.post('/', authMiddleware, userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.post('/verify-password', userController.verifyPassword);

export default router;
