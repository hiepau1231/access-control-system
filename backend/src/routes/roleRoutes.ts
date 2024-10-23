import express from 'express';
import * as RoleController from '../controllers/RoleController';

const router = express.Router();

router.get('/', RoleController.getRoles);
router.get('/:id', RoleController.getRoleById);
router.post('/', RoleController.createRole);
router.put('/:id', RoleController.updateRole);
router.delete('/:id', RoleController.deleteRole);

export default router;
