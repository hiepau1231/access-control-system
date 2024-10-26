import express from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();
const userController = new UserController();

// Thêm middleware auth và permission check
router.get('/', 
  authMiddleware,
  checkPermission('read:users'),
  (req, res) => userController.getAllUsers(req, res)
);

router.get('/:id', 
  authMiddleware,
  checkPermission('read:users'),
  (req, res) => userController.getUserById(req, res)
);

router.put('/:id', 
  authMiddleware,
  checkPermission('update:users'),
  (req, res) => userController.updateUser(req, res)
);

router.delete('/:id', 
  authMiddleware,
  checkPermission('delete:users'),
  (req, res) => userController.deleteUser(req, res)
);

export default router;
