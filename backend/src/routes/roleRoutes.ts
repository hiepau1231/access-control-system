import express from 'express';
import { RoleController } from '../controllers/RoleController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const roleController = new RoleController();

// Routes for role hierarchy phải đặt trước các routes có params
router.get('/hierarchy', authMiddleware, (req, res) => roleController.getRoleHierarchy(req, res));
router.post('/hierarchy', authMiddleware, (req, res) => roleController.addRoleHierarchy(req, res));

// Các routes khác
router.get('/', authMiddleware, (req, res) => roleController.getAllRoles(req, res));
router.get('/:id', authMiddleware, (req, res) => roleController.getRoleById(req, res));
router.post('/', authMiddleware, (req, res) => roleController.createRole(req, res));
router.get('/:id/permissions', authMiddleware, (req, res) => roleController.getRolePermissions(req, res));

export default router;
