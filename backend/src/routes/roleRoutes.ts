import express from 'express';
import { RoleController } from '../controllers/RoleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission, checkMultiplePermissions } from '../middleware/checkPermission';

const router = express.Router();
const roleController = new RoleController();

// Routes for role hierarchy phải đặt trước các routes có params
router.get('/hierarchy', authMiddleware, (req, res) => roleController.getRoleHierarchy(req, res));
router.post('/hierarchy', authMiddleware, checkPermission('update:roles'), (req, res) => roleController.addRoleHierarchy(req, res));

// Các routes khác
router.get('/', authMiddleware, checkPermission('read:roles'), (req, res) => roleController.getAllRoles(req, res));
router.get('/:id', authMiddleware, checkPermission('read:roles'), (req, res) => roleController.getRoleById(req, res));
router.post('/', authMiddleware, checkPermission('create:roles'), (req, res) => roleController.createRole(req, res));
router.get('/:id/permissions', authMiddleware, checkPermission('read:roles'), (req, res) => roleController.getRolePermissions(req, res));
// Sửa lại permission name cho route DELETE
router.delete('/:id', authMiddleware, checkPermission('delete:roles'), (req, res) => roleController.deleteRole(req, res));

export default router;