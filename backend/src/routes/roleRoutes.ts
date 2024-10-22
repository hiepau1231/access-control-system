import express from 'express';
import { RoleController } from '../controllers/RoleController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, RoleController.getAllRoles);
router.get('/:id', authenticateToken, RoleController.getRoleById);
router.post('/', authenticateToken, RoleController.createRole);
router.put('/:id', authenticateToken, RoleController.updateRole);
router.delete('/:id', authenticateToken, RoleController.deleteRole);

export default router;
