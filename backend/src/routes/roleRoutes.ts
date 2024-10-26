import express from 'express';
import { RoleController } from '../controllers/RoleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { checkPermission } from '../middleware/checkPermission';

const router = express.Router();
const roleController = new RoleController();

router.get('/', 
  authMiddleware,
  checkPermission('read:roles'),
  (req, res) => roleController.getAllRoles(req, res)
);

router.get('/:id', 
  authMiddleware,
  checkPermission('read:roles'),
  (req, res) => roleController.getRoleById(req, res)
);

router.post('/', 
  authMiddleware,
  checkPermission('create:roles'),
  (req, res) => roleController.createRole(req, res)
);

router.get('/:id/permissions', 
  authMiddleware,
  checkPermission('read:roles'),
  (req, res) => roleController.getRolePermissions(req, res)
);

export default router;
