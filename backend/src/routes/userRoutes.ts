import express from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();
const userController = new UserController();

// User thường chỉ có thể xem danh sách và cập nhật thông tin của chính mình
router.get('/', authMiddleware, checkPermission('read:basic'), (req, res) => userController.getAllUsers(req, res));

// Các route khác yêu cầu quyền admin
router.get('/:id', authMiddleware, checkPermission('read:users'), (req, res) => userController.getUserById(req, res));
router.post('/', authMiddleware, checkPermission('create:users'), (req, res) => userController.createUser(req, res));

// Thêm middleware kiểm tra xem user có đang cập nhật chính mình không
router.put('/:id', authMiddleware, async (req, res, next) => {
  // Nếu user có quyền update:users (admin) hoặc đang update chính mình (user thường)
  if (req.user?.id === req.params.id) {
    // User đang update chính mình
    return checkPermission('update:own')(req, res, next);
  } else {
    // User đang update người khác
    return checkPermission('update:users')(req, res, next);
  }
}, (req, res) => userController.updateUser(req, res));

router.delete('/:id', authMiddleware, checkPermission('delete:users'), (req, res) => userController.deleteUser(req, res));

export default router;
