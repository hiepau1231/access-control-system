import express from 'express';
import { PermissionController } from '../controllers/PermissionController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, PermissionController.getAllPermissions);
router.get('/:id', authenticateToken, PermissionController.getPermissionById);
router.post('/', authenticateToken, PermissionController.createPermission);
router.put('/:id', authenticateToken, PermissionController.updatePermission);
router.delete('/:id', authenticateToken, PermissionController.deletePermission);

router.post('/assign', authenticateToken, PermissionController.assignPermissionToRole);
router.post('/remove', authenticateToken, PermissionController.removePermissionFromRole);
router.get('/role/:roleId', authenticateToken, PermissionController.getPermissionsForRole);

export default router;
