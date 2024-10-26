import express from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const permissionController = new PermissionController();

// Tạm thời bỏ checkPermission để test
router.get('/', authMiddleware, (req, res) => permissionController.getAllPermissions(req, res));
router.get('/:id', authMiddleware, (req, res) => permissionController.getPermissionById(req, res));
router.post('/', authMiddleware, (req, res) => permissionController.createPermission(req, res));
router.put('/:id', authMiddleware, (req, res) => permissionController.updatePermission(req, res));
router.delete('/:id', authMiddleware, (req, res) => permissionController.deletePermission(req, res));

export default router;
